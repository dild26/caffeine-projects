import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Upload, Download, Link2, AlertCircle, CheckCircle2, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { toast } from 'sonner';

// Local type definition for grid cells
interface GridCell {
  value: string;
  isEnabled: boolean;
}

// Helper function to extract display text from URL (remove protocol and www)
const extractDisplayText = (url: string): string => {
  let displayText = url;
  const prefixes = ['http://', 'https://', 'www.'];
  
  for (const prefix of prefixes) {
    if (displayText.startsWith(prefix)) {
      displayText = displayText.substring(prefix.length);
    }
  }
  
  return displayText;
};

export default function GridGeneratorTab() {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [gridCells, setGridCells] = useState<GridCell[][]>(
    Array(3).fill(null).map(() => 
      Array(3).fill(null).map(() => ({ value: '', isEnabled: true }))
    )
  );
  const [formInputs, setFormInputs] = useState<GridCell[]>(
    Array(6).fill(null).map(() => ({ value: '', isEnabled: true }))
  );
  const [patternSettings, setPatternSettings] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const linksPerPage = 100;

  // Helper function to parse range input like "1:255"
  const parseRange = (input: string): number[] | null => {
    const trimmed = input.trim();
    if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      if (parts.length === 2) {
        const start = parseInt(parts[0].trim());
        const end = parseInt(parts[1].trim());
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }
      }
    }
    return null;
  };

  // Generate links based on enabled inputs with proper IP address handling - NO LIMITS
  const generatedLinks = useMemo(() => {
    const enabledValues: string[] = [];
    
    // Collect enabled grid cell values
    gridCells.forEach(row => {
      row.forEach(cell => {
        if (cell.isEnabled && cell.value.trim()) {
          enabledValues.push(cell.value.trim());
        }
      });
    });
    
    // Collect enabled form input values
    formInputs.forEach(input => {
      if (input.isEnabled && input.value.trim()) {
        enabledValues.push(input.value.trim());
      }
    });
    
    if (enabledValues.length === 0) {
      return [];
    }
    
    // Detect if this is an IP address pattern
    const isIPPattern = enabledValues.length >= 5 && 
                        enabledValues.slice(1, 5).every(val => val.includes(':'));
    
    if (isIPPattern) {
      // IP address generation with proper dot separators - UNLIMITED
      const baseUrl = enabledValues[0];
      const octet1Range = parseRange(enabledValues[1]);
      const octet2Range = parseRange(enabledValues[2]);
      const octet3Range = parseRange(enabledValues[3]);
      const octet4Range = parseRange(enabledValues[4]);
      
      if (!octet1Range || !octet2Range || !octet3Range || !octet4Range) {
        return [];
      }
      
      const links: string[] = [];
      
      // Generate ALL combinations with proper sequential increment
      // Only the last octet increments first, then overflow to next octet
      for (const o1 of octet1Range) {
        for (const o2 of octet2Range) {
          for (const o3 of octet3Range) {
            for (const o4 of octet4Range) {
              const ip = `${o1}.${o2}.${o3}.${o4}`;
              links.push(baseUrl + ip);
            }
          }
        }
      }
      
      return links;
    }
    
    // General pattern: expand ranges and generate combinations - UNLIMITED
    const parsedValues = enabledValues.map(val => {
      const range = parseRange(val);
      if (range) {
        return range.map(String);
      }
      return [val];
    });
    
    // Generate cartesian product - NO LIMIT
    const generateCombinations = (arrays: string[][]): string[] => {
      if (arrays.length === 0) return [];
      if (arrays.length === 1) return arrays[0];
      
      const result: string[] = [];
      
      const generate = (current: string[], index: number) => {
        if (index === arrays.length) {
          result.push(current.join(''));
          return;
        }
        
        for (const value of arrays[index]) {
          generate([...current, value], index + 1);
        }
      };
      
      generate([], 0);
      return result;
    };
    
    return generateCombinations(parsedValues);
  }, [gridCells, formInputs]);

  const totalPages = Math.ceil(generatedLinks.length / linksPerPage);
  const paginatedLinks = generatedLinks.slice(
    currentPage * linksPerPage,
    (currentPage + 1) * linksPerPage
  );

  const handleAddRow = () => {
    if (rows >= 10) {
      toast.error('Maximum 10 rows allowed');
      return;
    }
    setRows(rows + 1);
    setGridCells([...gridCells, Array(columns).fill(null).map(() => ({ value: '', isEnabled: true }))]);
  };

  const handleAddColumn = () => {
    if (columns >= 10) {
      toast.error('Maximum 10 columns allowed');
      return;
    }
    setColumns(columns + 1);
    setGridCells(gridCells.map(row => [...row, { value: '', isEnabled: true }]));
  };

  const handleRemoveRow = () => {
    if (rows <= 1) {
      toast.error('Minimum 1 row required');
      return;
    }
    setRows(rows - 1);
    setGridCells(gridCells.slice(0, -1));
  };

  const handleRemoveColumn = () => {
    if (columns <= 1) {
      toast.error('Minimum 1 column required');
      return;
    }
    setColumns(columns - 1);
    setGridCells(gridCells.map(row => row.slice(0, -1)));
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newCells = [...gridCells];
    newCells[rowIndex][colIndex] = { ...newCells[rowIndex][colIndex], value };
    setGridCells(newCells);
  };

  const handleCellToggle = (rowIndex: number, colIndex: number) => {
    const newCells = [...gridCells];
    newCells[rowIndex][colIndex] = { 
      ...newCells[rowIndex][colIndex], 
      isEnabled: !newCells[rowIndex][colIndex].isEnabled 
    };
    setGridCells(newCells);
  };

  const handleFormInputChange = (index: number, value: string) => {
    const newInputs = [...formInputs];
    newInputs[index] = { ...newInputs[index], value };
    setFormInputs(newInputs);
  };

  const handleFormInputToggle = (index: number) => {
    const newInputs = [...formInputs];
    newInputs[index] = { ...newInputs[index], isEnabled: !newInputs[index].isEnabled };
    setFormInputs(newInputs);
  };

  const handleCsvImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const csvData = lines.map(line => line.split(',').map(cell => cell.trim()));
        
        if (csvData.length === 0) {
          toast.error('CSV file is empty');
          return;
        }

        const newRows = csvData.length;
        const newColumns = Math.max(...csvData.map(row => row.length));
        
        if (newRows > 10 || newColumns > 10) {
          toast.error('CSV data exceeds maximum grid size (10x10)');
          return;
        }

        setRows(newRows);
        setColumns(newColumns);
        
        const newCells = csvData.map(row => 
          Array(newColumns).fill(null).map((_, i) => ({
            value: row[i] || '',
            isEnabled: true
          }))
        );
        
        setGridCells(newCells);
        toast.success(`CSV imported successfully (${newRows}x${newColumns})`);
      } catch (error) {
        toast.error('Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  };

  const handleExportLinks = (format: 'csv' | 'json' | 'txt') => {
    if (generatedLinks.length === 0) {
      toast.error('No links to export');
      return;
    }

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'csv':
        content = generatedLinks.join('\n');
        filename = 'generated-links.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
        content = JSON.stringify({ links: generatedLinks, count: generatedLinks.length }, null, 2);
        filename = 'generated-links.json';
        mimeType = 'application/json';
        break;
      case 'txt':
        content = generatedLinks.join('\n');
        filename = 'generated-links.txt';
        mimeType = 'text/plain';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${generatedLinks.length} links as ${format.toUpperCase()}`);
  };

  const handleReset = () => {
    setRows(3);
    setColumns(3);
    setGridCells(
      Array(3).fill(null).map(() => 
        Array(3).fill(null).map(() => ({ value: '', isEnabled: true }))
      )
    );
    setFormInputs(
      Array(6).fill(null).map(() => ({ value: '', isEnabled: true }))
    );
    setPatternSettings('');
    setCurrentPage(0);
    toast.success('Grid reset to default 3×3');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Link2 className="h-6 w-6" />
            Configurable Grid Generator
          </CardTitle>
          <CardDescription>
            Create custom link patterns using a dynamic grid and form inputs with CSV import support - unlimited link generation with proper sequential increment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Grid Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Button onClick={handleAddRow} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Row
              </Button>
              <Button onClick={handleRemoveRow} size="sm" variant="outline" disabled={rows <= 1}>
                <Trash2 className="h-4 w-4 mr-1" />
                Remove Row
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleAddColumn} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Column
              </Button>
              <Button onClick={handleRemoveColumn} size="sm" variant="outline" disabled={columns <= 1}>
                <Trash2 className="h-4 w-4 mr-1" />
                Remove Column
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="csv-import" className="cursor-pointer">
                <Button size="sm" variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-1" />
                    Import CSV
                  </span>
                </Button>
              </Label>
              <Input
                id="csv-import"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleCsvImport}
              />
            </div>
            <Button onClick={handleReset} size="sm" variant="ghost">
              Reset to 3×3
            </Button>
            <Badge variant="secondary" className="ml-auto">
              {rows}×{columns} Grid
            </Badge>
          </div>

          <Separator />

          {/* Grid Table */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Configuration Grid</Label>
            <div className="border rounded-lg p-4 bg-muted/30 overflow-x-auto">
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(120px, 1fr))` }}>
                {gridCells.map((row, rowIndex) => (
                  row.map((cell, colIndex) => (
                    <div key={`${rowIndex}-${colIndex}`} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={cell.isEnabled}
                          onCheckedChange={() => handleCellToggle(rowIndex, colIndex)}
                        />
                        <Label className="text-xs text-muted-foreground">
                          [{rowIndex + 1},{colIndex + 1}]
                        </Label>
                      </div>
                      <Input
                        value={cell.value}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        placeholder={`Cell ${rowIndex + 1},${colIndex + 1}`}
                        disabled={!cell.isEnabled}
                        className="h-9"
                      />
                    </div>
                  ))
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Infi-Links Form */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Infi-Links Form</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formInputs.map((input, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={input.isEnabled}
                      onCheckedChange={() => handleFormInputToggle(index)}
                    />
                    <Label className="text-sm">Input {index + 1}</Label>
                  </div>
                  <Input
                    value={input.value}
                    onChange={(e) => handleFormInputChange(index, e.target.value)}
                    placeholder={`Enter value or range (e.g., 1:255)`}
                    disabled={!input.isEnabled}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Pattern Settings */}
          <div className="space-y-2">
            <Label htmlFor="pattern-settings" className="text-base font-semibold">
              Pattern Settings (Optional)
            </Label>
            <Textarea
              id="pattern-settings"
              value={patternSettings}
              onChange={(e) => setPatternSettings(e.target.value)}
              placeholder="Enter custom pattern configuration or notes..."
              rows={3}
            />
          </div>

          <Separator />

          {/* Generated Links Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Generated Links Preview - All Links Displayed</Label>
              <div className="flex items-center gap-2">
                <Badge variant={generatedLinks.length > 0 ? 'default' : 'secondary'}>
                  {generatedLinks.length.toLocaleString()} {generatedLinks.length === 1 ? 'link' : 'links'}
                </Badge>
                {generatedLinks.length > 0 && (
                  <>
                    <Button onClick={() => handleExportLinks('csv')} size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      CSV
                    </Button>
                    <Button onClick={() => handleExportLinks('json')} size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      JSON
                    </Button>
                    <Button onClick={() => handleExportLinks('txt')} size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      TXT
                    </Button>
                  </>
                )}
              </div>
            </div>

            {generatedLinks.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No links generated yet. Enable and fill in grid cells or form inputs to generate links.
                  Use range notation (e.g., "1:255") to generate multiple combinations. Only the last octet increments sequentially.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="border rounded-lg p-4 bg-muted/30">
                  <ScrollArea className="h-96">
                    <div className="space-y-1">
                      {paginatedLinks.map((link, index) => {
                        const globalIndex = currentPage * linksPerPage + index;
                        const displayText = extractDisplayText(link);
                        return (
                          <div key={globalIndex} className="flex items-center gap-2 text-sm font-mono">
                            <span className="text-muted-foreground w-16">{globalIndex + 1}.</span>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline break-all"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(link, '_blank', 'noopener,noreferrer');
                              }}
                            >
                              {displayText}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(0)}
                      disabled={currentPage === 0}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Next
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages - 1)}
                      disabled={currentPage >= totalPages - 1}
                    >
                      <ChevronsRight className="h-4 w-4" />
                      Last
                    </Button>
                  </div>
                )}

                <p className="text-sm text-muted-foreground text-center">
                  Displaying all {generatedLinks.length.toLocaleString()} links with full pagination support (First/Previous/Next/Last navigation)
                </p>
              </>
            )}
          </div>

          {/* Usage Example */}
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Example:</strong> To generate IP addresses from 1.1.1.1 to 1.1.1.255:
              <br />
              1. Set form inputs: Input 1: "http://", Input 2: "1:1", Input 3: "1:1", Input 4: "1:1", Input 5: "1:255"
              <br />
              2. The system automatically detects IP patterns and inserts dots between octets
              <br />
              3. Only the last octet (Input 5) increments sequentially: 1.1.1.1 → 1.1.1.2 → ... → 1.1.1.255
              <br />
              4. All links will be generated and displayed with full pagination (no limits or truncation)
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
