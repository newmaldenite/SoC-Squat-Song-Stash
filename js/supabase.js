import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Data validation helpers
export const validateSong = (data) => {
  const errors = [];

  if (!data.song_title?.trim()) {
    errors.push('Song title is required');
  }

  if (!data.user_name?.trim()) {
    errors.push('User name is required');
  }

  if (!data.bootcamp_number || isNaN(data.bootcamp_number)) {
    errors.push('Valid bootcamp number is required');
  }

  if (!data.youtube_link?.trim() || !isValidUrl(data.youtube_link)) {
    errors.push('Valid YouTube URL is required');
  }

  if (!data.notes?.trim()) {
    errors.push('Notes are required');
  }

  return errors;
};

const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be');
  } catch {
    return false;
  }
};

// Database operations
export const addSong = async (songData) => {
  const errors = validateSong(songData);
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  const { data, error } = await supabase
    .from('songs')
    .insert([songData])
    .select();

  if (error) throw error;
  return data;
};

export const getSongs = async (bootcamp = 'all', searchType = 'song_title', searchTerm = '') => {
  let query = supabase
    .from('songs')
    .select('*');

  if (bootcamp !== 'all') {
    query = query.eq('bootcamp_number', bootcamp);
  }

  if (searchTerm) {
    query = query.ilike(searchType, `%${searchTerm}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getRandomSong = async (bootcamp = 'all') => {
  let query = supabase
    .from('songs')
    .select('*');

  if (bootcamp !== 'all') {
    query = query.eq('bootcamp_number', bootcamp);
  }

  const { data, error } = await query;
  if (error) throw error;

  if (data.length === 0) return null;
  return data[Math.floor(Math.random() * data.length)];
};