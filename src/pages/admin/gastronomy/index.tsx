import AdminLayout from '../../../layouts/AdminLayout';
import { gastronomy } from '../../../features/tourism/catalog';
import { TourismVisual } from '../../../features/tourism/components/TourismUI';

export default function GastronomyPage() {
  return (
    <AdminLayout title="Gastronomía">
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
    </AdminLayout>
  );
}