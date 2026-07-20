import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing in environment variables. Please check your .env file.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);

// Fallback presets if DB is not seeded yet or offline
const defaultVideoCatalog = [
  {
    id: 'UF8uR6Z6KLc',
    type: 'youtube',
    title: 'Discurso de Steve Jobs en Stanford',
    url: 'UF8uR6Z6KLc',
    category: 'Discursos / Educación',
    emoji: '🎓',
    thumbnail: 'https://img.youtube.com/vi/UF8uR6Z6KLc/hqdefault.jpg'
  },
  {
    id: 'LEjhYkp8P5M',
    type: 'youtube',
    title: 'Inside Out 2 (Intensa-Mente 2) - Tráiler',
    url: 'LEjhYkp8P5M',
    category: 'Animación / Comedia',
    emoji: '🎬',
    thumbnail: 'https://img.youtube.com/vi/LEjhYkp8P5M/hqdefault.jpg'
  },
  {
    id: 'hLAWN2_Z418',
    type: 'youtube',
    title: 'La Casa de Papel - Tráiler Bilingüe',
    url: 'hLAWN2_Z418',
    category: 'Series / Drama',
    emoji: '🇪🇸',
    thumbnail: 'https://img.youtube.com/vi/hLAWN2_Z418/hqdefault.jpg'
  },
  {
    id: 'local',
    type: 'local',
    title: 'Sintel - Cortometraje de Fantasía',
    url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    category: 'Fantasía / Animación',
    emoji: '🐲',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800'
  }
];

export async function getCatalog() {
  try {
    const { data, error } = await supabase
      .from('video_catalog')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      return data;
    }

    // Auto-seed database if empty
    console.log("Database catalog is empty. Seeding defaults...");
    await seedCatalog();
    return defaultVideoCatalog;
  } catch (err) {
    console.error("Failed to fetch catalog from Supabase, returning default fallback:", err.message);
    return defaultVideoCatalog;
  }
}

async function seedCatalog() {
  try {
    const { error } = await supabase
      .from('video_catalog')
      .insert(defaultVideoCatalog.map(item => ({
        id: item.id,
        title: item.title,
        url: item.url,
        type: item.type,
        category: item.category,
        emoji: item.emoji,
        thumbnail: item.thumbnail
      })));
    if (error) throw error;
    console.log("Successfully seeded default catalog into Supabase.");
  } catch (err) {
    console.error("Seeding catalog failed:", err.message);
  }
}

export async function saveVideoToCatalog(video) {
  const { data, error } = await supabase
    .from('video_catalog')
    .upsert({
      id: video.id,
      title: video.title,
      url: video.url,
      type: video.type,
      category: video.category,
      emoji: video.emoji,
      thumbnail: video.thumbnail || ''
    });

  if (error) throw error;
  return data;
}

export async function deleteVideoFromCatalog(videoId) {
  const { data, error } = await supabase
    .from('video_catalog')
    .delete()
    .eq('id', videoId);

  if (error) throw error;
  return data;
}

export async function loadSubtitles(videoId) {
  // 1. Try local storage cache first
  try {
    const cached = localStorage.getItem(`mentora_subtitles_${videoId}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn("Failed to read from localStorage:", e);
  }

  // 2. Fetch from Supabase
  try {
    const { data, error } = await supabase
      .from('video_subtitles')
      .select('subtitles')
      .eq('video_id', videoId)
      .single();

    if (error) {
      // PGRST116 is code for no rows returned
      if (error.code !== 'PGRST116') throw error;
    }

    if (data && data.subtitles) {
      // Cache locally
      try {
        localStorage.setItem(`mentora_subtitles_${videoId}`, JSON.stringify(data.subtitles));
      } catch (e) {}
      return data.subtitles;
    }
  } catch (err) {
    console.error(`Failed to load subtitles from Supabase for ${videoId}:`, err.message);
  }

  // 3. Fallback to public directory JSON file
  try {
    const response = await fetch(`/subtitles/${videoId}.json?t=${Date.now()}`);
    if (response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) {
        const data = await response.json();
        if (Array.isArray(data)) {
          // Cache locally
          try {
            localStorage.setItem(`mentora_subtitles_${videoId}`, JSON.stringify(data));
          } catch (e) {}
          return data;
        }
      }
    }
  } catch (err) {
    console.warn(`No static subtitle file found for ${videoId}:`, err.message);
  }

  return [];
}

export async function saveSubtitles(videoId, subtitles) {
  // 1. Save to local storage first
  try {
    localStorage.setItem(`mentora_subtitles_${videoId}`, JSON.stringify(subtitles));
  } catch (e) {
    console.warn("Failed to write to localStorage:", e);
  }

  // 2. Save to Supabase
  const { data, error } = await supabase
    .from('video_subtitles')
    .upsert({
      video_id: videoId,
      subtitles: subtitles,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error("Supabase subtitle save failed:", error.message);
    throw error;
  }
  return data;
}
