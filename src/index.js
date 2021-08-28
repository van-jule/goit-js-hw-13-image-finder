import './sass/main.scss';
import fetchImage from './apiService';

const refs = {
  container: document.querySelector('.container'),
  gallery: document.querySelector('.gallery'),
  searchBtn: undefined,
  searchForm: undefined,
  loadMoreBtn: undefined,
};

let page = 1;
let searchValue = '';

renderForm();
refs.searchForm = document.querySelector('#search-form');
refs.searchForm.addEventListener('submit', onSearch);

function renderForm() {
  const form = `<form class="search-form" id="search-form">
      <input class ="search__input" type="text" name="query" autocomplete="off" placeholder="Search images..." />
      <button type="submit" class="search__button">SEARCH</button>
    </form>`;

  refs.container.insertAdjacentHTML('afterbegin', form);
}

function onSearch(e) {
  e.preventDefault();

  if (searchValue === e.currentTarget.elements.query.value.trim()) {
    console.log(' Ви питаетесь отправить дважди один запрос');
    return;
  }

  searchValue = e.currentTarget.elements.query.value.trim();
  e.currentTarget.elements.query.value = '';
  page = 1;

  if (!searchValue) return;

  if (refs.gallery.children.length) {
    refs.gallery.innerHTML = '';
    refs.loadMoreBtn.remove();
  }

  fetchImage(searchValue, page)
    .then(images => {
      showImages(images);
    })
    .then(() => {
      addLoadMoreBtn();
    })
    .then(() => {
      if (!refs.gallery.children.length) {
        refs.gallery.innerHTML = `<p class="text-no-search">No results :(</p>`;
        if (refs.loadMoreBtn) {
          refs.loadMoreBtn.remove();
        }
      }
    })
    .catch(err => console.log(err));
}

function showImages({ hits }) {
  const list = hits
    .map(
      ({ webformatURL, likes, views, comments, downloads, tags }) => `
<li class="gallery__item" data-page = '${page}'>

<div class="gallery__img-wrapper">
  <img class="gallery__img" src="${webformatURL}" alt="${tags}" />
</div>

  <div class="stats">
    <p class="stats-item">
      <i class="material-icons">thumb_up</i>
      ${likes}
    </p>
    <p class="stats-item">
      <i class="material-icons">visibility</i>
      ${views}
    </p>
    <p class="stats-item">
      <i class="material-icons">comment</i>
      ${comments}
    </p>
    <p class="stats-item">
      <i class="material-icons">cloud_download</i>
      ${downloads}
    </p>
  </div>
</li>`,
    )
    .join(' ');

  refs.gallery.insertAdjacentHTML('beforeend', list);
}

function onLoadMoreClick(e) {
  page += 1;

  fetchImage(searchValue, page)
    .then(images => showImages(images))
    .then(scrollToNewImages)
    .catch(err => console.log(err));
}

function addLoadMoreBtn() {
  refs.gallery.insertAdjacentHTML(
    'afterend',
    `<button class="load-more-button">Load more</button>`,
  );
  refs.loadMoreBtn = document.querySelector('.load-more-button');
  refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
}

function scrollToNewImages() {
  let newImages = document.querySelector(`[data-page='${page}']`);
  newImages.scrollIntoView({ block: 'start', behavior: 'smooth' });
}
