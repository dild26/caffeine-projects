import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile, useGetCallerUserRole } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { UserRole } from '../backend';

export function ProfileSetup() {
    const [name, setName] = useState('');
    const saveProfile = useSaveCallerUserProfile();
    const { data: userRole } = useGetCallerUserRole();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            // Use the role from the backend (which is set during initialization)
            // The first user is automatically assigned admin role by useActor.ts
            const role = userRole || UserRole.user;
            
            saveProfile.mutate(
                { name: name.trim(), role },
                {
                    onSuccess: () => {
                        toast.success('Profile created successfully');
                    },
                    onError: () => {
                        toast.error('Failed to create profile');
                    },
                }
            );
        }
    };

    return (
        <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome to InfiTask</CardTitle>
                    <CardDescription>
                        Please enter your name to get started with project management.
                        {userRole === UserRole.admin && (
                            <span className="block mt-2 text-primary font-medium">
                                You are the first user and will be assigned the Admin role.
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={saveProfile.isPending || !name.trim()}>
                            {saveProfile.isPending ? 'Creating Profile...' : 'Continue'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
