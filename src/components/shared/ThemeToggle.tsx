import { Moon, Sun } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  showLabel?: boolean;
}

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useUIStore();

  const content = (
    <Button
      variant="ghost"
      size={showLabel ? 'default' : 'icon'}
      className={cn(
        'rounded-lg transition-colors outline-none shrink-0',
        showLabel ? 'w-full justify-start gap-3 px-3 h-10' : 'w-10 h-10 justify-center',
        'text-muted-foreground hover:bg-accent hover:text-foreground',
      )}
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      <div className="flex items-center shrink-0">
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </div>
      {showLabel && (
        <span className="text-sm font-medium">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
      )}
    </Button>
  );

  if (showLabel) return content;

  return (
    <Tooltip>
      <TooltipTrigger render={content} />
      <TooltipContent side="right">
        <p>Toggle theme</p>
      </TooltipContent>
    </Tooltip>
  );
}
