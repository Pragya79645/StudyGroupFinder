import Image from 'next/image';
import Link from 'next/link';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Logo } from '@/components/Logo';

export default function SignupPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
       <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                 <Logo className="justify-center" />
                <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
                <p className="text-balance text-muted-foreground">
                    Enter your information to create an account
                </p>
            </div>
          <SignUpForm />
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline" style={{ color: 'hsl(var(--accent))' }}>
              Login
            </Link>
          </div>
        </div>
      </div>
       <div className="hidden bg-muted lg:block">
        <Image
          src="https://picsum.photos/1200/1001"
          alt="Diverse group of students smiling"
          data-ai-hint="diverse students"
          width="1200"
          height="1001"
          className="h-full w-full object-cover dark:brightness-[0.3]"
        />
      </div>
    </div>
  );
}
