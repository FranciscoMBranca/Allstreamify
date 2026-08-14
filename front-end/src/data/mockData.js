// Dados mock para simular respostas de API durante desenvolvimento
// Remova ou adapte quando o backend estiver pronto

// ==================== MOCK: Live Rooms ====================
export const mockLiveRooms = [
  {
    id: 1,
    name: 'Web Development Live',
    description: 'Transmissão ao vivo sobre desenvolvimento web com React',
    thumbnail: 'https://via.placeholder.com/500x300?text=Web+Dev+Live',
    status: 'active',
    members: 45,
    maxMembers: 100,
    createdAt: new Date('2024-08-01'),
    host: 'João Silva',
  },
  {
    id: 2,
    name: 'Design UI/UX Session',
    description: 'Sessão interativa de design de interfaces',
    thumbnail: 'https://via.placeholder.com/500x300?text=UI+Design',
    status: 'scheduled',
    members: 28,
    maxMembers: 50,
    createdAt: new Date('2024-08-02'),
    host: 'Maria Santos',
  },
]

// ==================== MOCK: Publicações ====================
export const mockPublicacoes = [
  {
    id: 1,
    title: 'Web Development com React',
    description: 'Aprenda os fundamentos do React e crie aplicações modernas e interativas.',
    host: 'João Silva',
    when: '15 de Agosto às 19:30',
    thumbnail: 'https://via.placeholder.com/500x300?text=React+Dev',
    comments: 24,
    reactions: 156,
    createdAt: new Date('2024-08-15'),
  },
  {
    id: 2,
    title: 'Design UI/UX para Iniciantes',
    description: 'Descubra os princípios essenciais do design de interfaces modernas.',
    host: 'Maria Santos',
    when: '16 de Agosto às 20:00',
    thumbnail: 'https://via.placeholder.com/500x300?text=UI+Design',
    comments: 18,
    reactions: 89,
    createdAt: new Date('2024-08-16'),
  },
  {
    id: 3,
    title: 'Python para Data Science',
    description: 'Exploração de dados, análise e visualização com Python.',
    host: 'Carlos Oliveira',
    when: '17 de Agosto às 18:00',
    thumbnail: 'https://via.placeholder.com/500x300?text=Data+Science',
    comments: 32,
    reactions: 203,
    createdAt: new Date('2024-08-17'),
  },
]

// ==================== MOCK: Salas ====================
export const mockSalas = [
  {
    id: 1,
    name: 'Web Development',
    members: 45,
    joined: false,
    maxMembers: 100,
    description: 'Sala dedicada a discussões sobre desenvolvimento web',
    createdAt: new Date('2024-07-01'),
  },
  {
    id: 2,
    name: 'Design & UI',
    members: 28,
    joined: true,
    maxMembers: 50,
    description: 'Comunidade de designers e entusiastas de UI/UX',
    createdAt: new Date('2024-07-02'),
  },
  {
    id: 3,
    name: 'Data Science Hub',
    members: 67,
    joined: false,
    maxMembers: 150,
    description: 'Espaço para partilha de conhecimento em Data Science',
    createdAt: new Date('2024-07-03'),
  },
]

// ==================== MOCK: Utilizadores ====================
export const mockUtilizadores = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    avatar: 'JS',
    bio: 'Desenvolvedor web apaixonado por React',
    followers: 234,
    following: 89,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@example.com',
    avatar: 'MS',
    bio: 'Designer UX/UI com 5 anos de experiência',
    followers: 456,
    following: 123,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 3,
    name: 'Carlos Oliveira',
    email: 'carlos@example.com',
    avatar: 'CO',
    bio: 'Data Scientist focado em machine learning',
    followers: 345,
    following: 156,
    createdAt: new Date('2024-03-10'),
  },
]

// ==================== MOCK: Comentários ====================
export const mockComentarios = [
  {
    id: 1,
    publicacaoId: 1,
    userId: 2,
    userName: 'Maria Santos',
    text: 'Excelente conteúdo! Muito útil para iniciantes.',
    createdAt: new Date('2024-08-15T20:30:00'),
    likes: 12,
  },
  {
    id: 2,
    publicacaoId: 1,
    userId: 3,
    userName: 'Carlos Oliveira',
    text: 'Gostaria de aprofundar mais sobre hooks customizados.',
    createdAt: new Date('2024-08-15T21:15:00'),
    likes: 8,
  },
]

// ==================== MOCK: Reações ====================
export const mockReacoes = [
  {
    id: 1,
    publicacaoId: 1,
    userId: 1,
    type: '❤️',
    createdAt: new Date('2024-08-15T19:45:00'),
  },
  {
    id: 2,
    publicacaoId: 1,
    userId: 2,
    type: '👍',
    createdAt: new Date('2024-08-15T20:00:00'),
  },
]

// ==================== MOCK: Notificações ====================
export const mockNotificacoes = [
  {
    id: 1,
    userId: 1,
    type: 'like',
    message: 'Maria gostou do teu post',
    relatedId: 1,
    read: false,
    createdAt: new Date('2024-08-15T22:00:00'),
  },
  {
    id: 2,
    userId: 1,
    type: 'comment',
    message: 'Carlos comentou no teu post',
    relatedId: 1,
    read: false,
    createdAt: new Date('2024-08-15T22:15:00'),
  },
  {
    id: 3,
    userId: 1,
    type: 'follow',
    message: 'João começou a seguir-te',
    relatedId: 3,
    read: true,
    createdAt: new Date('2024-08-14T18:00:00'),
  },
]

// ==================== MOCK: Feed ====================
export const mockFeed = mockPublicacoes.map((pub, index) => ({
  publicacao: pub,
  sala: mockSalas[index] || null,
}))

export default {
  mockLiveRooms,
  mockPublicacoes,
  mockSalas,
  mockUtilizadores,
  mockComentarios,
  mockReacoes,
  mockNotificacoes,
  mockFeed,
}
