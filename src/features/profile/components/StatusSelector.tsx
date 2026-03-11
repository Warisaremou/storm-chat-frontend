import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { UserStatus } from '@/types';

interface StatusSelectorProps {
  value: UserStatus;
  onChange: (status: UserStatus) => void;
  disabled?: boolean;
}

const statuses: { value: UserStatus; label: string }[] = [
  { value: 'online', label: 'Online' },
  { value: 'away', label: 'Away' },
  { value: 'busy', label: 'Busy' },
  { value: 'offline', label: 'Offline' },
];

export function StatusSelector({ value, onChange, disabled }: StatusSelectorProps) {
  const currentStatus = statuses.find((s) => s.value === value) || statuses[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        render={(props) => (
          <Button
            variant="outline"
            className="w-full justify-between gap-2 px-3 h-10 border-border bg-card"
            {...props}
          >
            <div className="flex items-center gap-2">
              <StatusBadge status={value} size="md" />
              <span className="text-sm font-medium">{currentStatus.label}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
          </Button>
        )}
      />
      <DropdownMenuContent align="end" className="w-[180px]">
        {statuses.map((s) => (
          <DropdownMenuItem
            key={s.value}
            onClick={() => onChange(s.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <StatusBadge status={s.value} size="md" />
              <span>{s.label}</span>
            </div>
            {value === s.value && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
