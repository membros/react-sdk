export interface User {
    id: string;
    name: string;
    email: string;
    plano: "rzero" | "vestibulando";
    picture?: string;
    email_verified?: boolean;
    sub?: string;
    nickname?: string;
    updated_at?: string;
}
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isLoggingOut?: boolean;
    error: Error | null;
    loginWithRedirect: (options?: LoginOptions) => Promise<void>;
    loginWithPopup: (options?: LoginOptions) => Promise<void>;
    logout: (options?: LogoutOptions) => void;
    getAccessTokenSilently: (options?: GetTokenOptions) => Promise<string>;
    originalUser: User | null;
    token: string | null;
    login: (authorizationCode: string) => Promise<void>;
    loadUserByToken: (accessToken: string) => Promise<void>;
    adimplent: boolean;
    overwriteUser: (newUser: User) => void;
    revertToOriginalUser: () => void;
    publicKey: string;
    hasActivePlan: (planIds: string[]) => boolean;
    userSubscriptions: Subscription[];
}
export interface LoginOptions {
    authorizationParams?: {
        redirect_uri?: string;
        audience?: string;
        scope?: string;
    };
    redirectUri?: string;
    audience?: string;
    scope?: string;
}
export interface LogoutOptions {
    logoutParams?: {
        returnTo?: string;
    };
    returnTo?: string;
}
export interface GetTokenOptions {
    authorizationParams?: {
        audience?: string;
        scope?: string;
    };
    audience?: string;
    scope?: string;
}
export interface AuthProviderProps {
    children: React.ReactNode;
    clientId: string;
    authorizationParams?: {
        redirect_uri?: string;
        audience?: string;
        scope?: string;
    };
}
export interface AuthButtonProps {
    apiKey: string;
    onAuthSuccess?: (accessToken: string) => void;
    className?: string;
    children?: React.ReactNode;
    redirectMode?: "popup" | "redirect";
}
export interface Subscription {
    id: string;
    status: string;
    start_at: string;
    user_id?: string;
    plan: {
        id: string | number;
    };
    current_cycle?: {
        id: string;
        start_at: string;
        end_at: string;
        billing_at: string;
        status: string;
        cycle: number;
    };
}
export interface WithAuthenticationRequiredOptions {
    onRedirecting?: () => React.ReactElement;
    returnTo?: string;
    requiredPlans?: string[];
    LoadingComponent?: React.ComponentType;
    AuthComponent?: React.ComponentType;
    InadimplentComponent?: React.ComponentType;
}
//# sourceMappingURL=types.d.ts.map