import { getGallery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const buttonMore = document.querySelector('.btn-more');
const loader = document.querySelector('.loader');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
buttonMore.style.display = 'none';

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = form.elements['search-text'].value.trim();
  currentQuery = query;
  currentPage = 1;
  totalHits = 0;
buttonMore.style.display = 'none';
  
  
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
      return;
    }

    createGallery(data.hits);
  
  
    if (totalHits > currentPage * 15) {
      buttonMore.style.display = 'block';
    }
  }
  catch (error) {
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
    
    const totalPages = Math.ceil(totalHits / 15);
    if (currentPage >= totalPages) {
      buttonMore.style.display = 'none';
      iziToast.info({
        title: 'Info',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
    }

  } catch (err) {
    iziToast.error({ title: 'Error', message: 'Failed to load more' });
  } finally {
    hideLoader();
  }
});

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery-item')
    .getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}