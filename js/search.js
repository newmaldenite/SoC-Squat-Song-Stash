import { getSongs, getRandomSong } from './supabase.js';

const bootcampFilter = document.getElementById('bootcampFilter');
const searchType = document.getElementById('searchType');
const searchInput = document.getElementById('searchInput');
const randomSongBtn = document.getElementById('randomSong');
const resultsContainer = document.getElementById('searchResults');

// Initialize bootcamp filter options
const initializeBootcamps = async () => {
  const songs = await getSongs();
  const bootcamps = [...new Set(songs.map(song => song.bootcamp_number))].sort((a, b) => a - b);
  
  bootcamps.forEach(number => {
    const option = document.createElement('option');
    option.value = number;
    option.textContent = `Bootcamp ${number}`;
    bootcampFilter.appendChild(option);
  });
};

const displaySongs = (songs) => {
  resultsContainer.innerHTML = '';
  
  songs.forEach(song => {
    const songCard = document.createElement('div');
    songCard.className = 'song-card';
    songCard.innerHTML = `
      <h3>${song.song_title}</h3>
      <p><strong>Added by:</strong> ${song.user_name}</p>
      <p><strong>Bootcamp:</strong> ${song.bootcamp_number}</p>
      <p><strong>Notes:</strong> ${song.notes}</p>
      <p><a href="${song.youtube_link}" target="_blank">Watch on YouTube</a></p>
    `;
    resultsContainer.appendChild(songCard);
  });
};

// Event listeners
const handleSearch = async () => {
  const bootcamp = bootcampFilter.value;
  const searchBy = searchType.value;
  const term = searchInput.value;
  
  try {
    const songs = await getSongs(bootcamp, searchBy, term);
    displaySongs(songs);
  } catch (error) {
    alert('Error searching songs: ' + error.message);
  }
};

randomSongBtn.addEventListener('click', async () => {
  try {
    const song = await getRandomSong(bootcampFilter.value);
    if (song) {
      displaySongs([song]);
    } else {
      resultsContainer.innerHTML = '<p>No songs found for selected bootcamp.</p>';
    }
  } catch (error) {
    alert('Error getting random song: ' + error.message);
  }
});

bootcampFilter.addEventListener('change', handleSearch);
searchType.addEventListener('change', handleSearch);
searchInput.addEventListener('input', handleSearch);

// Initialize the page
initializeBootcamps().catch(error => {
  alert('Error loading bootcamps: ' + error.message);
});