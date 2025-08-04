import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAppState, AppStateSlice } from './AppStateContext';
import { useNotificationState, NotificationSlice } from './NotificationContext';

export interface ApiCredentials {
  apiKey: string;
  authorization: string;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Combine all context types into a single, unified context type
interface CombinedContextType extends AppStateSlice, NotificationSlice {
  api: ApiCredentials | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (apiData: ApiCredentials) => void;
  logout: () => void;
  fetchWithAuth: (url: string, method?: HttpMethod, body?: any) => Promise<Response>;
}

const ApiContext = createContext<CombinedContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [api, setApi] = useState<ApiCredentials | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Use the custom hooks to get state and actions
  const appState = useAppState();
  const notificationState = useNotificationState();

  const login = (apiData: ApiCredentials) => {
    setApi(apiData);
    setIsAuthenticated(true);
    setIsLoading(false);
    console.log(apiData)
  };

  const logout = () => {
    setApi(null);
    setIsAuthenticated(false);
  };

  const fetchWithAuth = useCallback(async (url: string, method: HttpMethod = 'GET', body: any = {}) => {
    if (!api) {
      throw new Error('API credentials are not set. Please login first.');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': api.authorization,
    };

    const requestBody = {
      ...body,
      apikey: api.apiKey,
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (method !== 'GET' && method !== 'DELETE') {
      config.body = JSON.stringify(requestBody);
    }

    return fetch(url, config);
  }, [api]);

  // Combine all state and actions into a single context value
  const contextValue: CombinedContextType = {
    ...appState,
    ...notificationState,
    api,
    isLoading,
    isAuthenticated,
    login,
    logout,
    fetchWithAuth,
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within a ApiProvider');
  }
  return context;
};