import { PageHeading, TourismLayout, TourismVisual } from '../../features/tourism/components/TourismUI';
import { gastronomy } from '../../features/tourism/catalog';

export default function GastronomyPage() {
  return (
    <TourismLayout>
      <main className="tourism-main">
        <PageHeading
          eyebrow="Sabores de la Sierra"
          title="Gastronomía de Otavalo"
          description="Una muestra de preparaciones e ingredientes que forman parte de la cocina cotidiana y festiva de la región."
        />
        <div className="tourism-card-grid">
          {gastronomy.map((food) => (
            <article className="tourism-simple-card" key={food.slug}>
              <TourismVisual label={food.visual} tone={food.tone} imageSrc={food.imageSrc} />
              <h2>{food.name}</h2>
              <p>{food.description}</p>
              <p className="tourism-note">{food.culturalNote}</p>
            </article>
          ))}
        </div>
      </main>
    </TourismLayout>
  );
}