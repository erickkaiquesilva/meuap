import { scorePassword } from '../../utils/passwordStrength'
import styles from './PasswordStrengthMeter.module.css'

interface PasswordStrengthMeterProps {
  password: string
  id?: string
}

const LEVEL_CLASS: Record<string, string> = {
  weak: styles.weak,
  medium: styles.medium,
  strong: styles.strong,
  best: styles.best,
}

export function PasswordStrengthMeter({ password, id }: PasswordStrengthMeterProps) {
  const strength = scorePassword(password)
  const filled = password ? Math.max(strength.score, 1) : 0
  const barClass = LEVEL_CLASS[strength.level] ?? ''

  return (
    <div id={id} className={styles.wrap}>
      <div className={styles.meter} aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            className={`${styles.bar} ${i < filled ? barClass : ''}`}
          />
        ))}
      </div>
      <p className={`${styles.hint} ${barClass}`} aria-live="polite">
        {strength.label}
      </p>
    </div>
  )
}
