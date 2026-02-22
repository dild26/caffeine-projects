import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Download,
  Upload,
  Trash2,
  Copy,
  FileCheck,
  FileWarning,
  Search,
  Filter,
  RefreshCw,
  Zap,
  Settings,
  Eye,
  Code,
  List,
} from 'lucide-react';
import { toast } from 'sonner';

interface DuplicateEntry {
  id: string;
  content: string;
  occurrences: number;
  locations: string[];
  type: 'exact' | 'similar' | 'redundant';
  confidence: number;
}

interface AnalysisResult {
  totalLines: number;
  uniqueLines: number;
  duplicateLines: number;
  redundantSections: number;
  duplicates: DuplicateEntry[];
  suggestions: string[];
  estimatedReduction: number;
}

export default function SpecificationDeduplicator() {
  const [inputContent, setInputContent] = useState('');
  const [outputContent, setOutputContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDuplicates, setSelectedDuplicates] = useState<Set<string>>(new Set());
  const [fileType, setFileType] = useState<'md' | 'yaml'>('md');
  const [similarityThreshold, setSimilarityThreshold] = useState(85);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputContent(content);
      
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'md') {
        setFileType('md');
      } else if (extension === 'yaml' || extension === 'yml') {
        setFileType('yaml');
      }
      
      toast.success(`File loaded: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 100;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return ((longer.length - editDistance) / longer.length) * 100;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const analyzeContent = async () => {
    if (!inputContent.trim()) {
      toast.error('Please provide content to analyze');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(20);

      const lines = inputContent.split('\n').filter(line => line.trim());
      const lineMap = new Map<string, { count: number; locations: number[] }>();
      
      lines.forEach((line, index) => {
        const normalized = line.trim().toLowerCase();
        if (normalized.length < 10) return;
        
        if (lineMap.has(normalized)) {
          const entry = lineMap.get(normalized)!;
          entry.count++;
          entry.locations.push(index + 1);
        } else {
          lineMap.set(normalized, { count: 1, locations: [index + 1] });
        }
      });

      setProgress(40);

      const exactDuplicates: DuplicateEntry[] = [];
      lineMap.forEach((value, key) => {
        if (value.count > 1) {
          exactDuplicates.push({
            id: `exact_${Math.random().toString(36).substr(2, 9)}`,
            content: key,
            occurrences: value.count,
            locations: value.locations.map(loc => `Line ${loc}`),
            type: 'exact',
            confidence: 100,
          });
        }
      });

      setProgress(60);

      const similarDuplicates: DuplicateEntry[] = [];
      const processedLines = new Set<string>();
      
      lines.forEach((line1, i) => {
        if (processedLines.has(line1.trim().toLowerCase())) return;
        
        const similarLines: number[] = [];
        lines.forEach((line2, j) => {
          if (i !== j && line1.trim().length > 20 && line2.trim().length > 20) {
            const similarity = calculateSimilarity(
              line1.trim().toLowerCase(),
              line2.trim().toLowerCase()
            );
            
            if (similarity >= similarityThreshold && similarity < 100) {
              similarLines.push(j + 1);
            }
          }
        });
        
        if (similarLines.length > 0) {
          similarDuplicates.push({
            id: `similar_${Math.random().toString(36).substr(2, 9)}`,
            content: line1.trim(),
            occurrences: similarLines.length + 1,
            locations: [i + 1, ...similarLines].map(loc => `Line ${loc}`),
            type: 'similar',
            confidence: similarityThreshold,
          });
          processedLines.add(line1.trim().toLowerCase());
        }
      });

      setProgress(80);

      const redundantPatterns = detectRedundantPatterns(inputContent, fileType);

      setProgress(100);

      const allDuplicates = [...exactDuplicates, ...similarDuplicates, ...redundantPatterns];
      const duplicateLineCount = allDuplicates.reduce((sum, dup) => sum + (dup.occurrences - 1), 0);
      
      const result: AnalysisResult = {
        totalLines: lines.length,
        uniqueLines: lines.length - duplicateLineCount,
        duplicateLines: duplicateLineCount,
        redundantSections: redundantPatterns.length,
        duplicates: allDuplicates,
        suggestions: generateSuggestions(allDuplicates, fileType),
        estimatedReduction: Math.round((duplicateLineCount / lines.length) * 100),
      };

      setAnalysisResult(result);
      toast.success(`Analysis complete: ${allDuplicates.length} duplicate entries found`);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed');
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const detectRedundantPatterns = (content: string, type: 'md' | 'yaml'): DuplicateEntry[] => {
    const redundant: DuplicateEntry[] = [];
    
    if (type === 'md') {
      const headerPattern = /^#{1,6}\s+(.+)$/gm;
      const headers = new Map<string, number[]>();
      let match;
      let lineNum = 0;
      
      content.split('\n').forEach((line, index) => {
        if (headerPattern.test(line)) {
          const headerText = line.replace(/^#{1,6}\s+/, '').trim().toLowerCase();
          if (headers.has(headerText)) {
            headers.get(headerText)!.push(index + 1);
          } else {
            headers.set(headerText, [index + 1]);
          }
        }
      });
      
      headers.forEach((locations, header) => {
        if (locations.length > 1) {
          redundant.push({
            id: `redundant_header_${Math.random().toString(36).substr(2, 9)}`,
            content: header,
            occurrences: locations.length,
            locations: locations.map(loc => `Line ${loc}`),
            type: 'redundant',
            confidence: 95,
          });
        }
      });
    } else if (type === 'yaml') {
      const keyPattern = /^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
      const keys = new Map<string, number[]>();
      
      content.split('\n').forEach((line, index) => {
        const match = keyPattern.exec(line);
        if (match) {
          const key = match[2].toLowerCase();
          if (keys.has(key)) {
            keys.get(key)!.push(index + 1);
          } else {
            keys.set(key, [index + 1]);
          }
        }
      });
      
      keys.forEach((locations, key) => {
        if (locations.length > 1) {
          redundant.push({
            id: `redundant_key_${Math.random().toString(36).substr(2, 9)}`,
            content: key,
            occurrences: locations.length,
            locations: locations.map(loc => `Line ${loc}`),
            type: 'redundant',
            confidence: 90,
          });
        }
      });
    }
    
    return redundant;
  };

  const generateSuggestions = (duplicates: DuplicateEntry[], type: 'md' | 'yaml'): string[] => {
    const suggestions: string[] = [];
    
    const exactCount = duplicates.filter(d => d.type === 'exact').length;
    const similarCount = duplicates.filter(d => d.type === 'similar').length;
    const redundantCount = duplicates.filter(d => d.type === 'redundant').length;
    
    if (exactCount > 0) {
      suggestions.push(`Remove ${exactCount} exact duplicate entries to reduce file size`);
    }
    
    if (similarCount > 0) {
      suggestions.push(`Consolidate ${similarCount} similar entries under unified sections`);
    }
    
    if (redundantCount > 0) {
      if (type === 'md') {
        suggestions.push(`Merge ${redundantCount} redundant headers into single sections`);
      } else {
        suggestions.push(`Consolidate ${redundantCount} duplicate YAML keys`);
      }
    }
    
    if (duplicates.length > 10) {
      suggestions.push('Consider restructuring the document for better organization');
    }
    
    suggestions.push('Validate syntax after deduplication to ensure correctness');
    suggestions.push('Review consolidated sections for semantic accuracy');
    
    return suggestions;
  };

  const performDeduplication = async () => {
    if (!analysisResult || analysisResult.duplicates.length === 0) {
      toast.error('No duplicates to remove');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(25);

      const lines = inputContent.split('\n');
      const linesToRemove = new Set<number>();
      
      analysisResult.duplicates.forEach(duplicate => {
        if (selectedDuplicates.size === 0 || selectedDuplicates.has(duplicate.id)) {
          const locations = duplicate.locations
            .map(loc => parseInt(loc.replace('Line ', '')))
            .sort((a, b) => a - b);
          
          locations.slice(1).forEach(lineNum => {
            linesToRemove.add(lineNum - 1);
          });
        }
      });

      setProgress(50);

      const deduplicated = lines
        .filter((_, index) => !linesToRemove.has(index))
        .join('\n');

      setProgress(75);

      const validationResult = validateOutput(deduplicated, fileType);
      
      if (!validationResult.valid) {
        toast.warning('Validation warnings detected', {
          description: validationResult.warnings.join(', '),
        });
      }

      setProgress(100);

      setOutputContent(deduplicated);
      toast.success(`Deduplication complete: Removed ${linesToRemove.size} duplicate lines`);
    } catch (error) {
      console.error('Deduplication error:', error);
      toast.error('Deduplication failed');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const validateOutput = (content: string, type: 'md' | 'yaml'): { valid: boolean; warnings: string[] } => {
    const warnings: string[] = [];
    
    if (type === 'md') {
      const lines = content.split('\n');
      let inCodeBlock = false;
      
      lines.forEach((line, index) => {
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
        }
        
        if (line.trim().startsWith('#') && inCodeBlock) {
          warnings.push(`Potential header inside code block at line ${index + 1}`);
        }
      });
      
      if (inCodeBlock) {
        warnings.push('Unclosed code block detected');
      }
    } else if (type === 'yaml') {
      const lines = content.split('\n');
      const indentStack: number[] = [];
      
      lines.forEach((line, index) => {
        if (line.trim() && !line.trim().startsWith('#')) {
          const indent = line.search(/\S/);
          
          if (indent % 2 !== 0) {
            warnings.push(`Inconsistent indentation at line ${index + 1}`);
          }
        }
      });
    }
    
    return {
      valid: warnings.length === 0,
      warnings,
    };
  };

  const handleDownload = () => {
    if (!outputContent) {
      toast.error('No content to download');
      return;
    }

    const blob = new Blob([outputContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deduplicated_spec.${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('File downloaded successfully');
  };

  const toggleDuplicateSelection = (id: string) => {
    setSelectedDuplicates(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllDuplicates = () => {
    if (analysisResult) {
      setSelectedDuplicates(new Set(analysisResult.duplicates.map(d => d.id)));
    }
  };

  const deselectAllDuplicates = () => {
    setSelectedDuplicates(new Set());
  };

  const getDuplicateTypeColor = (type: string) => {
    switch (type) {
      case 'exact':
        return 'text-red-500 border-red-500';
      case 'similar':
        return 'text-orange-500 border-orange-500';
      case 'redundant':
        return 'text-yellow-500 border-yellow-500';
      default:
        return 'text-muted-foreground border-muted';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Specification Deduplication & Cleanup System
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Automated detection and removal of duplicate, redundant, and similar entries in specification files
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
          <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card className="cyber-gradient border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-primary" />
                <span>File Upload & Input</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Specification File (.md, .yaml)</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".md,.yaml,.yml"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-input">Or Paste Content Directly</Label>
                <Textarea
                  id="content-input"
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder="Paste your specification content here..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={analyzeContent}
                  disabled={isAnalyzing || !inputContent.trim()}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze Content
                    </>
                  )}
                </Button>
              </div>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Analysis Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {analysisResult && (
            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileCheck className="h-5 w-5 text-accent" />
                  <span>Analysis Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="text-center py-4">
                      <div className="text-2xl font-bold text-blue-500">{analysisResult.totalLines}</div>
                      <div className="text-sm font-medium">Total Lines</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="text-center py-4">
                      <div className="text-2xl font-bold text-green-500">{analysisResult.uniqueLines}</div>
                      <div className="text-sm font-medium">Unique Lines</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="text-center py-4">
                      <div className="text-2xl font-bold text-red-500">{analysisResult.duplicateLines}</div>
                      <div className="text-sm font-medium">Duplicate Lines</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="text-center py-4">
                      <div className="text-2xl font-bold text-orange-500">{analysisResult.estimatedReduction}%</div>
                      <div className="text-sm font-medium">Est. Reduction</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Recommendations</h3>
                  <ScrollArea className="h-[150px]">
                    <div className="space-y-2">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <Alert key={index} className="border-blue-500/20 bg-blue-500/5">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <AlertDescription>{suggestion}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="duplicates" className="space-y-6">
          {analysisResult && analysisResult.duplicates.length > 0 ? (
            <>
              <Card className="cyber-gradient border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileWarning className="h-5 w-5 text-purple-500" />
                      <span>Detected Duplicates ({analysisResult.duplicates.length})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button onClick={selectAllDuplicates} variant="outline" size="sm">
                        Select All
                      </Button>
                      <Button onClick={deselectAllDuplicates} variant="outline" size="sm">
                        Deselect All
                      </Button>
                      <Button
                        onClick={performDeduplication}
                        disabled={isProcessing}
                        size="sm"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Deduplicate
                          </>
                        )}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isProcessing && (
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Deduplication Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {analysisResult.duplicates.map((duplicate) => (
                        <Card
                          key={duplicate.id}
                          className={`border-2 cursor-pointer transition-all ${
                            selectedDuplicates.has(duplicate.id)
                              ? 'border-primary bg-primary/5'
                              : getDuplicateTypeColor(duplicate.type)
                          }`}
                          onClick={() => toggleDuplicateSelection(duplicate.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {duplicate.type}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {duplicate.occurrences} occurrences
                                  </Badge>
                                  <Badge variant="default" className="text-xs">
                                    {duplicate.confidence}% confidence
                                  </Badge>
                                </div>
                                <div className="font-mono text-sm bg-muted p-2 rounded">
                                  {duplicate.content.substring(0, 100)}
                                  {duplicate.content.length > 100 && '...'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Found at: {duplicate.locations.slice(0, 5).join(', ')}
                                  {duplicate.locations.length > 5 && ` +${duplicate.locations.length - 5} more`}
                                </div>
                              </div>
                              <div className="ml-4">
                                {selectedDuplicates.has(duplicate.id) ? (
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                ) : (
                                  <div className="h-5 w-5 border-2 border-muted rounded" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No duplicates detected. Run analysis first to identify duplicate entries.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="output" className="space-y-6">
          <Card className="cyber-gradient border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-5 w-5 text-green-500" />
                  <span>Deduplicated Output</span>
                </div>
                <Button
                  onClick={handleDownload}
                  disabled={!outputContent}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {outputContent ? (
                <Textarea
                  value={outputContent}
                  readOnly
                  className="min-h-[500px] font-mono text-sm"
                />
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No output available. Perform deduplication first to generate cleaned content.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="cyber-gradient border-cyan-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-cyan-500" />
                <span>Deduplication Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file-type">File Type</Label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant={fileType === 'md' ? 'default' : 'outline'}
                    onClick={() => setFileType('md')}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Markdown (.md)
                  </Button>
                  <Button
                    variant={fileType === 'yaml' ? 'default' : 'outline'}
                    onClick={() => setFileType('yaml')}
                    className="flex-1"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    YAML (.yaml)
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="similarity-threshold">
                  Similarity Threshold: {similarityThreshold}%
                </Label>
                <Input
                  id="similarity-threshold"
                  type="range"
                  min="50"
                  max="100"
                  value={similarityThreshold}
                  onChange={(e) => setSimilarityThreshold(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Higher values detect only very similar entries. Lower values detect more variations.
                </p>
              </div>

              <Alert className="border-blue-500/20 bg-blue-500/5">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription>
                  <p className="font-medium mb-2">Deduplication Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Exact duplicate detection (100% match)</li>
                    <li>Similar content detection (configurable threshold)</li>
                    <li>Redundant section identification</li>
                    <li>Syntax validation after cleanup</li>
                    <li>Structure preservation</li>
                    <li>Comment retention</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
