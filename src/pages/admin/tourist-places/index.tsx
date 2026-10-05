import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';

import { createTouristPlace, deleteTouristPlace, updateTouristPlace } from '../../../features/tourism/api';
import type { TouristPlaceInput, TouristPlaceRecord } from '../../../features/tourism/api';
import AdminLayout from '../../../layouts/AdminLayout';
import useTouristPlaces from '../../../features/tourism/useTouristPlaces';

type PlaceForm = {
  name: string;
  description: string;
  location: string;
  imageUrl: string;
};

const EMPTY_FORM: PlaceForm = { name: '', description: '', location: '', imageUrl: '' };
const sortPlaces = (places: TouristPlaceRecord[]) =>
  [...places].sort((left, right) => left.name.localeCompare(right.name, 'es'));
const subscribeToSession = (onChange: () => void) => {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
};
const getSessionSnapshot = () => {
  try {
    return Boolean(window.localStorage.getItem('otaway_session_token'));
  } catch {
    return false;
  }
};
const getServerSessionSnapshot = () => false;

export default function TouristPlacesPage() {
  const { places, setPlaces, loading, error, reload } = useTouristPlaces();
  const isAuthenticated = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fields, setFields] = useState<PlaceForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const updateField = (field: keyof PlaceForm, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setFields(EMPTY_FORM);
    setEditingId(null);
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setMessage(null);

    const name = fields.name.trim();
    const imageUrl = fields.imageUrl.trim();
    if (!name) {
      setFormError('El nombre es obligatorio.');
      return;
    }
    if (imageUrl && !imageUrl.startsWith('https://')) {
      setFormError('La URL de imagen debe comenzar con https://.');
      return;
    }

    const input: TouristPlaceInput = {
      name,
      description: fields.description.trim() || null,
      location: fields.location.trim() || null,
      imageUrl: imageUrl || null,
    };

    setSaving(true);
    try {
      const saved = editingId
        ? await updateTouristPlace(editingId, input)
        : await createTouristPlace(input);
      setPlaces((current) => sortPlaces(
        editingId
          ? current.map((place) => (place.id === saved.id ? saved : place))
          : [...current, saved],
      ));
      setMessage(editingId ? 'Lugar actualizado correctamente.' : 'Lugar creado correctamente.');
      resetForm();
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : 'No se pudo guardar el lugar.');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (place: TouristPlaceRecord) => {
    setEditingId(place.id);
    setFields({
      name: place.name,
      description: place.description ?? '',
      location: place.location ?? '',
      imageUrl: place.imageUrl ?? '',
    });
    setFormError(null);
    setMessage(null);
  };

  const handleDelete = async (place: TouristPlaceRecord) => {
    if (!window.confirm(`¿Eliminar “${place.name}”? Esta acción no se puede deshacer.`)) return;
    setDeletingId(place.id);
    setFormError(null);
    setMessage(null);

    try {
      await deleteTouristPlace(place.id);
      setPlaces((current) => current.filter((item) => item.id !== place.id));
      if (editingId === place.id) resetForm();
      setMessage('Lugar eliminado correctamente.');
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : 'No se pudo eliminar el lugar.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout
      title="Lugares turísticos"
      notice="La lista se consulta desde PostgreSQL. Crear, editar y eliminar requiere una sesión válida y el permiso tourist-places.manage."
    >
      <div className="admin-place-workspace">
        <section className="admin-place-panel" aria-labelledby="place-form-title">
              <h2 id="place-form-title">{editingId ? 'Editar atractivo' : 'Nuevo atractivo'}</h2>
          {!isAuthenticated ? (
            <div className="admin-auth-prompt">
              <p>Inicia sesión con una cuenta autorizada para gestionar lugares.</p>
              <Link href="/login">Iniciar sesión</Link>
            </div>
          ) : (
            <form className="admin-place-form" onSubmit={handleSubmit}>
              <label htmlFor="place-name">Nombre *</label>
              <input
                id="place-name"
                name="name"
                value={fields.name}
                onChange={(event) => updateField('name', event.currentTarget.value)}
                placeholder="Ej. Cascada de Peguche"
                maxLength={150}
                required
              />

              <label htmlFor="place-description">Descripción</label>
              <textarea
                id="place-description"
                name="description"
                value={fields.description}
                onChange={(event) => updateField('description', event.currentTarget.value)}
                placeholder="Describe qué hace especial a este lugar"
                maxLength={5000}
                rows={4}
              />

              <label htmlFor="place-location">Ubicación</label>
              <input
                id="place-location"
                name="location"
                value={fields.location}
                onChange={(event) => updateField('location', event.currentTarget.value)}
                placeholder="Comunidad, parroquia o referencia"
                maxLength={255}
              />

              <label htmlFor="place-image">URL de imagen (HTTPS)</label>
              <input
                id="place-image"
                name="imageUrl"
                type="url"
                value={fields.imageUrl}
                onChange={(event) => updateField('imageUrl', event.currentTarget.value)}
                placeholder="https://..."
                maxLength={500}
                pattern="https://.+"
                title="Usa una URL HTTPS."
              />

              {formError && <p className="admin-form-feedback admin-form-feedback--error" role="alert">{formError}</p>}
              <div className="admin-place-form-actions">
                <button className="admin-primary-button" type="submit" disabled={saving}>
                  {saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear lugar'}
                </button>
                {editingId && <button type="button" onClick={resetForm} disabled={saving}>Cancelar</button>}
              </div>
            </form>
          )}
        </section>

        <section className="admin-place-list-panel" aria-labelledby="place-list-title">
          <div className="admin-place-list-heading">
            <div>
              <h2 id="place-list-title">Lugares publicados</h2>
              <p>{places.length} {places.length === 1 ? 'registro' : 'registros'}</p>
            </div>
            <div className="admin-place-list-controls">
              <Link
                className="admin-new-place-link"
                href="#place-form-title"
                onClick={() => { resetForm(); setMessage(null); }}
              >
                + Nuevo atractivo
              </Link>
              <button type="button" onClick={reload} disabled={loading}>Actualizar</button>
            </div>
          </div>
          {message && <p className="admin-form-feedback admin-form-feedback--success" role="status">{message}</p>}
          {error && (
            <div className="admin-form-feedback admin-form-feedback--error" role="alert">
              <p>{error}</p>
              <button type="button" onClick={reload}>Reintentar</button>
            </div>
          )}
          {loading ? <p role="status">Consultando PostgreSQL…</p> : null}
          {!loading && !error && places.length === 0 && (
            <p className="admin-place-empty">No hay lugares publicados todavía.</p>
          )}
          {!loading && !error && places.length > 0 && (
            <ul className="admin-place-list">
              {places.map((place) => (
                <li className="admin-place-row" key={place.id}>
                  <div>
                    <h3>{place.name}</h3>
                    <p>{place.location || 'Ubicación sin especificar'}</p>
                  </div>
                  <div className="admin-place-row-actions">
                    <button type="button" onClick={() => startEditing(place)}>Editar</button>
                    <button
                      className="admin-danger-button"
                      type="button"
                      onClick={() => void handleDelete(place)}
                      disabled={deletingId === place.id}
                    >
                      {deletingId === place.id ? 'Eliminando…' : 'Eliminar'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}