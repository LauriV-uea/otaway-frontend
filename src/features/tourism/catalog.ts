export type TouristPlace = {
  slug: string;
  name: string;
  category: string;
  description: string;
  location: string;
  details: string;
  visual: string;
  imageSrc?: string;
  tone: 'forest' | 'lake' | 'earth' | 'sky';
};

export type GastronomyItem = {
  slug: string;
  name: string;
  description: string;
  culturalNote: string;
  visual: string;
  imageSrc?: string;
  tone: TouristPlace['tone'];
};

export type CulturalEvent = {
  slug: string;
  name: string;
  description: string;
  season: string;
  location: string;
  visual: string;
  imageSrc?: string;
  tone: TouristPlace['tone'];
};

export const touristPlaces: TouristPlace[] = [
  {
    slug: 'plaza-de-los-ponchos',
    name: 'Plaza de los Ponchos',
    category: 'Cultura y artesanía',
    description: 'Un punto de encuentro para descubrir textiles, artesanías y la tradición comercial de Otavalo.',
    location: 'Centro de Otavalo, Imbabura',
    details: 'La plaza y su mercado reúnen a artesanas y artesanos de la región. Es un espacio para apreciar tejidos, colores y técnicas transmitidas entre generaciones.',
    visual: 'Tejidos y artesanía',
    tone: 'earth',
  },
  {
    slug: 'laguna-de-cuicocha',
    name: 'Laguna de Cuicocha',
    category: 'Naturaleza',
    description: 'Laguna de origen volcánico rodeada por el paisaje andino de la provincia de Imbabura.',
    location: 'Cantón Cotacachi, Imbabura',
    details: 'Cuicocha ocupa una caldera volcánica y destaca por sus aguas y el paisaje montañoso que la rodea. El entorno invita a observar la naturaleza y recorrer el área protegida.',
    visual: 'Laguna entre montañas',
    imageSrc: '/images/Turismo/laguna-de-cuicocha.jpg',
    tone: 'lake',
  },
  {
    slug: 'cascada-de-peguche',
    name: 'Cascada de Peguche',
    category: 'Naturaleza y cultura',
    description: 'Caída de agua rodeada de vegetación, vinculada con el paisaje y las tradiciones de Peguche.',
    location: 'Comunidad de Peguche, Otavalo',
    details: 'La cascada se encuentra en un entorno natural de uso comunitario y tiene un lugar significativo en prácticas culturales andinas, especialmente durante celebraciones tradicionales.',
    visual: 'Agua y bosque',
    imageSrc: '/images/Turismo/casacada-de-peguche.jpg',
    tone: 'forest',
  },
  {
    slug: 'parque-condor',
    name: 'Parque Cóndor',
    category: 'Naturaleza',
    description: 'Espacio dedicado a la educación y conservación de aves rapaces en un entorno panorámico.',
    location: 'Loma de Pucará, Otavalo',
    details: 'El parque promueve el conocimiento y cuidado de aves rapaces. Su ubicación permite apreciar el paisaje de Otavalo y sus alrededores.',
    visual: 'Aves de los Andes',
    imageSrc: '/images/Turismo/parque-del-condor.jpg',
    tone: 'sky',
  },
  {
    slug: 'lago-san-pablo',
    name: 'Lago San Pablo',
    category: 'Naturaleza',
    description: 'Paisaje lacustre andino a los pies del volcán Imbabura y cerca de varias comunidades.',
    location: 'Parroquias alrededor de Otavalo, Imbabura',
    details: 'El lago forma parte de la vida cotidiana de las comunidades cercanas y ofrece una de las vistas emblemáticas de la zona, con el Imbabura como telón de fondo.',
    visual: 'Lago y volcán Imbabura',
    imageSrc: '/images/Turismo/lago-san-pablo.jpg',
    tone: 'lake',
  },
];

export const gastronomy: GastronomyItem[] = [
  {
    slug: 'fritada',
    name: 'Fritada',
    description: 'Preparación tradicional de cerdo cocida y dorada, servida habitualmente con acompañamientos de maíz y papa.',
    culturalNote: 'Es un plato popular en reuniones familiares y mercados de la Sierra ecuatoriana.',
    visual: 'Cocina de mercado',
    imageSrc: '/images/Turismo/fritada.jpg',
    tone: 'earth',
  },
  {
    slug: 'hornado',
    name: 'Hornado',
    description: 'Cerdo horneado lentamente, que suele servirse con mote, tortillas o agrio.',
    culturalNote: 'Forma parte de la tradición de mercados y celebraciones de la región andina.',
    visual: 'Sabores andinos',
    imageSrc: '/images/Turismo/hornado.jpg',
    tone: 'forest',
  },
  {
    slug: 'yamor',
    name: 'Yamor',
    description: 'Bebida tradicional elaborada con variedades de maíz y asociada con la identidad de Otavalo.',
    culturalNote: 'Da nombre a una de las celebraciones culturales más conocidas de la ciudad.',
    visual: 'Maíz y tradición',
    imageSrc: '/images/Turismo/yamor.jpg',
    tone: 'earth',
  },
  {
    slug: 'mote',
    name: 'Mote',
    description: 'Maíz cocido presente como acompañamiento en numerosas comidas de la Sierra.',
    culturalNote: 'El maíz es un ingrediente central de la alimentación y la cultura andina.',
    visual: 'Maíz de los Andes',
    imageSrc: '/images/Turismo/mote.jpg',
    tone: 'sky',
  },
  {
    slug: 'tortillas-de-tiesto',
    name: 'Tortillas de tiesto',
    description: 'Tortillas tradicionales cocidas sobre una superficie de barro caliente.',
    culturalNote: 'Su preparación conserva técnicas domésticas transmitidas en las comunidades.',
    visual: 'Horno de barro',
    imageSrc: '/images/Turismo/tortillas-de-tiesto.jpg',
    tone: 'earth',
  },
  {
    slug: 'helados-de-paila',
    name: 'Helados de paila',
    description: 'Helado artesanal preparado en una paila metálica enfriada con hielo y sal.',
    culturalNote: 'La elaboración manual es parte de una tradición popular de la Sierra ecuatoriana.',
    visual: 'Dulce artesanal',
    imageSrc: '/images/Turismo/helados-de-paila.jpg',
    tone: 'lake',
  },
];

export const culturalEvents: CulturalEvent[] = [
  {
    slug: 'fiesta-del-yamor',
    name: 'Fiesta del Yamor',
    description: 'Celebración local que reúne expresiones culturales, música, danza y gastronomía vinculada al Yamor.',
    season: 'Tradicionalmente en septiembre; fechas sujetas a programación anual.',
    location: 'Otavalo',
    visual: 'Música y celebración',
    imageSrc: '/images/Turismo/fiesta-yamor.jpg',
    tone: 'earth',
  },
  {
    slug: 'inti-raymi',
    name: 'Inti Raymi',
    description: 'Celebración andina del tiempo de cosecha, con ceremonias, música y encuentros comunitarios.',
    season: 'Alrededor del solsticio de junio; programación variable.',
    location: 'Comunidades de Otavalo y sus alrededores',
    visual: 'Celebración del sol',
    imageSrc: '/images/Turismo/inti-raymi.jpg',
    tone: 'forest',
  },
  {
    slug: 'pawkar-raymi',
    name: 'Pawkar Raymi',
    description: 'Festividad del florecimiento que celebra la renovación, la música y las tradiciones comunitarias.',
    season: 'Temporada de florecimiento, generalmente entre febrero y marzo.',
    location: 'Peguche y comunidades cercanas',
    visual: 'Tiempo de florecimiento',
    imageSrc: '/images/Turismo/pawkar-raymi.jpg',
    tone: 'sky',
  },
];

export const FAVORITES_STORAGE_KEY = 'otaway.favorite-place-slugs';