import { buildWhatsAppUrl } from '@/shared/utils/buildWhatsAppUrl'
import styles from './CTABanner.module.css'

export function CTABanner() {
  const waUrl = buildWhatsAppUrl(
    'Olá! Tenho um imóvel para anunciar na plataforma Chave. Poderia me ajudar?',
  )

  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <div className={styles.inner}>
        <div className={styles.text}>
          <h2 id="cta-title" className={styles.title}>
            Tem um imóvel para anunciar?
          </h2>
          <p className={styles.sub}>
            Cadastre gratuitamente e alcance centenas de interessados em Maringá e Sarandi.
          </p>
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
          aria-label="Anunciar meu imóvel via WhatsApp"
        >
          Anunciar meu imóvel
        </a>
      </div>
    </section>
  )
}
