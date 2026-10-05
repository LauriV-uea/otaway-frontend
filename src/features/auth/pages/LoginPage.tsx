import { useState } from 'react';
import Link from 'next/link';
import AppButton from '../../../components/common/AppButton';
import { useRouter } from 'next/router';
import {
  AUTH_SERVICE_UNAVAILABLE_MESSAGE,
  getApiErrorMessage,
  getSessionToken,
} from '../api-response';

export default function LoginPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    const form = new FormData(event.currentTarget);

    const data = {
      username: form.get('email'),
      password: form.get('password'),
    };

    try {
      const response = await fetch('/api/auth/mobile/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(result) || AUTH_SERVICE_UNAVAILABLE_MESSAGE
        );
      }

      const sessionToken = getSessionToken(result);
      if (!sessionToken) throw new Error(AUTH_SERVICE_UNAVAILABLE_MESSAGE);
      localStorage.setItem('otaway_session_token', sessionToken);
      window.dispatchEvent(new Event('otaway-session-changed'));

      setMessage('Inicio de sesión correcto.');
    
      router.push('/admin');

    } catch (err) {
      setError(
        err instanceof TypeError
          ? AUTH_SERVICE_UNAVAILABLE_MESSAGE
          : err instanceof Error
          ? err.message
          : AUTH_SERVICE_UNAVAILABLE_MESSAGE
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <Link className="auth-brand" href="/" aria-label="OtaWay, inicio">
          <span className="auth-brand-mark" aria-hidden="true">O</span>
          <span>OtaWay</span>
        </Link>
        <h1 id="login-title">Iniciar sesión</h1>
        <p className="auth-description">Accede a tu panel de OtaWay.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            required
          />
        </label>

          <label>
          <span>Contraseña</span>
          <input
            type="password"
            name="password"
            placeholder="Tu contraseña"
            autoComplete="current-password"
            required
          />
        </label>

        <AppButton type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Entrar'}
        </AppButton>
        </form>

      {message && (
        <p className="auth-feedback auth-feedback--success" role="status">
          {message}
        </p>
      )}

      {error && (
        <p className="auth-feedback auth-feedback--error" role="alert">
          {error}
        </p>
      )}

      <p className="auth-switch">
        ¿No tienes cuenta?{' '}
        <Link href="/register">Regístrate</Link>
      </p>
      </section>
    </main>
  );
}