import { PageHeading, TourismLayout, TourismVisual } from '../../features/tourism/components/TourismUI';
import { culturalEvents } from '../../features/tourism/catalog';

export default function CulturalEventsPage() {
  return (
    <TourismLayout>
      <main className="tourism-main">
        <PageHeading
          eyebrow="Memoria y celebración"
          title="Cultura y eventos"
          description="Conoce algunas celebraciones y expresiones culturales de Otavalo."
        />
        <p className="tourism-demo-note">Información cultural de referencia, no una agenda de eventos actuales. Confirma las fechas con la organización local antes de planificar una visita.</p>
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
      </main>
    </TourismLayout>
  );
}