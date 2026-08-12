import { testimonials } from '../../data/testimonials'
import styles from './Testimonials.module.css'

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      className={styles.star}
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function Testimonials() {
  return (
    <section className={styles.section} aria-labelledby="testimonials-title">
      <div className={styles.inner}>
        <h2 id="testimonials-title" className={styles.title}>
          O que dizem sobre a Chave
        </h2>

        <div className={styles.grid}>
          {testimonials.map((t) => (
            <article key={t.id} className={styles.card}>
              <div
                className={styles.rating}
                aria-label={`Avaliação ${t.rating} de 5 estrelas`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} filled={i < t.rating} />
                ))}
              </div>

              <blockquote className={styles.text}>
                <p>"{t.text}"</p>
              </blockquote>

              <footer className={styles.author}>
                <div
                  className={styles.avatar}
                  style={{ background: t.avatarGradient }}
                  aria-hidden="true"
                >
                  {getInitials(t.authorName)}
                </div>
                <div>
                  <div className={styles.authorName}>{t.authorName}</div>
                  <div className={styles.authorCity}>{t.authorCity}</div>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
