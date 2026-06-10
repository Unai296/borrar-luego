/* ═══════════════════════════════════════════════════════════
   DROPLY — radio.js  v1.0
   Motor de Radio Infinita y Recomendaciones Inteligentes

   Características:
   · Algoritmo de scoring multi-dimensión (categoría, artista,
     energía estimada, novedad, diversidad)
   · "Radio mode" — una vez que la cola se vacía, Droply
     genera automáticamente pistas similares sin fin
   · Evita repeticiones recientes con ventana deslizante
   · Panel de radio accesible desde la cola
   · Persiste preferencias de radio en localStorage

   Integración:
   Incluir DESPUÉS de script.js y crossfade.js:
     <script src="radio.js"></script>

   Parchea _getSimilarTracks y _autoFillQueue para mejorar
   las recomendaciones sin romper nada existente.
═══════════════════════════════════════════════════════════ */

(function DroplyRadio() {
  'use strict';

  const STORAGE_KEY = 'droply_radio_cfg';
  const DEFAULT_CFG = { radioMode: false, diversity: 0.5 };

  let cfg = DEFAULT_CFG;
  function loadCfg() {
    try { cfg = { ...DEFAULT_CFG, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
    catch(_) { cfg = { ...DEFAULT_CFG }; }
  }
  function saveCfg() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); } catch(_) {}
  }
  loadCfg();

  /* ── Tabla de energía por categoría ──────────────────────── */
  /* Valores estimados 0–10. Sirven para no poner siempre tracks
     del mismo tempo/energía en la cola — más variedad. */
  const ENERGY = {
    'Electronic':  9,
    'Dance-Pop':   8,
    'Reggaeton':   8,
    '90s':         7,
    'Pop':         6,
    'Catalanes':   5,
    'Hip-Hop':     7,
    'Jazz':        4,
    'Lo-Fi':       3,
    'House':       9,
    'No se':       6,
  };

  function energy(cat) { return ENERGY[cat] ?? 6; }

  /* ── Algoritmo de scoring mejorado ──────────────────────── */
  /*
    Dimensiones de scoring (suma → mayor = más relevante):

    1. CATEGORÍA (+4)   — misma categoría que la seed
    2. ARTISTA   (+3)   — mismo artista (o artista compartido)
    3. ENERGY    (+2)   — energía similar (±2 puntos de diferencia)
    4. POPULARIDAD (+1) — más veces reproducida (playCounts)
    5. NOVEDAD   (+1.5) — poca o ninguna reproducción reciente
    6. DIVERSIDAD(+rnd) — ruido controlado por cfg.diversity
                          para que no siempre salgan los mismos

    PENALIZACIÓN: track ya en historial reciente → -10 (exclusión)
  */
  function scoredTracks(seedItem, recentSet) {
    if (!seedItem) return [];

    const allMusic = (typeof media !== 'undefined') ? media.filter(m => m.type === 'music') : [];
    const pc       = (typeof playCounts !== 'undefined') ? playCounts : {};
    const seedEnergy = energy(seedItem.category);
    const seedArtistWords = (seedItem.artist || '').toLowerCase().split(/[\s,&/+]+/).filter(w => w.length > 2);

    return allMusic
      .filter(m => !recentSet.has(m.file))
      .map(m => {
        let score = 0;

        /* 1. Misma categoría */
        if (m.category === seedItem.category) score += 4;

        /* 2. Artista compartido */
        if (m.artist === seedItem.artist) {
          score += 3;
        } else {
          const mArtistWords = (m.artist || '').toLowerCase().split(/[\s,&/+]+/).filter(w => w.length > 2);
          const overlap = seedArtistWords.filter(w => mArtistWords.includes(w)).length;
          score += Math.min(overlap * 1.2, 2.5);
        }

        /* 3. Energía similar */
        const energyDiff = Math.abs(energy(m.category) - seedEnergy);
        if (energyDiff <= 1) score += 2;
        else if (energyDiff <= 2) score += 1;

        /* 4. Popularidad (play count normalizado) */
        const plays = pc[m.file] || 0;
        score += Math.min(plays * 0.15, 1);

        /* 5. Novedad — bonificar tracks poco escuchados */
        if (plays === 0) score += 1.5;
        else if (plays < 3) score += 0.8;

        /* 6. Diversidad (ruido controlado) */
        score += Math.random() * cfg.diversity * 3;

        return { track: m, score };
      })
      .sort((a, b) => b.score - a.score);
  }

  /* ── Parchear _getSimilarTracks ──────────────────────────── */
  /* La función original existe en scope de script.js,
     pero podemos sobrescribir window._getSimilarTracks si
     la exportamos, o parchear en el closure con asignación.
     Dado que la función no es window.xxx, usamos otro approach:
     exponemos nuestra versión mejorada y parchamos _autoFillQueue */

  window._droplyRadioGetSimilar = function(seedItem, count = 3, recentFiles = null) {
    if (!seedItem) return [];
    const recent = recentFiles || _buildRecentSet();
    return scoredTracks(seedItem, recent)
      .slice(0, count)
      .map(s => s.track);
  };

  /* Helper para construir el set de recientes */
  function _buildRecentSet(n = 20) {
    const recent = new Set();
    // Current track
    if (typeof playlist !== 'undefined' && typeof currentTrackIdx !== 'undefined') {
      const cur = playlist[currentTrackIdx];
      if (cur) recent.add(cur.file);
    }
    // Queue
    if (typeof queue !== 'undefined') queue.forEach(f => recent.add(f));
    // History
    if (typeof historyTracks !== 'undefined') {
      historyTracks.slice(0, n).forEach(h => recent.add(h.file));
    }
    return recent;
  }

  /* ── Parchear _autoFillQueue ─────────────────────────────── */
  window._droplyRadioAutoFill = function() {
    const QUEUE_MIN = 3;
    const QUEUE_MAX = 12;

    if (typeof queue === 'undefined') return;
    if (queue.length >= QUEUE_MIN && !cfg.radioMode) return;

    const hint = document.getElementById('queueInfiniteHint');
    const seed = (typeof playlist !== 'undefined' && typeof currentTrackIdx !== 'undefined')
      ? playlist[currentTrackIdx]
      : null;
    const seedFromQueue = (typeof queue !== 'undefined' && queue.length > 0 && typeof getTrackByFile !== 'undefined')
      ? getTrackByFile(queue[queue.length - 1])
      : null;
    const finalSeed = seed || seedFromQueue;
    if (!finalSeed) return;

    /* En radio mode, siempre rellenar hasta MAX */
    const target = cfg.radioMode ? QUEUE_MAX : QUEUE_MIN + 2;
    const needed = Math.max(0, target - queue.length);
    if (needed === 0) return;

    const recent   = _buildRecentSet(20);
    const similar  = scoredTracks(finalSeed, recent).slice(0, needed).map(s => s.track);
    if (similar.length === 0) return;

    similar.forEach(t => {
      if (queue.length < QUEUE_MAX) queue.push(t.file);
    });

    if (typeof saveQueue === 'function') saveQueue();
    if (typeof renderQueueList === 'function') renderQueueList();

    if (hint && similar.length > 0) {
      hint.style.display = 'flex';
      setTimeout(() => { if (hint) hint.style.display = 'none'; }, 3500);
    }
  };

  /* ── Sobreescribir las funciones en window scope ──────────── */
  /* NOTA: _autoFillQueue está definida en script.js con let/const
     en su IIFE o función. No podemos sobrescribirla directamente.
     En cambio, parchamos el intervalo que la llama y los puntos
     donde se invoca desde renderQueueList con un proxy en window. */

  /* Parchear renderQueueList para usar nuestro autoFill al final */
  const _origRenderQueueList = window.renderQueueList;
  if (typeof _origRenderQueueList === 'function') {
    window.renderQueueList = function() {
      _origRenderQueueList.apply(this, arguments);
      /* Reemplazar el setTimeout interno con nuestra versión */
      setTimeout(window._droplyRadioAutoFill, 250);
    };
  }

  /* ── Panel de Radio en la cola ────────────────────────────── */
  function _injectRadioPanel() {
    const queueHeader = document.querySelector('.queue-panel-header');
    if (!queueHeader) return;
    if (document.getElementById('radioPanel')) return;

    const panel = document.createElement('div');
    panel.id        = 'radioPanel';
    panel.className = 'radio-panel';
    panel.innerHTML = `
      <div class="radio-panel-inner">
        <div class="radio-row">
          <div class="radio-label-wrap">
            <svg viewBox="0 0 24 24" width="16" height="16" class="radio-icon">
              <path d="M2 20h20M5 20V10l7-7 7 7v10"/>
              <path d="M12 13v7M9 20v-4h6v4" opacity=".5"/>
              <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
            <div>
              <span class="radio-label-text">Radio Infinita</span>
              <span class="radio-label-sub">Genera similares automáticamente</span>
            </div>
          </div>
          <label class="radio-toggle" for="radioModeEnabled">
            <input type="checkbox" id="radioModeEnabled" ${cfg.radioMode ? 'checked' : ''} />
            <span class="radio-toggle-knob"></span>
          </label>
        </div>
        <div class="radio-diversity-row" id="radioDiversityRow">
          <span class="radio-div-label">Variedad</span>
          <div class="radio-div-pills">
            <button class="radio-div-pill ${cfg.diversity <= 0.2 ? 'active' : ''}" data-val="0.1">Artista</button>
            <button class="radio-div-pill ${cfg.diversity > 0.2 && cfg.diversity <= 0.6 ? 'active' : ''}" data-val="0.5">Mixto</button>
            <button class="radio-div-pill ${cfg.diversity > 0.6 ? 'active' : ''}" data-val="0.9">Descubrir</button>
          </div>
        </div>
      </div>`;

    /* Insertar después del header de la cola */
    queueHeader.insertAdjacentElement('afterend', panel);

    /* Eventos */
    const chk = document.getElementById('radioModeEnabled');
    chk.addEventListener('change', () => {
      cfg.radioMode = chk.checked;
      saveCfg();
      if (cfg.radioMode) {
        window._droplyRadioAutoFill();
        if (typeof showToast === 'function') showToast('Radio infinita activada', 'success');
      }
    });

    panel.querySelectorAll('.radio-div-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        panel.querySelectorAll('.radio-div-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        cfg.diversity = parseFloat(btn.dataset.val);
        saveCfg();
      });
    });
  }

  /* ── Estilos del panel ────────────────────────────────────── */
  function _injectStyles() {
    if (document.getElementById('radioStyles')) return;
    const style = document.createElement('style');
    style.id = 'radioStyles';
    style.textContent = `
/* ── Radio Panel ─────────────────────────── */
.radio-panel {
  margin: 0 1rem .8rem;
}
.radio-panel-inner {
  background: rgba(139,92,246,.07);
  border: 1px solid rgba(139,92,246,.18);
  border-radius: 14px;
  padding: .8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: .7rem;
}
.radio-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .6rem;
}
.radio-label-wrap {
  display: flex;
  align-items: center;
  gap: .55rem;
  min-width: 0;
}
.radio-icon {
  color: var(--accent);
  flex-shrink: 0;
}
.radio-label-text {
  display: block;
  font-size: .82rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: .01em;
}
.radio-label-sub {
  display: block;
  font-size: .7rem;
  color: var(--text-soft);
  margin-top: 1px;
}

/* Reusar estilos del xfade toggle */
.radio-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 42px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
}
.radio-toggle input {
  opacity: 0;
  position: absolute;
  width: 0; height: 0;
}
.radio-toggle-knob {
  position: absolute;
  inset: 0;
  background: var(--bg4);
  border-radius: 99px;
  border: 1px solid rgba(255,255,255,.1);
  transition: background .2s, border-color .2s;
}
.radio-toggle-knob::after {
  content: '';
  position: absolute;
  width: 18px; height: 18px;
  background: white;
  border-radius: 50%;
  top: 50%; left: 2px;
  transform: translateY(-50%);
  transition: left .2s cubic-bezier(.34,1.56,.64,1), background .2s;
  box-shadow: 0 1px 4px rgba(0,0,0,.45);
}
.radio-toggle input:checked ~ .radio-toggle-knob {
  background: var(--accent);
  border-color: var(--accent);
}
.radio-toggle input:checked ~ .radio-toggle-knob::after {
  left: calc(100% - 20px);
}

/* Diversity pills */
.radio-diversity-row {
  display: flex;
  align-items: center;
  gap: .6rem;
}
.radio-div-label {
  font-size: .72rem;
  color: var(--text-soft);
  flex-shrink: 0;
}
.radio-div-pills {
  display: flex;
  gap: .35rem;
  flex: 1;
}
.radio-div-pill {
  flex: 1;
  padding: .32rem .4rem;
  border-radius: 8px;
  font-size: .72rem;
  font-weight: 500;
  background: rgba(255,255,255,.06);
  color: var(--text-soft);
  border: 1px solid transparent;
  transition: background .15s, color .15s, border-color .15s;
  text-align: center;
}
.radio-div-pill.active {
  background: rgba(139,92,246,.18);
  color: var(--accent-lt);
  border-color: rgba(139,92,246,.3);
}
.radio-div-pill:hover {
  background: rgba(255,255,255,.1);
  color: var(--text);
}
    `;
    document.head.appendChild(style);
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    _injectStyles();

    /* Observar apertura del panel de cola para inyectar radio panel */
    const queuePanel = document.getElementById('queuePanel');
    if (queuePanel) {
      const obs = new MutationObserver(() => {
        if (queuePanel.classList.contains('open')) {
          setTimeout(_injectRadioPanel, 60);
        }
      });
      obs.observe(queuePanel, { attributes: true, attributeFilter: ['class'] });
    }

    /* Activar auto-fill cuando se activa el radio mode */
    if (cfg.radioMode) {
      setTimeout(window._droplyRadioAutoFill, 1000);
    }

    console.info('[DROPLY Radio] ✓ Motor de radio cargado — modo radio:', cfg.radioMode ? 'ON' : 'OFF');
  }

  /* Esperar a que el DOM y la app estén listos */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 400);
  }

  /* Exponer API */
  window.DroplyRadio = {
    getSimilar:  window._droplyRadioGetSimilar,
    autoFill:    window._droplyRadioAutoFill,
    getConfig:   () => ({ ...cfg }),
    setRadio:    (v) => { cfg.radioMode = !!v; saveCfg(); if (v) window._droplyRadioAutoFill(); },
    setDiversity:(v) => { cfg.diversity = Math.max(0, Math.min(1, Number(v))); saveCfg(); },
  };

})();
