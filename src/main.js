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
const galleryContainer = document.querySelector('.gallery');

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
      clearGallery();
      iziToast.info({
        title: 'No results',
        message: 'Sorry, nothing found for your query.',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

   
    const totalDisplayedImages = document.querySelectorAll
