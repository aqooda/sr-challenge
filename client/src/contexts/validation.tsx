import React, { createContext, useCallback, useMemo, useState } from 'react';
import type { EmailValidationResult, PhoneValidationResult } from '@/types/api';

interface Result {
  key: string;
  type: 'phone' | 'email';
  value: string;
  result: EmailValidationResult | PhoneValidationResult;
}

interface ValidationContextType {
  results: Result[];
  addResult: (result: Result) => void;
}

export const ValidationContext = createContext<ValidationContextType>({
  results: [],
  addResult: () => undefined,
});

export const ValidationContextProvider: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => {
  const [results, setResults] = useState<Result[]>([]);
  const addResult = useCallback<ValidationContextType['addResult']>(
    (result) => setResults((prevResults) => [...prevResults, result]),
    [],
  );
  const value = useMemo(() => ({ results, addResult }), [results]);

  return <ValidationContext.Provider value={value}>{children}</ValidationContext.Provider>;
};
