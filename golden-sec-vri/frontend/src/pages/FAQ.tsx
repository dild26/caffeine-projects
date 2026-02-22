import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HelpCircle, Search, Plus, Edit, Trash2, Sparkles, Gem, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';
import { useGetFAQs, useIsCallerAdmin, useCreateFAQ, useUpdateFAQ, useDeleteFAQ, useCheckFAQIntegrity, useRunDataIntegrityTests } from '@/hooks/useQueries';
import type { FAQ } from '@/backend';

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showIntegrityWarning, setShowIntegrityWarning] = useState(false);

  const { data: faqs = [], isLoading } = useGetFAQs();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: faqIntegrityCheck = true } = useCheckFAQIntegrity();
  const createFAQ = useCreateFAQ();
  const updateFAQ = useUpdateFAQ();
  const deleteFAQ = useDeleteFAQ();
  const runIntegrityTests = useRunDataIntegrityTests();

  // Monitor FAQ count and show warning if below expected
  useEffect(() => {
    if (faqs.length > 0 && faqs.length < 39) {
      setShowIntegrityWarning(true);
    } else {
      setShowIntegrityWarning(false);
    }
  }, [faqs.length]);

  // Filter FAQs based on search term
  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Highlight keywords in text with search term highlighting
  const highlightKeywords = (text: string) => {
    const keywords = ['SECoin', 'blockchain', 'fractional ownership', 'real estate', 'investment', 'property', 'transparent', 'secure', 'digital', 'cryptocurrency', 'tokenized'];
    let highlightedText = text;

    // First highlight search term if present
    if (searchTerm.trim()) {
      const searchRegex = new RegExp(`(${searchTerm.trim()})`, 'gi');
      highlightedText = highlightedText.replace(
        searchRegex,
        '<mark class="bg-accent/30 text-accent-foreground font-semibold px-1 rounded">$1</mark>'
      );
    }

    // Then highlight keywords
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        '<span class="font-semibold text-accent">$1</span>'
      );
    });

    return highlightedText;
  };

  const handleCreateFAQ = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get('question') as string;
    const answer = formData.get('answer') as string;
    const order = BigInt(formData.get('order') as string || faqs.length + 1);

    createFAQ.mutate(
      { question, answer, order },
      {
        onSuccess: () => {
          setIsCreateDialogOpen(false);
          (e.target as HTMLFormElement).reset();
        },
      }
    );
  };

  const handleUpdateFAQ = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingFAQ) return;

    const formData = new FormData(e.currentTarget);
    const question = formData.get('question') as string;
    const answer = formData.get('answer') as string;
    const order = BigInt(formData.get('order') as string);

    updateFAQ.mutate(
      { id: editingFAQ.id, question, answer, order },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditingFAQ(null);
        },
      }
    );
  };

  const handleDeleteFAQ = (id: string) => {
    deleteFAQ.mutate(id);
  };

  const handleRunIntegrityTests = () => {
    runIntegrityTests.mutate();
  };

  return (
    <div className="container px-4 py-8">
      {/* Data Integrity Status */}
      {isAdmin && (
        <div className="mb-6 max-w-4xl mx-auto">
          {showIntegrityWarning ? (
            <Alert variant="destructive" className="border-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="font-bold">Data Integrity Warning</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>
                  FAQ count is {faqs.length} (expected: 39). Some FAQ data may be missing.
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRunIntegrityTests}
                  disabled={runIntegrityTests.isPending}
                  className="ml-4"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  {runIntegrityTests.isPending ? 'Testing...' : 'Run Integrity Check'}
                </Button>
              </AlertDescription>
            </Alert>
          ) : faqIntegrityCheck && faqs.length === 39 ? (
            <Alert className="border-2 border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="font-bold text-green-700">Data Integrity: OK</AlertTitle>
              <AlertDescription className="text-green-600">
                All {faqs.length} FAQ entries are present and accounted for.
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
      )}

      {/* Hero Header */}
      <div className="mb-10 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-2xl border-4 border-primary/20">
            <Gem className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="mb-3 text-4xl font-bold text-foreground md:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover everything you need to know about <span className="font-bold text-primary">SECoin</span> and how it revolutionizes real estate investment
        </p>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="mb-6 flex justify-center gap-3">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg">
                <Plus className="h-4 w-4" />
                Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form onSubmit={handleCreateFAQ}>
                <DialogHeader>
                  <DialogTitle>Create New FAQ</DialogTitle>
                  <DialogDescription>Add a new frequently asked question and answer.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question</Label>
                    <Input id="question" name="question" placeholder="Enter the question" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="answer">Answer</Label>
                    <Textarea
                      id="answer"
                      name="answer"
                      placeholder="Enter the answer"
                      rows={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      placeholder="Enter display order"
                      defaultValue={faqs.length + 1}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createFAQ.isPending}>
                    {createFAQ.isPending ? 'Creating...' : 'Create FAQ'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <Card className="border-4 border-primary/20 shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-primary" />
              <Input
                type="text"
                placeholder="Search FAQs by keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 h-14 text-base border-2 border-primary/20 focus:border-accent shadow-md"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <Card className="border-4 border-primary/20 shadow-2xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-16">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            </CardContent>
          </Card>
        ) : filteredFAQs.length === 0 ? (
          <Card className="border-4 border-primary/20 shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-6">
              <div className="text-center py-16">
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <p className="text-xl font-semibold text-muted-foreground mb-2">
                  {searchTerm ? 'No FAQs found matching your search.' : 'No FAQs available yet.'}
                </p>
                {searchTerm && (
                  <p className="text-sm text-muted-foreground">
                    Try different keywords or clear your search to see all FAQs.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-4 border-primary/20 shadow-2xl bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="border-b-2 border-primary/10 text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span>
                  {searchTerm ? `Search Results (${filteredFAQs.length})` : `All Questions (${filteredFAQs.length})`}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className="border-2 border-primary/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-background to-accent/5"
                  >
                    <AccordionItem value={faq.id} className="border-none">
                      <AccordionTrigger className="hover:no-underline group px-6 py-4">
                        <div className="flex flex-col items-center justify-center w-full gap-4">
                          <div className="flex items-center justify-center gap-4 w-full">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold shadow-md">
                              {index + 1}
                            </div>
                            <span className="font-semibold text-lg group-hover:text-primary transition-colors leading-relaxed text-center flex-1">
                              {faq.question}
                            </span>
                            {isAdmin && (
                              <div className="flex gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingFAQ(faq);
                                    setIsEditDialogOpen(true);
                                  }}
                                  className="h-9 w-9 p-0 hover:bg-primary/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this FAQ? This action cannot be undone.
                                        {faqs.length <= 39 && (
                                          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
                                            <p className="text-destructive font-semibold flex items-center gap-2">
                                              <AlertTriangle className="h-4 w-4" />
                                              Warning: This will reduce FAQ count below the expected 39 entries.
                                            </p>
                                          </div>
                                        )}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteFAQ(faq.id)}
                                        className="bg-destructive hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 pt-2">
                        <div className="flex justify-center">
                          <div className="max-w-3xl border-l-4 border-accent/30 pl-6 py-2">
                            <div
                              dangerouslySetInnerHTML={{ __html: highlightKeywords(faq.answer) }}
                              className="text-muted-foreground leading-relaxed text-base text-center"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      {editingFAQ && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleUpdateFAQ}>
              <DialogHeader>
                <DialogTitle>Edit FAQ</DialogTitle>
                <DialogDescription>Update the question and answer.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-question">Question</Label>
                  <Input
                    id="edit-question"
                    name="question"
                    defaultValue={editingFAQ.question}
                    placeholder="Enter the question"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-answer">Answer</Label>
                  <Textarea
                    id="edit-answer"
                    name="answer"
                    defaultValue={editingFAQ.answer}
                    placeholder="Enter the answer"
                    rows={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-order">Display Order</Label>
                  <Input
                    id="edit-order"
                    name="order"
                    type="number"
                    defaultValue={Number(editingFAQ.order)}
                    placeholder="Enter display order"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingFAQ(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateFAQ.isPending}>
                  {updateFAQ.isPending ? 'Updating...' : 'Update FAQ'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Still Have Questions Section */}
      <div className="mt-10 max-w-4xl mx-auto">
        <Card className="border-4 border-accent/30 shadow-2xl bg-gradient-to-br from-accent/10 to-primary/10">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/80 shadow-lg">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="mb-3 text-2xl font-bold text-foreground">Still have questions?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              If you couldn't find the answer you're looking for, please don't hesitate to contact our support
              team. We're here to help you with any questions about property investment on{' '}
              <span className="font-bold text-accent">SECoin</span>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
