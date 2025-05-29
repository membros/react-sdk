import React from "react";
interface WithAdminAuthOptions {
    adminUserId: string;
    useToast?: any;
    LoadingComponent?: React.ComponentType;
    AuthComponent?: React.ComponentType;
    InadimplentComponent?: React.ComponentType;
    UnauthorizedComponent?: React.ComponentType;
}
export declare function withAdminAuth<P extends object>(Component: React.ComponentType<P>, options: WithAdminAuthOptions): (props: P) => import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=withAdminAuth.d.ts.map