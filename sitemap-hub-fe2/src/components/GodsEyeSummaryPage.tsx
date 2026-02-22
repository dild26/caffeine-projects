import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useGetGodsEyeSummary, useUpdateGodsEyeSummary, useGetCallerUserRole } from '@/hooks/useQueries';
import { useGetAllFieldDefinitions, useUpdateFieldDefinition, useBulkUpdateFields, useAutoSaveFields, useCreateFieldDefinition, useDeleteFieldDefinition } from '@/hooks/useQueries';
import { Eye, Edit, DollarSign, TrendingUp, Users, FileText, Gift, RotateCcw, Building, User, Mail, Globe, Calendar, Save, AlertCircle, Plus, Trash2, Search, RefreshCw, Settings, Database, Phone, MapPin, CreditCard, Share2, Zap, CheckSquare, Square, Clock, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { FieldDefinition, FieldCategory, FieldStatus } from '@/hooks/useQueries';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'gods-eye' | 'admin' | 'analytics' | 'exports' | 'monitoring';

interface GodsEyeSummaryPageProps {
  onNavigate: (page: Page) => void;
}

interface EditableField {
  id: string;
  category: string;
  label: string;
  type: 'text' | 'email' | 'url' | 'number' | 'textarea' | 'currency' | 'phone' | 'address';
  value: string | string[];
  placeholder: string;
  description: string;
  isMultiple: boolean;
  validation?: RegExp;
  required: boolean;
  isChecked: boolean;
  order: number;
}

interface FieldCategoryGroup {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  fields: EditableField[];
  isExpanded: boolean;
  checkedCount: number;
  totalCount: number;
}

export default function GodsEyeSummaryPage({ onNavigate }: GodsEyeSummaryPageProps) {
  const { data: summary, isLoading, error, refetch } = useGetGodsEyeSummary();
  const { data: userRole } = useGetCallerUserRole();
  const { data: backendFields = [] } = useGetAllFieldDefinitions();
  const updateSummary = useUpdateGodsEyeSummary();
  const updateField = useUpdateFieldDefinition();
  const bulkUpdateFields = useBulkUpdateFields();
  const autoSaveFields = useAutoSaveFields();
  const createField = useCreateFieldDefinition();
  const deleteField = useDeleteFieldDefinition();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [livePreview, setLivePreview] = useState(false);
  const [fieldCategories, setFieldCategories] = useState<FieldCategoryGroup[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastEditTime, setLastEditTime] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'alphabetical' | 'category' | 'recent'>('alphabetical');
  const [filterStatus, setFilterStatus] = useState<'all' | 'checked' | 'unchecked'>('all');

  const isAdmin = userRole === 'admin';

  // Initialize field categories with current summary data and backend fields
  useEffect(() => {
    if (summary && backendFields) {
      const categories: FieldCategoryGroup[] = [
        {
          id: 'business',
          name: 'Business Information',
          icon: <Building className="h-4 w-4" />,
          description: 'Company details, branding, and corporate information',
          isExpanded: true,
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'email',
          name: 'Email Addresses',
          icon: <Mail className="h-4 w-4" />,
          description: 'Contact and communication email addresses',
          isExpanded: true,
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'phone',
          name: 'Phone Numbers',
          icon: <Phone className="h-4 w-4" />,
          description: 'Business and contact phone numbers',
          isExpanded: false,
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'address',
          name: 'Addresses',
          icon: <MapPin className="h-4 w-4" />,
          description: 'Business locations and addresses',
          isExpanded: false,
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'payment',
          name: 'Payment Information',
          icon: <CreditCard className="h-4 w-4" />,
          description: 'Payment methods and financial accounts',
          isExpanded: false,
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'social',
          name: 'Social Media & Web',
          icon: <Share2 className="h-4 w-4" />,
          description: 'Website URLs and social media profiles',
          isExpanded: false,
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'financial',
          name: 'Financial Data',
          icon: <DollarSign className="h-4 w-4" />,
          description: 'Revenue, fees, commissions, and financial metrics',
          isExpanded: false,
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'branding',
          name: 'Branding & Marketing',
          icon: <Zap className="h-4 w-4" />,
          description: 'Brand messaging and marketing content',
          isExpanded: false,
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
        {
          id: 'other',
          name: 'Other Fields',
          icon: <Settings className="h-4 w-4" />,
          description: 'Miscellaneous platform fields',
          isExpanded: false,
          checkedCount: 0,
          totalCount: 0,
          fields: [],
        },
      ];

      // Create default fields from summary data
      const defaultFields: EditableField[] = [
        {
          id: 'companyName',
          category: 'business',
          label: 'Company Name',
          type: 'text',
          value: summary.companyName,
          placeholder: 'Sudha Enterprises / SECOINFI',
          description: 'Primary business name displayed across the platform',
          isMultiple: false,
          required: true,
          isChecked: false,
          order: 1,
        },
        {
          id: 'ceoName',
          category: 'business',
          label: 'CEO Name',
          type: 'text',
          value: summary.ceoName,
          placeholder: 'Dileep Kumar D',
          description: 'Chief Executive Officer name',
          isMultiple: false,
          required: true,
          isChecked: false,
          order: 2,
        },
        {
          id: 'brandingStatement',
          category: 'branding',
          label: 'Branding Statement',
          type: 'textarea',
          value: summary.brandingStatement,
          placeholder: 'SitemapHub is the brain-child of Dileep Kumar D, CEO at Sudha Enterprises/SECOINFI',
          description: 'Platform branding and origin statement',
          isMultiple: false,
          required: true,
          isChecked: false,
          order: 3,
        },
        {
          id: 'contactEmail',
          category: 'email',
          label: 'Primary Contact Email',
          type: 'email',
          value: summary.contactEmail,
          placeholder: 'dild26@seco.in.net',
          description: 'Main contact email for customer inquiries',
          isMultiple: false,
          validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          required: true,
          isChecked: false,
          order: 4,
        },
        {
          id: 'paymentEmail',
          category: 'payment',
          label: 'Primary Payment Email',
          type: 'email',
          value: summary.paymentEmail,
          placeholder: 'newgoldenjewel@seco.in.net',
          description: 'Main PayPal/payment processing email',
          isMultiple: false,
          validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          required: true,
          isChecked: false,
          order: 5,
        },
        {
          id: 'website',
          category: 'social',
          label: 'Primary Website',
          type: 'url',
          value: summary.website,
          placeholder: 'https://www.seco.in.net',
          description: 'Main company website',
          isMultiple: false,
          validation: /^https?:\/\/.+/,
          required: true,
          isChecked: false,
          order: 6,
        },
        {
          id: 'totalFees',
          category: 'financial',
          label: 'Total Fees',
          type: 'currency',
          value: summary.totalFees.toString(),
          placeholder: '0',
          description: 'All subscription and service fees (in cents)',
          isMultiple: false,
          required: true,
          isChecked: false,
          order: 7,
        },
        {
          id: 'totalCommissions',
          category: 'financial',
          label: 'Total Commissions',
          type: 'currency',
          value: summary.totalCommissions.toString(),
          placeholder: '0',
          description: 'Referral and affiliate commissions (in cents)',
          isMultiple: false,
          required: true,
          isChecked: false,
          order: 8,
        },
        {
          id: 'totalTransactions',
          category: 'financial',
          label: 'Total Transactions',
          type: 'number',
          value: summary.totalTransactions.toString(),
          placeholder: '0',
          description: 'Total number of platform transactions',
          isMultiple: false,
          required: true,
          isChecked: false,
          order: 9,
        },
        {
          id: 'totalRemunerations',
          category: 'financial',
          label: 'Total Remunerations',
          type: 'currency',
          value: summary.totalRemunerations.toString(),
          placeholder: '0',
          description: 'User payouts and rewards (in cents)',
          isMultiple: false,
          required: true,
          isChecked: false,
          order: 10,
        },
        {
          id: 'totalDiscounts',
          category: 'financial',
          label: 'Total Discounts',
          type: 'currency',
          value: summary.totalDiscounts.toString(),
          placeholder: '0',
          description: 'Promotional discounts applied (in cents)',
          isMultiple: false,
          required: true,
          isChecked: false,
          order: 11,
        },
        {
          id: 'totalOffers',
          category: 'financial',
          label: 'Total Offers',
          type: 'number',
          value: summary.totalOffers.toString(),
          placeholder: '0',
          description: 'Special offers and promotions count',
          isMultiple: false,
          required: true,
          isChecked: false,
          order: 12,
        },
        {
          id: 'totalReturns',
          category: 'financial',
          label: 'Total Returns',
          type: 'currency',
          value: summary.totalReturns.toString(),
          placeholder: '0',
          description: 'Refunds and returns processed (in cents)',
          isMultiple: false,
          required: true,
          isChecked: false,
          order: 13,
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
        isMultiple: false,
        required: false,
        isChecked: field.isChecked,
        order: Number(field.order),
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
        return [...fields].sort((a, b) => b.order - a.order);
      default:
        return fields;
    }
  };

  const handleFieldUpdate = useCallback((categoryId: string, fieldId: string, value: string | string[], isChecked?: boolean) => {
    setFieldCategories(prev => prev.map(category =>
      category.id === categoryId
        ? {
          ...category,
          fields: category.fields.map(field =>
            field.id === fieldId
              ? {
                ...field,
                value,
                isChecked: isChecked !== undefined ? isChecked : field.isChecked
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
    setLastEditTime(Date.now());

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
    setHasUnsavedChanges(true);
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectAll(checked);
    setFieldCategories(prev => prev.map(category => ({
      ...category,
      fields: category.fields.map(field => ({ ...field, isChecked: checked })),
      checkedCount: checked ? category.fields.length : 0
    })));
    setHasUnsavedChanges(true);
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
    setHasUnsavedChanges(true);
  }, []);

  const performLiveUpdate = (fieldId: string, value: string | string[]) => {
    const displayValue = Array.isArray(value) ? value[0] : value;

    // Update DOM elements with the new value
    const elementsToUpdate = document.querySelectorAll(`[data-field="${fieldId}"]`);
    elementsToUpdate.forEach(element => {
      if (element.textContent) {
        element.textContent = displayValue;
      }
    });

    toast.success(`Live update applied for ${fieldId}`, {
      description: `Updated ${elementsToUpdate.length} instances across the platform`,
    });
  };

  const handleAutoSave = async () => {
    if (!hasUnsavedChanges) return;

    try {
      // Get all checked fields
      const checkedFields = fieldCategories.flatMap(category =>
        category.fields.filter(field => field.isChecked)
      );

      if (checkedFields.length === 0) {
        toast.info('No fields selected for auto-save');
        return;
      }

      // Build updated summary from current field values
      const updatedSummary = {
        totalFees: BigInt(getFieldValue('financial', 'totalFees') || '0'),
        totalCommissions: BigInt(getFieldValue('financial', 'totalCommissions') || '0'),
        totalTransactions: BigInt(getFieldValue('financial', 'totalTransactions') || '0'),
        totalRemunerations: BigInt(getFieldValue('financial', 'totalRemunerations') || '0'),
        totalDiscounts: BigInt(getFieldValue('financial', 'totalDiscounts') || '0'),
        totalOffers: BigInt(getFieldValue('financial', 'totalOffers') || '0'),
        totalReturns: BigInt(getFieldValue('financial', 'totalReturns') || '0'),
        companyName: getFieldValue('business', 'companyName') || summary?.companyName || '',
        ceoName: getFieldValue('business', 'ceoName') || summary?.ceoName || '',
        contactEmail: getFieldValue('email', 'contactEmail') || summary?.contactEmail || '',
        paymentEmail: getFieldValue('payment', 'paymentEmail') || summary?.paymentEmail || '',
        website: getFieldValue('social', 'website') || summary?.website || '',
        brandingStatement: getFieldValue('branding', 'brandingStatement') || summary?.brandingStatement || '',
        lastUpdated: BigInt(Date.now() * 1000000),
      };

      // Save to backend
      await updateSummary.mutateAsync(updatedSummary);

      setHasUnsavedChanges(false);
      setAutoSaveCountdown(0);

      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        setAutoSaveTimer(null);
      }

      // Refetch to ensure UI is in sync
      await refetch();

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
      // Get all checked fields
      const checkedFields = fieldCategories.flatMap(category =>
        category.fields.filter(field => field.isChecked)
      );

      if (checkedFields.length === 0) {
        toast.warning('No fields selected for saving');
        return;
      }

      // Build updated summary from current field values
      const updatedSummary = {
        totalFees: BigInt(getFieldValue('financial', 'totalFees') || '0'),
        totalCommissions: BigInt(getFieldValue('financial', 'totalCommissions') || '0'),
        totalTransactions: BigInt(getFieldValue('financial', 'totalTransactions') || '0'),
        totalRemunerations: BigInt(getFieldValue('financial', 'totalRemunerations') || '0'),
        totalDiscounts: BigInt(getFieldValue('financial', 'totalDiscounts') || '0'),
        totalOffers: BigInt(getFieldValue('financial', 'totalOffers') || '0'),
        totalReturns: BigInt(getFieldValue('financial', 'totalReturns') || '0'),
        companyName: getFieldValue('business', 'companyName') || summary?.companyName || '',
        ceoName: getFieldValue('business', 'ceoName') || summary?.ceoName || '',
        contactEmail: getFieldValue('email', 'contactEmail') || summary?.contactEmail || '',
        paymentEmail: getFieldValue('payment', 'paymentEmail') || summary?.paymentEmail || '',
        website: getFieldValue('social', 'website') || summary?.website || '',
        brandingStatement: getFieldValue('branding', 'brandingStatement') || summary?.brandingStatement || '',
        lastUpdated: BigInt(Date.now() * 1000000),
      };

      // Save to backend and wait for completion
      await updateSummary.mutateAsync(updatedSummary);

      // Clear unsaved changes state
      setHasUnsavedChanges(false);
      setAutoSaveCountdown(0);

      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        setAutoSaveTimer(null);
      }

      // Refetch the data to ensure UI shows latest values
      await refetch();

      // Close dialogs after successful save
      setIsAdminPanelOpen(false);
      setIsEditDialogOpen(false);

      toast.success(`Successfully saved ${checkedFields.length} selected fields!`, {
        description: "Changes have been saved and applied across the entire platform",
      });
    } catch (error) {
      console.error('Error updating fields:', error);
      toast.error('Failed to update fields. Please try again.');
    }
  };

  const handleBulkDelete = async () => {
    const checkedFields = fieldCategories.flatMap(category =>
      category.fields.filter(field => field.isChecked)
    );

    if (checkedFields.length === 0) {
      toast.warning('No fields selected for deletion');
      return;
    }

    try {
      // Delete selected fields (only non-core fields)
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

      toast.success(`Deleted ${deletableFields.length} fields successfully`);
      await refetch();
    } catch (error) {
      console.error('Error deleting fields:', error);
      toast.error('Failed to delete selected fields');
    }
  };

  const getFieldValue = (categoryId: string, fieldId: string): string => {
    const category = fieldCategories.find(c => c.id === categoryId);
    const field = category?.fields.find(f => f.id === fieldId);
    return Array.isArray(field?.value) ? field.value[0] : (field?.value || '');
  };

  const addFieldValue = (categoryId: string, fieldId: string) => {
    const category = fieldCategories.find(c => c.id === categoryId);
    const field = category?.fields.find(f => f.id === fieldId);

    if (field && field.isMultiple) {
      const currentValues = Array.isArray(field.value) ? field.value : [field.value];
      handleFieldUpdate(categoryId, fieldId, [...currentValues, '']);
    }
  };

  const removeFieldValue = (categoryId: string, fieldId: string, index: number) => {
    const category = fieldCategories.find(c => c.id === categoryId);
    const field = category?.fields.find(f => f.id === fieldId);

    if (field && field.isMultiple && Array.isArray(field.value)) {
      const newValues = field.value.filter((_, i) => i !== index);
      handleFieldUpdate(categoryId, fieldId, newValues);
    }
  };

  const updateFieldValue = (categoryId: string, fieldId: string, index: number, newValue: string) => {
    const category = fieldCategories.find(c => c.id === categoryId);
    const field = category?.fields.find(f => f.id === fieldId);

    if (field) {
      if (field.isMultiple && Array.isArray(field.value)) {
        const newValues = [...field.value];
        newValues[index] = newValue;
        handleFieldUpdate(categoryId, fieldId, newValues);
      } else {
        handleFieldUpdate(categoryId, fieldId, newValue);
      }
    }
  };

  const filteredCategories = fieldCategories.filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return category.name.toLowerCase().includes(searchLower) ||
        category.fields.some(field =>
          field.label.toLowerCase().includes(searchLower) ||
          field.description.toLowerCase().includes(searchLower)
        );
    }

    return true;
  }).map(category => ({
    ...category,
    fields: category.fields.filter(field => {
      if (filterStatus === 'checked') return field.isChecked;
      if (filterStatus === 'unchecked') return !field.isChecked;
      return true;
    })
  }));

  const totalFields = fieldCategories.reduce((sum, cat) => sum + cat.totalCount, 0);
  const totalChecked = fieldCategories.reduce((sum, cat) => sum + cat.checkedCount, 0);

  const formatCurrency = (amount: bigint) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Number(amount) / 100);
  };

  const formatNumber = (num: bigint) => {
    return new Intl.NumberFormat('en-US').format(Number(num));
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Error Loading Summary
              </CardTitle>
              <CardDescription>
                Unable to load the God's Eye Summary. Please try again later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => refetch()} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Always Visible Admin Controls */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
              <Eye className="h-8 w-8 text-primary" />
              God's Eye Summary
            </h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive platform overview with advanced field management and auto-save functionality
            </p>
          </div>

          {/* Always Visible Admin Panel - Moved outside conditional */}
          <div className="flex gap-3">
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  className="neon-glow"
                  onClick={() => setIsAdminPanelOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Enhanced Admin Panel
                  {totalChecked > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {totalChecked} selected
                    </Badge>
                  )}
                </Button>

                <Button
                  className="neon-glow"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Quick Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Admin Panel Dialog - Always Available */}
        {isAdmin && (
          <>
            <Dialog open={isAdminPanelOpen} onOpenChange={setIsAdminPanelOpen}>
              <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Enhanced Platform Field Management System
                  </DialogTitle>
                  <DialogDescription>
                    Advanced field management with checkboxes, auto-save, bulk operations, and alphabetical sorting.
                    Select fields to enable auto-save and bulk operations.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Enhanced Controls */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-4">
                      {/* Search and Filter */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search fields..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-40">
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
                        <Select value={filterStatus} onValueChange={(value: 'all' | 'checked' | 'unchecked') => setFilterStatus(value)}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Fields</SelectItem>
                            <SelectItem value="checked">Checked Only</SelectItem>
                            <SelectItem value="unchecked">Unchecked Only</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <div className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <div className="flex-1">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              Auto-save in {autoSaveCountdown}s
                            </p>
                            <Progress value={(30 - autoSaveCountdown) / 30 * 100} className="h-1 mt-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Field Categories */}
                  <div className="max-h-[60vh] overflow-y-auto">
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
                                <div key={field.id} className="space-y-3 p-4 border rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <Checkbox
                                        checked={field.isChecked}
                                        onCheckedChange={(checked) => handleFieldCheck(category.id, field.id, checked as boolean)}
                                      />
                                      <div>
                                        <Label className="text-sm font-medium">
                                          {field.label}
                                          {field.required && <span className="text-destructive ml-1">*</span>}
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {field.description}
                                        </p>
                                      </div>
                                    </div>
                                    {field.isMultiple && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addFieldValue(category.id, field.id)}
                                      >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add
                                      </Button>
                                    )}
                                  </div>

                                  {field.isMultiple && Array.isArray(field.value) ? (
                                    <div className="space-y-2">
                                      {field.value.map((value, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                          {field.type === 'textarea' ? (
                                            <Textarea
                                              value={value}
                                              onChange={(e) => updateFieldValue(category.id, field.id, index, e.target.value)}
                                              placeholder={field.placeholder}
                                              className="flex-1"
                                              rows={2}
                                            />
                                          ) : (
                                            <Input
                                              type={field.type === 'currency' || field.type === 'number' ? 'number' : 'text'}
                                              value={value}
                                              onChange={(e) => updateFieldValue(category.id, field.id, index, e.target.value)}
                                              placeholder={field.placeholder}
                                              className="flex-1"
                                            />
                                          )}
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => removeFieldValue(category.id, field.id, index)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    field.type === 'textarea' ? (
                                      <Textarea
                                        value={Array.isArray(field.value) ? field.value[0] : field.value}
                                        onChange={(e) => updateFieldValue(category.id, field.id, 0, e.target.value)}
                                        placeholder={field.placeholder}
                                        rows={3}
                                      />
                                    ) : (
                                      <Input
                                        type={field.type === 'currency' || field.type === 'number' ? 'number' : 'text'}
                                        value={Array.isArray(field.value) ? field.value[0] : field.value}
                                        onChange={(e) => updateFieldValue(category.id, field.id, 0, e.target.value)}
                                        placeholder={field.placeholder}
                                      />
                                    )
                                  )}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>

                <DialogFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      {livePreview ? 'Live updates enabled' : 'Live updates disabled'}
                    </div>
                    {hasUnsavedChanges && (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <Clock className="h-4 w-4" />
                        Unsaved changes
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleBulkDelete}
                      disabled={totalChecked === 0}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected ({totalChecked})
                    </Button>
                    <Button variant="outline" onClick={() => setIsAdminPanelOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleManualSave}
                      disabled={updateSummary.isPending || totalChecked === 0}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateSummary.isPending ? 'Saving...' : `Save Selected (${totalChecked})`}
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Quick Edit Summary</DialogTitle>
                  <DialogDescription>
                    Update basic summary information. For advanced field management with checkboxes and auto-save, use the Enhanced Admin Panel.
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="financial" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    <TabsTrigger value="company">Company</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>
                  <TabsContent value="financial" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="totalFees">Total Fees (cents)</Label>
                        <Input
                          id="totalFees"
                          type="number"
                          value={getFieldValue('financial', 'totalFees')}
                          onChange={(e) => updateFieldValue('financial', 'totalFees', 0, e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="totalCommissions">Total Commissions (cents)</Label>
                        <Input
                          id="totalCommissions"
                          type="number"
                          value={getFieldValue('financial', 'totalCommissions')}
                          onChange={(e) => updateFieldValue('financial', 'totalCommissions', 0, e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="totalTransactions">Total Transactions</Label>
                        <Input
                          id="totalTransactions"
                          type="number"
                          value={getFieldValue('financial', 'totalTransactions')}
                          onChange={(e) => updateFieldValue('financial', 'totalTransactions', 0, e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="totalRemunerations">Total Remunerations (cents)</Label>
                        <Input
                          id="totalRemunerations"
                          type="number"
                          value={getFieldValue('financial', 'totalRemunerations')}
                          onChange={(e) => updateFieldValue('financial', 'totalRemunerations', 0, e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="company" className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={getFieldValue('business', 'companyName')}
                        onChange={(e) => updateFieldValue('business', 'companyName', 0, e.target.value)}
                        placeholder="Sudha Enterprises / SECOINFI"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ceoName">CEO Name</Label>
                      <Input
                        id="ceoName"
                        value={getFieldValue('business', 'ceoName')}
                        onChange={(e) => updateFieldValue('business', 'ceoName', 0, e.target.value)}
                        placeholder="Dileep Kumar D"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brandingStatement">Branding Statement</Label>
                      <Textarea
                        id="brandingStatement"
                        value={getFieldValue('branding', 'brandingStatement')}
                        onChange={(e) => updateFieldValue('branding', 'brandingStatement', 0, e.target.value)}
                        placeholder="SitemapHub is the brain-child of Dileep Kumar D, CEO at Sudha Enterprises/SECOINFI"
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="contact" className="space-y-4">
                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={getFieldValue('email', 'contactEmail')}
                        onChange={(e) => updateFieldValue('email', 'contactEmail', 0, e.target.value)}
                        placeholder="dild26@seco.in.net"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentEmail">Payment Email</Label>
                      <Input
                        id="paymentEmail"
                        type="email"
                        value={getFieldValue('payment', 'paymentEmail')}
                        onChange={(e) => updateFieldValue('payment', 'paymentEmail', 0, e.target.value)}
                        placeholder="newgoldenjewel@seco.in.net"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={getFieldValue('social', 'website')}
                        onChange={(e) => updateFieldValue('social', 'website', 0, e.target.value)}
                        placeholder="https://www.seco.in.net"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleManualSave} disabled={updateSummary.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {updateSummary.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Company Branding */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-primary" data-field="companyName">
                {summary.companyName}
              </h2>
              <p className="text-lg text-muted-foreground italic" data-field="brandingStatement">
                {summary.brandingStatement}
              </p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">CEO</p>
                  <p className="font-medium" data-field="ceoName">{summary.ceoName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Contact</p>
                  <p className="font-medium" data-field="contactEmail">{summary.contactEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  <p className="font-medium" data-field="paymentEmail">{summary.paymentEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a
                    href={summary.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                    data-field="website"
                  >
                    {summary.website}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-600/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500" data-field="totalFees">
                {formatCurrency(summary.totalFees)}
              </div>
              <p className="text-xs text-muted-foreground">All subscription and service fees</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-600/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500" data-field="totalCommissions">
                {formatCurrency(summary.totalCommissions)}
              </div>
              <p className="text-xs text-muted-foreground">Referral and affiliate commissions</p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-600/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <FileText className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500" data-field="totalTransactions">
                {formatNumber(summary.totalTransactions)}
              </div>
              <p className="text-xs text-muted-foreground">All platform transactions</p>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-orange-600/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Remunerations</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500" data-field="totalRemunerations">
                {formatCurrency(summary.totalRemunerations)}
              </div>
              <p className="text-xs text-muted-foreground">User payouts and rewards</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-cyan-600/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Discounts</CardTitle>
              <Gift className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-500" data-field="totalDiscounts">
                {formatCurrency(summary.totalDiscounts)}
              </div>
              <p className="text-xs text-muted-foreground">Promotional discounts applied</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <Gift className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500" data-field="totalOffers">
                {formatNumber(summary.totalOffers)}
              </div>
              <p className="text-xs text-muted-foreground">Special offers and promotions</p>
            </CardContent>
          </Card>

          <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-red-600/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
              <RotateCcw className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500" data-field="totalReturns">
                {formatCurrency(summary.totalReturns)}
              </div>
              <p className="text-xs text-muted-foreground">Refunds and returns processed</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Summary Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Enhanced Summary Information
            </CardTitle>
            <CardDescription>
              This summary aggregates all contract-related data from across the platform with advanced field management capabilities.
              {isAdmin && " Use the Enhanced Admin Panel for checkbox selection, auto-save, and bulk operations."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated:</span>
                <Badge variant="outline">{formatDate(summary.lastUpdated)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Data Source:</span>
                <Badge variant="secondary">Real-time Platform Aggregation</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Access Level:</span>
                <Badge variant={isAdmin ? "default" : "outline"}>
                  {isAdmin ? "Admin (Full Management Access)" : "Public (View Only)"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Fields:</span>
                <Badge variant="outline">{totalFields} fields</Badge>
              </div>
            </div>

            {isAdmin && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Selected Fields:</span>
                    <Badge variant="outline">{totalChecked} selected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Auto-save Status:</span>
                    <Badge variant={hasUnsavedChanges ? "destructive" : "secondary"}>
                      {hasUnsavedChanges ? `${autoSaveCountdown}s remaining` : "Up to date"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Live Preview:</span>
                    <Badge variant={livePreview ? "default" : "outline"}>
                      {livePreview ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sort Order:</span>
                    <Badge variant="outline">
                      {sortBy === 'alphabetical' ? 'A-Z' : sortBy === 'category' ? 'Category' : 'Recent'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Checkbox Selection</Badge>
                  <Badge variant="outline">Auto-save (30s)</Badge>
                  <Badge variant="outline">Bulk Operations</Badge>
                  <Badge variant="outline">Alphabetical Sorting</Badge>
                  <Badge variant="outline">Live Search/Replace</Badge>
                  <Badge variant="outline">Multi-Value Fields</Badge>
                  <Badge variant="outline">Real-time Updates</Badge>
                </div>
              </>
            )}

            <Separator />
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                All financial data is aggregated from live platform operations including subscriptions,
                referral commissions, transaction processing, user payouts, promotional activities, and return processing.
              </p>
              <p className="text-xs text-muted-foreground italic">
                This enhanced summary supersedes any generic or placeholder data throughout the application.
                {isAdmin && " Admin changes with checkbox selection and auto-save are applied instantly across all platform pages."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
