"use client";

import React from "react";
import { useAuth } from "../AuthContext";

interface ProfileProps {
  className?: string;
}

export function Profile({ className }: ProfileProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={className}>
      {user.picture && (
        <img 
          src={user.picture} 
          alt={user.name} 
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
      )}
      <div>
        <h3>Hello {user.name}</h3>
        <p>{user.email}</p>
        {user.plano && <p>Plan: {user.plano}</p>}
      </div>
    </div>
  );
} 