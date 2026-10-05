import { useState } from 'react';
import Link from 'next/link';
import AppButton from '../../../components/common/AppButton';
import {
  AUTH_SERVICE_UNAVAILABLE_MESSAGE,
  getApiErrorMessage,
} from '../api-response';

export default function RegisterPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    const formElement = event.currentTarget;
    const form = new FormData(formElement); 

    const data = {
      firstName: form.get('firstName'),
      lastName: form.get('lastName'),
      email: form.get('email'),
      password: form.get('password'),
    };

    
    try {
      const response = await fetch('/api/auth/register', {
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

      setMessage('Cuenta creada correctamente. Ya puedes iniciar sesión.');

      formElement.reset();
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
      <section className="auth-panel" aria-labelledby="register-title">
        <Link className="auth-brand" href="/" aria-label="OtaWay, inicio">
          <span className="auth-brand-mark" aria-hidden="true">O</span>
          <span>OtaWay</span>
        </Link>
        <h1 id="register-title">Crear cuenta</h1>
        <p className="auth-description">Únete a OtaWay para descubrir Otavalo.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
          <span>Nombre</span>
          <input
            type="text"
            name="firstName"
            placeholder="Tu nombre"
            autoComplete="given-name"
            required
          />
        </label>

          <label>
          <span>Apellido</span>
          <input
            type="text"
            name="lastName"
            placeholder="Tu apellido"
            autoComplete="family-name"
            required
          />
        </label>

          <label>
          <span>Correo electrónico</span>
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
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>

        <AppButton type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarme'}
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
        ¿Ya tienes cuenta?{' '}
        <Link href="/login">Inicia sesión</Link>
      </p>
      </section>
    </main>
  );
} 