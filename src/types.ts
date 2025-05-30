export interface User {
  id: string;
  name: string;
  avatar: string | null;
  document: string;
  document_type: string;
  phone_country_code: string;
  phone_area_code: string;
  phone_number: string;
  txPercentage: number;
  recipient_id: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
  hasActivePlan: (planIds: string[]) => boolean;
  getCurrentSubscriptionForPlans: (planIds?: string[]) => Subscription | null;
  userSubscriptions: Subscription[];
  currentSubscription: Subscription | null;
  project: Project | null;
  isLoadingProject: boolean;
  projectError: Error | null;
  loadProject: () => Promise<void>;
  projectPlans: string[];
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
  projectId: string;
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

export interface CurrentCycle {
  id?: string;
  cycle: number;
  end_at: string;
  status: string;
  start_at: string;
  charge_id: string;
  billing_at: string;
}

export interface PricingScheme {
  price: number;
  scheme_type: string;
}

export interface SubscriptionItem {
  name: string;
  status: string;
  pricing_scheme: PricingScheme;
}

export interface Plan {
  id: string;
  name: string;
  logo_url?: string | null;
  embedded_file_url?: string | null;
  embedded_file_name?: string | null;
  description?: string;
  status?: string;
  billing_type?: string;
  pagarme_plan_id?: string;
  statement_descriptor?: string;
  interval?: string;
  interval_count?: number;
  trial_period_days?: number;
  shippable?: boolean;
  currency?: string;
  payment_methods?: string[];
  minimum_price?: number | null;
  installments?: number[];
  metadata?: any | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Card {
  // Define card properties as needed
  [key: string]: any;
}

export interface Split {
  // Define split properties as needed
  [key: string]: any;
}

export interface DiscountInfo {
  // Define discount info properties as needed
  [key: string]: any;
}

export interface Cycle {
  // Define cycle properties as needed
  [key: string]: any;
}

export interface Invoice {
  // Define invoice properties as needed
  [key: string]: any;
}

export interface Subscription {
  id: string;
  pagarme_subscription_id?: string | null;
  pagarme_plan_id?: string | null;
  code?: string | null;
  start_at: string;
  interval?: string;
  interval_count?: number;
  billing_type?: string;
  next_billing_at?: string;
  payment_method?: string;
  currency?: string;
  statement_descriptor?: string | null;
  installments?: number;
  status: string;
  created_at?: string;
  updated_at?: string;
  canceled_at?: string | null;
  current_cycle?: CurrentCycle;
  card?: Card | null;
  split?: Split | null;
  discount_info?: DiscountInfo | null;
  items?: SubscriptionItem[];
  cycles?: Cycle[];
  plan: Plan;
  invoices?: Invoice[];
  user_id?: string;
}

export interface WithAuthenticationRequiredOptions {
  onRedirecting?: () => React.ReactElement;
  returnTo?: string;
  requiredPlans?: string[];
  LoadingComponent?: React.ComponentType;
  AuthComponent?: React.ComponentType;
  InadimplentComponent?: React.ComponentType;
}

export interface ProjectCreator {
  id: string;
  name: string;
  avatar: string | null;
  document: string;
  document_type: string;
  phone_country_code: string;
  phone_area_code: string;
  phone_number: string;
  txPercentage: number;
  recipient_id: string;
  email: string;
  password: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
  creator: ProjectCreator;
  plan: Plan[];
} 