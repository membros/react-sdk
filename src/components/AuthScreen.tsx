"use client";

import React from "react";
import { MembrosAuthButton } from "../AuthButton";
import { useAuth } from "../AuthContext";

interface AuthScreenProps {
  useToast?: any;
  logoSrc?: string;
  title?: string;
  description?: string;
  className?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  useToast,
  logoSrc,
  title = "Acesse agora",
  description = "Clique no botão abaixo para fazer login.",
  className = ""
}) => {
  const { project, isLoadingProject } = useAuth();

  // Use project logo if no logoSrc provided
  const displayLogo = logoSrc || project?.logo_url || "/logo.png";
  const displayTitle = title || project?.name || "Acesse agora";

  if (isLoadingProject) {
    return (
      <div className={`flex h-full w-full ${className}`}>
        <div className="flex flex-1 overflow-hidden w-full p-5 md:p-8 items-center justify-center">
          <div className="flex flex-col gap-4 bg-white p-8 rounded-xl w-full max-w-md md:max-w-lg">
            <div className="animate-pulse">
              <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-full w-full ${className}`}>
      <div className="flex flex-1 overflow-hidden w-full p-5 md:p-8 items-center justify-center">
        <div className="flex flex-col gap-6 bg-white p-8 rounded-xl w-full max-w-md md:max-w-lg">
          {displayLogo && (
            <img src={displayLogo} alt="Logo" className="w-24 h-24 object-contain" />
          )}
          <h1 className="font-bold text-blue-600 text-xl md:text-2xl">
            {displayTitle}
          </h1>
          <p className="text-gray-700">{description}</p>
          
          {/* Display available plans */}
          {project?.plan && project.plan.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Planos Disponíveis</h2>
              <div className="space-y-4">
                {project.plan.map((plan) => (
                  <div 
                    key={plan.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{plan.name}</h3>
                        {plan.description && (
                          <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        )}
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          {plan.interval && (
                            <span>
                              {plan.interval === 'month' ? 'Mensal' : 
                               plan.interval === 'year' ? 'Anual' : plan.interval}
                            </span>
                          )}
                          {plan.currency && (
                            <span className="ml-2">• {plan.currency.toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                      {plan.minimum_price && (
                        <div className="text-right">
                          <div className="text-lg font-semibold text-blue-600">
                            {Number(plan.minimum_price / 100).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: plan.currency || 'BRL'
                            })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {plan.interval === 'month' ? '/mês' : 
                             plan.interval === 'year' ? '/ano' : ''}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Faça login para escolher e assinar um plano
                </p>
              </div>
            </div>
          )}
          
          <MembrosAuthButton 
            useToast={useToast}
            onAuthSuccess={() => {}}
          />
        </div>
      </div>
    </div>
  );
}; 