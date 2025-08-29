import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 text-white', className)}>
      <div className="neo-border bg-white p-2">
        <BrainCircuit className="h-8 w-8 text-black" />
      </div>
      <span className="text-3xl font-black text-white uppercase tracking-wide neo-text-shadow">STUDYLINK</span>
    </div>
  );
}
