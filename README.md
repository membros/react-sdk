# membros-react-sdk

[![npm version](https://badge.fury.io/js/membros-react-sdk.svg)](https://badge.fury.io/js/membros-react-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**membros-react-sdk** is a React authentication library for the Membros platform, designed to help SaaS owners launch their products quickly. It provides robust authentication, subscription management, and plan-based access control.

Membros helps SaaS owners to launch their product and start generating revenue with private access to websites.

## Getting Started with Membros

To use this SDK, you'll need a Membros account and an application set up on the Membros platform.

1.  **Create an Account**: If you don't have one, sign up at [membros.app/register](https://membros.app/register).
2.  **Set up your Application**: Follow the Membros documentation to configure your application and obtain your `Client ID`.

## Features

- 🔐 **React-based Authentication** - Easy integration with React applications.
- 🔔 **Built-in Notifications** - User-friendly toast notifications for login status (powered by [Sonner](https://sonner.emilkowal.ski/)).
- 📱 **Multiple Login Methods** - Redirect and popup authentication flows.
- 🎯 **Plan-Based Access Control** - Restrict content based on user subscriptions.
    - Check for specific plans or any active plan (for freemium models).
- 🔄 **Automatic Token Management** - Handle token refresh and storage.
- 🛡️ **Secure Subscription Lookup** - User ID-based subscription verification.
- ⚡ **TypeScript Support** - Full type safety and IntelliSense.

## Plan Configuration

**Before using any authentication features**, make sure to configure your plan IDs properly when using `withAuthenticationRequired` or checking plans with `hasActivePlan`.

```tsx
// Example for withAuthenticationRequired HOC
const YOUR_REQUIRED_PLANS = [
  "your-premium-plan-id",
  "your-pro-plan-id",
];

export default withAuthenticationRequired(Component, {
  requiredPlans: YOUR_REQUIRED_PLANS
});
```

For detailed plan setup on the Membros platform, refer to your Membros dashboard and documentation.
See also [CONFIGURATION.md](./CONFIGURATION.md) for more SDK-specific configuration notes.

## Installation

Using npm:
```bash
npm install membros-react-sdk
```

Or using yarn:
```bash
yarn add membros-react-sdk
```

This library includes `sonner` for toast notifications, which will be installed as a dependency.

## Prerequisites

This library has peer dependencies on `react` and `react-dom`. Ensure these are installed in your project:

```json
"peerDependencies": {
  "react": ">=16.8.0",
  "react-dom": ">=16.8.0"
}
```

## Quick Start

Wrap your application with `MembrosProvider` and configure it with your Membros `Client ID`.
The `membrosApiUrl` defaults to `https://api.membros.app` but can be overridden if needed.

```tsx
// src/main.tsx or src/App.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MembrosProvider } from 'membros-react-sdk';

// Obtain this from your Membros application settings
const MEMBROS_CLIENT_ID = 'your-membros-client-id';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <MembrosProvider
      clientId={MEMBROS_CLIENT_ID}
      // The redirect_uri for login flows defaults to window.location.origin
      // You can override it via authorizationParams if necessary:
      // authorizationParams={{
      //   redirect_uri: 'http://localhost:3000/callback',
      // }}
      // membrosApiUrl="https://custom.api.membros.app" // Only if using a custom Membros API endpoint
    >
      <App />
    </MembrosProvider>
  </React.StrictMode>
);
```

### Using Authentication

**Accessing Authentication State:**

Use the `useAuth` hook to access authentication status and user information.

```tsx
// src/components/UserProfile.tsx
import React from 'react';
import { useAuth } from 'membros-react-sdk';

const UserProfile = () => {
  const { user, isAuthenticated, isLoading, error, hasActivePlan } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated && user) {
    const hasActivePlan = hasActivePlan(['pro-plan-id']);

    return (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>Freemium Access: Yes</p>
        <p>Pro Plan Access: {hasActivePlan ? 'Yes' : 'No'}</p>
        {/* Display other subscription details if available in user object */}
      </div>
    );
  }

  return <div>Please log in.</div>;
};

export default UserProfile;
```

**Login and Logout Buttons:**

Components like `LoginButton` and `LogoutButton` use the `useAuth` hook internally.

```tsx
// src/components/Navbar.tsx
import React from 'react';
import { useAuth, LoginButton, LogoutButton } from 'membros-react-sdk';

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      {!isAuthenticated && <LoginButton />}
      {isAuthenticated && <LogoutButton />}
    </nav>
  );
};

export default Navbar;
```

**Protected Routes:**

Use the `withAuthenticationRequired` HOC.

```tsx
// src/components/ProtectedRouteExample.tsx
import React from 'react';
import { withAuthenticationRequired, LoadingScreen } from 'membros-react-sdk';

const MyProtectedComponent = () => {
  return <div>This content is protected by a subscription to specific plans!</div>;
};

export default withAuthenticationRequired(MyProtectedComponent, {
  onRedirecting: () => <LoadingScreen />,
  requiredPlans: ['your-premium-plan-id'], // Example: requires 'premium-plan-id'
  // returnTo: '/profile'
});
```

## API Overview

### Core API

*   **`MembrosProvider`**: React context provider.
    *   Props: `children`, `clientId`, `authorizationParams` (optional, for `redirect_uri`, `audience`, `scope`), `membrosApiUrl` (optional, defaults to `https://api.membros.app`).
*   **`useAuth()`**: Hook for auth state and methods (`user`, `isAuthenticated`, `isLoading`, `error`, `loginWithRedirect`, `loginWithPopup`, `logout`, `getAccessTokenSilently`, `hasActivePlan`, `userSubscriptions`, etc.).
*   **`signOut()`**: Function to clear cookies and reload.
*   **`withAuthenticationRequired(Component, options)`**: HOC to protect components. Options include `requiredPlans`. 
*   **`hasActivePlan(planIds?: string[])`**: Method from `useAuth()`. 
    *   Call with an array of plan IDs (e.g., `hasActivePlan(['plan1', 'plan2'])`) to check if the user has an active subscription to *any* of the specified plans.
    *   Call with no arguments (e.g., `hasActivePlan()`) to check if the user has *any* active subscription (useful for freemium features).

### UI Components

(These components use `useAuth` internally)
*   `LoginButton`
*   `LogoutButton`
*   `Profile` (Example component)
*   `MembrosAuthButton` (Legacy - review if still needed or can be replaced by `LoginButton`)
*   `AuthScreen`
*   `LoadingScreen`
*   `InadimplentScreen`

### Helper HOCs

*   `withAuth(Component)` (Legacy - review for current use case)
*   `withAdminAuth(Component)` (Legacy - review for current use case)

### Types

Exported TypeScript types: `User`, `AuthContextType`, `AuthProviderProps`, `Subscription`, etc.

## Configuration

-   **Client ID**: Obtain your `clientId` from your application settings on the Membros platform.
-   **API URL**: Defaults to `https://api.membros.app`. Can be overridden via the `membrosApiUrl` prop on `MembrosProvider` if you have a custom endpoint.
-   **Redirect URI**: For login flows, the default redirect URI is `window.location.origin`. If you need a different URI, configure it in `MembrosProvider` via `authorizationParams={{ redirect_uri: 'YOUR_CALLBACK_URL' }}` and ensure this URL is whitelisted in your Membros application settings.

See `CONFIGURATION.md` for more details.

## Development

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Build the library: `npm run build`

The output is in `dist/`.

## Contributing

Contributions welcome! Please open an issue or PR.

1.  Fork repo.
2.  Create feature branch.
3.  Commit changes.
4.  Push to branch.
5.  Open PR.

## License

MIT License.

---

*This README was generated with the assistance of an AI programming partner.* 
