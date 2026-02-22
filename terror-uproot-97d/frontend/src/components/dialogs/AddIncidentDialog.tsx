import { useState } from 'react';
import { useAddIncident } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface AddIncidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddIncidentDialog({ open, onOpenChange }: AddIncidentDialogProps) {
  const [location, setLocation] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [severity, setSeverity] = useState('5');
  const [status, setStatus] = useState('Active');
  const [description, setDescription] = useState('');
  
  const addIncident = useAddIncident();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location.trim() || !incidentType.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addIncident.mutateAsync({
        id: `INC-${Date.now()}`,
        location: location.trim(),
        incidentType: incidentType.trim(),
        severity: BigInt(severity),
        status,
        timestamp: BigInt(Date.now() * 1000000),
        description: description.trim(),
      });
      
      toast.success('Incident added successfully');
      onOpenChange(false);
      
      // Reset form
      setLocation('');
      setIncidentType('');
      setSeverity('5');
      setStatus('Active');
      setDescription('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add incident');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Incident</DialogTitle>
          <DialogDescription>
            Report a new security incident or emergency situation
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., New York, NY"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incidentType">Incident Type *</Label>
              <Input
                id="incidentType"
                placeholder="e.g., Natural Disaster"
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity (1-10) *</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} - {num <= 3 ? 'Low' : num <= 6 ? 'Medium' : 'High'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Monitoring">Monitoring</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about the incident..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addIncident.isPending}>
              {addIncident.isPending ? 'Adding...' : 'Add Incident'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

