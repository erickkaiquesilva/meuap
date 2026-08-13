import type { Property } from '@/shared/types/property'
import { formatCurrency } from '@/shared/utils/formatCurrency'
import { buildWhatsAppUrl } from '@/shared/utils/buildWhatsAppUrl'
import styles from './ContactCard.module.css'

interface ContactCardProps {
  property: Property
}

export function ContactCard({ property }: ContactCardProps) {
  const message = `Olá! Tenho interesse no imóvel *${property.title}* (Ref. ${property.id}) — ${property.address}, ${property.neighborhood}. Poderia me passar mais informações?`
  const whatsappUrl = buildWhatsAppUrl(message)

  return (
    <aside className={styles.card} aria-label="Entre em contato">
      {/* Price */}
      <div className={styles.priceBox}>
        <p className={styles.priceLabel}>
          {property.operation === 'rent' ? 'Valor do aluguel' : 'Valor de venda'}
        </p>
        <p>
          <span className={styles.price}>{formatCurrency(property.price)}</span>
          {property.operation === 'rent' && (
            <span className={styles.priceSuffix}>/mês</span>
          )}
        </p>
      </div>

      {/* Agent */}
      <div className={styles.agentSection}>
        <div className={styles.agentAvatar} aria-hidden="true">C</div>
        <div className={styles.agentInfo}>
          <span className={styles.agentName}>Equipe Chave</span>
          <span className={styles.agentRole}>Corretor de imóveis</span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappBtn}
          aria-label="Falar com corretor via WhatsApp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          Falar no WhatsApp
        </a>

        <button
          type="button"
          className="btn btn-outline"
          style={{ width: '100%' }}
          onClick={() => window.print()}
        >
          Imprimir / Salvar PDF
        </button>
      </div>

      <p className={styles.disclaimer}>
        Ao entrar em contato você concorda com nossa política de privacidade. Não compartilhamos seus dados.
      </p>

      <p className={styles.refCode}>Ref. #{property.id}</p>
    </aside>
  )
}
