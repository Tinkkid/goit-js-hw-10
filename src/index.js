import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';


const DEBOUNCE_DELAY = 300;
const refs = {
  inputCountry: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const url = 'https://restcountries.com/v3.1/name/';

function fetchCountries(name) {
  return fetch(
    `${url}${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

refs.inputCountry.addEventListener(
  'input',
  debounce(onSearchCountry, DEBOUNCE_DELAY)
);


function onSearchCountry(e) {
   let name = e.target.value.trim();
   if (!name) {
      clearInputSearch();
      return
   }

  fetchCountries(name)
     .then(data => {
        if (data.length > 10) {
           Notiflix.Notify.info(
              'Too many matches found. Please enter a more specific name.'
           )
        }
        else if (data.length === 1) {
           refs.countryInfo.innerHTML = createMarkupCountry(data);
        }
        else if (data.length >= 2 && data.length < 10) {
           refs.countryList.innerHTML = createMarkupCountryList(data);
        }
     }
     )
     .catch((error) => {
        if (error.message === "404")
          Notiflix.Notify.failure('Oops, there is no country with that name');
    }  
    );
};


function createMarkupCountry(countryArray) {
   clearInputSearch();
   const { name, capital, population, languages } = countryArray[0];
   console.log({ name, capital, population, languages });
  return `<div class = "country-info-container"><img src = "${
    countryArray[0].flags.svg
  }" alt = "country flag" width = "50">
  <span class = "country-info__name"><strong>${
    name.official
  }</strong></span></div>
  <div class = "country-info"><strong>Capital:</strong> ${capital.join(
    ', '
  )}</div>
  <div class = "country-info"><strong>Population:</strong> ${population}</div>
  <div class = "country-info"><strong>Languages:</strong> ${Object.values(
    languages
  )}</div>
  `;
};

function createMarkupCountryList(countries) {
   clearInputSearch();
   return countries.map(country => {
      return `<div class = "country-info-container"><img src = "${country.flags.svg}" alt = "country flag" width = "50">
  <span class = "country-info__name"><strong>${country.name.official}</strong></span></div>`
   }).join("");
};

function clearInputSearch() {
   refs.countryInfo.innerHTML = "";
   refs.countryList.innerHTML = "";
}





