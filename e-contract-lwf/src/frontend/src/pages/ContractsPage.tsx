import { useGetAllFilePairs, useHasEnhancedTemplateAccess, useAddTemplateInteraction, useAddManifestEntry, usePaginateFiles } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, Filter, Heart, FileSignature, TrendingUp, TrendingDown, AlertCircle, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, Mail, Share2, Printer, Save, Maximize2, Lock, Eye, CheckCircle2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useReducer } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { maskHash } from '../lib/hashUtils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface ContractTemplate {
  id: string;
  title: string;
  summary: string;
  category: string;
  price: number;
  tags: string[];
  jsonFileId: string;
  mdFileId?: string;
  hash: string;
  votes: number;
  userVote?: 'up' | 'down' | null;
  isPaired: boolean;
}

interface FileValidationResult {
  isValid: boolean;
  error?: string;
  contentType: 'json' | 'markdown' | 'unknown';
  contentPreview: string;
}

interface TemplateState {
  jsonSchema: any | null;
  mdContent: string;
  formData: Record<string, any>;
  isLoading: boolean;
  loadError: string | null;
  jsonValidation: FileValidationResult | null;
  mdValidation: FileValidationResult | null;
  jsonLoadError: string | null;
  mdLoadError: string | null;
}

type TemplateAction =
  | { type: 'RESET' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_JSON_SCHEMA'; payload: any }
  | { type: 'SET_MD_CONTENT'; payload: string }
  | { type: 'SET_JSON_VALIDATION'; payload: FileValidationResult }
  | { type: 'SET_MD_VALIDATION'; payload: FileValidationResult }
  | { type: 'UPDATE_FORM_DATA'; payload: Record<string, any> }
  | { type: 'SET_JSON_LOAD_ERROR'; payload: string }
  | { type: 'SET_MD_LOAD_ERROR'; payload: string };

function templateReducer(state: TemplateState, action: TemplateAction): TemplateState {
  switch (action.type) {
    case 'RESET':
      return {
        jsonSchema: null,
        mdContent: '',
        formData: {},
        isLoading: true,
        loadError: null,
        jsonValidation: null,
        mdValidation: null,
        jsonLoadError: null,
        mdLoadError: null,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, loadError: action.payload, isLoading: false };
    case 'SET_JSON_SCHEMA':
      return { ...state, jsonSchema: action.payload };
    case 'SET_MD_CONTENT':
      return { ...state, mdContent: action.payload };
    case 'SET_JSON_VALIDATION':
      return { ...state, jsonValidation: action.payload };
    case 'SET_MD_VALIDATION':
      return { ...state, mdValidation: action.payload };
    case 'UPDATE_FORM_DATA':
      return { ...state, formData: action.payload };
    case 'SET_JSON_LOAD_ERROR':
      return { ...state, jsonLoadError: action.payload };
    case 'SET_MD_LOAD_ERROR':
      return { ...state, mdLoadError: action.payload };
    default:
      return state;
  }
}

export default function ContractsPage() {
  const { data: filePairs = [], isLoading: pairsLoading, refetch: refetchPairs } = useGetAllFilePairs();
  const { data: paginatedResult, isLoading: filesLoading } = usePaginateFiles(0, 1000);
  const allFiles = paginatedResult?.items || [];
  const { data: hasEnhancedAccess = false } = useHasEnhancedTemplateAccess();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [isFullPage, setIsFullPage] = useState(false);
  const [cart, setCart] = useState<{ templateId: string; title: string; price: number; quantity: number }[]>([]);
  const [votes, setVotes] = useState<Record<string, { vote: 'up' | 'down' | null; count: number }>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 9;

  // Debug logging for data inspection
  useEffect(() => {
    console.log('📊 [CONTRACTS] Data Status:', {
      pairsLoading,
      filesLoading,
      filePairsCount: filePairs.length,
      allFilesCount: allFiles.length,
      filePairs: filePairs.map(p => ({
        baseName: p.baseName,
        hasJson: !!p.jsonFile,
        hasMd: !!p.mdFile,
        jsonName: p.jsonFile?.name,
        mdName: p.mdFile?.name,
      })),
    });
  }, [filePairs, allFiles, pairsLoading, filesLoading]);

  // Parse file pairs into contract templates - only show fully paired templates
  const templates: ContractTemplate[] = filePairs
    .filter(pair => {
      const isFullyPaired = pair.jsonFile && pair.mdFile;
      if (!isFullyPaired) {
        console.log('⚠ [CONTRACTS] Incomplete pair filtered out:', {
          baseName: pair.baseName,
          hasJson: !!pair.jsonFile,
          hasMd: !!pair.mdFile,
        });
      }
      return isFullyPaired;
    })
    .map(pair => {
      // Normalize basename to lowercase for consistency
      const basename = pair.baseName.toLowerCase();
      const title = basename.split(/[_-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      console.log('✓ [CONTRACTS] Creating template:', {
        basename,
        title,
        jsonFile: pair.jsonFile!.name,
        mdFile: pair.mdFile!.name,
      });
      
      return {
        id: basename,
        title,
        summary: `E-Contract template for ${title}`,
        category: 'Legal',
        price: Math.max(0.5, 5.0),
        tags: ['contract', 'legal', basename],
        jsonFileId: pair.jsonFile!.id,
        mdFileId: pair.mdFile!.id,
        hash: pair.jsonFile!.hash,
        votes: votes[basename]?.count || 0,
        userVote: votes[basename]?.vote || null,
        isPaired: true,
      };
    });

  console.log('📋 [CONTRACTS] Templates created:', templates.length);

  const filteredTemplates = templates.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const totalPages = Math.ceil(filteredTemplates.length / pageSize);
  const paginatedTemplates = filteredTemplates.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handleVote = (templateId: string, voteType: 'up' | 'down') => {
    setVotes(prev => {
      const current = prev[templateId] || { vote: null, count: 0 };
      let newCount = current.count;
      let newVote: 'up' | 'down' | null = voteType;

      if (current.vote === voteType) {
        newVote = null;
        newCount += voteType === 'up' ? -1 : 1;
      } else if (current.vote) {
        newCount += voteType === 'up' ? 2 : -2;
      } else {
        newCount += voteType === 'up' ? 1 : -1;
      }

      return {
        ...prev,
        [templateId]: { vote: newVote, count: newCount },
      };
    });
  };

  const addToCart = (template: ContractTemplate) => {
    if (template.price < 0.5) {
      toast.error('Minimum price of $0.50 not met');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.templateId === template.id);
      if (existing) {
        return prev.map(item =>
          item.templateId === template.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        templateId: template.id,
        title: template.title,
        price: template.price,
        quantity: 1,
      }];
    });
    toast.success(`Added ${template.title} to cart`);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Store cart in localStorage
  useEffect(() => {
    localStorage.setItem('econtract-cart', JSON.stringify(cart));
  }, [cart]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('econtract-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage');
      }
    }
  }, []);

  const handleRefresh = async () => {
    console.log('🔄 [CONTRACTS] Manual refresh triggered');
    toast.info('Refreshing contract catalog...');
    await refetchPairs();
    toast.success('Catalog refreshed');
  };

  const isLoading = pairsLoading || filesLoading;

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">E-Contracts</h1>
          <p className="text-muted-foreground">Browse and purchase legal contract templates</p>
          {!hasEnhancedAccess && (
            <p className="text-sm text-primary mt-1">
              Subscribe for interactive features and template downloads
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            title="Refresh catalog"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            className="rounded-full" 
            onClick={() => navigate({ to: '/cart' })}
            disabled={cartCount === 0}
          >
            <FileSignature className="mr-2 h-4 w-4" />
            Cart ({cartCount}) - ${cartTotal.toFixed(2)}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Loading contracts...</h3>
            <p className="text-sm text-muted-foreground">
              Fetching and pairing contract templates
            </p>
          </CardContent>
        </Card>
      ) : filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contracts available</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              {allFiles.length === 0 ? (
                <>Upload paired JSON and MD contract templates to get started. Files must have matching basenames (case-insensitive).</>
              ) : filePairs.length === 0 ? (
                <>Files uploaded but no pairs found. Ensure .json and .md files have matching basenames (e.g., "contract.json" and "contract.md").</>
              ) : (
                <>All uploaded files are unpaired. Upload matching .json and .md files with the same basename to create contract templates.</>
              )}
            </p>
            <div className="flex gap-2">
              <Button className="rounded-full" onClick={() => navigate({ to: '/upload' })}>
                Upload Templates
              </Button>
              <Button variant="outline" className="rounded-full" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
            {allFiles.length > 0 && (
              <div className="mt-6 p-4 bg-muted rounded-lg max-w-2xl">
                <h4 className="font-semibold mb-2">Debug Information:</h4>
                <div className="text-xs text-left space-y-1">
                  <p>Total files uploaded: {allFiles.length}</p>
                  <p>File pairs found: {filePairs.length}</p>
                  <p>Fully paired templates: {templates.length}</p>
                  <p>JSON files: {allFiles.filter(f => f.fileType === 'json').length}</p>
                  <p>MD files: {allFiles.filter(f => f.fileType === 'markdown').length}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTemplates.map((template) => (
              <Card
                key={template.id}
                className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
                onClick={() => {
                  setSelectedTemplate(template);
                  setIsFullPage(false);
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <Badge variant="secondary">{template.category}</Badge>
                      <Badge variant="outline" className="text-green-600 border-green-600">✓ Paired</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className={template.votes > 0 ? 'text-green-600' : template.votes < 0 ? 'text-red-600' : 'text-muted-foreground'}>
                        {template.votes}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {template.title}
                  </CardTitle>
                  <CardDescription>{template.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${template.price.toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant={template.userVote === 'up' ? 'default' : 'outline'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(template.id, 'up');
                        }}
                        title="Upvote"
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant={template.userVote === 'down' ? 'default' : 'outline'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(template.id, 'down');
                        }}
                        title="Downvote"
                      >
                        <TrendingDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(template);
                        }}
                        title="Add to favorites"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(template);
                        }}
                        title="Add to cart"
                      >
                        <FileSignature className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1}
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage >= totalPages - 1}
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {selectedTemplate && (
        <ErrorBoundary
          fallback={
            <div className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-background border rounded-lg shadow-lg p-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Template rendering error:</strong> An unexpected error occurred while loading this template. Please try again or contact support.
                </AlertDescription>
              </Alert>
              <Button className="mt-4" onClick={() => setSelectedTemplate(null)}>Close</Button>
            </div>
          }
          onError={(error) => {
            console.error('Template rendering error:', error);
            toast.error('Failed to render template');
          }}
        >
          <TemplateDetailView
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
            hasEnhancedAccess={hasEnhancedAccess}
            isFullPage={isFullPage}
            onToggleFullPage={() => setIsFullPage(!isFullPage)}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}

interface TemplateDetailViewProps {
  template: ContractTemplate;
  onClose: () => void;
  hasEnhancedAccess: boolean;
  isFullPage: boolean;
  onToggleFullPage: () => void;
}

function TemplateDetailView({ template, onClose, hasEnhancedAccess, isFullPage, onToggleFullPage }: TemplateDetailViewProps) {
  const [state, dispatch] = useReducer(templateReducer, {
    jsonSchema: null,
    mdContent: '',
    formData: {},
    isLoading: true,
    loadError: null,
    jsonValidation: null,
    mdValidation: null,
    jsonLoadError: null,
    mdLoadError: null,
  });
  
  const [activeTab, setActiveTab] = useState('form');
  const [showPreview, setShowPreview] = useState(false);
  const addTemplateInteraction = useAddTemplateInteraction();
  const addManifestEntry = useAddManifestEntry();

  // Validate JSON content with strict pre-checks
  const validateJsonContent = (content: string): FileValidationResult => {
    const trimmed = content.trim();
    const preview = trimmed.substring(0, 100);

    // Enforce size limit
    if (trimmed.length > 50000) {
      return {
        isValid: false,
        error: 'File exceeds size limit (max 50,000 characters)',
        contentType: 'unknown',
        contentPreview: preview,
      };
    }

    // Pre-check: Must start with '{' or '['
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return {
        isValid: false,
        error: 'File type mismatch: expected JSON content starting with \'{\' or \'[\'',
        contentType: 'unknown',
        contentPreview: preview,
      };
    }

    // Attempt JSON parsing
    try {
      const parsed = JSON.parse(trimmed);
      
      // Validate schema structure
      if (!parsed || typeof parsed !== 'object') {
        return {
          isValid: false,
          error: 'Invalid JSON: Root must be an object',
          contentType: 'json',
          contentPreview: preview,
        };
      }

      if (!parsed.properties || typeof parsed.properties !== 'object') {
        return {
          isValid: false,
          error: 'Invalid JSON schema: Missing or invalid "properties" field',
          contentType: 'json',
          contentPreview: preview,
        };
      }

      return {
        isValid: true,
        contentType: 'json',
        contentPreview: preview,
      };
    } catch (error) {
      return {
        isValid: false,
        error: `JSON Parse Error: ${error instanceof Error ? error.message : 'Invalid JSON format'}`,
        contentType: 'json',
        contentPreview: preview,
      };
    }
  };

  // Validate Markdown content with pre-checks
  const validateMarkdownContent = (content: string): FileValidationResult => {
    const trimmed = content.trim();
    const preview = trimmed.substring(0, 100);

    if (trimmed.length === 0) {
      return {
        isValid: false,
        error: 'Content is empty',
        contentType: 'markdown',
        contentPreview: '',
      };
    }

    // Enforce size limit
    if (trimmed.length > 50000) {
      return {
        isValid: false,
        error: 'Markdown file exceeds size limit (max 50,000 characters)',
        contentType: 'markdown',
        contentPreview: preview,
      };
    }

    // Pre-check: Should NOT start with JSON characters
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return {
        isValid: false,
        error: 'File type mismatch: expected Markdown content, received JSON-like content',
        contentType: 'unknown',
        contentPreview: preview,
      };
    }

    return {
      isValid: true,
      contentType: 'markdown',
      contentPreview: preview,
    };
  };

  useEffect(() => {
    // CRITICAL: Reset all state before loading new template
    console.log('🔄 [MANIFEST] Resetting state for new template:', template.id);
    dispatch({ type: 'RESET' });
    setActiveTab('form');

    let isCancelled = false;

    const loadTemplateContent = async () => {
      const manifestLog: any = {
        basename: template.id,
        timestamp: Date.now(),
        jsonFile: `${template.id}.json`,
        mdFile: template.mdFileId ? `${template.id}.md` : null,
        jsonFileId: template.jsonFileId,
        mdFileId: template.mdFileId || null,
        steps: [],
      };

      try {
        console.log('📥 [MANIFEST] Loading template content for basename:', template.id);
        manifestLog.steps.push({ step: 'start', status: 'initiated' });
        
        // STEP 1: Pre-flight dry-run validation for JSON
        console.log('🔍 [MANIFEST] Pre-flight validation: Fetching JSON file:', template.jsonFileId);
        manifestLog.steps.push({ step: 'preflight_json', fileId: template.jsonFileId, status: 'started' });
        
        const jsonResponse = await fetch(`/blobs/${template.jsonFileId}`);
        
        if (!jsonResponse.ok) {
          const errorMsg = `Failed to fetch JSON file "${template.id}.json": HTTP ${jsonResponse.status} ${jsonResponse.statusText}`;
          console.error('✗ [MANIFEST]', errorMsg);
          manifestLog.steps.push({ step: 'preflight_json', status: 'failed', error: errorMsg });
          
          if (isCancelled) return;
          dispatch({ type: 'SET_JSON_LOAD_ERROR', payload: errorMsg });
          
          // Log error to manifest
          await addManifestEntry.mutateAsync({
            action: 'JSON_FETCH_ERROR',
            details: JSON.stringify(manifestLog),
          });
        } else {
          const jsonText = await jsonResponse.text();
          console.log('📄 [MANIFEST] JSON file fetched, size:', jsonText.length, 'bytes');
          manifestLog.steps.push({ step: 'preflight_json', status: 'success', size: jsonText.length });
          
          // STRICT JSON VALIDATION with pre-checks
          console.log('🔍 [MANIFEST] Pre-flight validation: Validating JSON content');
          manifestLog.steps.push({ step: 'validate_json_preflight', status: 'started' });
          
          const jsonValidationResult = validateJsonContent(jsonText);
          
          if (!jsonValidationResult.isValid) {
            const errorMsg = jsonValidationResult.error || 'JSON validation failed';
            console.error('✗ [MANIFEST] JSON pre-flight validation failed:', errorMsg);
            manifestLog.steps.push({ 
              step: 'validate_json_preflight', 
              status: 'failed', 
              error: errorMsg,
              contentType: jsonValidationResult.contentType,
              contentPreview: jsonValidationResult.contentPreview,
            });
            
            if (isCancelled) return;
            dispatch({ type: 'SET_JSON_LOAD_ERROR', payload: errorMsg });
            dispatch({ type: 'SET_JSON_VALIDATION', payload: jsonValidationResult });
            
            // Log detailed error to manifest
            await addManifestEntry.mutateAsync({
              action: 'JSON_PREFLIGHT_VALIDATION_ERROR',
              details: JSON.stringify({
                ...manifestLog,
                validationError: errorMsg,
                contentType: jsonValidationResult.contentType,
                contentPreview: jsonValidationResult.contentPreview,
              }),
            });
          } else {
            console.log('✓ [MANIFEST] JSON pre-flight validation passed');
            manifestLog.steps.push({ step: 'validate_json_preflight', status: 'success' });

            if (isCancelled) return;

            console.log('📊 [MANIFEST] Pre-flight validation complete, parsing JSON');
            const parsedJson = JSON.parse(jsonText);
            console.log('✓ [MANIFEST] JSON parsed successfully, properties count:', Object.keys(parsedJson.properties).length);
            manifestLog.steps.push({ 
              step: 'parse_json', 
              status: 'success',
              propertiesCount: Object.keys(parsedJson.properties).length,
            });
            
            dispatch({ type: 'SET_JSON_SCHEMA', payload: parsedJson });
            dispatch({ type: 'SET_JSON_VALIDATION', payload: jsonValidationResult });
            console.log('✓ [MANIFEST] JSON schema loaded successfully for:', template.id);
          }
        }

        // STEP 2: Pre-flight dry-run validation for MD (if exists)
        if (template.mdFileId) {
          console.log('🔍 [MANIFEST] Pre-flight validation: Fetching MD file:', template.mdFileId);
          manifestLog.steps.push({ step: 'preflight_md', fileId: template.mdFileId, status: 'started' });
          
          const mdResponse = await fetch(`/blobs/${template.mdFileId}`);
          
          if (!mdResponse.ok) {
            const errorMsg = `Failed to fetch MD file "${template.id}.md": HTTP ${mdResponse.status} ${mdResponse.statusText}`;
            console.warn('⚠ [MANIFEST]', errorMsg);
            manifestLog.steps.push({ step: 'preflight_md', status: 'warning', error: errorMsg });
            
            if (isCancelled) return;
            dispatch({ type: 'SET_MD_LOAD_ERROR', payload: errorMsg });
          } else {
            const mdText = await mdResponse.text();
            console.log('📝 [MANIFEST] MD file fetched, size:', mdText.length, 'bytes');
            manifestLog.steps.push({ step: 'preflight_md', status: 'success', size: mdText.length });
            
            // STRICT MARKDOWN VALIDATION with pre-checks
            console.log('🔍 [MANIFEST] Pre-flight validation: Validating Markdown content');
            manifestLog.steps.push({ step: 'validate_md_preflight', status: 'started' });
            
            const mdValidationResult = validateMarkdownContent(mdText);
            
            if (!mdValidationResult.isValid) {
              const errorMsg = mdValidationResult.error || 'Markdown validation failed';
              console.warn('⚠ [MANIFEST] Markdown pre-flight validation warning:', errorMsg);
              manifestLog.steps.push({ 
                step: 'validate_md_preflight', 
                status: 'warning', 
                error: errorMsg,
                contentType: mdValidationResult.contentType,
                contentPreview: mdValidationResult.contentPreview,
              });
              
              if (isCancelled) return;
              dispatch({ type: 'SET_MD_LOAD_ERROR', payload: errorMsg });
              dispatch({ type: 'SET_MD_VALIDATION', payload: mdValidationResult });
              
              // Log warning (not critical error)
              await addManifestEntry.mutateAsync({
                action: 'MD_PREFLIGHT_VALIDATION_WARNING',
                details: JSON.stringify({
                  ...manifestLog,
                  validationWarning: errorMsg,
                  contentType: mdValidationResult.contentType,
                  contentPreview: mdValidationResult.contentPreview,
                }),
              });
            } else {
              console.log('✓ [MANIFEST] Markdown pre-flight validation passed');
              manifestLog.steps.push({ step: 'validate_md_preflight', status: 'success' });
              
              if (isCancelled) return;
              
              dispatch({ type: 'SET_MD_CONTENT', payload: mdText });
              dispatch({ type: 'SET_MD_VALIDATION', payload: mdValidationResult });
              console.log('✓ [MANIFEST] MD content loaded successfully (raw text) for:', template.id);
            }
          }
        } else {
          console.log('ℹ [MANIFEST] No MD file paired with:', template.id);
          manifestLog.steps.push({ step: 'preflight_md', status: 'skipped', reason: 'No MD file paired' });
          
          if (isCancelled) return;
          dispatch({ type: 'SET_MD_LOAD_ERROR', payload: 'No matching .md file found for this template' });
        }

        // Log successful load to manifest
        manifestLog.steps.push({ step: 'complete', status: 'success' });
        await addManifestEntry.mutateAsync({
          action: 'TEMPLATE_LOADED_SUCCESS',
          details: JSON.stringify(manifestLog),
        });

        if (isCancelled) return;
        dispatch({ type: 'SET_LOADING', payload: false });
        console.log('✓ [MANIFEST] Template loading complete for:', template.id);
        
      } catch (error) {
        if (isCancelled) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('✗ [MANIFEST] Failed to load template content:', errorMessage);
        manifestLog.steps.push({ step: 'error', status: 'failed', error: errorMessage });
        
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        dispatch({ type: 'SET_LOADING', payload: false });
        
        // Log error to manifest
        await addManifestEntry.mutateAsync({
          action: 'TEMPLATE_LOAD_ERROR',
          details: JSON.stringify(manifestLog),
        });
        
        // Show user-friendly error toast
        toast.error('Failed to load template', {
          description: errorMessage,
        });
      }
    };

    loadTemplateContent();

    return () => {
      isCancelled = true;
    };
  }, [template.jsonFileId, template.mdFileId, template.id, addManifestEntry]);

  const handleSubmit = async () => {
    if (!hasEnhancedAccess) {
      toast.error('Subscribe to submit forms');
      return;
    }
    try {
      await addTemplateInteraction.mutateAsync({ templateId: template.id, action: 'submit_form' });
      toast.success('Form submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit form');
    }
  };

  const handleDownload = async () => {
    if (!hasEnhancedAccess) {
      toast.error('Subscribe to download templates');
      return;
    }
    try {
      await addTemplateInteraction.mutateAsync({ templateId: template.id, action: 'download_template' });
      const dataStr = JSON.stringify({ ...state.jsonSchema, formData: state.formData }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.id}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Template downloaded!');
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  const handleSavePDF = async () => {
    if (!hasEnhancedAccess) {
      toast.error('Subscribe to save as PDF');
      return;
    }
    try {
      await addTemplateInteraction.mutateAsync({ templateId: template.id, action: 'save_pdf' });
      toast.success('PDF generation started (feature coming soon)');
    } catch (error) {
      toast.error('Failed to save PDF');
    }
  };

  const handlePrint = async () => {
    if (!hasEnhancedAccess) {
      toast.error('Subscribe to print');
      return;
    }
    try {
      await addTemplateInteraction.mutateAsync({ templateId: template.id, action: 'print' });
      window.print();
    } catch (error) {
      toast.error('Failed to print');
    }
  };

  const handleEmail = async () => {
    if (!hasEnhancedAccess) {
      toast.error('Subscribe to send via email');
      return;
    }
    try {
      await addTemplateInteraction.mutateAsync({ templateId: template.id, action: 'send_email' });
      toast.success('Email feature coming soon');
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const handleShare = async () => {
    if (!hasEnhancedAccess) {
      toast.error('Subscribe to share files');
      return;
    }
    try {
      await addTemplateInteraction.mutateAsync({ templateId: template.id, action: 'share' });
      toast.success('Share feature coming soon');
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  return (
    <>
      <div className={`fixed ${isFullPage ? 'inset-0' : 'inset-4 md:inset-8 lg:inset-16'} z-50 bg-background/80 backdrop-blur-sm`}>
        <div className={`fixed ${isFullPage ? 'inset-0' : 'inset-4 md:inset-8 lg:inset-16'} bg-background border rounded-lg shadow-lg overflow-hidden flex flex-col`}>
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold">{template.title}</h2>
              <p className="text-sm text-muted-foreground">Basename: {template.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {hasEnhancedAccess && (
                <>
                  <Button variant="outline" size="icon" onClick={() => setShowPreview(true)} title="Preview parsed content">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleDownload} title="Download as JSON">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleSavePDF} title="Save as PDF">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handlePrint} title="Print">
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleEmail} title="Send via Email">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare} title="Share">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="outline" size="icon" onClick={onToggleFullPage} title={isFullPage ? "Exit full page" : "Full page"}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <ErrorBoundary
            fallback={
              <div className="p-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tab rendering error:</strong> An error occurred while rendering this tab. Please try switching tabs or reloading the template.
                  </AlertDescription>
                </Alert>
              </div>
            }
            onError={(error) => console.error('Tab rendering error:', error)}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b px-6">
                <TabsList className="h-12">
                  <TabsTrigger value="form">Tab 1: E-Contract Form (JSON)</TabsTrigger>
                  <TabsTrigger value="metadata">Tab 2: Metadata</TabsTrigger>
                  <TabsTrigger value="details">Tab 3: Details (Markdown)</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="form" className="flex-1 overflow-hidden m-0 p-6">
                <ScrollArea className="h-full">
                  {!hasEnhancedAccess && (
                    <Alert className="mb-4 border-primary">
                      <Lock className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Subscribe to unlock interactive features:</strong> Fill and submit forms, download templates, save as PDF, print, and share.
                      </AlertDescription>
                    </Alert>
                  )}
                  {state.isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading form from {template.id}.json...</p>
                      </div>
                    </div>
                  ) : state.jsonLoadError ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Error loading JSON file:</strong><br />
                        {state.jsonLoadError}
                        <br /><br />
                        <span className="text-xs">This error has been logged to the manifest. Please check that the .json file exists, is accessible, contains valid JSON starting with '&#123;' or '[', and includes a "properties" field.</span>
                      </AlertDescription>
                    </Alert>
                  ) : state.jsonSchema ? (
                    <>
                      {state.jsonValidation && state.jsonValidation.isValid && (
                        <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-700 dark:text-green-300">
                            <strong>JSON validation passed:</strong> Content type verified, schema structure validated, {Object.keys(state.jsonSchema.properties).length} properties found.
                          </AlertDescription>
                        </Alert>
                      )}
                      <DynamicFormRenderer 
                        schema={state.jsonSchema} 
                        formData={state.formData}
                        setFormData={(data) => dispatch({ type: 'UPDATE_FORM_DATA', payload: data })}
                        hasEnhancedAccess={hasEnhancedAccess}
                        onSubmit={handleSubmit}
                      />
                    </>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>No form schema available:</strong><br />
                        The JSON file for {template.id}.json could not be loaded or parsed. Please check the file format and try again.
                      </AlertDescription>
                    </Alert>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="metadata" className="flex-1 overflow-hidden m-0 p-6">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Title</p>
                        <p className="text-sm text-muted-foreground">{template.title}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Category</p>
                        <p className="text-sm text-muted-foreground">{template.category}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Price</p>
                        <p className="text-sm text-muted-foreground">${template.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Pairing Status</p>
                        <p className="text-sm text-green-600">✓ Fully Paired</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Basename</p>
                        <p className="text-sm text-muted-foreground font-mono">{template.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Hash</p>
                        <p className="text-sm text-muted-foreground font-mono">{maskHash(template.hash)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">JSON File</p>
                        <p className="text-sm text-muted-foreground font-mono">{template.id}.json</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">MD File</p>
                        <p className="text-sm text-muted-foreground font-mono">{template.id}.md</p>
                      </div>
                    </div>
                    
                    {state.jsonValidation && (
                      <div className="mt-6 p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">JSON Validation Result</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Status:</span>
                            <Badge variant={state.jsonValidation.isValid ? 'default' : 'destructive'}>
                              {state.jsonValidation.isValid ? 'Valid' : 'Invalid'}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Content Type:</span> {state.jsonValidation.contentType}
                          </div>
                          {state.jsonValidation.error && (
                            <div>
                              <span className="font-medium">Error:</span> {state.jsonValidation.error}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {state.mdValidation && (
                      <div className="mt-4 p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Markdown Validation Result</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Status:</span>
                            <Badge variant={state.mdValidation.isValid ? 'default' : 'destructive'}>
                              {state.mdValidation.isValid ? 'Valid' : 'Invalid'}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Content Type:</span> {state.mdValidation.contentType}
                          </div>
                          {state.mdValidation.error && (
                            <div>
                              <span className="font-medium">Warning:</span> {state.mdValidation.error}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="details" className="flex-1 overflow-hidden m-0 p-6">
                <ScrollArea className="h-full">
                  {state.isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading details from {template.id}.md...</p>
                      </div>
                    </div>
                  ) : state.mdLoadError ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Markdown file not available:</strong><br />
                        {state.mdLoadError}
                        <br /><br />
                        <span className="text-xs">Upload a matching .md file with the basename "{template.id}" to provide detailed information and instructions for this contract template.</span>
                      </AlertDescription>
                    </Alert>
                  ) : state.mdContent ? (
                    <div className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Displaying raw markdown content from <strong>{template.id}.md</strong> (no parsing or transformation applied)
                        </AlertDescription>
                      </Alert>
                      {state.mdValidation && state.mdValidation.isValid && (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-700 dark:text-green-300">
                            <strong>Markdown validation passed:</strong> Content type verified as markdown.
                          </AlertDescription>
                        </Alert>
                      )}
                      {state.mdValidation && !state.mdValidation.isValid && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Markdown validation warning:</strong> {state.mdValidation.error}
                          </AlertDescription>
                        </Alert>
                      )}
                      <div className="bg-muted/30 p-4 rounded-lg border">
                        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{state.mdContent}</pre>
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No guidance content available. Upload a matching .md file with the basename "{template.id}" to provide detailed information and instructions for this contract template.
                      </AlertDescription>
                    </Alert>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </ErrorBoundary>
        </div>
      </div>

      {/* Preview Dialog for Admin */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Preview - {template.title}</DialogTitle>
            <DialogDescription>
              Review parsed JSON schema and raw Markdown content before committing
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Parsed JSON Schema</h3>
              {state.jsonSchema ? (
                <div className="bg-muted p-4 rounded-lg border">
                  <pre className="text-xs overflow-x-auto">{JSON.stringify(state.jsonSchema, null, 2)}</pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No JSON schema loaded</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Raw Markdown Content</h3>
              {state.mdContent ? (
                <div className="bg-muted p-4 rounded-lg border">
                  <pre className="text-xs whitespace-pre-wrap">{state.mdContent}</pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No markdown content loaded</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface DynamicFormRendererProps {
  schema: any;
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  hasEnhancedAccess: boolean;
  onSubmit: () => void;
}

function DynamicFormRenderer({ schema, formData, setFormData, hasEnhancedAccess, onSubmit }: DynamicFormRendererProps) {
  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  if (!schema || !schema.properties) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Invalid JSON schema format.</strong><br />
          The uploaded .json file must contain a valid schema with a "properties" field. Please check the file format and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2">{schema.title || 'Contract Form'}</h3>
        <p className="text-sm text-muted-foreground">
          {schema.description || 'Fill out the form below to generate your contract. This form is dynamically generated from the uploaded .json schema file with strict JSON parsing and validation.'}
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(schema.properties).map(([key, prop]: [string, any]) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium">
              {prop.title || key}
              {schema.required?.includes(key) && <span className="text-destructive ml-1">*</span>}
            </label>
            {prop.type === 'string' && prop.format === 'textarea' ? (
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border rounded-md disabled:opacity-50"
                value={formData[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={prop.description}
                disabled={!hasEnhancedAccess}
              />
            ) : prop.type === 'string' && prop.format === 'date' ? (
              <Input
                type="date"
                value={formData[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                disabled={!hasEnhancedAccess}
              />
            ) : prop.type === 'number' ? (
              <Input
                type="number"
                value={formData[key] || ''}
                onChange={(e) => handleChange(key, parseFloat(e.target.value))}
                placeholder={prop.description}
                disabled={!hasEnhancedAccess}
              />
            ) : prop.type === 'boolean' ? (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData[key] || false}
                  onChange={(e) => handleChange(key, e.target.checked)}
                  className="h-4 w-4 disabled:opacity-50"
                  disabled={!hasEnhancedAccess}
                />
                <span className="text-sm text-muted-foreground">{prop.description}</span>
              </div>
            ) : (
              <Input
                type="text"
                value={formData[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={prop.description}
                disabled={!hasEnhancedAccess}
              />
            )}
          </div>
        ))}
      </div>

      <Button 
        className="w-full" 
        onClick={onSubmit}
        disabled={!hasEnhancedAccess}
      >
        {hasEnhancedAccess ? 'Submit Form' : 'Subscribe to Submit'}
      </Button>
    </div>
  );
}
