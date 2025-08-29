'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.94 11.04c0-.82-.07-1.59-.2-2.34H12v4.51h5.02c-.21.82-.67 1.54-1.34 2.11v2.82h3.63c2.12-1.95 3.35-4.88 3.35-8.1z"/>
            <path d="M12 21c2.62 0 4.88-.87 6.5-2.35l-3.63-2.82c-.87.58-1.98.93-3.12.93-2.38 0-4.4-1.59-5.12-3.71H3.18v2.9C4.98 18.98 8.27 21 12 21z"/>
            <path d="M6.88 13.71c-.2-.58-.31-1.2-.31-1.84s.11-1.26.31-1.84V7.15H3.18C2.43 8.63 2 10.26 2 12s.43 3.37 1.18 4.85l3.7-2.99z"/>
        </svg>
    )
}


export function LoginForm() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <Button onClick={handleGoogleLogin} className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : (
            <>
                <GoogleIcon />
                <span>Sign in with Google</span>
            </>
        )}
      </Button>
  );
}
