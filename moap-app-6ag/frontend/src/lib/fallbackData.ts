import type { App } from '../backend';
import { parseYAML } from './yamlParser';

export interface SecoinfiApp {
  name: string;
  key: string;
  url: string;
  description: string;
}

export interface FallbackSpec {
  version?: number;
  appsRegistry: App[];
  secoinfiApps?: SecoinfiApp[];
  sitemap?: {
    sections: any[];
  };
  features?: any[];
  leaderboards?: {
    rankings: any[];
  };
  overviewCards?: {
    cards: any[];
  };
  versions?: {
    versionHistory: any[];
  };
  migrations?: {
    migrationHistory: any[];
  };
  schemaVersion?: number;
  specVersion?: number;
  generatedAt?: number;
}

export interface SpecJson extends FallbackSpec {
  broadcast?: any;
  rank?: any;
  runtimeGuards?: any;
  policies?: any;
  incentives?: any;
  tenant?: any;
  specAuthority?: string;
  mutationPolicy?: string;
  urlSourceOfTruth?: string;
  logging?: any;
}

let cachedSpecData: SpecJson | null = null;
let cachedFallbackData: FallbackSpec | null = null;
let cachedYamlData: SpecJson | null = null;
let dataSourceUsed: 'yaml' | 'json' | 'default' = 'yaml';

export function getDataSource(): 'yaml' | 'json' | 'default' {
  return dataSourceUsed;
}

export async function loadSpecYaml(): Promise<SpecJson> {
  if (cachedYamlData) {
    console.log('Using cached YAML data');
    return cachedYamlData;
  }

  try {
    console.log('Attempting to load spec.yaml...');
    const response = await fetch('/spec.yaml');
    if (!response.ok) {
      throw new Error(`Failed to load spec.yaml: ${response.status} ${response.statusText}`);
    }
    const yamlText = await response.text();
    
    if (!yamlText || yamlText.trim().length === 0) {
      throw new Error('spec.yaml is empty');
    }

    console.log('Parsing YAML content...');
    const data = parseYAML(yamlText);

    // Validate and normalize the data
    if (!data || typeof data !== 'object') {
      throw new Error('Parsed YAML data is invalid');
    }

    // Ensure appsRegistry is available
    if (!data.appsRegistry || !Array.isArray(data.appsRegistry)) {
      console.warn('spec.yaml missing or invalid appsRegistry, initializing empty array');
      data.appsRegistry = [];
    }

    // Ensure secoinfiApps is available
    if (!data.secoinfiApps || !Array.isArray(data.secoinfiApps)) {
      console.warn('spec.yaml missing or invalid secoinfiApps, initializing empty array');
      data.secoinfiApps = [];
    }

    // Validate secoinfiApps structure
    data.secoinfiApps = data.secoinfiApps.filter((app: any) => {
      if (!app || typeof app !== 'object') {
        console.warn('Invalid secoinfiApp entry (not an object):', app);
        return false;
      }
      if (!app.name || !app.key || !app.url || !app.description) {
        console.warn('Invalid secoinfiApp entry (missing required fields):', app);
        return false;
      }
      return true;
    });

    // Validate appsRegistry structure
    data.appsRegistry = data.appsRegistry.filter((app: any) => {
      if (!app || typeof app !== 'object') {
        console.warn('Invalid app entry (not an object):', app);
        return false;
      }
      if (!app.id || !app.name || !app.url) {
        console.warn('Invalid app entry (missing required fields):', app);
        return false;
      }
      return true;
    });

    cachedYamlData = data;
    dataSourceUsed = 'yaml';
    console.log(
      `✅ Successfully loaded spec.yaml with ${data.appsRegistry.length} SECOINFI apps and ${data.secoinfiApps.length} Secoinfi modules`
    );
    return data;
  } catch (error) {
    console.error('❌ Error loading spec.yaml:', error);
    throw error;
  }
}

export async function loadSpecJson(): Promise<SpecJson> {
  if (cachedSpecData) {
    console.log('Using cached JSON data');
    return cachedSpecData;
  }

  try {
    console.log('Attempting to load spec.json...');
    const response = await fetch('/spec.json');
    if (!response.ok) {
      throw new Error(`Failed to load spec.json: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    // Validate structure
    if (!data || typeof data !== 'object') {
      throw new Error('spec.json contains invalid data');
    }

    // Ensure arrays exist
    if (!Array.isArray(data.appsRegistry)) {
      console.warn('spec.json missing appsRegistry array');
      data.appsRegistry = [];
    }

    // Note: spec.json may not have secoinfiApps, that's okay
    if (!data.secoinfiApps) {
      data.secoinfiApps = [];
    }

    cachedSpecData = data;
    dataSourceUsed = 'json';
    console.log(`✅ Successfully loaded spec.json with ${data.appsRegistry.length} apps`);
    return data;
  } catch (error) {
    console.error('❌ Error loading spec.json:', error);
    throw error;
  }
}

export async function loadFallbackSpec(): Promise<FallbackSpec> {
  if (cachedFallbackData) {
    console.log('Using cached fallback data');
    return cachedFallbackData;
  }

  try {
    console.log('Attempting to load defaultSpec.json...');
    const response = await fetch('/defaultSpec.json');
    if (!response.ok) {
      throw new Error(`Failed to load defaultSpec.json: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    // Validate structure
    if (!data || typeof data !== 'object') {
      throw new Error('defaultSpec.json contains invalid data');
    }

    if (!Array.isArray(data.appsRegistry)) {
      console.warn('defaultSpec.json missing appsRegistry array');
      data.appsRegistry = [];
    }

    cachedFallbackData = data;
    dataSourceUsed = 'default';
    console.log(`✅ Successfully loaded defaultSpec.json with ${data.appsRegistry.length} apps`);
    return data;
  } catch (error) {
    console.error('❌ Error loading defaultSpec.json:', error);
    // Return minimal fallback if even the JSON file fails
    console.warn('⚠️ Using minimal emergency fallback data');
    dataSourceUsed = 'default';
    return {
      version: 1,
      appsRegistry: [],
      secoinfiApps: [],
      sitemap: { sections: [] },
      features: [],
      leaderboards: { rankings: [] },
      overviewCards: { cards: [] },
      versions: { versionHistory: [] },
      migrations: { migrationHistory: [] },
      schemaVersion: 1,
      specVersion: 1,
      generatedAt: 0,
    };
  }
}

// Cascading load with priority: spec.yaml > spec.json > defaultSpec.json
export async function loadSpec(): Promise<SpecJson> {
  console.log('🔄 Starting configuration load cascade...');
  
  try {
    // First priority: spec.yaml
    console.log('Priority 1: Attempting spec.yaml...');
    const yamlData = await loadSpecYaml();
    console.log('✅ Configuration loaded from spec.yaml');
    return yamlData;
  } catch (yamlError) {
    console.log('⚠️ spec.yaml not available, trying spec.json...');
    try {
      // Second priority: spec.json
      console.log('Priority 2: Attempting spec.json...');
      const jsonData = await loadSpecJson();
      console.log('✅ Configuration loaded from spec.json');
      return jsonData;
    } catch (jsonError) {
      console.log('⚠️ spec.json not available, using defaultSpec.json...');
      // Final fallback: defaultSpec.json
      console.log('Priority 3: Attempting defaultSpec.json...');
      const fallbackData = await loadFallbackSpec();
      console.log('✅ Configuration loaded from defaultSpec.json (fallback)');
      return fallbackData;
    }
  }
}

export function validateCanonicalUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  return url.startsWith('https://') && url.endsWith('.caffeine.xyz');
}

export function validateApp(app: any): app is App {
  return (
    typeof app === 'object' &&
    app !== null &&
    typeof app.id === 'string' &&
    typeof app.name === 'string' &&
    typeof app.description === 'string' &&
    Array.isArray(app.features) &&
    (typeof app.rank === 'number' || typeof app.rank === 'bigint') &&
    typeof app.url === 'string' &&
    typeof app.archived === 'boolean'
  );
}

export function validateSecoinfiApp(app: any): app is SecoinfiApp {
  return (
    typeof app === 'object' &&
    app !== null &&
    typeof app.name === 'string' &&
    typeof app.key === 'string' &&
    typeof app.url === 'string' &&
    typeof app.description === 'string'
  );
}

export function validateFallbackSpec(data: any): data is FallbackSpec {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.appsRegistry)
  );
}
