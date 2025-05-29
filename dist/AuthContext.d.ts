import { AuthContextType, AuthProviderProps } from "./types";
export declare const useAuth: () => AuthContextType;
export declare const signOut: () => void;
export declare const MembrosProvider: ({ children, domain, clientId, authorizationParams, membrosApiUrl, useToast, }: AuthProviderProps) => import("react/jsx-runtime").JSX.Element;
