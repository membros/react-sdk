"use client";

import React from "react";
import { MembrosAuthButton } from "../AuthButton";

interface AuthScreenProps {
  useToast?: any;
  logoSrc?: string;
  title?: string;
  description?: string;
  className?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  useToast,
  logoSrc = "/logo.png",
  title = "Acesse agora",
  description = "Clique no botão abaixo para fazer login.",
  className = ""
}) => {
  return (
    <div className={`flex h-full w-full ${className}`}>
      <div className="flex flex-1 overflow-hidden w-full p-5 md:p-8 items-center justify-center">
        <div className="flex flex-col gap-4 bg-white p-8 rounded-xl w-full max-w-md md:max-w-lg">
          {logoSrc && (
            <img src={logoSrc} alt="Logo" className="w-24 h-24 object-contain" />
          )}
          <h1 className="font-bold text-blue-600 text-xl md:text-2xl">
            {title}
          </h1>
          <p className="text-gray-700">{description}</p>
          <MembrosAuthButton 
            useToast={useToast}
            onAuthSuccess={() => {}}
          />
        </div>
      </div>
    </div>
  );
}; 