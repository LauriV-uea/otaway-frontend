import Link from 'next/link';

const AppRoutes: React.FC = () => {
  return (
    <nav style={{ display: 'flex', gap: 16, padding: 20, background: '#0f172a', color: '#fff' }}>
      <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>Inicio</Link>
      <Link href="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
      <Link href="/register" style={{ color: '#fff', textDecoration: 'none' }}>Registro</Link>
      <Link href="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Admin</Link>
    </nav>
  );
};

export default AppRoutes;
