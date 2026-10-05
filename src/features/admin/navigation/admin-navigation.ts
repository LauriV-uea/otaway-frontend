import {
  calendarOutline,
  heartOutline,
  locationOutline,
  restaurantOutline,
} from 'ionicons/icons';

export interface AdminNavigationItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  path: string;
  requiredPermissions: string[];
}

export interface AdminNavigationGroup {
  id: string;
  label: string;
  items: AdminNavigationItem[];
}

export const ADMIN_NAVIGATION: AdminNavigationGroup[] = [
  {
    id: 'explore',
    label: 'Descubre Otavalo',
    items: [
      {
        id: 'tourist-places',
        label: 'Lugares turísticos',
        description: 'Descubre los principales destinos turísticos de Otavalo.',
        icon: locationOutline,
        path: '/admin/tourist-places',
        requiredPermissions: [],
      },
      {
        id: 'gastronomy',
        label: 'Gastronomía',
        description: 'Conoce los sabores y platos tradicionales de Otavalo.',
        icon: restaurantOutline,
        path: '/admin/gastronomy',
        requiredPermissions: [],
      },
      {
        id: 'events',
        label: 'Eventos culturales',
        description: 'Encuentra fiestas, ferias y eventos culturales.',
        icon: calendarOutline,
        path: '/admin/events',
        requiredPermissions: [],
      },
      {
        id: 'favorites',
        label: 'Mis favoritos',
        description: 'Guarda y consulta tus lugares turísticos favoritos.',
        icon: heartOutline,
        path: '/admin/favorites',
        requiredPermissions: [],
      },
    ],
  },
];