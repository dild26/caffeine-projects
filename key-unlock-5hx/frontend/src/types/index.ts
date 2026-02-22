// Local type definitions for frontend-only data structures
// These types are not stored in the backend but used for UI state management

export interface SiteConfig {
  id: string;
  name: string;
  description: string;
  features: string[];
  mlPromptSeeds: string[];
  mvpChecklist: string[];
  integrationNotes: string;
  status: string;
  priority: bigint;
  domainReference?: string;
  category?: string;
  notes?: string;
  isDefault: boolean;
}

export interface DomainReference {
  domain: string;
  category: string;
  description: string;
  notes: string;
  features: string[];
}

export interface JsonSchemaTemplate {
  id: string;
  name: string;
  schema: string;
  description: string;
}

export interface MlPromptTemplate {
  id: string;
  name: string;
  prompt: string;
  description: string;
}

export interface PlatformConfig {
  architecture: string;
  security: string;
  privacy: string;
  monetization: string;
  performance: string;
  seo: string;
  roadmap: string;
}
