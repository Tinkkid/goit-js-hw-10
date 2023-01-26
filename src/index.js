import './css/styles.css';
import getRefs from './js/refs';
import API from './js/api-service-country';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';


const DEBOUNCE_DELAY = 300;
const refs = getRefs();

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

  API.fetchCountries(name)
     .then(data => {
        if (data.length > 10) {
          return Notiflix.Notify.info(
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
  return `<div class="country-info_wrap" ><img src = "${
    countryArray[0].flags.png
  }" alt = "country flag" width = "50">
  <span><strong>${name.official}</strong></span></div>
  <div ><strong>Capital:</strong> ${capital.join(', ')}</div>
  <div><strong>Population:</strong> ${population}</div>
  <div><strong>Languages:</strong> ${Object.values(languages)}</div>
  `;
}

function createMarkupCountryList(countries) {
clearInputSearch();
  return countries
    .map(country => {
      return `<li><div class="country-list_wrap"><img src = "${country.flags.png}" alt = "country flag" width="50">
  <span><strong>${country.name.common}</strong></span></div></li>`;
    })
    .join('');
}

function clearInputSearch() {
   refs.countryInfo.innerHTML = "";
   refs.countryList.innerHTML = "";
}





