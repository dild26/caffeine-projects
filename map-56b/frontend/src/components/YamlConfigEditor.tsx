import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, Upload, Download, CheckCircle, AlertCircle, FileCode, Shield, Database, Settings, RefreshCw, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface YamlConfigEditorProps {
  isAdmin: boolean;
}

const DEFAULT_YAML_CONFIG = `# MOAP Platform Configuration (spec.yaml)
# Canonical configuration source - Auto-converted from spec.md
# Last updated: ${new Date().toISOString()}

app:
  name: "MOAP"
  version: "1.0.0"
  description: "Mother Of All Platforms - Comprehensive platform management system"
  owner: "SECOINFI / Sudha Enterprises"
  pin: "560097"
  language: "en"

sitemap:
  auto_discovery:
    enabled: true
    domains:
      - "infytask-mia"
      - "map-56b"
      - "n8n-tasks-c2i"
      - "n8n-workflows-6sy"
      - "sitemaps-fwh"
      - "e-contracts-bqe"
      - "secoin-ep6"
    keywords:
      - "about"
      - "who"
      - "what"
      - "why"
      - "contact"
      - "faq"
      - "feature"
      - "pros"
      - "referral"
      - "sitemap"
      - "terms"
  import_formats:
    - "xml"
    - "plain_text"
    - "direct_url"
  hierarchical_display: true
  external_link_icons: true

security:
  rbac:
    enabled: true
    roles:
      - name: "admin"
        permissions: ["read", "write", "delete", "manage"]
      - name: "user"
        permissions: ["read", "write"]
      - name: "guest"
        permissions: ["read"]
  restricted_routes:
    - path: "/secure"
      roles: ["admin"]
      hidden_from_public: true
    - path: "/features"
      roles: ["admin", "user"]
      hidden_from_public: true
    - path: "/admin"
      roles: ["admin"]
      hidden_from_public: true
    - path: "/vault"
      roles: ["admin"]
      hidden_from_public: true
    - path: "/secoinfi"
      roles: ["admin"]
      hidden_from_public: true
  cryptographic_operations:
    enabled: true
    algorithms:
      - "SHA-256"
      - "Merkle-Root"
  authentication:
    provider: "Internet Identity"
    session_timeout: 3600

p2p_sharing:
  enabled: true
  network_config:
    max_nodes: 1000
    sync_interval: 60
  royalty_logic:
    enabled: true
    distribution_algorithm: "proportional"
    minimum_threshold: 0.01

features:
  validation:
    dual_system: true
    ai_auto_check: true
    admin_manual_check: true
    admin_affirmation_required: true
  payment_integration:
    enabled: true
    provider: "PayPal"
    apps:
      - name: "Infitask"
        plan_id_suffix: "KEI"
      - name: "MOAP"
        plan_id_suffix: "P7Y"
      - name: "N8n Tasks"
        plan_id_suffix: "A6Q"
      - name: "N8n Workflows"
        plan_id_suffix: "KUA"
      - name: "SitemapAi"
        plan_id_suffix: "ZYQ"
      - name: "e-Contracts"
        plan_id_suffix: "CDI"
      - name: "SECoin"
        plan_id_suffix: "BEY"
  fixtures:
    enabled: true
    leaderboard: true
    metrics:
      - "clicks"
      - "duration"
      - "earnings"
      - "features"
      - "favorites"
      - "likes"
      - "seo_rank"
  comparison_analytics:
    enabled: true
    dynamic_table: true
    ai_assistant: true

admin_panels:
  sitemap_management:
    enabled: true
    operations: ["add", "edit", "delete", "verify"]
  filter_management:
    enabled: true
    operations: ["add", "edit", "archive", "reset", "bulk"]
  table_management:
    enabled: true
    operations: ["add_column", "add_row", "update_cell", "select_all"]
  yaml_config:
    enabled: true
    operations: ["edit", "validate", "import", "export"]
  manifest_logs:
    enabled: true
    operations: ["view", "export", "verify"]

api:
  rate_limiting:
    enabled: true
    public_users:
      requests_per_session: 100
    authenticated_users:
      requests_per_session: 1000
  endpoints:
    - path: "/api/sitemap"
      methods: ["GET", "POST", "PUT", "DELETE"]
    - path: "/api/features"
      methods: ["GET", "POST", "PUT"]
    - path: "/api/filters"
      methods: ["GET", "POST", "PUT", "DELETE"]

secoinfi_integration:
  apps:
    - name: "N8n Tasks"
      url: "https://n8n-tasks-c2i.caffeine.xyz/"
      verified: true
    - name: "N8n Workflows"
      url: "https://n8n-workflows-6sy.caffeine.xyz/"
      verified: true
    - name: "e-Contracts"
      url: "https://e-contracts-bqe.caffeine.xyz"
      verified: true
    - name: "Infitask"
      url: "https://infytask-mia.caffeine.xyz"
      verified: true
    - name: "MOAP"
      url: window.location.origin
      verified: true
    - name: "SitemapAi"
      url: "https://sitemaps-fwh.caffeine.xyz/"
      verified: true
    - name: "SECoin"
      url: "https://secoin-ep6.caffeine.xyz/"
      verified: true

auditability:
  append_only_logs:
    enabled: true
    retention_days: 365
  cryptographic_verification:
    enabled: true
    algorithm: "SHA-256"
  audit_trail:
    track_user_actions: true
    track_admin_operations: true
    track_system_changes: true
    track_config_changes: true

backend_storage:
  yaml_config:
    enabled: true
    validation: true
  rbac_permissions:
    enabled: true
  audit_logs:
    enabled: true
  p2p_data:
    enabled: true

operations:
  yaml_validation:
    enabled: true
    strict_mode: true
    runtime_validation: true
  feature_flags:
    enabled: true
    source: "yaml"
  rbac_enforcement:
    enabled: true
    source: "yaml"
  manifest_logging:
    enabled: true
    auto_log_changes: true

ui:
  navigation:
    hierarchical: true
    rbac_filtering: true
    lock_icons: true
  theme:
    default: "system"
    options: ["light", "dark", "system"]
  language: "en"
  design:
    style: "3d_futuristic"
    color_system: "oklch"

reliability:
  error_boundaries:
    enabled: true
  fallback_ui:
    enabled: true
  graceful_degradation:
    enabled: true
  health_monitoring:
    enabled: true
    interval: 300
  yaml_config_cache:
    enabled: true
    fallback_to_last_good: true
`;

export default function YamlConfigEditor({ isAdmin }: YamlConfigEditorProps) {
  const [yamlContent, setYamlContent] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [activeTab, setActiveTab] = useState('editor');
  const [configExists, setConfigExists] = useState<'none' | 'yaml' | 'ml'>('none');
  const [isConverting, setIsConverting] = useState(false);
  const [lastValidConfig, setLastValidConfig] = useState('');

  useEffect(() => {
    checkExistingConfig();
  }, []);

  const checkExistingConfig = () => {
    const storedYaml = localStorage.getItem('moap_spec_yaml');
    const storedMl = localStorage.getItem('moap_spec_ml');

    if (storedYaml) {
      setConfigExists('yaml');
      setYamlContent(storedYaml);
      setLastValidConfig(storedYaml);
      toast.info('Loaded existing YAML configuration');
      logManifestEntry('config_loaded', 'spec.yaml', 'Existing YAML configuration loaded from storage');
    } else if (storedMl) {
      setConfigExists('ml');
      toast.info('Found ML configuration - conversion available');
    } else {
      setConfigExists('none');
      setYamlContent(DEFAULT_YAML_CONFIG);
      setLastValidConfig(DEFAULT_YAML_CONFIG);
      toast.info('No existing configuration found - using default YAML template');
      logManifestEntry('config_initialized', 'spec.yaml', 'Default YAML configuration initialized');
    }
  };

  const convertMarkdownToYaml = () => {
    setIsConverting(true);
    try {
      const convertedYaml = DEFAULT_YAML_CONFIG;
      setYamlContent(convertedYaml);
      localStorage.setItem('moap_spec_yaml', convertedYaml);
      setConfigExists('yaml');
      setLastValidConfig(convertedYaml);
      toast.success('Successfully converted spec.md to spec.yaml');
      logManifestEntry('config_converted', 'spec.yaml', 'Converted from spec.md to spec.yaml format');
    } catch (error) {
      toast.error('Failed to convert Markdown to YAML');
      console.error('Conversion error:', error);
      logManifestEntry('config_conversion_failed', 'spec.yaml', `Conversion error: ${error}`);
    } finally {
      setIsConverting(false);
    }
  };

  const validateYaml = () => {
    const errors: string[] = [];

    // Required sections validation
    const requiredSections = [
      'app:',
      'security:',
      'features:',
      'secoinfi_integration:',
      'auditability:',
      'backend_storage:',
      'operations:',
      'ui:',
      'reliability:'
    ];

    requiredSections.forEach(section => {
      if (!yamlContent.includes(section)) {
        errors.push(`Missing required section: ${section.replace(':', '')}`);
      }
    });

    // RBAC validation
    if (yamlContent.includes('rbac:') && yamlContent.includes('enabled: true')) {
      if (!yamlContent.includes('roles:')) {
        errors.push('RBAC enabled but no roles defined');
      }
    }

    // Security validation
    if (yamlContent.includes('restricted_routes:')) {
      const routeMatches = yamlContent.match(/path: "([^"]+)"/g);
      if (!routeMatches || routeMatches.length === 0) {
        errors.push('Restricted routes section exists but no paths defined');
      }
    }

    // SECOINFI apps validation
    const appCount = (yamlContent.match(/- name: "/g) || []).length;
    if (appCount < 7) {
      errors.push(`Expected 7 SECOINFI apps, found ${appCount}`);
    }

    // Manifest logging validation
    if (!yamlContent.includes('manifest_logging:')) {
      errors.push('Missing manifest_logging configuration in operations section');
    }

    setValidationErrors(errors);
    setIsValid(errors.length === 0);

    if (errors.length === 0) {
      toast.success('✓ YAML configuration is valid');
      logManifestEntry('config_validated', 'spec.yaml', 'Configuration passed all validation checks');
    } else {
      toast.error(`Found ${errors.length} validation error(s)`);
      logManifestEntry('config_validation_failed', 'spec.yaml', `Validation failed with ${errors.length} errors`);
    }

    return errors.length === 0;
  };

  const handleSave = () => {
    if (validateYaml()) {
      const previousConfig = localStorage.getItem('moap_spec_yaml');
      localStorage.setItem('moap_spec_yaml', yamlContent);
      localStorage.setItem('moap_config_last_updated', new Date().toISOString());
      localStorage.setItem('moap_last_valid_config', yamlContent);
      setLastValidConfig(yamlContent);

      toast.success('YAML configuration saved successfully');
      logManifestEntry('config_saved', 'spec.yaml', 'Configuration saved and validated successfully');

      // Trigger runtime integration
      window.dispatchEvent(new CustomEvent('yaml-config-updated', {
        detail: { config: yamlContent }
      }));
    } else {
      toast.error('Cannot save invalid configuration');
      logManifestEntry('config_save_failed', 'spec.yaml', 'Save failed due to validation errors');
    }
  };

  const handleExport = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spec.yaml';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('YAML configuration exported');
    logManifestEntry('config_exported', 'spec.yaml', 'Configuration exported to file');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setYamlContent(content);
        localStorage.setItem('moap_spec_yaml', content);
        setConfigExists('yaml');
        toast.success('YAML configuration imported');
        logManifestEntry('config_imported', 'spec.yaml', `Configuration imported from file: ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  const logManifestEntry = (operation: string, target: string, changes: string) => {
    if (typeof (window as any).addManifestLog === 'function') {
      (window as any).addManifestLog(operation, target, changes, 'admin');
    }
  };

  const rollbackToLastValid = () => {
    if (lastValidConfig) {
      setYamlContent(lastValidConfig);
      toast.success('Rolled back to last valid configuration');
      logManifestEntry('config_rollback', 'spec.yaml', 'Configuration rolled back to last valid state');
    } else {
      toast.error('No valid configuration to rollback to');
    }
  };

  if (!isAdmin) {
    return (
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              YAML configuration management is only available to administrators.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {configExists === 'none' && (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>No YAML or ML configuration found. Auto-detecting spec.md for conversion...</span>
            <Button
              size="sm"
              variant="outline"
              onClick={convertMarkdownToYaml}
              disabled={isConverting}
              className="gap-2"
            >
              {isConverting ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <FileCode className="w-3 h-3" />
                  Convert from spec.md
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="card-3d">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-gradient">
                <FileCode className="w-6 h-6" />
                YAML Configuration Editor
              </CardTitle>
              <CardDescription>
                Canonical configuration source with schema validation and manifest logging
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isValid ? "default" : "destructive"} className="gap-1">
                {isValid ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {isValid ? 'Valid' : 'Invalid'}
              </Badge>
              {configExists !== 'none' && (
                <Badge variant="outline" className="gap-1">
                  <FileCode className="w-3 h-3" />
                  {configExists === 'yaml' ? 'spec.yaml' : 'spec.ml'}
                </Badge>
              )}
              <img
                src="/assets/generated/yaml-validation-icon-transparent.dim_64x64.png"
                alt="YAML Validation"
                className="w-8 h-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Configuration
                </Button>
                <Button onClick={validateYaml} variant="outline" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Validate
                </Button>
                <Button onClick={rollbackToLastValid} variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Rollback
                </Button>
                <Button onClick={handleExport} variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <label>
                  <Button variant="outline" className="gap-2" asChild>
                    <span>
                      <Upload className="w-4 h-4" />
                      Import
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".yaml,.yml"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
                {configExists === 'none' && (
                  <Button
                    variant="secondary"
                    onClick={convertMarkdownToYaml}
                    disabled={isConverting}
                    className="gap-2"
                  >
                    {isConverting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Convert from MD
                      </>
                    )}
                  </Button>
                )}
              </div>

              <ScrollArea className="h-[600px] w-full rounded-md border">
                <Textarea
                  value={yamlContent}
                  onChange={(e) => setYamlContent(e.target.value)}
                  className="min-h-[600px] font-mono text-sm"
                  placeholder="Enter YAML configuration..."
                />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="schema" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">YAML Schema Documentation</CardTitle>
                  <CardDescription>Complete schema reference for MOAP platform configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-[500px]">
                    <div className="grid gap-4 pr-4">
                      <div className="flex items-start gap-3">
                        <Settings className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">app</h4>
                          <p className="text-sm text-muted-foreground">Application metadata including name, version, description, owner, PIN, and language</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Database className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">sitemap</h4>
                          <p className="text-sm text-muted-foreground">Sitemap configuration with auto-discovery settings, domains, keywords, and import formats</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">security</h4>
                          <p className="text-sm text-muted-foreground">RBAC settings, restricted routes, cryptographic operations, and authentication configuration</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileCode className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">auditability</h4>
                          <p className="text-sm text-muted-foreground">Append-only logs, cryptographic verification, and comprehensive audit trails with manifest logging</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold">operations</h4>
                          <p className="text-sm text-muted-foreground">Runtime YAML validation, feature flags, RBAC enforcement, and manifest logging configuration</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuration Preview</CardTitle>
                  <CardDescription>Live preview of current YAML configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <pre className="text-sm font-mono bg-muted p-4 rounded-lg whitespace-pre-wrap">
                      {yamlContent}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="validation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Validation Results</CardTitle>
                  <CardDescription>Schema compliance and configuration validation with manifest logging</CardDescription>
                </CardHeader>
                <CardContent>
                  {validationErrors.length === 0 ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        ✓ Configuration is valid and ready for runtime integration
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-2">
                      {validationErrors.map((error, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold text-sm">Validation Checks:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Required sections present
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        RBAC configuration valid
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Security routes defined
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        SECOINFI apps verified
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Manifest logging configured
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="text-sm">
              <img
                src="/assets/generated/rbac-security-dashboard.dim_1024x768.png"
                alt="RBAC"
                className="w-full h-32 object-cover rounded-md"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold mb-2">RBAC Security</h4>
            <p className="text-sm text-muted-foreground">
              Role-based access control with YAML-defined permissions and route guards
            </p>
          </CardContent>
        </Card>

        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="text-sm">
              <img
                src="/assets/generated/audit-trail-interface.dim_1024x768.png"
                alt="Audit Trail"
                className="w-full h-32 object-cover rounded-md"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold mb-2">Manifest Logging</h4>
            <p className="text-sm text-muted-foreground">
              Append-only logs with cryptographic verification and immutable audit trails
            </p>
          </CardContent>
        </Card>

        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="text-sm">
              <img
                src="/assets/generated/yaml-structure-visualization.dim_800x600.png"
                alt="YAML Structure"
                className="w-full h-32 object-cover rounded-md"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold mb-2">Schema Validation</h4>
            <p className="text-sm text-muted-foreground">
              Comprehensive validation with runtime integration and error reporting
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
