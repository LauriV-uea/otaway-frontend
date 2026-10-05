import Link from 'next/link';
import { useRouter } from 'next/router';
import type { AdminNavigationGroup } from '../navigation/admin-navigation';
import { isAdminPathActive } from '../navigation/admin-capabilities';

interface AdminNavigationProps {
  groups: AdminNavigationGroup[];
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ groups }) => {
  const { pathname: currentPath } = useRouter();

  return (
    <aside className="admin-navigation">
      <Link href="/admin" className="admin-navigation-brand">
        <strong>OtaWay</strong>
        <small>Turismo de Otavalo</small>
      </Link>
      <nav aria-label="Navegación administrativa">
        <div className="admin-navigation-group">
          <Link
            href="/admin"
            className={`admin-navigation-link${currentPath === '/admin' ? ' is-active' : ''}`}
            aria-current={currentPath === '/admin' ? 'page' : undefined}
          >
            Inicio
          </Link>
        </div>

        <div className="admin-navigation-group">
          <Link
            href="/perfil"
            className={`admin-navigation-link${currentPath === '/perfil' ? ' is-active' : ''}`}
            aria-current={currentPath === '/perfil' ? 'page' : undefined}
          >
            Perfil
          </Link>
        </div>

        {groups.map(group => (
          <div key={group.id} className="admin-navigation-group">
            <div className="admin-navigation-label">{group.label}</div>
            <ul className="admin-navigation-list">
              {group.items.map(item => {
                const isActive = isAdminPathActive(currentPath, item.path);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className={`admin-navigation-link${isActive ? ' is-active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminNavigation;
