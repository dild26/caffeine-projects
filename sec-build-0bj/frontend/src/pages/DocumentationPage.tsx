import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Code, BookOpen, Keyboard, Zap } from 'lucide-react';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn how to use the Ethereum Visual Sandbox
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                <CardTitle>Getting Started</CardTitle>
              </div>
              <CardDescription>
                Quick start guide to begin building blockchain workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Login with Internet Identity</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Get Started" and authenticate using Internet Identity for secure, privacy-preserving access.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Create Your Profile</h3>
                <p className="text-sm text-muted-foreground">
                  First-time users will be prompted to enter their name to create a profile.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Explore the Block Library</h3>
                <p className="text-sm text-muted-foreground">
                  Browse 50+ blockchain function blocks organized into 7 categories on the left sidebar.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4. Drag and Drop Blocks</h3>
                <p className="text-sm text-muted-foreground">
                  Drag blocks from the library onto the canvas to build your workflow.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">5. Connect Blocks</h3>
                <p className="text-sm text-muted-foreground">
                  Click and drag from output ports to input ports to create data flow connections.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">6. Execute Your Workflow</h3>
                <p className="text-sm text-muted-foreground">
                  Use the execution controls to run your blockchain workflow and see real-time results.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Keyboard className="w-6 h-6 text-secondary" />
                <CardTitle>Keyboard Shortcuts</CardTitle>
              </div>
              <CardDescription>
                Speed up your workflow with these keyboard shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="general">
                  <AccordionTrigger>General Shortcuts</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Undo</span>
                        <code className="px-2 py-1 bg-muted rounded">Ctrl+Z</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Redo</span>
                        <code className="px-2 py-1 bg-muted rounded">Ctrl+Y</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Save Workspace</span>
                        <code className="px-2 py-1 bg-muted rounded">Ctrl+S</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Import/Export</span>
                        <code className="px-2 py-1 bg-muted rounded">Ctrl+E</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Toggle WebGL</span>
                        <code className="px-2 py-1 bg-muted rounded">Ctrl+G</code>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="views">
                  <AccordionTrigger>View Controls</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Isometric View</span>
                        <code className="px-2 py-1 bg-muted rounded">I</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Front View</span>
                        <code className="px-2 py-1 bg-muted rounded">F</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Side View</span>
                        <code className="px-2 py-1 bg-muted rounded">S</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Top View</span>
                        <code className="px-2 py-1 bg-muted rounded">T</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reset View</span>
                        <code className="px-2 py-1 bg-muted rounded">R</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Toggle Grid</span>
                        <code className="px-2 py-1 bg-muted rounded">G</code>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Code className="w-6 h-6 text-accent" />
                <CardTitle>Conversion Tools</CardTitle>
              </div>
              <CardDescription>
                Command-line examples for conversion operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="tohex">
                  <AccordionTrigger>toHex Converter</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Converts string or number input to hexadecimal format (0x-prefixed)
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Command-line equivalent:</p>
                        <code className="block px-3 py-2 bg-muted rounded text-xs">
                          echo -n "Hello" | xxd -p
                        </code>
                        <p className="text-sm font-semibold">JavaScript equivalent:</p>
                        <code className="block px-3 py-2 bg-muted rounded text-xs">
                          Buffer.from("Hello").toString('hex')
                        </code>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tohash">
                  <AccordionTrigger>toHash Converter</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Generates SHA256 or Keccak256 hash from input data
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Command-line equivalent:</p>
                        <code className="block px-3 py-2 bg-muted rounded text-xs">
                          echo -n "Hello" | sha256sum
                        </code>
                        <p className="text-sm font-semibold">JavaScript equivalent:</p>
                        <code className="block px-3 py-2 bg-muted rounded text-xs">
                          crypto.subtle.digest('SHA-256', data)
                        </code>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tobinary">
                  <AccordionTrigger>toBinary Converter</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Converts hex or string input to binary representation (grouped every 8 bits)
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Command-line equivalent:</p>
                        <code className="block px-3 py-2 bg-muted rounded text-xs">
                          echo -n "Hello" | xxd -b
                        </code>
                        <p className="text-sm font-semibold">JavaScript equivalent:</p>
                        <code className="block px-3 py-2 bg-muted rounded text-xs">
                          parseInt(hex, 16).toString(2)
                        </code>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-success" />
                <CardTitle>Advanced Features</CardTitle>
              </div>
              <CardDescription>
                Explore advanced capabilities of the sandbox
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Custom Block Builder</h3>
                <p className="text-sm text-muted-foreground">
                  Create your own blockchain function blocks with custom inputs, outputs, and logic scripts.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Workspace Management</h3>
                <p className="text-sm text-muted-foreground">
                  Save, load, and organize multiple workspaces with version tracking and metadata.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Import/Export</h3>
                <p className="text-sm text-muted-foreground">
                  Share your workflows by exporting to JSON or importing existing workspace designs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">WebGL Rendering</h3>
                <p className="text-sm text-muted-foreground">
                  Toggle between GPU-accelerated WebGL rendering and CPU-based rendering for optimal performance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
