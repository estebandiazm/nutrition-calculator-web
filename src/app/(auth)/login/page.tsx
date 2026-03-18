import styles from './login.module.css';
import { Alert } from '@/components/ui/Alert';
import { LoginForm } from './_LoginForm';

/** Translate raw error codes from the auth callback into user-friendly messages. */
function resolveErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    expired_link: 'Your magic link has expired or is invalid. Please request a new one.',
  };
  return errorMessages[error] ?? error;
}

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Brand header */}
        <div className={styles.brandHeader}>
          <div className={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className={styles.brandTitle}>NutriPlan</h1>
          <p className={styles.brandSubtitle}>Sign in to your account</p>
        </div>

        {/* Alerts */}
        {searchParams.error && (
          <div className={styles.alertWrap}>
            <Alert type="error" message={resolveErrorMessage(searchParams.error)} />
          </div>
        )}
        {searchParams.message && (
          <div className={styles.alertWrap}>
            <Alert type="success" message={searchParams.message} />
          </div>
        )}

        {/* Login form with tab switcher */}
        <LoginForm />

        {/* Footer */}
        <p className={styles.footer}>
          Don&apos;t have an account?{' '}
          <span className={styles.footerAccent}>Contact your nutritionist.</span>
        </p>
      </div>
    </div>
  );
}
