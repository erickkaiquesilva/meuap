export interface MockNeighborhood {
  id: string
  name: string
  city: 'Maringá' | 'Sarandi'
}

export const mockNeighborhoods: MockNeighborhood[] = [
  // Maringá
  { id: 'maringa-zona7', name: 'Zona 7', city: 'Maringá' },
  { id: 'maringa-centro', name: 'Centro', city: 'Maringá' },
  { id: 'maringa-alvorada', name: 'Jardim Alvorada', city: 'Maringá' },
  { id: 'maringa-esperanca', name: 'Nova Esperança', city: 'Maringá' },
  { id: 'maringa-mandacaru', name: 'Mandacaru', city: 'Maringá' },
  { id: 'maringa-zona5', name: 'Zona 5', city: 'Maringá' },
  { id: 'maringa-universo', name: 'Jardim Universo', city: 'Maringá' },
  // Sarandi
  { id: 'sarandi-centro', name: 'Centro', city: 'Sarandi' },
  { id: 'sarandi-primavera', name: 'Jardim Primavera', city: 'Sarandi' },
  { id: 'sarandi-progresso', name: 'Vila Progresso', city: 'Sarandi' },
  { id: 'sarandi-panorama', name: 'Jardim Panorama', city: 'Sarandi' },
  { id: 'sarandi-vilanova', name: 'Vila Nova', city: 'Sarandi' },
  { id: 'sarandi-parque', name: 'Parque das Nações', city: 'Sarandi' },
]
