import React, { useState, useEffect, ReactNode } from 'react';
import Database from '@tauri-apps/plugin-sql';
import { DBContext } from './context';
import { Ngdu, Workshop, Well, Measurement, DBInfo } from './types';

interface DBProviderProps {
  children: ReactNode;
}

export const DBProvider: React.FC<DBProviderProps> = ({ children }) => {
  const [db, setDb] = useState<Database | null>(null);
  const [isDBLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    async function loadDB() {
      try {
        setIsLoading(true);
        const database = await Database.load('sqlite:ciam.db');
        setDb(database);        
        setError(null);
      } catch (err) {
        console.error('Database initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load database');
      } finally {
        setIsLoading(false);
      }
    }    
    loadDB();
  }, []);

  const selectQuery = async <T,>(query: string, params: any[] = []): Promise<T[]> => {
    if (!db) {
      console.warn('Database not initialized yet');
      return [];
    }
    
    try {
      // Fix: Cast or transform the result to ensure it's T[]
      const result = await db.select<T>(query, params);
      
      // The result might be in a different format than we expect
      // Check if it has a 'rows' property or similar
      if (Array.isArray(result)) {
        return result;
      } else if (result && typeof result === 'object' && 'rows' in result) {
        // Some database libraries return { rows: T[] }
        return (result as unknown as { rows: T[] }).rows;
      } else {
        // If it's a single item, wrap in array
        return [result as unknown as T];
      }
    } catch (err) {
      console.error('Query error:', err);
      setError(err instanceof Error ? err.message : 'Query failed');
      return [];
    }
  };

  const executeQuery = async (query: string, params: any[] = []) => {
    if (!db) {
      console.warn('Database not initialized yet');
      return null;
    }
    
    try {
      return await db.execute(query, params);
    } catch (err) {
      console.error('Execute error:', err);
      setError(err instanceof Error ? err.message : 'Execute query failed');
      return null;
    }
  };

  const fetchNgdus = async (): Promise<Ngdu[]> => {
    if (!db) return [];
    
    try {
      const result = await db.select<Ngdu>('SELECT * FROM ngdu', []);      
      return [result];
    } catch (err) {
      console.error('Failed to fetch NGDUs:', err);
      return [];
    }
  };

  const fetchWorkshops = async (): Promise<Workshop[]> => {
    if (!db) return [];
    
    try {
        const result = await db.select<Workshop>('SELECT * FROM workshop', []);
        return [result];
    } catch (err) {
      console.error('Failed to fetch workshops:', err);
      return [];
    }
  };

  const fetchWells = async (): Promise<Well[]> => {
    if (!db) return [];
    
    try {
        const result = await db.select<Well>('SELECT * FROM well', []);
        return [result];
    } catch (err) {
      console.error('Failed to fetch wells:', err);
      return [];
    }
  };

  const fetchMeasurements = async (): Promise<Measurement[]> => {
    if (!db) return [];
    
    try {
        const result = await db.select<Measurement>('SELECT * FROM measurements', []);
      return [result];
    } catch (err) {
      console.error('Failed to fetch measurements:', err);
      return [];
    }
  };
  
  //const fetchDBInfo = async (): Promise<DBInfo> => {
  //  if (!db) return {
  //    ngduNum: 0,
  //    workshopNum: 0,
  //    wellNum: 0,
  //    measurementNum: 0,
  //  };
  //  
  //  try {
  //      const result = await db.select<Measurement>('SELECT * FROM measurements', []);
  //    return [result];
  //  } catch (err) {
  //    console.error('Failed to fetch measurements:', err);
  //    return [];
  //  }
  //};

  const clearDB = async () => {
    try {
      // Execute each statement separately for better error handling
      await executeQuery('DELETE FROM measurements', []);
      await executeQuery('DELETE FROM well', []);
      await executeQuery('DELETE FROM workshop', []);
      await executeQuery('DELETE FROM ngdu', []);
    } catch (err) {
      console.error('Clear DB error:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear database');
    }
  };

  return (
    <DBContext.Provider
      value={{
        db,
        isDBLoading,
        error,
        selectQuery,
        executeQuery,
        clearDB,
        fetchNgdus,
        fetchWorkshops,
        fetchWells,
        fetchMeasurements
      }}
    >
      {children}
    </DBContext.Provider>
  );
};