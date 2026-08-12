import { useParams } from 'react-router-dom'

export function PropertyPage() {
  const { id } = useParams()
  return (
    <div style={{ padding: '64px 24px', textAlign: 'center' }}>
      <h1>Detalhes do Imóvel #{id} — em desenvolvimento (STORY-05)</h1>
    </div>
  )
}
