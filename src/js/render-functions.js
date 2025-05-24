import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images, append = false) {
  const markup = images
    .map(
      image => `
    <li class="gallery-item">
      <a href="${image.largeImageURL}">
        <img class="gallery-img" src="${image.webformatURL}" alt="${image.tags}" />
      </a>
      <ul class="info-list">
        <li class="info-item">Likes:<span> ${image.likes}</span></li>
        <li class="info-item">Views:<span> ${image.views}</span></li>
        <li class="info-item">Comments:<span> ${image.comments}</span></li>
        <li class="info-item">Downloads:<span> ${image.downloads}</span></li>
      </ul>
    </li>`
    )
    .join('');

  if (append) {
    galleryContainer.insertAdjacentHTML('beforeend', markup);
  } else {
    galleryContainer.innerHTML = markup;
  }

  lightbox.refresh();
}

export function clearGallery() {
  galleryContainer.innerHTML = '';
}

export function showLoader() {
  loader.classList.add('visible');
}

export function hideLoader() {
  loader.classList.remove('visible');
}

export function showLoadMoreBtn() {
  const buttonMore = document.querySelector('.btn-more');
  if (buttonMore) buttonMore.style.display = 'block';
}

export function hideLoadMoreBtn() {
  const buttonMore = document.querySelector('.btn-more');
  if (buttonMore) buttonMore.style.display = 'none';
}
