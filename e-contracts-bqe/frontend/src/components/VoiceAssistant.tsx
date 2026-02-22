import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from './VoiceProvider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function VoiceAssistant() {
  const { isListening, isSpeaking, toggleListening, toggleSpeaking, transcript } = useVoice();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        {isExpanded && (
          <Card className="mb-4 w-80 border-border/50 bg-card/95 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Voice Assistant</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    aria-label="Collapse voice assistant"
                  >
                    ×
                  </Button>
                </div>
                
                {transcript && (
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <p className="text-muted-foreground">Last command:</p>
                    <p className="mt-1 font-medium">{transcript}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Available commands:</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• "Create new contract"</li>
                    <li>• "Show all contracts"</li>
                    <li>• "Show active contracts"</li>
                    <li>• "Go to dashboard"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={isSpeaking ? 'default' : 'secondary'}
                onClick={toggleSpeaking}
                className="h-14 w-14 rounded-full shadow-lg transition-all hover:scale-110"
                aria-label={isSpeaking ? 'Disable text-to-speech' : 'Enable text-to-speech'}
              >
                {isSpeaking ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isSpeaking ? 'Disable TTS' : 'Enable TTS'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={isListening ? 'default' : 'secondary'}
                onClick={() => {
                  toggleListening();
                  if (!isExpanded) setIsExpanded(true);
                }}
                className={`h-14 w-14 rounded-full shadow-lg transition-all hover:scale-110 ${
                  isListening ? 'animate-pulse bg-destructive hover:bg-destructive/90' : ''
                }`}
                aria-label={isListening ? 'Stop listening' : 'Start voice commands'}
              >
                {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isListening ? 'Stop listening' : 'Start voice commands'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
