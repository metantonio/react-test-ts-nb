import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'developer' | 'guest';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // This is a basic example. You would typically fetch permissions from a backend
    // or have a more sophisticated mapping based on roles.
    const permissions = {
      admin: ['view_all', 'add_edit_delete_users', 'add_edit_records', 'delete_records', 'edit_profile'],
      developer: ['view_all', 'add_edit_records', 'delete_records', 'edit_profile'],
      guest: ['view_all', 'add_edit_records', 'edit_profile']
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  return (
    <UserContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};