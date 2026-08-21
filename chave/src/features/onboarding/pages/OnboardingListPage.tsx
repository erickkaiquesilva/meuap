import { OnboardingShell } from '../components/OnboardingShell/OnboardingShell'
import styles from './OnboardingPlaceholder.module.css'

export function OnboardingListPage() {
  return (
    <OnboardingShell
      title="Vamos conhecer você antes de anunciar."
      subtitle="Diga se é dono, corretor ou corretora — coletamos só o essencial agora."
    >
      <div className={styles.panel}>
        <h2 className={styles.heading}>Anunciar um imóvel</h2>
        <p className={styles.subtitle}>Pré-onboarding do anunciante</p>
        <p className={styles.note}>
          A escolha de persona e os formulários por tipo entram no próximo ticket.
          Você permanece aqui até concluir o onboarding.
        </p>
      </div>
    </OnboardingShell>
  )
}
