import AdminLayout from '../../../layouts/AdminLayout';
import { culturalEvents } from '../../../features/tourism/catalog';
import { TourismVisual } from '../../../features/tourism/components/TourismUI';

export default function EventsPage() {
  return (
    <AdminLayout title="Eventos culturales">
      <p className="tourism-demo-note">Referencias culturales, no una agenda actual. Las fechas de cada celebración dependen de su programación anual.</p>
      <div className="tourism-card-grid">
        {culturalEvents.map((event) => (
          <article className="tourism-simple-card" key={event.slug}>
            <TourismVisual label={event.visual} tone={event.tone} imageSrc={event.imageSrc} />
            <h2>{event.name}</h2>
            <p>{event.description}</p>
            <p className="tourism-note">{event.season}</p>
            <p className="tourism-location"><span aria-hidden="true">⌖</span> {event.location}</p>
          </article>
        ))}
      </div>
    </AdminLayout>
  );
}