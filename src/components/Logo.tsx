import { BookOpenCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <BookOpenCheck style={{ color: 'hsl(var(--accent))' }} className="h-6 w-6" />
      <span className="text-xl font-bold font-headline text-foreground">StudyVerse</span>
    </Link>
  );
}
