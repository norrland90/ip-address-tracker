// GLOBAL VARIABLES
const form = document.querySelector('.form');
const errorMessage = document.querySelector('.header__form-error');
const formInput = document.querySelector('.form__input');

// CREATE MAP
const map = L.map('map', {
  center: [51.505, -0.09],
  zoom: 13,
});

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

// CHANGE LOCATION ON MAP
function changeLocationOnMap(lat, lon) {
  map.flyTo([lat, lon], 13, {
    duration: 2,
  });
  marker.setLatLng([lat, lon]);
}

// GET FORM DATA
function onSubmit(e) {
  e.preventDefault();
  hideFormInputError();

  const query = editQuery(formInput.value);
  formInput.value = query;

  const validQuery = validateInputAndGetQuery(query);
  if (validQuery) {
    getData(validQuery);
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

// Function to delete www., https:// and http:// if user enter it
// Does not check for typos, like ww., htt://.
function editQuery(queryOriginal) {
  let query = queryOriginal.toLowerCase();
  if (query[query.length - 1] === '/') {
    query = query.substr(0, query.length - 1);
  }
  if (query.substr(0, 4) === 'www.') {
    query = query.substr(4);
  } else if (query.substr(0, 8) === 'https://') {
    query = query.substr(8);
  } else if (query.substr(0, 7) === 'http://') {
    query = query.substr(7);
  } else {
    query = query;
  }
  return query;
}

function validateInputAndGetQuery(query) {
  // Checks the format of ip addresses, but not if actually valid ip addresses
  const regExpIpFour = /^\d+\.\d+\.\d+\.\d+$/;
  const regExpIpSix = /^\w+\:\w+\:\w+\:\w+\:\w+\:\w+\:\w+\:\w+$/;
  // Checks if valid domain
  const regExpDomain =
    /^[a-zA-Z0-9][-a-zA-Z0-9]+[a-zA-Z0-9]\.[a-z]{2,3}(.[a-z]{2,3})?(.[a-z]{2,3})?$/;

  // Check type entered
  if (regExpIpFour.test(query) || regExpIpSix.test(query)) {
    return `&ipAddress=${query}`;
  } else if (regExpDomain.test(query)) {
    return `&domain=${query}`;
  } else {
    return false;
  }
}

async function getData(query = '') {
  const apiKey = 'at_2XSaB2v4gzXs2VRZGVq19hE085DYp';
  const apiURL = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}${query}`;

  try {
    const response = await fetch(apiURL);
    if (response.ok) {
      const data = await response.json();
      addDataToDOM(data);
      changeLocationOnMap(data.location.lat, data.location.lng);
    } else {
      throw new Error('No data found');
    }
  } catch (error) {
    addErrorToDOM(error);
  }
}

// Same but with .then / .catch

// function getData(query) {
//   const apiKey = 'at_2XSaB2v4gzXs2VRZGVq19hE085DYp';
//   const apiURL = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&${query}`;
//   fetch(apiURL)
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       } else {
//         throw new Error(`No data found`);
//       }
//     })
//     .then((data) => {
//       console.log(data);
//       addDataToDOM(data);
//       changeLocationOnMap(data.location.lat, data.location.lng);
//     })
//     .catch((err) => {
//       addErrorToDOM(err);
//     });
// }

// ADD DATA TO DOM
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

// On page load

function init() {
  // Run function on page load. If the IP or domain are not specified, then ip address defaults to client public IP address.
  getData();
}
document.addEventListener('DOMContentLoaded', init);
