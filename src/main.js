import { getGallery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const buttonMore = document.querySelector('.btn-more');
const loader = document.querySelector('.loader');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

hideLoadMoreBtn();

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = form.elements['search-text'].value.trim();
  currentQuery = query;
  currentPage = 1;
  totalHits = 0;

  hideLoadMoreBtn();
  clearGallery();
  showLoader();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term.',
      position: 'topRight',
    });
    hideLoader();
    return;
  }

  try {
    const data = await getGallery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'No results',
        message: 'Sorry, nothing found for your query.',
        position: 'topRight',
      });
      clearGallery();
      return;
    }

    createGallery(data.hits);

    if (data.hits.length === 15 && data.totalHits > 15) {
      showLoadMoreBtn();
    }

  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

buttonMore.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();

  try {
    const data = await getGallery(currentQuery, currentPage);
    createGallery(data.hits, true);
    smoothScroll();

    const totalLoaded = document.querySelectorAll('.gallery-item').length;
    if (totalLoaded >= totalHits) {
      hideLoadMoreBtn();
      iziToast.info({
        title: 'Info',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
    }

  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

function smoothScroll() {
  const firstCard = document.querySelector('.gallery-item');
  if (!firstCard) return;

  const { height: cardHeight } = firstCard.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
