import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useLogoutMutation } from '../features/auth/hooks/useSession';
import { ApiRequestError, fetchOwnProfile, updateOwnProfile } from '../features/auth/session-api';
import type { OwnProfile } from '../features/auth/session-api';
import { TourismLayout } from '../features/tourism/components/TourismUI';

export default function ProfilePage() {
  const [profile, setProfile] = useState<OwnProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const logout = useLogoutMutation();

  const loadProfile = () => {
    setLoading(true);
    setError(null);
    setReloadVersion((version) => version + 1);
  };

  useEffect(() => {
    let active = true;
    fetchOwnProfile()
      .then((result) => {
        if (active) {
          setProfile(result);
          setFirstName(result.firstName);
          setLastName(result.lastName);
          setError(null);
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'No se pudo cargar el perfil.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadVersion]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const updated = await updateOwnProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        expectedProfileUpdatedAt: profile.profileUpdatedAt,
      });
      setProfile(updated);
      setFirstName(updated.firstName);
      setLastName(updated.lastName);
      window.dispatchEvent(new Event('otaway-session-changed'));
      setMessage('Perfil actualizado.');
    } catch (cause) {
      if (cause instanceof ApiRequestError && cause.status === 409) {
        setError('El perfil cambió en otra sesión. Recarga los datos antes de volver a guardar.');
      } else {
        setError(cause instanceof Error ? cause.message : 'No se pudo actualizar el perfil.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <TourismLayout>
      <main className="tourism-main profile-page">
        <div className="tourism-page-heading">
          <p className="tourism-eyebrow">Tu cuenta OtaWay</p>
          <h1>Perfil</h1>
          <p>Información vinculada a tu sesión y a tu cuenta.</p>
        </div>

        {loading && <p role="status">Cargando perfil…</p>}
        {!loading && error && !profile && (
          <section className="profile-state" role="alert">
            <p>{error}</p>
            <div className="profile-actions">
              <button className="profile-secondary-button" type="button" onClick={loadProfile}>Reintentar</button>
              <Link className="profile-secondary-button" href="/login">Iniciar sesión</Link>
            </div>
          </section>
        )}

        {!loading && profile && (
          <div className="profile-grid">
            <section className="profile-section" aria-labelledby="profile-account-title">
              <h2 id="profile-account-title">Cuenta</h2>
              <dl className="profile-data-list">
                <div><dt>Nombre</dt><dd>{[profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'No registrado'}</dd></div>
                <div><dt>Correo electrónico</dt><dd>{profile.email}</dd></div>
                <div><dt>Usuario</dt><dd>{profile.username || 'No registrado'}</dd></div>
                <div>
                  <dt>Rol{profile.roles.length === 1 ? '' : 'es'}</dt>
                  <dd>{profile.roles.length ? profile.roles.map((role) => role.name).join(', ') : 'Sin roles asignados'}</dd>
                </div>
              </dl>
              <p className="profile-security-note">
                El correo, usuario, roles y permisos se administran en sus sistemas de origen y no se editan desde aquí.
              </p>
            </section>

            <section className="profile-section" aria-labelledby="profile-name-title">
              <h2 id="profile-name-title">Datos personales</h2>
              <form className="profile-form" onSubmit={handleSubmit}>
                <label htmlFor="profile-first-name">Nombre</label>
                <input
                  id="profile-first-name"
                  autoComplete="given-name"
                  maxLength={100}
                  minLength={1}
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.currentTarget.value)}
                />
                <label htmlFor="profile-last-name">Apellido</label>
                <input
                  id="profile-last-name"
                  autoComplete="family-name"
                  maxLength={100}
                  minLength={1}
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.currentTarget.value)}
                />
                {error && <p className="profile-feedback profile-feedback--error" role="alert">{error}</p>}
                {message && <p className="profile-feedback profile-feedback--success" role="status">{message}</p>}
                <button className="tourism-button-link" type="submit" disabled={saving}>
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </form>
            </section>

            <section className="profile-section profile-signout" aria-labelledby="profile-session-title">
              <div>
                <h2 id="profile-session-title">Sesión</h2>
                <p>Al cerrar sesión, OtaWay la invalida en el servidor y en Keycloak.</p>
              </div>
              <button className="profile-signout-button" type="button" onClick={() => void logout.mutate()} disabled={logout.isPending}>
                {logout.isPending ? 'Cerrando sesión…' : 'Cerrar sesión'}
              </button>
              {logout.error && <p className="profile-feedback profile-feedback--error" role="alert">{logout.error}</p>}
            </section>
          </div>
        )}
      </main>
    </TourismLayout>
  );
}