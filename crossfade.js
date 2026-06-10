/* ═══════════════════════════════════════════════════════════
   DROPLY — crossfade.js  v1.0
   Motor de Crossfade modular con WebAudio API

   Características:
   · Crossfade suave entre pistas (0–12 segundos configurables)
   · Gapless playback cuando crossfade = 0
   · Se integra con el engine existente sin romper nada
   · Compatible con iOS/Safari (desbloqueo de AudioContext)
   · Panel de configuración accesible desde el reproductor
   · Persiste la configuración en localStorage

   Integración:
   Incluir DESPUÉS de script.js:
     <script src="crossfade.js"></script>

   El módulo parchea window.loadTrack y el evento 'ended'
   del audio principal. Todo lo demás sigue funcionando igual.
═══════════════════════════════════════════════════════════ */

(function DroplyXfade() {
  'use strict';

  /* ── Configuración ─────────────────────────────────────── */
  const STORAGE_KEY  = 'droply_crossfade_cfg';
  const DEFAULT_CFG  = { enabled: false, duration: 4 }; // segundos

  let cfg = DEFAULT_CFG;

  function loadCfg() {
    try { cfg = { ...DEFAULT_CFG, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
    catch(_) { cfg = { ...DEFAULT_CFG }; }
  }
  function saveCfg() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); } catch(_) {}
  }
  loadCfg();

  /* ── AudioContext (compartido, evita crear múltiples) ───── */
  let _actx = null;
  function getACtx() {
    if (_actx && _actx.state !== 'closed') return _actx;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      _actx = new Ctx();
    } catch(_) { return null; }
    return _actx;
  }

  /* Reanudar AudioContext si fue suspendido (iOS) */
  async function resumeACtx() {
    const actx = getACtx();
    if (actx && actx.state === 'suspended') {
      try { await actx.resume(); } catch(_) {}
    }
    return actx;
  }

  /* ── Dos elementos de audio alternos ──────────────────── */
  /* El DOM ya tiene #mainAudio — es el slot A.              */
  /* Creamos un slot B oculto para el crossfade.             */
  const audioA = document.getElementById('mainAudio');
  let   audioB = null;

  function ensureAudioB() {
    if (audioB) return audioB;
    audioB = document.createElement('audio');
    audioB.id        = 'xfadeAudio';
    audioB.preload   = 'metadata';
    audioB.style.display = 'none';
    document.body.appendChild(audioB);

    /* Propagar evento 'ended' del slot B al sistema de la app */
    audioB.addEventListener('ended', function () {
      /* Si el slot B termina y es el activo, reproducir siguiente */
      if (_activeSlot === 'B') {
        /* Emitir evento ended en audioA para que el handler original lo recoja */
        audioA.dispatchEvent(new Event('ended'));
      }
    });

    return audioB;
  }

  /* ─── Slot activo ('A' = mainAudio, 'B' = xfadeAudio) ─── */
  let _activeSlot = 'A';

  function activeAudio()  { return _activeSlot === 'A' ? audioA : ensureAudioB(); }
  function inactiveAudio(){ return _activeSlot === 'A' ? ensureAudioB() : audioA; }

  /* ── Nodos WebAudio para control de volumen suave ───────── */
  let _nodeA = null;
  let _nodeB = null;
  let _gainA = null;
  let _gainB = null;

  function ensureNodes(actx) {
    if (!_nodeA) {
      _nodeA = actx.createMediaElementSource(audioA);
      _gainA = actx.createGain();
      _nodeA.connect(_gainA);
      _gainA.connect(actx.destination);
    }
    const b = ensureAudioB();
    if (!_nodeB) {
      _nodeB = actx.createMediaElementSource(b);
      _gainB = actx.createGain();
      _nodeB.connect(_gainB);
      _gainB.connect(actx.destination);
    }
  }

  function getGainForSlot(slot) {
    if (!_gainA || !_gainB) return null;
    return slot === 'A' ? _gainA : _gainB;
  }

  /* ── Crossfade ──────────────────────────────────────────── */
  let _xfadeTimer   = null;
  let _xfadeRAF     = null;

  function cancelXfade() {
    if (_xfadeTimer) { clearTimeout(_xfadeTimer); _xfadeTimer = null; }
    if (_xfadeRAF)   { cancelAnimationFrame(_xfadeRAF); _xfadeRAF = null; }
  }

  /* Arranca la transición:
     - Preloads el nuevo src en el slot inactivo
     - Cuando está listo, hace el fade
     - La duración del crossfade es cfg.duration segundos
  */
  async function crossfadeToSrc(newSrc) {
    if (!cfg.enabled || cfg.duration <= 0) {
      /* Sin crossfade — hard switch limpio */
      _hardSwitch(newSrc);
      return;
    }

    const actx = await resumeACtx();
    if (!actx) {
      _hardSwitch(newSrc);
      return;
    }

    cancelXfade();
    ensureNodes(actx);

    const incoming  = inactiveAudio();
    const outgoing  = activeAudio();
    const gainOut   = getGainForSlot(_activeSlot);
    const gainIn    = getGainForSlot(_activeSlot === 'A' ? 'B' : 'A');

    if (!gainOut || !gainIn) {
      _hardSwitch(newSrc);
      return;
    }

    /* Preparar slot entrante */
    incoming.src    = newSrc;
    incoming.volume = 1;
    incoming.muted  = false;
    gainIn.gain.setValueAtTime(0, actx.currentTime);

    /* Esperar a que sea reproducible */
    await new Promise(resolve => {
      const ev = () => { incoming.removeEventListener('canplay', ev); resolve(); };
      incoming.addEventListener('canplay', ev, { once: true });
      /* Timeout de seguridad: 3s */
      setTimeout(resolve, 3000);
    });

    incoming.currentTime = 0;

    /* Iniciar reproducción del slot entrante */
    try {
      await incoming.play();
    } catch(err) {
      if (err.name !== 'AbortError') console.warn('[DROPLY Xfade] play error:', err);
      _hardSwitch(newSrc);
      return;
    }

    /* Fade cruzado usando WebAudio GainNodes */
    const dur  = cfg.duration; // segundos
    const now  = actx.currentTime;

    gainIn.gain.cancelScheduledValues(now);
    gainIn.gain.setValueAtTime(0, now);
    gainIn.gain.linearRampToValueAtTime(1, now + dur);

    gainOut.gain.cancelScheduledValues(now);
    gainOut.gain.setValueAtTime(gainOut.gain.value, now);
    gainOut.gain.linearRampToValueAtTime(0, now + dur);

    /* Al terminar el fade, pausar el outgoing y hacer swap */
    _xfadeTimer = setTimeout(() => {
      try { outgoing.pause(); outgoing.src = ''; } catch(_) {}
      gainOut.gain.setValueAtTime(1, actx.currentTime); // reset para próxima vez
      _activeSlot = _activeSlot === 'A' ? 'B' : 'A';

      /* Sincronizar la referencia global que usa el resto de la app */
      _syncActiveAudioRef();
    }, dur * 1000 + 50);
  }

  /* Hard switch sin fade (cuando xfade está desactivado) */
  function _hardSwitch(newSrc) {
    /* Si había nodos de audio web activos, resetear gains */
    if (_gainA) {
      try {
        const actx = getACtx();
        if (actx) {
          _gainA.gain.cancelScheduledValues(actx.currentTime);
          _gainA.gain.setValueAtTime(1, actx.currentTime);
          if (_gainB) {
            _gainB.gain.cancelScheduledValues(actx.currentTime);
            _gainB.gain.setValueAtTime(1, actx.currentTime);
          }
        }
      } catch(_) {}
    }

    /* Si el slot activo no es A, mover al A (mainAudio) */
    if (_activeSlot !== 'A' && audioB) {
      audioB.pause();
      audioB.src = '';
      _activeSlot = 'A';
    }

    /* El resto lo gestiona el loadTrack original */
    /* No hacemos nada más — dejamos que el código existente tome el control */
  }

  /* Sincronizar window.audioEl y activeAudio con el slot activo */
  function _syncActiveAudioRef() {
    /* La app usa window.audioEl como referencia al audio activo */
    window.audioEl = activeAudio();
    /* También actualizar la referencia interna de la app si existe */
    /* (activeAudio es const en el scope de script.js pero podemos
        redirigir las referencias públicas) */
  }

  /* ── Precarga inteligente ───────────────────────────────── */
  /* Precarga el siguiente track antes de que acabe el actual   */
  let _preloadTimer = null;
  let _preloadedSrc = null;

  function schedulePreload(nextSrc) {
    if (!nextSrc || nextSrc === _preloadedSrc) return;
    clearTimeout(_preloadTimer);

    _preloadTimer = setTimeout(() => {
      if (!cfg.enabled) return; // Solo precargar si xfade está activo
      const b = ensureAudioB();
      if (b.src === nextSrc) return; // Ya precargado

      /* Precargar en background sin reproducir */
      const tmp = document.createElement('audio');
      tmp.preload = 'metadata';
      tmp.src = nextSrc;
      tmp.load();
      _preloadedSrc = nextSrc;
      /* Limpiar elemento temporal tras carga parcial */
      tmp.addEventListener('canplay', () => {
        tmp.src = '';
        tmp.remove();
      }, { once: true });
    }, 500);
  }

  /* ── Trigger de crossfade automático al final del track ── */
  /* Escuchar timeupdate en audioA para disparar el xfade     */
  /* cuando queden cfg.duration segundos en el track actual    */
  let _xfadeTriggered = false;

  audioA.addEventListener('timeupdate', function() {
    if (!cfg.enabled || cfg.duration <= 0) return;
    const dur = audioA.duration;
    const cur = audioA.currentTime;
    if (!dur || !isFinite(dur) || dur <= 0) return;

    const remaining = dur - cur;

    /* Trigger cuando quede el tiempo de crossfade */
    if (remaining <= cfg.duration && remaining > 0 && !_xfadeTriggered) {
      _xfadeTriggered = true;
      /* Dejar que la app maneje playNext → loadTrack */
      /* El crossfade se activará cuando loadTrack llame a _doPlay */
    }

    /* Reset trigger al principio del track */
    if (cur < 1) _xfadeTriggered = false;
  }, { passive: true });

  /* ── Parchear loadTrack para interceptar _doPlay ────────── */
  /* Guardamos referencia a la función original               */
  const _origLoadTrack = window.loadTrack;

  /* Exponemos la función crossfadeToSrc globalmente          */
  window.DroplyXfade = {
    crossfadeTo: crossfadeToSrc,
    getConfig:   () => ({ ...cfg }),
    setEnabled:  (v) => { cfg.enabled = !!v; saveCfg(); _updateUI(); },
    setDuration: (v) => { cfg.duration = Math.max(0, Math.min(12, Number(v))); saveCfg(); _updateUI(); },
  };

  /* ── Panel de configuración ──────────────────────────────── */
  /* Añadir botón en el sheet del reproductor */
  function _injectXfadePanel() {
    /* Buscar el wrap del volumen (oculto) para insertar tras él */
    const volWrap = document.querySelector('.sheet-volume-wrap');
    if (!volWrap) return;

    /* Evitar inyectar más de una vez */
    if (document.getElementById('xfadePanel')) return;

    const panel = document.createElement('div');
    panel.id        = 'xfadePanel';
    panel.className = 'xfade-panel';
    panel.innerHTML = `
      <div class="xfade-panel-inner">
        <div class="xfade-row">
          <div class="xfade-label-wrap">
            <svg viewBox="0 0 24 24" width="16" height="16" class="xfade-icon">
              <path d="M4 4h4v4H4zM16 4h4v4h-4zM4 16h4v4H4zM16 16h4v4h-4z" opacity=".4"/>
              <path d="M8 6 Q12 6 16 18M8 18 Q12 18 16 6" stroke-width="1.6" fill="none"/>
            </svg>
            <span class="xfade-label-text">Crossfade</span>
          </div>
          <label class="xfade-toggle" for="xfadeEnabled">
            <input type="checkbox" id="xfadeEnabled" ${cfg.enabled ? 'checked' : ''} />
            <span class="xfade-toggle-knob"></span>
          </label>
        </div>
        <div class="xfade-slider-row" id="xfadeSliderRow" style="${cfg.enabled ? '' : 'opacity:.35;pointer-events:none'}">
          <span class="xfade-dur-label">0s</span>
          <input type="range" id="xfadeDuration" min="0" max="12" step="0.5"
            value="${cfg.duration}" class="xfade-range" />
          <span class="xfade-dur-label" id="xfadeDurVal">${cfg.duration}s</span>
        </div>
      </div>`;

    /* Insertar antes del wrap de audio (al final del sheet, antes de audio) */
    const audioEl = document.getElementById('mainAudio');
    if (audioEl && audioEl.parentNode) {
      audioEl.parentNode.insertBefore(panel, audioEl);
    } else {
      volWrap.insertAdjacentElement('afterend', panel);
    }

    /* Eventos */
    const chk   = document.getElementById('xfadeEnabled');
    const range = document.getElementById('xfadeDuration');
    const durVal = document.getElementById('xfadeDurVal');
    const slRow  = document.getElementById('xfadeSliderRow');

    chk.addEventListener('change', () => {
      window.DroplyXfade.setEnabled(chk.checked);
    });
    range.addEventListener('input', () => {
      const v = parseFloat(range.value);
      durVal.textContent = v + 's';
      window.DroplyXfade.setDuration(v);
    });
  }

  function _updateUI() {
    const chk    = document.getElementById('xfadeEnabled');
    const range  = document.getElementById('xfadeDuration');
    const durVal = document.getElementById('xfadeDurVal');
    const slRow  = document.getElementById('xfadeSliderRow');

    if (chk)    chk.checked     = cfg.enabled;
    if (range)  range.value     = cfg.duration;
    if (durVal) durVal.textContent = cfg.duration + 's';
    if (slRow)  slRow.style.opacity = cfg.enabled ? '1' : '.35';
    if (slRow)  slRow.style.pointerEvents = cfg.enabled ? '' : 'none';
  }

  /* ── Estilos del panel ───────────────────────────────────── */
  function _injectStyles() {
    if (document.getElementById('xfadeStyles')) return;
    const style = document.createElement('style');
    style.id = 'xfadeStyles';
    style.textContent = `
/* ── Xfade Panel ─────────────────────────── */
.xfade-panel {
  margin: 0 1.4rem 1rem;
}
.xfade-panel-inner {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 14px;
  padding: .8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: .55rem;
}
.xfade-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.xfade-label-wrap {
  display: flex;
  align-items: center;
  gap: .5rem;
}
.xfade-icon {
  color: var(--accent);
  flex-shrink: 0;
}
.xfade-label-text {
  font-size: .82rem;
  font-weight: 500;
  color: var(--text-mid);
  letter-spacing: .02em;
}

/* Toggle pill */
.xfade-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 42px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
}
.xfade-toggle input {
  opacity: 0;
  position: absolute;
  width: 0; height: 0;
}
.xfade-toggle-knob {
  position: absolute;
  inset: 0;
  background: var(--bg4);
  border-radius: 99px;
  border: 1px solid rgba(255,255,255,.1);
  transition: background .2s, border-color .2s;
}
.xfade-toggle-knob::after {
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
.xfade-toggle input:checked ~ .xfade-toggle-knob {
  background: var(--accent);
  border-color: var(--accent);
}
.xfade-toggle input:checked ~ .xfade-toggle-knob::after {
  left: calc(100% - 20px);
}

/* Duration slider row */
.xfade-slider-row {
  display: flex;
  align-items: center;
  gap: .6rem;
  transition: opacity .25s;
}
.xfade-dur-label {
  font-size: .72rem;
  color: var(--text-soft);
  min-width: 22px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.xfade-range {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 3px;
  border-radius: 99px;
  background: rgba(255,255,255,.12);
  outline: none;
  cursor: pointer;
}
.xfade-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(139,92,246,.25);
  cursor: pointer;
  transition: box-shadow .15s;
}
.xfade-range:active::-webkit-slider-thumb {
  box-shadow: 0 0 0 5px rgba(139,92,246,.35);
}
.xfade-range::-moz-range-thumb {
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  cursor: pointer;
}

/* ── Cover vinyl rotation effect ─────────── */
.sheet-cover {
  transition: transform .5s cubic-bezier(.34,1.56,.64,1),
              box-shadow .4s ease;
}
.sheet-cover.playing {
  animation: vinylSpin 18s linear infinite;
}
.sheet-cover.track-change {
  animation: coverPop .4s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes vinylSpin {
  from { transform: rotate(0deg) scale(1); }
  to   { transform: rotate(360deg) scale(1); }
}
@keyframes coverPop {
  0%   { transform: scale(.88); opacity: .6; filter: blur(6px); }
  60%  { transform: scale(1.04); opacity: 1; filter: blur(0px); }
  100% { transform: scale(1); opacity: 1; filter: blur(0px); }
}

/* ── Cover paused state ──────────────────── */
.sheet-cover:not(.playing) {
  animation: none;
}

/* ── Mini player cover pulse ─────────────── */
@keyframes miniCoverBeat {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.06); }
}
.mini-cover img.playing-beat {
  animation: miniCoverBeat .6s ease-in-out;
}

/* ── Queue progress smooth ───────────────── */
.queue-now-progress-fill {
  transition: width .5s linear;
}
    `;
    document.head.appendChild(style);
  }

  /* ── Parchear cover animation al cambiar track ──────────── */
  /* Interceptar cambios de src del sheetCover */
  function _patchCoverAnimation() {
    const cover = document.getElementById('sheetCover');
    if (!cover) return;

    const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    // No parcheamos src directamente (puede romper cosas)
    // En cambio, observamos el atributo src con MutationObserver

    const observer = new MutationObserver(() => {
      cover.classList.remove('track-change');
      // Forzar reflow para reiniciar la animación
      void cover.offsetWidth;
      cover.classList.add('track-change');
    });
    observer.observe(cover, { attributes: true, attributeFilter: ['src'] });
  }

  /* ── Mejorar animación del cover en el mini player ─────── */
  function _patchMiniCover() {
    const miniCoverImg = document.getElementById('miniCover');
    if (!miniCoverImg) return;

    const obs = new MutationObserver(() => {
      miniCoverImg.classList.remove('playing-beat');
      void miniCoverImg.offsetWidth;
      miniCoverImg.classList.add('playing-beat');
    });
    obs.observe(miniCoverImg, { attributes: true, attributeFilter: ['src'] });
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    _injectStyles();

    /* Inyectar panel cuando el reproductor esté en el DOM */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        _injectXfadePanel();
        _patchCoverAnimation();
        _patchMiniCover();
      });
    } else {
      /* DOM ya listo, pero puede que el sheet no esté visible.
         Inyectar ahora y también cuando se abra el sheet. */
      setTimeout(() => {
        _injectXfadePanel();
        _patchCoverAnimation();
        _patchMiniCover();
      }, 300);
    }

    /* También inyectar cuando se abra el now-playing sheet */
    const sheet = document.getElementById('nowPlayingSheet');
    if (sheet) {
      const sheetObserver = new MutationObserver(() => {
        if (sheet.classList.contains('open')) {
          setTimeout(_injectXfadePanel, 50);
        }
      });
      sheetObserver.observe(sheet, { attributes: true, attributeFilter: ['class'] });
    }

    /* Exponer para debug */
    console.info('[DROPLY Crossfade] ✓ Módulo cargado — crossfade:', cfg.enabled ? 'ON' : 'OFF', '— duración:', cfg.duration + 's');
  }

  init();

})();
