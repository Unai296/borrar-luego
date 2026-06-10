/* ═══════════════════════════════════════════════════════════
   DROPLY — youtube.js  (Módulo Frontend)
   Búsqueda YouTube + integración con el <audio> de script.js

   API pública (window.YouTubeSearch):
     .search(query)          → Promise<results[]>
     .playById(videoId, meta) → reproduce en el player existente
     .playResult(result)      → atajo: busca stream y reproduce

   Integración con script.js:
     – Llama a window.loadTrack(item) con el item construido
     – Crea items con type:"music", file: streamUrl, etc.
     – El <audio id="mainAudio"> ya gestiona todo lo demás
═══════════════════════════════════════════════════════════ */

(function (global) {
  "use strict";

  /* ── Configuración ────────────────────────────────────── */
  const API_BASE = "/api/youtube";

  /* ── Estado interno ───────────────────────────────────── */
  let _searchDebounceTimer = null;
  let _lastQuery = "";
  let _streamCache = {};       // videoId → { url, expires }
  const STREAM_TTL = 5 * 60 * 1000; // 5 min (los streams de YT expiran ~6h, pero refresco preventivo)

  /* ═══════════════════════════════════════════════════════
     CORE: peticiones al backend
  ═══════════════════════════════════════════════════════ */
  async function _apiFetch(params) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}?${qs}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || `Error ${res.status}`);
    }
    return res.json();
  }

  /* Búsqueda: devuelve array de resultados */
  async function search(query) {
    if (!query || !query.trim()) return [];
    const data = await _apiFetch({ q: query.trim() });
    return data.results || [];
  }

  /* Stream: obtiene URL de audio para un videoId */
  async function getStreamUrl(videoId) {
    const now = Date.now();
    const cached = _streamCache[videoId];
    if (cached && cached.expires > now) return cached;

    const data = await _apiFetch({ id: videoId });
    if (!data.ok) throw new Error(data.error || "No se pudo obtener el stream");

    const entry = {
      url:      data.url,
      mimeType: data.mimeType,
      bitrate:  data.bitrate,
      title:    data.title,
      artist:   data.artist,
      cover:    data.cover,
      duration: data.duration,
      expires:  now + STREAM_TTL
    };
    _streamCache[videoId] = entry;
    return entry;
  }

  /* ═══════════════════════════════════════════════════════
     REPRODUCCIÓN — integración con loadTrack de script.js
  ═══════════════════════════════════════════════════════ */
  async function playById(videoId, metaHint = {}) {
    _showYtLoading(true);
    try {
      const stream = await getStreamUrl(videoId);

      /* Construye un item compatible con loadTrack() de script.js */
      const item = {
        type:     "music",
        title:    metaHint.title  || stream.title  || "YouTube Track",
        artist:   metaHint.artist || stream.artist || "YouTube",
        cover:    metaHint.cover  || stream.cover  || "",
        file:     stream.url,           // URL directa del stream de audio
        category: "YouTube",
        duration: metaHint.duration || stream.duration || "",
        _ytId:    videoId               // guardado para posible re-fetch
      };

      /* loadTrack está definida en script.js — misma ventana */
      if (typeof global.loadTrack === "function") {
        global.loadTrack(item);
      } else {
        /* Fallback: poner directo en el <audio> */
        const audio = document.getElementById("mainAudio");
        if (audio) {
          audio.src = stream.url;
          audio.play().catch(() => {});
        }
      }

      /* Cierra el panel de búsqueda YT al reproducir */
      _closeYtPanel();
    } catch (err) {
      console.error("[DROPLY YT]", err);
      _showError(err.message);
    } finally {
      _showYtLoading(false);
    }
  }

  /* Atajo que recibe un resultado de búsqueda */
  async function playResult(result) {
    await playById(result.id, {
      title:  result.title,
      artist: result.artist,
      cover:  result.cover
    });
  }

  /* ═══════════════════════════════════════════════════════
     UI — Panel de búsqueda YouTube
  ═══════════════════════════════════════════════════════ */

  /* ── Inyecta el HTML del panel al DOM ──────────────────── */
  function _injectPanel() {
    if (document.getElementById("ytSearchPanel")) return;

    const panel = document.createElement("div");
    panel.id = "ytSearchPanel";
    panel.className = "yt-search-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Buscar en YouTube");
    panel.innerHTML = `
      <div class="yt-panel-inner">
        <!-- Header -->
        <div class="yt-panel-header">
          <button class="yt-panel-back" id="ytPanelBack" aria-label="Cerrar">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <h2 class="yt-panel-title">Buscar en YouTube</h2>
        </div>

        <!-- Search input -->
        <div class="yt-search-wrap">
          <svg class="yt-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
          </svg>
          <input
            type="text"
            id="ytSearchInput"
            class="yt-search-input"
            placeholder="Artista, canción…"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          />
          <button class="yt-search-clear" id="ytSearchClear" aria-label="Borrar" style="display:none">✕</button>
        </div>

        <!-- Estado: loading / error / results -->
        <div class="yt-status" id="ytStatus" style="display:none"></div>
        <div class="yt-loading" id="ytLoadingSpinner" style="display:none">
          <div class="yt-spinner"></div>
          <span>Buscando…</span>
        </div>

        <!-- Resultados -->
        <div class="yt-results" id="ytResults"></div>
      </div>
    `;
    document.body.appendChild(panel);

    /* Overlay de fondo */
    const overlay = document.createElement("div");
    overlay.id = "ytSearchOverlay";
    overlay.className = "yt-search-overlay";
    document.body.appendChild(overlay);

    _bindPanelEvents();
  }

  function _bindPanelEvents() {
    const input   = document.getElementById("ytSearchInput");
    const clearBtn = document.getElementById("ytSearchClear");
    const backBtn  = document.getElementById("ytPanelBack");
    const overlay  = document.getElementById("ytSearchOverlay");

    /* Cerrar */
    backBtn.addEventListener("click", _closeYtPanel);
    overlay.addEventListener("click", _closeYtPanel);

    /* Input con debounce 500ms */
    input.addEventListener("input", () => {
      const q = input.value.trim();
      clearBtn.style.display = q ? "" : "none";
      clearTimeout(_searchDebounceTimer);
      if (!q) { _clearResults(); return; }
      _searchDebounceTimer = setTimeout(() => _doSearch(q), 500);
    });

    /* Limpiar */
    clearBtn.addEventListener("click", () => {
      input.value = "";
      clearBtn.style.display = "none";
      _clearResults();
      input.focus();
    });

    /* Enter inmediato */
    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && input.value.trim()) {
        clearTimeout(_searchDebounceTimer);
        _doSearch(input.value.trim());
      }
      if (e.key === "Escape") _closeYtPanel();
    });
  }

  async function _doSearch(query) {
    if (query === _lastQuery) return;
    _lastQuery = query;
    _showSearching(true);
    _clearResults();
    try {
      const results = await search(query);
      _renderResults(results);
    } catch (err) {
      _showError(err.message);
    } finally {
      _showSearching(false);
    }
  }

  function _renderResults(results) {
    const container = document.getElementById("ytResults");
    if (!container) return;
    container.innerHTML = "";

    if (!results.length) {
      container.innerHTML = `<p class="yt-empty">Sin resultados. Prueba con otro término.</p>`;
      return;
    }

    results.forEach(r => {
      const row = document.createElement("div");
      row.className = "yt-result-row";
      row.innerHTML = `
        <div class="yt-result-thumb">
          <img src="${_escHtml(r.cover)}" alt="" onerror="this.style.display='none'" loading="lazy" />
          <div class="yt-result-play-overlay">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white" stroke="none"><polygon points="5,3 19,12 5,21"/></svg>
          </div>
        </div>
        <div class="yt-result-info">
          <span class="yt-result-title">${_escHtml(r.title)}</span>
          <span class="yt-result-artist">${_escHtml(r.artist)}</span>
        </div>
        <button class="yt-result-add-queue" data-id="${_escHtml(r.id)}" aria-label="Añadir a la cola" title="Añadir a la cola">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      `;

      /* Reproducir al pulsar el row */
      row.addEventListener("click", e => {
        if (e.target.closest(".yt-result-add-queue")) return;
        playResult(r);
      });

      /* Añadir a la cola sin reproducir */
      row.querySelector(".yt-result-add-queue").addEventListener("click", async e => {
        e.stopPropagation();
        const btn = e.currentTarget;
        btn.disabled = true;
        try {
          const stream = await getStreamUrl(r.id);
          const item = {
            type:     "music",
            title:    r.title  || stream.title,
            artist:   r.artist || stream.artist,
            cover:    r.cover  || stream.cover,
            file:     stream.url,
            category: "YouTube",
            duration: r.duration || stream.duration || "",
            _ytId:    r.id
          };
          if (typeof global.addToQueue === "function") {
            global.addToQueue(item);
            if (typeof global.showToast === "function") {
              global.showToast(`"${item.title}" añadida a la cola`, "success");
            }
          }
        } catch (err) {
          if (typeof global.showToast === "function") {
            global.showToast("Error al añadir: " + err.message, "error");
          }
        } finally {
          btn.disabled = false;
        }
      });

      container.appendChild(row);
    });
  }

  /* ── Helpers UI ────────────────────────────────────────── */
  function _showSearching(on) {
    const el = document.getElementById("ytLoadingSpinner");
    if (el) el.style.display = on ? "flex" : "none";
  }

  function _showYtLoading(on) {
    /* Muestra el spinner global de carga de stream */
    let el = document.getElementById("ytStreamLoading");
    if (!el) {
      el = document.createElement("div");
      el.id = "ytStreamLoading";
      el.className = "yt-stream-loading";
      el.innerHTML = `<div class="yt-spinner"></div><span>Cargando stream…</span>`;
      document.body.appendChild(el);
    }
    el.classList.toggle("visible", on);
  }

  function _showError(msg) {
    const el = document.getElementById("ytStatus");
    if (!el) return;
    el.style.display = "";
    el.className = "yt-status yt-status--error";
    el.textContent = "⚠ " + (msg || "Error desconocido");
    setTimeout(() => { if (el) el.style.display = "none"; }, 4000);
  }

  function _clearResults() {
    const el = document.getElementById("ytResults");
    if (el) el.innerHTML = "";
    const st = document.getElementById("ytStatus");
    if (st) st.style.display = "none";
    _lastQuery = "";
  }

  /* ── Abrir / cerrar panel ─────────────────────────────── */
  function openYtPanel() {
    _injectPanel();
    const panel   = document.getElementById("ytSearchPanel");
    const overlay = document.getElementById("ytSearchOverlay");
    panel?.classList.add("open");
    overlay?.classList.add("visible");
    /* Foco al input con pequeño delay para la animación */
    setTimeout(() => document.getElementById("ytSearchInput")?.focus(), 150);
  }

  function _closeYtPanel() {
    document.getElementById("ytSearchPanel")?.classList.remove("open");
    document.getElementById("ytSearchOverlay")?.classList.remove("visible");
  }

  function _escHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ═══════════════════════════════════════════════════════
     BOTÓN DE ENTRADA — añade icono YT en la topbar
  ═══════════════════════════════════════════════════════ */
  function _injectTopbarButton() {
    if (document.getElementById("ytTopbarBtn")) return;

    const actions = document.querySelector(".topbar-actions");
    if (!actions) return;

    const btn = document.createElement("button");
    btn.id = "ytTopbarBtn";
    btn.className = "topbar-icon-btn yt-topbar-btn";
    btn.setAttribute("aria-label", "Buscar en YouTube");
    btn.setAttribute("title", "Buscar en YouTube");
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" stroke-width="1.8"/>
        <polygon points="10,9 16,12 10,15" fill="currentColor"/>
      </svg>
    `;
    btn.addEventListener("click", openYtPanel);
    /* Insertar antes del primer botón existente */
    actions.insertBefore(btn, actions.firstChild);
  }

  /* ═══════════════════════════════════════════════════════
     CSS — inyecta estilos directamente (no requiere hoja externa)
  ═══════════════════════════════════════════════════════ */
  function _injectStyles() {
    if (document.getElementById("ytSearchStyles")) return;
    const style = document.createElement("style");
    style.id = "ytSearchStyles";
    style.textContent = `
      /* ── Panel ───────────────────────────────────────── */
      .yt-search-overlay {
        display: none;
        position: fixed; inset: 0;
        background: rgba(0,0,0,.55);
        z-index: 1100;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        opacity: 0;
        transition: opacity .25s ease;
      }
      .yt-search-overlay.visible {
        display: block; opacity: 1;
      }

      .yt-search-panel {
        position: fixed;
        inset: 0;
        z-index: 1101;
        background: #0e0e14;
        transform: translateY(100%);
        transition: transform .32s cubic-bezier(.4,0,.2,1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }
      .yt-search-panel.open {
        transform: translateY(0);
      }

      .yt-panel-inner {
        display: flex; flex-direction: column;
        height: 100%; overflow: hidden;
      }

      /* ── Header ─────────────────────────────────────── */
      .yt-panel-header {
        display: flex; align-items: center; gap: .75rem;
        padding: calc(env(safe-area-inset-top, 0px) + 1rem) 1rem .75rem;
        border-bottom: 1px solid rgba(255,255,255,.06);
        flex-shrink: 0;
      }
      .yt-panel-back {
        width: 36px; height: 36px;
        border: none; background: rgba(255,255,255,.06);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: #e2e2e2; cursor: pointer;
        transition: background .2s;
        flex-shrink: 0;
      }
      .yt-panel-back:hover { background: rgba(255,255,255,.12); }
      .yt-panel-title {
        font-size: 1.05rem; font-weight: 600;
        color: #f0f0f0; letter-spacing: -.02em;
        margin: 0;
      }

      /* ── Search input ────────────────────────────────── */
      .yt-search-wrap {
        display: flex; align-items: center; gap: .5rem;
        margin: .75rem 1rem;
        background: rgba(255,255,255,.07);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 12px;
        padding: .6rem .9rem;
        flex-shrink: 0;
        transition: border-color .2s;
      }
      .yt-search-wrap:focus-within {
        border-color: rgba(139,92,246,.5);
      }
      .yt-search-icon { color: #71717a; flex-shrink: 0; }
      .yt-search-input {
        flex: 1; background: none; border: none; outline: none;
        color: #f8f8f8; font-size: .95rem;
        font-family: inherit;
      }
      .yt-search-input::placeholder { color: #52525b; }
      .yt-search-clear {
        background: none; border: none;
        color: #71717a; cursor: pointer;
        font-size: .8rem; padding: .1rem;
        transition: color .15s;
      }
      .yt-search-clear:hover { color: #e2e2e2; }

      /* ── Loading / status ────────────────────────────── */
      .yt-loading {
        display: flex; align-items: center; gap: .75rem;
        padding: 1rem 1.2rem; color: #71717a; font-size: .88rem;
        flex-shrink: 0;
      }
      .yt-spinner {
        width: 18px; height: 18px;
        border: 2px solid rgba(139,92,246,.25);
        border-top-color: #8b5cf6;
        border-radius: 50%;
        animation: ytSpin .7s linear infinite;
        flex-shrink: 0;
      }
      @keyframes ytSpin { to { transform: rotate(360deg); } }

      .yt-status {
        margin: .25rem 1rem;
        padding: .55rem .9rem;
        border-radius: 8px;
        font-size: .85rem;
        flex-shrink: 0;
      }
      .yt-status--error {
        background: rgba(239,68,68,.12);
        color: #f87171;
        border: 1px solid rgba(239,68,68,.2);
      }

      /* ── Results ─────────────────────────────────────── */
      .yt-results {
        flex: 1; overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        padding: .25rem 0 4rem;
      }
      .yt-empty {
        color: #52525b; text-align: center;
        font-size: .88rem; padding: 2rem 1rem;
        margin: 0;
      }

      .yt-result-row {
        display: flex; align-items: center; gap: .9rem;
        padding: .65rem 1rem;
        cursor: pointer;
        transition: background .15s;
        border-radius: 0;
      }
      .yt-result-row:active,
      .yt-result-row:hover { background: rgba(255,255,255,.04); }

      .yt-result-thumb {
        width: 52px; height: 52px;
        border-radius: 8px; overflow: hidden;
        flex-shrink: 0; position: relative;
        background: #1a1a24;
      }
      .yt-result-thumb img {
        width: 100%; height: 100%; object-fit: cover;
        display: block;
      }
      .yt-result-play-overlay {
        position: absolute; inset: 0;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,.4);
        opacity: 0;
        transition: opacity .15s;
      }
      .yt-result-row:hover .yt-result-play-overlay,
      .yt-result-row:active .yt-result-play-overlay { opacity: 1; }

      .yt-result-info {
        flex: 1; min-width: 0;
        display: flex; flex-direction: column; gap: .2rem;
      }
      .yt-result-title {
        font-size: .9rem; font-weight: 500; color: #e2e2e2;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .yt-result-artist {
        font-size: .78rem; color: #71717a;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }

      .yt-result-add-queue {
        width: 32px; height: 32px; flex-shrink: 0;
        background: rgba(255,255,255,.06);
        border: none; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: #a1a1aa; cursor: pointer;
        transition: background .15s, color .15s;
      }
      .yt-result-add-queue:hover {
        background: rgba(139,92,246,.2); color: #c4b5fd;
      }
      .yt-result-add-queue:disabled { opacity: .4; cursor: default; }

      /* ── Stream loading overlay ──────────────────────── */
      .yt-stream-loading {
        display: none;
        position: fixed; inset: 0; z-index: 1200;
        background: rgba(8,8,8,.72);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        flex-direction: column; align-items: center; justify-content: center;
        gap: 1rem; color: #a1a1aa; font-size: .9rem;
      }
      .yt-stream-loading.visible { display: flex; }
      .yt-stream-loading .yt-spinner {
        width: 32px; height: 32px;
        border-width: 3px;
      }

      /* ── Topbar button ───────────────────────────────── */
      .yt-topbar-btn {
        color: #a1a1aa;
        transition: color .2s;
      }
      .yt-topbar-btn:hover { color: #c4b5fd; }
    `;
    document.head.appendChild(style);
  }

  /* ═══════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════ */
  function init() {
    _injectStyles();
    /* Espera al DOM si todavía no está listo */
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        _injectTopbarButton();
        _injectPanel();
      });
    } else {
      _injectTopbarButton();
      _injectPanel();
    }
  }

  init();

  /* ── API pública ─────────────────────────────────────── */
  global.YouTubeSearch = {
    search,
    getStreamUrl,
    playById,
    playResult,
    open: openYtPanel,
    close: _closeYtPanel
  };

})(window);