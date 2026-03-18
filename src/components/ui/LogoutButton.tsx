'use client';

import React, { useTransition } from 'react';
import { logout } from '@/app/actions/authActions';

/**
 * A styled logout button that calls the server-side logout action.
 * Uses useTransition to show a loading state during the sign-out redirect.
 */
export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      aria-label="Sign out"
      style={{
        background: 'none',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '50px',
        color: isPending ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)',
        cursor: isPending ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        fontSize: '0.875rem',
        fontWeight: 600,
        padding: '6px 16px',
        transition: 'color 0.2s ease, border-color 0.2s ease, background 0.2s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!isPending) {
          const target = e.currentTarget;
          target.style.color = 'rgba(255,255,255,0.9)';
          target.style.borderColor = 'rgba(255,255,255,0.35)';
          target.style.background = 'rgba(255,255,255,0.06)';
        }
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        target.style.color = 'rgba(255,255,255,0.6)';
        target.style.borderColor = 'rgba(255,255,255,0.15)';
        target.style.background = 'none';
      }}
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
