import styles from './update-password.module.css';
import { updatePassword } from './actions';
import { createClient } from '@/infrastructure/adapters/supabase/server';
import { redirect } from 'next/navigation';
import { Alert } from '@/components/ui/Alert';

export default async function UpdatePasswordPage(props: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?error=Please log in to update your password');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.lockIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--auth-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className={styles.title}>Set your password</h1>
          <p className={styles.subtitle}>
            Choose a secure password to complete your account setup.
          </p>
        </div>

        {/* Alerts */}
        {searchParams.error && (
          <div className={styles.alertWrap}>
            <Alert type="error" message={searchParams.error} />
          </div>
        )}
        {searchParams.success && (
          <div className={styles.alertWrap}>
            <Alert type="success" message={searchParams.success} />
          </div>
        )}

        {/* Form */}
        <form className={styles.form}>
          <div>
            <label className={styles.fieldLabel} htmlFor="password">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              required
              minLength={6}
              autoComplete="new-password"
              className={styles.input}
            />
            <span className={styles.hint}>Use at least 6 characters</span>
          </div>

          <div>
            <label className={styles.fieldLabel} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              required
              minLength={6}
              autoComplete="new-password"
              className={styles.input}
            />
          </div>

          <button formAction={updatePassword} className={styles.btnPrimary}>
            Save Password
          </button>
        </form>

        <a href="/login" className={styles.backLink}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Login
        </a>
      </div>
    </div>
  );
}
