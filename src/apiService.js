const BASE_URL = 'https://pixabay.com/api/';
const KEY = '22993210-edd192b19fd9d2ee0b0d8e9c4';

function fetchImage(value, page) {
  return fetch(
    `${BASE_URL}?image_type=photo&orientation=horizontal&q=${value}&page=${page}&per_page=12&key=${KEY}`,
  ).then(response => {
    return response.json();
  });
}

export default fetchImage;
