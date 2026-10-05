import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonPage,
} from '@ionic/react';

const touristPlaces = [
  {
    name: 'Laguna de Cuicocha',
    category: 'Naturaleza',
    description: 'Una hermosa laguna ubicada en un cráter volcánico, ideal para disfrutar de paisajes y naturaleza.',
  },
  {
    name: 'Plaza de Ponchos',
    category: 'Cultura',
    description: 'Uno de los lugares más representativos de Otavalo, famoso por su mercado artesanal.',
  },
  {
    name: 'Cascada de Peguche',
    category: 'Naturaleza',
    description: 'Cascada rodeada de naturaleza y un lugar importante para las tradiciones culturales de la zona.',
  },
  {
    name: 'Parque Cóndor',
    category: 'Turismo',
    description: 'Espacio dedicado a la conservación y observación de aves rapaces.',
  },
  {
    name: 'Lago San Pablo',
    category: 'Naturaleza',
    description: 'Uno de los paisajes más conocidos de la región, con una espectacular vista del volcán Imbabura.',
  },
];

const TouristPlacesPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <header>
          <h1>📍 Lugares turísticos</h1>
          <p>
            Descubre los lugares más interesantes de Otavalo con OtaWay.
          </p>
        </header>

        {touristPlaces.map((place) => (
          <IonCard key={place.name}>
            <IonCardHeader>
              <IonCardSubtitle>{place.category}</IonCardSubtitle>
              <IonCardTitle>{place.name}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              {place.description}
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default TouristPlacesPage;