import React from "react";
import { AuthButtonProps } from "./types";
export declare const useAuthButton: (onAuthSuccess?: (accessToken: string) => void, redirectMode?: "popup" | "redirect") => {
    handleLogin: (useToast?: any) => void;
    fetchToken: (authorizationCode: string, useToast?: any) => Promise<void>;
};
export declare const MembrosAuthButton: React.FC<Omit<AuthButtonProps, 'apiKey'> & {
    useToast?: any;
}>;
