import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Zap, Image as ImageIcon, Heart, Minus, Plus, FileCode, FileText } from 'lucide-react';
import { WorkflowMetadata } from '../backend';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetSpecConversionStatus } from '../hooks/useQueries';

interface WorkflowCardProps {
  workflow: WorkflowMetadata;
  imageUrl?: string;
  onQuantityChange?: (workflowId: string, quantity: number, selected: boolean) => void;
  initialQuantity?: number;
  initialSelected?: boolean;
}

export default function WorkflowCard({ 
  workflow, 
  imageUrl, 
  onQuantityChange,
  initialQuantity = 5,
  initialSelected = false 
}: WorkflowCardProps) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(initialQuantity);
  const [selected, setSelected] = useState(initialSelected);
  const { data: specStatus } = useGetSpecConversionStatus(workflow.id);

  const formatPrice = (cents: bigint) => {
    const priceInCents = Number(cents);
    const minPriceInCents = 10;
    const finalPrice = Math.max(minPriceInCents, priceInCents);
    return `$${(finalPrice / 100).toFixed(2)}`;
  };

  const calculateTotal = () => {
    const priceInCents = Number(workflow.priceInCents);
    const minPriceInCents = 10;
    const finalPrice = Math.max(minPriceInCents, priceInCents);
    return `$${((finalPrice * quantity) / 100).toFixed(2)}`;
  };

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.max(5, Math.min(100, newQuantity));
    setQuantity(validQuantity);
    if (onQuantityChange) {
      onQuantityChange(workflow.id, validQuantity, selected);
    }
  };

  const handleHeartClick = () => {
    const newSelected = !selected;
    setSelected(newSelected);
    if (newSelected && quantity < 5) {
      setQuantity(5);
      if (onQuantityChange) {
        onQuantityChange(workflow.id, 5, true);
      }
    } else {
      if (onQuantityChange) {
        onQuantityChange(workflow.id, quantity, newSelected);
      }
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    handleQuantityChange(quantity - 1);
  };

  const accessTypeLabel = workflow.accessType === 'payPerRun' ? 'Pay per Run' : 'Subscription';
  const accessTypeVariant = workflow.accessType === 'payPerRun' ? 'default' : 'secondary';

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 flex flex-col ${selected ? 'border-2 border-primary shadow-lg' : 'hover:border-primary/50'}`}>
      {/* Image Section */}
      <div className="relative w-full h-48 bg-muted overflow-hidden rounded-t-lg">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={workflow.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        {/* Heart/Selection Checkbox */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="icon"
            variant={selected ? 'default' : 'secondary'}
            className={`rounded-full shadow-lg transition-all ${selected ? 'bg-red-500 hover:bg-red-600' : ''}`}
            onClick={handleHeartClick}
          >
            <Heart className={`h-5 w-5 ${selected ? 'fill-current' : ''}`} />
          </Button>
        </div>
        {/* Spec File Indicators */}
        {specStatus && (
          <div className="absolute bottom-3 left-3 flex gap-2">
            {specStatus.specMdExists && (
              <Badge variant="secondary" className="text-xs shadow-lg">
                <FileText className="h-3 w-3 mr-1" />
                .md
              </Badge>
            )}
            {specStatus.specMlExists && (
              <Badge variant="default" className="text-xs bg-blue-600 shadow-lg">
                <FileCode className="h-3 w-3 mr-1" />
                .ml
              </Badge>
            )}
            {specStatus.yamlExists && (
              <Badge variant="default" className="text-xs bg-purple-600 shadow-lg">
                <FileCode className="h-3 w-3 mr-1" />
                .yaml
              </Badge>
            )}
          </div>
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {workflow.title}
          </CardTitle>
          <Badge variant={accessTypeVariant} className="shrink-0">
            {accessTypeLabel}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{workflow.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>{workflow.triggerType}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {workflow.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {workflow.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{workflow.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Quantity (min 5):</span>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={handleDecrement}
                disabled={quantity <= 5}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 5)}
                className="w-16 h-7 text-center text-sm"
                min={5}
                max={100}
              />
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={handleIncrement}
                disabled={quantity >= 100}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Unit Price:</span>
            <span className="font-medium">{formatPrice(workflow.priceInCents)}</span>
          </div>
          <div className="flex items-center justify-between text-sm font-bold">
            <span>Total:</span>
            <span className="text-primary">{calculateTotal()}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selected}
            onCheckedChange={handleHeartClick}
            className="h-5 w-5"
          />
          <span className="text-xs text-muted-foreground">Select</span>
        </div>
        <Button
          size="sm"
          onClick={() => navigate({ to: '/workflow/$id', params: { id: workflow.id } })}
        >
          <Eye className="mr-2 h-4 w-4" />
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}
