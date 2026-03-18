import React from 'react';
import styles from './Alert.module.css';

type AlertProps = {
  type?: 'error' | 'success' | 'info';
  message: string;
};

export function Alert({ type = 'error', message }: AlertProps) {
  if (!message) return null;

  const typeClass = {
    error: styles.error,
    success: styles.success,
    info: styles.info,
  }[type];

  return (
    <div className={`${styles.alert} ${typeClass}`}>
      {message}
    </div>
  );
}
