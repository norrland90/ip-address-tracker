const apiKey = 'at_2XSaB2v4gzXs2VRZGVq19hE085DYp';

// CREATE MAP
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

const marker = L.marker([51.505, -0.09], { icon: locationIcon }).addTo(map);

// GET FORM DATA
const form = document.querySelector('.form');
const errorMessage = document.querySelector('.header__form-error');
const formInput = document.querySelector('.form__input');

function onSubmit(e) {
  e.preventDefault();
  hideFormInputError();

  const query = formInput.value;

  // Lägga in form validation. Kolla om man skrivit ip eller domän, samt även kolla om man skriver fel. Efter detta kan query skickas in i getData; den ska då skicka den del som ska adderas till apiURL innan fetch. Samma data oavsett om man söker med ip eller domän, varför jag inte behöver veta vilket "söksätt" det är.

  const validInput = validateInput(query);
  if (validInput) {
    getData(validInput);
  } else {
    showFormInputError();
  }
}

form.addEventListener('submit', onSubmit);

function showFormInputError() {
  errorMessage.style.display = 'block';
  formInput.style.border = '1.5px solid red';
}

function hideFormInputError() {
  errorMessage.style.display = 'none';
  formInput.style.border = '0';
}

function validateInput(query) {
  // Checks the format of ip addresses, but not if actually valid ip addresses
  const regExpIpFour = /^\d+\.\d+\.\d+\.\d+$/;
  const regExpIpSix = /^\w+\:\w+\:\w+\:\w+\:\w+\:\w+\:\w+\:\w+$/;
  // Checks if valid domain
  const regExpDomain =
    /^[a-zA-Z0-9][-a-zA-Z0-9]+[a-zA-Z0-9]\.[a-z]{2,3}(.[a-z]{2,3})?(.[a-z]{2,3})?$/;

  // Check type entered
  if (regExpIpFour.test(query) || regExpIpSix.test(query)) {
    console.log('entered IP address');
    return `ipAddress=${query}`;
  } else if (regExpDomain.test(query)) {
    console.log('entered domain');
    return `domain=${query}`;
  } else {
    console.log('not ip nor domain');
    return false;
  }
}

function getData(query) {
  const apiURL = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`;
  fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&${query}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`No data found`);
      }
    })
    .then((data) => {
      console.log(data);
      addDataToDOM(data);
      changeLocationOnMap(data.location.lat, data.location.lng);
    })
    .catch((err) => {
      addErrorToDOM(err);
    });
}

function addDataToDOM(data) {
  const resultsDiv = document.querySelector('.results');
  resultsDiv.innerHTML = '';

  resultsDiv.appendChild(createResultsDiv('ip address', data.ip));
  resultsDiv.appendChild(
    createResultsDiv(
      'Location',
      `${data.location.city}, ${data.location.country} ${data.location.postalCode}`
    )
  );
  resultsDiv.appendChild(
    createResultsDiv('Timezone', `UTC ${data.location.timezone}`)
  );
  resultsDiv.appendChild(createResultsDiv('Isp', data.isp));
}

function addErrorToDOM(err) {
  const resultsDiv = document.querySelector('.results');
  resultsDiv.innerHTML = '';
  resultsDiv.appendChild(
    createResultsDiv('error', `${err.message}. Please try again!`)
  );
}

function createResultsDiv(heading, value) {
  const div = document.createElement('div');
  div.classList = 'results__item';
  const h2 = document.createElement('h2');
  h2.classList = 'results__heading';
  h2.innerText = heading;
  const paragraph = document.createElement('p');
  paragraph.classList = 'results__value';
  paragraph.innerText = value;
  div.appendChild(h2);
  div.appendChild(paragraph);
  return div;
}

function changeLocationOnMap(lat, lon) {
  map.flyTo([lat, lon], 13);
  marker.setLatLng([lat, lon]).update();
}
