import React from "react";
import { LoginOptions } from "../types";
interface LoginButtonProps {
    children?: React.ReactNode;
    className?: string;
    options?: LoginOptions;
    mode?: "redirect" | "popup";
}
export declare function LoginButton({ children, className, options, mode }: LoginButtonProps): import("react/jsx-runtime").JSX.Element | null;
export {};
