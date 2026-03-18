import React from 'react';

/**
 * Auth layout wrapper. Used by /update-password.
 * The /login page owns its own layout directly (login.module.css)
 * so it does not depend on this wrapper.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'var(--auth-bg)',
      color: 'var(--auth-text-primary)',
      fontFamily: "'Manrope', 'Inter', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'var(--auth-surface)',
        border: '1px solid var(--auth-border)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {children}
      </div>
    </div>
  );
}
