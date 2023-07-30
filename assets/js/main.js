const map = L.map('map').setView([51.505, -0.09], 13);

const locationIcon = L.icon({
  iconUrl: 'assets/images/icon-location.svg',
});

L.tileLayer
  .provider('Jawg.Streets', {
    variant: 'jawg-streets',
    accessToken:
      'N8aeJfESnD01rYqByeyv6rRqYLOTTkM8vLIYRsmcaJPFaF3n8zybSXcdVTZYrOOw',
  })
  .addTo(map);

L.marker([51.505, -0.09], { icon: locationIcon }).addTo(map);
