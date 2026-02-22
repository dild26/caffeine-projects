import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link2, AlertCircle, Info, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function URLGeneratorTab() {
  // Standard Range State
  const [standardBaseUrl, setStandardBaseUrl] = useState('');
  const [standardRangeInput, setStandardRangeInput] = useState('');
  const [standardLinks, setStandardLinks] = useState<string[]>([]);
  const [standardCurrentPage, setStandardCurrentPage] = useState(0);
  const linksPerPage = 100;

  // Multi-Dimensional Range State
  const [multiBaseUrl, setMultiBaseUrl] = useState('');
  const [multiRangeInput, setMultiRangeInput] = useState('');
  const [multiLinks, setMultiLinks] = useState<string[]>([]);
  const [multiCurrentPage, setMultiCurrentPage] = useState(0);

  // Paginated Generator State
  const [paginatedBaseUrl, setPaginatedBaseUrl] = useState('');
  const [paginatedRangeInput, setPaginatedRangeInput] = useState('');
  const [paginatedLinks, setPaginatedLinks] = useState<string[]>([]);
  const [paginatedCurrentPage, setPaginatedCurrentPage] = useState(0);

  // Parse range input like "1:255" or "1:10000"
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

  // Generate Standard Range Links with automatic multi-octet IP generation
  const handleStandardGenerate = () => {
    if (!standardBaseUrl.trim()) {
      toast.error('Please enter a base URL');
      return;
    }

    if (!standardRangeInput.trim()) {
      toast.error('Please enter a range (e.g., 1:255)');
      return;
    }

    const range = parseRange(standardRangeInput);
    if (!range) {
      toast.error('Invalid range format. Use format like "1:255"');
      return;
    }

    const links: string[] = [];
    
    // Check if range is >= 255, use multi-octet IP generation with rollover
    if (range.length >= 255) {
      let octet1 = 1, octet2 = 1, octet3 = 1, octet4 = 1;
      
      for (let i = 0; i < range.length; i++) {
        const ip = `${octet1}.${octet2}.${octet3}.${octet4}`;
        links.push(standardBaseUrl + ip);
        
        // Increment with rollover logic: 1.1.1.1 → 1.1.1.255 → 1.1.2.1
        octet4++;
        if (octet4 > 255) {
          octet4 = 1;
          octet3++;
          if (octet3 > 255) {
            octet3 = 1;
            octet2++;
            if (octet2 > 255) {
              octet2 = 1;
              octet1++;
            }
          }
        }
      }
    } else {
      // Simple range generation for small ranges
      for (const num of range) {
        links.push(standardBaseUrl + num);
      }
    }

    setStandardLinks(links);
    setStandardCurrentPage(0);
    toast.success(`Generated ${links.length.toLocaleString()} links`);
  };

  // Generate Multi-Dimensional Range Links
  const handleMultiGenerate = () => {
    if (!multiBaseUrl.trim()) {
      toast.error('Please enter a base URL');
      return;
    }

    if (!multiRangeInput.trim()) {
      toast.error('Please enter ranges (e.g., 1:10,1:10,1:10)');
      return;
    }

    const rangeInputs = multiRangeInput.split(',').map(r => r.trim());
    const ranges = rangeInputs.map(parseRange).filter(r => r !== null) as number[][];

    if (ranges.length === 0) {
      toast.error('No valid ranges found');
      return;
    }

    // Calculate total combinations
    const totalCombinations = ranges.reduce((acc, range) => acc * range.length, 1);

    if (totalCombinations > 1000000) {
      toast.error(`Total combinations (${totalCombinations.toLocaleString()}) exceeds 1 million. Please reduce range sizes.`);
      return;
    }

    // Generate cartesian product
    const generateCombinations = (arrays: number[][]): string[] => {
      if (arrays.length === 0) return [];
      if (arrays.length === 1) return arrays[0].map(n => multiBaseUrl + n);

      const result: string[] = [];
      
      const generate = (current: string, index: number) => {
        if (index === arrays.length) {
          result.push(current);
          return;
        }

        for (const value of arrays[index]) {
          const separator = index === 0 ? '' : '.';
          generate(current + separator + value, index + 1);
        }
      };

      generate(multiBaseUrl, 0);
      return result;
    };

    const links = generateCombinations(ranges);
    setMultiLinks(links);
    setMultiCurrentPage(0);
    toast.success(`Generated ${links.length.toLocaleString()} multi-dimensional links`);
  };

  // Generate Paginated Links
  const handlePaginatedGenerate = () => {
    if (!paginatedBaseUrl.trim()) {
      toast.error('Please enter a base URL');
      return;
    }

    if (!paginatedRangeInput.trim()) {
      toast.error('Please enter a range (e.g., 1:10000)');
      return;
    }

    const range = parseRange(paginatedRangeInput);
    if (!range) {
      toast.error('Invalid range format. Use format like "1:10000"');
      return;
    }

    const links = range.map(num => paginatedBaseUrl + num);
    setPaginatedLinks(links);
    setPaginatedCurrentPage(0);
    toast.success(`Generated ${links.length.toLocaleString()} paginated links`);
  };

  // Render pagination controls
  const renderPaginationControls = (
    links: string[],
    currentPage: number,
    setCurrentPage: (page: number) => void
  ) => {
    const totalPages = Math.ceil(links.length / linksPerPage);
    const paginatedLinks = links.slice(
      currentPage * linksPerPage,
      (currentPage + 1) * linksPerPage
    );

    return (
      <>
        <ScrollArea className="h-96 border rounded-lg p-4 bg-muted/30">
          <div className="space-y-1">
            {paginatedLinks.map((link, index) => {
              const globalIndex = currentPage * linksPerPage + index;
              return (
                <div key={globalIndex} className="flex items-center gap-2 text-sm font-mono">
                  <span className="text-muted-foreground w-16">{globalIndex + 1}.</span>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {link}
                  </a>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
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
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Link2 className="h-6 w-6" />
            URL Generator
          </CardTitle>
          <CardDescription>
            Generate dynamic links with standard ranges, multi-dimensional patterns, and paginated output
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="standard" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="standard">Standard Range</TabsTrigger>
              <TabsTrigger value="multi">Multi-Dimensional</TabsTrigger>
              <TabsTrigger value="paginated">Paginated Generator</TabsTrigger>
            </TabsList>

            {/* Standard Range Tab */}
            <TabsContent value="standard" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="standard-base-url">Base URL</Label>
                  <Input
                    id="standard-base-url"
                    value={standardBaseUrl}
                    onChange={(e) => setStandardBaseUrl(e.target.value)}
                    placeholder="http://example.com/"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="standard-range">Range (e.g., 1:255 or 1:10000)</Label>
                  <Input
                    id="standard-range"
                    value={standardRangeInput}
                    onChange={(e) => setStandardRangeInput(e.target.value)}
                    placeholder="1:255"
                  />
                </div>

                <Button onClick={handleStandardGenerate} className="w-full">
                  Generate Links
                </Button>

                {standardLinks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Generated Links</Label>
                      <Badge variant="default">
                        {standardLinks.length.toLocaleString()} links
                      </Badge>
                    </div>
                    {renderPaginationControls(standardLinks, standardCurrentPage, setStandardCurrentPage)}
                  </div>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    For ranges ≥255, automatic multi-octet IP generation with rollover logic (1.1.1.1→1.1.1.255→1.1.2.1)
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            {/* Multi-Dimensional Range Tab */}
            <TabsContent value="multi" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="multi-base-url">Base URL</Label>
                  <Input
                    id="multi-base-url"
                    value={multiBaseUrl}
                    onChange={(e) => setMultiBaseUrl(e.target.value)}
                    placeholder="http://example.com/"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="multi-range">Ranges (comma-separated, e.g., 1:10,1:10,1:10)</Label>
                  <Input
                    id="multi-range"
                    value={multiRangeInput}
                    onChange={(e) => setMultiRangeInput(e.target.value)}
                    placeholder="1:10,1:10,1:10"
                  />
                </div>

                <Button onClick={handleMultiGenerate} className="w-full">
                  Generate Multi-Dimensional Links
                </Button>

                {multiLinks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Generated Links</Label>
                      <Badge variant="default">
                        {multiLinks.length.toLocaleString()} links
                      </Badge>
                    </div>
                    {renderPaginationControls(multiLinks, multiCurrentPage, setMultiCurrentPage)}
                  </div>
                )}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Multi-dimensional generation creates cartesian products. Limit: 1 million combinations.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            {/* Paginated Generator Tab */}
            <TabsContent value="paginated" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paginated-base-url">Base URL</Label>
                  <Input
                    id="paginated-base-url"
                    value={paginatedBaseUrl}
                    onChange={(e) => setPaginatedBaseUrl(e.target.value)}
                    placeholder="http://example.com/page/"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paginated-range">Range (unlimited, e.g., 1:100000)</Label>
                  <Input
                    id="paginated-range"
                    value={paginatedRangeInput}
                    onChange={(e) => setPaginatedRangeInput(e.target.value)}
                    placeholder="1:10000"
                  />
                </div>

                <Button onClick={handlePaginatedGenerate} className="w-full">
                  Generate Paginated Links
                </Button>

                {paginatedLinks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Generated Links</Label>
                      <Badge variant="default">
                        {paginatedLinks.length.toLocaleString()} links
                      </Badge>
                    </div>
                    {renderPaginationControls(paginatedLinks, paginatedCurrentPage, setPaginatedCurrentPage)}
                  </div>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Unlimited range support with full pagination. No precision errors for large ranges.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
