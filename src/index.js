/* eslint-disable no-plusplus */
import './style.scss';

let seconds = 0;
setInterval(() => {
  document.querySelector('#main').textContent = `You've been on this page for ${seconds++} seconds.`;
}, 1000);
