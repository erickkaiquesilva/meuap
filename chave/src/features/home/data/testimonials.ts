export interface Testimonial {
  id: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  authorName: string
  authorCity: string
  avatarGradient: string
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    rating: 5,
    text: 'Encontrei meu apartamento em menos de uma semana. O site é muito mais fácil que os outros da região.',
    authorName: 'Ana Souza',
    authorCity: 'Maringá, PR',
    avatarGradient: 'linear-gradient(135deg, var(--primary-300), var(--primary-600))',
  },
  {
    id: '2',
    rating: 5,
    text: 'Anunciei meu imóvel e em 3 dias já tinha interessados. Processo simples e atendimento ótimo.',
    authorName: 'Carlos Lima',
    authorCity: 'Sarandi, PR',
    avatarGradient: 'linear-gradient(135deg, var(--secondary-400), var(--secondary-700))',
  },
  {
    id: '3',
    rating: 4,
    text: 'Visual moderno e informações completas nos cards. Dá pra comparar imóveis sem precisar abrir um por um.',
    authorName: 'Fernanda Costa',
    authorCity: 'Maringá, PR',
    avatarGradient: 'linear-gradient(135deg, var(--neutral-400), var(--neutral-700))',
  },
]
