export interface NeighborhoodCard {
  id: string
  name: string
  city: string
  gradient: string
}

export const neighborhoodCards: NeighborhoodCard[] = [
  {
    id: 'maringa-zona7',
    name: 'Zona 7',
    city: 'Maringá',
    gradient: 'linear-gradient(135deg, var(--primary-300), var(--primary-700))',
  },
  {
    id: 'maringa-centro',
    name: 'Centro',
    city: 'Maringá',
    gradient: 'linear-gradient(135deg, var(--primary-500), var(--neutral-800))',
  },
  {
    id: 'maringa-alvorada',
    name: 'Jardim Alvorada',
    city: 'Maringá',
    gradient: 'linear-gradient(135deg, var(--secondary-400), var(--primary-600))',
  },
  {
    id: 'maringa-esperanca',
    name: 'Nova Esperança',
    city: 'Maringá',
    gradient: 'linear-gradient(135deg, var(--primary-200), var(--primary-500))',
  },
  {
    id: 'sarandi-primavera',
    name: 'Jardim Primavera',
    city: 'Sarandi',
    gradient: 'linear-gradient(135deg, var(--secondary-300), var(--primary-400))',
  },
  {
    id: 'sarandi-progresso',
    name: 'Vila Progresso',
    city: 'Sarandi',
    gradient: 'linear-gradient(135deg, var(--neutral-400), var(--primary-800))',
  },
]
