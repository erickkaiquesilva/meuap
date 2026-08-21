import { OnboardingShell } from '../components/OnboardingShell/OnboardingShell'
import styles from './OnboardingPlaceholder.module.css'

export function OnboardingRentPage() {
  return (
    <OnboardingShell
      title="Vamos achar o imóvel certo para você."
      subtitle="Em seguida, algumas perguntas rápidas para personalizar a busca."
    >
      <div className={styles.panel}>
        <h2 className={styles.heading}>Alugar um imóvel</h2>
        <p className={styles.subtitle}>Pré-onboarding do locatário</p>
        <p className={styles.note}>
          Os passos do perfil (para que busca, cidade, orçamento e quartos) entram no próximo ticket.
          Você permanece aqui até concluir o onboarding.
        </p>
      </div>
    </OnboardingShell>
  )
}
