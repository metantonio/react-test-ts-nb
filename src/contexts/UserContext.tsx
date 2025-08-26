import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { authService } from './AuthService';
import { AuthUser, FetchUserAttributesOutput, AuthSession } from 'aws-amplify/auth';

export type UserRole = 'admin' | 'developer' | 'guest';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

interface League {
  league_name: string;
}

interface LeagueResponse {
  data: League[];
}

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
  authorizationNBA?: string; 
}

interface UserContextType {
  user: User | null;
  token: string | null;
  nbaToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (cognitoUser: AuthUser, token: string, userAttributes: FetchUserAttributesOutput, session: AuthSession) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  refreshToken: () => Promise<string | null>;
  validateToken: () => Promise<boolean>;
  fetchWithAuth: (url: string, method?: HttpMethod, body?: any) => Promise<Response>;
  leagues: League | null;
  setLeague: (value: League | null) => void;
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

const mapCognitoUserToAppUser = async (cognitoUser: AuthUser, userAttributes: FetchUserAttributesOutput, session: AuthSession | null = null): Promise<User> => {
  // Map cognito data to the user structure
  const id_token_payload = session?.tokens?.idToken?.payload;
  const access_token_payload = session?.tokens?.accessToken?.payload;
  const groups = access_token_payload?.['cognito:groups'];
  const group = Array.isArray(groups) && groups.length > 0 ? groups[0] : null;
  //console.log("user group:", group)
  console.log("idToken payload received: ", session?.tokens?.idToken?.payload);
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
    custom: id_token_payload?.["custom:string"]?.toString() || " ",
    authorizationNBA: id_token_payload?.["authorizationNBA"]?.toString() || " ",
  }

  //console.log("cognitoUser returned: ", tempObj)

  return tempObj
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [nbaToken, setNbaToken] = useState<string | null>(null);
  const [leagues, setLeagues] = useState<League | null>(null);

  const setLeague = useCallback((value: League | null) => {
      // Remove the notification with the matching ID
      setLeagues(value);
    }, []);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    console.log("load user");
    try {
      const currentUserData = await authService.getCurrentUser();
      if (!currentUserData) {
        throw new Error("User not found");
      }

      const { cognitoUser, userAttributes } = currentUserData;
      let session = await authService.getSession();

      if(session?.tokens?.idToken?.payload?.["custom:string"] && session?.tokens?.idToken?.payload?.["custom:string"]?.toString() != ""){
        session = await authService.getSession();
        
      }

      if (cognitoUser && session?.tokens?.idToken && session?.tokens?.accessToken) {
        const appUser = await mapCognitoUserToAppUser(cognitoUser, userAttributes, session);

        setUser(appUser);

        // Guarda el JWT completo como string (útil para enviar a APIs)
        const newNbaToken = session.tokens.idToken.payload["custom:string"]?.toString() || null;
        setToken(session.tokens.idToken.toString());
        setNbaToken(newNbaToken);
        setIsAuthenticated(true);

        console.log("idToken payload: ", session.tokens.idToken.payload);
        //console.log("accessToken payload:", session.tokens.accessToken.payload);
        console.log("nba token: ", newNbaToken);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const login = useCallback(async (cognitoUser: AuthUser, authToken: string, userAttributes: FetchUserAttributesOutput, session:AuthSession) => {

    const appUser = await mapCognitoUserToAppUser(cognitoUser, userAttributes, session);
    //console.log(appUser)
    setUser(appUser);
    setToken(authToken);
    setNbaToken(appUser.custom || null);
    setIsAuthenticated(true);
    console.log("nba token: ",appUser.custom || null)
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      console.log("logout: ",user)
      await authService.signOut();
      setUser(mockUsers.guest);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

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
      guest: ['view_all']
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

  const fetchWithAuth = useCallback(async (url: string, method: HttpMethod = 'GET', body: any = {}) => {
      if (!token) {
        throw new Error('API credentials are not set. Please login first.');
      }
  
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': token || "",
      };

      let tempBody = {...body}
      tempBody["body"]["authorization"] = nbaToken
      const requestBody = {
        ...body,
        authorization: nbaToken,
      };
  
      const config: RequestInit = {
        method,
        headers,
      };
  
      if (method !== 'GET' && method !== 'DELETE') {
        config.body = JSON.stringify(tempBody);
      }
  
      return fetch(url, config);
    }, [nbaToken]);

  useEffect(()=>{authService.signOut()},[])

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <UserContext.Provider value={{
      user,
      token,
      nbaToken,
      isLoading,
      isAuthenticated,
      login,
      logout,
      updateUser,
      hasPermission,
      refreshToken,
      validateToken,
      fetchWithAuth,
      leagues,
      setLeague
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
