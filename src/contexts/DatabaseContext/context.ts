import { createContext, useContext } from 'react';
import { DBContextValue } from './types';

export const DBContext = createContext<DBContextValue | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DBContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DBProvider');
  }
  return context;
};