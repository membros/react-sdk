import { AuthContextType, AuthProviderProps } from "./types";
export declare const useAuth: () => AuthContextType;
export declare const signOut: () => void;
export declare const MembrosProvider: ({ children, clientId, authorizationParams, membrosApiUrl, }: AuthProviderProps) => import("react/jsx-runtime").JSX.Element;
