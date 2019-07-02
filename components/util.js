/* eslint-disable global-require */
/* eslint-disable spaced-comment */
/* eslint-disable linebreak-style */
/* eslint-disable import/prefer-default-export */


//Convert weeks number into string
// 0 Sun - 6 Sat
export function dayOfTheWeek(number) {
  if (number === 1) {
    return 'MONDAY';
  }
  if (number === 2) {
    return 'TUESDAY';
  }
  if (number === 3) {
    return 'WEDNESDAY';
  }
  if (number === 4) {
    return 'THURSDAY';
  }
  if (number === 5) {
    return 'FRIDAY';
  }
  if (number === 6) {
    return 'SATURDAY';
  }
  if (number === 0 || number === 7) {
    return 'SUNDAY';
  }
  return '';
}

export function iconHandler(icon) {
  if (icon == '01d') {
    return require('../assets/sun.png');
  }
  if (icon == '01n') {
    return require('../assets/moon.png');
  }
  if (icon == '02d') {
    return require('../assets/sun&cloud.png');
  }
  if (icon == '02n'|| icon == '03d' || icon == '03n' || icon == '04d' || icon == '04n') {
    return require('../assets/clouds.png');
  }
  if (icon == '09d' || icon == '09n' || icon == '10d' || icon == '10n') {
    return require('../assets/rain.png');
  }
  if (icon == '11d' || icon == '11n') {
    return require('../assets/storm.png');
  }
  if (icon == '13d' || icon == '13n') {
    return require('../assets/snow.png');
  }
  if (icon == '50d' || icon == '50n') {
    return require('../assets/mist.png');
  }
  return '';
}

export function checkIfObj(params) {
  return typeof params == 'object' && params instanceof Object && !(params instanceof Array)
}

export function objToQueryString(obj) {
  const keyValuePairs = [];
  for (const key in obj) {
      keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return keyValuePairs.join('&');
}

export function getApiData(url, params) {
  if (params) {
      if (checkIfObj(params)) {
          const queryString = objToQueryString(params);
          url = `${url}?${queryString}`;
          console.log(url);
      } else {
          console.error('Parameters error.', 'Parameters need to be send as plain object.');
          return;
      }
  }

  return fetch(url)
      .then(response => {
          if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' + response.status);
              return {
                  error: 'Bad request'
              };
          }

          return response.json();
      })
      .then(data => data)
      .catch(error => console.log(error));
}

export function generateBoxes(boxes) {
  const Boxes = boxes.slice(0);
  return Boxes;
}



