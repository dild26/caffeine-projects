import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface YamlConfig {
  app: {
    name: string;
    version: string;
    description: string;
    owner: string;
    pin: string;
    language: string;
  };
  security: {
    rbac: {
      enabled: boolean;
      roles: Array<{
        name: string;
        permissions: string[];
      }>;
    };
    restricted_routes: Array<{
      path: string;
      roles: string[];
      hidden_from_public: boolean;
    }>;
  };
  features: {
    validation: {
      dual_system: boolean;
      ai_auto_check: boolean;
      admin_manual_check: boolean;
    };
    payment_integration: {
      enabled: boolean;
      provider: string;
    };
  };
  operations: {
    yaml_validation: {
      enabled: boolean;
      strict_mode: boolean;
    };
    feature_flags: {
      enabled: boolean;
      source: string;
    };
    rbac_enforcement: {
      enabled: boolean;
      source: string;
    };
  };
}

export function useYamlConfig() {
  const [config, setConfig] = useState<YamlConfig | null>(null);

  useEffect(() => {
    const handleConfigUpdate = (event: CustomEvent) => {
      try {
        // Parse YAML content (simplified - in production use a proper YAML parser)
        const yamlContent = event.detail.config;
        // For now, we'll use localStorage to store parsed config
        const storedConfig = localStorage.getItem('moap_parsed_config');
        if (storedConfig) {
          setConfig(JSON.parse(storedConfig));
        }
      } catch (error) {
        console.error('Failed to parse YAML config:', error);
      }
    };

    window.addEventListener('yaml-config-updated', handleConfigUpdate as EventListener);
    
    // Load initial config
    const storedConfig = localStorage.getItem('moap_parsed_config');
    if (storedConfig) {
      setConfig(JSON.parse(storedConfig));
    }

    return () => {
      window.removeEventListener('yaml-config-updated', handleConfigUpdate as EventListener);
    };
  }, []);

  return useQuery<YamlConfig | null>({
    queryKey: ['yamlConfig'],
    queryFn: async () => {
      const storedYaml = localStorage.getItem('moap_spec_yaml');
      if (!storedYaml) return null;

      // Simplified YAML parsing - extract key configuration
      const parsedConfig: YamlConfig = {
        app: {
          name: 'MOAP',
          version: '1.0.0',
          description: 'Mother Of All Platforms',
          owner: 'SECOINFI / Sudha Enterprises',
          pin: '560097',
          language: 'en'
        },
        security: {
          rbac: {
            enabled: storedYaml.includes('rbac:') && storedYaml.includes('enabled: true'),
            roles: [
              { name: 'admin', permissions: ['read', 'write', 'delete', 'manage'] },
              { name: 'user', permissions: ['read', 'write'] },
              { name: 'guest', permissions: ['read'] }
            ]
          },
          restricted_routes: [
            { path: '/secure', roles: ['admin'], hidden_from_public: true },
            { path: '/features', roles: ['admin', 'user'], hidden_from_public: true },
            { path: '/admin', roles: ['admin'], hidden_from_public: true },
            { path: '/vault', roles: ['admin'], hidden_from_public: true },
            { path: '/secoinfi', roles: ['admin'], hidden_from_public: true }
          ]
        },
        features: {
          validation: {
            dual_system: true,
            ai_auto_check: true,
            admin_manual_check: true
          },
          payment_integration: {
            enabled: true,
            provider: 'PayPal'
          }
        },
        operations: {
          yaml_validation: {
            enabled: true,
            strict_mode: true
          },
          feature_flags: {
            enabled: true,
            source: 'yaml'
          },
          rbac_enforcement: {
            enabled: true,
            source: 'yaml'
          }
        }
      };

      localStorage.setItem('moap_parsed_config', JSON.stringify(parsedConfig));
      return parsedConfig;
    },
    staleTime: Infinity,
  });
}

export function useFeatureFlags() {
  const { data: config } = useYamlConfig();

  return {
    isFeatureEnabled: (feature: string): boolean => {
      if (!config?.operations.feature_flags.enabled) return true;
      
      // Check specific features from YAML config
      switch (feature) {
        case 'payment_integration':
          return config.features.payment_integration.enabled;
        case 'dual_validation':
          return config.features.validation.dual_system;
        case 'ai_auto_check':
          return config.features.validation.ai_auto_check;
        default:
          return true;
      }
    },
    config
  };
}

export function useRbacConfig() {
  const { data: config } = useYamlConfig();

  return {
    isRbacEnabled: config?.security.rbac.enabled ?? true,
    roles: config?.security.rbac.roles ?? [],
    restrictedRoutes: config?.security.restricted_routes ?? [],
    hasAccess: (userRole: string, path: string): boolean => {
      if (!config?.operations.rbac_enforcement.enabled) return true;
      
      const route = config.security.restricted_routes.find(r => r.path === path);
      if (!route) return true;
      
      return route.roles.includes(userRole);
    }
  };
}
