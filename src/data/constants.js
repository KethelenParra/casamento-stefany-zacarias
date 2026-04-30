
/** Depois do casamento: preencher com { id, author, relation, thumbnail, url? }. Array vazio oculta a secção em Recados. */
export const FAMILY_VIDEOS = [];

/** Fotos do carrossel (`public/carrossel/`). Ordem alfabética por nome do ficheiro. */
export const WEDDING_ALBUM_PHOTOS = [
  { src: '/carrossel/IMG-20260423-WA0094.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0095(1).jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0097.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0098.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0099.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0100.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0101.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0102.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0103.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0104.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0105.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0106(1).jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0107.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0108.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0109.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0110.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0111.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0112.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0113.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0114.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0115.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0116.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0117.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0118.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0119.jpg', alt: 'Memória do casal' },
  { src: '/carrossel/IMG-20260423-WA0120.jpg', alt: 'Memória do casal' },
];

const YT_NOS = 'https://www.youtube.com/watch?v=6861VoFX2O4';
const YT_PEDIDO = 'https://youtube.com/shorts/NKr_QvH28iQ?feature=share';
const YT_MUSICA = 'https://youtube.com/shorts/rEeg31KMULU?feature=share';

export const HOME_MOMENT_VIDEOS = [
  {
    id: 'nos',
    title: 'Nós',
    subtitle: 'À mensagem',
    orientation: 'landscape',
    embedUrl: import.meta.env.VITE_YOUTUBE_NOS || YT_NOS,
    fileUrl: '',
    posterUrl: '',
  },
  {
    id: 'pedido',
    title: 'O pedido',
    subtitle: 'Um momento inesquecível',
    orientation: 'portrait',
    embedUrl: import.meta.env.VITE_YOUTUBE_PEDIDO || YT_PEDIDO,
    fileUrl: '',
    posterUrl: '',
  },
  {
    id: 'musica',
    title: 'Uma música para ti',
    subtitle: 'Do Zacarias para a Stefany',
    orientation: 'portrait',
    embedUrl: import.meta.env.VITE_YOUTUBE_MUSICA || YT_MUSICA,
    fileUrl: '',
    posterUrl: '',
  },
];
