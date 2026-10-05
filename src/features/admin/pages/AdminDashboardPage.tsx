import Link from 'next/link';
import AppButton from '../../../components/common/AppButton';
import { useLogoutMutation } from '../../auth/hooks/useSession';
import { useSessionStore } from '../../../store/sessionStore';

interface AdminDashboardPageProps {
  groups: {
    id: string;
    label: string;
    items: {
      id: string;
      label: string;
      description: string;
      icon: string;
      path: string;
      requiredPermissions: string[];
    }[];
  }[];
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = () => {
  const user = useSessionStore(state => state.user);
  const logoutMutation = useLogoutMutation();

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <main className="admin-dashboard">
      <header>
        <p>OtaWay</p>
        <h1>Hola, {user.name.split(' ')[0]} 👋</h1>
        <p>
          Descubre los mejores lugares turísticos de Otavalo.
        </p>
      </header>

      <section style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <article style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>📍 Lugares turísticos</h2>
          <p>Explora los principales destinos turísticos de Otavalo.</p>
          <Link href="/admin/tourist-places" style={{ color: '#2563eb', fontWeight: 700 }}>
            Ver lugares turísticos →
          </Link>
        </article>

        <article style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>🍲 Gastronomía</h2>
          <p>Conoce los platos y sabores tradicionales de Otavalo.</p>
        </article>

        <article style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>🎉 Eventos culturales</h2>
          <p>Descubre las fiestas, ferias y actividades culturales.</p>
        </article>

        <article style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
          <h2 style={{ marginTop: 0 }}>❤️ Mis favoritos</h2>
          <p>Guarda los lugares que quieras visitar.</p>
        </article>
      </section>

      <AppButton variant="outline" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
        {logoutMutation.isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
      </AppButton>
    </main>
  );
};

export default AdminDashboardPage;