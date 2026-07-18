import { YoutubeTranscript } from 'youtube-transcript';

// Helper: extract 11-char YouTube video ID from any format
const extractYtId = (raw) => {
  if (!raw) return null;
  raw = raw.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /\/embed\/([A-Za-z0-9_-]{11})/,
    /\/shorts\/([A-Za-z0-9_-]{11})/,
    /\/v\/([A-Za-z0-9_-]{11})/,
    /\/watch\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = raw.match(p);
    if (m) return m[1];
  }
  return raw;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const payload = req.body;

    // ─── Mode A: client sends pre-parsed cues, just translate ───
    if (payload.cues && Array.isArray(payload.cues)) {
      const cuesToTranslate = payload.cues;
      for (let i = 0; i < cuesToTranslate.length; i++) {
        const cue = cuesToTranslate[i];
        try {
          const transRes = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cue.en)}&langpair=en|es`
          );
          if (transRes.ok) {
            const transData = await transRes.json();
            cue.es = transData.responseData?.translatedText || cue.en;
          } else { cue.es = cue.en; }
        } catch { cue.es = cue.en; }
        await new Promise(r => setTimeout(r, 60));
      }
      return res.status(200).json({ success: true, subtitles: cuesToTranslate });
    }

    // ─── Mode B: fetch full transcript from YouTube ───
    const { videoId: rawVideoId } = payload;
    if (!rawVideoId) {
      return res.status(400).json({ error: 'Missing videoId or cues' });
    }
    const videoId = extractYtId(rawVideoId);

    // Try English first, then Spanish, then auto-detect
    let rawCues = null;
    let sourceLang = 'en';

    try {
      rawCues = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
      sourceLang = 'en';
    } catch {
      try {
        rawCues = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'es' });
        sourceLang = 'es';
      } catch {
        try {
          rawCues = await YoutubeTranscript.fetchTranscript(videoId);
          const sample = (rawCues[0]?.text || '').trim();
          if (/[\u4e00-\u9fff]/.test(sample)) sourceLang = 'zh-CN';
          else if (/[\uac00-\ud7af]/.test(sample)) sourceLang = 'ko';
          else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(sample)) sourceLang = 'ja';
          else if (/[\u0400-\u04ff]/.test(sample)) sourceLang = 'ru';
          else if (/[\u0600-\u06ff]/.test(sample)) sourceLang = 'ar';
          else sourceLang = 'en';
        } catch {
          return res.status(500).json({ error: 'No se encontraron subtítulos disponibles para este video.' });
        }
      }
    }

    if (!rawCues || rawCues.length === 0) {
      return res.status(500).json({ error: 'No se encontraron subtítulos disponibles.' });
    }

    const parsedCues = rawCues.map((cue, index) => ({
      id: index + 1,
      start: parseFloat((cue.offset / 1000).toFixed(2)),
      end: parseFloat(((cue.offset + cue.duration) / 1000).toFixed(2)),
      en: cue.text.replace(/\s+/g, ' ').trim(),
      es: ''
    }));

    const cuesToTranslate = parsedCues.slice(0, 35);
    const isSpanish = sourceLang === 'es';
    const isEnglish = sourceLang === 'en';

    for (let i = 0; i < cuesToTranslate.length; i++) {
      const cue = cuesToTranslate[i];
      const originalText = cue.en;
      try {
        if (isSpanish) {
          cue.es = originalText;
          const enRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(originalText)}&langpair=es|en`);
          if (enRes.ok) {
            const enData = await enRes.json();
            cue.en = enData.responseData?.translatedText || originalText;
          }
        } else if (isEnglish) {
          const esRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(originalText)}&langpair=en|es`);
          if (esRes.ok) {
            const esData = await esRes.json();
            cue.es = esData.responseData?.translatedText || originalText;
          } else { cue.es = originalText; }
        } else {
          const esRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(originalText)}&langpair=${sourceLang}|es`);
          if (esRes.ok) {
            const esData = await esRes.json();
            cue.es = esData.responseData?.translatedText || originalText;
          } else { cue.es = originalText; }
          await new Promise(r => setTimeout(r, 40));
          const enRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(originalText)}&langpair=${sourceLang}|en`);
          if (enRes.ok) {
            const enData = await enRes.json();
            cue.en = enData.responseData?.translatedText || originalText;
          }
        }
      } catch { cue.es = originalText; }
      await new Promise(r => setTimeout(r, 60));
    }

    return res.status(200).json({ success: true, subtitles: cuesToTranslate });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
