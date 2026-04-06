import { useState, useCallback, useEffect } from 'react';
import { usersService } from '@/services/users.service';
import type { UserPreview } from '@/types';

export function useUserSearch() {
  const [results, setResults] = useState<UserPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await usersService.searchUsers(q);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void search(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  return {
    query,
    setQuery,
    results,
    isLoading,
  };
}
