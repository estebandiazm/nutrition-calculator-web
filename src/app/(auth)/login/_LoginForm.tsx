'use client';

import { useState } from 'react';
import styles from './login.module.css';
import { loginWithPassword, loginWithMagicLink } from './actions';

type Tab = 'password' | 'magic';

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
        <form className={styles.form}>
          <div>
            <label className={styles.fieldLabel} htmlFor="email-pw">Email</label>
            <input
              id="email-pw"
              name="email"
              type="email"
              placeholder="you@email.com"
              required
              autoComplete="email"
              className={styles.input}
            />
          </div>

          <div>
            <label className={styles.fieldLabel} htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className={styles.input}
            />
          </div>

          <button formAction={loginWithPassword} className={styles.btnPrimary}>
            Sign In
          </button>
        </form>
      ) : (
        <form className={styles.form}>
          <div>
            <label className={styles.fieldLabel} htmlFor="email-magic">Email</label>
            <input
              id="email-magic"
              name="email"
              type="email"
              placeholder="you@email.com"
              required
              autoComplete="email"
              className={styles.input}
            />
          </div>

          <p className={styles.hint}>
            We&apos;ll send a one-click login link to your inbox. No password needed.
          </p>

          <button formAction={loginWithMagicLink} className={styles.btnGhost}>
            Send Magic Link
          </button>
        </form>
      )}
    </>
  );
}
