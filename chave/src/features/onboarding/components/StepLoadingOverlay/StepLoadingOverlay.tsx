import styles from './StepLoadingOverlay.module.css'

interface StepLoadingOverlayProps {
  message: string
}

export function StepLoadingOverlay({ message }: StepLoadingOverlayProps) {
  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-busy="true">
      <div className={styles.card}>
        <span className={styles.spinner} aria-hidden="true" />
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  )
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
