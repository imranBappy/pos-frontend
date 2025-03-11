'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (error) {
            toast({
                variant: 'destructive',
                title: 'Authentication Error',
                description: error,
            });
        }
    }, [error, toast]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
            <p className="text-gray-500">{error || 'Something went wrong.'}</p>
            <Button
                onClick={() => router.push('/auth/signin')}
                className="mt-4"
            >
                Go back to Login
            </Button>
        </div>
    );
}
