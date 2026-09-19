import { Link } from 'react-router-dom'
import {
  summarizeAlertFilters,
  type SearchAlert,
} from '../api/alertsTypes'
import { useAlertsList, useDisableAlert } from '../hooks/useAlerts'
import styles from './AlertsPage.module.css'

function AlertRow({ alert }: { alert: SearchAlert }) {
  const disable = useDisableAlert()

  return (
    <li className={styles.row}>
      <div className={styles.rowBody}>
        <p className={styles.rowTitle}>{summarizeAlertFilters(alert.filters)}</p>
        <p className={styles.rowMeta}>
          {alert.active ? 'Ativo' : 'Desativado'} · canais:{' '}
          {alert.channels.join(', ')}
        </p>
      </div>
      {alert.active ? (
        <button
          type="button"
          className="btn btn-outline btn-sm"
          disabled={disable.isPending}
          onClick={() => disable.mutate(alert.id)}
        >
          {disable.isPending ? 'Desativando…' : 'Desativar'}
        </button>
      ) : (
        <span className={styles.badge}>Inativo</span>
      )}
    </li>
  )
}

export function AlertsPage() {
  const { data: alerts = [], isLoading, isError, refetch } = useAlertsList()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Meus alertas</h1>
        <p className={styles.subtitle}>
          Receba avisos quando um imóvel novo bater com os filtros da sua busca.
        </p>
      </header>

      {isLoading ? (
        <p className={styles.status} aria-live="polite" aria-busy="true">
          Carregando alertas…
        </p>
      ) : null}

      {isError ? (
        <div className={styles.status} role="alert">
          <p>Não foi possível carregar seus alertas.</p>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => void refetch()}>
            Tentar de novo
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && alerts.length === 0 ? (
        <div className={styles.empty}>
          <p>Você ainda não criou nenhum alerta.</p>
          <Link to="/imoveis" className="btn btn-primary">
            Buscar imóveis
          </Link>
        </div>
      ) : null}

      {!isLoading && !isError && alerts.length > 0 ? (
        <ul className={styles.list}>
          {alerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))}
        </ul>
      ) : null}
    </div>
  )
}
