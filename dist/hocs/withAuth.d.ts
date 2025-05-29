import React from "react";
interface WithAuthOptions {
    useToast?: any;
    LoadingComponent?: React.ComponentType;
    AuthComponent?: React.ComponentType;
    InadimplentComponent?: React.ComponentType;
    requiredPlans?: string[];
}
export declare function withAuth<P extends object>(Component: React.ComponentType<P>, options?: WithAuthOptions): (props: P) => import("react/jsx-runtime").JSX.Element;
export {};
