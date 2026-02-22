import { useState, useMemo, useRef, useEffect } from 'react';
import { useGetResources, useGetInstructors } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Users, Share2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ForceGraph2D from 'react-force-graph-2d';
import { useTheme } from '@/components/ThemeProvider';
import { useNavigate } from '@tanstack/react-router';

export default function ExplorePage() {
  const { data: resources = [] } = useGetResources();
  const { data: instructors = [] } = useGetInstructors();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [graphDimensions, setGraphDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  // Resize observer for graph container
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setGraphDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Prepare Graph Data
  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    const addedCategories = new Set();
    const addedTopics = new Set();

    // Central Node
    nodes.push({ id: 'root', name: 'Knowledge', val: 20, color: '#f59e0b', type: 'root' });

    resources.forEach(r => {
      // Category Nodes
      if (!addedCategories.has(r.category)) {
        nodes.push({ id: `cat-${r.category}`, name: r.category, val: 10, color: '#ec4899', type: 'category' });
        links.push({ source: 'root', target: `cat-${r.category}` });
        addedCategories.add(r.category);
      }

      // Resource Nodes
      // Filter by search
      if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase()) && !r.category.includes(searchQuery)) return;

      nodes.push({ id: r.id, name: r.title, val: 5, color: '#3b82f6', type: 'resource', data: r });
      links.push({ source: `cat-${r.category}`, target: r.id });

      // Topic Links
      r.topics.forEach(t => {
        if (!addedTopics.has(t)) {
          nodes.push({ id: `top-${t}`, name: t, val: 3, color: '#8b5cf6', type: 'topic' });
          addedTopics.add(t);
        }
        links.push({ source: r.id, target: `top-${t}` });
      });
    });

    return { nodes, links };
  }, [resources, searchQuery]);

  const handleNodeClick = (node: any) => {
    if (node.type === 'resource') {
      setSelectedNode(node.data);
    } else {
      // Focus on node
      graphRef.current?.centerAt(node.x, node.y, 1000);
      graphRef.current?.zoom(3, 2000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top Bar */}
      <div className="p-4 border-b border-border/40 bg-background/50 backdrop-blur-md z-10 flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Knowledge Graph
          </h1>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-primary/20"
          />
        </div>
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Graph Area */}
        <div ref={containerRef} className="flex-1 bg-gradient-to-br from-background to-secondary/5 relative">
          <div className="absolute inset-0 z-0">
            {/* Grid Pattern */}
            <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <ForceGraph2D
            ref={graphRef}
            width={graphDimensions.width}
            height={graphDimensions.height}
            graphData={graphData}
            nodeLabel="name"
            nodeVal="val"
            nodeColor="color"
            linkColor={() => theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}
            backgroundColor="transparent"
            onNodeClick={handleNodeClick}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.name;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              // const textWidth = ctx.measureText(label).width;
              // const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

              ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
              if (node.type === 'category') ctx.fillStyle = 'rgba(236, 72, 153, 0.1)';
              if (node.type === 'root') ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';

              ctx.beginPath();
              ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
              ctx.fill();

              // Specific colors
              ctx.fillStyle = node.color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, node.val > 5 ? 4 : 2, 0, 2 * Math.PI, false);
              ctx.fill();

              // Text
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
              if (node.val > 5 || globalScale > 2) {
                ctx.fillText(label, node.x, node.y + node.val + 2);
              }
            }}
          />

          <div className="absolute bottom-4 left-4 flex gap-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur border-yellow-500/50 text-yellow-500">
              Root
            </Badge>
            <Badge variant="outline" className="bg-background/80 backdrop-blur border-pink-500/50 text-pink-500">
              Category
            </Badge>
            <Badge variant="outline" className="bg-background/80 backdrop-blur border-blue-500/50 text-blue-500">
              Resource
            </Badge>
            <Badge variant="outline" className="bg-background/80 backdrop-blur border-purple-500/50 text-purple-500">
              Topic
            </Badge>
          </div>
        </div>

        {/* Sidebar / Details Panel */}
        <AnimatePresence>
          {selectedNode ? (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-card/90 backdrop-blur-xl border-l border-border/50 shadow-2xl p-6 overflow-y-auto z-20"
            >
              <div className="flex justify-between items-start mb-6">
                <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <Badge className="mb-2">{selectedNode.category}</Badge>
                  <h2 className="text-2xl font-bold">{selectedNode.title}</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" /> Mentors
                    </span>
                    <span className="font-bold">
                      {instructors.filter(i => (i as any).topics?.some((t: string) => selectedNode.topics.includes(t))).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> Type
                    </span>
                    <span className="font-bold capitalize">{selectedNode.type}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Topics</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.topics.map((t: string) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <Button className="w-full" onClick={() => navigate({ to: '/appointments' })}>
                    Book Session
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
