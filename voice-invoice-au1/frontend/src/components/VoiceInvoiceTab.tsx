import { useState, useEffect } from 'react';
import { useCreateVoiceInvoiceDraft, useGetMyVoiceInvoiceDrafts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function VoiceInvoiceTab() {
  const [language, setLanguage] = useState('english');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const { identity } = useInternetIdentity();
  const { mutate: createDraft, isPending } = useCreateVoiceInvoiceDraft();
  const { data: drafts, isLoading: draftsLoading } = useGetMyVoiceInvoiceDrafts();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        setTranscript((prev) => prev + finalTranscript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const getLanguageCode = (lang: string) => {
    const codes: Record<string, string> = {
      english: 'en-IN',
      hindi: 'hi-IN',
      malayalam: 'ml-IN',
      kannada: 'kn-IN',
    };
    return codes[lang] || 'en-IN';
  };

  const toggleRecording = () => {
    if (!recognition) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.lang = getLanguageCode(language);
      recognition.start();
      setIsRecording(true);
      toast.info('Recording started. Speak your invoice details...');
    }
  };

  const handleSaveDraft = () => {
    if (!transcript.trim()) {
      toast.error('Please record some voice input first');
      return;
    }

    if (!identity) {
      toast.error('Please login first');
      return;
    }

    const draft = {
      id: `draft-${Date.now()}`,
      voiceInput: transcript,
      language,
      invoiceData: JSON.stringify({ transcript, language, timestamp: Date.now() }),
      status: 'draft',
      owner: identity.getPrincipal(),
    };

    createDraft(draft, {
      onSuccess: () => {
        setTranscript('');
      },
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img src="/assets/generated/voice-input-icon.dim_64x64.png" alt="" className="h-6 w-6" />
            Voice Invoice Creator
          </CardTitle>
          <CardDescription>Create invoices using voice in your preferred language</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Select Language</Label>
            <Select value={language} onValueChange={setLanguage} disabled={isRecording}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                <SelectItem value="malayalam">Malayalam (മലയാളം)</SelectItem>
                <SelectItem value="kannada">Kannada (ಕನ್ನಡ)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Voice Input</Label>
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleRecording}
                variant={isRecording ? 'destructive' : 'default'}
                className="flex-1 gap-2"
                size="lg"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    Start Recording
                  </>
                )}
              </Button>
            </div>
            {isRecording && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <div className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                Recording in progress...
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="transcript">Transcript</Label>
            <Textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your voice input will appear here..."
              className="min-h-[150px]"
            />
          </div>

          <Button onClick={handleSaveDraft} disabled={isPending || !transcript.trim()} className="w-full gap-2">
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Draft...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Drafts</CardTitle>
          <CardDescription>View and manage your voice invoice drafts</CardDescription>
        </CardHeader>
        <CardContent>
          {draftsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !drafts || drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No drafts yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <div key={draft.id} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{draft.language}</Badge>
                    <Badge variant="outline">{draft.status}</Badge>
                  </div>
                  <p className="text-sm line-clamp-2">{draft.voiceInput}</p>
                  <p className="text-xs text-muted-foreground">ID: {draft.id}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
