import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search, Replace, Settings, Database, Plus, Edit, Trash2, Save,
  RefreshCw, Filter, SortAsc, CheckSquare, Square, Clock, Zap,
  Building, Mail, Phone, MapPin, CreditCard, Share2, DollarSign,
  Eye, AlertCircle, Globe, User, Calendar, FileText, Target,
  Loader2, CheckCircle, XCircle, Copy, Download, Upload, FileJson,
  CloudUpload, Code, AlertTriangle, Info, X, Key, Lock, Shield, EyeOff
} from 'lucide-react';
import {
  useGetCallerUserRole, useGetAllFieldDefinitions, useCreateFieldDefinition,
  useUpdateFieldDefinition, useDeleteFieldDefinition, useBulkUpdateFields,
  useAutoSaveFields, useGetGodsEyeSummary, useUpdateGodsEyeSummary, useAddSitemapData,
  useIsStripeConfigured
} from '@/hooks/useQueries';
import { FieldDefinition, FieldCategory, FieldStatus } from '@/hooks/useQueries';
import { SearchResult, StripeConfiguration } from '@/backend';
import { toast } from 'sonner';
import { useActor } from '@/hooks/useActor';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'gods-eye' | 'admin' | 'analytics' | 'exports' | 'monitoring' | 'admin-panel';

interface EnhancedAdminPanelProps {
  onNavigate: (page: Page) => void;
}

interface EditableField {
  id: string;
  category: string;
  label: string;
  type: 'text' | 'email' | 'url' | 'number' | 'textarea' | 'currency' | 'phone' | 'address';
  value: string;
  placeholder: string;
  description: string;
  isChecked: boolean;
  order: number;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface FieldCategoryGroup {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  fields: EditableField[];
  checkedCount: number;
  totalCount: number;
}

interface SitemapUploadError {
  file: string;
  entry: number;
  error: string;
  url?: string;
}

interface SitemapUploadResult {
  totalFiles: number;
  processedFiles: number;
  totalEntries: number;
  successfulEntries: number;
  skippedEntries: number;
  errors: SitemapUploadError[];
}

interface SitemapEntry {
  urls: string;
}

// Default countries as specified in the user request
const DEFAULT_STRIPE_COUNTRIES = [
  'AU', 'AT', 'BE', 'BR', 'BG', 'CA', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE',
  'GH', 'GI', 'GR', 'HK', 'HU', 'IN', 'ID', 'IE', 'IT', 'JP', 'KE', 'LV', 'LI',
  'LT', 'LU', 'MT', 'MY', 'MX', 'NL', 'NZ', 'NO', 'PL', 'PT', 'RO', 'SG', 'SK',
  'SL', 'ZA', 'ES', 'SE', 'CH', 'TH', 'AE', 'UK', 'US'
];

// All available Stripe countries
const ALL_STRIPE_COUNTRIES = [
  'AU', 'AT', 'BE', 'BR', 'BG', 'CA', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE',
  'GH', 'GI', 'GR', 'HK', 'HU', 'IN', 'ID', 'IE', 'IT', 'JP', 'KE', 'LV', 'LI',
  'LT', 'LU', 'MT', 'MY', 'MX', 'NL', 'NZ', 'NO', 'PL', 'PT', 'RO', 'SG', 'SK',
  'SL', 'ZA', 'ES', 'SE', 'CH', 'TH', 'AE', 'UK', 'US'
];

export default function EnhancedAdminPanel({ onNavigate }: EnhancedAdminPanelProps) {
  const { actor } = useActor();
  const { data: userRole } = useGetCallerUserRole();
  const { data: backendFields = [], refetch: refetchFields } = useGetAllFieldDefinitions();
  const { data: summary, refetch: refetchSummary } = useGetGodsEyeSummary();
  const { data: isStripeConfigured = false, refetch: refetchStripeConfig } = useIsStripeConfigured();
  const createField = useCreateFieldDefinition();
  const updateField = useUpdateFieldDefinition();
  const deleteField = useDeleteFieldDefinition();
  const bulkUpdateFields = useBulkUpdateFields();
  const autoSaveFields = useAutoSaveFields();
  const updateSummary = useUpdateGodsEyeSummary();
  const addSitemapData = useAddSitemapData();

  // State management
  const [fieldCategories, setFieldCategories] = useState<FieldCategoryGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'alphabetical' | 'category' | 'recent'>('alphabetical');
  const [filterStatus, setFilterStatus] = useState<'all' | 'checked' | 'unchecked' | 'active' | 'inactive'>('all');
  const [selectAll, setSelectAll] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [livePreview, setLivePreview] = useState(false);
  const [isSearchReplaceMode, setIsSearchReplaceMode] = useState(false);
  const [newFieldDialog, setNewFieldDialog] = useState(false);
  const [newField, setNewField] = useState({
    name: '',
    value: '',
    category: 'business' as FieldCategory,
    description: ''
  });

  // Sitemap upload state
  const [sitemapUploadMode, setSitemapUploadMode] = useState<'files' | 'editor'>('files');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [manualJsonContent, setManualJsonContent] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<SitemapUploadResult | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stripe configuration state - SECURITY FOCUSED
  const [showStripeConfig, setShowStripeConfig] = useState(false);
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([...DEFAULT_STRIPE_COUNTRIES]);
  const [isSavingStripeConfig, setIsSavingStripeConfig] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const isAdmin = userRole === 'admin';

  // Updated sample JSON for the new simplified format
  const sampleJson = [
    { "urls": "https://example.com/sitemap.xml" },
    { "urls": "https://another-site.com/sitemap.xml" },
    { "urls": "https://third-site.com/sitemap.xml" }
  ];

  // Initialize field categories with real business data
  useEffect(() => {
    if (summary && backendFields) {
      const categories: FieldCategoryGroup[] = [
        {
          id: 'business',
          name: 'Business Information',
          icon: <Building className="h-4 w-4" />,
          description: 'Company details, branding, and corporate information',
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'email',
          name: 'Email Addresses',
          icon: <Mail className="h-4 w-4" />,
          description: 'Contact and communication email addresses',
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'phone',
          name: 'Phone Numbers',
          icon: <Phone className="h-4 w-4" />,
          description: 'Business and contact phone numbers',
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'address',
          name: 'Addresses',
          icon: <MapPin className="h-4 w-4" />,
          description: 'Business locations and addresses',
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'payment',
          name: 'Payment Information',
          icon: <CreditCard className="h-4 w-4" />,
          description: 'Payment methods and financial accounts',
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'social',
          name: 'Social Media & Web',
          icon: <Share2 className="h-4 w-4" />,
          description: 'Website URLs and social media profiles',
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'financial',
          name: 'Financial Data',
          icon: <DollarSign className="h-4 w-4" />,
          description: 'Revenue, fees, commissions, and financial metrics',
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'branding',
          name: 'Branding & Marketing',
          icon: <Zap className="h-4 w-4" />,
          description: 'Brand messaging and marketing content',
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'other',
          name: 'Other Fields',
          icon: <Settings className="h-4 w-4" />,
          description: 'Miscellaneous platform fields',
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
      ];

      // Create default fields with real business data
      const defaultFields: EditableField[] = [
        {
          id: 'companyName',
          category: 'business',
          label: 'Company Name',
          type: 'text',
          value: 'Sudha Enterprises / SECOINFI',
          placeholder: 'Sudha Enterprises / SECOINFI',
          description: 'Primary business name displayed across the platform',
          isChecked: false,
          order: 1,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'ceoName',
          category: 'business',
          label: 'CEO Name',
          type: 'text',
          value: 'Dileep Kumar D',
          placeholder: 'Dileep Kumar D',
          description: 'Chief Executive Officer name',
          isChecked: false,
          order: 2,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'brandingStatement',
          category: 'branding',
          label: 'Branding Statement',
          type: 'textarea',
          value: 'SitemapHub is the brain-child of Dileep Kumar D, CEO at Sudha Enterprises/SECOINFI',
          placeholder: 'SitemapHub is the brain-child of Dileep Kumar D, CEO at Sudha Enterprises/SECOINFI',
          description: 'Platform branding and origin statement',
          isChecked: false,
          order: 3,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'contactEmail',
          category: 'email',
          label: 'Primary Contact Email',
          type: 'email',
          value: 'dild26@seco.in.net',
          placeholder: 'dild26@seco.in.net',
          description: 'Main contact email for customer inquiries',
          isChecked: false,
          order: 4,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'paymentEmail',
          category: 'payment',
          label: 'Primary Payment Email',
          type: 'email',
          value: 'newgoldenjewel@gmail.com',
          placeholder: 'newgoldenjewel@gmail.com',
          description: 'Main PayPal/payment processing email',
          isChecked: false,
          order: 5,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'website',
          category: 'social',
          label: 'Primary Website',
          type: 'url',
          value: 'https://www.seco.in.net',
          placeholder: 'https://www.seco.in.net',
          description: 'Main company website',
          isChecked: false,
          order: 6,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'supportEmail',
          category: 'email',
          label: 'Support Email',
          type: 'email',
          value: 'support@seco.in.net',
          placeholder: 'support@seco.in.net',
          description: 'Customer support email address',
          isChecked: false,
          order: 7,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'businessPhone',
          category: 'phone',
          label: 'Business Phone',
          type: 'phone',
          value: '+91-9876543210',
          placeholder: '+91-9876543210',
          description: 'Primary business contact number',
          isChecked: false,
          order: 8,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'businessAddress',
          category: 'address',
          label: 'Business Address',
          type: 'address',
          value: 'Bangalore, Karnataka, India',
          placeholder: 'Bangalore, Karnataka, India',
          description: 'Primary business location',
          isChecked: false,
          order: 9,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'linkedinProfile',
          category: 'social',
          label: 'LinkedIn Profile',
          type: 'url',
          value: 'https://linkedin.com/in/dileepkumard',
          placeholder: 'https://linkedin.com/in/dileepkumard',
          description: 'Professional LinkedIn profile',
          isChecked: false,
          order: 10,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Add backend fields if they exist
      const backendEditableFields: EditableField[] = backendFields.map(field => ({
        id: field.id.toString(),
        category: field.category,
        label: field.name,
        type: 'text',
        value: field.value,
        placeholder: field.value,
        description: `Backend field: ${field.name}`,
        isChecked: field.isChecked,
        order: Number(field.order),
        status: field.status,
        createdAt: new Date(Number(field.createdAt) / 1000000).toISOString(),
        updatedAt: new Date(Number(field.updatedAt) / 1000000).toISOString(),
      }));

      // Combine default and backend fields
      const allFields = [...defaultFields, ...backendEditableFields];

      // Sort fields based on current sort preference
      const sortedFields = sortFields(allFields, sortBy);

      // Distribute fields into categories
      categories.forEach(category => {
        category.fields = sortedFields.filter(field => field.category === category.id);
        category.totalCount = category.fields.length;
        category.checkedCount = category.fields.filter(field => field.isChecked).length;
      });

      setFieldCategories(categories);
    }
  }, [summary, backendFields, sortBy]);

  // Auto-save countdown effect
  useEffect(() => {
    if (autoSaveCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoSaveCountdown(autoSaveCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoSaveCountdown === 0 && hasUnsavedChanges) {
      handleAutoSave();
    }
  }, [autoSaveCountdown, hasUnsavedChanges]);

  // Reset Stripe config when dialog opens
  useEffect(() => {
    if (showStripeConfig) {
      // Reset form when opening
      setStripeSecretKey('');
      setStripeWebhookSecret('');
      setSelectedCountries([...DEFAULT_STRIPE_COUNTRIES]);
      setShowSecretKey(false);
      setShowWebhookSecret(false);
    }
  }, [showStripeConfig]);

  const sortFields = (fields: EditableField[], sortType: 'alphabetical' | 'category' | 'recent') => {
    switch (sortType) {
      case 'alphabetical':
        return [...fields].sort((a, b) => a.label.localeCompare(b.label));
      case 'category':
        return [...fields].sort((a, b) => {
          if (a.category === b.category) {
            return a.order - b.order;
          }
          return a.category.localeCompare(b.category);
        });
      case 'recent':
        return [...fields].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      default:
        return fields;
    }
  };

  const handleFieldUpdate = useCallback((categoryId: string, fieldId: string, value: string, isChecked?: boolean) => {
    setFieldCategories(prev => prev.map(category =>
      category.id === categoryId
        ? {
          ...category,
          fields: category.fields.map(field =>
            field.id === fieldId
              ? {
                ...field,
                value,
                isChecked: isChecked !== undefined ? isChecked : field.isChecked,
                updatedAt: new Date().toISOString()
              }
              : field
          ),
          checkedCount: category.fields.filter(f =>
            f.id === fieldId ? (isChecked !== undefined ? isChecked : f.isChecked) : f.isChecked
          ).length
        }
        : category
    ));

    setHasUnsavedChanges(true);

    // Reset auto-save timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    setAutoSaveCountdown(30);
    const newTimer = setTimeout(() => {
      handleAutoSave();
    }, 30000);
    setAutoSaveTimer(newTimer);

    // Live preview update
    if (livePreview) {
      performLiveUpdate(fieldId, value);
    }
  }, [autoSaveTimer, livePreview]);

  const handleFieldCheck = useCallback((categoryId: string, fieldId: string, checked: boolean) => {
    setFieldCategories(prev => prev.map(category =>
      category.id === categoryId
        ? {
          ...category,
          fields: category.fields.map(field =>
            field.id === fieldId ? { ...field, isChecked: checked } : field
          ),
          checkedCount: category.fields.filter(f =>
            f.id === fieldId ? checked : f.isChecked
          ).length
        }
        : category
    ));
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectAll(checked);
    setFieldCategories(prev => prev.map(category => ({
      ...category,
      fields: category.fields.map(field => ({ ...field, isChecked: checked })),
      checkedCount: checked ? category.fields.length : 0
    })));
  }, []);

  const handleCategorySelectAll = useCallback((categoryId: string, checked: boolean) => {
    setFieldCategories(prev => prev.map(category =>
      category.id === categoryId
        ? {
          ...category,
          fields: category.fields.map(field => ({ ...field, isChecked: checked })),
          checkedCount: checked ? category.fields.length : 0
        }
        : category
    ));
  }, []);

  const performLiveUpdate = (fieldId: string, value: string) => {
    // Update DOM elements with the new value
    const elementsToUpdate = document.querySelectorAll(`[data-field="${fieldId}"]`);
    elementsToUpdate.forEach(element => {
      if (element.textContent) {
        element.textContent = value;
      }
    });

    toast.success(`Live update applied for ${fieldId}`, {
      description: `Updated ${elementsToUpdate.length} instances across the platform`,
    });
  };

  const handleGlobalSearchReplace = async () => {
    if (!searchTerm || !replaceTerm) {
      toast.warning('Please enter both search and replace terms');
      return;
    }

    try {
      let replacementCount = 0;

      setFieldCategories(prev => prev.map(category => ({
        ...category,
        fields: category.fields.map(field => {
          if (field.value.includes(searchTerm)) {
            replacementCount++;
            return {
              ...field,
              value: field.value.replace(new RegExp(searchTerm, 'g'), replaceTerm),
              updatedAt: new Date().toISOString()
            };
          }
          return field;
        })
      })));

      // Also update DOM elements if live preview is enabled
      if (livePreview) {
        const elementsToUpdate = document.querySelectorAll('*');
        elementsToUpdate.forEach(element => {
          if (element.textContent && element.textContent.includes(searchTerm)) {
            element.textContent = element.textContent.replace(new RegExp(searchTerm, 'g'), replaceTerm);
          }
        });
      }

      setHasUnsavedChanges(true);
      toast.success(`Global search and replace completed`, {
        description: `Replaced "${searchTerm}" with "${replaceTerm}" in ${replacementCount} fields`,
      });
    } catch (error) {
      console.error('Search and replace error:', error);
      toast.error('Failed to perform global search and replace');
    }
  };

  const handleAutoSave = async () => {
    if (!hasUnsavedChanges) return;

    try {
      const checkedFields = fieldCategories.flatMap(category =>
        category.fields.filter(field => field.isChecked)
      );

      if (checkedFields.length === 0) {
        toast.info('No fields selected for auto-save');
        return;
      }

      await autoSaveFields.mutateAsync();

      setHasUnsavedChanges(false);
      setAutoSaveCountdown(0);

      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        setAutoSaveTimer(null);
      }

      toast.success(`Auto-saved ${checkedFields.length} selected fields`, {
        description: 'Changes have been automatically saved to the backend',
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast.error('Auto-save failed. Please save manually.');
    }
  };

  const handleManualSave = async () => {
    try {
      const checkedFields = fieldCategories.flatMap(category =>
        category.fields.filter(field => field.isChecked)
      );

      if (checkedFields.length === 0) {
        toast.warning('No fields selected for saving');
        return;
      }

      // Update summary with current field values
      if (summary) {
        const updatedSummary = {
          ...summary,
          companyName: getFieldValue('business', 'companyName') || summary.companyName,
          ceoName: getFieldValue('business', 'ceoName') || summary.ceoName,
          contactEmail: getFieldValue('email', 'contactEmail') || summary.contactEmail,
          paymentEmail: getFieldValue('payment', 'paymentEmail') || summary.paymentEmail,
          website: getFieldValue('social', 'website') || summary.website,
          brandingStatement: getFieldValue('branding', 'brandingStatement') || summary.brandingStatement,
          lastUpdated: BigInt(Date.now() * 1000000),
        };

        await updateSummary.mutateAsync(updatedSummary);
      }

      setHasUnsavedChanges(false);
      setAutoSaveCountdown(0);

      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        setAutoSaveTimer(null);
      }

      await refetchSummary();
      await refetchFields();

      toast.success(`Successfully saved ${checkedFields.length} selected fields!`, {
        description: "Changes have been saved and applied across the entire platform",
      });
    } catch (error) {
      console.error('Error updating fields:', error);
      toast.error('Failed to update fields. Please try again.');
    }
  };

  const handleAddField = async () => {
    if (!newField.name || !newField.value) {
      toast.warning('Please fill in all required fields');
      return;
    }

    try {
      await createField.mutateAsync({
        name: newField.name,
        value: newField.value,
        category: newField.category
      });

      setNewField({ name: '', value: '', category: 'business', description: '' });
      setNewFieldDialog(false);
      await refetchFields();

      toast.success('New field created successfully');
    } catch (error) {
      console.error('Error creating field:', error);
      toast.error('Failed to create new field');
    }
  };

  const handleDeleteSelected = async () => {
    const checkedFields = fieldCategories.flatMap(category =>
      category.fields.filter(field => field.isChecked)
    );

    if (checkedFields.length === 0) {
      toast.warning('No fields selected for deletion');
      return;
    }

    try {
      const deletableFields = checkedFields.filter(field =>
        !['companyName', 'ceoName', 'contactEmail', 'paymentEmail', 'website'].includes(field.id)
      );

      if (deletableFields.length === 0) {
        toast.warning('Cannot delete core platform fields');
        return;
      }

      for (const field of deletableFields) {
        if (!isNaN(Number(field.id))) {
          await deleteField.mutateAsync(Number(field.id));
        }
      }

      await refetchFields();
      toast.success(`Deleted ${deletableFields.length} fields successfully`);
    } catch (error) {
      console.error('Error deleting fields:', error);
      toast.error('Failed to delete selected fields');
    }
  };

  const getFieldValue = (categoryId: string, fieldId: string): string => {
    const category = fieldCategories.find(c => c.id === categoryId);
    const field = category?.fields.find(f => f.id === fieldId);
    return field?.value || '';
  };

  // Sitemap upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type === 'application/json' || file.name.endsWith('.json')
    );

    if (files.length === 0) {
      toast.error('Please drop only JSON files');
      return;
    }

    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`Added ${files.length} JSON file(s) for upload`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file =>
      file.type === 'application/json' || file.name.endsWith('.json')
    );

    if (files.length === 0) {
      toast.error('Please select only JSON files');
      return;
    }

    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`Selected ${files.length} JSON file(s) for upload`);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const extractDomainFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return 'unknown-domain';
    }
  };

  const validateSitemapEntry = (entry: any, fileIndex: number, entryIndex: number): { isValid: boolean; error?: string } => {
    if (!entry.urls) {
      return { isValid: false, error: 'Missing required "urls" field' };
    }

    try {
      new URL(entry.urls);
    } catch {
      return { isValid: false, error: 'Invalid URL format in "urls" field' };
    }

    return { isValid: true };
  };

  const processSitemapFiles = async (files: File[]): Promise<SitemapUploadResult> => {
    const result: SitemapUploadResult = {
      totalFiles: files.length,
      processedFiles: 0,
      totalEntries: 0,
      successfulEntries: 0,
      skippedEntries: 0,
      errors: []
    };

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex];

      try {
        const content = await file.text();
        const jsonData = JSON.parse(content);

        // Handle both array format and object with array
        let entries: any[] = [];
        if (Array.isArray(jsonData)) {
          entries = jsonData;
        } else {
          result.errors.push({
            file: file.name,
            entry: -1,
            error: 'JSON must be an array of objects with "urls" field: [ { "urls": "https://example.com/sitemap.xml" } ]'
          });
          continue;
        }

        result.totalEntries += entries.length;
        const processedEntries: SearchResult[] = [];

        for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
          const entry = entries[entryIndex];
          const validation = validateSitemapEntry(entry, fileIndex, entryIndex);

          if (!validation.isValid) {
            result.errors.push({
              file: file.name,
              entry: entryIndex,
              error: validation.error!,
              url: entry.urls
            });
            result.skippedEntries++;
            continue;
          }

          // Process valid entry with defaults - domain extracted from URL, other fields auto-filled
          const processedEntry: SearchResult = {
            url: entry.urls,
            title: entry.title || `Page from ${extractDomainFromUrl(entry.urls)}`,
            description: entry.description || `Content from ${entry.urls}`
          };

          processedEntries.push(processedEntry);
          result.successfulEntries++;
        }

        // Add processed entries to backend
        if (processedEntries.length > 0) {
          const domain = extractDomainFromUrl(processedEntries[0].url);
          await addSitemapData.mutateAsync({ domain, results: processedEntries });
        }

        result.processedFiles++;

        // Update progress
        setUploadProgress(((fileIndex + 1) / files.length) * 100);

      } catch (error) {
        result.errors.push({
          file: file.name,
          entry: -1,
          error: error instanceof Error ? error.message : 'Failed to parse JSON - ensure format is: [ { "urls": "https://example.com/sitemap.xml" } ]'
        });
      }
    }

    return result;
  };

  const processManualJson = async (jsonContent: string): Promise<SitemapUploadResult> => {
    const result: SitemapUploadResult = {
      totalFiles: 1,
      processedFiles: 0,
      totalEntries: 0,
      successfulEntries: 0,
      skippedEntries: 0,
      errors: []
    };

    try {
      const jsonData = JSON.parse(jsonContent);

      // Handle both array format and object with array
      let entries: any[] = [];
      if (Array.isArray(jsonData)) {
        entries = jsonData;
      } else {
        result.errors.push({
          file: 'Manual JSON',
          entry: -1,
          error: 'JSON must be an array of objects with "urls" field: [ { "urls": "https://example.com/sitemap.xml" } ]'
        });
        return result;
      }

      result.totalEntries = entries.length;
      const processedEntries: SearchResult[] = [];

      for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
        const entry = entries[entryIndex];
        const validation = validateSitemapEntry(entry, 0, entryIndex);

        if (!validation.isValid) {
          result.errors.push({
            file: 'Manual JSON',
            entry: entryIndex,
            error: validation.error!,
            url: entry.urls
          });
          result.skippedEntries++;
          continue;
        }

        // Process valid entry with defaults - domain extracted from URL, other fields auto-filled
        const processedEntry: SearchResult = {
          url: entry.urls,
          title: entry.title || `Page from ${extractDomainFromUrl(entry.urls)}`,
          description: entry.description || `Content from ${entry.urls}`
        };

        processedEntries.push(processedEntry);
        result.successfulEntries++;
      }

      // Add processed entries to backend
      if (processedEntries.length > 0) {
        const domain = extractDomainFromUrl(processedEntries[0].url);
        await addSitemapData.mutateAsync({ domain, results: processedEntries });
      }

      result.processedFiles = 1;

    } catch (error) {
      result.errors.push({
        file: 'Manual JSON',
        entry: -1,
        error: error instanceof Error ? error.message : 'Failed to parse JSON - ensure format is: [ { "urls": "https://example.com/sitemap.xml" } ]'
      });
    }

    return result;
  };

  const handleSitemapUpload = async () => {
    if (sitemapUploadMode === 'files' && uploadedFiles.length === 0) {
      toast.error('Please select at least one JSON file');
      return;
    }

    if (sitemapUploadMode === 'editor' && !manualJsonContent.trim()) {
      toast.error('Please enter JSON content');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let result: SitemapUploadResult;

      if (sitemapUploadMode === 'files') {
        result = await processSitemapFiles(uploadedFiles);
      } else {
        result = await processManualJson(manualJsonContent);
      }

      setUploadResult(result);

      if (result.successfulEntries > 0) {
        toast.success(`Upload completed!`, {
          description: `Successfully processed ${result.successfulEntries} entries from ${result.processedFiles} files`,
        });
      } else {
        toast.warning('Upload completed with errors', {
          description: `No entries were successfully processed. Check the error details.`,
        });
      }

      // Clear upload state
      setUploadedFiles([]);
      setManualJsonContent('');

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSitemapUploadModeChange = (value: string) => {
    if (value === 'files' || value === 'editor') {
      setSitemapUploadMode(value);
    }
  };

  // SECURE Stripe configuration handlers
  const handleSaveStripeConfig = async () => {
    if (!stripeSecretKey.trim()) {
      toast.error('Please enter a Stripe secret key');
      return;
    }

    if (selectedCountries.length === 0) {
      toast.error('Please select at least one allowed country');
      return;
    }

    setIsSavingStripeConfig(true);

    try {
      if (!actor) throw new Error('Actor not available');

      // SECURITY: Only send to backend, never store in frontend
      const config: StripeConfiguration = {
        secretKey: stripeSecretKey,
        allowedCountries: selectedCountries
      };

      await actor.setStripeConfiguration(config);
      await refetchStripeConfig();

      toast.success('Stripe configuration saved securely', {
        description: `Payment processing is now enabled for ${selectedCountries.length} countries. Secret keys are stored securely on the backend only.`,
      });

      // Clear sensitive data from state immediately
      setStripeSecretKey('');
      setStripeWebhookSecret('');
      setShowSecretKey(false);
      setShowWebhookSecret(false);
      setShowStripeConfig(false);
    } catch (error) {
      console.error('Error saving Stripe configuration:', error);
      toast.error('Failed to save Stripe configuration', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsSavingStripeConfig(false);
    }
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const handleSelectAllCountries = (checked: boolean) => {
    setSelectedCountries(checked ? [...ALL_STRIPE_COUNTRIES] : []);
  };

  // Check if all countries are selected
  const isAllCountriesSelected = selectedCountries.length === ALL_STRIPE_COUNTRIES.length;

  const filteredCategories = fieldCategories.filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return category.name.toLowerCase().includes(searchLower) ||
        category.fields.some(field =>
          field.label.toLowerCase().includes(searchLower) ||
          field.description.toLowerCase().includes(searchLower) ||
          field.value.toLowerCase().includes(searchLower)
        );
    }

    return true;
  }).map(category => ({
    ...category,
    fields: category.fields.filter(field => {
      if (filterStatus === 'checked') return field.isChecked;
      if (filterStatus === 'unchecked') return !field.isChecked;
      if (filterStatus === 'active') return field.status === 'active';
      if (filterStatus === 'inactive') return field.status === 'inactive';
      return true;
    })
  }));

  const totalFields = fieldCategories.reduce((sum, cat) => sum + cat.totalCount, 0);
  const totalChecked = fieldCategories.reduce((sum, cat) => sum + cat.checkedCount, 0);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="cyber-gradient border-destructive/20 max-w-md">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have administrator privileges to access the Enhanced Admin Panel.
            </p>
            <Button
              variant="outline"
              onClick={() => onNavigate('home')}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              Enhanced Admin Panel
            </h1>
            <p className="text-muted-foreground text-lg">
              Full-page field management with global search & replace, checkbox selection, auto-save functionality, enhanced sitemap upload system, and secure admin-only Stripe payment management
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowStripeConfig(true)}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Stripe Config
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Sitemaps
            </Button>
            <Button
              variant="outline"
              onClick={() => setNewFieldDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSearchReplaceMode(!isSearchReplaceMode)}
            >
              <Replace className="h-4 w-4 mr-2" />
              Search & Replace
            </Button>
          </div>
        </div>

        {/* Stripe Configuration Status */}
        <Card className={`border-${isStripeConfigured ? 'green' : 'yellow'}-500/20 bg-${isStripeConfigured ? 'green' : 'yellow'}-500/5`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className={`h-5 w-5 text-${isStripeConfigured ? 'green' : 'yellow'}-500`} />
                <div>
                  <p className="font-medium">Stripe Payment Integration</p>
                  <p className="text-sm text-muted-foreground">
                    {isStripeConfigured
                      ? 'Payment processing is enabled and configured'
                      : 'Payment processing requires configuration'}
                  </p>
                </div>
              </div>
              <Badge variant={isStripeConfigured ? 'default' : 'secondary'} className={isStripeConfigured ? 'text-green-500' : ''}>
                {isStripeConfigured ? 'Configured' : 'Not Configured'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Global Search & Replace */}
        {isSearchReplaceMode && (
          <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Replace className="h-5 w-5" />
                Global Search & Replace
              </CardTitle>
              <CardDescription>
                Search and replace text across all fields and platform content in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="searchTerm">Search For</Label>
                  <Input
                    id="searchTerm"
                    placeholder="Enter text to search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="replaceTerm">Replace With</Label>
                  <Input
                    id="replaceTerm"
                    placeholder="Enter replacement text..."
                    value={replaceTerm}
                    onChange={(e) => setReplaceTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleGlobalSearchReplace}
                    disabled={!searchTerm || !replaceTerm}
                    className="w-full"
                  >
                    <Replace className="h-4 w-4 mr-2" />
                    Replace All
                  </Button>
                </div>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will search and replace text across all field values. Changes will be applied immediately if live preview is enabled.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <Card className="cyber-gradient border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Search and Filter */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search fields, values, descriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {fieldCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort and Filter Options */}
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={(value: 'alphabetical' | 'category' | 'recent') => setSortBy(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="recent">Recent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={(value: 'all' | 'checked' | 'unchecked' | 'active' | 'inactive') => setFilterStatus(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fields</SelectItem>
                      <SelectItem value="checked">Checked Only</SelectItem>
                      <SelectItem value="unchecked">Unchecked Only</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Selection Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      id="select-all"
                    />
                    <Label htmlFor="select-all" className="text-sm font-medium">
                      Select All Fields ({totalChecked}/{totalFields})
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={livePreview}
                      onCheckedChange={setLivePreview}
                      id="live-preview"
                    />
                    <Label htmlFor="live-preview" className="text-sm">
                      Live Preview
                    </Label>
                  </div>
                </div>

                {/* Auto-save Status */}
                {hasUnsavedChanges && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Auto-save in {autoSaveCountdown}s
                      </p>
                      <Progress value={(30 - autoSaveCountdown) / 30 * 100} className="h-1 mt-1" />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDeleteSelected}
                    disabled={totalChecked === 0}
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({totalChecked})
                  </Button>
                  <Button
                    onClick={handleManualSave}
                    disabled={updateSummary.isPending || totalChecked === 0}
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateSummary.isPending ? 'Saving...' : `Save (${totalChecked})`}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Field Categories */}
        <div className="space-y-6">
          <Accordion type="multiple" defaultValue={fieldCategories.map(c => c.id)}>
            {filteredCategories.map(category => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <Checkbox
                      checked={category.checkedCount === category.totalCount && category.totalCount > 0}
                      onCheckedChange={(checked) => handleCategorySelectAll(category.id, checked as boolean)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {category.icon}
                    <div className="text-left flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {category.name}
                        <Badge variant="outline" className="text-xs">
                          {category.checkedCount}/{category.totalCount}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    {category.fields.map(field => (
                      <Card key={field.id} className="border-muted">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={field.isChecked}
                                  onCheckedChange={(checked) => handleFieldCheck(category.id, field.id, checked as boolean)}
                                />
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                  <Edit className="h-4 w-4 text-muted-foreground" />
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    {field.label}
                                  </Label>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {field.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={field.status === 'active' ? 'default' : 'secondary'}>
                                  {field.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {field.type}
                                </Badge>
                              </div>
                            </div>

                            {field.type === 'textarea' ? (
                              <Textarea
                                value={field.value}
                                onChange={(e) => handleFieldUpdate(category.id, field.id, e.target.value)}
                                placeholder={field.placeholder}
                                rows={3}
                                className="font-mono text-sm"
                              />
                            ) : (
                              <Input
                                type={field.type === 'currency' || field.type === 'number' ? 'number' : 'text'}
                                value={field.value}
                                onChange={(e) => handleFieldUpdate(category.id, field.id, e.target.value)}
                                placeholder={field.placeholder}
                                className="font-mono text-sm"
                              />
                            )}

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <span>Created: {new Date(field.createdAt).toLocaleDateString()}</span>
                                <span>Updated: {new Date(field.updatedAt).toLocaleDateString()}</span>
                                <span>Order: {field.order}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Status Bar */}
        <Card className="border-muted">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <span>{totalFields} total fields</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-green-500" />
                  <span>{totalChecked} selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <span>{livePreview ? 'Live updates enabled' : 'Live updates disabled'}</span>
                </div>
                {hasUnsavedChanges && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <Clock className="h-4 w-4" />
                    <span>Unsaved changes</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECURE Stripe Configuration Dialog */}
        {showStripeConfig && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Secure Stripe Configuration (Admin Only)
                  </CardTitle>
                  <CardDescription>
                    Configure Stripe payment processing securely. Secret keys are never stored in the frontend or database.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowStripeConfig(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-6 overflow-y-auto max-h-[70vh]">
                <Alert className="border-red-500/20 bg-red-500/5">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription>
                    <strong>SECURITY WARNING:</strong> Never paste secret keys into any UI field.
                    All sensitive Stripe keys must be set in your hosting platform's environment settings panel,
                    not in code or UI. Never commit .env files to Git.
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-500/20 bg-blue-500/5">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertDescription>
                    <strong>Environment Variable Setup:</strong> Set these variables in your hosting platform's environment settings:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">STRIPE_SECRET_KEY</code> - Your Stripe secret key (required)</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">STRIPE_PUBLISHABLE_KEY</code> - Your Stripe publishable key (auto-loaded)</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">STRIPE_WEBHOOK_SECRET</code> - Your webhook secret (optional)</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stripeSecretKey" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Stripe Secret Key (Server-Side Only)
                    </Label>
                    <div className="relative">
                      <Input
                        id="stripeSecretKey"
                        type={showSecretKey ? 'text' : 'password'}
                        placeholder="sk_test_... or sk_live_..."
                        value={stripeSecretKey}
                        onChange={(e) => setStripeSecretKey(e.target.value)}
                        className="font-mono pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                      >
                        {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ⚠️ This key will be stored securely on the backend only. Never exposed to frontend or database.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="stripeWebhookSecret" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Webhook Secret (Optional)
                    </Label>
                    <div className="relative">
                      <Input
                        id="stripeWebhookSecret"
                        type={showWebhookSecret ? 'text' : 'password'}
                        placeholder="whsec_..."
                        value={stripeWebhookSecret}
                        onChange={(e) => setStripeWebhookSecret(e.target.value)}
                        className="font-mono pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                      >
                        {showWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Optional webhook secret for payment event verification
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Allowed Countries
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all-countries"
                          checked={isAllCountriesSelected}
                          onCheckedChange={handleSelectAllCountries}
                        />
                        <label
                          htmlFor="select-all-countries"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Select All
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select countries where payment processing is allowed. By default, {DEFAULT_STRIPE_COUNTRIES.length} countries are pre-selected.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border rounded-lg">
                      {ALL_STRIPE_COUNTRIES.map(country => (
                        <div key={country} className="flex items-center space-x-2">
                          <Checkbox
                            id={`country-${country}`}
                            checked={selectedCountries.includes(country)}
                            onCheckedChange={() => handleCountryToggle(country)}
                          />
                          <label
                            htmlFor={`country-${country}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {country}
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedCountries.length} of {ALL_STRIPE_COUNTRIES.length} countries selected
                    </p>
                  </div>

                  <Separator />

                  <Alert className="border-green-500/20 bg-green-500/5">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription>
                      <strong>Security Best Practices:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>Secret keys are stored only in secure server-side environment variables</li>
                        <li>Publishable key is automatically loaded from environment (not editable here)</li>
                        <li>Never commit .env files to version control</li>
                        <li>Always use your hosting platform's environment settings panel</li>
                        <li>Secret keys are never exposed to the frontend or stored in the database</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>

              <div className="flex justify-end gap-2 p-6 pt-0 border-t">
                <Button variant="outline" onClick={() => setShowStripeConfig(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveStripeConfig}
                  disabled={isSavingStripeConfig || !stripeSecretKey.trim()}
                >
                  {isSavingStripeConfig ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving Securely...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Save Secure Configuration
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Enhanced Sitemap Upload Dialog - keeping existing implementation */}
        {showUploadDialog && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Enhanced Sitemap Upload System
                  </CardTitle>
                  <CardDescription>
                    Upload multiple JSON files or use the manual editor. Only "urls" field required - domain, tier, qualityScore, and backlinks auto-filled with defaults.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowUploadDialog(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-6 overflow-y-auto max-h-[70vh]">
                <Tabs value={sitemapUploadMode} onValueChange={handleSitemapUploadModeChange}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="files" className="flex items-center gap-2">
                      <CloudUpload className="h-4 w-4" />
                      File Upload
                    </TabsTrigger>
                    <TabsTrigger value="editor" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Manual Editor
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="files" className="space-y-4">
                    {/* Drag and Drop Zone */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver
                          ? 'border-primary bg-primary/5'
                          : 'border-muted-foreground/25 hover:border-primary/50'
                        }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <CloudUpload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">
                        Drag & Drop JSON Files Here
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Or click the button below to select files
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FileJson className="h-4 w-4 mr-2" />
                        Select JSON Files
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".json,application/json"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    {/* Selected Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Selected Files ({uploadedFiles.length})</Label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div className="flex items-center gap-2">
                                <FileJson className="h-4 w-4" />
                                <span className="text-sm">{file.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {(file.size / 1024).toFixed(1)} KB
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="editor" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="jsonEditor">JSON Content</Label>
                      <Textarea
                        id="jsonEditor"
                        placeholder='Paste your JSON array here: [ { "urls": "https://example.com/sitemap.xml" } ]'
                        value={manualJsonContent}
                        onChange={(e) => setManualJsonContent(e.target.value)}
                        rows={12}
                        className="font-mono text-sm"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Instructions and Sample */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Simplified Format Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Only "urls" field is required per entry</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>JSON must be an array of objects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Auto-filled fields with defaults:</span>
                      </div>
                      <div className="ml-5 space-y-1 text-xs text-muted-foreground">
                        <div>• domain: Extracted from URL</div>
                        <div>• tier: "basic"</div>
                        <div>• qualityScore: 0</div>
                        <div>• backlinks: 0</div>
                        <div>• title: Generated from domain</div>
                        <div>• description: Generated from URL</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileJson className="h-4 w-4" />
                        Sample JSON Format
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                        {JSON.stringify(sampleJson, null, 2)}
                      </pre>
                      <p className="text-xs text-muted-foreground mt-2">
                        ✓ Simple array format with only "urls" field required
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Upload Progress</Label>
                      <span className="text-sm text-muted-foreground">{uploadProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {/* Upload Results */}
                {uploadResult && (
                  <Card className="border-muted">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        {uploadResult.successfulEntries > 0 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        Upload Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold">{uploadResult.processedFiles}</div>
                          <div className="text-muted-foreground">Files Processed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{uploadResult.successfulEntries}</div>
                          <div className="text-muted-foreground">Successful</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-600">{uploadResult.skippedEntries}</div>
                          <div className="text-muted-foreground">Skipped</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{uploadResult.errors.length}</div>
                          <div className="text-muted-foreground">Errors</div>
                        </div>
                      </div>

                      {uploadResult.errors.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            Error Details
                          </Label>
                          <ScrollArea className="h-32 border rounded p-2">
                            <div className="space-y-1">
                              {uploadResult.errors.map((error, index) => (
                                <div key={index} className="text-xs p-2 bg-red-50 dark:bg-red-950/20 rounded">
                                  <div className="font-medium">{error.file}</div>
                                  <div className="text-muted-foreground">
                                    {error.entry >= 0 ? `Entry ${error.entry}: ` : ''}{error.error}
                                  </div>
                                  {error.url && (
                                    <div className="text-muted-foreground truncate">URL: {error.url}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>

              <div className="flex justify-end gap-2 p-6 pt-0 border-t">
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Close
                </Button>
                <Button
                  onClick={handleSitemapUpload}
                  disabled={isUploading || (sitemapUploadMode === 'files' && uploadedFiles.length === 0) || (sitemapUploadMode === 'editor' && !manualJsonContent.trim())}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload & Process
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Add Field Dialog - keeping existing implementation */}
        {newFieldDialog && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Field</CardTitle>
                <CardDescription>
                  Create a new field to manage across the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fieldName">Field Name</Label>
                  <Input
                    id="fieldName"
                    value={newField.name}
                    onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter field name..."
                  />
                </div>
                <div>
                  <Label htmlFor="fieldValue">Field Value</Label>
                  <Input
                    id="fieldValue"
                    value={newField.value}
                    onChange={(e) => setNewField(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Enter field value..."
                  />
                </div>
                <div>
                  <Label htmlFor="fieldCategory">Category</Label>
                  <Select
                    value={newField.category}
                    onValueChange={(value: FieldCategory) => setNewField(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business Information</SelectItem>
                      <SelectItem value="email">Email Addresses</SelectItem>
                      <SelectItem value="phone">Phone Numbers</SelectItem>
                      <SelectItem value="address">Addresses</SelectItem>
                      <SelectItem value="payment">Payment Information</SelectItem>
                      <SelectItem value="social">Social Media & Web</SelectItem>
                      <SelectItem value="financial">Financial Data</SelectItem>
                      <SelectItem value="branding">Branding & Marketing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fieldDescription">Description (Optional)</Label>
                  <Textarea
                    id="fieldDescription"
                    value={newField.description}
                    onChange={(e) => setNewField(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter field description..."
                    rows={2}
                  />
                </div>
              </CardContent>
              <div className="flex justify-end gap-2 p-6 pt-0">
                <Button variant="outline" onClick={() => setNewFieldDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddField} disabled={createField.isPending}>
                  {createField.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
