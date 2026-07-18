// src/store/subtitles.js

export async function loadSubtitles(videoId) {
  const response = await fetch(`/subtitles/${videoId}.json`);
  if (!response.ok) {
    throw new Error('Failed to load subtitles');
  }
  return await response.json();
}

export async function saveSubtitles(videoId, subtitles) {
  const response = await fetch('/api/save-subtitles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ videoId, subtitles }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save subtitles');
  }
  return await response.json();
}
