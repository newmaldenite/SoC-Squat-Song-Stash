import { addSong } from './supabase.js';

document.getElementById('songForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    song_title: document.getElementById('songTitle').value,
    user_name: document.getElementById('userName').value,
    bootcamp_number: parseInt(document.getElementById('bootcampNumber').value),
    youtube_link: document.getElementById('youtubeLink').value,
    notes: document.getElementById('notes').value
  };

  try {
    await addSong(formData);
    alert('Song added successfully!');
    e.target.reset();
  } catch (error) {
    alert('Error: ' + error.message);
  }
});