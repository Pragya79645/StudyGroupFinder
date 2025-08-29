import Image from 'next/image';
import Link from 'next/link';
import GoogleAuth from '@/components/auth/GoogleAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                 <Logo className="justify-center" />
                <h1 className="text-3xl font-bold font-headline">Welcome Back</h1>
                <p className="text-balance text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
          import GoogleAuth from '@/components/auth/GoogleAuth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <GoogleAuth />
      </div>
    </div>
  );
}
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline" style={{ color: 'hsl(var(--accent))' }}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://picsum.photos/1200/1000"
          alt="Students studying on laptops"
          data-ai-hint="students laptops"
          width="1200"
          height="1000"
          className="h-full w-full object-cover dark:brightness-[0.3]"
        />
      </div>
    </div>
  );
}
