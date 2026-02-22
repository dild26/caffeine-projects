import { useState, useEffect } from 'react';
import { useGetCurrentSpec, useUpdateSpec, useGetSpecHistory } from '../hooks/useQueries';
import { SpecFormat } from '../backend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { FileCode2, Save, History, AlertCircle, Clock, Zap, RefreshCw, FileText, Code2, Sparkles, Archive } from 'lucide-react';
import SpecHistoryDialog from './SpecHistoryDialog';

export default function SpecificationManager() {
  const { data: currentSpec, isLoading } = useGetCurrentSpec();
  const { data: history = [] } = useGetSpecHistory();
  const updateSpec = useUpdateSpec();

  const [content, setContent] = useState('');
  const [format, setFormat] = useState<SpecFormat>(SpecFormat.yaml);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [parsedSpec, setParsedSpec] = useState<any>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isDeduplicating, setIsDeduplicating] = useState(false);

  useEffect(() => {
    if (currentSpec) {
      try {
        let parsed: any = null;
        
        if (currentSpec.format === SpecFormat.yaml) {
          const lines = currentSpec.content.split('\n');
          parsed = {};
          lines.forEach(line => {
            const match = line.match(/^([^:#]+):\s*(.+)$/);
            if (match) {
              const key = match[1].trim();
              const value = match[2].trim().replace(/^["']|["']$/g, '');
              parsed[key] = value;
            }
          });
        } else if (currentSpec.format === SpecFormat.ml) {
          parsed = { format: 'ml', content: currentSpec.content };
        } else {
          parsed = { format: 'markdown', content: currentSpec.content };
        }
        
        setParsedSpec(parsed);
        
        if (parsed && typeof parsed === 'object') {
          if (parsed.title || parsed.app_name || parsed.name) {
            const title = parsed.title || parsed.app_name || parsed.name;
            document.title = title;
          }
        }
      } catch (error) {
        console.error('Failed to parse specification:', error);
        setParsedSpec(null);
      }
    }
  }, [currentSpec]);

  const handleEdit = () => {
    if (currentSpec) {
      setContent(currentSpec.content);
      setFormat(currentSpec.format);
    } else {
      setContent('');
      setFormat(SpecFormat.yaml);
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Specification content cannot be empty');
      return;
    }

    try {
      await updateSpec.mutateAsync({ content, format });
      toast.success('Specification updated successfully! Changes applied in real-time.');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update specification');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setContent('');
  };

  // Deduplication function for removing redundant content
  const deduplicateContent = (text: string, contentFormat: SpecFormat): string => {
    const lines = text.split('\n');
    const seenLines = new Set<string>();
    const seenHeadings = new Set<string>();
    const deduplicatedLines: string[] = [];
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Preserve code blocks without deduplication
      if (trimmedLine.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        deduplicatedLines.push(line);
        continue;
      }

      if (inCodeBlock) {
        deduplicatedLines.push(line);
        continue;
      }

      // Skip empty lines that are consecutive
      if (trimmedLine === '') {
        if (deduplicatedLines.length > 0 && deduplicatedLines[deduplicatedLines.length - 1].trim() !== '') {
          deduplicatedLines.push(line);
        }
        continue;
      }

      // Handle format-specific deduplication
      if (contentFormat === SpecFormat.markdown) {
        // Deduplicate headings
        const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
          const headingText = headingMatch[2].toLowerCase();
          if (seenHeadings.has(headingText)) {
            continue; // Skip duplicate heading
          }
          seenHeadings.add(headingText);
          deduplicatedLines.push(line);
          continue;
        }
      } else if (contentFormat === SpecFormat.yaml) {
        // Deduplicate YAML keys
        const yamlMatch = trimmedLine.match(/^([^:#]+):\s*(.+)$/);
        if (yamlMatch) {
          const key = yamlMatch[1].trim().toLowerCase();
          if (seenHeadings.has(key)) {
            continue; // Skip duplicate key
          }
          seenHeadings.add(key);
          deduplicatedLines.push(line);
          continue;
        }
      } else if (contentFormat === SpecFormat.ml) {
        // Deduplicate ML let bindings
        const mlMatch = trimmedLine.match(/^\s*let\s+(\w+)\s*=/);
        if (mlMatch) {
          const varName = mlMatch[1].toLowerCase();
          if (seenHeadings.has(varName)) {
            continue; // Skip duplicate variable
          }
          seenHeadings.add(varName);
          deduplicatedLines.push(line);
          continue;
        }
      }

      // Deduplicate identical text blocks (case-insensitive)
      const normalizedLine = trimmedLine.toLowerCase();
      if (seenLines.has(normalizedLine)) {
        // Skip duplicate line unless it's a list item or important structural element
        const isListItem = trimmedLine.match(/^[-*+]\s+/);
        const isNumberedList = trimmedLine.match(/^\d+\.\s+/);
        if (!isListItem && !isNumberedList) {
          continue;
        }
      }

      seenLines.add(normalizedLine);
      deduplicatedLines.push(line);
    }

    // Remove consecutive empty lines
    const finalLines: string[] = [];
    for (let i = 0; i < deduplicatedLines.length; i++) {
      const line = deduplicatedLines[i];
      if (line.trim() === '' && i > 0 && deduplicatedLines[i - 1].trim() === '') {
        continue;
      }
      finalLines.push(line);
    }

    return finalLines.join('\n').trim();
  };

  // Handle deduplication with backup
  const handleDeduplicate = async () => {
    if (!content.trim()) {
      toast.error('Please enter content first');
      return;
    }

    setIsDeduplicating(true);
    try {
      // Create backup before deduplication
      const backupContent = content;
      const backupFormat = format;
      
      // Save current version as backup in history
      await updateSpec.mutateAsync({ 
        content: `[BACKUP BEFORE DEDUPLICATION]\n\n${backupContent}`, 
        format: backupFormat 
      });

      toast.info('Backup created. Starting deduplication...');

      // Perform deduplication
      const deduplicated = deduplicateContent(content, format);

      // Calculate reduction
      const originalLines = content.split('\n').length;
      const deduplicatedLines = deduplicated.split('\n').length;
      const reduction = originalLines - deduplicatedLines;

      // Update content
      setContent(deduplicated);

      // Save deduplicated version
      await updateSpec.mutateAsync({ content: deduplicated, format });

      toast.success(
        `Deduplication complete! Removed ${reduction} duplicate lines. Original backed up in history.`,
        { duration: 5000 }
      );
    } catch (error) {
      toast.error('Failed to deduplicate specification');
      console.error(error);
    } finally {
      setIsDeduplicating(false);
    }
  };

  // Auto-deduplicate before saving
  const handleSaveWithDeduplication = async () => {
    if (!content.trim()) {
      toast.error('Specification content cannot be empty');
      return;
    }

    try {
      // Auto-deduplicate content before saving
      const deduplicated = deduplicateContent(content, format);
      
      // Check if deduplication made changes
      if (deduplicated !== content) {
        const originalLines = content.split('\n').length;
        const deduplicatedLines = deduplicated.split('\n').length;
        const reduction = originalLines - deduplicatedLines;
        
        toast.info(`Auto-optimized: removed ${reduction} duplicate lines`);
        setContent(deduplicated);
      }

      await updateSpec.mutateAsync({ content: deduplicated, format });
      toast.success('Specification saved with optimization! Changes applied in real-time.');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update specification');
      console.error(error);
    }
  };

  // Convert Markdown to YAML
  const convertMarkdownToYaml = (mdContent: string): string => {
    const lines = mdContent.split('\n');
    const yamlLines: string[] = [];
    let inCodeBlock = false;

    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;

      // Extract headings as keys
      const h1Match = line.match(/^#\s+(.+)$/);
      if (h1Match) {
        yamlLines.push(`title: "${h1Match[1].trim()}"`);
        continue;
      }

      const h2Match = line.match(/^##\s+(.+)$/);
      if (h2Match) {
        yamlLines.push(`section: "${h2Match[1].trim()}"`);
        continue;
      }

      // Extract key-value pairs from list items
      const listMatch = line.match(/^[-*]\s+(.+?):\s*(.+)$/);
      if (listMatch) {
        const key = listMatch[1].trim().toLowerCase().replace(/\s+/g, '_');
        const value = listMatch[2].trim();
        yamlLines.push(`${key}: "${value}"`);
      }
    }

    return yamlLines.join('\n');
  };

  // Convert YAML to ML (simplified conversion)
  const convertYamlToMl = (yamlContent: string): string => {
    const lines = yamlContent.split('\n');
    const mlLines: string[] = ['module Specification = struct'];

    for (const line of lines) {
      const match = line.match(/^([^:#]+):\s*(.+)$/);
      if (match) {
        const key = match[1].trim().replace(/[^a-zA-Z0-9_]/g, '_');
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        mlLines.push(`  let ${key} = "${value}"`);
      }
    }

    mlLines.push('end');
    return mlLines.join('\n');
  };

  // Convert YAML to Markdown
  const convertYamlToMarkdown = (yamlContent: string): string => {
    const lines = yamlContent.split('\n');
    const mdLines: string[] = [];
    let currentSection = '';

    for (const line of lines) {
      const match = line.match(/^([^:#]+):\s*(.+)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');

        if (key === 'title') {
          mdLines.push(`# ${value}\n`);
        } else if (key === 'section') {
          currentSection = value;
          mdLines.push(`\n## ${value}\n`);
        } else {
          const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          mdLines.push(`- **${displayKey}**: ${value}`);
        }
      }
    }

    return mdLines.join('\n');
  };

  // Auto-generate equivalent formats with deduplication
  const handleAutoGenerate = async (targetFormat: SpecFormat) => {
    if (!content.trim()) {
      toast.error('Please enter content first');
      return;
    }

    setIsConverting(true);
    try {
      let convertedContent = '';

      // Convert from current format to target format
      if (format === SpecFormat.markdown && targetFormat === SpecFormat.yaml) {
        convertedContent = convertMarkdownToYaml(content);
      } else if (format === SpecFormat.yaml && targetFormat === SpecFormat.ml) {
        convertedContent = convertYamlToMl(content);
      } else if (format === SpecFormat.yaml && targetFormat === SpecFormat.markdown) {
        convertedContent = convertYamlToMarkdown(content);
      } else if (format === SpecFormat.markdown && targetFormat === SpecFormat.ml) {
        const yamlContent = convertMarkdownToYaml(content);
        convertedContent = convertYamlToMl(yamlContent);
      } else if (format === targetFormat) {
        toast.info('Already in target format');
        setIsConverting(false);
        return;
      } else {
        toast.error('Conversion not supported for this format combination');
        setIsConverting(false);
        return;
      }

      // Auto-deduplicate converted content
      convertedContent = deduplicateContent(convertedContent, targetFormat);

      // Save the converted content
      await updateSpec.mutateAsync({ content: convertedContent, format: targetFormat });
      
      // Update local state
      setContent(convertedContent);
      setFormat(targetFormat);
      
      toast.success(`Successfully converted to ${targetFormat.toUpperCase()} format with optimization`);
    } catch (error) {
      toast.error('Failed to convert specification format');
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };

  // Sync all formats with deduplication
  const handleSyncAllFormats = async () => {
    if (!content.trim()) {
      toast.error('Please enter content first');
      return;
    }

    setIsConverting(true);
    try {
      const formats: SpecFormat[] = [SpecFormat.yaml, SpecFormat.ml, SpecFormat.markdown];
      let successCount = 0;

      for (const targetFormat of formats) {
        if (targetFormat === format) continue;

        let convertedContent = '';

        if (format === SpecFormat.markdown && targetFormat === SpecFormat.yaml) {
          convertedContent = convertMarkdownToYaml(content);
        } else if (format === SpecFormat.yaml && targetFormat === SpecFormat.ml) {
          convertedContent = convertYamlToMl(content);
        } else if (format === SpecFormat.yaml && targetFormat === SpecFormat.markdown) {
          convertedContent = convertYamlToMarkdown(content);
        } else if (format === SpecFormat.markdown && targetFormat === SpecFormat.ml) {
          const yamlContent = convertMarkdownToYaml(content);
          convertedContent = convertYamlToMl(yamlContent);
        } else if (format === SpecFormat.ml && targetFormat === SpecFormat.yaml) {
          // Basic ML to YAML conversion
          const lines = content.split('\n').filter(l => l.includes('let '));
          convertedContent = lines.map(l => {
            const match = l.match(/let\s+(\w+)\s*=\s*"(.+)"/);
            if (match) return `${match[1]}: "${match[2]}"`;
            return '';
          }).filter(Boolean).join('\n');
        } else if (format === SpecFormat.ml && targetFormat === SpecFormat.markdown) {
          const yamlContent = content.split('\n').filter(l => l.includes('let ')).map(l => {
            const match = l.match(/let\s+(\w+)\s*=\s*"(.+)"/);
            if (match) return `${match[1]}: "${match[2]}"`;
            return '';
          }).filter(Boolean).join('\n');
          convertedContent = convertYamlToMarkdown(yamlContent);
        }

        if (convertedContent) {
          // Auto-deduplicate each converted format
          convertedContent = deduplicateContent(convertedContent, targetFormat);
          await updateSpec.mutateAsync({ content: convertedContent, format: targetFormat });
          successCount++;
        }
      }

      toast.success(`Successfully synchronized and optimized ${successCount} format(s)`);
    } catch (error) {
      toast.error('Failed to synchronize all formats');
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };

  const getFormatBadge = (fmt: SpecFormat) => {
    const colors = {
      [SpecFormat.yaml]: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      [SpecFormat.ml]: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      [SpecFormat.markdown]: 'bg-green-500/10 text-green-700 dark:text-green-400',
    };
    return colors[fmt];
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading specification...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Technical Specification</h1>
            <p className="mt-2 text-muted-foreground">
              Manage and maintain your application's technical specification with auto-sync and deduplication
            </p>
            {parsedSpec && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Zap className="h-4 w-4" />
                <span>Real-time updates active</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowHistory(true)} className="rounded-full">
              <History className="mr-2 h-4 w-4" />
              History ({history.length})
            </Button>
            {!isEditing && (
              <Button onClick={handleEdit} className="rounded-full">
                <FileCode2 className="mr-2 h-4 w-4" />
                {currentSpec ? 'Edit Specification' : 'Create Specification'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="current">Current Specification</TabsTrigger>
          <TabsTrigger value="editor" disabled={!isEditing}>
            Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {currentSpec ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Current Specification</CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Last updated: {formatDate(currentSpec.timestamp)}
                    </CardDescription>
                  </div>
                  <Badge className={getFormatBadge(currentSpec.format)}>
                    {currentSpec.format.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <pre className="overflow-x-auto text-sm">
                    <code>{currentSpec.content}</code>
                  </pre>
                </div>
                {parsedSpec && typeof parsedSpec === 'object' && Object.keys(parsedSpec).length > 0 && (
                  <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Parsed Specification Data
                    </h4>
                    <pre className="overflow-x-auto text-xs text-muted-foreground">
                      <code>{JSON.stringify(parsedSpec, null, 2)}</code>
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No Specification Found</h3>
                <p className="mb-4 text-center text-sm text-muted-foreground">
                  Create your first technical specification to get started.
                </p>
                <Button onClick={handleEdit} className="rounded-full">
                  <FileCode2 className="mr-2 h-4 w-4" />
                  Create Specification
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Edit Specification</CardTitle>
              <CardDescription>
                Update your technical specification with automatic deduplication, format conversion, and synchronization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select
                  value={format}
                  onValueChange={(value) => setFormat(value as SpecFormat)}
                >
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SpecFormat.yaml}>YAML (.yaml) - Primary</SelectItem>
                    <SelectItem value={SpecFormat.ml}>ML (.ml) - Machine Readable</SelectItem>
                    <SelectItem value={SpecFormat.markdown}>Markdown (.md) - Fallback Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Deduplication controls */}
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Content Optimization & Deduplication
                </h4>
                <p className="text-xs text-muted-foreground">
                  Remove duplicate headings, identical text blocks, and repeated feature descriptions while preserving unique content
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDeduplicate}
                    disabled={isDeduplicating || isConverting || !content.trim()}
                    className="rounded-full"
                  >
                    {isDeduplicating ? (
                      <>
                        <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Deduplicating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-3 w-3" />
                        Deduplicate Now
                      </>
                    )}
                  </Button>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Archive className="h-3 w-3" />
                    Auto-backup enabled
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Note: Deduplication automatically creates a backup in version history before processing
                </p>
              </div>

              {/* Auto-generation controls */}
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Auto-Generate & Sync Formats
                </h4>
                <p className="text-xs text-muted-foreground">
                  Convert current content to other formats or sync all formats at once (includes automatic deduplication)
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAutoGenerate(SpecFormat.yaml)}
                    disabled={isConverting || isDeduplicating || format === SpecFormat.yaml}
                    className="rounded-full"
                  >
                    <Code2 className="mr-2 h-3 w-3" />
                    Convert to YAML
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAutoGenerate(SpecFormat.ml)}
                    disabled={isConverting || isDeduplicating || format === SpecFormat.ml}
                    className="rounded-full"
                  >
                    <Code2 className="mr-2 h-3 w-3" />
                    Convert to ML
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAutoGenerate(SpecFormat.markdown)}
                    disabled={isConverting || isDeduplicating || format === SpecFormat.markdown}
                    className="rounded-full"
                  >
                    <FileText className="mr-2 h-3 w-3" />
                    Convert to Markdown
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleSyncAllFormats}
                    disabled={isConverting || isDeduplicating}
                    className="rounded-full"
                  >
                    {isConverting ? (
                      <>
                        <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Sync All Formats
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your specification content here..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveWithDeduplication}
                  disabled={updateSpec.isPending || isConverting || isDeduplicating}
                  className="rounded-full"
                >
                  {updateSpec.isPending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save with Auto-Optimization
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateSpec.isPending || isConverting || isDeduplicating}
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SpecHistoryDialog
        open={showHistory}
        onOpenChange={setShowHistory}
        history={history}
        onRevert={() => setShowHistory(false)}
      />
    </div>
  );
}
