/* ═══════════════════════════════════════════════════════════
   DROPLY — /api/youtube.js  (Vercel Serverless Function)
   Extrae URL de stream de audio de YouTube con ytdl-core.
   Soporta dos modos:
     GET /api/youtube?q=artista+cancion   → búsqueda (devuelve lista)
     GET /api/youtube?id=VIDEO_ID          → stream URL de un vídeo
═══════════════════════════════════════════════════════════ */

const ytdl = require("ytdl-core");
const https = require("https");

/* ── Helper: petición HTTPS sin dependencias extra ─────── */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, res => {
      let data = "";
      res.on("data", chunk => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    }).on("error", reject);
  });
}

/* ── Búsqueda YouTube: usa la YouTube Data API v3 ──────── */
async function searchYouTube(query) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY no configurada en variables de entorno Vercel");

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&videoCategoryId=10&q=${encodeURIComponent(query)}&key=${apiKey}`;
  const data = await httpsGet(url);

  if (data.error) throw new Error(data.error.message || "Error API YouTube");

  return (data.items || []).map(item => ({
    id:       item.id.videoId,
    title:    item.snippet.title,
    artist:   item.snippet.channelTitle,
    cover:    item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.medium?.url ||
              item.snippet.thumbnails?.default?.url || "",
    duration: ""   // la Search API no devuelve duración; se puede ampliar con videos.list
  }));
}

/* ── Stream URL: extrae con ytdl-core ──────────────────── */
async function getStreamUrl(videoId) {
  const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`, {
    requestOptions: {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9"
      }
    }
  });

  /* Prioridad: audio opus 128k → webm/ogg → mp4 */
  const formats = ytdl.filterFormats(info.formats, "audioonly");

  /* Ordenar: prefiere opus, luego mayor bitrate */
  formats.sort((a, b) => {
    const scoreA = (a.codecs?.includes("opus") ? 100 : 0) + (a.audioBitrate || 0);
    const scoreB = (b.codecs?.includes("opus") ? 100 : 0) + (b.audioBitrate || 0);
    return scoreB - scoreA;
  });

  if (!formats.length) throw new Error("No se encontró stream de audio para " + videoId);

  const fmt = formats[0];
  return {
    url:         fmt.url,
    mimeType:    fmt.mimeType || "audio/webm",
    bitrate:     fmt.audioBitrate,
    videoId,
    title:       info.videoDetails.title,
    artist:      info.videoDetails.author.name,
    cover:       info.videoDetails.thumbnails.slice(-1)[0]?.url || "",
    duration:    formatDuration(Number(info.videoDetails.lengthSeconds))
  };
}

function formatDuration(secs) {
  if (!secs) return "";
  const m = Math.floor(secs / 60);
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* ── Handler principal ──────────────────────────────────── */
module.exports = async function handler(req, res) {
  /* CORS para la misma origin (y dev local) */
  const origin = req.headers.origin || "";
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET")     return res.status(405).json({ error: "Método no permitido" });

  const { q, id } = req.query;

  try {
    /* ── Modo stream ── */
    if (id) {
      if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return res.status(400).json({ error: "ID de vídeo inválido" });
      }
      const stream = await getStreamUrl(id);
      return res.status(200).json({ ok: true, ...stream });
    }

    /* ── Modo búsqueda ── */
    if (q) {
      if (q.trim().length < 1) return res.status(400).json({ error: "Query vacía" });
      const results = await searchYouTube(q.trim());
      return res.status(200).json({ ok: true, results });
    }

    return res.status(400).json({ error: "Falta parámetro 'q' (búsqueda) o 'id' (stream)" });

  } catch (err) {
    console.error("[DROPLY YT API]", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
};