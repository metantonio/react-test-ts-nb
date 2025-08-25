import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from './AuthService';
import { AuthUser, FetchUserAttributesOutput, AuthSession } from 'aws-amplify/auth';

export type UserRole = 'admin' | 'developer' | 'guest';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  cognitoId?: string;
  userAttributes?: Record<string, string>;
  name: string;
  given_name: string;
  family_name: string;
  custom?: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (cognitoUser: AuthUser, token: string, userAttributes: FetchUserAttributesOutput) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  refreshToken: () => Promise<string | null>;
  validateToken: () => Promise<boolean>;
}



const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data
const mockUsers: { [key in UserRole]: User } = {
  admin: {
    id: '1',
    username: 'Admin User',
    email: 'admin@casinovizion.com',
    role: 'admin',
    name: 'Admin',
    given_name: 'Admin',
    family_name: 'User'
  },
  developer: {
    id: '2',
    username: 'Dev User',
    email: 'developer@casinovizion.com',
    role: 'developer',
    name: 'Dev',
    given_name: 'Dev',
    family_name: 'User'
  },
  guest: {
    id: '3',
    username: 'Guest User',
    email: 'guest@casinovizion.com',
    role: 'guest',
    name: 'Guest',
    given_name: 'Guest',
    family_name: 'User'
  }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUsers.guest); //change this from mockUsers.admin to null later
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const mapCognitoUserToAppUser = (cognitoUser: AuthUser, userAttributes: FetchUserAttributesOutput, session: AuthSession | null = null): User => {
    // Map cognito data to the user structure
    const id_token_payload = session?.tokens?.idToken?.payload;
    const access_token_payload = session?.tokens?.accessToken?.payload;
    const groups = access_token_payload?.['cognito:groups'];
    const group = Array.isArray(groups) && groups.length > 0 ? groups[0] : null;
    //console.log("user group:", group)
    //console.log("idToken payload received: ", session?.tokens?.idToken?.payload);
    //console.log("AccessToken payload received", session);
    const tempObj: User = {
      id: cognitoUser.username,
      username: cognitoUser.username,
      email: cognitoUser.signInDetails?.loginId || '',
      role: (group as UserRole) || 'admin',
      cognitoId: cognitoUser.userId,
      name: userAttributes.given_name || "",
      given_name: userAttributes.given_name || "",
      family_name: userAttributes.family_name || "",
      custom: id_token_payload?.["custom:string"]?.toString() || " "
    }

    console.log("cognitoUser returned: ", tempObj)

    return tempObj
  };

  const loadUser = async () => {
    setIsLoading(true);
    console.log("load user");
    try {
      const currentUserData = await authService.getCurrentUser();
      if (!currentUserData) {
        throw new Error("User not found");
      }

      const { cognitoUser, userAttributes } = currentUserData;
      const session = await authService.getSession();

      if (cognitoUser && session?.tokens?.idToken && session?.tokens?.accessToken) {
        const appUser = mapCognitoUserToAppUser(cognitoUser, userAttributes, session);

        setUser(appUser);

        // Guarda el JWT completo como string (útil para enviar a APIs)
        setToken(session.tokens.idToken.toString());

        setIsAuthenticated(true);

        console.log("idToken payload:", session.tokens.idToken.payload);
        console.log("accessToken payload:", session.tokens.accessToken.payload);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };


  const login = async (cognitoUser: AuthUser, authToken: string, userAttributes: FetchUserAttributesOutput) => {

    const appUser = mapCognitoUserToAppUser(cognitoUser, userAttributes);
    //console.log(appUser)
    setUser(appUser);
    setToken(authToken);
    setIsAuthenticated(true);
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.signOut();
      setUser(mockUsers.guest);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const permissions = {
      admin: ['view_all', 'add_edit_delete_users', 'add_edit_records', 'delete_records', 'edit_profile'],
      developer: ['view_all', 'add_edit_records', 'delete_records', 'edit_profile'],
      guest: ['view_all', 'add_edit_records', 'edit_profile']
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const refreshToken = async (): Promise<string | null> => {
    const newToken = await authService.refreshSession();
    if (newToken) {
      setToken(newToken);
    }
    return newToken;
  };

  const validateToken = async (): Promise<boolean> => {
    try {
      const session = await authService.getSession();
      if (!session?.tokens?.idToken?.payload.exp) return false;

      const currentTime = Math.floor(Date.now() / 1000);
      return session.tokens.idToken.payload.exp > currentTime;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated,
      login,
      logout,
      updateUser,
      hasPermission,
      refreshToken,
      validateToken
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