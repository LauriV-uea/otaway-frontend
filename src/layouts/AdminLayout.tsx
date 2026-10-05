import Link from 'next/link';
import type { ReactNode } from 'react';
import AdminNavigation from '../features/admin/components/AdminNavigation';
import { ADMIN_NAVIGATION } from '../features/admin/navigation/admin-navigation';

type AdminLayoutProps = {
  children?: ReactNode;
  title?: string;
  notice?: string;
};

export default function AdminLayout({ children, title, notice }: AdminLayoutProps) {
  return (
    <div className="admin-shell">
      <AdminNavigation groups={ADMIN_NAVIGATION} />
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">OtaWay · Administración</p>
            <h1>{title ?? 'Panel de administración'}</h1>
          </div>
          <Link href="/" className="admin-back-link">Ver sitio</Link>
        </header>
        <p className="admin-demo-notice" role="note">
          {notice ?? 'Los catálogos informativos aún no están conectados a modelos persistentes. Las acciones de administración se validan en el backend.'}
        </p>
        {children ?? (
          <section className="admin-overview">
            <h2>Catálogos de OtaWay</h2>
            <p>Consulta la información turística disponible en esta demostración.</p>
            <div className="admin-shortcut-list">
              {ADMIN_NAVIGATION.flatMap((group) => group.items).map((item) => (
                <Link href={item.path} key={item.id}>
                  <span>{item.label}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
