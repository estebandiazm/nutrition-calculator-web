'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import styles from './login.module.css';
import { loginWithPassword, loginWithMagicLink } from './actions';

type Tab = 'password' | 'magic';

function PasswordSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`${styles.btnPrimary} ${pending ? styles.btnLoader : ''}`}
      disabled={pending}
    >
      <span>{pending ? 'Signing in...' : 'Sign In'}</span>
      {!pending && (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      )}
    </button>
  );
}

function MagicLinkSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`${styles.btnGhost} ${pending ? styles.btnLoader : ''}`}
      disabled={pending}
    >
      {pending ? 'Sending link...' : 'Send Magic Link'}
    </button>
  );
}

export function LoginForm() {
  const [tab, setTab] = useState<Tab>('password');

  return (
    <>
      <div className={styles.tabs}>
        <button
          type="button"
          onClick={() => setTab('password')}
          className={`${styles.tab} ${tab === 'password' ? styles.tabActive : ''}`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setTab('magic')}
          className={`${styles.tab} ${tab === 'magic' ? styles.tabActive : ''}`}
        >
          Magic Link
        </button>
      </div>

      {tab === 'password' ? (
        <form className={styles.form} action={loginWithPassword}>
          <div>
            <label className={styles.fieldLabel} htmlFor="email-pw">Email Address</label>
            <input
              id="email-pw"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
              className={styles.input}
            />
          </div>

          <div>
            <div className={styles.labelWrap}>
              <label className={styles.fieldLabel} htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
              <a href="#" className={styles.forgotLink}>Forgot password?</a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className={styles.input}
              style={{ marginTop: '0.5rem' }}
            />
          </div>

          <PasswordSubmitButton />
        </form>
      ) : (
        <form className={styles.form} action={loginWithMagicLink}>
          <div>
            <label className={styles.fieldLabel} htmlFor="email-magic">Email Address</label>
            <input
              id="email-magic"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
              className={styles.input}
            />
          </div>

          <p className={styles.hint}>
            We&apos;ll send a one-click login link to your inbox. No password needed.
          </p>

          <MagicLinkSubmitButton />
        </form>
      )}
    </>
  );
}
