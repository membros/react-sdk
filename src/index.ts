export { withAuthenticationRequired } from "./hocs/withAuthenticationRequired";
export { LoginButton } from "./components/LoginButton";
export { LogoutButton } from "./components/LogoutButton";

// Membros specific exports (previously legacy)
export { MembrosProvider, useAuth, signOut } from "./AuthContext";
export { useAuthButton, MembrosAuthButton } from "./AuthButton";
export { withAuth } from "./hocs/withAuth";
export { withAdminAuth } from "./hocs/withAdminAuth";

// Components
export { AuthScreen } from "./components/AuthScreen";
export { LoadingScreen } from "./components/LoadingScreen";
export { InadimplentScreen } from "./components/InadimplentScreen";

// Types
export type {
  User,
  AuthContextType,
  AuthButtonProps,
  AuthProviderProps,
  Subscription,
  LoginOptions,
  LogoutOptions,
  GetTokenOptions,
  WithAuthenticationRequiredOptions
} from "./types"; 