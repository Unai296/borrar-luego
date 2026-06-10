/* ═══════════════════════════════════════════════════════════
   DROPLY — script.js  v4 ENHANCED
   Funciones: Cola · Playlists · Historial · Crossfade
              Toasts · Context Menu · Favorites · Shuffle/Repeat
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════
   iOS / Safari AudioContext Unlock  ← FIX #2
   iOS bloquea todo audio hasta el primer gesto real.
   Este bloque lo desbloquea con el primer tap/click,
   y también reanuda cualquier track pendiente por autoplay bloqueado.
══════════════════════════════════════════════════════ */
(function iosAudioUnlock() {
  let _unlocked = false;

  function _unlock() {
    if (_unlocked) return;

    // 1. Crear y resumir un AudioContext silencioso — desbloquea la pipa de audio de iOS
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        const buf = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
        ctx.resume().catch(() => {});
      }
    } catch (e) {}

    // 2. Si había un track pendiente por autoplay bloqueado, intentar reproducirlo ahora
    const mainAudio = document.getElementById('mainAudio');
    if (mainAudio && mainAudio.src && mainAudio.paused && window._droplyPendingTrack) {
      mainAudio.play()
        .then(() => { _unlocked = true; window._droplyPendingTrack = null; })
        .catch(() => {});
    } else {
      _unlocked = true;
    }

    if (_unlocked) {
      ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'].forEach(ev =>
        document.removeEventListener(ev, _unlock, true)
      );
    }
  }

  ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'].forEach(ev =>
    document.addEventListener(ev, _unlock, { capture: true, passive: true })
  );
})();









/* ══════════════════════════════════════════════════════
   0. CHANGELOG — Edita este array para gestionar las
      pantallas de novedades que se muestran al abrir la app.
      Añade, edita o elimina entradas libremente.
      Se muestra la última versión no vista por el usuario.
   
   Campos:
     version  → identificador único (string)
     date     → fecha mostrada al usuario
     title    → título grande del modal
     emoji    → emoji decorativo (opcional)
     changes  → array de objetos { icon, text }
                icon puede ser: "🎵" "🎨" "🔧" "⚡" "❤️" "📱" "🆕" etc.
══════════════════════════════════════════════════════ */
const CHANGELOG = [













  {
    version: "v5.4",
    date:    "26 de Mayo 2026",
    title:   "Novedades Droply",
    emoji:   "🎶",
    changes: [
      { icon: "🎵", text: "Introducido canciones de Fito y Estopa." },
      { icon: "⚡", text: "Mejoras de rendimiento en la navegación entre páginas." },
      { icon: "🔧", text: "Varias correcciones tanto visuales como funcionales en el reproductor." }
    ]
  },
































{
  version: "v5.2",
  date:    "25 de Mayo 2026",
  title:   "Droply Redesign",
  emoji:   "✨",
  changes: [
    { 
      icon: "🎨", 
      text: "Rediseño completo de la interfaz con estilo mucho más limpio, moderno y premium." 
    },

    { 
      icon: "🫧", 
      text: "Añadido nuevo efecto glassmorphism en botones, menús y reproductor." 
    },

    { 
      icon: "📱", 
      text: "Mejorado el soporte PWA para instalación como app en móvil y escritorio." 
    },

    { 
      icon: "⚡", 
      text: "Animaciones y transiciones rehechas para una experiencia más fluida y natural." 
    },

    { 
      icon: "🎵", 
      text: "Nuevo reproductor con controles modernizados y mejor integración visual del audio." 
    },

    { 
      icon: "📚", 
      text: "Añadido sistema de biblioteca con música propia cargada por el usuario." 
    },

    { 
      icon: "💾", 
      text: "Mejorado el guardado local para que la música añadida no se pierda al recargar la app." 
    },

    { 
      icon: "🌌", 
      text: "Mejorado el fondo dinámico y la iluminación ambiental de toda la app." 
    },

    { 
      icon: "🛠️", 
      text: "Corregidos múltiples bugs visuales y problemas de reproducción en dispositivos móviles." 
    }
  ]
},

























{
  version: "v5.0",
  date:    "23 de Mayo 2026",
  title:   "Droply Redesign",
  emoji:   "✨",
  changes: [
    { 
      icon: "🎨", 
      text: "Rediseño completo de la interfaz con estilo mucho más limpio, moderno y premium." 
    },

    { 
      icon: "🫧", 
      text: "Añadido nuevo efecto glassmorphism en botones, menús y reproductor." 
    },

    { 
      icon: "📱", 
      text: "Droply ahora puede instalarse como app gracias al nuevo soporte PWA." 
    },

    { 
      icon: "⚡", 
      text: "Animaciones y transiciones rehechas para que todo se sienta más fluido." 
    },

    { 
      icon: "🎵", 
      text: "Nuevo reproductor con visuales mejorados y controles más modernos." 
    },

    { 
      icon: "🌌", 
      text: "Mejorado el fondo dinámico y la iluminación ambiental de toda la app." 
    },

    { 
      icon: "🛠️", 
      text: "Corregidos múltiples bugs visuales y pequeños errores del reproductor." 
    }
  ]
},













  {
    version: "v4.3",
    date:    "20 de Mayo 2026",
    title:   "Novedades Droply",
    emoji:   "🎶",
    changes: [
      { icon: "🎵", text: "Arreglado la reproduccion de Playlists (me costo un huevo cago en to)." },
      { icon: "⚡", text: "Mejoras de rendimiento en la navegación entre páginas." },
      { icon: "🔧", text: "Varias correcciones tanto visuales como funcionales en el reproductor." }
    ]
  },
























  /* ── Añade más versiones arriba (las más nuevas primero) ── */
  // {
  //   version: "v4.1",
  //   date:    "Abril 2026",
  //   title:   "Novedades",
  //   emoji:   "🚀",
  //   changes: [
  //     { icon: "🆕", text: "Ejemplo de cambio anterior." }
  //   ]
  // }
];

/* ─── Mostrar changelog si hay versión no vista ─────── */
const CHANGELOG_SEEN_KEY = "droply_changelog_seen";
function getSeenVersion()  { return localStorage.getItem(CHANGELOG_SEEN_KEY) || ""; }
function markVersionSeen(v){ localStorage.setItem(CHANGELOG_SEEN_KEY, v); }

function initChangelog() {
  if (!CHANGELOG || CHANGELOG.length === 0) return;
  const latest = CHANGELOG[0];
  if (getSeenVersion() === latest.version) return; // ya visto

  const modal = document.getElementById("changelogModal");
  if (!modal) return;

  // Rellenar contenido
  const elEmoji   = document.getElementById("clEmoji");
  const elTitle   = document.getElementById("clTitle");
  const elDate    = document.getElementById("clDate");
  const elVersion = document.getElementById("clVersion");
  const elList    = document.getElementById("clList");
  const elClose   = document.getElementById("clClose");

  if (elEmoji)   elEmoji.textContent   = latest.emoji || "✨";
  if (elTitle)   elTitle.textContent   = latest.title || "Novedades";
  if (elDate)    elDate.textContent    = latest.date  || "";
  if (elVersion) elVersion.textContent = latest.version || "";
  if (elList) {
    elList.innerHTML = (latest.changes || []).map(c =>
      `<li class="cl-item"><span class="cl-icon">${c.icon || "•"}</span><span class="cl-text">${c.text}</span></li>`
    ).join("");
  }

  // Mostrar con pequeño delay para que la app cargue primero
  setTimeout(() => { modal.classList.add("open"); }, 600);

  if (elClose) {
    elClose.addEventListener("click", () => {
      modal.classList.remove("open");
      markVersionSeen(latest.version);
    });
  }
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.remove("open");
      markVersionSeen(latest.version);
    }
  });
}



/* ══════════════════════════════════════════════════════
   1. DATA
══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────
   FOTOS DE ARTISTAS
   Añade aquí la URL de la foto de cada artista.
   La clave es el nombre del artista TAL COMO aparece
   en el campo "artist" de las canciones (o la parte
   principal antes de la coma si tiene varios artistas).
   Si un artista no tiene foto aquí se usará la portada
   de una de sus canciones como hasta ahora.

   Ejemplos:
     "J Balvin":     "https://...",
     "Bad Bunny":    "https://...",
     "Morad":        "https://...",
─────────────────────────────────────────────────────── */
const ARTIST_PHOTOS = {
  // ── Añade aquí las fotos de los artistas ──────────
  // "Nombre del artista": "https://url-de-la-foto.jpg",

  "Coldplay":    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Coldplay_-_Rock_in_Rio_2022.jpg/400px-Coldplay_-_Rock_in_Rio_2022.jpg",




"A Touch Of Class":     "https://cdn-images.dzcdn.net/images/cover/1cbc3fe3abdbcbb88ca5cc50f6845b0d/1900x1900-000000-81-0-0.jpg",

"ABBA":     "https://cdn-images.dzcdn.net/images/cover/065db5953bf46f833dc6b3ca5dba2a51/1900x1900-000000-80-0-0.jpg",

"Ace of Base":     "https://cdn-images.dzcdn.net/images/artist/038b073fec58dc1783f64f96ba2ef14d/1900x1900-000000-80-0-0.jpg",

"Afrojack":     "https://i.scdn.co/image/ab6761610000517456591d5d8219e6e506096c41",

"AKDO":     "https://i.scdn.co/image/ab67616100005174e4c142124c270d224eea148f",

"Alex Gaudino":     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvPuV507QliAcax0C2jj6OTc0Z9-VFemNnQQ&s",


"Alesso":     "https://i.scdn.co/image/ab6761610000e5eb42b3fb34e3451c79c55cbe73",

"Alice Deejay":     "https://artist99.cdn107.com/420/42012b0680c71a11d9c30584a5185f78_xl.jpg",

"Anitta":     "https://cdn0.celebritax.com/sites/default/files/styles/square_700x700/public/1648142414-anitta-celebra-exito-su-hit-envolver-spotify-haciendo-su-popular-paso-baile-palabras.jpg",



"Anuel AA":     "https://cdn-images.dzcdn.net/images/artist/d128822eb60817b362b9d6e8c696e933/1900x1900-000000-81-0-0.jpg",


"Aqua":     "https://egebotiga.com/wp-content/uploads/2024/02/aqua-aquarium-25-annuversary-COMPRAR-VINILO.jpg",


"Arcángel":     "https://i.scdn.co/image/ffaac96035a6cba4a0d19cab070bd3cd4f5fe287",


"AISSA":     "https://conciertos.club/doc/a/2023/a_aissa.jpg",


"Bad Bunny":     "https://i.scdn.co/image/ab6761610000517481f47f44084e0a09b5f0fa13",


"Bebe Rexha":     "https://bi.org/wp-content/uploads/2021/10/featured-famous-bi-bebe-rexha-1-1024x1024.jpg",




















"Becky G":           "https://cdn-images.dzcdn.net/images/cover/b6d13738038b285630370f5be059380f/0x1900-000000-80-0-0.jpg",
  "Bee Gees":          "https://m.media-amazon.com/images/M/MV5BZmU5M2E3M2MtM2M5My00YTI2LThkNDktNjk5MGE2NzAxNTZlXkEyXkFqcGc@._V1_.jpg",
  "Beny Jr":           "https://i.scdn.co/image/ab67616d0000b27345e6bba1ac0c5b54a9ee8121",
  "Black Eyed Peas":   "https://i.ytimg.com/vi/C9xrAJ_rmBw/maxresdefault.jpg",
  "Blessd":            "https://m.media-amazon.com/images/I/31P5CYOaluL._UXNaN_FMjpg_QL85_.jpg",
  "Cardi B":           "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2018/09/28/15381371183299.jpg",
  "Carlos Vives":      "https://i.scdn.co/image/ab67616d0000b273e588b4129b0afd8595ac55b0",
  "Chencho Corleone":  "https://i.scdn.co/image/ab67616d0000b273c32233e3541a756a90880fb1",
  "Chris Brown":       "https://i.ytimg.com/vi/OLqaMYc9LFE/maxresdefault.jpg",
  "Christina Aguilera": "https://m.media-amazon.com/images/I/9197wAEPZcL._UF894,1000_QL80_.jpg",
  "Clarent":           "https://i.scdn.co/image/ab67616d0000b27386b1784848d2cc7ccd58e05e",
  "Corona":            "https://cdn-images.dzcdn.net/images/cover/b3442cde5c53baa308dd569b5dbd46c1/1900x1900-000000-81-0-0.jpg",
  "Cris MJ":           "https://i.scdn.co/image/ab67616d0000b273c4583f3ad76630879a75450a",
  "Crystal Waters":    "https://cdn-images.dzcdn.net/images/cover/3cd44e7420b88ced60beb8daea52b11a/0x1900-000000-80-0-0.jpg",
  "Cyril Kamer":       "https://i.scdn.co/image/ab67616d0000b2733e242bdd9632c6a49a693b1b",
  "Daddy Yankee":      "https://i.ytimg.com/vi/mGN3kfEk_P4/maxresdefault.jpg",
  "Danny Ocean":       "https://cdn-images.dzcdn.net/images/cover/2312f5f5d53b0fb5238a4bc58d2f6cf6/1900x1900-000000-81-0-0.jpg",
  "Darell":            "https://m.media-amazon.com/images/I/41H6GkRuYiL._UXNaN_FMjpg_QL85_.jpg",
  "David Guetta":      "https://m.media-amazon.com/images/I/51R8fS3ESYL._UXNaN_FMjpg_QL85_.jpg",
  "De La Rose":        "https://images.genius.com/9b4acd648c12aa172b1b4ec9f8eaf4da.1000x1000x1.png",
  "Dei V":             "https://i1.sndcdn.com/artworks-by0H8XlmcCvzkf5u-6bxytg-t1080x1080.jpg",
  "DELLAFUENTE":       "https://i.scdn.co/image/ab67616d0000b2731a176de75067ededc26ad96d",
  "Dennis DJ":         "https://s.mxmcdn.net/images-storage/albums2/4/7/9/3/2/5/87523974_500_500.jpg",
  "DJ Snake":          "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2018/09/28/15381371183299.jpg",
  "Don Miguelo":       "https://i.ytimg.com/vi/16nZ6K7sim4/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGUgWyhLMA8=&rs=AOn4CLAm5BKIjd4rwtUHQHFpRU5wZArpbA",
  "Edward Maya":       "https://i.scdn.co/image/ab67616d0000b273edd7dc7bf5f7c39d3e132490",
  "El Alfa":           "https://i.scdn.co/image/ab67616d0000b2739380d5f0cd2e17fdb7c1109c",
  "El Bobe":           "https://i.scdn.co/image/ab67616d0000b273412a45f6d65252ae3d1fac4c",
  "El Bogueto":        "https://cdn-images.dzcdn.net/images/cover/e62f70e7b366e618da1cbf0eed47de8c/0x1900-000000-80-0-0.jpg",
  "El Guincho":        "https://images.genius.com/a8b0efd41e6a43091837da78850cf312.1000x1000x1.png",
  "Eloy":              "https://i.scdn.co/image/ab67616d0000b273da7076e371c7859fbb2e18fd",
  "Elton John":        "https://i.scdn.co/image/ab67616d0000b27373fd9802ec887972ecdacac2",
  "Emilia":            "https://s.mxmcdn.net/images-storage/albums2/4/7/9/3/2/5/87523974_500_500.jpg",
  "Farruko":           "https://i1.sndcdn.com/artworks-000083532431-1yokz6-t1080x1080.jpg",
  "FEID":              "https://m.media-amazon.com/images/I/61vTly9zD+L._UXNaN_FMjpg_QL85_.jpg",
  "FloyyMenor":        "https://i.scdn.co/image/ab67616d0000b273c4583f3ad76630879a75450a",
  "Fuerza Regida":     "https://cdn-images.dzcdn.net/images/cover/e62f70e7b366e618da1cbf0eed47de8c/0x1900-000000-80-0-0.jpg",
  "Fronti":            "https://akamai.sscdn.co/uploadfile/letras/albuns/b/3/4/0/4332821765558369.jpg",
  "GALA":              "https://cdn-images.dzcdn.net/images/cover/ba8311a74318c401fb64d7594018f44d/0x1900-000000-80-0-0.jpg",
  "Gente De Zona":     "https://images.genius.com/cf43fd45336758c065537970f6a79f96.1000x1000x1.jpg",
  "GIMS":              "https://m.media-amazon.com/images/M/MV5BZDI1NzIxMTctZTUxMi00NmY4LWEzODAtYWQ1NWEwMGE0MWFhXkEyXkFqcGc@._V1_QL75_UY190_CR31,0,190,190_.jpg",
  "GONZY":             "https://i.scdn.co/image/ab67616d0000b2735327757614a832374e491778",
  "Gote":              "https://i.scdn.co/image/ab67616d00001e02fb1041333d9a712a182acfa0",
  "Haddaway":          "https://upload.wikimedia.org/wikipedia/en/a/a8/HaddawayWhatIsLoveMaxiCDCover.jpg",
  "Hades66":           "https://i.scdn.co/image/ab67616d0000b2735cc8552f86ba4cc528968d2d",
  "Hanzel La H":       "https://akamai.sscdn.co/uploadfile/letras/albuns/b/3/4/0/4332821765558369.jpg",
  "Heuss L'enfoiré":   "https://m.media-amazon.com/images/I/51QolFGPe7L._UXNaN_FMjpg_QL85_.jpg",
  "JC Reyes":          "https://i1.sndcdn.com/artworks-by0H8XlmcCvzkf5u-6bxytg-t1080x1080.jpg",
  "Jedis":             "https://i.scdn.co/image/ab67616d00001e02fb1041333d9a712a182acfa0",
  "Jennifer Lopez":    "https://i.scdn.co/image/ab67616d0000b2735c7fdd07d99c156401073aaa",
  "Jhay Cortez":       "https://i.scdn.co/image/ab67616d00001e02005ee342f4eef2cc6e8436ab",
  "John Ryan":         "https://m.media-amazon.com/images/I/71aqqhM+cFL._UF894,1000_QL80_.jpg",
  "Jowell & Randy":    "https://i.scdn.co/image/ab67616d0000b273da7076e371c7859fbb2e18fd",
  "JuL":               "https://m.media-amazon.com/images/I/51QolFGPe7L._UXNaN_FMjpg_QL85_.jpg",
  "Justin Quiles":     "https://i.scdn.co/image/ab67616d0000b273c32233e3541a756a90880fb1",
  "Karol G":           "https://i.scdn.co/image/ab67616d0000b2735fa6dc9fc261344044c301a9",
  "Kate Ryan":         "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kate_Ryan_-_2007.jpg/400px-Kate_Ryan_-_2007.jpg",
  "Kidd Voodoo":       "https://m.media-amazon.com/images/I/511UiqJjmZL._UXNaN_FMjpg_QL85_.jpg",
  "Kiss":              "https://i.discogs.com/ZDR0sVMA4m0HNMH-M1w8qfzxOX_9HL_t76I8QjohXcQ/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM2Njg0/NzEtMTMzOTYwMDc2/MS0zNDU2LmpwZWc.jpeg",
  "Kreamly":           "https://m.media-amazon.com/images/I/51qThLr9dIL._SX354_SY354_BL0_QL100__UXNaN_FMjpg_QL85_.jpg",
  "Kris R":            "https://m.media-amazon.com/images/I/31P5CYOaluL._UXNaN_FMjpg_QL85_.jpg",
  "La Bouche":         "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/La_Bouche_at_Rave_2011.jpg/400px-La_Bouche_at_Rave_2011.jpg",
  "Lady Gaga":         "https://i.scdn.co/image/ab67616d0000b2739ff8dea75219ec13530d97f1",
  "Las Ketchup":       "https://cdn-images.dzcdn.net/images/cover/be45674dc35c8f974a934dc3779c7b59/0x1900-000000-80-0-0.jpg",
  "Lenny Tavarez":     "https://i1.sndcdn.com/artworks-000384998541-nkcy6u-t500x500.jpg",
  "Luar La L":         "https://i.ytimg.com/vi/awbt4MRXuck/maxresdefault.jpg",
  "Luísa Sonza":       "https://s.mxmcdn.net/images-storage/albums2/4/7/9/3/2/5/87523974_500_500.jpg",
  "LVBEL C5":          "https://i.scdn.co/image/ab67616d0000b2738e675f63b19c17334f7d62d9",
  "Lunay":             "https://i.scdn.co/image/ab67616d0000b27358e34ee7bc215e1b03ff78d4",
  "Madonna":           "https://m.media-amazon.com/images/I/81Iv8WsxUwL._UF894,1000_QL80_.jpg",
  "Major Lazer":       "https://i.scdn.co/image/ab67616d0000b2739380d5f0cd2e17fdb7c1109c",
  "Maluma":            "https://i.scdn.co/image/ab67616d0000b2738e17b8d0bf76a205bba297bd",
  "Marc Anthony":      "https://images.genius.com/cf43fd45336758c065537970f6a79f96.1000x1000x1.jpg",
  "Mau":               "https://i.scdn.co/image/ab67616d0000b273f89d8cc59e29c9d2f846e903",
  "MC Menor JP":       "https://images.genius.com/60b39231e971719e4c609413d5bcc851.1000x1000x1.png",
  "Moncho Chavea":     "https://i.scdn.co/image/ab67616d0000b273c7b6b68108ab221bb07f5aa6",
  "Mora":              "https://images.genius.com/9b4acd648c12aa172b1b4ec9f8eaf4da.1000x1000x1.png",
  "Myke Towers":       "https://media.emisorasmusicales.net/wp-content/uploads/2023/02/11013844/nnn.jpg",
  "Natti Natasha":     "https://i.scdn.co/image/ab67616d0000b273d7ce6f9b0a15181635a933d9",
  "Nayer":             "https://i1.sndcdn.com/artworks-haGUy7OWdKcoRgMH-Zglw6A-t1080x1080.jpg",
  "Netherworld":       "https://m.media-amazon.com/images/I/51R59lHZtYL._UXNaN_FMjpg_QL85_.jpg",
  "Ne-Yo":             "https://i1.sndcdn.com/artworks-haGUy7OWdKcoRgMH-Zglw6A-t1080x1080.jpg",
  "Nicky Jam":         "https://i.scdn.co/image/ab67616d0000b2738e17b8d0bf76a205bba297bd",
  "Nolep":             "https://i.scdn.co/image/ab67616d00001e02fb1041333d9a712a182acfa0",
  "Noriel":            "https://m.media-amazon.com/images/I/41H6GkRuYiL._UXNaN_FMjpg_QL85_.jpg",
  "Ñengo Flow":        "https://i.scdn.co/image/ab67616d0000b2735cc8552f86ba4cc528968d2d",
  "Omar Courtz":       "https://cdn-images.dzcdn.net/images/cover/1ef9489b58a25622c2e3d2aa0473dde0/0x1900-000000-80-0-0.jpg",
  "Omar Montes":       "https://i.scdn.co/image/ab67616d0000b273412a45f6d65252ae3d1fac4c",
  "Ozuna":             "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2018/09/28/15381371183299.jpg",
  "Pendulum":          "https://i.scdn.co/image/ab67616d0000b273dcbb69d4be6c29c0be851f32",
  "Pitbull":           "https://i.ytimg.com/vi/OLqaMYc9LFE/maxresdefault.jpg",
  "Play-N-Skillz & Elvis Crespo": "https://i.ytimg.com/vi/mGN3kfEk_P4/maxresdefault.jpg",
  "Polimá Westcoast":  "https://i.scdn.co/image/ab67616d0000b2733e242bdd9632c6a49a693b1b",
  "Quevedo":           "https://media.emisorasmusicales.net/wp-content/uploads/2023/02/11013844/nnn.jpg",
  "Rafa Pabon":        "https://i1.sndcdn.com/artworks-000384998541-nkcy6u-t500x500.jpg",
  "Rauw Alejandro":    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMVwbetQqCv73bf6t9mP31J9CucAlGW_k8YA&s",
  "Ricky":             "https://i.scdn.co/image/ab67616d0000b273f89d8cc59e29c9d2f846e903",
  "Rihanna":           "https://i.scdn.co/image/ab67616d0000b273f9f27162ab1ed45b8d7a7e98",
  "Roa":               "https://i.ytimg.com/vi/awbt4MRXuck/maxresdefault.jpg",
  "ROSALÍA":           "https://images.genius.com/a8b0efd41e6a43091837da78850cf312.1000x1000x1.png",
  "Rvfv":              "https://i.scdn.co/image/ab67616d0000b273bf3151af9c5e4d7c1de59ae9",
  "SAIKO":             "https://i1.sndcdn.com/artworks-by0H8XlmcCvzkf5u-6bxytg-t1080x1080.jpg",
  "Sammy":             "https://i1.sndcdn.com/artworks-000384998541-nkcy6u-t500x500.jpg",
  "SASH":              "https://m.media-amazon.com/images/I/71Vx2arL6vL._UF894,1000_QL80_.jpg",
  "Sebastián Yatra":   "https://i.scdn.co/image/ab67616d0000b273f89d8cc59e29c9d2f846e903",
  "Sech":              "https://images.genius.com/eb6adbb6247e85fca2cc94fb9388fd3a.1000x1000x1.png",
  "Shakira":           "https://i.scdn.co/image/ab67616d0000b273e588b4129b0afd8595ac55b0",
  "Skrillex":          "https://i.ytimg.com/vi/7aPzYlc2RY4/maxresdefault.jpg",
  "SLAYTER":           "https://m.media-amazon.com/images/I/61KjgepxdwL._UXNaN_FMjpg_QL85_.jpg",
  "Steve Aoki":        "https://i.ytimg.com/vi/mGN3kfEk_P4/maxresdefault.jpg",
  "Super Yei":         "https://i1.sndcdn.com/artworks-000384998541-nkcy6u-t500x500.jpg",
  "T-Pain":            "https://i1.sndcdn.com/artworks-00033071708-e6mxid-t500x500.jpg",
  "Tempo":             "https://i.scdn.co/image/ab67616d0000b2736e3e2d32da74925922b4976f",
  "Tito El Bambino":   "https://akamai.sscdn.co/uploadfile/letras/albuns/b/3/4/0/4332821765558369.jpg",
  "Vika Jigulina":     "https://i.scdn.co/image/ab67616d0000b273edd7dc7bf5f7c39d3e132490",
  "Willy William":     "https://i1.sndcdn.com/artworks-000283629944-3i7bfp-t500x500.jpg",
  "Wisin":             "https://akamai.sscdn.co/uploadfile/letras/albuns/b/3/4/0/4332821765558369.jpg",
  "Yan Block":         "https://i.scdn.co/image/ab67616d0000b2735cc8552f86ba4cc528968d2d",
  "Yandel":            "https://i.scdn.co/image/ab67616d0000b273c4e2ae0d7a6ba307bdd3cc0d",
  "Young Cister":      "https://m.media-amazon.com/images/I/51qThLr9dIL._SX354_SY354_BL0_QL100__UXNaN_FMjpg_QL85_.jpg",
  "YOUNG MIKO":        "https://m.media-amazon.com/images/I/61vTly9zD+L._UXNaN_FMjpg_QL85_.jpg",
  "YOVNGCHIMI":        "https://i.scdn.co/image/ab67616d0000b2732a5c6164e8743597f44b645e",
  "Yung Beef":         "https://cdn-images.dzcdn.net/images/cover/e62f70e7b366e618da1cbf0eed47de8c/0x1900-000000-80-0-0.jpg",
  "Zion":              "https://i.scdn.co/image/ab67616d0000b273da7076e371c7859fbb2e18fd"




















};

/* Helper: devuelve la foto del artista o null */
function getArtistPhoto(artistName) {
  if (!artistName) return null;
  // Buscar coincidencia exacta primero
  if (ARTIST_PHOTOS[artistName]) return ARTIST_PHOTOS[artistName];
  // Buscar por primer nombre (antes de la coma/barra)
  const firstName = artistName.split(/[,&\/]/)[0].trim();
  if (ARTIST_PHOTOS[firstName]) return ARTIST_PHOTOS[firstName];
  // Búsqueda parcial (el nombre del artista empieza igual)
  const found = Object.keys(ARTIST_PHOTOS).find(k =>
    artistName.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(artistName.toLowerCase().split(/[,&\/]/)[0].trim())
  );
  return found ? ARTIST_PHOTOS[found] : null;
}

/* Cache de fotos cargadas desde Wikipedia para no repetir peticiones */
const _wikiPhotoCache = {};

/**
 * Intenta obtener la foto del artista desde la Wikipedia API.
 * Actualiza el elemento <img> directamente cuando la obtiene.
 */
async function fetchArtistPhotoFromWiki(artistName, imgElement, fallbackSrc) {
  const key = artistName.split(/[,&\/]/)[0].trim();
  if (_wikiPhotoCache[key] !== undefined) {
    imgElement.src = _wikiPhotoCache[key] || fallbackSrc;
    return;
  }
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(key)}&prop=pageimages&format=json&pithumbsize=400&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data?.query?.pages || {};
    const page = Object.values(pages)[0];
    const thumb = page?.thumbnail?.source;
    if (thumb) {
      _wikiPhotoCache[key] = thumb;
      imgElement.src = thumb;
    } else {
      _wikiPhotoCache[key] = null;
      imgElement.src = fallbackSrc;
    }
  } catch {
    _wikiPhotoCache[key] = null;
    imgElement.src = fallbackSrc;
  }
}

const media = [
 
















    {
    type:     "music",
    title:    "In Da Getto",
    artist:   "J. Balvin, Skrillex",
    cover:    "https://i.ytimg.com/vi/7aPzYlc2RY4/maxresdefault.jpg",
    file:     "./Music/indagetto.mp3",
    category: "Reggaeton",
    duration: "2:10"
  },
  {
    type:     "music",
    title:    "I'm Good (Blue)",
    artist:   "David Guetta, Bebe Rexha",
    cover:    "https://m.media-amazon.com/images/I/51R8fS3ESYL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/imgood.mp3",
    category: "Electronic",
    duration: "2:57"
  },
  {
    type:     "music",
    title:    "FADE",
    artist:   "Alesso, Pendulum",
    cover:    "https://i.scdn.co/image/ab67616d0000b273dcbb69d4be6c29c0be851f32",
    file:     "./Music/fade.mp3",
    category: "Electronic",
    duration: "3:03"
  },
  {
    type:     "music",
    title:    "Enzaciao",
    artist:   "Clarent",
    cover:    "https://i.scdn.co/image/ab67616d0000b27386b1784848d2cc7ccd58e05e",
    file:     "./Music/enzaciao.mp3",
    category: "Reggaeton",
    duration: "2:05"
  },
  {
    type:     "music",
    title:    "Désenchantée",
    artist:   "Kate Ryan",
    cover:    "https://i.scdn.co/image/ab67616d00001e02b8faab714250452ae5ea2122",
    file:     "./Music/desenchante.mp3",
    category: "90s",
    duration: "3:40"
  },
  {
    type:     "music",
    title:    "Azukita",
    artist:   "Steve Aoki, Daddy Yankee, Play-N-Skillz & Elvis Crespo",
    cover:    "https://i.ytimg.com/vi/mGN3kfEk_P4/maxresdefault.jpg",
    file:     "./Music/azukita.mp3",
    category: "Reggaeton",
    duration: "3:46"
  },
  {
    type:     "music",
    title:    "Atlantis",
    artist:   "Netherworld",
    cover:    "https://m.media-amazon.com/images/I/51R59lHZtYL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/atlantis.mp3",
    category: "Electronic",
    duration: "2:26"
  },
  {
    type:     "music",
    title:    "Ecuador",
    artist:   "SASH",
    cover:    "https://m.media-amazon.com/images/I/71Vx2arL6vL._UF894,1000_QL80_.jpg",
    file:     "./Music/ecuador.mp3",
    category: "Electronic",
    duration: "5:25"
  },
  {
    type:     "music",
    title:    "Freed from desire",
    artist:   "GALA",
    cover:    "https://cdn-images.dzcdn.net/images/cover/ba8311a74318c401fb64d7594018f44d/0x1900-000000-80-0-0.jpg",
    file:     "./Music/frefromdesier.mp3",
    category: "90s",
    duration: "3:35"
  },
  {
    type:     "music",
    title:    "Que Calor (Remix)",
    artist:   "Major Lazer, J Balvin, El Alfa",
    cover:    "https://i.scdn.co/image/ab67616d0000b2739380d5f0cd2e17fdb7c1109c",
    file:     "./Music/quecalor.mp3",
    category: "Reggaeton",
    duration: "2:50"
  },
  {
    type:     "music",
    title:    "Classy 101",
    artist:   "FEID, YOUNG MIKO",
    cover:    "https://m.media-amazon.com/images/I/61vTly9zD+L._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/classy.mp3",
    category: "Reggaeton",
    duration: "3:15"
  },
  {
    type:     "music",
    title:    "BADGYAL",
    artist:   "SAIKO, JC Reyes, Dei V",
    cover:    "https://i1.sndcdn.com/artworks-by0H8XlmcCvzkf5u-6bxytg-t1080x1080.jpg",
    file:     "./Music/badgyal.mp3",
    category: "Reggaeton",
    duration: "4:14"
  },
  {
    type:     "music",
    title:    "Playa Del Inglés",
    artist:   "Quevedo, Myke Towers",
    cover:    "https://media.emisorasmusicales.net/wp-content/uploads/2023/02/11013844/nnn.jpg",
    file:     "./Music/playadelingles.mp3",
    category: "Reggaeton",
    duration: "4:15"
  },
  {
    type:     "music",
    title:    "Se Fue",
    artist:   "Moncho Chavea, Morad",
    cover:    "https://i.scdn.co/image/ab67616d0000b273c7b6b68108ab221bb07f5aa6",
    file:     "./Music/sefue.mp3",
    category: "Reggaeton",
    duration: "2:55"
  },
  {
    type:     "music",
    title:    "RITMO",
    artist:   "Black Eyed Peas, J Balvin",
    cover:    "https://i.ytimg.com/vi/C9xrAJ_rmBw/maxresdefault.jpg",
    file:     "./Music/ritmo.mp3",
    category: "Reggaeton",
    duration: "3:38"
  },
  {
    type:     "music",
    title:    "International Love",
    artist:   "Pitbull, Chris Brown",
    cover:    "https://i.ytimg.com/vi/OLqaMYc9LFE/maxresdefault.jpg",
    file:     "./Music/internationallove.mp3",
    category: "Dance-Pop",
    duration: "4:08"
  },
  {
    type:     "music",
    title:    "Hey Baby",
    artist:   "Pitbull, T-Pain",
    cover:    "https://i1.sndcdn.com/artworks-000033071708-e6mxid-t500x500.jpg",
    file:     "./Music/heybaby.mp3",
    category: "Dance-Pop",
    duration: "3:24"
  },
  {
    type:     "music",
    title:    "Give Me Everything",
    artist:   "Pitbull, Ne-Yo, Afrojack, Nayer",
    cover:    "https://i1.sndcdn.com/artworks-haGUy7OWdKcoRgMH-Zglw6A-t1080x1080.jpg",
    file:     "./Music/givemeeverything.mp3",
    category: "Dance-Pop",
    duration: "4:26"
  },
  {
    type:     "music",
    title:    "On The Floor",
    artist:   "Jennifer Lopez, Pitbull",
    cover:    "https://i.scdn.co/image/ab67616d0000b2735c7fdd07d99c156401073aaa",
    file:     "./Music/onthefloor.mp3",
    category: "Dance-Pop",
    duration: "4:26"
  },
  {
    type:     "music",
    title:    "Feel This Moment",
    artist:   "Christina Aguilera, Pitbull",
    cover:    "https://m.media-amazon.com/images/I/9197wAEPZcL._UF894,1000_QL80_.jpg",
    file:     "./Music/feelthismoment.mp3",
    category: "Dance-Pop",
    duration: "3:46"
  },
  {
    type:     "music",
    title:    "Fireball",
    artist:   "John Ryan, Pitbull",
    cover:    "https://m.media-amazon.com/images/I/71aqqhM+cFL._UF894,1000_QL80_.jpg",
    file:     "./Music/fireball.mp3",
    category: "Dance-Pop",
    duration: "4:01"
  },
  {
    type:     "music",
    title:    "MUCHACHA",
    artist:   "AISSA, RVFV",
    cover:    "https://i.scdn.co/image/ab67616d0000b273bf3151af9c5e4d7c1de59ae9",
    file:     "./Music/muchacha.mp3",
    category: "Reggaeton",
    duration: "2:48"
  },
  {
    type:     "music",
    title:    "Dema Ga Ge Gi Go Gu",
    artist:   "Bad Bunny, El Alfa",
    cover:    "https://i1.sndcdn.com/artworks-000287886533-fxhmn2-t500x500.jpg",
    file:     "./Music/demaga.mp3",
    category: "Reggaeton",
    duration: "3:38"
  },
  {
    type:     "music",
    title:    "Happy Birthday",
    artist:   "Tempo, El Alfa",
    cover:    "https://i.scdn.co/image/ab67616d0000b2736e3e2d32da74925922b4976f",
    file:     "./Music/happy.mp3",
    category: "Reggaeton",
    duration: "2:37"
  },
  {
    type:     "music",
    title:    "Taki Taki",
    artist:   "DJ Snake, Selena Gomez, Ozuna, Cardi B",
    cover:    "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2018/09/28/15381371183299.jpg",
    file:     "./Music/takitaki.mp3",
    category: "Reggaeton",
    duration: "3:51"
  },
  {
    type:     "music",
    title:    "6 AM",
    artist:   "J Balvin, Farruko",
    cover:    "https://i1.sndcdn.com/artworks-000083532431-1yokz6-t1080x1080.jpg",
    file:     "./Music/6am.mp3",
    category: "Reggaeton",
    duration: "4:38"
  },
  {
    type:     "music",
    title:    "Pepas",
    artist:   "Farruko",
    cover:    "https://i.scdn.co/image/ab67616d0000b2733e3957dcca26c5f4ecf015ad",
    file:     "./Music/pepas.mp3",
    category: "Reggaeton",
    duration: "4:54"
  },
  {
    type:     "music",
    title:    "DÁKITI",
    artist:   "BAD BUNNY, JHAY CORTEZ",
    cover:    "https://i.scdn.co/image/ab67616d00001e02005ee342f4eef2cc6e8436ab",
    file:     "./Music/dakiti.mp3",
    category: "Reggaeton",
    duration: "3:33"
  },
  {
    type:     "music",
    title:    "LOVE",
    artist:   "Clarent",
    cover:    "https://i.scdn.co/image/ab67616d0000b273ecb5fbeae355fb9554341de4",
    file:     "./Music/love.mp3",
    category: "Reggaeton",
    duration: "2:44"
  },
  {
    type:     "music",
    title:    "AURORA",
    artist:   "Mora, De La Rose",
    cover:    "https://images.genius.com/9b4acd648c12aa172b1b4ec9f8eaf4da.1000x1000x1.png",
    file:     "./Music/aurora.mp3",
    category: "Reggaeton",
    duration: "3:12"
  },
  {
    type:     "music",
    title:    "POR SI MAÑANA NO ESTOY",
    artist:   "Omar Courtz",
    cover:    "https://cdn-images.dzcdn.net/images/cover/1ef9489b58a25622c2e3d2aa0473dde0/0x1900-000000-80-0-0.jpg",
    file:     "./Music/porsimañana.mp3",
    category: "Reggaeton",
    duration: "4:24"
  },
  {
    type:     "music",
    title:    "444 (Remix)",
    artist:   "Yan Block, De La Rose, Hades66, Ñengo Flow",
    cover:    "https://i.scdn.co/image/ab67616d0000b2735cc8552f86ba4cc528968d2d",
    file:     "./Music/444remix.mp3",
    category: "Reggaeton",
    duration: "4:59"
  },
  {
    type:     "music",
    title:    "ETA (Remix)",
    artist:   "Roa, De La Rose, Luar La L, Omar Courtz, Yan Block",
    cover:    "https://i.ytimg.com/vi/awbt4MRXuck/maxresdefault.jpg",
    file:     "./Music/etaremix.mp3",
    category: "Reggaeton",
    duration: "7:42"
  },
  {
    type:     "music",
    title:    "QLOO*",
    artist:   "Young Cister, Kreamly",
    cover:    "https://m.media-amazon.com/images/I/51qThLr9dIL._SX354_SY354_BL0_QL100__UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/qloo.mp3",
    category: "Reggaeton",
    duration: "2:47"
  },
  {
    type:     "music",
    title:    "LUCES DE COLORES",
    artist:   "Omar Courtz",
    cover:    "https://i.scdn.co/image/ab67616d0000b273996764071dbd5240eefb2422",
    file:     "./Music/lucesdecolores.mp3",
    category: "Reggaeton",
    duration: "3:36"
  },
  {
    type:     "music",
    title:    "IA",
    artist:   "Clarent, Mora",
    cover:    "https://i1.sndcdn.com/artworks-jATMMIVeQ5n5-0-t500x500.jpg",
    file:     "./Music/ia.mp3",
    category: "Reggaeton",
    duration: "2:51"
  },
  {
    type:     "music",
    title:    "Yo sé",
    artist:   "Yan Block",
    cover:    "https://m.media-amazon.com/images/I/31vUXtxjAgL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/yose.mp3",
    category: "Reggaeton",
    duration: "2:09"
  },
  {
    type:     "music",
    title:    "Mi Gente",
    artist:   "J Balvin, Willy William",
    cover:    "https://i1.sndcdn.com/artworks-000283629944-3i7bfp-t500x500.jpg",
    file:     "./Music/migente.mp3",
    category: "Reggaeton",
    duration: "3:07"
  },
  {
    type:     "music",
    title:    "Fuera Del Planeta (Remix)",
    artist:   "Eloy, Jowell & Randy, Zion",
    cover:    "https://i.scdn.co/image/ab67616d0000b273da7076e371c7859fbb2e18fd",
    file:     "./Music/fueradelplaneta.mp3",
    category: "Reggaeton",
    duration: "3:42"
  },
  {
    type:     "music",
    title:    "Morado",
    artist:   "J Balvin",
    cover:    "https://images.genius.com/ace3305e3501f40ee3d52e48731096b6.1000x1000x1.png",
    file:     "./Music/morado.mp3",
    category: "Reggaeton",
    duration: "3:52"
  },
  {
    type:     "music",
    title:    "Amarillo",
    artist:   "J Balvin",
    cover:    "https://images.genius.com/aa0eab4478dec1d231a5b96909f9b7d4.1000x1000x1.jpg",
    file:     "./Music/amarillo.mp3",
    category: "Reggaeton",
    duration: "2:47"
  },
  {
    type:     "music",
    title:    "Me Rehúso",
    artist:   "Danny Ocean",
    cover:    "https://cdn-images.dzcdn.net/images/cover/2312f5f5d53b0fb5238a4bc58d2f6cf6/1900x1900-000000-81-0-0.jpg",
    file:     "./Music/merehuso.mp3",
    category: "Reggaeton",
    duration: "3:25"
  },
  {
    type:     "music",
    title:    "NUBES",
    artist:   "De La Rose, Omar Courtz",
    cover:    "https://m.media-amazon.com/images/I/51qeKvk9ilL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/nubes.mp3",
    category: "Reggaeton",
    duration: "4:31"
  },
  {
    type:     "music",
    title:    "MODELITO",
    artist:   "Mora, YOVNGCHIMI",
    cover:    "https://i.scdn.co/image/ab67616d0000b2732a5c6164e8743597f44b645e",
    file:     "./Music/modelito.mp3",
    category: "Reggaeton",
    duration: "3:10"
  },
  {
    type:     "music",
    title:    "FLIPA",
    artist:   "JC REYES, DEI V",
    cover:    "https://i.scdn.co/image/ab67616d0000b2739d8645e943c9c45d66da0d7c",
    file:     "./Music/flipa.mp3",
    category: "Reggaeton",
    duration: "2:45"
  },
  {
    type:     "music",
    title:    "Me Mareo",
    artist:   "Kidd Voodoo, JC Reyes",
    cover:    "https://m.media-amazon.com/images/I/511UiqJjmZL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/memareo.mp3",
    category: "Reggaeton",
    duration: "3:06"
  },
  {
    type:     "music",
    title:    "Lo Que Tiene",
    artist:   "Morad, Beny Jr, Rvfv",
    cover:    "https://i.scdn.co/image/ab67616d0000b27345e6bba1ac0c5b54a9ee8121",
    file:     "./Music/loquetiene.mp3",
    category: "Reggaeton",
    duration: "4:19"
  },
  {
    type:     "music",
    title:    "El Conjuntito",
    artist:   "El Bobe, Omar Montes",
    cover:    "https://i.scdn.co/image/ab67616d0000b273412a45f6d65252ae3d1fac4c",
    file:     "./Music/elconjuntito.mp3",
    category: "Reggaeton",
    duration: "2:37"
  },
  {
    type:     "music",
    title:    "X (Remix)",
    artist:   "Nicky Jam, J Balvin, Ozuna, Maluma",
    cover:    "https://i.scdn.co/image/ab67616d0000b2738e17b8d0bf76a205bba297bd",
    file:     "./Music/xremix.mp3",
    category: "Reggaeton",
    duration: "3:55"
  },
  {
    type:     "music",
    title:    "Manos Rotas",
    artist:   "DELLAFUENTE, Morad",
    cover:    "https://i.scdn.co/image/ab67616d0000b2731a176de75067ededc26ad96d",
    file:     "./Music/manosrotas.mp3",
    category: "Reggaeton",
    duration: "2:45"
  },
  {
    type:     "music",
    title:    "KOKO",
    artist:   "Omar Courtz",
    cover:    "https://images.genius.com/f201d42444f05535e679524c12538736.1000x1000x1.png",
    file:     "./Music/koko.mp3",
    category: "Reggaeton",
    duration: "3:16"
  },
    {
    type:     "music",
    title:    "Y Que Fue?",
    artist:   "Don Miguelo",
    cover:    "https://i.ytimg.com/vi/16nZ6K7sim4/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGUgWyhLMA8=&rs=AOn4CLAm5BKIjd4rwtUHQHFpRU5wZArpbA",
    file:     "./Music/yquefue.mp3",
    category: "Reggaeton",
    duration: "2:43"
  },
    {
    type:     "music",
    title:    "Gata Only",
    artist:   "FloyyMenor, Cris MJ",
    cover:    "https://i.scdn.co/image/ab67616d0000b273c4583f3ad76630879a75450a",
    file:     "./Music/gataonly.mp3",
    category: "Reggaeton",
    duration: "3:42"
  },
    {
    type:     "music",
    title:    "FOREVER TU GANTEL",
    artist:   "Omar Courtz, Ñengo Flow",
    cover:    "https://m.media-amazon.com/images/I/41Qlx8iByTL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/forevertugantel.mp3",
    category: "Reggaeton",
    duration: "3:46"
  },
    {
    type:     "music",
    title:    "NINFO",
    artist:   "JC Reyes, De La Rose, MC Menor JP",
    cover:    "https://images.genius.com/60b39231e971719e4c609413d5bcc851.1000x1000x1.png",
    file:     "./Music/ninfo.mp3",
    category: "Reggaeton",
    duration: "3:04"
  },
    {
    type:     "music",
    title:    "China",
    artist:   "Anuel AA, Karol G, J. Balvin, Daddy Yankee, Ozuna",
    cover:    "https://i.scdn.co/image/ab67616d0000b2735fa6dc9fc261344044c301a9",
    file:     "./Music/china.mp3",
    category: "Reggaeton",
    duration: "4:55"
  },
    {
    type:     "music",
    title:    "Gasolina",
    artist:   "Daddy Yankee",
    cover:    "https://i.scdn.co/image/ab67616d0000b2734f15e5871e85d1da64024c3d",
    file:     "./Music/gasolina.mp3",
    category: "Reggaeton",
    duration: "3:12"
  },
    {
    type:     "music",
    title:    "Mayores",
    artist:   "Becky G, Bad Bunny",
    cover:    "https://cdn-images.dzcdn.net/images/cover/b6d13738038b285630370f5be059380f/0x1900-000000-80-0-0.jpg",
    file:     "./Music/mayores.mp3",
    category: "Reggaeton",
    duration: "3:21"
  },
    {
    type:     "music",
    title:    "Sin Pijama",
    artist:   "Becky G, Natti Natasha",
    cover:    "https://i.scdn.co/image/ab67616d0000b273d7ce6f9b0a15181635a933d9",
    file:     "./Music/sinpijama.mp3",
    category: "Reggaeton",
    duration: "3:08"
  },
    {
    type:     "music",
    title:    "Moulaga",
    artist:   "Heuss L'enfoiré, JuL",
    cover:    "https://m.media-amazon.com/images/I/51QolFGPe7L._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/moulaga.mp3",
    category: "Reggaeton",
    duration: "2:56"
  },
    {
    type:     "music",
    title:    "MALA",
    artist:   "6ix9ine, Anuel AA",
    cover:    "https://i1.sndcdn.com/artworks-000447592197-j0yaci-large.jpg",
    file:     "./Music/mala.mp3",
    category: "Reggaeton",
    duration: "3:26"
  },
    {
    type:     "music",
    title:    "Downtown",
    artist:   "Anitta, J Balvin",
    cover:    "https://i.scdn.co/image/ab67616d0000b2738c6b830c36c7b4ac43c3cee8",
    file:     "./Music/downtown.mp3",
    category: "Reggaeton",
    duration: "3:19"
  },
   {
    type:     "music",
    title:    "Ram Pam Pam",
    artist:   "Natti Natasha, Becky G",
    cover:    "https://linkstorage.linkfire.com/medialinks/images/446136ec-c173-43e7-9612-94c1829582a3/artwork-440x440.jpg",
    file:     "./Music/rampampam.mp3",
    category: "Reggaeton",
    duration: "3:38"
  },
   {
    type:     "music",
    title:    "La Gozadera",
    artist:   "Gente De Zona, Marc Anthony",
    cover:    "https://images.genius.com/cf43fd45336758c065537970f6a79f96.1000x1000x1.jpg",
    file:     "./Music/lagozadera.mp3",
    category: "Reggaeton",
    duration: "3:23"
  },
   {
    type:     "music",
    title:    "BAILE INoLVIDABLE",
    artist:   "BAD BUNNY",
    cover:    "https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411",
    file:     "./Music/baileinolvidable.mp3",
    category: "Reggaeton",
    duration: "6:18"
  },
   {
    type:     "music",
    title:    "Con Altura",
    artist:   "ROSALÍA, J Balvin, El Guincho",
    cover:    "https://images.genius.com/a8b0efd41e6a43091837da78850cf312.1000x1000x1.png",
    file:     "./Music/conaltura.mp3",
    category: "Reggaeton",
    duration: "2:44"
  },
   {
    type:     "music",
    title:    "La Bicicleta",
    artist:   "Carlos Vives, Shakira",
    cover:    "https://i.scdn.co/image/ab67616d0000b273e588b4129b0afd8595ac55b0",
    file:     "./Music/labicicleta.mp3",
    category: "Reggaeton",
    duration: "3:46"
  },
   {
    type:     "music",
    title:    "NUEVAYoL",
    artist:   "BAD BUNNY",
    cover:    "https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411",
    file:     "./Music/nuevayol.mp3",
    category: "Reggaeton",
    duration: "3:43"
  },
   {
    type:     "music",
    title:    "Singapur (Remix)",
    artist:   "El Alfa, Farruko, Myke Towers, Justin Quiles, Chencho Corleone",
    cover:    "https://i.scdn.co/image/ab67616d0000b273c32233e3541a756a90880fb1",
    file:     "./Music/singapur.mp3",
    category: "Reggaeton",
    duration: "4:50"
  },
   {
    type:     "music",
    title:    "Azul",
    artist:   "J Balvin",
    cover:    "https://www.lahiguera.net/musicalia/artistas/j_balvin/disco/10426/tema/23157/j_balvin_azul-portada.jpg",
    file:     "./Music/azul.mp3",
    category: "Reggaeton",
    duration: "3:55"
  },
   {
    type:     "music",
    title:    "Lola",
    artist:   "Jedis, Gote, Nolep",
    cover:    "https://i.scdn.co/image/ab67616d00001e02fb1041333d9a712a182acfa0",
    file:     "./Music/lola.mp3",
    category: "Reggaeton",
    duration: "4:23"
  },
   {
    type:     "music",
    title:    "Thalía (Remix)",
    artist:   "Cyril Kamer, Rvfv, Polimá Westcoast",
    cover:    "https://i.scdn.co/image/ab67616d0000b2733e242bdd9632c6a49a693b1b",
    file:     "./Music/thaliaremix.mp3",
    category: "Reggaeton",
    duration: "3:50"
  },
    {
    type:     "music",
    title:    "DAVID GUETTA MASHUP",
    artist:   "David Guetta",
    cover:    "https://i.ytimg.com/vi/UhBfoDqaOhk/maxresdefault.jpg",
    file:     "./Music/davidguettamashup.mp3",
    category: "Electronic",
    duration: "2:42"
  },
    {
    type:     "music",
    title:    "Sientate en Ese Deo",
    artist:   "El Alfa",
    cover:    "https://images.genius.com/6898ac4006eb392cc4c2fe4429fb3c57.597x597x1.png",
    file:     "./Music/sientateenesedeo.mp3",
    category: "Reggaeton",
    duration: "4:42"
  },
    {
    type:     "music",
    title:    "La Gerencia",
    artist:   "Tito El Bambino, Fronti, Wisin, Hanzel La H, Arcángel",
    cover:    "https://akamai.sscdn.co/uploadfile/letras/albuns/b/3/4/0/4332821765558369.jpg",
    file:     "./Music/lagerencia.mp3",
    category: "Reggaeton",
    duration: "5:00"
  },
    {
    type:     "music",
    title:    "Dembow y Reggaeton",
    artist:   "El Alfa, Yandel, Myke Towers",
    cover:    "https://i.scdn.co/image/ab67616d0000b273c4e2ae0d7a6ba307bdd3cc0d",
    file:     "./Music/dembowyreggaeton.mp3",
    category: "Reggaeton",
    duration: "4:11"
  },
    {
    type:     "music",
    title:    "BESALO",
    artist:   "EL ALFA, Rauw Alejandro",
    cover:    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMVwbetQqCv73bf6t9mP31J9CucAlGW_k8YA&s",
    file:     "./Music/besalo.mp3",
    category: "Reggaeton",
    duration: "2:43"
  },
   {
    type:     "music",
    title:    "Caile",
    artist:   "Luar La L",
    cover:    "https://i.scdn.co/image/ab67616d0000b27305c2cc3e87e9aa15d9db3dd9",
    file:     "./Music/caile.mp3",
    category: "Reggaeton",
    duration: "2:21"
  },
   {
    type:     "music",
    title:    "No Me Conoce (Remix)",
    artist:   "Jhay Cortez, J. Balvin, Bad Bunny",
    cover:    "https://images.genius.com/2115ebd8003b44a027daa8d52cbcf08c.1000x1000x1.png",
    file:     "./Music/nomeconoceremix.mp3",
    category: "Reggaeton",
    duration: "5:05"
  },
 {
    type:     "music",
    title:    "Soltera (Remix)",
    artist:   "Lunay, Daddy Yankee, Bad Bunny",
    cover:    "https://i.scdn.co/image/ab67616d0000b27358e34ee7bc215e1b03ff78d4",
    file:     "./Music/solteraremix.mp3",
    category: "Reggaeton",
    duration: "4:25"
  },
 {
    type:     "music",
    title:    "Q U E V A S H A C E R H O Y ?",
    artist:   "Omar Courtz, De La Rose",
    cover:    "https://cdn-images.dzcdn.net/images/cover/bafa3d3f485cf157d393eb84f7db9f71/500x500.jpg",
    file:     "./Music/q_u_e_v_a_s_h_a_c_e_r_h_o_y.mp3",
    category: "Reggaeton",
    duration: "3:44"
  },
 {
    type:     "music",
    title:    "Hola Señorita",
    artist:   "GIMS, Maluma",
    cover:    "https://m.media-amazon.com/images/M/MV5BZDI1NzIxMTctZTUxMi00NmY4LWEzODAtYWQ1NWEwMGE0MWFhXkEyXkFqcGc@._V1_QL75_UY190_CR31,0,190,190_.jpg",
    file:     "./Music/holaseñorita.mp3",
    category: "Reggaeton",
    duration: "3:33"
  },
   {
    type:     "music",
    title:    "MOTINHA 2.0 (Remix)",
    artist:   "Dennis DJ, Luísa Sonza, Emilia",
    cover:    "https://s.mxmcdn.net/images-storage/albums2/4/7/9/3/2/5/87523974_500_500.jpg",
    file:     "./Music/motinha.mp3",
    category: "Reggaeton",
    duration: "1:58"
  },
   {
    type:     "music",
    title:    "Si Se Da (Remix)",
    artist:   "Myke Towers, Farruko, Arcangel, Sech, Zion",
    cover:    "https://images.genius.com/eb6adbb6247e85fca2cc94fb9388fd3a.1000x1000x1.png",
    file:     "./Music/siseda.mp3",
    category: "Reggaeton",
    duration: "5:35"
  },
   {
    type:     "music",
    title:    "4K",
    artist:   "El Alfa, Darell, Noriel",
    cover:    "https://m.media-amazon.com/images/I/41H6GkRuYiL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/4k.mp3",
    category: "Reggaeton",
    duration: "3:35"
  },
   {
    type:     "music",
    title:    "Tusa",
    artist:   "KAROL G, Nicki Minaj",
    cover:    "https://upload.wikimedia.org/wikipedia/en/0/07/Karol_G_featuring_Nicki_Minaj_-_Tusa.png",
    file:     "./Music/tusa.mp3",
    category: "Reggaeton",
    duration: "3:23"
  },
   {
    type:     "music",
    title:    "La Forma En Que Me Miras",
    artist:   "Super Yei, Sammy, Myke Towers, Lenny Tavarez, Rafa Pabon",
    cover:    "https://i1.sndcdn.com/artworks-000384998541-nkcy6u-t500x500.jpg",
    file:     "./Music/laformaenquemiras.mp3",
    category: "Reggaeton",
    duration: "5:03"
  },
   {
    type:     "music",
    title:    "Superman Sin Capa",
    artist:   "El Alfa",
    cover:    "https://m.media-amazon.com/images/I/519xrzwtqjL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/supermansincapa.mp3",
    category: "Reggaeton",
    duration: "3:50"
  },
   {
    type:     "music",
    title:    "Cuando No Era Cantante (Remix)",
    artist:   "El Bogueto, Anuel AA, Fuerza Regida, Yung Beef",
    cover:    "https://cdn-images.dzcdn.net/images/cover/e62f70e7b366e618da1cbf0eed47de8c/0x1900-000000-80-0-0.jpg",
    file:     "./Music/cuandonoeracantante.mp3",
    category: "Reggaeton",
    duration: "5:27"
  },
   {
    type:     "music",
    title:    "Ya No Tiene Novio",
    artist:   "Sebastián Yatra, Mau, Ricky",
    cover:    "https://i.scdn.co/image/ab67616d0000b273f89d8cc59e29c9d2f846e903",
    file:     "./Music/yanotienenovio.mp3",
    category: "Reggaeton",
    duration: "4:07"
  },
  {
    type:     "music",
    title:    "TALENTO",
    artist:   "YAN BLOCK",
    cover:    "https://images.genius.com/d96f36811a933372f0199ecbaa890fef.1000x1000x1.png",
    file:     "./Music/talento.mp3",
    category: "Reggaeton",
    duration: "2:33"
  },
  {
    type:     "music",
    title:    "BIENVENIDA",
    artist:   "Clarent",
    cover:    "https://images.genius.com/4852cb7ec2963e5f72b1e8f87e8928e3.1000x1000x1.png",
    file:     "./Music/bienvenida.mp3",
    category: "Reggaeton",
    duration: "1:45"
  },
  {
    type:     "music",
    title:    "Secuestro",
    artist:   "SLAYTER, Yan Block, NTG",
    cover:    "https://m.media-amazon.com/images/I/61KjgepxdwL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/secuestro.mp3",
    category: "Reggaeton",
    duration: "3:14"
  },
  {
    type:     "music",
    title:    "YOGURCITO (REMIX)",
    artist:   "Blessd, Anuel AA, Yan Block, Luar La L, Kris R, ROA",
    cover:    "https://m.media-amazon.com/images/I/31P5CYOaluL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/yogurcito.mp3",
    category: "Reggaeton",
    duration: "6:15"
  },
  {
    type:     "music",
    title:    "X’CLUSIVO (REMIX)",
    artist:   "GONZY, SAIKO, ARCANGEL",
    cover:    "https://i.scdn.co/image/ab67616d0000b2735327757614a832374e491778",
    file:     "./Music/xclusivo.mp3",
    category: "Reggaeton",
    duration: "3:35"
  },
  {
    type:     "music",
    title:    "COOOK PARDON",
    artist:   "LVBEL C5, AKDO",
    cover:    "https://i.scdn.co/image/ab67616d0000b2738e675f63b19c17334f7d62d9",
    file:     "./Music/cookpardon.mp3",
    category: "Reggaeton",
    duration: "1:32"
  },
   {
    type:     "music",
    title:    "Be My Lover",
    artist:   "La Bouche",
    cover:    "https://i.scdn.co/image/ab67616d00001e0288b506a4908da817dcabd4f3",
    file:     "./Music/bemylover.mp3",
    category: "90s",
    duration: "3:42"
  },
   {
    type:     "music",
    title:    "Destination Calabria",
    artist:   "Alex Gaudino, Crystal Waters",
    cover:    "https://cdn-images.dzcdn.net/images/cover/3cd44e7420b88ced60beb8daea52b11a/0x1900-000000-80-0-0.jpg",
    file:     "./Music/destination.mp3",
    category: "90s",
    duration: "3:03"
  },
   {
    type:     "music",
    title:    "Happy Nation",
    artist:   "Ace of Base",
    cover:    "https://m.media-amazon.com/images/I/51z3joghdnL._UF894,1000_QL80_.jpg",
    file:     "./Music/happynation.mp3",
    category: "90s",
    duration: "3:31"
  },
   {
    type:     "music",
    title:    "Gimme! Gimme! Gimme!",
    artist:   "ABBA",
    cover:    "https://upload.wikimedia.org/wikipedia/en/a/a5/ABBA_-_Gimme%21_Gimme%21_Gimme%21_%28A_Man_After_Midnight%29.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    file:     "./Music/gimme.mp3",
    category: "90s",
    duration: "3:16"
  },
   {
    type:     "music",
    title:    "Lay All Your Love On Me",
    artist:   "ABBA",
    cover:    "https://i.ebayimg.com/images/g/O4kAAOxydlFSxW0j/s-l400.jpg",
    file:     "./Music/layallyourloveonme.mp3",
    category: "90s",
    duration: "4:40"
  },
   {
    type:     "music",
    title:    "La Isla Bonita",
    artist:   "Madonna",
    cover:    "https://m.media-amazon.com/images/I/81Iv8WsxUwL._UF894,1000_QL80_.jpg",
    file:     "./Music/laIslabonita.mp3",
    category: "90s",
    duration: "4:01"
  },
   {
    type:     "music",
    title:    "The Rhythm of the Night",
    artist:   "Corona",
    cover:    "https://cdn-images.dzcdn.net/images/cover/b3442cde5c53baa308dd569b5dbd46c1/1900x1900-000000-81-0-0.jpg",
    file:     "./Music/therhythmoftthenight.mp3",
    category: "90s",
    duration: "3:46"
  },
   {
    type:     "music",
    title:    "Stereo Love",
    artist:   "Edward Maya, Vika Jigulina",
    cover:    "https://i.scdn.co/image/ab67616d0000b273edd7dc7bf5f7c39d3e132490",
    file:     "./Music/stereolove.mp3",
    category: "90s",
    duration: "3:06"
  },
   {
    type:     "music",
    title:    "Barbie Girl",
    artist:   "Aqua",
    cover:    "https://cdn-images.dzcdn.net/images/cover/eaf83c8d5d9d21d6ddd380222bc2fc72/1900x1900-000000-81-0-0.jpg",
    file:     "./Music/barbiegirl.mp3",
    category: "90s",
    duration: "3:21"
  },
     {
    type:     "music",
    title:    "Around the World",
    artist:   "A Touch Of Class",
    cover:    "https://i.scdn.co/image/ab67616d00001e020fe766b9ffa406173ada8747",
    file:     "./Music/aroundtheworld.mp3",
    category: "90s",
    duration: "3:35"
  },
     {
    type:     "music",
    title:    "What Is Love",
    artist:   "Haddaway",
    cover:    "https://upload.wikimedia.org/wikipedia/en/a/a8/HaddawayWhatIsLoveMaxiCDCover.jpg",
    file:     "./Music/whatislove.mp3",
    category: "90s",
    duration: "4:00"
  },
     {
    type:     "music",
    title:    "Stayin' Alive",
    artist:   "Bee Gees",
    cover:    "https://m.media-amazon.com/images/M/MV5BZmU5M2E3M2MtM2M5My00YTI2LThkNDktNjk5MGE2NzAxNTZlXkEyXkFqcGc@._V1_.jpg",
    file:     "./Music/stayinalive.mp3",
    category: "90s",
    duration: "4:09"
  },
     {
    type:     "music",
    title:    "I Was Made For Lovin' You",
    artist:   "Kiss",
    cover:    "https://i.discogs.com/ZDR0sVMA4m0HNMH-M1w8qfzxOX_9HL_t76I8QjohXcQ/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM2Njg0/NzEtMTMzOTYwMDc2/MS0zNDU2LmpwZWc.jpeg",
    file:     "./Music/iwasmadeforlovinyou.mp3",
    category: "90s",
    duration: "3:58"
  },
     {
    type:     "music",
    title:    "Don't Stop The Music",
    artist:   "Rihanna",
    cover:    "https://i.scdn.co/image/ab67616d0000b273f9f27162ab1ed45b8d7a7e98",
    file:     "./Music/dontstopthemusic.mp3",
    category: "Dance-Pop",
    duration: "3:53"
  },
     {
    type:     "music",
    title:    "Poker Face",
    artist:   "Lady Gaga",
    cover:    "https://i.scdn.co/image/ab67616d0000b2739ff8dea75219ec13530d97f1",
    file:     "./Music/pokerface.mp3",
    category: "Dance-Pop",
    duration: "3:33"
  },
      {
    type:     "music",
    title:    "Better Off Alone",
    artist:   "Alice Deejay",
    cover:    "https://m.media-amazon.com/images/I/51jZFJRbIeL._UF894,1000_QL80_.jpg",
    file:     "./Music/betteroffalone.mp3",
    category: "90s",
    duration: "2:55"
  },
      {
    type:     "music",
    title:    "I'm Still Standing",
    artist:   "Elton John",
    cover:    "https://i.scdn.co/image/ab67616d0000b27373fd9802ec887972ecdacac2",
    file:     "./Music/istillstanding.mp3",
    category: "Dance-Pop",
    duration: "3:02"
  },
      {
    type:     "music",
    title:    "Aserejé",
    artist:   "Las Ketchup",
    cover:    "https://cdn-images.dzcdn.net/images/cover/be45674dc35c8f974a934dc3779c7b59/0x1900-000000-80-0-0.jpg",
    file:     "./Music/asereje.mp3",
    category: "Dance-Pop",
    duration: "3:33"
  },
      {
    type:     "music",
    title:    "I know you want me",
    artist:   "PITBULL",
    cover:    "https://i1.sndcdn.com/artworks-1AWknYa8R73YKDa6-ca4Cbw-t1080x1080.jpg",
    file:     "./Music/iknowyouwantme.mp3",
    category: "Dance-Pop",
    duration: "4:00"
  },
      {
    type:     "music",
    title:    "BLA BLA BLA",
    artist:   "GIGI D'AGOSTINO",
    cover:    "https://m.media-amazon.com/images/I/61Le1BprXyS._UF894,1000_QL80_.jpg",
    file:     "./Music/bla_bla_bla.mp3",
    category: "Electronic",
    duration: "3:11"
  },
      {
    type:     "music",
    title:    "Danza Kuduro",
    artist:   "Don Omar, Lucenzo",
    cover:    "https://i.scdn.co/image/ab67616d0000b2737b31a1e4b17d0c4d9a00d357",
    file:     "./Music/danzakuduro.mp3",
    category: "Reggaeton",
    duration: "3:18"
  },
  {
    type:     "music",
    title:    "Olvidar",
    artist:   "Morad",
    cover:    "https://cdn-images.dzcdn.net/images/cover/272af21ce5be9cbd3d4ac0db0cc0cab5/0x1900-000000-80-0-0.jpg",
    file:     "./Music/olvidar.mp3",
    category: "Reggaeton",
    duration: "2:57"
  },
  {
    type:     "music",
    title:    "SIGUE",
    artist:   "BENY JR FT MORAD",
    cover:    "https://images.genius.com/6f4195419969480a4fbd80dab61266a0.1000x1000x1.png",
    file:     "./Music/sigue.mp3",
    category: "Reggaeton",
    duration: "3:31"
  },
  {
    type:     "music",
    title:    "Contento",
    artist:   "Morad",
    cover:    "https://images.genius.com/3c69ccbd190cec4a98edf084a658c01d.1000x1000x1.png",
    file:     "./Music/contento.mp3",
    category: "Reggaeton",
    duration: "3:30"
  },
  {
    type:     "music",
    title:    "Soñar",
    artist:   "Morad",
    cover:    "https://i.scdn.co/image/ab67616d0000b273dfc07c8c7df28f36fad5017f",
    file:     "./Music/soñar.mp3",
    category: "Reggaeton",
    duration: "4:15"
  },
  {
    type:     "music",
    title:    "Te Boté (Remix)",
    artist:   "Nio Garcia, Casper Magico, Bad Bunny, Darell, Ozuna, Nicky Jam",
    cover:    "https://i.scdn.co/image/ab67616d0000b273a5779a2f04a513fac2fd1d15",
    file:     "./Music/tebote.mp3",
    category: "Reggaeton",
    duration: "6:58"
  },
  {
    type:     "music",
    title:    "Esclava (Remix)",
    artist:   "Anonimus, Almighty, Anuel AA, Bryant Myers",
    cover:    "https://i.scdn.co/image/ab67616d0000b273fc974b3893de83eba6c1f862",
    file:     "./Music/esclava.mp3",
    category: "Reggaeton",
    duration: "4:41"
  },
  {
    type:     "music",
    title:    "BRAQUAGE DE L’ÉTÉ",
    artist:   "YOUKA, CYRIL KAMER",
    cover:    "https://m.media-amazon.com/images/I/51MCuWWbx5L._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/braquage_del_eté.mp3",
    category: "Reggaeton",
    duration: "2:09"
  },
  {
    type:     "music",
    title:    "Casanova",
    artist:   "LOLA ÍNDIGO, RVFV, SOOLKING",
    cover:    "https://universalmusic.es/wp-content/uploads/sites/50/2023/12/lola_indigo_top5.jpeg",
    file:     "./Music/casanova.mp3",
    category: "Reggaeton",
    duration: "4:03"
  },
    {
    type:     "music",
    title:    "Prendio (Remix)",
    artist:   "RVFV, OMAR MONTES, DAVILES DE NOVELDA",
    cover:    "https://cdn-images.dzcdn.net/images/cover/c72ce1a61f596e9723839de3c591d023/0x1900-000000-80-0-0.jpg",
    file:     "./Music/prendio.mp3",
    category: "Reggaeton",
    duration: "3:11"
  },
    {
    type:     "music",
    title:    "La rubia (Remix 2)",
    artist:   "La nueva escuela, Omar Montes",
    cover:    "https://m.media-amazon.com/images/I/51g3CMJ0UZL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/larubia.mp3",
    category: "Reggaeton",
    duration: "3:30"
  },
    {
    type:     "music",
    title:    "MUEVE ESE CULO",
    artist:   "JC REYES, GLOOSITO",
    cover:    "https://m.media-amazon.com/images/I/413QydatXeL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/mueveeseculo.mp3",
    category: "Reggaeton",
    duration: "2:33"
  },
    {
    type:     "music",
    title:    "Magic In The Air",
    artist:   "Magic System, Ahmed Chawki",
    cover:    "https://m.media-amazon.com/images/I/71BxXSyM6GL._UF894,1000_QL80_.jpg",
    file:     "./Music/magic_in_the_air.mp3",
    category: "Dance-Pop",
    duration: "3:53"
  },
    {
    type:     "music",
    title:    "C'est La Vie",
    artist:   "Khaled",
    cover:    "https://m.media-amazon.com/images/I/611ckdsBGeL._UF894,1000_QL80_.jpg",
    file:     "./Music/c'est_la_vie.mp3",
    category: "Dance-Pop",
    duration: "3:47"
  },
    {
    type:     "music",
    title:    "A Sky Full Of Stars",
    artist:   "Coldplay",
    cover:    "https://i1.sndcdn.com/artworks-000086432916-4b0kzg-t1080x1080.jpg",
    file:     "./Music/a_sky_full_of_stars.mp3",
    category: "Dance-Pop",
    duration: "4:13"
  },
    {
    type:     "music",
    title:    "Viva La Vida",
    artist:   "Coldplay",
    cover:    "https://m.media-amazon.com/images/I/9145yafeO2L._UF894,1000_QL80_.jpg",
    file:     "./Music/viva_la_vida.mp3",
    category: "Dance-Pop",
    duration: "4:02"
  },
    {
    type:     "music",
    title:    "Paradise",
    artist:   "Coldplay",
    cover:    "https://upload.wikimedia.org/wikipedia/en/2/22/Coldplay_-_Paradise.JPG",
    file:     "./Music/paradise.mp3",
    category: "Dance-Pop",
    duration: "4:20"
  },
    {
    type:     "music",
    title:    "Clocks",
    artist:   "Coldplay",
    cover:    "https://m.media-amazon.com/images/I/41POdN+-ZcL._UF894,1000_QL80_.jpg",
    file:     "./Music/clocks.mp3",
    category: "Dance-Pop",
    duration: "4:15"
  },
    {
    type:     "music",
    title:    "Adventure Of A Lifetime",
    artist:   "Coldplay",
    cover:    "https://i.scdn.co/image/ab67616d0000b2738ff7c3580d429c8212b9a3b6",
    file:     "./Music/adventure_of_a_lifetime.mp3",
    category: "Dance-Pop",
    duration: "4:24"
  },
    {
    type:     "music",
    title:    "Fix You",
    artist:   "Coldplay",
    cover:    "https://cdn-images.dzcdn.net/images/cover/8a1a3e7c5e46b5f763328d95431ac19a/1900x1900-000000-80-0-0.jpg",
    file:     "./Music/fix_you.mp3",
    category: "Dance-Pop",
    duration: "4:53"
  },
    {
    type:     "music",
    title:    "Hymn For The Weekend",
    artist:   "Coldplay",
    cover:    "https://cdn-images.dzcdn.net/images/cover/5df065fdcbaffd0f83d09789bad9d2db/1900x1900-000000-80-0-0.jpg",
    file:     "./Music/hymn_for_the_weekend.mp3",
    category: "Dance-Pop",
    duration: "4:20"
  },
     {
    type:     "music",
    title:    "L'Amour Toujours",
    artist:   "Gigi D'Agostino",
    cover:    "https://m.media-amazon.com/images/I/71a-IQRpEYL._UF894,1000_QL80_.jpg",
    file:     "./Music/l_amour_toujours.mp3",
    category: "90s",
    duration: "4:01"
  },
       {
    type:     "music",
    title:    "The Riddle",
    artist:   "Gigi D'Agostino",
    cover:    "https://i.scdn.co/image/ab67616d0000b273d8f8af4309c24d540b6f9128",
    file:     "./Music/the_riddle.mp3",
    category: "90s",
    duration: "3:24"
  },
       {
    type:     "music",
    title:    "Another Way",
    artist:   "Gigi D'Agostino",
    cover:    "https://shop.blancoynegro.com/4924-large_default/gigi-d-agostino-another-way-marble-vinyl.jpg",
    file:     "./Music/another_way.mp3",
    category: "90s",
    duration: "6:03"
  },
         {
    type:     "music",
    title:    "YO y TÚ",
    artist:   "Ovy On The Drums, Quevedo, Beéle",
    cover:    "https://media.motivafm.es/wp-content/uploads/2025/06/30103026/images.jpeg",
    file:     "./Music/yo_y_tú.mp3",
    category: "Reggaeton",
    duration: "3:18"
  },
         {
    type:     "music",
    title:    "SHINY",
    artist:   "EASYKID",
    cover:    "https://images.genius.com/1995e27f519734bc292c49e7f1fcf9c6.1000x1000x1.png",
    file:     "./Music/shiny.mp3",
    category: "Reggaeton",
    duration: "2:37"
  },
         {
    type:     "music",
    title:    "Santa",
    artist:   "Rvssian x Rauw Alejandro x Ayra Starr",
    cover:    "https://m.media-amazon.com/images/I/51Jn+yat4DL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/santa.mp3",
    category: "Reggaeton",
    duration: "3:13"
  },
         {
    type:     "music",
    title:    "ADIVINO",
    artist:   "Myke Towers, Bad Bunny",
    cover:    "https://cdn-images.dzcdn.net/images/cover/7d4bfd96b8744fc8ca9b475c81254418/0x1900-000000-80-0-0.jpg",
    file:     "./Music/adivino.mp3",
    category: "Reggaeton",
    duration: "4:38"
  },
         {
    type:     "music",
    title:    "Ride Or Die Pt. 2",
    artist:   "Sevdaliza, Tokischa, Villano Antillano",
    cover:    "https://m.media-amazon.com/images/I/513DswxlqbL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/ride_or_die_pt_2.mp3",
    category: "Reggaeton",
    duration: "2:39"
  },
         {
    type:     "music",
    title:    "SI NO ES CONTIGO",
    artist:   "Cris MJ",
    cover:    "https://cdn-images.dzcdn.net/images/cover/0bd32c8cb02372f394ca2b602bfaf2fe/0x1900-000000-80-0-0.jpg",
    file:     "./Music/si_no_es_contigo.mp3",
    category: "Reggaeton",
    duration: "2:38"
  },
         {
    type:     "music",
    title:    "BELLAKEO",
    artist:   "Peso Pluma, Anitta",
    cover:    "https://pics.filmaffinity.com/peso_pluma_anitta_bellakeo-952115569-mmed.jpg",
    file:     "./Music/bellakeo.mp3",
    category: "Reggaeton",
    duration: "3:18"
  },
         {
    type:     "music",
    title:    "Yandel 150",
    artist:   "Yandel, Feid",
    cover:    "https://m.media-amazon.com/images/I/51FqssjQaLL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/yandel150.mp3",
    category: "Reggaeton",
    duration: "3:36"
  },
         {
    type:     "music",
    title:    "Clavaito",
    artist:   "Chanel, Abraham Mateo",
    cover:    "https://images.genius.com/3a494e516ff0fce415ef807ab097ed32.1000x1000x1.jpg",
    file:     "./Music/clavaito.mp3",
    category: "Reggaeton",
    duration: "2:42"
  },
         {
    type:     "music",
    title:    "Mon Amour (Remix)",
    artist:   "Zzoilo, Aitana",
    cover:    "https://i.scdn.co/image/ab67616d0000b2730317d0bdead0b5050f0c2656",
    file:     "./Music/monamour.mp3",
    category: "Reggaeton",
    duration: "3:00"
  },
         {
    type:     "music",
    title:    "Blah Blah Blah",
    artist:   "Armin van Buuren",
    cover:    "https://cdn-images.dzcdn.net/images/cover/9da9fd102b5ecbaece028b725d9da59c/1900x1900-000000-80-0-0.jpg",
    file:     "./Music/blahblahblah.mp3",
    category: "Electronic",
    duration: "3:13"
  },
         {
    type:     "music",
    title:    "Turn It Up",
    artist:   "Armin van Buuren",
    cover:    "https://i.scdn.co/image/ab67616d0000b273adb479942159dea093c86fa5",
    file:     "./Music/turnitup.mp3",
    category: "Electronic",
    duration: "3:03"
  },
         {
    type:     "music",
    title:    "Animals",
    artist:   "Martin Garrix",
    cover:    "https://i.scdn.co/image/ab67616d0000b273c4a03dba6c420bda982b3f62",
    file:     "./Music/animals.mp3",
    category: "Electronic",
    duration: "3:06"
  },
         {
    type:     "music",
    title:    " Titanium [Live Edit]",
    artist:   "Sia, David Guetta, MORTEN",
    cover:    "https://cdn-images.dzcdn.net/images/cover/b1da2dd795492946f90722f6fa871adb/0x1900-000000-80-0-0.jpg",
    file:     "./Music/titanium(liveedit).mp3",
    category: "Electronic",
    duration: "3:16"
  },
         {
    type:     "music",
    title:    "Outside",
    artist:   "Calvin Harris, Ellie Goulding",
    cover:    "https://www.alexurbanpop.com/wp-content/uploads/2014/11/Calvin-Harris-ft.-Ellie-Goulding-Outside.jpg",
    file:     "./Music/outside.mp3",
    category: "Electronic",
    duration: "3:45"
  },
         {
    type:     "music",
    title:    "Bad",
    artist:   "David Guetta, Showtek, Vassy",
    cover:    "https://i1.sndcdn.com/artworks-000100525488-ou5n5t-t500x500.jpg",
    file:     "./Music/bad.mp3",
    category: "Electronic",
    duration: "2:50"
  },
          {
    type:     "music",
    title:    "Jamaican (Bam Bam)",
    artist:   "HUGEL, SOLTO",
    cover:    "https://m.media-amazon.com/images/I/51kkslWHRkL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/jamaicanbambam.mp3",
    category: "Electronic",
    duration: "4:45"
  },
          {
    type:     "music",
    title:    "Move Your Body",
    artist:   "Dimitri Vegas, Like Mike, Timmy Trumpet, Sub Zero Project",
    cover:    "https://i1.sndcdn.com/artworks-hyUDQ5WzQFmetzAy-hYHSwA-t500x500.jpg",
    file:     "./Music/moveyourbodytimmyytumpet.mp3",
    category: "Electronic",
    duration: "2:50"
  },
          {
    type:     "music",
    title:    "Thank You (Not So Bad)",
    artist:   "Dimitri Vegas, Like Mike, Tiësto, Dido, W&W",
    cover:    "https://i1.sndcdn.com/artworks-SzvymHnuSjCZ20aN-zjjm3Q-t500x500.jpg",
    file:     "./Music/thankyounotsobad.mp3",
    category: "Electronic",
    duration: "2:19"
  },
          {
    type:     "music",
    title:    "The Spectre",
    artist:   "Alan Walker",
    cover:    "https://i1.sndcdn.com/artworks-000375722355-fxlohc-t500x500.jpg",
    file:     "./Music/thespectre.mp3",
    category: "Electronic",
    duration: "3:26"
  },
         {
    type:     "music",
    title:    "All The Stars",
    artist:   "Kendrick Lamar, SZA",
    cover:    "https://external-preview.redd.it/kendrick-lamar-sza-all-the-stars-1425x1425-v0-sg2vjFNVymrGj6SBX2YAqGRS4DpfReI4rHG4ZkO9kiQ.jpg?auto=webp&s=6f7f26782817e77656af393352807edcf6a98d19",
    file:     "./Music/allthestars.mp3",
    category: "Dance-Pop",
    duration: "3:54"
  },
           {
    type:     "music",
    title:    "LA INOCENTE",
    artist:   "Mora, Feid",
    cover:    "https://images.genius.com/a4af721758b67745a66042a5dcf45c83.1000x1000x1.png",
    file:     "./Music/lainocente.mp3",
    category: "Reggaeton",
    duration: "3:20"
  },
           {
    type:     "music",
    title:    "A Solas (Remix)",
    artist:   "Lunay, Lyanno, Anuel AA, Brytiago, Alex Rose",
    cover:    "https://i.scdn.co/image/ab67616d0000b273fddcbb546dd3440b1897c4c7",
    file:     "./Music/asolasremix.mp3",
    category: "Reggaeton",
    duration: "4:33"
  },
           {
    type:     "music",
    title:    "Luna",
    artist:   "Feid, ATL Jacob",
    cover:    "https://media.motivafm.es/wp-content/uploads/2023/12/14111441/a6817a29955bc26af0ed704b2e705bee.1000x1000x1.png",
    file:     "./Music/luna.mp3",
    category: "Reggaeton",
    duration: "3:16"
  },
           {
    type:     "music",
    title:    "Columbia",
    artist:   "Quevedo",
    cover:    "https://m.media-amazon.com/images/I/417eQyJPmHL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/columbia.mp3",
    category: "Reggaeton",
    duration: "3:25"
  },
           {
    type:     "music",
    title:    "DEGENERE",
    artist:   "Myke Towers & benny blanco",
    cover:    "https://i1.sndcdn.com/artworks-GH2OElzFEMUrAg9L-mWrQzw-t500x500.png",
    file:     "./Music/degenere.mp3",
    category: "Reggaeton",
    duration: "2:12"
  },
           {
    type:     "music",
    title:    "Desesperados",
    artist:   "Rauw Alejandro, Chencho Corleone",
    cover:    "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Rauw_Alejandro%2C_Chencho_Corleone_-_Desesperados.jpeg/250px-Rauw_Alejandro%2C_Chencho_Corleone_-_Desesperados.jpeg",
    file:     "./Music/desesperados.mp3",
    category: "Reggaeton",
    duration: "3:45"
  },
           {
    type:     "music",
    title:    "CABELO LOIRINHO",
    artist:   "KEVIN DO RECIFE, MC MORENA, THIAGUINHO DO RECIFE",
    cover:    "https://images.genius.com/da50480499543acea79f42969b3225d7.640x640x1.jpg",
    file:     "./Music/cabelolorinho.mp3",
    category: "Reggaeton",
    duration: "3:20"
  },
           {
    type:     "music",
    title:    "Punto G",
    artist:   "Quevedo",
    cover:    "https://m.media-amazon.com/images/I/41uLLdflAIL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/puntog.mp3",
    category: "Reggaeton",
    duration: "2:35"
  },
             {
    type:     "music",
    title:    "LALA",
    artist:   "Myke Towers",
    cover:    "https://i1.sndcdn.com/artworks-fMPBciEwqIpuMI49-Cfk5Dg-t500x500.jpg",
    file:     "./Music/lala.mp3",
    category: "Reggaeton",
    duration: "3:17"
  },
             {
    type:     "music",
    title:    "SEYA",
    artist:   "Morad, GIMS, Sativa Music",
    cover:    "https://m.media-amazon.com/images/I/41Wz9YI5AnL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/seya.mp3",
    category: "Reggaeton",
    duration: "3:06"
  },
             {
    type:     "music",
    title:    "LOS DEL ESPACIO",
    artist:   "LIT killah, Tiago PZK, Maria Becerra, Duki, Emilia, Big One, FMK",
    cover:    "https://fotografias.flooxernow.com/clipping/cmsimages01/2023/06/02/82B9AC5F-DA27-4258-B928-FDD97CAB556D/espacio_103.jpg?crop=960,720,x161,y0&width=1200&height=900&optimize=low&format=webply",
    file:     "./Music/losdelespacio.mp3",
    category: "Reggaeton",
    duration: "5:38"
  },
  {
    type:     "music",
    title:    "Diosa",
    artist:   "Myke Towers",
    cover:    "https://images.genius.com/83f8d7b3e75f152bbc6889c11a9348bd.1000x1000x1.png",
    file:     "./Music/diosa.mp3",
    category: "Reggaeton",
    duration: "3:35"
  },
             {
    type:     "music",
    title:    "El Efecto",
    artist:   "Rauw Alejandro, Chencho Corleone",
    cover:    "https://upload.wikimedia.org/wikipedia/en/0/02/Rauw_Alejandro%2C_Chencho_Corleone_-_El_Efecto.jpeg",
    file:     "./Music/elefecto.mp3",
    category: "Reggaeton",
    duration: "3:27"
  },
             {
    type:     "music",
    title:    "SUPERESTRELLA",
    artist:   "Aitana",
    cover:    "https://ih1.redbubble.net/image.6030595463.8549/fposter,small,wall_texture,square_product,600x600.jpg",
    file:     "./Music/superestrella.mp3",
    category: "Reggaeton",
    duration: "3:03"
  },
             {
    type:     "music",
    title:    "Como Camaron",
    artist:   "Estopa",
    cover:    "https://m.media-amazon.com/images/I/41-8AcQWaIL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/comocamaron.mp3",
    category: "Pop",
    duration: "3:27"
  },
             {
    type:     "music",
    title:    "Sé lo que hicisteis",
    artist:   "Melendi",
    cover:    "https://e.snmc.io/i/1200/s/b1ff1312b37ec497e4e81a4ecc6fa75f/3536693",
    file:     "./Music/seloquehicisteis.mp3",
    category: "Pop",
    duration: "3:45"
  },
             {
    type:     "music",
    title:    "La casa por el tejado",
    artist:   "Fito & Fitipaldis",
    cover:    "https://i1.sndcdn.com/artworks-mRlMQWq12FtD-0-t500x500.jpg",
    file:     "./Music/lacasaporeltejado.mp3",
    category: "Pop",
    duration: "4:03"
  },
             {
    type:     "music",
    title:    "La Raja de Tu Falda",
    artist:   "Estopa",
    cover:    "https://m.media-amazon.com/images/M/MV5BOGM1MzdhODAtYTkxZS00NDE5LWJhZDktNmIyNGQ4MzQxMDEwXkEyXkFqcGc@._V1_QL75_UY190_CR29,0,190,190_.jpg",
    file:     "./Music/larajadetufalda.mp3",
    category: "Pop",
    duration: "3:22"
  },
             {
    type:     "music",
    title:    "Partiendo la Pana",
    artist:   "Estopa",
    cover:    "https://i.discogs.com/6EE8aWqwWRkMioZqnY_3FQUp8WpdO45EQKCYRnKbQh4/rs:fit/g:sm/q:90/h:378/w:378/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI3MjQ2/MzctMTM2NTE3ODY1/NC03MDk5LmpwZWc.jpeg",
    file:     "./Music/partiendolapana.mp3",
    category: "Pop",
    duration: "4:12"
  },
             {
    type:     "music",
    title:    "Paseo",
    artist:   "Estopa",
    cover:    "https://cdn-images.dzcdn.net/images/cover/a0d6b3649f9abcd41e1822bbaf446c11/1900x1900-000000-80-0-0.jpg",
    file:     "./Music/paseo.mp3",
    category: "Pop",
    duration: "3:39"
  },
             {
    type:     "music",
    title:    "Ojitos Rojos",
    artist:   "Estopa",
    cover:    "https://lastfm.freetls.fastly.net/i/u/300x300/3f64a85667484270bbe936153ab9dbe8.jpg",
    file:     "./Music/ojitosrojos.mp3",
    category: "Pop",
    duration: "4:25"
  },
             {
    type:     "music",
    title:    "Me Quedaré",
    artist:   "Estopa",
    cover:    "https://i.scdn.co/image/ab67616d0000b273769d0cf8ba5af48a1a84e6f0",
    file:     "./Music/mequedare.mp3",
    category: "Pop",
    duration: "3:17"
  },
             {
    type:     "music",
    title:    "El del Medio de los Chichos",
    artist:   "Estopa",
    cover:    "https://i.scdn.co/image/ab67616d0000b273b3e5a036a7c5875c5d7a92e6",
    file:     "./Music/eldelmediodeloschichos.mp3",
    category: "Pop",
    duration: "3:47"
  },
             {
    type:     "music",
    title:    "Soldadito marinero",
    artist:   "Fito & Fitipaldis",
    cover:    "https://i.scdn.co/image/ab67616d00001e02a618985542a38277dc088c3a",
    file:     "./Music/soldaditomarinero.mp3",
    category: "Pop",
    duration: "3:59"
  },
             {
    type:     "music",
    title:    "Por la boca vive el pez",
    artist:   "Fito & Fitipaldis",
    cover:    "https://i.scdn.co/image/ab67616d00001e02a618985542a38277dc088c3a",
    file:     "./Music/porlabocaviveelpez.mp3",
    category: "Pop",
    duration: "4:30"
  },
             {
    type:     "music",
    title:    "Antes de que cuente diez",
    artist:   "Fito & Fitipaldis",
    cover:    "https://i.scdn.co/image/ab67616d00001e02a618985542a38277dc088c3a",
    file:     "./Music/antesdequecuente10.mp3",
    category: "Pop",
    duration: "4:41"
  },
               {
    type:     "music",
    title:    "Barbie de extrarradio",
    artist:   "Melendi",
    cover:    "https://i.scdn.co/image/ab67616d0000b2735399dac2e1d87d8dd29a41c9",
    file:     "./Music/barbiedeextraradio.mp3",
    category: "Pop",
    duration: "3:44"
  },
               {
    type:     "music",
    title:    "Caminando Por La Vida",
    artist:   "Melendi",
    cover:    "https://akamai.sscdn.co/uploadfile/letras/albuns/6/6/2/c/836641579176509.jpg",
    file:     "./Music/caminandoporlavida.mp3",
    category: "Pop",
    duration: "3:23"
  },
               {
    type:     "music",
    title:    "Tu Jardín Con Enanitos",
    artist:   "Melendi",
    cover:    "https://i.scdn.co/image/ab67616d0000b273420c7ba982f6f92351fc0a2b",
    file:     "./Music/tujardinconenanitos.mp3",
    category: "Pop",
    duration: "4:27"
  },
               {
    type:     "music",
    title:    "Déjala Que Baile",
    artist:   "Melendi, Alejandro Sanz, Arkano",
    cover:    "https://i1.sndcdn.com/artworks-000360404208-vbxpsk-t500x500.jpg",
    file:     "./Music/dejalaquebaile.mp3",
    category: "Pop",
    duration: "4:17"
  },
               {
    type:     "music",
    title:    "Californication",
    artist:   "Red Hot Chili Peppers",
    cover:    "https://i.scdn.co/image/ab67616d0000b273a9249ebb15ca7a5b75f16a90",
    file:     "./Music/californication.mp3",
    category: "Pop",
    duration: "5:21"
  },
               {
    type:     "music",
    title:    "Otherside",
    artist:   "Red Hot Chili Peppers",
    cover:    "https://akamai.sscdn.co/uploadfile/letras/fotos/f/0/4/4/f044e2cbeca7631d98e3c6a3f2319e3f-tb4.jpg",
    file:     "./Music/otherside.mp3",
    category: "Pop",
    duration: "4:17"
  },
               {
    type:     "music",
    title:    "Scar Tissue",
    artist:   "Red Hot Chili Peppers",
    cover:    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ-_w19IgDWMtDqJoIyvggszgtUsw3R0xbYA&s",
    file:     "./Music/scartissue.mp3",
    category: "Pop",
    duration: "3:40"
  },
               {
    type:     "music",
    title:    "Smells Like Teen Spirit",
    artist:   "Nirvana",
    cover:    "https://i.scdn.co/image/ab67616d0000b273e175a19e530c898d167d39bf",
    file:     "./Music/smellsliketeenspirit.mp3",
    category: "Pop",
    duration: "4:38"
  },
               {
    type:     "music",
    title:    "Seven Nation Army",
    artist:   "The White Stripes",
    cover:    "https://m.media-amazon.com/images/I/61sAc-wMnlL._UF894,1000_QL80_.jpg",
    file:     "./Music/sevennationarmy.mp3",
    category: "Pop",
    duration: "3:58"
  },
               {
    type:     "music",
    title:    "Snow",
    artist:   "Red Hot Chili Peppers",
    cover:    "https://m.media-amazon.com/images/M/MV5BMjE4NzA0MzY2M15BMl5BanBnXkFtZTgwODMzODI5NTE@._V1_FMjpg_UX1000_.jpg",
    file:     "./Music/snow.mp3",
    category: "Pop",
    duration: "5:49"
  },
               {
    type:     "music",
    title:    "Dani California",
    artist:   "Red Hot Chili Peppers",
    cover:    "https://upload.wikimedia.org/wikipedia/en/d/d6/Dani_california.gif",
    file:     "./Music/danicalifornia.mp3",
    category: "Pop",
    duration: "4:47"
  },
              {
    type:     "music",
    title:    "CONEXIÓN",
    artist:   "Kemzz",
    cover:    "https://i.postimg.cc/jjjz7PpG/Chat-GPT-Image-28-may-2026-18-57-07.png",
    file:     "./Music/conexionvila.mp3",
    category: "Reggaeton",
    duration: "2:32"
  },
              {
    type:     "music",
    title:    "KIÉN E?",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/quiene.mp3",
    category: "No se",
    duration: "3:41"
  },
              {
    type:     "music",
    title:    "PAYAS",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/payas.mp3",
    category: "No se",
    duration: "4:35"
  },
              {
    type:     "music",
    title:    "MARDOSA",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/mardosa.mp3",
    category: "No se",
    duration: "2:09"
  },
              {
    type:     "music",
    title:    "KIKE Y WANILLO",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/kikeywanillo.mp3",
    category: "No se",
    duration: "2:25"
  },
              {
    type:     "music",
    title:    "FELA",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/fela.mp3",
    category: "No se",
    duration: "2:18"
  },
              {
    type:     "music",
    title:    "POR ALGO SERÁ",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/poralgosera.mp3",
    category: "No se",
    duration: "2:39"
  },
              {
    type:     "music",
    title:    "MALDITA FARLOPA",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/malafarlopa.mp3",
    category: "No se",
    duration: "2:58"
  },
              {
    type:     "music",
    title:    "La Bandite",
    artist:   "JuL",
    cover:    "https://i.scdn.co/image/ab67616d0000b2734a073de113a960b895bf838e",
    file:     "./Music/labandite.mp3",
    category: "Reggaeton",
    duration: "2:46"
  },
                {
    type:     "music",
    title:    "LA GRACIOSA",
    artist:   "Quevedo, Elvis Crespo",
    cover:    "https://images.genius.com/a90f642ebbf88596e4b9773614cab132.1000x1000x1.png",
    file:     "./Music/lagraciosa.mp3",
    category: "Reggaeton",
    duration: "4:17"
  },
                {
    type:     "music",
    title:    "AL GOLPITO",
    artist:   "Quevedo, Nueva Línea",
    cover:    "https://images.genius.com/a90f642ebbf88596e4b9773614cab132.1000x1000x1.png",
    file:     "./Music/algolpito.mp3",
    category: "Reggaeton",
    duration: "3:27"
  },
                {
    type:     "music",
    title:    "NI BORRACHO",
    artist:   "Quevedo",
    cover:    "https://i1.sndcdn.com/artworks-vuqTqo6xOIKR-0-t500x500.jpg",
    file:     "./Music/niborracho.mp3",
    category: "Reggaeton",
    duration: "4:08"
  },
                {
    type:     "music",
    title:    "Volcans",
    artist:   "Buhos",
    cover:    "https://cdn-images.dzcdn.net/images/cover/2d11d4afcd2651434b321536d53ce0c1/1900x1900-000000-80-0-0.jpg",
    file:     "./Music/volcans.mp3",
    category: "Catalanes",
    duration: "3:45"
  },
                {
    type:     "music",
    title:    "Caminem Lluny",
    artist:   "Doctor Prats",
    cover:    "https://www.viasona.cat/imatges/discos/doctor-prats-caminem-lluny-portada.jpg",
    file:     "./Music/caminemlluny.mp3",
    category: "Catalanes",
    duration: "4:00"
  },
                {
    type:     "music",
    title:    "Tutu Turú",
    artist:   "Siderland",
    cover:    "https://i.scdn.co/image/ab67616d0000b273b46f297be12fdcc0cdc07394",
    file:     "./Music/tututuru.mp3",
    category: "Catalanes",
    duration: "3:40"
  },
                {
    type:     "music",
    title:    "Camins, Somnis i Promeses",
    artist:   "Sopa de Cabra",
    cover:    "https://m.media-amazon.com/images/I/51xE1YqsxmL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/caminssomnisipromeses.mp3",
    category: "Catalanes",
    duration: "2:43"
  },
                {
    type:     "music",
    title:    "a la freSka",
    artist:   "Figa Flawas",
    cover:    "https://www.viasona.cat/imatges/viasona.cat/discos/figa-flawas-a-la-freska-portada.jpg",
    file:     "./Music/alafreska.mp3",
    category: "Catalanes",
    duration: "2:58"
  },
                {
    type:     "music",
    title:    "LA FALDA",
    artist:   "Myke Towers",
    cover:    "https://cdn-images.dzcdn.net/images/cover/afc1539c3fe20a2fed707ba72aacbb05/500x500.jpg",
    file:     "./Music/lafalda.mp3",
    category: "Reggaeton",
    duration: "3:47"
  },
                {
    type:     "music",
    title:    "Madrid City",
    artist:   "Ana Mena",
    cover:    "https://i.scdn.co/image/ab67616d0000b27357d3916c661917951085047c",
    file:     "./Music/madridcity.mp3",
    category: "Reggaeton",
    duration: "3:10"
  },
                {
    type:     "music",
    title:    "AVÍSAME x HOT",
    artist:   "JC Reyes, Inna",
    cover:    "https://i1.sndcdn.com/artworks-11890D8ZnXz40yKe-IwMFLQ-t500x500.png",
    file:     "./Music/avismasexhot.mp3",
    category: "Mashups",
    duration: "2:22"
  },
                {
    type:     "music",
    title:    "Contra La Pared",
    artist:   "Sean Paul, J Balvin",
    cover:    "https://i1.sndcdn.com/artworks-000597385118-o5cf6a-t500x500.jpg",
    file:     "./Music/contralapared.mp3",
    category: "Reggaeton",
    duration: "3:55"
  },
                {
    type:     "music",
    title:    "Peligrosa",
    artist:   "FloyyMenor",
    cover:    "https://m.media-amazon.com/images/I/51KxT7+HAJL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/peligrosa.mp3",
    category: "Reggaeton",
    duration: "2:16"
  },
                {
    type:     "music",
    title:    "Capaz X We Found Love",
    artist:   "Vilu Gontero, Ima Tolosa, SoundWorld",
    cover:    "https://m.media-amazon.com/images/I/41LYZstJAUL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/capazxwefoundlove.mp3",
    category: "Mashups",
    duration: "2:50"
  },
                {
    type:     "music",
    title:    "El Conjuntito X Freed From Desire",
    artist:   "Omar Montes, El Bobe, Gala",
    cover:    "https://i1.sndcdn.com/artworks-45nPzb9GySqhFCLV-UkUw7A-t500x500.jpg",
    file:     "./Music/elconjuntitoxfreedfromdesire.mp3",
    category: "Mashups",
    duration: "2:52"
  },
                {
    type:     "music",
    title:    "POLARIS REMIX X QUIERE BEBER",
    artist:   "Anna Gisbert",
    cover:    "https://i.scdn.co/image/ab67616d0000b2738f4a278cd5b5b2f65a0f87fd",
    file:     "./Music/polarisremixxquierebeber.mp3",
    category: "Mashups",
    duration: "5:48"
  },
                {
    type:     "music",
    title:    "Toca Toca x Calabria x Thrift Shop",
    artist:   "Winged",
    cover:    "https://i1.sndcdn.com/artworks-2GvSuy8lz0WzEn6y-JaaflA-t500x500.jpg",
    file:     "./Music/tocatocaxcalabriaxthriftshop.mp3",
    category: "Mashups",
    duration: "3:09"
  },
                {
    type:     "music",
    title:    "Pelele x Estrellita de Madrugada",
    artist:   "Morad, Daddy Yankee, Omega",
    cover:    "https://i1.sndcdn.com/artworks-gyRycQPzGgqhE74i-m907gw-t500x500.jpg",
    file:     "./Music/pelelexestrellitademadrugada.mp3",
    category: "Mashups",
    duration: "5:21"
  },
                {
    type:     "music",
    title:    "SETEADORA x MOTINHA 2.0 x MARTILLANDO",
    artist:   "Sergio Salinas",
    cover:    "https://m.media-amazon.com/images/I/51KSlr8YNTL._UXNaN_FMjpg_QL85_.jpg",
    file:     "./Music/seteadoraxmotinha2.0xmartillando.mp3",
    category: "Mashups",
    duration: "5:19"
  },
                {
    type:     "music",
    title:    "GASOLINA X MOTINHA 2.0",
    artist:   "Samu Castillo",
    cover:    "https://vipremixer.winkermind.com/mediafiles/2025/Junio/Vip%20Remixer/images/artworks-ckz9jjiIacjH3SmO-yYHs6g-t500x500.jpg",
    file:     "./Music/gasolinaxmotinha.mp3",
    category: "Mashups",
    duration: "3:44"
  },
                {
    type:     "music",
    title:    "Pa Madrid",
    artist:   "El Barrio",
    cover:    "https://i.scdn.co/image/ab67616d0000b273ed7a7c05d060233bb36faf71",
    file:     "./Music/pamadrid.mp3",
    category: "Pop",
    duration: "4:22"
  },
                {
    type:     "music",
    title:    "Crónicas de una loca",
    artist:   "El Barrio",
    cover:    "https://i.scdn.co/image/ab67616d0000b273ed7a7c05d060233bb36faf71",
    file:     "./Music/cronicasdeunaloca.mp3",
    category: "Pop",
    duration: "4:21"
  },
                {
    type:     "music",
    title:    "El Danzar De Las Mariposas",
    artist:   "El Barrio",
    cover:    "https://i.scdn.co/image/ab67616d0000b273ed7a7c05d060233bb36faf71",
    file:     "./Music/eldanzardelasmariposas.mp3",
    category: "Pop",
    duration: "4:16"
  },
                {
    type:     "music",
    title:    "Abreme la puerta",
    artist:   "El Barrio",
    cover:    "https://i.scdn.co/image/ab67616d0000b273ed7a7c05d060233bb36faf71",
    file:     "./Music/abremelapuerta.mp3",
    category: "Pop",
    duration: "4:36"
  },
                {
    type:     "music",
    title:    "Ángel Malherido",
    artist:   "El Barrio",
    cover:    "https://i.scdn.co/image/ab67616d0000b273ed7a7c05d060233bb36faf71",
    file:     "./Music/Ángel Malherido.mp3",
    category: "Pop",
    duration: "4:27"
  },
                {
    type:     "music",
    title:    "El Licenciao",
    artist:   "El Barrio",
    cover:    "https://i.scdn.co/image/ab67616d0000b273ed7a7c05d060233bb36faf71",
    file:     "./Music/ellicenciao.mp3",
    category: "Pop",
    duration: "4:48"
  },
                {
    type:     "music",
    title:    "Quiereme",
    artist:   "El Barrio",
    cover:    "https://i.scdn.co/image/ab67616d0000b273ed7a7c05d060233bb36faf71",
    file:     "./Music/quiereme.mp3",
    category: "Pop",
    duration: "3:49"
  },
                {
    type:     "music",
    title:    "Torpe Canción",
    artist:   "El Barrio",
    cover:    "https://i.scdn.co/image/ab67616d0000b273ed7a7c05d060233bb36faf71",
    file:     "./Music/torpecancion.mp3",
    category: "Pop",
    duration: "5:01"
  },
                {
    type:     "music",
    title:    "Buena, bonita y barata",
    artist:   "El Barrio",
    cover:    "https://i.scdn.co/image/ab67616d0000b273ed7a7c05d060233bb36faf71",
    file:     "./Music/buenabonitaybarata.mp3",
    category: "Pop",
    duration: "4:18"
  },
                {
    type:     "music",
    title:    "Mal de amores",
    artist:   "El Barrio",
    cover:    "https://i.scdn.co/image/ab67616d0000b273ed7a7c05d060233bb36faf71",
    file:     "./Music/maldeamores.mp3",
    category: "Pop",
    duration: "3:23"
  },
                {
    type:     "music",
    title:    "Amores Maníos",
    artist:   "El Barrio",
    cover:    "https://i.scdn.co/image/ab67616d0000b273ed7a7c05d060233bb36faf71",
    file:     "./Music/amoresmanios.mp3",
    category: "Pop",
    duration: "4:18"
  },















           {
    type:     "music",
    title:    "VOY A LLeVARTE PA PR",
    artist:   "Bad Bunny",
    cover:    "https://upload.wikimedia.org/wikipedia/en/e/ef/Bad_Bunny_-_Deb%C3%AD_Tirar_M%C3%A1s_Fotos.png",
    file:     "./Music/voyallvartepapr.mp3",
    category: "Reggaeton",
    duration: "2:36"
  },
             {
    type:     "music",
    title:    "EoO",
    artist:   "Bad Bunny",
    cover:    "https://upload.wikimedia.org/wikipedia/en/e/ef/Bad_Bunny_-_Deb%C3%AD_Tirar_M%C3%A1s_Fotos.png",
    file:     "./Music/eoo.mp3",
    category: "Reggaeton",
    duration: "3:25"
  },
             {
    type:     "music",
    title:    "VeLDÁ",
    artist:   "Bad Bunny, Omar Courtz, Dei V",
    cover:    "https://upload.wikimedia.org/wikipedia/en/e/ef/Bad_Bunny_-_Deb%C3%AD_Tirar_M%C3%A1s_Fotos.png",
    file:     "./Music/velda.mp3",
    category: "Reggaeton",
    duration: "3:55"
  },
             {
    type:     "music",
    title:    "CAFé CON RON",
    artist:   "Bad Bunny, Omar Courtz, Dei V",
    cover:    "https://upload.wikimedia.org/wikipedia/en/e/ef/Bad_Bunny_-_Deb%C3%AD_Tirar_M%C3%A1s_Fotos.png",
    file:     "./Music/cafecron.mp3",
    category: "Reggaeton",
    duration: "3:48"
  },













































];
/* ══════════════════════════════════════════════════════
   2. STATE
══════════════════════════════════════════════════════ */
let currentFilter   = "all";
let currentSearch   = "";
let currentTrackIdx = -1;
let isPlaying       = false;
let playlist        = [];        // current PLAYBACK context (playlist, favorites, etc.)
let playlistSource  = "library"; // "library" | "playlist:<id>" | "favorites" | "history"
let shuffleMode     = false;
let repeatMode      = false;

// ── PERSISTENCE KEYS ──
const LIKED_KEY    = "droply_liked_v2";
const QUEUE_KEY    = "droply_queue_v2";
const PL_KEY       = "droply_playlists_v2";
const HIST_KEY     = "droply_history_v2";
const PLAYS_KEY    = "droply_plays_v2";

// ── LIKED ──
function loadLiked() { try { return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || "[]")); } catch(_) { return new Set(); } }
function saveLiked() { try { localStorage.setItem(LIKED_KEY, JSON.stringify([...likedTracks])); } catch(_) {} }
let likedTracks = loadLiked();

// ── QUEUE ──
function loadQueue() { try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch(_) { return []; } }
function saveQueue() { try { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)); } catch(_) {} }
let queue = loadQueue();

// ── PLAYLISTS ──
function loadPlaylists() { try { return JSON.parse(localStorage.getItem(PL_KEY) || "[]"); } catch(_) { return []; } }
function savePlaylists() { try { localStorage.setItem(PL_KEY, JSON.stringify(playlists)); } catch(_) {} }
let playlists = loadPlaylists();

// ── HISTORY ──
function loadHistory() { try { return JSON.parse(localStorage.getItem(HIST_KEY) || "[]"); } catch(_) { return []; } }
function saveHistory() { try { localStorage.setItem(HIST_KEY, JSON.stringify(historyTracks.slice(0, 100))); } catch(_) {} }
let historyTracks = loadHistory(); // [{file, timestamp}]

// ── PLAY COUNTS ──
function loadPlayCounts() { try { return JSON.parse(localStorage.getItem(PLAYS_KEY) || "{}"); } catch(_) { return {}; } }
function savePlayCounts() { try { localStorage.setItem(PLAYS_KEY, JSON.stringify(playCounts)); } catch(_) {} }
let playCounts = loadPlayCounts();

// ── Context target ──
let contextTarget = null;

/* ══════════════════════════════════════════════════════
   3. DOM REFS
══════════════════════════════════════════════════════ */
const audioEl          = document.getElementById("mainAudio");
const mediaGrid        = document.getElementById("mediaGrid");
const catInner         = document.getElementById("catInner");
const sectionTitle     = document.getElementById("sectionTitle");
const countBadge       = document.getElementById("countBadge");
const heroExplore      = document.getElementById("heroExplore");
const gridSection      = document.getElementById("gridSection");
const nowPlayingSheet  = document.getElementById("nowPlayingSheet");
const sheetBgBlur      = document.getElementById("sheetBgBlur");
const sheetClose       = document.getElementById("sheetClose");
const sheetCover       = document.getElementById("sheetCover");
const sheetCategory    = document.getElementById("sheetCategory");
const sheetTitle       = document.getElementById("sheetTitle");
const sheetArtist      = document.getElementById("sheetArtist");
const sheetHeart       = document.getElementById("sheetHeart");
const sheetAddMenu     = document.getElementById("sheetAddMenu");
const sheetPlay        = document.getElementById("sheetPlay");
const sheetPrev        = document.getElementById("sheetPrev");
const sheetNext        = document.getElementById("sheetNext");
const sheetShuffle     = document.getElementById("sheetShuffle");
const sheetRepeat      = document.getElementById("sheetRepeat");
const sheetQueueBtn    = document.getElementById("sheetQueueBtn");
const sheetBar         = document.getElementById("sheetBar");
const sheetFill        = document.getElementById("sheetFill");
const sheetThumb       = document.getElementById("sheetThumb");
const sheetCurrent     = document.getElementById("sheetCurrent");
const sheetDuration    = document.getElementById("sheetDuration");
const volSlider        = document.getElementById("volSlider");
const miniPlayer       = document.getElementById("miniPlayer");
const miniPlayerExpand = document.getElementById("miniPlayerExpand");
const miniCover        = document.getElementById("miniCover");
const miniTitle        = document.getElementById("miniTitle");
const miniArtist       = document.getElementById("miniArtist");
const miniPlay         = document.getElementById("miniPlay");
const miniNext         = document.getElementById("miniNext");
const miniProgressFill = document.getElementById("miniProgressFill");
const searchInput      = document.getElementById("searchInput");
const searchClear      = document.getElementById("searchClear");
const searchBrowse     = document.getElementById("searchBrowse");
const searchResults    = document.getElementById("searchResults");
const genreGrid        = document.getElementById("genreGrid");
const favoritosList    = document.getElementById("favoritosList");
const bottomNav        = document.getElementById("bottomNav");
const topbarSearchBtn  = document.getElementById("topbarSearchBtn");
const toastContainer   = document.getElementById("toastContainer");
const queuePanel       = document.getElementById("queuePanel");
const queueOverlay     = document.getElementById("queueOverlay");
const queueList        = document.getElementById("queueList");
const queueNowPlaying  = document.getElementById("queueNowPlaying");
const queueNextLabel   = document.getElementById("queueNextLabel");
const queueClearBtn    = document.getElementById("queueClearBtn");
const queueCloseBtn    = document.getElementById("queueCloseBtn");
const contextMenu      = document.getElementById("contextMenu");
const ctxPlayNow       = document.getElementById("ctxPlayNow");
const ctxAddQueue      = document.getElementById("ctxAddQueue");
const ctxAddPlaylist   = document.getElementById("ctxAddPlaylist");
const ctxLike          = document.getElementById("ctxLike");
const playlistsGrid    = document.getElementById("playlistsGrid");
const btnCreatePlaylist= document.getElementById("btnCreatePlaylist");
const createPlaylistModal = document.getElementById("createPlaylistModal");
const createPlaylistClose = document.getElementById("createPlaylistClose");
const confirmCreatePlaylist = document.getElementById("confirmCreatePlaylist");
const playlistNameInput= document.getElementById("playlistNameInput");
const addToPlaylistModal= document.getElementById("addToPlaylistModal");
const addToPlaylistClose= document.getElementById("addToPlaylistClose");
const addToPlaylistList= document.getElementById("addToPlaylistList");
const addNewPlaylistBtn= document.getElementById("addNewPlaylistBtn");
const playlistDetailModal= document.getElementById("playlistDetailModal");
const playlistDetailClose= document.getElementById("playlistDetailClose");
const playlistDetailCover= document.getElementById("playlistDetailCover");
const playlistDetailName= document.getElementById("playlistDetailName");
const playlistDetailCount= document.getElementById("playlistDetailCount");
const playlistDetailList= document.getElementById("playlistDetailList");
const btnPlayPlaylist  = document.getElementById("btnPlayPlaylist");
const btnDeletePlaylist= document.getElementById("btnDeletePlaylist");

let openPlaylistId = null;

/* ══════════════════════════════════════════════════════
   4. HELPERS
══════════════════════════════════════════════════════ */
function getCategories() { return [...new Set(media.map(m => m.category))].sort(); }

function filteredMedia() {
  return media.filter(item => {
    const matchFilter =
      currentFilter === "all"   ? true :
      currentFilter === "music" ? item.type === "music" :
      item.category.toLowerCase() === currentFilter.toLowerCase();
    const q = currentSearch.toLowerCase().trim();
    const matchSearch = q === "" || [item.title, item.artist, item.category].some(s => s.toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });
}

function formatTime(sec) {
  if (isNaN(sec) || !isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getPlaceholderCover(category = "music") {
  const colors = { Reggaeton:"#e94f4f", Electronic:"#1db954", "Dance-Pop":"#1f77b4", "90s":"#d62728", Jazz:"#9467bd", "Lo-Fi":"#2ca02c", House:"#ff1493", "Hip-Hop":"#1a1a2e" };
  const bg = colors[category] || "#e94f4f";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="${bg}" width="400" height="400"/><text x="50%" y="50%" font-size="80" text-anchor="middle" dominant-baseline="middle" fill="white" opacity=".35">♪</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function updatePlayIcons(playing) {
  [sheetPlay, miniPlay].forEach(btn => {
    btn.querySelector(".icon-play").style.display  = playing ? "none" : "";
    btn.querySelector(".icon-pause").style.display = playing ? "" : "none";
  });
  sheetCover.classList.toggle("playing", playing);

  // Sync "Continuar escuchando" button
  const hccBtn = document.getElementById("hccPlayBtn");
  if (hccBtn) {
    const hccIconPlay  = hccBtn.querySelector(".hcc-icon-play");
    const hccIconPause = hccBtn.querySelector(".hcc-icon-pause");
    if (hccIconPlay)  hccIconPlay.style.display  = playing ? "none" : "";
    if (hccIconPause) hccIconPause.style.display = playing ? "" : "none";
  }
}

function getTrackByFile(file) { return media.find(m => m.file === file) || null; }

/* ══════════════════════════════════════════════════════
   5. TOAST NOTIFICATIONS
══════════════════════════════════════════════════════ */
const TOAST_DURATION = 2800;
function showToast(msg, type = "default") {
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  el.style.setProperty('--toast-duration', `${TOAST_DURATION}ms`);

  // Icon based on type
  const iconMap = {
    success: `<svg viewBox="0 0 24 24" width="13" height="13" style="stroke:var(--green);stroke-width:2.5;fill:none;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" width="13" height="13" style="stroke:#ef4444;stroke-width:2.5;fill:none;flex-shrink:0"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    warn:    `<svg viewBox="0 0 24 24" width="13" height="13" style="stroke:#fabd00;stroke-width:2.5;fill:none;flex-shrink:0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    default: `<span class="toast-dot"></span>`
  };
  const icon = iconMap[type] || iconMap.default;

  el.innerHTML = `
    <div class="toast-content">${icon}<span>${msg}</span></div>
    <div class="toast-bar-wrap"><div class="toast-bar"></div></div>
  `;

  toastContainer.appendChild(el);

  // Auto-remove when bar finishes
  const timer = setTimeout(() => {
    el.classList.add("toast-out");
    el.addEventListener("animationend", () => el.remove(), { once: true });
  }, TOAST_DURATION);

  // Tap to dismiss
  el.addEventListener("click", () => {
    clearTimeout(timer);
    el.classList.add("toast-out");
    el.addEventListener("animationend", () => el.remove(), { once: true });
  });
}

/* ══════════════════════════════════════════════════════
   6. PAGES NAVIGATION
══════════════════════════════════════════════════════ */
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const target = document.getElementById(pageId);
  if (target) target.classList.add("active");
  bottomNav.querySelectorAll(".bnav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === pageId);
  });
  if (pageId === "pageFavoritos") renderFavoritos();
  if (pageId === "pagePlaylists") renderPlaylists();
  if (pageId === "pageEventos")   EventosManager.render();
  if (pageId === "pageMixes")     MixesManager.renderGrid();
  if (pageId === "pageDownloads") {
    if (typeof OfflineManager !== 'undefined') OfflineManager.renderDownloadsList();
    if (typeof renderOfflinePlaylist === 'function') renderOfflinePlaylist();
    if (typeof updateOfflineStatusBanner === 'function') updateOfflineStatusBanner();
  }
  closeContextMenu();
  
  // Animar slider glassmorphic
  updateBottomNavSlider();
}

function updateBottomNavSlider() {
  const slider = document.getElementById("bnavGlassSlider");
  const activeBtn = bottomNav.querySelector(".bnav-btn.active");
  if (!slider || !activeBtn) return;
  const width = Math.max(activeBtn.offsetWidth, 56);
  slider.style.width = `${width}px`;
  slider.style.left = `0px`;
  slider.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
}

bottomNav.querySelectorAll(".bnav-btn").forEach(btn => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});
topbarSearchBtn.addEventListener("click", () => showPage("pageSearch"));
window.addEventListener("resize", updateBottomNavSlider);

/* ══════════════════════════════════════════════════════
   7. CONTEXT MENU — Bottom Sheet (mobile-first)
══════════════════════════════════════════════════════ */
const ctxSheet        = document.getElementById("ctxSheet");
const ctxSheetOverlay = document.getElementById("ctxSheetOverlay");
const ctxSheetCover   = document.getElementById("ctxSheetCover");
const ctxSheetTitle   = document.getElementById("ctxSheetTitle");
const ctxSheetArtist  = document.getElementById("ctxSheetArtist");
const ctxSheetPlayNow = document.getElementById("ctxSheetPlayNow");
const ctxSheetAddQueue   = document.getElementById("ctxSheetAddQueue");
const ctxSheetAddPlaylist= document.getElementById("ctxSheetAddPlaylist");
const ctxSheetLike    = document.getElementById("ctxSheetLike");
const ctxSheetLikeIcon = document.getElementById("ctxSheetLikeIcon");
const ctxSheetLikeLabel= document.getElementById("ctxSheetLikeLabel");
const ctxSheetOffline  = document.getElementById("ctxSheetOffline");
const ctxSheetOfflineIcon  = document.getElementById("ctxSheetOfflineIcon");
const ctxSheetOfflineLabel = document.getElementById("ctxSheetOfflineLabel");
const ctxSheetCancel  = document.getElementById("ctxSheetCancel");

// Touch-drag-to-dismiss state
let _ctxDragStartY = 0;
let _ctxDragCurrentY = 0;
let _ctxDragging = false;

function openContextMenu(item) {
  contextTarget = item;
  const liked = likedTracks.has(item.file);
  const cover = item.cover || getPlaceholderCover(item.category);

  // Fill track info
  ctxSheetCover.src = cover;
  ctxSheetCover.onerror = () => { ctxSheetCover.src = getPlaceholderCover(item.category); };
  ctxSheetTitle.textContent  = item.title;
  ctxSheetArtist.textContent = item.artist;

  // Like state
  _updateCtxLikeState(liked);

  // Offline state — check async and update button
  _updateCtxOfflineState(false); // reset first
  if (typeof OfflineManager !== 'undefined' && ctxSheetOffline) {
    const isAlreadyDownloaded = OfflineManager.isDownloaded(item.file);
    _updateCtxOfflineState(isAlreadyDownloaded);
  }

  // Open
  ctxSheet.classList.add("open");
  ctxSheetOverlay.classList.add("open");
  document.body.style.overflow = "hidden";

  // Reset drag
  ctxSheet.style.transform = "";
  ctxSheet.style.transition = "";
}

function _updateCtxOfflineState(isDownloaded) {
  if (!ctxSheetOffline) return;
  ctxSheetOffline.classList.toggle("downloaded", isDownloaded);
  if (ctxSheetOfflineLabel) {
    ctxSheetOfflineLabel.textContent = isDownloaded ? "Eliminar descarga" : "Guardar sin conexión";
  }
  if (ctxSheetOfflineIcon) {
    ctxSheetOfflineIcon.innerHTML = isDownloaded
      ? `<svg viewBox="0 0 24 24" width="20" height="20" style="color:var(--green)"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`
      : `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  }
}

function _updateCtxLikeState(liked) {
  ctxSheetLike.classList.toggle("liked", liked);
  ctxSheetLikeLabel.textContent = liked ? "Quitar de likes" : "Me gusta";
  ctxSheetLikeIcon.innerHTML = liked
    ? `<svg viewBox="0 0 24 24" width="20" height="20" style="fill:#e94f4f;stroke:#e94f4f"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
    : `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
}

function closeContextMenu() {
  ctxSheet.classList.remove("open");
  ctxSheetOverlay.classList.remove("open");
  document.body.style.overflow = "";
  ctxSheet.style.transform = "";
  ctxSheet.style.transition = "";
  contextTarget = null;
}

// Close on overlay tap
ctxSheetOverlay.addEventListener("click", closeContextMenu);
ctxSheetCancel.addEventListener("click",  closeContextMenu);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeContextMenu(); });

// ── Swipe-down to dismiss ──────────────────────────
const _ctxHandle = ctxSheet.querySelector(".ctx-sheet-handle-wrap");
_ctxHandle.addEventListener("touchstart", e => {
  _ctxDragStartY = e.touches[0].clientY;
  _ctxDragging = true;
  ctxSheet.style.transition = "none";
}, { passive: true });

document.addEventListener("touchmove", e => {
  if (!_ctxDragging) return;
  const dy = Math.max(0, e.touches[0].clientY - _ctxDragStartY);
  _ctxDragCurrentY = dy;
  ctxSheet.style.transform = `translateY(${dy}px)`;
}, { passive: true });

document.addEventListener("touchend", () => {
  if (!_ctxDragging) return;
  _ctxDragging = false;
  ctxSheet.style.transition = "";
  if (_ctxDragCurrentY > 100) {
    closeContextMenu();
  } else {
    ctxSheet.style.transform = "";
  }
  _ctxDragCurrentY = 0;
}, { passive: true });

// ── Sheet action handlers ──────────────────────────
ctxSheetPlayNow.addEventListener("click", () => {
  if (contextTarget) { loadTrack(contextTarget); closeContextMenu(); }
});
ctxSheetAddQueue.addEventListener("click", () => {
  if (contextTarget) { addToQueue(contextTarget); closeContextMenu(); }
});
ctxSheetAddPlaylist.addEventListener("click", () => {
  if (contextTarget) { openAddToPlaylist(contextTarget); closeContextMenu(); }
});
ctxSheetLike.addEventListener("click", () => {
  if (contextTarget) {
    toggleLike(contextTarget);
    // Update like state in sheet without closing
    const nowLiked = likedTracks.has(contextTarget.file);
    _updateCtxLikeState(nowLiked);
    // Small delay then close
    setTimeout(closeContextMenu, 280);
  }
});

if (ctxSheetOffline) {
  ctxSheetOffline.addEventListener("click", async () => {
    if (!contextTarget || typeof OfflineManager === 'undefined') return;
    // Guardar referencia ANTES de cerrar el menú (closeContextMenu pone contextTarget a null)
    const trackToProcess = contextTarget;
    const isDownloaded = OfflineManager.isDownloaded(trackToProcess.file);
    if (isDownloaded) {
      closeContextMenu();
      await OfflineManager.deleteDownload(trackToProcess.file);
      if (typeof showToast === 'function') showToast(`"${trackToProcess.title}" eliminada de offline`);
    } else {
      closeContextMenu();
      // downloadTrack muestra el toast de éxito y actualiza la lista offline automáticamente
      await OfflineManager.downloadTrack(trackToProcess);
    }
  });
}

/* ══════════════════════════════════════════════════════
   8. HOME GRID
══════════════════════════════════════════════════════ */
function buildCategoryPills() {
  catInner.querySelectorAll(".cat-pill:not([data-cat='all'])").forEach(p => p.remove());
  getCategories().forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "cat-pill";
    btn.dataset.cat = cat;
    btn.textContent = cat;
    catInner.appendChild(btn);
  });
  catInner.querySelectorAll(".cat-pill").forEach(p => {
    p.addEventListener("click", () => {
      currentFilter = p.dataset.cat;
      catInner.querySelectorAll(".cat-pill").forEach(x => x.classList.remove("active"));
      p.classList.add("active");
      renderGrid();
    });
  });
}

const HOME_RANDOM_COUNT = 12;
let homeRandomSeed = [];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderGrid() {
  let items = filteredMedia();
  if (mediaGrid) mediaGrid.innerHTML = "";
  // Do NOT overwrite playlist here — playback context is managed by loadTrack
  const labels = { all:"Destacados para ti", music:"Música" };
  if (sectionTitle) sectionTitle.textContent = labels[currentFilter] || currentFilter;

  const isHome = currentFilter === "all" && currentSearch === "";

  // Show/hide home explore section
  const exploreSection = document.getElementById("homeExploreSection");
  if (exploreSection) {
    exploreSection.style.display = isHome ? "none" : "";
  }

  if (isHome) {
    if (homeRandomSeed.length === 0) homeRandomSeed = shuffleArray(items).slice(0, HOME_RANDOM_COUNT);
    items = homeRandomSeed;
    if (countBadge) countBadge.textContent = `${HOME_RANDOM_COUNT} de ${filteredMedia().length}`;
  } else {
    homeRandomSeed = [];
    if (countBadge) countBadge.textContent = `${items.length} item${items.length !== 1 ? "s" : ""}`;
  }

  if (items.length === 0) {
    if (mediaGrid) mediaGrid.innerHTML = `<div class="no-results fade-in"><h3>Sin resultados</h3><p>Prueba con otro término o categoría.</p></div>`;
    return;
  }

  const currentFile = playlist[currentTrackIdx]?.file;

  items.forEach(item => {
    const cover = item.cover || getPlaceholderCover(item.category);
    const card = document.createElement("div");
    card.className = "media-card fade-in";
    card.dataset.file = item.file;
    if (item.file === currentFile) card.classList.add("is-playing");
    const liked = likedTracks.has(item.file);

    card.innerHTML = `
      <div class="card-cover">
        <img src="${cover}" alt="${item.title}" loading="lazy" onerror="this.src='${getPlaceholderCover(item.category)}'" />
        <div class="card-play-overlay">
          <div class="play-circle">
            <svg viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><polygon points="5,3 19,12 5,21"/></svg>
          </div>
        </div>
        <div class="card-liked-dot ${liked ? 'visible' : ''}">
          <svg viewBox="0 0 24 24"><path fill="#fff" stroke="none" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <button class="card-download-btn" data-file="${item.file}" title="Descargar para offline" aria-label="Descargar">
          <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
      </div>
      <div class="card-body">
        <p class="card-category">${item.category}</p>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-artist">${item.artist}</p>
      </div>
      <div class="card-footer">
        <button class="card-play-btn">
          <svg viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><polygon points="5,3 19,12 5,21"/></svg>
          Escuchar
        </button>
        <div class="card-footer-right">
          ${item.duration ? `<span class="card-dur">${item.duration}</span>` : ""}
          <button class="card-more-btn card-more-btn--footer" aria-label="Más opciones">
            <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none"/></svg>
          </button>
        </div>
      </div>`;

    card.querySelector(".card-play-btn").addEventListener("click", e => { e.stopPropagation(); loadTrack(item); });
    card.addEventListener("click", e => { if (!e.target.closest(".card-more-btn--footer") && !e.target.closest(".card-download-btn")) loadTrack(item); });
    card.querySelector(".card-more-btn--footer").addEventListener("click", e => {
      e.stopPropagation();
      e.preventDefault();
      openContextMenu(item);
    });
    card.querySelector(".card-download-btn").addEventListener("click", e => {
      e.stopPropagation();
      if (typeof OfflineManager !== 'undefined') {
        if (OfflineManager.isDownloaded(item.file)) {
          if (typeof showToast === 'function') showToast(`"${item.title}" ya está guardada offline`, 'default');
        } else {
          OfflineManager.downloadTrack(item);
        }
      } else {
        if (typeof showToast === 'function') showToast('Módulo offline no disponible', 'error');
      }
    });
    if (mediaGrid) mediaGrid.appendChild(card);
  });
}








/* ══════════════════════════════════════════════════════
   DROPLY AUDIO ENGINE v4 — HARD SWITCH (sin crossfade)
   · Un solo elemento de audio (mainAudio del DOM)
   · Hard switch limpio: pause → src → play
   · Sin AbortError: se cancela la promise pendiente
     antes de cambiar de src
══════════════════════════════════════════════════════ */

const activeAudio = audioEl;   // mainAudio del DOM — único elemento
window.audioEl = activeAudio;

/* ── Audio events ────────────────────────────────────── */
let _rafPending = false;
activeAudio.addEventListener("timeupdate", function () {
  if (_rafPending) return;
  _rafPending = true;
  requestAnimationFrame(() => {
    _rafPending = false;
    const dur = activeAudio.duration, cur = activeAudio.currentTime;
    if (!dur || isNaN(dur) || !isFinite(dur) || dur <= 0) return;
    const pct = Math.max(0, Math.min(100, (cur / dur) * 100));
    sheetFill.style.width        = pct + "%";
    sheetThumb.style.left        = pct + "%";
    sheetCurrent.textContent     = formatTime(cur);
    sheetDuration.textContent    = formatTime(dur);
    miniProgressFill.style.width = pct + "%";
    _updateMediaSessionPosition();
  });
}, { passive: true });

activeAudio.addEventListener("ended", function () {
  isPlaying = false;
  if (repeatMode) {
    this.currentTime = 0;
    this.play()
      .then(() => { isPlaying = true; updatePlayIcons(true); })
      .catch(err => { updatePlayIcons(false); console.warn("[DROPLY] repeat:", err); });
  } else {
    updatePlayIcons(false);
    playNext();
  }
}, { passive: true });

activeAudio.addEventListener("play", function () {
  isPlaying = true;
  updatePlayIcons(true);
  if ("mediaSession" in navigator) {
    try { navigator.mediaSession.playbackState = "playing"; } catch(_) {}
    // Re-assert handlers on every play (some browsers drop them)
    try {
      navigator.mediaSession.setActionHandler("play", () => {
        activeAudio.muted = false;
        if (activeAudio.volume === 0) activeAudio.volume = 1;
        activeAudio.play()
          .then(() => { isPlaying = true; updatePlayIcons(true); })
          .catch(() => {});
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        activeAudio.pause();
        isPlaying = false;
        updatePlayIcons(false);
      });
    } catch(_) {}
  }
}, { passive: true });

/* ── loadedmetadata: actualiza posición en cuanto se conoce la duración real ── */
/* Esto arregla la barra de la pantalla de bloqueo que mostraba 0:00/0:00      */
activeAudio.addEventListener("loadedmetadata", function () {
  _updateMediaSessionPosition();
  // También actualiza la duración en el reproductor inmediatamente
  const dur = this.duration;
  if (dur && isFinite(dur) && dur > 0) {
    if (sheetDuration) sheetDuration.textContent = formatTime(dur);
  }
}, { passive: true });

/* ── playing: se dispara cuando el audio empieza a reproducirse de verdad ──── */
/* En iOS/Safari loadedmetadata llega tarde; 'playing' es más fiable           */
activeAudio.addEventListener("playing", function () {
  _updateMediaSessionPosition();
  if ("mediaSession" in navigator) {
    try { navigator.mediaSession.playbackState = "playing"; } catch(_) {}
  }
}, { passive: true });

activeAudio.addEventListener("pause", function () {
  // Solo actualiza si el audio está realmente pausado
  // (evita falsos positivos por cambio de src)
  if (!this.paused) return;
  isPlaying = false;
  updatePlayIcons(false);
  if ("mediaSession" in navigator) {
    try { navigator.mediaSession.playbackState = "paused"; } catch(_) {}
  }
}, { passive: true });

/* ── Background blur transition (visual only) ─────── */
function animateBackgroundTransition(newCover) {
  const bg = sheetBgBlur;
  bg.style.transition = "opacity .4s ease";
  bg.style.opacity = "0";
  setTimeout(() => {
    bg.style.backgroundImage = "url(" + newCover + ")";
    bg.style.opacity = "1";
  }, 200);
}

/* ══════════════════════════════════════════════════════
   LOAD TRACK
══════════════════════════════════════════════════════ */
// Token para cancelar plays pendientes si llega otro loadTrack antes
let _playToken = 0;

function loadTrack(item, fromQueue = false, newPlaylistContext = null) {
  if (item.type !== "music") return;

  // ── Comprobación offline ──────────────────────────────────────────────────
  // Si no hay conexión y la canción no está descargada, avisar y salir
  if (!navigator.onLine && typeof OfflineManager !== 'undefined' && !OfflineManager.isDownloaded(item.file)) {
    if (typeof showToast === 'function') {
      showToast(`"${item.title}" no está descargada — sin conexión`, 'default');
    }
    return;
  }

  const cover = item.cover || getPlaceholderCover(item.category);

  /* -- History -- */
  historyTracks.unshift({ file: item.file, timestamp: Date.now() });
  historyTracks = historyTracks
    .filter((v, i, arr) => arr.findIndex(x => x.file === v.file) === i)
    .slice(0, 100);
  saveHistory();

  /* -- Play counts -- */
  playCounts[item.file] = (playCounts[item.file] || 0) + 1;
  savePlayCounts();

  /* -- Playlist context -- */
  if (!fromQueue) {
    if (newPlaylistContext) playlist = newPlaylistContext;
    else playlist = media.filter(m => m.type === "music");
    currentTrackIdx = playlist.findIndex(p => p.file === item.file);
  } else {
    const idx = playlist.findIndex(p => p.file === item.file);
    if (idx >= 0) currentTrackIdx = idx;
  }

  /* -- UI -- */
  miniCover.src = cover;
  miniTitle.textContent  = item.title;
  miniArtist.textContent = item.artist;
  miniPlayer.classList.add("visible");

  sheetCover.src = cover;
  sheetCategory.textContent = item.category;
  sheetTitle.textContent    = item.title;
  sheetArtist.textContent   = item.artist;
  animateBackgroundTransition(cover);

  const liked = likedTracks.has(item.file);
  sheetHeart.classList.toggle("liked", liked);

  document.querySelectorAll(".media-card").forEach(c => c.classList.remove("is-playing"));
  document.querySelectorAll(`.media-card[data-file="${CSS.escape(item.file)}"]`)
    .forEach(c => c.classList.add("is-playing"));

  renderQueueNowPlaying(item);
  setupMediaSession(item);

  /* -- Home continue card -- */
  const hccCoverEl = document.getElementById("hccCover");
  if (hccCoverEl) {
    hccCoverEl.src = cover;
    const hccTitleEl  = document.getElementById("hccTitle");
    const hccArtistEl = document.getElementById("hccArtist");
    const hccGlowEl   = document.getElementById("hccGlow");
    const contSec     = document.getElementById("homeContinueSection");
    if (hccTitleEl)  hccTitleEl.textContent  = item.title;
    if (hccArtistEl) hccArtistEl.textContent = item.artist;
    if (hccGlowEl)   hccGlowEl.style.backgroundImage = `url(${cover})`;
    if (contSec)     contSec.style.display = "";
    const hccBtn = document.getElementById("hccPlayBtn");
    if (hccBtn) hccBtn.onclick = () => {
      const currentFile = playlist[currentTrackIdx]?.file;
      if (currentFile === item.file) {
        togglePlay();
      } else {
        loadTrack(item);
      }
    };
  }

  /* -- Audio: hard switch limpio -- */
  const myToken = ++_playToken;

  // Reset UI a estado "cargando"
  sheetFill.style.width        = "0%";
  sheetThumb.style.left        = "0%";
  sheetCurrent.textContent     = "0:00";
  sheetDuration.textContent    = "0:00";
  miniProgressFill.style.width = "0%";

  // Reset posición en pantalla de bloqueo ANTES de cambiar src
  // (evita que se muestre el tiempo del track anterior mientras carga el nuevo)
  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.setPositionState({
        duration: 0,
        playbackRate: 1,
        position: 0
      });
    } catch(_) {}
  }

  // Pausar antes de cambiar src
  activeAudio.pause();

  function _doPlay(audioSrc) {
    if (myToken !== _playToken) return;
    activeAudio.src = audioSrc;
    activeAudio.currentTime = 0;
    activeAudio.muted = false;
    if (activeAudio.volume === 0) activeAudio.volume = 1;
    activeAudio.volume = activeAudio.volume || 1;
    activeAudio.play()
      .then(() => {
        if (myToken !== _playToken) return;
        isPlaying = true;
        updatePlayIcons(true);
      })
      .catch(err => {
        if (myToken !== _playToken) return;
        isPlaying = false;
        updatePlayIcons(false);
        if (err.name === "NotAllowedError") {
          window._droplyPendingTrack = true;
        } else if (err.name !== "AbortError") {
          console.warn("[DROPLY] play error:", err);
        }
      });
  }

  if (typeof OfflineManager !== 'undefined' && OfflineManager.isDownloaded(item.file)) {
    OfflineManager.getOfflineSrc(item.file).then(blobUrl => {
      _doPlay(blobUrl || item.file);
    }).catch(() => _doPlay(item.file));
  } else {
    _doPlay(item.file);
  }
}



/* ── Seek / Volume (always on active audio) ──────────── */
// Volume
volSlider.addEventListener("input", () => {
  activeAudio.volume = parseFloat(volSlider.value);
});

function seekToPercent(pct) {
  const audio = activeAudio;
  if (audio.duration && isFinite(audio.duration))
    audio.currentTime = Math.max(0, Math.min(1, pct)) * audio.duration;
}
sheetBar.addEventListener("click", e => {
  const rect = sheetBar.getBoundingClientRect();
  seekToPercent((e.clientX - rect.left) / rect.width);
});
let barDragging = false;
sheetBar.addEventListener("touchstart", e => { barDragging = true; const r = sheetBar.getBoundingClientRect(); seekToPercent((e.touches[0].clientX - r.left) / r.width); }, { passive:true });
sheetBar.addEventListener("touchmove",  e => { if (!barDragging) return; const r = sheetBar.getBoundingClientRect(); seekToPercent((e.touches[0].clientX - r.left) / r.width); }, { passive:true });
sheetBar.addEventListener("touchend",   () => { barDragging = false; }, { passive:true });

/* ── Swipe down to close player sheet ───────────────── */
let sheetTouchStartY = 0;
nowPlayingSheet.addEventListener("touchstart", e => { sheetTouchStartY = e.touches[0].clientY; }, { passive:true });
nowPlayingSheet.addEventListener("touchend",   e => { if (e.changedTouches[0].clientY - sheetTouchStartY > 80) nowPlayingSheet.classList.remove("open"); }, { passive:true });

/* ══════════════════════════════════════════════════════
   13. LIKES
══════════════════════════════════════════════════════ */
function toggleLike(item) {
  const key = item.file;
  const wasLiked = likedTracks.has(key);
  if (wasLiked) {
    likedTracks.delete(key);
    showToast(`"${item.title}" eliminada de Likes`);
  } else {
    likedTracks.add(key);
    showToast(`"${item.title}" añadida a Likes`, "success");
  }
  saveLiked();
  // Update heart state in sheet if current track
  const cur = playlist[currentTrackIdx];
  if (cur?.file === key) sheetHeart.classList.toggle("liked", !wasLiked);
  // Update card liked dot
  document.querySelectorAll(".media-card").forEach(card => {
    const title = card.querySelector(".card-title")?.textContent;
    if (title === item.title) {
      const dot = card.querySelector(".card-liked-dot");
      if (dot) dot.classList.toggle("visible", !wasLiked);
    }
  });
  if (document.getElementById("pageFavoritos").classList.contains("active")) renderFavoritos();
}

/* ══════════════════════════════════════════════════════
   14. FAVORITOS PAGE
══════════════════════════════════════════════════════ */
function renderFavoritos() {
  favoritosList.innerHTML = "";
  const likedItems = media.filter(m => m.type === "music" && likedTracks.has(m.file));
  if (likedItems.length === 0) {
    favoritosList.innerHTML = `<div class="fav-empty"><svg viewBox="0 0 24 24" width="48" height="48" style="margin:0 auto 1rem;display:block;color:#e94f4f;opacity:.4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><p style="color:#b3b3b3;text-align:center;font-size:.9rem">Aún no tienes canciones favoritas.<br>Pulsa el ❤ en cualquier canción.</p></div>`;
    return;
  }
  likedItems.forEach((item, idx) => {
    const cover = item.cover || getPlaceholderCover(item.category);
    const row = buildLibraryRow(item, idx + 1, cover, () => {
      loadTrack(item, false, likedItems);
    }, item);
    favoritosList.appendChild(row);
  });
}

function buildLibraryRow(item, num, cover, onClick, itemForCtx) {
  const row = document.createElement("div");
  row.className = "library-item fade-in";
  const isCurrentTrack = playlist[currentTrackIdx]?.file === item.file;
  if (isCurrentTrack) row.classList.add("playing");
  row.innerHTML = `
    <span class="library-item-num">${num}</span>
    <div class="library-thumb"><img src="${cover}" alt="${item.title}" onerror="this.src='${getPlaceholderCover(item.category)}'" /></div>
    <div class="library-info">
      <span class="library-track-title">${item.title}</span>
      <span class="library-track-artist">${item.artist}</span>
    </div>
    <div class="library-item-actions">
      <button class="library-action-btn library-action-more" data-action="more" title="Más opciones" aria-label="Más opciones">
        <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/></svg>
      </button>
    </div>
    <span class="library-item-dur">${item.duration || ""}</span>`;
  row.addEventListener("click", e => { if (!e.target.closest(".library-item-actions")) onClick(); });
  row.querySelector('[data-action="more"]').addEventListener("click", e => { e.stopPropagation(); openContextMenu(itemForCtx || item); });
  return row;
}

/* ══════════════════════════════════════════════════════
   15. PLAYLISTS
══════════════════════════════════════════════════════ */
function createPlaylist(name) {
  const pl = { id: Date.now().toString(), name: name.trim(), tracks: [] };
  playlists.push(pl);
  savePlaylists();
  renderPlaylists();
  showToast(`Playlist "${pl.name}" creada`, "success");
  return pl;
}

function deletePlaylist(id) {
  playlists = playlists.filter(p => p.id !== id);
  savePlaylists();
  renderPlaylists();
  showToast("Playlist eliminada");
}

function addTrackToPlaylist(playlistId, trackFile) {
  const pl = playlists.find(p => p.id === playlistId);
  if (!pl) return;
  if (pl.tracks.includes(trackFile)) { showToast("Ya está en la playlist"); return; }
  pl.tracks.push(trackFile);
  savePlaylists();
  showToast(`Añadida a "${pl.name}"`, "success");
}

function removeTrackFromPlaylist(playlistId, trackFile) {
  const pl = playlists.find(p => p.id === playlistId);
  if (!pl) return;
  pl.tracks = pl.tracks.filter(f => f !== trackFile);
  savePlaylists();
  openPlaylistDetail(playlistId); // refresh
  showToast("Eliminada de la playlist");
}

function renderPlaylists() {
  playlistsGrid.innerHTML = "";
  if (playlists.length === 0) {
    playlistsGrid.innerHTML = `<div class="playlists-empty" style="grid-column:1/-1"><p>No tienes playlists aún.<br>Crea una con el botón de arriba.</p></div>`;
    return;
  }
  playlists.forEach(pl => {
    const card = document.createElement("div");
    card.className = "playlist-card fade-in";
    const trackImgs = pl.tracks.slice(0, 4).map(f => getTrackByFile(f)?.cover || "").filter(Boolean);
    const coverHTML = buildPlaylistCoverHTML(trackImgs, "playlist-card-cover");
    card.innerHTML = `
      ${coverHTML}
      <div class="playlist-card-body">
        <div class="playlist-card-name">${pl.name}</div>
        <div class="playlist-card-count">${pl.tracks.length} cancion${pl.tracks.length !== 1 ? "es" : ""}</div>
      </div>`;
    card.addEventListener("click", () => openPlaylistDetail(pl.id));
    playlistsGrid.appendChild(card);
  });
}

function buildPlaylistCoverHTML(trackImgs, className) {
  if (trackImgs.length === 0) {
    return `<div class="${className} single"><div class="playlist-card-cover-placeholder"><svg viewBox="0 0 24 24" width="60" height="60" style="opacity:.25;color:#b3b3b3"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg></div></div>`;
  }
  if (trackImgs.length === 1) {
    return `<div class="${className} single"><img src="${trackImgs[0]}" alt="cover" /></div>`;
  }
  const imgs = trackImgs.slice(0, 4).map(src => `<img src="${src}" alt="cover" />`).join("");
  return `<div class="${className}">${imgs}</div>`;
}

function openPlaylistDetail(id) {
  const pl = playlists.find(p => p.id === id);
  if (!pl) return;
  openPlaylistId = id;

  // Top bar title (hidden initially, shown on scroll)
  const topTitle = document.getElementById("playlistPageTopTitle");
  if (topTitle) { topTitle.textContent = pl.name; topTitle.classList.remove("visible"); }

  playlistDetailName.textContent = pl.name;
  playlistDetailCount.textContent = `${pl.tracks.length} cancion${pl.tracks.length !== 1 ? "es" : ""}`;

  // Cover
  const trackImgs = pl.tracks.slice(0, 4).map(f => getTrackByFile(f)?.cover || "").filter(Boolean);
  playlistDetailCover.innerHTML = "";
  playlistDetailCover.className = "playlist-detail-cover";
  if (trackImgs.length === 0) {
    playlistDetailCover.innerHTML = `<div class="playlist-detail-cover-empty"><svg viewBox="0 0 24 24" width="40" height="40"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg></div>`;
  } else if (trackImgs.length === 1) {
    playlistDetailCover.classList.add("single");
    playlistDetailCover.innerHTML = `<img src="${trackImgs[0]}" alt="cover" />`;
  } else {
    trackImgs.slice(0, 4).forEach(src => {
      const img = document.createElement("img");
      img.src = src; img.alt = "cover";
      playlistDetailCover.appendChild(img);
    });
  }

  // Blurred bg from first cover
  const bgEl = document.getElementById("playlistPageBg");
  if (bgEl && trackImgs[0]) bgEl.style.backgroundImage = `url(${trackImgs[0]})`;

  // Track list
  playlistDetailList.innerHTML = "";
  const currentFile = playlist[currentTrackIdx]?.file;
  if (pl.tracks.length === 0) {
    playlistDetailList.innerHTML = `<p style="color:var(--text-soft);text-align:center;padding:2.5rem 1rem">No hay canciones aún.<br><span style="font-size:.8rem">Añade canciones usando el menú ⋯ en cualquier pista.</span></p>`;
  } else {
    pl.tracks.forEach((file, trackIdx) => {
      const item = getTrackByFile(file);
      if (!item) return;
      const cover = item.cover || getPlaceholderCover(item.category);
      const isPlaying = file === currentFile;

      // Outer wrapper for swipe reveal
      const wrap = document.createElement("div");
      wrap.className = "playlist-detail-item-wrap";

      // Red delete background
      const deleteBg = document.createElement("div");
      deleteBg.className = "playlist-detail-item-delete-bg";
      deleteBg.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg><span>BORRAR</span>`;
      wrap.appendChild(deleteBg);

      const div = document.createElement("div");
      div.className = "playlist-detail-item" + (isPlaying ? " playing" : "");
      div.innerHTML = `
        <img src="${cover}" alt="${item.title}" onerror="this.src='${getPlaceholderCover(item.category)}'">
        <div class="playlist-detail-info">
          <div class="playlist-detail-track">${item.title}</div>
          <div class="playlist-detail-artist">${item.artist} · <span style="color:var(--accent);font-size:.68rem">${item.category}</span></div>
        </div>
        <span style="font-size:.72rem;color:var(--text-soft);flex-shrink:0;font-variant-numeric:tabular-nums">${item.duration || ""}</span>
        <button class="library-action-more playlist-more-btn" title="Más opciones" aria-label="Más opciones" style="flex-shrink:0;width:32px;height:32px;border-radius:50%;background:transparent;border:none;color:var(--text-soft);cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:1">
          <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/></svg>
        </button>
        <button class="playlist-detail-remove" title="Eliminar de playlist">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>`;

      div.addEventListener("click", e => {
        if (e.target.closest(".playlist-detail-remove")) return;
        if (e.target.closest(".playlist-more-btn")) return;
        const plItems = pl.tracks.map(f => getTrackByFile(f)).filter(Boolean);
        loadTrack(item, false, plItems);
        playlistDetailList.querySelectorAll(".playlist-detail-item").forEach(r => r.classList.remove("playing"));
        div.classList.add("playing");
      });
      div.querySelector(".playlist-more-btn").addEventListener("click", e => {
        e.stopPropagation();
        openContextMenu(item);
      });
      div.querySelector(".playlist-detail-remove").addEventListener("click", e => {
        e.stopPropagation();
        removeTrackFromPlaylist(id, file);
      });

      // ── Swipe-to-delete (touch) ─────────────────────────────
      const SWIPE_THRESHOLD = 72; // px to trigger delete
      let _swipeStartX = 0, _swipeStartY = 0, _swipeDx = 0, _swiping = false, _swipeLocked = false;

      div.addEventListener("touchstart", e => {
        _swipeStartX = e.touches[0].clientX;
        _swipeStartY = e.touches[0].clientY;
        _swipeDx = 0;
        _swiping = false;
        _swipeLocked = false;
        div.classList.remove("snap-back");
      }, { passive: true });

      div.addEventListener("touchmove", e => {
        const dx = e.touches[0].clientX - _swipeStartX;
        const dy = e.touches[0].clientY - _swipeStartY;

        // Lock direction after first clear movement
        if (!_swipeLocked) {
          if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            _swipeLocked = true;
            if (Math.abs(dy) > Math.abs(dx)) return; // vertical scroll wins
            _swiping = true;
          } else return;
        }
        if (!_swiping) return;

        _swipeDx = Math.min(0, dx); // only left
        div.style.transform = `translateX(${_swipeDx}px)`;
        div.classList.add("swiping");
        wrap.classList.add("swiping");

        // Colour intensity hint
        const ratio = Math.min(1, Math.abs(_swipeDx) / SWIPE_THRESHOLD);
        deleteBg.style.opacity = ratio;
        deleteBg.style.background = ratio >= 1 ? "#c0392b" : "#e94f4f";
      }, { passive: true });

      div.addEventListener("touchend", () => {
        div.classList.remove("swiping");
        wrap.classList.remove("swiping");
        deleteBg.style.opacity = "";
        deleteBg.style.background = "";

        if (!_swiping) return;
        _swiping = false;

        if (Math.abs(_swipeDx) >= SWIPE_THRESHOLD) {
          // Fly out and delete
          div.classList.add("fly-out");
          hapticFeedback("medium");
          setTimeout(() => {
            wrap.style.maxHeight = wrap.offsetHeight + "px";
            wrap.style.transition = "max-height .28s ease, opacity .28s";
            wrap.style.overflow = "hidden";
            requestAnimationFrame(() => { wrap.style.maxHeight = "0"; wrap.style.opacity = "0"; });
            setTimeout(() => {
              removeTrackFromPlaylist(id, file);
            }, 280);
          }, 60);
        } else {
          // Snap back
          div.classList.add("snap-back");
          div.style.transform = "";
          setTimeout(() => div.classList.remove("snap-back"), 350);
        }
        _swipeDx = 0;
      }, { passive: true });

      wrap.appendChild(div);
      playlistDetailList.appendChild(wrap);
    });
  }

  // Scroll-triggered topbar title
  const scrollEl = playlistDetailModal.querySelector(".playlist-page-scroll");
  if (scrollEl) {
    const onScroll = () => {
      const hero = playlistDetailModal.querySelector(".playlist-page-hero");
      if (!hero || !topTitle) return;
      const threshold = hero.offsetHeight - 60;
      topTitle.classList.toggle("visible", scrollEl.scrollTop > threshold);
    };
    scrollEl.removeEventListener("scroll", scrollEl._plScroll || (() => {}));
    scrollEl._plScroll = onScroll;
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    scrollEl.scrollTop = 0;
  }

  playlistDetailModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

// Play all playlist
btnPlayPlaylist.addEventListener("click", () => {
  if (!openPlaylistId) return;
  const pl = playlists.find(p => p.id === openPlaylistId);
  if (!pl || pl.tracks.length === 0) { showToast("La playlist está vacía"); return; }
  const plItems = pl.tracks.map(f => getTrackByFile(f)).filter(Boolean);
  loadTrack(plItems[0], false, plItems);
  // keep page open so user can browse while listening
  showToast(`Reproduciendo "${pl.name}"`, "success");
});

// Shuffle playlist
const btnShufflePlaylist = document.getElementById("btnShufflePlaylist");
if (btnShufflePlaylist) {
  btnShufflePlaylist.addEventListener("click", () => {
    if (!openPlaylistId) return;
    const pl = playlists.find(p => p.id === openPlaylistId);
    if (!pl || pl.tracks.length === 0) { showToast("La playlist está vacía"); return; }
    const plItems = shuffleArray(pl.tracks.map(f => getTrackByFile(f)).filter(Boolean));
    loadTrack(plItems[0], false, plItems);
    btnShufflePlaylist.classList.add("active");
    showToast("Reproducción aleatoria activada", "success");
  });
}

btnDeletePlaylist.addEventListener("click", () => {
  if (!openPlaylistId) return;
  deletePlaylist(openPlaylistId);
  playlistDetailModal.classList.remove("open");
  document.body.style.overflow = "";
  openPlaylistId = null;
});

playlistDetailClose.addEventListener("click", () => {
  playlistDetailModal.classList.remove("open");
  document.body.style.overflow = "";
});
playlistDetailModal.addEventListener("click", e => { /* full-screen page — no overlay dismiss */ });

// Create playlist modal
btnCreatePlaylist.addEventListener("click", () => {
  playlistNameInput.value = "";
  createPlaylistModal.classList.add("open");
  setTimeout(() => playlistNameInput.focus(), 100);
});
createPlaylistClose.addEventListener("click", () => createPlaylistModal.classList.remove("open"));
createPlaylistModal.addEventListener("click", e => { if (e.target === createPlaylistModal) createPlaylistModal.classList.remove("open"); });
confirmCreatePlaylist.addEventListener("click", () => {
  const name = playlistNameInput.value.trim();
  if (!name) { playlistNameInput.focus(); return; }
  createPlaylist(name);
  createPlaylistModal.classList.remove("open");
});
playlistNameInput.addEventListener("keydown", e => { if (e.key === "Enter") confirmCreatePlaylist.click(); });

// Add to playlist modal
function openAddToPlaylist(item) {
  addToPlaylistList.innerHTML = "";
  if (playlists.length === 0) {
    addToPlaylistList.innerHTML = `<p style="color:var(--text-soft);font-size:.85rem;padding:.5rem">No tienes playlists aún.</p>`;
  } else {
    playlists.forEach(pl => {
      const trackImgs = pl.tracks.slice(0, 4).map(f => getTrackByFile(f)?.cover || "").filter(Boolean);
      const div = document.createElement("div");
      div.className = "add-pl-item";
      div.innerHTML = `
        ${buildAddPlCoverHTML(trackImgs)}
        <div class="add-pl-info">
          <div class="add-pl-name">${pl.name}</div>
          <div class="add-pl-count">${pl.tracks.length} canciones</div>
        </div>`;
      div.addEventListener("click", () => {
        addTrackToPlaylist(pl.id, item.file);
        addToPlaylistModal.classList.remove("open");
      });
      addToPlaylistList.appendChild(div);
    });
  }
  addToPlaylistModal.classList.add("open");
}

function buildAddPlCoverHTML(trackImgs) {
  if (trackImgs.length === 0)
    return `<div class="add-pl-cover single"><div class="add-pl-cover-empty"><svg viewBox="0 0 24 24" width="16" height="16" style="opacity:.3"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/></svg></div></div>`;
  if (trackImgs.length === 1)
    return `<div class="add-pl-cover single"><img src="${trackImgs[0]}" alt=""></div>`;
  return `<div class="add-pl-cover">${trackImgs.slice(0,4).map(s=>`<img src="${s}" alt="">`).join("")}</div>`;
}

addToPlaylistClose.addEventListener("click", () => addToPlaylistModal.classList.remove("open"));
addToPlaylistModal.addEventListener("click", e => { if (e.target === addToPlaylistModal) addToPlaylistModal.classList.remove("open"); });
addNewPlaylistBtn.addEventListener("click", () => {
  addToPlaylistModal.classList.remove("open");
  playlistNameInput.value = "";
  createPlaylistModal.classList.add("open");
  setTimeout(() => playlistNameInput.focus(), 100);
});

/* ══════════════════════════════════════════════════════
   16. HISTORIAL
══════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════
   17. SEARCH PAGE
══════════════════════════════════════════════════════ */
function buildGenreGrid() {
  const colors = ["#e94f4f","#1db954","#1f77b4","#d62728","#9467bd","#ff7f0e","#2ca02c","#ff1493"];
  getCategories().forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.className = "genre-pill";
    btn.style.background = colors[i % colors.length];
    btn.innerHTML = `<span>${cat}</span>`;
    btn.addEventListener("click", () => openGenreDetail(cat));
    genreGrid.appendChild(btn);
  });
}

/* ══════════════════════════════════════════════════════
   GENRE DETAIL MODAL
══════════════════════════════════════════════════════ */
(function setupGenreDetail() {
  const modal        = document.getElementById("genreDetailModal");
  const closeBtn     = document.getElementById("genreDetailClose");
  const bgEl         = document.getElementById("genrePageBg");
  const coverEl      = document.getElementById("genreDetailCover");
  const nameEl       = document.getElementById("genreDetailName");
  const countEl      = document.getElementById("genreDetailCount");
  const listEl       = document.getElementById("genreDetailList");
  const topTitleEl   = document.getElementById("genrePageTopTitle");
  const playBtn      = document.getElementById("btnPlayGenre");
  const shuffleBtn   = document.getElementById("btnShuffleGenre");

  let currentGenreTracks = [];

  window.openGenreDetail = function(cat) {
    const items = media.filter(m => m.category === cat);
    currentGenreTracks = items;

    // Title
    if (nameEl) nameEl.textContent = cat;
    if (countEl) countEl.textContent = `${items.length} cancion${items.length !== 1 ? "es" : ""}`;
    if (topTitleEl) { topTitleEl.textContent = cat; topTitleEl.classList.remove("visible"); }

    // Cover (collage from first 4 tracks)
    const imgs = items.slice(0, 4).map(m => m.cover || "").filter(Boolean);
    if (coverEl) {
      coverEl.innerHTML = "";
      coverEl.className = "playlist-detail-cover";
      if (imgs.length === 0) {
        coverEl.innerHTML = `<div class="playlist-detail-cover-empty"><svg viewBox="0 0 24 24" width="40" height="40"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg></div>`;
      } else if (imgs.length === 1) {
        coverEl.classList.add("single");
        coverEl.innerHTML = `<img src="${imgs[0]}" alt="cover" />`;
      } else {
        imgs.slice(0, 4).forEach(src => {
          const img = document.createElement("img");
          img.src = src; img.alt = "cover";
          coverEl.appendChild(img);
        });
      }
    }

    // Blurred bg
    if (bgEl && imgs[0]) bgEl.style.backgroundImage = `url(${imgs[0]})`;

    // Track list
    if (listEl) {
      listEl.innerHTML = "";
      const currentFile = playlist[currentTrackIdx]?.file;
      if (items.length === 0) {
        listEl.innerHTML = `<p style="color:var(--text-soft);text-align:center;padding:2.5rem 1rem">Sin canciones en esta categoría.</p>`;
      } else {
        items.forEach(item => {
          const cover = item.cover || getPlaceholderCover(item.category);
          const isPlaying = item.file === currentFile;
          const div = document.createElement("div");
          div.className = "playlist-detail-item" + (isPlaying ? " playing" : "");
          div.innerHTML = `
            <img src="${cover}" alt="${item.title}" onerror="this.src='${getPlaceholderCover(item.category)}'">
            <div class="playlist-detail-info">
              <div class="playlist-detail-track">${item.title}</div>
              <div class="playlist-detail-artist">${item.artist}${item.duration ? ` · <span style="color:var(--text-soft);font-size:.68rem">${item.duration}</span>` : ""}</div>
            </div>
            <button class="library-action-more" aria-label="Más opciones" style="flex-shrink:0;width:32px;height:32px;border-radius:50%;background:transparent;border:none;color:var(--text-soft);cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:1">
              <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/></svg>
            </button>`;
          div.addEventListener("click", e => {
            if (e.target.closest(".library-action-more")) return;
            loadTrack(item, false, currentGenreTracks);
            listEl.querySelectorAll(".playlist-detail-item").forEach(r => r.classList.remove("playing"));
            div.classList.add("playing");
          });
          div.querySelector(".library-action-more").addEventListener("click", e => {
            e.stopPropagation();
            openContextMenu(item);
          });
          listEl.appendChild(div);
        });
      }
    }

    // Scroll-triggered topbar title
    const scrollEl = modal && modal.querySelector(".playlist-page-scroll");
    if (scrollEl) {
      scrollEl.removeEventListener("scroll", scrollEl._genreScroll || (() => {}));
      scrollEl._genreScroll = () => {
        const hero = modal.querySelector(".playlist-page-hero");
        if (!hero || !topTitleEl) return;
        topTitleEl.classList.toggle("visible", scrollEl.scrollTop > hero.offsetHeight - 60);
      };
      scrollEl.addEventListener("scroll", scrollEl._genreScroll, { passive: true });
      scrollEl.scrollTop = 0;
    }

    if (modal) { modal.classList.add("open"); document.body.style.overflow = "hidden"; }
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (modal) modal.classList.remove("open");
      document.body.style.overflow = "";
    });
  }

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (!currentGenreTracks.length) return;
      loadTrack(currentGenreTracks[0], false, currentGenreTracks);
      if (typeof showToast === "function") showToast(`Reproduciendo ${nameEl?.textContent || ""}`, "success");
    });
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
      if (!currentGenreTracks.length) return;
      const shuffled = shuffleArray([...currentGenreTracks]);
      loadTrack(shuffled[0], false, shuffled);
      if (typeof showToast === "function") showToast("Reproducción aleatoria activada", "success");
    });
  }
})();

let searchTimeout;
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim();
  searchClear.style.display = q ? "" : "none";
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (!q) { searchBrowse.style.display = ""; searchResults.style.display = "none"; searchResults.innerHTML = ""; return; }
    searchBrowse.style.display = "none";
    searchResults.style.display = "";
    const results = media.filter(item =>
      [item.title, item.artist, item.category].some(s => s.toLowerCase().includes(q.toLowerCase()))
    );
    if (results.length === 0) {
      searchResults.innerHTML = `<div class="no-results"><p>Sin resultados para "<strong>${q}</strong>"</p></div>`;
      return;
    }
    searchResults.innerHTML = "";

    // ── Artist header card ──────────────────────────────────
    const qLow = q.toLowerCase();
    // Find if query matches a specific artist name
    const artistMatch = [...new Set(results.map(r => r.artist.split(/[,&]/)[0].trim()))]
      .find(name => name.toLowerCase().includes(qLow) || qLow.includes(name.toLowerCase()));
    if (artistMatch) {
      const artistTracks = results.filter(r => r.artist.toLowerCase().includes(artistMatch.toLowerCase()));
      const artistPhoto = getArtistPhoto(artistMatch);
      const coverSrc = artistPhoto || artistTracks[0]?.cover || getPlaceholderCover("music");
      const placeholder = getPlaceholderCover("music");

      const header = document.createElement("div");
      header.className = "search-artist-header";
      header.innerHTML = `
        <div class="search-artist-photo-wrap">
          <img class="search-artist-photo" src="${coverSrc}" alt="${artistMatch}">
        </div>
        <div class="search-artist-meta">
          <span class="search-artist-label">Artista</span>
          <h2 class="search-artist-name">${artistMatch}</h2>
          <span class="search-artist-count">${artistTracks.length} canción${artistTracks.length !== 1 ? 'es' : ''}</span>
        </div>`;

      const img = header.querySelector(".search-artist-photo");
      img.onerror = () => { img.onerror = null; fetchArtistPhotoFromWiki(artistMatch, img, placeholder); };
      if (!artistPhoto) fetchArtistPhotoFromWiki(artistMatch, img, coverSrc);

      header.addEventListener("click", () => {
        if (artistTracks.length > 0) loadTrack(artistTracks[0], false, artistTracks);
      });
      searchResults.appendChild(header);

      // Section label for tracks
      const tracksLabel = document.createElement("p");
      tracksLabel.className = "search-section-label";
      tracksLabel.textContent = "Canciones";
      searchResults.appendChild(tracksLabel);
    }
    // ────────────────────────────────────────────────────────

    results.forEach(item => {
      const cover = item.cover || getPlaceholderCover(item.category);

      // Outer wrapper for swipe reveal (same pattern as playlist-detail)
      const wrap = document.createElement("div");
      wrap.className = "search-result-row-wrap";

      // Green add-to-playlist background (revealed on left swipe)
      const addBg = document.createElement("div");
      addBg.className = "search-result-add-bg";
      addBg.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>AÑADIR</span>`;
      wrap.appendChild(addBg);

      const row = document.createElement("div");
      row.className = "search-result-row";
      row.innerHTML = `
        <img src="${cover}" alt="${item.title}" onerror="this.src='${getPlaceholderCover(item.category)}'" />
        <div class="search-result-info">
          <span class="search-result-title">${item.title}</span>
          <span class="search-result-artist">${item.artist}</span>
        </div>
        <div class="search-result-actions">
          <button class="search-result-add-btn" title="Añadir a playlist" aria-label="Añadir a playlist">
            <svg viewBox="0 0 24 24" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button class="search-result-more-btn library-action-more" title="Más opciones" aria-label="Más opciones">
            <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/></svg>
          </button>
        </div>
        <span class="search-result-cat">${item.category}</span>`;
      row.addEventListener("click", e => {
        if (e.target.closest(".search-result-more-btn")) return;
        if (e.target.closest(".search-result-add-btn")) return;
        loadTrack(item); showPage("pageHome");
      });
      row.querySelector(".search-result-add-btn").addEventListener("click", e => { e.stopPropagation(); openAddToPlaylist(item); });
      row.querySelector(".search-result-more-btn").addEventListener("click", e => { e.stopPropagation(); openContextMenu(item); });

      // ── Swipe-to-add-to-playlist (touch) ──────────────────────
      const SWIPE_THRESHOLD = 72;
      let _swipeStartX = 0, _swipeStartY = 0, _swipeDx = 0, _swiping = false, _swipeLocked = false;

      row.addEventListener("touchstart", e => {
        _swipeStartX = e.touches[0].clientX;
        _swipeStartY = e.touches[0].clientY;
        _swipeDx = 0;
        _swiping = false;
        _swipeLocked = false;
        row.classList.remove("snap-back");
      }, { passive: true });

      row.addEventListener("touchmove", e => {
        const dx = e.touches[0].clientX - _swipeStartX;
        const dy = e.touches[0].clientY - _swipeStartY;

        if (!_swipeLocked) {
          if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            _swipeLocked = true;
            if (Math.abs(dy) > Math.abs(dx)) return; // vertical scroll wins
            _swiping = true;
          } else return;
        }
        if (!_swiping) return;

        _swipeDx = Math.min(0, dx); // only left
        row.style.transform = `translateX(${_swipeDx}px)`;
        row.classList.add("swiping");
        wrap.classList.add("swiping");

        const ratio = Math.min(1, Math.abs(_swipeDx) / SWIPE_THRESHOLD);
        addBg.style.opacity = ratio;
        addBg.style.background = ratio >= 1 ? "#16a34a" : "#22c55e";
      }, { passive: true });

      row.addEventListener("touchend", () => {
        row.classList.remove("swiping");
        wrap.classList.remove("swiping");
        addBg.style.opacity = "";
        addBg.style.background = "";

        if (!_swiping) return;
        _swiping = false;

        if (Math.abs(_swipeDx) >= SWIPE_THRESHOLD) {
          // Snap back and open add-to-playlist
          row.classList.add("snap-back");
          row.style.transform = "";
          setTimeout(() => row.classList.remove("snap-back"), 350);
          hapticFeedback("medium");
          openAddToPlaylist(item);
        } else {
          // Snap back
          row.classList.add("snap-back");
          row.style.transform = "";
          setTimeout(() => row.classList.remove("snap-back"), 350);
        }
        _swipeDx = 0;
      }, { passive: true });

      wrap.appendChild(row);
      searchResults.appendChild(wrap);
    });
  }, 220);
});
searchClear.addEventListener("click", () => {
  searchInput.value = ""; searchClear.style.display = "none";
  searchBrowse.style.display = ""; searchResults.style.display = "none"; searchResults.innerHTML = "";
});

/* ══════════════════════════════════════════════════════
   18. MEDIA SESSION
══════════════════════════════════════════════════════ */
function setupMediaSession(item) {
  if (!("mediaSession" in navigator)) return;

  const cover = item.cover || getPlaceholderCover(item.category);

  // Determinar el tipo MIME real de la imagen para mayor compatibilidad
  const imgType = cover.startsWith("data:image/svg") ? "image/svg+xml" : "image/jpeg";

  navigator.mediaSession.metadata = new MediaMetadata({
    title:  item.title,
    artist: item.artist,
    album:  item.category,
    artwork: [
      { src: cover, sizes: "96x96",   type: imgType },
      { src: cover, sizes: "128x128", type: imgType },
      { src: cover, sizes: "192x192", type: imgType },
      { src: cover, sizes: "256x256", type: imgType },
      { src: cover, sizes: "384x384", type: imgType },
      { src: cover, sizes: "512x512", type: imgType },
    ]
  });

  // play — también actualiza la UI para que los iconos sean coherentes
  navigator.mediaSession.setActionHandler("play", () => {
    const audio = activeAudio;
    if (!audio) return;
    audio.muted = false;
    if (audio.volume === 0) audio.volume = 1;
    audio.play()
      .then(() => { isPlaying = true; updatePlayIcons(true); })
      .catch(() => {});
  });

  // pause — también actualiza la UI
  navigator.mediaSession.setActionHandler("pause", () => {
    const audio = activeAudio;
    if (!audio) return;
    audio.pause();
    isPlaying = false;
    updatePlayIcons(false);
  });

  // Controles de pista
  navigator.mediaSession.setActionHandler("previoustrack", () => {
    const audio = activeAudio;
    if (audio) {
      audio.muted = false;
      if (audio.volume === 0) audio.volume = 1;
    }
    playPrev();
  });
  navigator.mediaSession.setActionHandler("nexttrack",     () => {
    const audio = activeAudio;
    if (audio) {
      audio.muted = false;
      if (audio.volume === 0) audio.volume = 1;
    }
    playNext();
  });

  // Desregistrar seekbackward/seekforward para que Android muestre flechas prev/next
  try { navigator.mediaSession.setActionHandler("seekbackward", null); } catch(_) {}
  try { navigator.mediaSession.setActionHandler("seekforward",  null); } catch(_) {}

  // seekto — barra de progreso en pantalla bloqueada
  try {
    navigator.mediaSession.setActionHandler("seekto", ({ seekTime, fastSeek }) => {
      const audio = activeAudio;
      if (!audio) return;
      const dur = audio.duration;
      if (!dur || !isFinite(dur)) return;
      const t = Math.max(0, Math.min(dur, seekTime));
      if (fastSeek && audio.fastSeek) {
        audio.fastSeek(t);
      } else {
        audio.currentTime = t;
      }
    });
  } catch(_) {}

  // Sincronizar posición inicial para la barra de la pantalla bloqueada
  _updateMediaSessionPosition();
}

/* Actualiza el estado de posición en la Media Session de forma segura */
function _updateMediaSessionPosition() {
  if (!("mediaSession" in navigator)) return;
  try {
    const audio = activeAudio;
    if (!audio) return;
    const dur = audio.duration;
    const cur = audio.currentTime;
    if (!dur || !isFinite(dur) || dur <= 0) return;
    // iOS lanza excepción si position > duration, forzamos el clamp
    const safePos = Math.max(0, Math.min(cur, dur - 0.01));
    navigator.mediaSession.setPositionState({
      duration:     dur,
      playbackRate: audio.playbackRate || 1,
      position:     safePos
    });
  } catch(_) {}
}

/* ══════════════════════════════════════════════════════
   19. KEYBOARD + SCROLL
══════════════════════════════════════════════════════ */

document.addEventListener("keydown", e => {
  if (document.activeElement.tagName === "INPUT") return;
  if (e.key === " ")          { e.preventDefault(); togglePlay(); }
  if (e.key === "Escape")     { nowPlayingSheet.classList.remove("open"); closeContextMenu(); closeQueuePanel(); }
  if (e.key === "ArrowRight") playNext();
  if (e.key === "ArrowLeft")  playPrev();
});

window.addEventListener("scroll", () => {
  document.getElementById("topbar").classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

/* ══════════════════════════════════════════════════════
   19b. HERO EXPLORE fix (heroExplore now optional)
══════════════════════════════════════════════════════ */
if (typeof heroExplore !== 'undefined' && heroExplore) {
  heroExplore.addEventListener("click", () => {
    const gs = document.getElementById("gridSection");
    if (gs) gs.scrollIntoView({ behavior: "smooth" });
  });
}

/* ══════════════════════════════════════════════════════
   HOME SCREEN v2 — Premium redesign
══════════════════════════════════════════════════════ */
function renderHomeScreen() {
  /* ── 1. Continue listening ── */
  const continueSection = document.getElementById("homeContinueSection");
  const hccCover   = document.getElementById("hccCover");
  const hccTitle   = document.getElementById("hccTitle");
  const hccArtist  = document.getElementById("hccArtist");
  const hccGlow    = document.getElementById("hccGlow");
  const hccPlayBtn = document.getElementById("hccPlayBtn");
  const hccFill    = document.getElementById("hccProgressFill");

  if (historyTracks.length > 0) {
    const lastTrack = getTrackByFile(historyTracks[0].file);
    if (lastTrack) {
      const cover = lastTrack.cover || getPlaceholderCover(lastTrack.category);
      hccCover.src = cover;
      hccCover.onerror = () => { hccCover.src = getPlaceholderCover(lastTrack.category); };
      hccTitle.textContent = lastTrack.title;
      hccArtist.textContent = lastTrack.artist;
      if (hccGlow) hccGlow.style.backgroundImage = `url(${cover})`;
      // Show progress if this is the current track
      const isCurrentTrack = playlist[currentTrackIdx]?.file === lastTrack.file;
      if (isCurrentTrack && activeAudio.duration) {
        const pct = (activeAudio.currentTime / activeAudio.duration) * 100;
        if (hccFill) hccFill.style.width = pct + "%";
      }
      if (hccPlayBtn) {
        hccPlayBtn.onclick = () => {
          const currentFile = playlist[currentTrackIdx]?.file;
          if (currentFile === lastTrack.file) {
            togglePlay();
          } else {
            loadTrack(lastTrack);
          }
        };
      }
      continueSection.style.display = "";
    }
  }

  /* ── 3. User playlists ── */
  const plSection = document.getElementById("homePlSection");
  const plGrid    = document.getElementById("homePlGrid");
  if (plGrid && playlists.length > 0) {
    plGrid.innerHTML = "";
    playlists.slice(0, 10).forEach(pl => {
      const trackImgs = pl.tracks.slice(0, 4).map(f => getTrackByFile(f)?.cover || "").filter(Boolean);
      const card = document.createElement("div");
      card.className = "home-pl-card";
      const coverHTML = trackImgs.length === 0
        ? `<div class="home-pl-cover home-pl-cover--empty"><svg viewBox="0 0 24 24" width="24" height="24" style="opacity:.25"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg></div>`
        : trackImgs.length === 1
          ? `<div class="home-pl-cover"><img src="${trackImgs[0]}" alt=""></div>`
          : `<div class="home-pl-cover home-pl-cover--grid">${trackImgs.slice(0,4).map(s=>`<img src="${s}" alt="">`).join("")}</div>`;
      card.innerHTML = `${coverHTML}<p class="home-pl-name">${pl.name}</p><p class="home-pl-count">${pl.tracks.length} canciones</p>`;
      card.addEventListener("click", () => openPlaylistDetail(pl.id));
      plGrid.appendChild(card);
    });
    if (plSection) plSection.style.display = "";
  }

  /* ── 4. Recently played ── */
  const recentSection = document.getElementById("homeRecentSection");
  const recentGrid    = document.getElementById("homeRecentGrid");
  if (recentGrid && historyTracks.length > 0) {
    recentGrid.innerHTML = "";
    const shown = historyTracks.slice(0, 7);
    shown.forEach(entry => {
      const item = getTrackByFile(entry.file);
      if (!item) return;
      const cover = item.cover || getPlaceholderCover(item.category);
      const card = document.createElement("div");
      card.className = "home-track-card";
      card.innerHTML = `
        <div class="home-track-cover">
          <img src="${cover}" alt="${item.title}" onerror="this.src='${getPlaceholderCover(item.category)}'">
          <div class="home-track-play-overlay">
            <svg viewBox="0 0 24 24" fill="white" stroke="none" width="18" height="18"><polygon points="5,3 19,12 5,21"/></svg>
          </div>
          <button class="home-track-more-btn" aria-label="Más opciones">
            <svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="5" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none"/></svg>
          </button>
        </div>
        <p class="home-track-title">${item.title}</p>
        <p class="home-track-artist">${item.artist}</p>`;
      card.addEventListener("click", e => { if (!e.target.closest(".home-track-more-btn")) loadTrack(item); });
      card.querySelector(".home-track-more-btn").addEventListener("click", e => { e.stopPropagation(); openContextMenu(item); });
      recentGrid.appendChild(card);
    });
    if (recentSection) recentSection.style.display = "";
  }

  /* ── 5. Top artists ── */
  const artistsSection = document.getElementById("homeArtistsSection");
  const artistsGrid    = document.getElementById("homeArtistsGrid");
  if (artistsGrid) {
    // Build artist map from play counts
    const artistMap = {};
    media.forEach(item => {
      const cnt = playCounts[item.file] || 0;
      if (!artistMap[item.artist]) artistMap[item.artist] = { name: item.artist, count: 0, cover: item.cover, category: item.category };
      artistMap[item.artist].count += cnt;
    });

    let artists = Object.values(artistMap);
    // Show top played, or if no plays yet, sample from media
    const topArtists = artists.filter(a => a.count > 0).sort((a, b) => b.count - a.count).slice(0, 5);
    const displayArtists = topArtists.length >= 4 ? topArtists : shuffleArray(artists).slice(0, 5);

    if (displayArtists.length > 0) {
      artistsGrid.innerHTML = "";
      displayArtists.forEach(artist => {
        const artistPhoto = getArtistPhoto(artist.name);
        const cover = artistPhoto || artist.cover || getPlaceholderCover(artist.category);
        const placeholder = getPlaceholderCover(artist.category);
        const card = document.createElement("div");
        card.className = "home-artist-card";
        card.innerHTML = `
          <div class="home-artist-img-wrap">
            <img src="${cover}" alt="${artist.name}">
          </div>
          <p class="home-artist-name">${artist.name.split(',')[0].trim()}</p>`;
        const img = card.querySelector('img');
        img.onerror = () => {
          img.onerror = null; // Prevent loop
          fetchArtistPhotoFromWiki(artist.name, img, placeholder);
        };
        // If no dedicated artist photo, proactively try Wikipedia
        if (!artistPhoto) {
          fetchArtistPhotoFromWiki(artist.name, img, cover);
        }
        card.addEventListener("click", () => {
          // Navigate to search with artist name
          const si = document.getElementById("searchInput");
          if (si) { si.value = artist.name.split(',')[0].trim(); si.dispatchEvent(new Event('input')); }
          showPage("pageSearch");
        });
        artistsGrid.appendChild(card);
      });
      if (artistsSection) artistsSection.style.display = "";
    }
  }

  /* ── 6. Featured tracks (always visible) ── */
  const featuredGrid = document.getElementById("homeFeaturedGrid");
  if (featuredGrid && featuredGrid.innerHTML === "") {
    const allMusic = media.filter(m => m.type === "music");
    const picks = shuffleArray(allMusic).slice(0, 12);
    picks.forEach(item => {
      const cover = item.cover || getPlaceholderCover(item.category);
      const card = document.createElement("div");
      card.className = "home-track-card";
      card.innerHTML = `
        <div class="home-track-cover">
          <img src="${cover}" alt="${item.title}" onerror="this.src='${getPlaceholderCover(item.category)}'">
          <div class="home-track-play-overlay">
            <svg viewBox="0 0 24 24" fill="white" stroke="none" width="18" height="18"><polygon points="5,3 19,12 5,21"/></svg>
          </div>
          <button class="home-track-more-btn" aria-label="Más opciones">
            <svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="5" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none"/></svg>
          </button>
        </div>
        <p class="home-track-title">${item.title}</p>
        <p class="home-track-artist">${item.artist}</p>`;
      card.addEventListener("click", e => { if (!e.target.closest(".home-track-more-btn")) loadTrack(item, false, allMusic); });
      card.querySelector(".home-track-more-btn").addEventListener("click", e => { e.stopPropagation(); openContextMenu(item); });
      featuredGrid.appendChild(card);
    });
  }

  /* ── 7. Genre pills in home (always visible) ── */
  const homeGenreGrid = document.getElementById("homeGenreGrid");
  if (homeGenreGrid && homeGenreGrid.innerHTML === "") {
    const colors = ["#e94f4f","#1db954","#1f77b4","#d62728","#9467bd","#ff7f0e","#2ca02c","#ff1493"];
    getCategories().forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.className = "genre-pill";
      btn.style.background = colors[i % colors.length];
      btn.innerHTML = `<span>${cat}</span>`;
      btn.addEventListener("click", () => openGenreDetail(cat));
      homeGenreGrid.appendChild(btn);
    });
  }

  /* ── Quick access buttons ── */
  document.querySelectorAll(".home-quick-item[data-page]").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
  });
  const quickDownloads = document.getElementById("quickDownloads");
  if (quickDownloads) {
    quickDownloads.addEventListener("click", () => {
      if (typeof showPage === 'function') showPage('pageDownloads');
      if (typeof OfflineManager !== 'undefined') OfflineManager.renderDownloadsList();
      if (typeof renderOfflinePlaylist === 'function') renderOfflinePlaylist();
      if (typeof updateOfflineStatusBanner === 'function') updateOfflineStatusBanner();
    });
  }
  const quickHistory = document.getElementById("quickHistory");
  if (quickHistory) {
    quickHistory.addEventListener("click", () => {
      showPage("pageSearch");
    });
  }

  /* ── Section "Ver todo" links ── */
  document.querySelectorAll(".home-section-link[data-page]").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
  });
}

/* ── Update continue card progress while playing ── */
let _hccRafPending = false;
function updateHomeContinueProgress() {
  if (_hccRafPending) return;
  _hccRafPending = true;
  requestAnimationFrame(() => {
    _hccRafPending = false;
    const fill = document.getElementById("hccProgressFill");
    if (!fill) return;
    const audio = activeAudio;
    if (audio && audio.duration && isPlaying) {
      fill.style.width = ((audio.currentTime / audio.duration) * 100) + "%";
    }
  });
}

/* ══════════════════════════════════════════════════════
   20b. MISSING CORE FUNCTIONS
   togglePlay · playNext · playPrev · queue · haptic
══════════════════════════════════════════════════════ */

/* ── Haptic feedback (best-effort) ─────────────────── */
function hapticFeedback(style) {
  try {
    if (navigator.vibrate) {
      const pattern = style === 'medium' ? 20 : style === 'heavy' ? 40 : 10;
      navigator.vibrate(pattern);
    }
  } catch(_) {}
}

/* ── Toggle play / pause ────────────────────────────── */
function togglePlay() {
  const audio = activeAudio;
  if (!audio) return;
  // If no source loaded yet, do nothing
  if (!audio.src && !audio.currentSrc) return;
  if (audio.paused) {
    audio.play()
      .then(() => {
        isPlaying = true;
        updatePlayIcons(true);
        if ("mediaSession" in navigator) {
          try { navigator.mediaSession.playbackState = "playing"; } catch(_) {}
        }
      })
      .catch(err => {
        if (err.name === 'NotAllowedError') {
          window._droplyPendingTrack = true;
        } else {
          console.warn('[DROPLY] togglePlay error:', err);
        }
      });
  } else {
    audio.pause();
    isPlaying = false;
    updatePlayIcons(false);
    if ("mediaSession" in navigator) {
      try { navigator.mediaSession.playbackState = "paused"; } catch(_) {}
    }
  }
}

/* ── Play next track ────────────────────────────────── */
function playNext() {
  // Check queue first
  if (queue.length > 0) {
    const nextFile = queue.shift();
    saveQueue();
    const item = getTrackByFile(nextFile);
    if (item) {
      const audio = activeAudio;
      if (audio) {
        audio.muted = false;
        if (audio.volume === 0) audio.volume = 1;
      }
      // Si estamos offline y la canción no está descargada, vaciamos la cola y buscamos la siguiente disponible
      if (!navigator.onLine && typeof OfflineManager !== 'undefined' && !OfflineManager.isDownloaded(item.file)) {
        saveQueue();
        renderQueueList();
        // Fall through to playlist
      } else {
        loadTrack(item, true);
        renderQueueList();
        return;
      }
    }
  }
  if (playlist.length === 0) return;

  const isOffline = !navigator.onLine;
  const maxTries  = playlist.length;
  let   tries     = 0;

  let nextIdx = currentTrackIdx;
  do {
    if (shuffleMode) {
      nextIdx = Math.floor(Math.random() * playlist.length);
    } else {
      nextIdx = (nextIdx + 1) % playlist.length;
    }
    tries++;
    const candidate = playlist[nextIdx];
    // En modo offline solo reproducir si está descargada (o si no hay OfflineManager)
    if (!isOffline || typeof OfflineManager === 'undefined' || OfflineManager.isDownloaded(candidate.file)) {
      currentTrackIdx = nextIdx;
      const audio = activeAudio;
      if (audio) {
        audio.muted = false;
        if (audio.volume === 0) audio.volume = 1;
      }
      loadTrack(candidate, true);
      return;
    }
  } while (tries < maxTries);

  // Ningún track disponible offline
  if (isOffline && typeof showToast === 'function') {
    showToast('Sin canciones descargadas disponibles', 'default');
  }
}

/* ── Play previous track ────────────────────────────── */
function playPrev() {
  const audio = activeAudio || audioEl;
  // If more than 3s in, restart current track
  if (audio && audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  if (playlist.length === 0) return;

  const isOffline = !navigator.onLine;
  const maxTries  = playlist.length;
  let   tries     = 0;
  let   prevIdx   = currentTrackIdx;

  do {
    prevIdx = (prevIdx - 1 + playlist.length) % playlist.length;
    tries++;
    const candidate = playlist[prevIdx];
    if (!isOffline || typeof OfflineManager === 'undefined' || OfflineManager.isDownloaded(candidate.file)) {
      currentTrackIdx = prevIdx;
      const audio = activeAudio;
      if (audio) {
        audio.muted = false;
        if (audio.volume === 0) audio.volume = 1;
      }
      loadTrack(candidate, true);
      return;
    }
  } while (tries < maxTries);

  if (isOffline && typeof showToast === 'function') {
    showToast('Sin canciones descargadas disponibles', 'default');
  }
}

/* ── Add to queue ───────────────────────────────────── */
function addToQueue(item) {
  if (!item?.file) return;
  queue.push(item.file);
  saveQueue();
  renderQueueList();
  showToast(`"${item.title}" añadida a la cola`, 'success');
}

/* ── Render queue now playing ───────────────────────── */
function renderQueueNowPlaying(item) {
  if (!queueNowPlaying) return;
  const cover = item.cover || getPlaceholderCover(item.category);
  queueNowPlaying.innerHTML = `
    <p class="queue-now-label">Reproduciendo ahora</p>
    <div class="queue-now-card">
      <div class="queue-now-cover-wrap">
        <img class="queue-now-img" src="${cover}" alt="${item.title}" />
        <div class="queue-now-bars">
          <div class="queue-now-bar"></div>
          <div class="queue-now-bar"></div>
          <div class="queue-now-bar"></div>
        </div>
      </div>
      <div class="queue-now-info">
        <div class="queue-now-title">${item.title}</div>
        <div class="queue-now-artist">${item.artist}</div>
        <div class="queue-now-progress">
          <div class="queue-now-progress-fill" id="queueProgressFill"></div>
        </div>
      </div>
    </div>`;
  // Update ambient glow with cover color
  const ambient = document.getElementById('queueAmbient');
  if (ambient) {
    ambient.style.background = `radial-gradient(ellipse 90% 45% at 50% -5%, rgba(139,92,246,.22) 0%, transparent 70%)`;
  }
  // Sync progress bar
  _syncQueueProgress();
}

function _syncQueueProgress() {
  const fill = document.getElementById('queueProgressFill');
  if (!fill) return;
  const audio = document.getElementById('mainAudio');
  if (!audio || !audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  fill.style.width = pct + '%';
}

// Tick progress bar while queue is open
setInterval(() => {
  if (document.getElementById('queuePanel')?.classList.contains('open')) {
    _syncQueueProgress();
  }
}, 500);

/* ── Smart Infinite Queue ───────────────────────────── */
const INFINITE_QUEUE_MIN = 3; // refill when fewer than this many tracks remain
const INFINITE_QUEUE_MAX = 12; // keep at most this many auto-added tracks

function _getRecentFiles(n = 20) {
  const recent = new Set();
  // current track
  const cur = playlist[currentTrackIdx];
  if (cur) recent.add(cur.file);
  // queue items
  queue.forEach(f => recent.add(f));
  // history
  if (typeof historyTracks !== 'undefined') {
    historyTracks.slice(0, n).forEach(h => recent.add(h.file));
  }
  return recent;
}

function _getSimilarTracks(seedItem, count = 3) {
  if (!seedItem) return [];
  const musicTracks = media.filter(m => m.type === 'music');
  const recent = _getRecentFiles(15);

  // Score each track by similarity
  const scored = musicTracks
    .filter(m => !recent.has(m.file))
    .map(m => {
      let score = 0;
      if (m.category === seedItem.category) score += 3;
      if (m.artist === seedItem.artist) score += 2;
      // same genre keyword in artist name
      const seedWords = (seedItem.artist || '').toLowerCase().split(/[\s,&]+/);
      const mWords    = (m.artist || '').toLowerCase().split(/[\s,&]+/);
      const overlap   = seedWords.filter(w => w.length > 2 && mWords.includes(w)).length;
      score += overlap;
      // add randomness for discovery
      score += Math.random() * 1.5;
      return { track: m, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(s => s.track);

  return scored;
}

function _autoFillQueue() {
  if (queue.length >= INFINITE_QUEUE_MIN) return;
  const hint = document.getElementById('queueInfiniteHint');
  const seed = playlist[currentTrackIdx] ||
               (queue.length > 0 ? getTrackByFile(queue[queue.length - 1]) : null);
  if (!seed) return;

  const needed = INFINITE_QUEUE_MIN + 2 - queue.length;
  const similar = _getSimilarTracks(seed, needed);
  if (similar.length === 0) return;

  similar.forEach(t => {
    if (queue.length < INFINITE_QUEUE_MAX) {
      queue.push(t.file);
    }
  });
  saveQueue();
  renderQueueList();
  if (hint) {
    hint.style.display = 'flex';
    setTimeout(() => { if (hint) hint.style.display = 'none'; }, 3500);
  }
}

/* ── Render queue list ──────────────────────────────── */
function renderQueueList() {
  if (!queueList) return;
  const countBadge = document.getElementById('queueCountBadge');

  if (queue.length === 0) {
    if (queueNextLabel) queueNextLabel.style.display = 'none';
    queueList.innerHTML = `
      <div class="queue-empty">
        <div class="queue-empty-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
        </div>
        <p><strong>La cola está vacía</strong><br>Añade canciones desde la biblioteca o<br>activa la cola infinita</p>
      </div>`;
    return;
  }

  if (queueNextLabel) queueNextLabel.style.display = '';
  if (countBadge) countBadge.textContent = queue.length;

  const prevItems = new Set([...queueList.querySelectorAll('.queue-item')].map(el => el.dataset.file));
  queueList.innerHTML = '';

  queue.forEach((file, i) => {
    const item = getTrackByFile(file);
    if (!item) return;
    const cover = item.cover || getPlaceholderCover(item.category);
    const isNew = !prevItems.has(file);
    const row = document.createElement('div');
    row.className = 'queue-item' + (isNew ? ' queue-item-new' : '');
    row.dataset.file = file;
    row.dataset.index = i;
    if (isNew) row.style.animationDelay = (i * 30) + 'ms';
    row.draggable = true;
    row.innerHTML = `
      <div class="queue-item-drag" title="Arrastrar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/></svg>
      </div>
      <div class="queue-item-cover">
        <img src="${cover}" alt="${item.title}" loading="lazy" />
        <div class="queue-item-num">${i + 1}</div>
      </div>
      <div class="queue-item-info">
        <div class="queue-item-title">${item.title}</div>
        <div class="queue-item-artist">${item.artist}</div>
      </div>
      <div class="queue-item-actions">
        <button class="queue-item-btn" data-action="remove" title="Quitar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`;

    // Click to play
    row.addEventListener('click', e => {
      if (e.target.closest('[data-action="remove"]')) {
        queue.splice(i, 1);
        saveQueue();
        renderQueueList();
        if (typeof navigator.vibrate === 'function') navigator.vibrate(30);
        return;
      }
      loadTrack(item, true);
    });

    // Drag & Drop
    row.addEventListener('dragstart', e => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', i);
      row.classList.add('dragging');
      if (typeof navigator.vibrate === 'function') navigator.vibrate([10, 20, 10]);
    });
    row.addEventListener('dragend', () => row.classList.remove('dragging'));
    row.addEventListener('dragover', e => {
      e.preventDefault();
      document.querySelectorAll('.queue-item.drag-over').forEach(el => el.classList.remove('drag-over'));
      row.classList.add('drag-over');
    });
    row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
    row.addEventListener('drop', e => {
      e.preventDefault();
      row.classList.remove('drag-over');
      const from = parseInt(e.dataTransfer.getData('text/plain'));
      const to   = parseInt(row.dataset.index);
      if (from === to || isNaN(from) || isNaN(to)) return;
      const [moved] = queue.splice(from, 1);
      queue.splice(to, 0, moved);
      saveQueue();
      renderQueueList();
      if (typeof navigator.vibrate === 'function') navigator.vibrate(20);
    });

    queueList.appendChild(row);
  });

  // Trigger auto-fill if queue is running low
  setTimeout(_autoFillQueue, 200);
}

/* ── Open / close queue panel ───────────────────────── */
function openQueuePanel() {
  if (!queuePanel) return;
  queuePanel.classList.add('open');
  if (queueOverlay) queueOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQueuePanel() {
  if (!queuePanel) return;
  queuePanel.classList.remove('open');
  if (queueOverlay) queueOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Wire up player buttons (sheet + mini) ──────────── */
(function wirePlayerButtons() {
  if (sheetPlay) sheetPlay.addEventListener('click', togglePlay);
  if (sheetNext) sheetNext.addEventListener('click', playNext);
  if (sheetPrev) sheetPrev.addEventListener('click', playPrev);
  if (miniPlay)  miniPlay.addEventListener('click',  togglePlay);
  if (miniNext)  miniNext.addEventListener('click',  playNext);

  if (miniPlayerExpand) {
    miniPlayerExpand.addEventListener('click', () => {
      nowPlayingSheet.classList.add('open');
    });
  }
  if (sheetClose) {
    sheetClose.addEventListener('click', () => nowPlayingSheet.classList.remove('open'));
  }
  if (sheetHeart) {
    sheetHeart.addEventListener('click', () => {
      const cur = playlist[currentTrackIdx];
      if (cur) toggleLike(cur);
    });
  }
  if (sheetAddMenu) {
    sheetAddMenu.addEventListener('click', () => {
      const cur = playlist[currentTrackIdx];
      if (cur) openContextMenu(cur);
    });
  }
  if (sheetShuffle) {
    sheetShuffle.addEventListener('click', () => {
      shuffleMode = !shuffleMode;
      sheetShuffle.classList.toggle('active', shuffleMode);
      showToast(shuffleMode ? 'Aleatorio activado' : 'Aleatorio desactivado');
    });
  }
  if (sheetRepeat) {
    sheetRepeat.addEventListener('click', () => {
      repeatMode = !repeatMode;
      sheetRepeat.classList.toggle('active', repeatMode);
      showToast(repeatMode ? 'Repetición activada' : 'Repetición desactivada');
    });
  }
  if (sheetQueueBtn) sheetQueueBtn.addEventListener('click', openQueuePanel);
  if (queueCloseBtn) queueCloseBtn.addEventListener('click', closeQueuePanel);
  if (queueOverlay)  queueOverlay.addEventListener('click', closeQueuePanel);
  if (queueClearBtn) {
    queueClearBtn.addEventListener('click', () => {
      queue = [];
      saveQueue();
      renderQueueList();
      showToast('Cola vaciada');
    });
  }

  // Context menu legacy buttons (desktop fallback)
  if (ctxPlayNow) ctxPlayNow.addEventListener('click', () => { if (contextTarget) { loadTrack(contextTarget); closeContextMenu(); } });
  if (ctxAddQueue) ctxAddQueue.addEventListener('click', () => { if (contextTarget) { addToQueue(contextTarget); closeContextMenu(); } });
  if (ctxAddPlaylist) ctxAddPlaylist.addEventListener('click', () => { if (contextTarget) { openAddToPlaylist(contextTarget); closeContextMenu(); } });
  if (ctxLike) ctxLike.addEventListener('click', () => { if (contextTarget) { toggleLike(contextTarget); closeContextMenu(); } });
})();

/* ══════════════════════════════════════════════════════
   20. INIT
══════════════════════════════════════════════════════ */
(function init() {
  playlist = media.filter(m => m.type === "music");
  playlistSource = "library";
  buildCategoryPills();
  renderGrid();
  buildGenreGrid();
  renderQueueList();
  renderHomeScreen();
  initChangelog();

  // Hook progress update
  if (audioEl) {
    audioEl.addEventListener("timeupdate", updateHomeContinueProgress, { passive: true });
  }
})();/* ═══════════════════════════════════════════════════════════
   DROPLY — premium.js  v1.0
   Módulos: Offline/Descargas · Modo Coche · Transferencia · Cloud Sync
   
   IMPORTANTE: Este fichero se carga DESPUÉS de script.js.
   Extiende sin modificar el código original.
═══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════
   MÓDULO 1 — GESTIÓN OFFLINE / DESCARGAS (IndexedDB)
══════════════════════════════════════════════════════ */
const OfflineManager = (() => {
  const DB_NAME    = 'droply_offline_v1';
  const DB_VERSION = 1;
  const STORE_AUDIO  = 'audio';
  const STORE_COVERS = 'covers';
  const STORE_META   = 'meta';

  let db = null;

  /* ─── Open DB ─────────────────────────────────── */
  async function openDB() {
    if (db) return db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains(STORE_AUDIO))  d.createObjectStore(STORE_AUDIO);
        if (!d.objectStoreNames.contains(STORE_COVERS)) d.createObjectStore(STORE_COVERS);
        if (!d.objectStoreNames.contains(STORE_META))   d.createObjectStore(STORE_META);
      };
      req.onsuccess = e => { db = e.target.result; resolve(db); };
      req.onerror   = () => reject(req.error);
    });
  }

  /* ─── Generic IDB helpers ─────────────────────── */
  async function idbSet(store, key, value) {
    const d = await openDB();
    return new Promise((res, rej) => {
      const tx = d.transaction(store, 'readwrite');
      tx.objectStore(store).put(value, key);
      tx.oncomplete = () => res(true);
      tx.onerror    = () => rej(tx.error);
    });
  }
  async function idbGet(store, key) {
    const d = await openDB();
    return new Promise((res, rej) => {
      const req = d.transaction(store, 'readonly').objectStore(store).get(key);
      req.onsuccess = () => res(req.result || null);
      req.onerror   = () => rej(req.error);
    });
  }
  async function idbDel(store, key) {
    const d = await openDB();
    return new Promise((res, rej) => {
      const tx = d.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);
      tx.oncomplete = () => res(true);
      tx.onerror    = () => rej(tx.error);
    });
  }
  async function idbKeys(store) {
    const d = await openDB();
    return new Promise((res, rej) => {
      const req = d.transaction(store, 'readonly').objectStore(store).getAllKeys();
      req.onsuccess = () => res(req.result || []);
      req.onerror   = () => rej(req.error);
    });
  }

  /* ─── State ───────────────────────────────────── */
  const downloadStates = new Map(); // file -> 'pending'|'downloading'|'done'|'error'
  let downloadedKeys   = new Set();
  let downloadQueue    = [];
  let isDownloading    = false;

  /* ─── Init ────────────────────────────────────── */
  async function init() {
    try {
      await openDB();
      const keys = await idbKeys(STORE_META);
      downloadedKeys = new Set(keys);
      keys.forEach(k => downloadStates.set(k, 'done'));
      updateAllCardDownloadButtons();
      updateDownloadsBadge();
    } catch(e) {
      console.warn('[DROPLY Offline] IndexedDB no disponible:', e);
    }
  }

  /* ─── Download a track ────────────────────────── */
  async function downloadTrack(item, onProgress) {
    if (!item?.file) return;
    const key = item.file;
    if (downloadStates.get(key) === 'done') return;
    if (downloadStates.get(key) === 'downloading') return;

    downloadStates.set(key, 'downloading');
    updateCardDownloadBtn(key, 'downloading');

    try {
      // Fetch audio — cache:'reload' evita interferencia del SW
      // Usa blob() como fallback para iOS Safari (no soporta ReadableStream)
      const audioResp = await fetch(key, { cache: 'reload' });
      if (!audioResp.ok) throw new Error(`HTTP ${audioResp.status}`);

      let audioBlob;
      if (audioResp.body && typeof audioResp.body.getReader === 'function') {
        const total  = parseInt(audioResp.headers.get('content-length') || '0');
        const reader = audioResp.body.getReader();
        const chunks = [];
        let loaded   = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.byteLength;
          if (total > 0 && onProgress) onProgress(loaded / total);
        }
        audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
      } else {
        // Fallback Safari
        audioBlob = await audioResp.blob();
      }

      // Fetch cover (best-effort)
      let coverBlob = null;
      try {
        const coverResp = await fetch(item.cover, { cache: 'reload' });
        if (coverResp.ok) coverBlob = await coverResp.blob();
      } catch(_) {}

      // Save to IDB
      await idbSet(STORE_AUDIO,  key, audioBlob);
      await idbSet(STORE_META,   key, { title: item.title, artist: item.artist, category: item.category, duration: item.duration, cover: item.cover, file: item.file, downloadedAt: Date.now() });
      if (coverBlob) await idbSet(STORE_COVERS, key, coverBlob);

      downloadStates.set(key, 'done');
      downloadedKeys.add(key);
      updateCardDownloadBtn(key, 'done');
      updateDownloadsBadge();
      if (typeof renderOfflinePlaylist === 'function') renderOfflinePlaylist();
      if (typeof showToast === 'function') showToast(`"${item.title}" guardada offline ✓`, 'success');
    } catch(err) {
      downloadStates.set(key, 'error');
      updateCardDownloadBtn(key, 'error');
      console.warn('[DROPLY Offline] Error al descargar:', key, err);
      if (typeof showToast === 'function') showToast(`Error al descargar "${item.title}"`, 'error');
    }
  }

  /* ─── Get offline audio src ───────────────────── */
  async function getOfflineSrc(file) {
    if (!downloadedKeys.has(file)) return null;
    try {
      const blob = await idbGet(STORE_AUDIO, file);
      if (!blob) return null;
      return URL.createObjectURL(blob);
    } catch(_) { return null; }
  }

  /* ─── Delete a download ───────────────────────── */
  async function deleteDownload(key) {
    await idbDel(STORE_AUDIO,  key);
    await idbDel(STORE_COVERS, key);
    await idbDel(STORE_META,   key);
    downloadStates.delete(key);
    downloadedKeys.delete(key);
    updateCardDownloadBtn(key, 'none');
    updateDownloadsBadge();
    if (typeof renderOfflinePlaylist === 'function') renderOfflinePlaylist();
  }

  /* ─── Get all downloaded meta ─────────────────── */
  async function getAllDownloads() {
    const d = await openDB();
    return new Promise((res, rej) => {
      const req = d.transaction(STORE_META, 'readonly').objectStore(STORE_META).getAll();
      req.onsuccess = () => res(req.result || []);
      req.onerror   = () => rej(req.error);
    });
  }

  /* ─── Estimate storage ────────────────────────── */
  async function getStorageEstimate() {
    try {
      if (navigator.storage?.estimate) {
        const { usage, quota } = await navigator.storage.estimate();
        return { usage, quota };
      }
    } catch(_) {}
    return { usage: 0, quota: 0 };
  }

  /* ─── UI helpers ──────────────────────────────── */
  function getCardDownloadBtn(file) {
    return document.querySelector(`.card-download-btn[data-file="${CSS.escape(file)}"]`);
  }

  function updateCardDownloadBtn(file, state) {
    const btn = getCardDownloadBtn(file);
    if (!btn) return;
    btn.classList.remove('downloaded', 'downloading', 'error');
    const svgDownload = `<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
    const svgDone     = `<svg viewBox="0 0 24 24" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>`;
    const svgSpin     = `<svg viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`;
    if (state === 'done')        { btn.classList.add('downloaded'); btn.innerHTML = svgDone; btn.title = 'Guardado offline'; }
    else if (state === 'downloading') { btn.classList.add('downloading'); btn.innerHTML = svgSpin; btn.title = 'Descargando...'; }
    else if (state === 'error')  { btn.innerHTML = svgDownload; btn.title = 'Reintentar descarga'; }
    else                         { btn.innerHTML = svgDownload; btn.title = 'Descargar para offline'; }
  }

  function updateAllCardDownloadButtons() {
    document.querySelectorAll('.card-download-btn').forEach(btn => {
      const file = btn.dataset.file;
      if (!file) return;
      const state = downloadStates.get(file) || 'none';
      updateCardDownloadBtn(file, state);
    });
  }

  function updateDownloadsBadge() {
    const badge = document.querySelector('#bnavDownloads .nav-badge');
    if (!badge) return;
    const count = downloadedKeys.size;
    badge.textContent  = count > 99 ? '99+' : count;
    badge.classList.toggle('visible', count > 0);
  }

  /* ─── Render downloads page ───────────────────── */
  async function renderDownloadsList() {
    const container = document.getElementById('downloadsListContainer');
    if (!container) return;
    const bar    = document.getElementById('offlineStorageFill');
    const barLbl = document.getElementById('offlineStorageSize');

    const { usage, quota } = await getStorageEstimate();
    if (bar && quota > 0) {
      bar.style.width = Math.min(100, (usage / quota) * 100) + '%';
    }
    if (barLbl) {
      const usedMB  = (usage / 1024 / 1024).toFixed(1);
      const totalGB = quota > 0 ? (quota / 1024 / 1024 / 1024).toFixed(1) : '—';
      barLbl.textContent = `${usedMB} MB / ${totalGB} GB`;
    }

    const items = await getAllDownloads();
    if (items.length === 0) {
      container.innerHTML = `<div class="offline-empty">
        <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <h3>Sin descargas</h3>
        <p>Pulsa el ícono ↓ en cualquier canción para guardarla y escucharla sin internet.</p>
      </div>`;
      return;
    }

    const fragment = document.createDocumentFragment();
    items.sort((a,b) => (b.downloadedAt||0) - (a.downloadedAt||0)).forEach(item => {
      // Wrap for swipe-to-delete
      const wrap = document.createElement('div');
      wrap.className = 'playlist-detail-item-wrap';
      wrap.style.borderRadius = '10px';
      wrap.style.marginBottom = '2px';

      const deleteBg = document.createElement('div');
      deleteBg.className = 'playlist-detail-item-delete-bg';
      deleteBg.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg><span>BORRAR</span>`;
      wrap.appendChild(deleteBg);

      const row = document.createElement('div');
      row.className = 'library-item fade-in playlist-detail-item';
      row.style.margin = '0';
      const cover = item.cover || (typeof getPlaceholderCover === 'function' ? getPlaceholderCover(item.category) : '');
      row.innerHTML = `
        <div class="library-thumb"><img src="${cover}" alt="${item.title}" /></div>
        <div class="library-info">
          <span class="library-track-title">${item.title}</span>
          <span class="library-track-artist">${item.artist} · <span style="color:var(--green);font-size:.7rem">✓ Offline</span></span>
        </div>
        <div class="library-item-actions">
          <button class="library-action-btn" data-action="delete" title="Eliminar descarga" style="color:var(--text-soft)">
            <svg viewBox="0 0 24 24" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
        <span class="library-item-dur">${item.duration || ''}</span>`;
      row.addEventListener('click', async e => {
        if (e.target.closest('[data-action="delete"]')) {
          e.stopPropagation();
          await deleteDownload(item.file);
          return;
        }
        if (typeof hapticFeedback === 'function') hapticFeedback('light');
        const trackItem = { ...item };
        const offlineSrc = await getOfflineSrc(item.file);
        if (offlineSrc && typeof loadTrack === 'function') {
          const patchedItem = { ...trackItem, _offlineSrc: offlineSrc };
          loadTrack(patchedItem);
        } else if (typeof loadTrack === 'function') {
          loadTrack(trackItem);
        }
      });

      // Swipe-to-delete touch handler
      const SWIPE_THRESHOLD = 72;
      let _sx = 0, _sy = 0, _dx = 0, _sw = false, _locked = false;
      row.addEventListener('touchstart', e => {
        _sx = e.touches[0].clientX; _sy = e.touches[0].clientY;
        _dx = 0; _sw = false; _locked = false;
        row.classList.remove('snap-back');
      }, { passive: true });
      row.addEventListener('touchmove', e => {
        const dx = e.touches[0].clientX - _sx;
        const dy = e.touches[0].clientY - _sy;
        if (!_locked) {
          if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            _locked = true;
            if (Math.abs(dy) > Math.abs(dx)) return;
            _sw = true;
          } else return;
        }
        if (!_sw) return;
        _dx = Math.min(0, dx);
        row.style.transform = `translateX(${_dx}px)`;
        row.classList.add('swiping'); wrap.classList.add('swiping');
        const ratio = Math.min(1, Math.abs(_dx) / SWIPE_THRESHOLD);
        deleteBg.style.opacity = ratio;
        deleteBg.style.background = ratio >= 1 ? '#c0392b' : '#e94f4f';
      }, { passive: true });
      row.addEventListener('touchend', () => {
        row.classList.remove('swiping'); wrap.classList.remove('swiping');
        deleteBg.style.opacity = ''; deleteBg.style.background = '';
        if (!_sw) return; _sw = false;
        if (Math.abs(_dx) >= SWIPE_THRESHOLD) {
          row.classList.add('fly-out');
          if (typeof hapticFeedback === 'function') hapticFeedback('medium');
          setTimeout(async () => {
            wrap.style.maxHeight = wrap.offsetHeight + 'px';
            wrap.style.transition = 'max-height .28s ease, opacity .28s';
            wrap.style.overflow = 'hidden';
            requestAnimationFrame(() => { wrap.style.maxHeight = '0'; wrap.style.opacity = '0'; });
            setTimeout(async () => { await deleteDownload(item.file); }, 280);
          }, 60);
        } else {
          row.classList.add('snap-back');
          row.style.transform = '';
          setTimeout(() => row.classList.remove('snap-back'), 350);
        }
        _dx = 0;
      }, { passive: true });

      wrap.appendChild(row);
      fragment.appendChild(wrap);
    });
    container.innerHTML = '';
    container.appendChild(fragment);
  }

  /* ─── Offline detection ───────────────────────── */
  function setupOfflineDetection() {
    const badge = document.getElementById('offlineStatusBadge');
    if (!badge) return;

    function updateStatus() {
      const online = navigator.onLine;
      badge.classList.toggle('is-offline', !online);
      badge.classList.toggle('is-online', online);
      badge.querySelector('.badge-text').textContent = online ? 'Conexión restaurada' : 'Sin conexión — modo offline';
      badge.classList.add('visible');
      clearTimeout(badge._hideTimer);
      badge._hideTimer = setTimeout(() => badge.classList.remove('visible'), online ? 2800 : 999999);
      if (!online && typeof showToast === 'function') {
        showToast('Sin internet — reproduciendo desde caché', 'default');
      }
    }

    window.addEventListener('online',  updateStatus);
    window.addEventListener('offline', updateStatus);

    if (!navigator.onLine) updateStatus();
  }

  return { init, downloadTrack, getOfflineSrc, deleteDownload, renderDownloadsList, isDownloaded: k => downloadedKeys.has(k), updateAllCardDownloadButtons, setupOfflineDetection };
})();


/* ══════════════════════════════════════════════════════
   MÓDULO 2 — MODO COCHE
══════════════════════════════════════════════════════ */
const CarMode = (() => {
  let active = false;
  let clockTimer = null;
  let swipeStartX = 0;
  let swipeStartY = 0;
  let suggestDismissed = false;

  function formatTimeClock() {
    const now = new Date();
    return now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  }

  function activate() {
    const panel = document.getElementById('carModePanel');
    if (!panel) return;
    active = true;
    panel.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (typeof hapticFeedback === 'function') hapticFeedback('medium');
    syncCarModeToPlayer();
    startClock();
    document.getElementById('carModeTopbarBtn')?.classList.add('active');
    hideSuggest();
    if (typeof showToast === 'function') showToast('Modo Coche activado', 'success');
  }

  function deactivate() {
    const panel = document.getElementById('carModePanel');
    if (!panel) return;
    active = false;
    panel.classList.remove('active');
    document.body.style.overflow = '';
    stopClock();
    document.getElementById('carModeTopbarBtn')?.classList.remove('active');
    if (typeof hapticFeedback === 'function') hapticFeedback('light');
  }

  function toggle() { active ? deactivate() : activate(); }

  function startClock() {
    const el = document.getElementById('carModeTime');
    if (!el) return;
    el.textContent = formatTimeClock();
    clockTimer = setInterval(() => { el.textContent = formatTimeClock(); }, 15000);
  }
  function stopClock() {
    clearInterval(clockTimer); clockTimer = null;
  }

  function syncCarModeToPlayer() {
    // Pull current state from main player globals
    const title  = (typeof sheetTitle  !== 'undefined' && sheetTitle.textContent)  || '—';
    const artist = (typeof sheetArtist !== 'undefined' && sheetArtist.textContent) || '—';
    const src    = (typeof sheetCover  !== 'undefined' && sheetCover.src)          || '';

    const cTitle  = document.getElementById('carModeTitle');
    const cArtist = document.getElementById('carModeArtist');
    const cCover  = document.getElementById('carModeCoverImg');
    const cBgImg  = document.getElementById('carModeBgImg');

    if (cTitle)  cTitle.textContent  = title;
    if (cArtist) cArtist.textContent = artist;
    if (cCover && src)  { cCover.src = src; }
    if (cBgImg && src)  { cBgImg.src = src; }

    updateCarPlayState();
    updateCarProgress();
  }

  function updateCarPlayState() {
    const playBtn   = document.getElementById('carPlayBtn');
    const coverEl   = document.getElementById('carModeCover');
    const playing   = typeof isPlaying !== 'undefined' ? isPlaying : false;
    if (playBtn) {
      playBtn.innerHTML = playing
        ? `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="3" width="4" height="18"/><rect x="14" y="3" width="4" height="18"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5,3 19,12 5,21"/></svg>`;
    }
    coverEl?.classList.toggle('playing', playing);
  }

  function updateCarProgress() {
    if (!active) return;
    const audio    = typeof audioEl !== 'undefined' ? audioEl : null;
    const fill     = document.getElementById('carModeBarFill');
    const current  = document.getElementById('carModeCurrent');
    const durEl    = document.getElementById('carModeDuration');
    if (!audio || !fill) return;
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    fill.style.width = pct + '%';
    if (current && typeof formatTime === 'function') current.textContent = formatTime(audio.currentTime);
    if (durEl   && typeof formatTime === 'function') durEl.textContent   = formatTime(audio.duration || 0);
  }

  function setupSwipeGestures(panel) {
    panel.addEventListener('touchstart', e => {
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
    }, { passive: true });

    panel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - swipeStartX;
      const dy = e.changedTouches[0].clientY - swipeStartY;
      if (Math.abs(dx) < Math.abs(dy)) return; // vertical swipe — ignore
      if (Math.abs(dx) < 60) return; // too short
      if (typeof hapticFeedback === 'function') hapticFeedback('medium');
      if (dx < 0 && typeof playNext === 'function') playNext();
      if (dx > 0 && typeof playPrev === 'function') playPrev();
    }, { passive: true });
  }

  function showSuggest() {
    if (suggestDismissed || active) return;
    const toast = document.getElementById('carSuggestToast');
    if (toast) toast.classList.add('visible');
  }
  function hideSuggest() {
    document.getElementById('carSuggestToast')?.classList.remove('visible');
  }

  function setupBluetoothDetect() {
    // Detect headset/car bluetooth via audio output change
    navigator.mediaDevices?.addEventListener?.('devicechange', async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasHeadset = devices.some(d => d.kind === 'audiooutput' && d.label.toLowerCase().match(/bluetooth|hands.free|car|auto/i));
        if (hasHeadset && !active && !suggestDismissed) {
          setTimeout(showSuggest, 1500);
        }
      } catch(_) {}
    });
  }

  return {
    activate, deactivate, toggle, active: () => active, isActive: () => active,
    syncToPlayer: syncCarModeToPlayer,
    updatePlayState: updateCarPlayState,
    updateProgress: updateCarProgress,
    setup(panel) {
      setupSwipeGestures(panel);
      setupBluetoothDetect();
      // Progress bar click
      const bar = panel.querySelector('#carModeBar');
      if (bar) {
        bar.addEventListener('click', e => {
          const audio = typeof audioEl !== 'undefined' ? audioEl : null;
          if (!audio?.duration) return;
          const rect = bar.getBoundingClientRect();
          const pct  = (e.clientX - rect.left) / rect.width;
          audio.currentTime = pct * audio.duration;
        });
      }
    },
    showSuggest, hideSuggest,
    setSuggestDismissed: () => { suggestDismissed = true; }
  };
})();


/* ══════════════════════════════════════════════════════
   MÓDULO 3 — TRANSFERENCIA ENTRE DISPOSITIVOS (desactivado)
══════════════════════════════════════════════════════ */
const TransferManager = (() => {
  const SESSION_KEY = 'droply_transfer_session';
  let channel = null;
  let sessionId = null;
  let knownDevices = new Map(); // id -> { name, lastSeen, platform }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function getSessionId() {
    if (sessionId) return sessionId;
    sessionId = sessionStorage.getItem(SESSION_KEY) || generateId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
    return sessionId;
  }

  function getPlatformName() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) return 'iPhone/iPad';
    if (/Android/.test(ua)) return 'Android';
    if (/Mac/.test(ua)) return 'Mac';
    if (/Windows/.test(ua)) return 'Windows';
    return 'Dispositivo';
  }

  function getDeviceLabel() {
    return getPlatformName() + ' — ' + getSessionId().slice(-4).toUpperCase();
  }

  /* ─── BroadcastChannel (same-origin tabs/windows) */
  function setupBroadcast() {
    if (!('BroadcastChannel' in window)) return;
    try {
      channel = new BroadcastChannel('droply_transfer');
      channel.onmessage = e => handleIncomingMessage(e.data);
      // Announce presence
      broadcastMessage({ type: 'ANNOUNCE', id: getSessionId(), label: getDeviceLabel(), platform: getPlatformName() });
      // Ping every 15s to keep alive
      setInterval(() => broadcastMessage({ type: 'PING', id: getSessionId(), label: getDeviceLabel() }), 15000);
    } catch(_) {}
  }

  function broadcastMessage(data) {
    try { channel?.postMessage(data); } catch(_) {}
  }

  function handleIncomingMessage(data) {
    if (!data?.type || data.id === getSessionId()) return;
    switch (data.type) {
      case 'ANNOUNCE':
      case 'PING':
        knownDevices.set(data.id, { name: data.label || data.id, platform: data.platform || '?', lastSeen: Date.now() });
        refreshDevicesList();
        // Reply with our presence
        broadcastMessage({ type: 'PING', id: getSessionId(), label: getDeviceLabel() });
        break;
      case 'TRANSFER_REQUEST': {
        // Another tab wants to receive playback
        const state = getCurrentState();
        broadcastMessage({ type: 'TRANSFER_RESPONSE', to: data.id, from: getSessionId(), state });
        break;
      }
      case 'TRANSFER_RESPONSE': {
        if (data.to !== getSessionId()) return;
        applyState(data.state);
        showTransferSuccess();
        break;
      }
      case 'TRANSFER_PUSH': {
        // Someone is pushing state to us
        applyState(data.state);
        showTransferSuccess();
        break;
      }
    }
  }

  function getCurrentState() {
    const audio = typeof audioEl !== 'undefined' ? audioEl : null;
    const track = typeof playlist !== 'undefined' && typeof currentTrackIdx !== 'undefined'
      ? playlist[currentTrackIdx] : null;
    return {
      file:        track?.file || null,
      title:       track?.title || '',
      artist:      track?.artist || '',
      cover:       track?.cover || '',
      category:    track?.category || '',
      currentTime: audio?.currentTime || 0,
      isPlaying:   typeof isPlaying !== 'undefined' ? isPlaying : false,
      volume:      audio?.volume ?? 1,
      shuffleMode: typeof shuffleMode !== 'undefined' ? shuffleMode : false,
      repeatMode:  typeof repeatMode  !== 'undefined' ? repeatMode  : false,
      queue:       typeof queue !== 'undefined' ? [...queue] : [],
    };
  }

  async function applyState(state) {
    if (!state?.file) return;
    const track = typeof media !== 'undefined' ? media.find(m => m.file === state.file) : null;
    if (!track) return;

    if (typeof loadTrack === 'function') {
      loadTrack(track);
      // Seek to exact position after audio loads
      const audio = typeof audioEl !== 'undefined' ? audioEl : null;
      if (audio) {
        const trySeek = () => {
          if (audio.readyState >= 2) {
            audio.currentTime = state.currentTime || 0;
            audio.volume = state.volume ?? 1;
            if (!state.isPlaying) audio.pause();
          } else {
            audio.addEventListener('canplay', () => {
              audio.currentTime = state.currentTime || 0;
              audio.volume = state.volume ?? 1;
              if (!state.isPlaying) audio.pause();
            }, { once: true });
          }
        };
        setTimeout(trySeek, 300);
      }
    }
    if (typeof showToast === 'function') showToast('Reproducción recibida de otro dispositivo', 'success');
  }

  function transferTo(deviceId) {
    const state = getCurrentState();
    broadcastMessage({ type: 'TRANSFER_PUSH', to: deviceId, from: getSessionId(), state });
    if (typeof showToast === 'function') showToast('Reproducción enviada', 'success');
    closePanel();
  }

  function requestFrom(deviceId) {
    broadcastMessage({ type: 'TRANSFER_REQUEST', to: deviceId, from: getSessionId() });
  }

  function showTransferSuccess() {
    const panel = document.getElementById('transferPanel');
    if (panel) panel.classList.add('transfer-success-flash');
    setTimeout(() => panel?.classList.remove('transfer-success-flash'), 500);
    closePanel();
  }

  /* ─── QR fallback ─────────────────────────────── */
  function generateQRData() {
    const state = getCurrentState();
    return JSON.stringify({ v: 1, id: getSessionId(), state });
  }

  function drawQRCode(canvas, text) {
    // Simple QR-like visual using canvas (actual QR lib not loaded — display session info)
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    // Draw a simple data matrix representation
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000';
    const bytes = [...text].map(c => c.charCodeAt(0));
    const cell  = size / 10;
    bytes.slice(0, 100).forEach((b, i) => {
      if (b % 2 === 0) {
        const x = (i % 10) * cell;
        const y = Math.floor(i / 10) * cell;
        ctx.fillRect(x, y, cell - 1, cell - 1);
      }
    });
    // Finder patterns
    ctx.fillRect(0, 0, cell * 3, cell);
    ctx.fillRect(0, 0, cell, cell * 3);
    ctx.fillRect(cell * 2, 0, cell, cell * 3);
    ctx.fillRect(0, cell * 2, cell * 3, cell);
    ctx.fillRect(cell * 7, 0, cell * 3, cell);
    ctx.fillRect(cell * 9, 0, cell, cell * 3);
    ctx.fillRect(cell * 7, cell * 2, cell * 3, cell);
  }

  /* ─── Panel UI ────────────────────────────────── */
  function openPanel() {
    document.getElementById('transferPanel')?.classList.add('open');
    document.getElementById('transferOverlay')?.classList.add('open');
    refreshDevicesList();
    updateTransferCurrentCard();
    // Draw QR
    const canvas = document.getElementById('transferQRCanvas');
    if (canvas) drawQRCode(canvas, getSessionId());
    document.getElementById('transferSessionId').textContent = getSessionId();
  }

  function closePanel() {
    document.getElementById('transferPanel')?.classList.remove('open');
    document.getElementById('transferOverlay')?.classList.remove('open');
  }

  function updateTransferCurrentCard() {
    const audio = typeof audioEl !== 'undefined' ? audioEl : null;
    const track = typeof playlist !== 'undefined' && typeof currentTrackIdx !== 'undefined'
      ? playlist[currentTrackIdx] : null;
    if (!track) return;

    const titleEl  = document.getElementById('transferCurrentTitle');
    const artistEl = document.getElementById('transferCurrentArtist');
    const coverEl  = document.getElementById('transferCurrentCover');
    const timeEl   = document.getElementById('transferCurrentTime');

    if (titleEl)  titleEl.textContent  = track.title  || '—';
    if (artistEl) artistEl.textContent = track.artist || '—';
    if (coverEl)  coverEl.src  = track.cover || '';
    if (timeEl && audio && typeof formatTime === 'function') {
      timeEl.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration || 0);
    }
  }

  function refreshDevicesList() {
    const container = document.getElementById('transferDevicesList');
    if (!container) return;

    // Clean stale devices (>30s)
    const now = Date.now();
    knownDevices.forEach((d, id) => { if (now - d.lastSeen > 30000) knownDevices.delete(id); });

    if (knownDevices.size === 0) {
      container.innerHTML = `<div style="text-align:center;padding:1.5rem;color:var(--text-soft);font-size:.82rem">
        <div style="font-size:2rem;margin-bottom:.5rem">📱</div>
        Abre DROPLY en otro dispositivo o pestaña para ver dispositivos disponibles.
      </div>`;
      return;
    }

    container.innerHTML = '';
    knownDevices.forEach((device, id) => {
      const el = document.createElement('div');
      el.className = 'transfer-device-item';
      const icon = device.platform?.includes('iPhone') || device.platform?.includes('iPad') ? '📱'
        : device.platform?.includes('Android') ? '📱'
        : device.platform?.includes('Mac') ? '💻' : '🖥';
      el.innerHTML = `
        <div class="transfer-device-icon"><span style="font-size:1.3rem">${icon}</span></div>
        <div class="transfer-device-info">
          <div class="transfer-device-name">${device.name}</div>
          <div class="transfer-device-status online">Disponible</div>
        </div>
        <button class="transfer-device-btn" data-action="send" data-id="${id}">Enviar</button>`;
      el.querySelector('[data-action="send"]').addEventListener('click', e => {
        e.stopPropagation();
        transferTo(id);
      });
      container.appendChild(el);
    });
  }

  return {
    init() { setupBroadcast(); },
    open: openPanel,
    close: closePanel,
    getDeviceLabel,
    getSessionId,
  };
})();


/* ══════════════════════════════════════════════════════
   MÓDULO 4 — SINCRONIZACIÓN CLOUD (localStorage + BroadcastChannel)
   Nota: Para sync real entre dispositivos distintos se necesita
   backend. Esta implementación sincroniza tabs del mismo navegador
   + persiste estado para "continuar donde lo dejé" en el mismo device.
══════════════════════════════════════════════════════ */
const CloudSync = (() => {
  const STATE_KEY = 'droply_cloud_state_v1';
  let syncChannel = null;
  let syncTimer   = null;
  let dirty       = false;
  let indicator   = null;

  function getState() {
    const audio = typeof audioEl !== 'undefined' ? audioEl : null;
    const track = typeof playlist !== 'undefined' && typeof currentTrackIdx !== 'undefined'
      ? playlist[currentTrackIdx] : null;
    return {
      file:        track?.file || null,
      currentTime: audio?.currentTime || 0,
      isPlaying:   typeof isPlaying !== 'undefined' ? isPlaying : false,
      volume:      audio?.volume ?? 1,
      shuffleMode: typeof shuffleMode !== 'undefined' ? shuffleMode : false,
      repeatMode:  typeof repeatMode  !== 'undefined' ? repeatMode  : false,
      queue:       typeof queue !== 'undefined' ? [...queue] : [],
      playlists:   typeof playlists !== 'undefined' ? playlists : [],
      liked:       typeof likedTracks !== 'undefined' ? [...likedTracks] : [],
      history:     typeof historyTracks !== 'undefined' ? historyTracks.slice(0, 50) : [],
      playCounts:  typeof playCounts !== 'undefined' ? playCounts : {},
      ts:          Date.now(),
    };
  }

  function saveState() {
    try {
      const state = getState();
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      // Broadcast to other tabs
      syncChannel?.postMessage({ type: 'STATE_UPDATE', state });
      showSynced();
    } catch(e) {
      showError();
    }
  }

  function loadSavedState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch(_) { return null; }
  }

  async function restoreLastSession() {
    const state = loadSavedState();
    if (!state?.file) return;
    // Only restore if recent (< 7 days)
    if (Date.now() - (state.ts || 0) > 7 * 24 * 3600 * 1000) return;
    const track = typeof media !== 'undefined' ? media.find(m => m.file === state.file) : null;
    if (!track) return;

    // Restore volume
    const audio = typeof audioEl !== 'undefined' ? audioEl : null;
    if (audio && state.volume != null) audio.volume = state.volume;
    if (typeof volSlider !== 'undefined') volSlider.value = state.volume ?? 1;

    // Load track silently (paused)
    if (typeof loadTrack === 'function') {
      loadTrack(track);
      // Seek without autoplay
      if (audio) {
        const trySeek = () => {
          if (audio.readyState >= 2) {
            audio.currentTime = state.currentTime || 0;
            audio.pause();
          } else {
            audio.addEventListener('canplay', () => {
              audio.currentTime = state.currentTime || 0;
              audio.pause();
            }, { once: true });
          }
        };
        setTimeout(trySeek, 400);
      }
    }
  }

  function setDirty() {
    dirty = true;
    showSyncing();
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => { if (dirty) { saveState(); dirty = false; } }, 2500);
  }

  function showSyncing() { setIndicatorState('syncing'); }
  function showSynced()  { setIndicatorState('synced');  setTimeout(() => setIndicatorState(''), 2000); }
  function showError()   { setIndicatorState('error');  }

  function setIndicatorState(state) {
    if (!indicator) indicator = document.getElementById('cloudSyncIndicator');
    if (!indicator) return;
    indicator.classList.remove('syncing', 'synced', 'error');
    if (state) indicator.classList.add(state);
    const txt = indicator.querySelector('.sync-text');
    if (txt) {
      txt.textContent = state === 'syncing' ? 'Guardando…' : state === 'synced' ? 'Guardado' : state === 'error' ? 'Error' : '';
    }
  }

  function setupChannel() {
    if (!('BroadcastChannel' in window)) return;
    try {
      syncChannel = new BroadcastChannel('droply_cloud_sync');
      syncChannel.onmessage = e => {
        const { type, state } = e.data || {};
        if (type !== 'STATE_UPDATE' || !state) return;
        // Sync playlists, liked from other tab
        if (state.playlists && typeof playlists !== 'undefined') {
          playlists.length = 0;
          playlists.push(...state.playlists);
          if (typeof savePlaylists === 'function') savePlaylists();
        }
        if (state.liked && typeof likedTracks !== 'undefined') {
          likedTracks.clear();
          state.liked.forEach(f => likedTracks.add(f));
          if (typeof saveLiked === 'function') saveLiked();
        }
      };
    } catch(_) {}
  }

  /* ─── Hook into existing audio events ────────── */
  function hookPlayerEvents() {
    const audio = typeof audioEl !== 'undefined' ? audioEl : null;
    if (!audio) return;

    // Save state on meaningful events
    audio.addEventListener('play',     setDirty, { passive: true });
    audio.addEventListener('pause',    setDirty, { passive: true });
    audio.addEventListener('seeked',   setDirty, { passive: true });
    audio.addEventListener('ended',    setDirty, { passive: true });

    // Throttled timeupdate save (every 10s)
    let lastTimeSave = 0;
    audio.addEventListener('timeupdate', () => {
      const now = Date.now();
      if (now - lastTimeSave > 10000) {
        lastTimeSave = now;
        setDirty();
      }
    }, { passive: true });
  }

  return {
    init() {
      setupChannel();
      hookPlayerEvents();
      // Restore after a small delay (player must be ready)
      setTimeout(restoreLastSession, 800);
    },
    markDirty: setDirty,
    save: saveState,
  };
})();


/* ══════════════════════════════════════════════════════
   MÓDULO 5 — SERVICE WORKER (PWA offline)
══════════════════════════════════════════════════════ */
function registerServiceWorker() {
  // El SW ya está registrado en index.html con /sw.js
  // Esta función solo verifica que está activo y no hace nada más
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready.then(reg => {
    console.info('[DROPLY Premium] SW activo:', reg.scope);
  }).catch(() => {});
}


/* ══════════════════════════════════════════════════════
   DOM INJECTION — Inyectar elementos HTML en la página
══════════════════════════════════════════════════════ */
function injectPremiumDOM() {

  /* ── Offline status badge ─────────────────────── */
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="offline-badge" id="offlineStatusBadge">
      <span class="badge-dot"></span>
      <span class="badge-text">Sin conexión — modo offline</span>
    </div>`);

  /* ── Car mode suggest toast ───────────────────── */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="car-suggest-toast" id="carSuggestToast">
      <div class="car-suggest-row">
        <div class="car-suggest-icon">
          <svg viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none"/><circle cx="20" cy="17" r="1.5" fill="currentColor" stroke="none"/></svg>
        </div>
        <div class="car-suggest-info">
          <div class="car-suggest-title">¿Estás en el coche?</div>
          <div class="car-suggest-sub">Activa el modo coche para una experiencia más segura</div>
        </div>
      </div>
      <div class="car-suggest-actions">
        <button class="car-suggest-btn primary" id="carSuggestActivate">Activar modo coche</button>
        <button class="car-suggest-btn secondary" id="carSuggestDismiss">No, gracias</button>
      </div>
    </div>`);

  /* ── Car mode full-screen panel ───────────────── */
  document.body.insertAdjacentHTML('beforeend', `
    <div class="car-mode-panel" id="carModePanel" role="dialog" aria-label="Modo Coche">
      <div class="car-mode-bg">
        <img class="car-mode-bg-img" id="carModeBgImg" src="" alt="" aria-hidden="true" />
      </div>
      <div class="car-mode-header">
        <span class="car-mode-logo">DROPLY</span>
        <span class="car-mode-time" id="carModeTime">00:00</span>
        <button class="car-mode-exit-btn" id="carModeExitBtn">Salir</button>
      </div>
      <div class="car-mode-cover-section">
        <div class="car-mode-cover" id="carModeCover">
          <img id="carModeCoverImg" src="" alt="Portada" />
        </div>
        <div class="car-mode-info">
          <h2 class="car-mode-title" id="carModeTitle">—</h2>
          <p class="car-mode-artist" id="carModeArtist">—</p>
        </div>
      </div>
      <div class="car-mode-progress-wrap">
        <div class="car-mode-bar" id="carModeBar" role="slider" aria-label="Progreso">
          <div class="car-mode-bar-fill" id="carModeBarFill"></div>
        </div>
        <div class="car-mode-times">
          <span id="carModeCurrent">0:00</span>
          <span id="carModeDuration">0:00</span>
        </div>
      </div>
      <div class="car-mode-controls">
        <button class="car-ctrl-btn secondary" id="carPrevBtn" aria-label="Anterior">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="19,20 9,12 19,4"/><rect x="5" y="4" width="3" height="16"/></svg>
        </button>
        <button class="car-ctrl-btn primary" id="carPlayBtn" aria-label="Play/Pause">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5,3 19,12 5,21"/></svg>
        </button>
        <button class="car-ctrl-btn secondary" id="carNextBtn" aria-label="Siguiente">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5,20 15,12 5,4"/><rect x="16" y="4" width="3" height="16"/></svg>
        </button>
      </div>
      <p class="car-swipe-hint">← Desliza para cambiar canción →</p>
    </div>`);

  /* ── Transfer panel (removed) ─────────────────── */

  /* ── Cloud sync indicator ─────────────────────── */
  const topbarActions = document.querySelector('.topbar-actions');
  if (topbarActions) {
    topbarActions.insertAdjacentHTML('afterbegin', `
      <div class="cloud-sync-indicator" id="cloudSyncIndicator" title="Estado de sincronización">
        <svg class="sync-icon" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></svg>
        <span class="sync-text"></span>
      </div>`);

    /* ── Car mode topbar button ─────────────────── */
    topbarActions.insertAdjacentHTML('afterbegin', `
      <button class="car-mode-topbar-btn topbar-icon-btn" id="carModeTopbarBtn" title="Modo Coche" aria-label="Modo Coche">
        <svg viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none"/><circle cx="20" cy="17" r="1.5" fill="currentColor" stroke="none"/></svg>
      </button>`);
  }

  /* ── Transfer button in now-playing sheet ─────── */
  const sheetVolumeWrap = document.querySelector('.sheet-volume-wrap');
  if (sheetVolumeWrap) {
    sheetVolumeWrap.insertAdjacentHTML('afterend', `
      <div class="sheet-extra-row">
        <button class="sheet-transfer-btn" id="sheetTransferBtn">
          <svg viewBox="0 0 24 24" width="15" height="15"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m13 0h-3a2 2 0 0 0-2 2v3"/><circle cx="12" cy="12" r="3"/></svg>
          Transferir a otro dispositivo
        </button>
      </div>`);
  }

  /* ── Downloads page ───────────────────────────── */
  const pagesContainer = document.getElementById('pagesContainer');
  if (pagesContainer) {
    pagesContainer.insertAdjacentHTML('beforeend', `
      <div class="page" id="pageDownloads">
        <div class="library-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.6rem">
          <h2 class="library-title">
            <svg viewBox="0 0 24 24" width="22" height="22" style="display:inline;margin-right:.4rem;vertical-align:middle"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Offline
          </h2>
          <button class="offline-clear-btn" id="offlineClearAllBtn">Liberar espacio</button>
        </div>

        <!-- ── Connectivity banner ── -->
        <div class="offline-status-banner is-online" id="offlineStatusBanner">
          <svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg>
          <span id="offlineStatusText">Conectado — escucha también sin internet</span>
        </div>

        <!-- ── Offline playlist ── -->
        <div class="offline-playlist-section">
          <div class="offline-playlist-header">
            <div>
              <div class="offline-playlist-title">Mis canciones guardadas</div>
              <div class="offline-playlist-count" id="offlinePlaylistCount">0 canciones</div>
            </div>
            <div class="offline-playlist-controls">
              <button class="offline-shuffle-btn" id="offlineShuffleBtn" title="Aleatorio">
                <svg viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
                Aleatorio
              </button>
              <button class="offline-play-all-btn" id="offlinePlayAllBtn">
                <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
                Reproducir todo
              </button>
            </div>
          </div>
          <div class="offline-track-list" id="offlineTrackList">
            <div class="offline-empty-playlist">
              <strong>Sin canciones guardadas</strong>
              <p>Descarga canciones pulsando el botón <svg viewBox="0 0 24 24" width="13" height="13" style="display:inline;vertical-align:middle"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> en cualquier canción para escucharlas sin conexión.</p>
            </div>
          </div>
        </div>

        <!-- ── Storage ── -->
        <div class="page-offline-downloads">
          <div class="offline-storage-bar">
            <div class="offline-storage-label">
              <span class="offline-storage-title">Almacenamiento usado</span>
              <span class="offline-storage-size" id="offlineStorageSize">—</span>
            </div>
            <div class="offline-storage-track">
              <div class="offline-storage-fill" id="offlineStorageFill" style="width:0%"></div>
            </div>
          </div>
        </div>
      </div>`);
  }

  /* ── Offline tab in bottom nav ────────────────── */
  const bottomNav = document.getElementById('bottomNav');
  if (bottomNav) {
    bottomNav.insertAdjacentHTML('beforeend', `
      <button class="bnav-btn" data-page="pageDownloads" aria-label="Descargas offline">
        <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span>Offline</span>
        <span class="nav-badge" id="bnavDownloadsBadge"></span>
      </button>`);
  }
}


/* ══════════════════════════════════════════════════════
   PATCH EXISTING FUNCTIONS — Extender sin modificar
══════════════════════════════════════════════════════ */
function patchExistingFunctions() {

  /* ── Patch renderGrid to add download buttons ─── */
  const origRenderGrid = typeof renderGrid === 'function' ? renderGrid : null;
  if (origRenderGrid) {
    // Override by wrapping via MutationObserver on mediaGrid
    const mediaGrid = document.getElementById('mediaGrid');
    if (mediaGrid) {
      const observer = new MutationObserver(() => {
        mediaGrid.querySelectorAll('.media-card:not([data-dl-patched])').forEach(card => {
          card.dataset.dlPatched = '1';
          const cover = card.querySelector('.card-cover');
          if (!cover) return;
          // Find track by cover src or title
          const img = card.querySelector('.card-cover img');
          const titleEl = card.querySelector('.card-title');
          if (!img || !titleEl) return;
          const title = titleEl.textContent.trim();
          const track = typeof media !== 'undefined' ? media.find(m => m.title === title) : null;
          if (!track) return;

          const btn = document.createElement('button');
          btn.className = 'card-download-btn';
          btn.dataset.file = track.file;
          btn.title = 'Descargar para offline';
          btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
          btn.addEventListener('click', async e => {
            e.stopPropagation();
            if (OfflineManager.isDownloaded(track.file)) {
              // Already downloaded: show toast
              if (typeof showToast === 'function') showToast(`"${track.title}" ya está guardada`, 'default');
              return;
            }
            let lastPct = 0;
            await OfflineManager.downloadTrack(track, pct => {
              if (Math.abs(pct - lastPct) > 0.05) {
                lastPct = pct;
                btn.title = `Descargando ${Math.round(pct*100)}%`;
              }
            });
          });
          cover.appendChild(btn);
          // Apply current state
          const state = OfflineManager.isDownloaded(track.file) ? 'done' : 'none';
          if (state === 'done') {
            btn.classList.add('downloaded');
            btn.innerHTML = `<svg viewBox="0 0 24 24" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>`;
            btn.title = 'Guardado offline';
          }
        });
      });
      observer.observe(mediaGrid, { childList: true });
    }
  }

  /* ── Patch loadTrack — car mode sync only (offline handled inside loadTrack) ── */
  const origLoadTrack = typeof loadTrack === 'function' ? loadTrack : null;
  if (origLoadTrack) {
    window.loadTrack = function(item, fromQueue, newPlaylistContext) {
      origLoadTrack.call(this, item, fromQueue, newPlaylistContext);
      setTimeout(() => CarMode.syncToPlayer(), 200);
    };
  }

  /* ── Patch togglePlay, playNext, playPrev to update car mode ── */
  ['togglePlay', 'playNext', 'playPrev'].forEach(fn => {
    const orig = typeof window[fn] === 'function' ? window[fn] : null;
    if (!orig) return;
    window[fn] = function(...args) {
      const result = orig.apply(this, args);
      setTimeout(() => {
        CarMode.syncToPlayer();
        CloudSync.markDirty();
      }, 100);
      return result;
    };
  });

  /* ── Hook audio timeupdate for car mode progress ── */
  const audio = typeof audioEl !== 'undefined' ? audioEl : null;
  if (audio) {
    let _carRafPending = false;
    audio.addEventListener('timeupdate', () => {
      if (!CarMode.isActive() || _carRafPending) return;
      _carRafPending = true;
      requestAnimationFrame(() => { _carRafPending = false; CarMode.updateProgress(); });
    }, { passive: true });
    audio.addEventListener('play',   () => { CarMode.updatePlayState(); }, { passive: true });
    audio.addEventListener('pause',  () => { CarMode.updatePlayState(); }, { passive: true });
  }
}


/* ══════════════════════════════════════════════════════
   EVENT LISTENERS — Car mode, Transfer, Downloads
══════════════════════════════════════════════════════ */
function setupPremiumEvents() {

  /* ── Car mode ──────────────────────────────────── */
  document.getElementById('carModeTopbarBtn')?.addEventListener('click', () => CarMode.toggle());
  document.getElementById('carModeExitBtn')?.addEventListener('click', () => CarMode.deactivate());

  document.getElementById('carPlayBtn')?.addEventListener('click', () => {
    if (typeof togglePlay === 'function') togglePlay();
    if (typeof hapticFeedback === 'function') hapticFeedback('medium');
  });
  document.getElementById('carPrevBtn')?.addEventListener('click', () => {
    if (typeof playPrev === 'function') playPrev();
    if (typeof hapticFeedback === 'function') hapticFeedback('light');
  });
  document.getElementById('carNextBtn')?.addEventListener('click', () => {
    if (typeof playNext === 'function') playNext();
    if (typeof hapticFeedback === 'function') hapticFeedback('light');
  });

  /* Car suggest */
  document.getElementById('carSuggestActivate')?.addEventListener('click', () => {
    CarMode.activate();
  });
  document.getElementById('carSuggestDismiss')?.addEventListener('click', () => {
    CarMode.hideSuggest();
    CarMode.setSuggestDismissed();
  });

  /* Setup car mode gestures */
  const carPanel = document.getElementById('carModePanel');
  if (carPanel) CarMode.setup(carPanel);

  /* ── Transfer panel (removed) ─────────────────────── */

  /* ── Downloads / offline page ──────────────────── */
  document.getElementById('offlineClearAllBtn')?.addEventListener('click', async () => {
    if (!confirm('¿Eliminar todas las descargas?')) return;
    // Clear IDB — reopen page
    try {
      indexedDB.deleteDatabase('droply_offline_v1');
      location.reload();
    } catch(e) {
      if (typeof showToast === 'function') showToast('Error al liberar espacio', 'error');
    }
  });

  /* ── Nav tab for downloads ─────────────────────── */
  document.querySelectorAll('.bnav-btn[data-page="pageDownloads"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof showPage === 'function') showPage('pageDownloads');
      OfflineManager.renderDownloadsList();
      renderOfflinePlaylist();
      updateOfflineStatusBanner();
    });
  });

  /* ── Downloads badge target ────────────────────── */
  const badge = document.getElementById('bnavDownloadsBadge');
  if (badge) badge.id = 'bnavDownloads'; // fix the id for OfflineManager to find .nav-badge inside it
  // Reattach badge correctly
  const offlineNavBtn = document.querySelector('.bnav-btn[data-page="pageDownloads"]');
  if (offlineNavBtn) {
    const b = offlineNavBtn.querySelector('span:last-child');
    if (b) b.className = 'nav-badge';
  }
}


/* ══════════════════════════════════════════════════════
   OFFLINE PLAYLIST — Render downloaded tracks as playable list
══════════════════════════════════════════════════════ */
function renderOfflinePlaylist() {
  const container = document.getElementById('offlineTrackList');
  const countEl   = document.getElementById('offlinePlaylistCount');
  if (!container) return;

  // Get all tracks from the global media array that are downloaded
  const allTracks = typeof media !== 'undefined' ? media : [];
  const downloaded = allTracks.filter(t => OfflineManager.isDownloaded(t.file));

  if (countEl) countEl.textContent = downloaded.length === 1
    ? '1 canción'
    : `${downloaded.length} canciones`;

  // Show / hide play-all & shuffle buttons
  const playAllBtn    = document.getElementById('offlinePlayAllBtn');
  const shuffleBtn    = document.getElementById('offlineShuffleBtn');
  const hasTracks     = downloaded.length > 0;
  if (playAllBtn)  playAllBtn.style.display  = hasTracks ? '' : 'none';
  if (shuffleBtn)  shuffleBtn.style.display  = hasTracks ? '' : 'none';

  if (downloaded.length === 0) {
    container.innerHTML = `
      <div class="offline-empty-playlist">
        <strong>Sin canciones guardadas</strong>
        <p>Descarga canciones pulsando el botón
          <svg viewBox="0 0 24 24" width="13" height="13" style="display:inline;vertical-align:middle">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          en cualquier canción para escucharlas sin conexión.</p>
      </div>`;
    return;
  }

  // Get current playing track title to highlight it
  const currentTitleEl = document.getElementById('sheetTitle') || document.getElementById('miniTitle');
  const currentTitle   = currentTitleEl ? currentTitleEl.textContent.trim() : '';

  container.innerHTML = downloaded.map((track, i) => {
    const isPlaying = track.title === currentTitle && currentTitle !== '—';
    return `
      <div class="offline-track-row${isPlaying ? ' playing' : ''}"
           data-file="${track.file}" data-index="${i}" role="button" tabindex="0"
           aria-label="Reproducir ${track.title}">
        <span class="offline-track-num">${isPlaying
          ? `<svg viewBox="0 0 24 24" width="12" height="12" style="color:var(--accent)"><polygon points="5,3 19,12 5,21" fill="currentColor" stroke="none"/></svg>`
          : i + 1}</span>
        <div class="offline-track-thumb">
          <img src="${track.cover}" alt="" loading="lazy" />
          <div class="offline-now-playing-eq">
            <div class="offline-eq-bars">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
        <div class="offline-track-info">
          <div class="offline-track-title">${track.title}</div>
          <div class="offline-track-artist">${track.artist}</div>
        </div>
        <div class="offline-track-meta">
          <span class="offline-track-dur">${track.duration || ''}</span>
          <button class="offline-track-delete-btn" data-file="${track.file}" title="Eliminar descarga" aria-label="Eliminar descarga">
            <svg viewBox="0 0 24 24" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>`;
  }).join('');

  // Click on a track to play it (using offline src if possible)
  container.querySelectorAll('.offline-track-row').forEach((row, i) => {
    const play = async () => {
      const track = downloaded[i];
      if (!track) return;
      // Build an offline queue starting from this track
      const queue = [...downloaded.slice(i), ...downloaded.slice(0, i)];
      // Use existing loadTrack if available — it will pick offline src automatically
      if (typeof loadTrack === 'function') {
        // Set up queue
        if (typeof window.playQueue !== 'undefined') {
          window.playQueue = queue;
          window.playQueueIndex = 0;
        }
        loadTrack(track, false);
      }
      // Re-render to update highlight
      setTimeout(() => renderOfflinePlaylist(), 300);
    };
    row.addEventListener('click', e => {
      if (e.target.closest('.offline-track-delete-btn')) return;
      play();
    });
    row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });

    // Delete button
    const delBtn = row.querySelector('.offline-track-delete-btn');
    if (delBtn) {
      delBtn.addEventListener('click', async e => {
        e.stopPropagation();
        const file = delBtn.dataset.file;
        await OfflineManager.deleteDownload(file);
        // renderOfflinePlaylist is called inside deleteDownload already
      });
    }
  });

  // Play all button
  if (playAllBtn) {
    playAllBtn.onclick = () => {
      if (downloaded.length === 0) return;
      if (typeof loadTrack === 'function') {
        if (typeof window.playQueue !== 'undefined') {
          window.playQueue = [...downloaded];
          window.playQueueIndex = 0;
        }
        loadTrack(downloaded[0], false);
      }
      setTimeout(() => renderOfflinePlaylist(), 300);
    };
  }

  // Shuffle button
  if (shuffleBtn) {
    shuffleBtn.onclick = () => {
      if (downloaded.length === 0) return;
      const shuffled = [...downloaded].sort(() => Math.random() - 0.5);
      if (typeof loadTrack === 'function') {
        if (typeof window.playQueue !== 'undefined') {
          window.playQueue = shuffled;
          window.playQueueIndex = 0;
        }
        loadTrack(shuffled[0], false);
        // Enable shuffle mode if possible
        if (typeof window.shuffleOn !== 'undefined') window.shuffleOn = true;
      }
      setTimeout(() => renderOfflinePlaylist(), 300);
    };
  }
}

function updateOfflineStatusBanner() {
  const banner = document.getElementById('offlineStatusBanner');
  const text   = document.getElementById('offlineStatusText');
  if (!banner || !text) return;
  if (navigator.onLine) {
    banner.classList.add('is-online');
    text.textContent = 'Conectado — escucha también sin internet';
  } else {
    banner.classList.remove('is-online');
    text.textContent = 'Sin conexión — reproduciendo desde caché local';
  }
}

// Auto-refresh offline playlist when downloads page is shown
(function watchOfflinePage() {
  // Also re-render when connectivity changes
  window.addEventListener('online',  () => { updateOfflineStatusBanner(); renderOfflinePlaylist(); });
  window.addEventListener('offline', () => { updateOfflineStatusBanner(); renderOfflinePlaylist(); });
})();


/* ══════════════════════════════════════════════════════
   EVENTOS MANAGER — Sistema dinámico de eventos en vivo
   Gestiona todo desde el array `events` en script.js
══════════════════════════════════════════════════════ */
const EventosManager = (() => {

  /* ── State ─────────────────────────────── */
  let evFilter      = "all";
  let evSearch      = "";
  let evSavedEvents = new Set(JSON.parse(localStorage.getItem("droply_saved_events") || "[]"));
  let countdownTimers = [];
  let rendered      = false;

  /* ── Save state ────────────────────────── */
  function saveSaved() {
    try { localStorage.setItem("droply_saved_events", JSON.stringify([...evSavedEvents])); } catch(_) {}
  }
  function isSaved(ev) { return evSavedEvents.has(ev.title + ev.date); }
  function toggleSaved(ev) {
    const key = ev.title + ev.date;
    if (evSavedEvents.has(key)) { evSavedEvents.delete(key); showToast("Evento eliminado de guardados", "default"); }
    else                        { evSavedEvents.add(key);    showToast("Evento guardado ✓", "success"); }
    saveSaved();
    // Update bookmark icons in DOM without full re-render
    document.querySelectorAll(`[data-evkey="${CSS.escape(key)}"] .ev-card-save`).forEach(btn => {
      btn.classList.toggle("saved", evSavedEvents.has(key));
      btn.setAttribute("aria-label", evSavedEvents.has(key) ? "Quitar guardado" : "Guardar evento");
    });
  }

  /* ── Helpers ───────────────────────────── */
  function sortedEvents() {
    return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  function filteredEvents() {
    const q = evSearch.toLowerCase().trim();
    return sortedEvents().filter(ev => {
      const matchFilter =
        evFilter === "all"          ? true :
        evFilter.startsWith("c:")   ? ev.city.toLowerCase()  === evFilter.slice(2) :
        evFilter.startsWith("g:")   ? ev.genre.toLowerCase() === evFilter.slice(2) :
        evFilter === "featured"     ? ev.featured :
        evFilter === "saved"        ? isSaved(ev) : true;
      const matchSearch = q === "" || [ev.title, ev.artist, ev.city, ev.venue, ev.genre].some(s => s.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });
  }

  function isPast(ev) {
    return new Date(ev.date + "T" + ev.time) < new Date();
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const days   = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function formatCountdown(dateStr, timeStr) {
    const target = new Date(dateStr + "T" + timeStr);
    const now    = new Date();
    const diff   = target - now;
    if (diff <= 0) return { text: "Hoy", urgent: true };
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    if (days > 0)  return { text: `${days}d ${hours}h`, urgent: days < 7 };
    if (hours > 0) return { text: `${hours}h ${mins}m`, urgent: true };
    return { text: `${mins}m`, urgent: true };
  }

  function getCities()  { return [...new Set(events.map(e => e.city))].sort(); }
  function getGenres()  { return [...new Set(events.map(e => e.genre))].sort(); }

  /* ── Start countdown intervals ─────────── */
  function startCountdowns() {
    countdownTimers.forEach(clearInterval);
    countdownTimers = [];
    document.querySelectorAll(".ev-countdown[data-date]").forEach(el => {
      const dateStr = el.dataset.date;
      const timeStr = el.dataset.time || "00:00";
      const update = () => {
        const cd = formatCountdown(dateStr, timeStr);
        el.textContent = cd.text;
        el.classList.toggle("urgent", cd.urgent);
      };
      update();
      countdownTimers.push(setInterval(update, 30000));
    });
  }

  /* ── Build filter pills ────────────────── */
  function buildFilters() {
    const bar = document.getElementById("evDynamicPills");
    if (!bar) return;
    const pills = [];

    // Featured pill
    if (events.some(e => e.featured)) {
      pills.push({ label: "⚡ Destacados", val: "featured" });
    }
    // Saved pill
    pills.push({ label: "🔖 Guardados", val: "saved" });
    // Separator cities
    getCities().forEach(c  => pills.push({ label: `📍 ${c}`,  val: `c:${c.toLowerCase()}`  }));
    // Separator genres
    getGenres().forEach(g  => pills.push({ label: g,          val: `g:${g.toLowerCase()}`   }));

    bar.innerHTML = pills.map(p =>
      `<button class="ev-filter-pill${evFilter === p.val ? " active" : ""}" data-evfilter="${p.val}">${p.label}</button>`
    ).join("");

    document.querySelectorAll(".ev-filter-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        evFilter = btn.dataset.evfilter;
        document.querySelectorAll(".ev-filter-pill").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
        renderContent();
      });
    });
  }

  /* ── Card HTML ─────────────────────────── */
  function cardHTML(ev, size = "normal") {
    const past    = isPast(ev);
    const saved   = isSaved(ev);
    const cd      = formatCountdown(ev.date, ev.time);
    const dateStr = formatDate(ev.date);
    const key     = ev.title + ev.date;
    const imgSrc  = ev.image || ev.banner || "";

    if (size === "featured") {
      return `
        <div class="ev-featured-card ${past ? "ev-past" : ""}" data-evkey="${key}">
          <div class="ev-fc-banner">
            <img class="ev-fc-img" src="${imgSrc}" alt="${ev.artist}" loading="lazy" />
            <div class="ev-fc-overlay"></div>
            ${ev.featured ? '<span class="ev-featured-badge">DESTACADO</span>' : ""}
            ${past ? '<span class="ev-past-badge">FINALIZADO</span>' : ""}
            <div class="ev-fc-bottom">
              <div class="ev-fc-countdown-wrap">
                <span class="ev-countdown-label">Faltan</span>
                <span class="ev-countdown ${cd.urgent ? "urgent" : ""}" data-date="${ev.date}" data-time="${ev.time}">${cd.text}</span>
              </div>
            </div>
          </div>
          <div class="ev-fc-info">
            <div class="ev-fc-meta-row">
              <span class="ev-genre-pill">${ev.genre}</span>
              <span class="ev-city-tag">📍 ${ev.city}</span>
            </div>
            <h3 class="ev-fc-title">${ev.title}</h3>
            <p class="ev-fc-artist">${ev.artist}</p>
            <div class="ev-fc-details">
              <div class="ev-detail-item">
                <svg viewBox="0 0 24 24" width="13" height="13"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ${dateStr}
              </div>
              <div class="ev-detail-item">
                <svg viewBox="0 0 24 24" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${ev.time}
              </div>
              <div class="ev-detail-item">
                <svg viewBox="0 0 24 24" width="13" height="13"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${ev.venue}
              </div>
            </div>
            <p class="ev-fc-desc">${ev.description}</p>
            <div class="ev-fc-actions">
              <a class="ev-btn-buy ${past ? "ev-btn-disabled" : ""}" href="${ev.tickets}" target="_blank" rel="noopener" ${past ? 'aria-disabled="true"' : ""}>
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M2 9a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2a2 2 0 0 0 0 4v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a2 2 0 0 0 0-4V9z"/></svg>
                ${past ? "Finalizado" : `Comprar — ${ev.price}`}
              </a>
              <button class="ev-card-btn ev-card-share" data-title="${ev.title}" data-artist="${ev.artist}" data-city="${ev.city}" data-date="${dateStr}" aria-label="Compartir">
                <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
              <button class="ev-card-btn ev-card-save ${saved ? "saved" : ""}" data-evkey="${key}" data-evindex="${events.indexOf(ev)}" aria-label="${saved ? "Quitar guardado" : "Guardar evento"}">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
          </div>
        </div>`;
    }

    // Normal card (compact scroll card)
    return `
      <div class="ev-card ${past ? "ev-past" : ""}" data-evkey="${key}">
        <div class="ev-card-img-wrap">
          <img class="ev-card-img" src="${imgSrc}" alt="${ev.artist}" loading="lazy" />
          <div class="ev-card-img-overlay"></div>
          ${ev.featured ? '<span class="ev-featured-badge ev-featured-sm">★</span>' : ""}
          <span class="ev-card-genre">${ev.genre}</span>
          <div class="ev-card-countdown-badge">
            <span class="ev-countdown ${cd.urgent ? "urgent" : ""}" data-date="${ev.date}" data-time="${ev.time}">${cd.text}</span>
          </div>
        </div>
        <div class="ev-card-body">
          <p class="ev-card-artist">${ev.artist}</p>
          <h3 class="ev-card-title">${ev.title}</h3>
          <div class="ev-card-meta">
            <span class="ev-card-date">${dateStr}</span>
            <span class="ev-card-dot">·</span>
            <span class="ev-card-city">📍 ${ev.city}</span>
          </div>
          <div class="ev-card-venue">${ev.venue} · ${ev.time}</div>
          <div class="ev-card-footer">
            <span class="ev-card-price">${ev.price}</span>
            <div class="ev-card-actions">
              <button class="ev-card-btn ev-card-share" data-title="${ev.title}" data-artist="${ev.artist}" data-city="${ev.city}" data-date="${dateStr}" aria-label="Compartir">
                <svg viewBox="0 0 24 24" width="14" height="14"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
              <button class="ev-card-btn ev-card-save ${saved ? "saved" : ""}" data-evkey="${key}" data-evindex="${events.indexOf(ev)}" aria-label="${saved ? "Quitar guardado" : "Guardar evento"}">
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
              <a class="ev-card-buy ${past ? "ev-btn-disabled" : ""}" href="${ev.tickets}" target="_blank" rel="noopener" ${past ? 'aria-disabled="true"' : ""}>
                ${past ? "Agotado" : "Entradas"}
              </a>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ── Attach card events ─────────────────── */
  function attachCardEvents(container) {
    container.querySelectorAll(".ev-card-save").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(btn.dataset.evindex);
        if (!isNaN(idx) && events[idx]) toggleSaved(events[idx]);
      });
    });
    container.querySelectorAll(".ev-card-share").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        const text = `🎤 ${btn.dataset.title} — ${btn.dataset.artist}\n📍 ${btn.dataset.city} · ${btn.dataset.date}`;
        if (navigator.share) {
          navigator.share({ title: btn.dataset.title, text }).catch(() => {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => showToast("Evento copiado al portapapeles", "success"));
        } else {
          showToast("Compartir no disponible en este dispositivo", "default");
        }
      });
    });
    // Click en tarjeta para abrir modal
    container.querySelectorAll(".ev-card, .ev-featured-card").forEach(card => {
      card.addEventListener("click", e => {
        if (e.target.closest(".ev-card-btn") || e.target.closest(".ev-card-buy") || e.target.closest(".ev-fc-actions")) return;
        const evKey = card.dataset.evkey;
        const ev = sortedEvents().find(e => (e.title + e.date) === evKey);
        if (ev) showEventoModal(ev);
      });
    });
  }

  /* ── Show Evento Modal ──────────────────– */
  function showEventoModal(ev) {
    const modal = document.getElementById("eventoDetailModal");
    if (!modal) return;
    
    // Elementos del modal
    const els = {
      img:    document.getElementById("eventoDetailImg"),
      title:  document.getElementById("eventoDetailTitle"),
      artist: document.getElementById("eventoDetailArtist"),
      genre:  document.getElementById("eventoDetailGenre"),
      city:   document.getElementById("eventoDetailCity"),
      desc:   document.getElementById("eventoDetailDesc"),
      date:   document.getElementById("eventoDetailDate"),
      time:   document.getElementById("eventoDetailTime"),
      venue:  document.getElementById("eventoDetailVenue"),
      price:  document.getElementById("eventoDetailPrice"),
      buy:    document.getElementById("eventoDetailBuyLink"),
      share:  document.getElementById("eventoDetailShare")
    };
    
    // Validar elementos críticos
    if (!els.title) return;
    
    // Rellenar datos
    if (els.img) {
      els.img.src = ev.image || ev.banner || "";
      els.img.alt = ev.artist;
    }
    els.title.textContent = ev.title;
    if (els.artist) els.artist.textContent = ev.artist;
    if (els.genre) els.genre.textContent = ev.genre;
    if (els.city) els.city.textContent = "📍 " + ev.city;
    if (els.desc) els.desc.textContent = ev.description;
    if (els.date) els.date.textContent = formatDate(ev.date);
    if (els.time) els.time.textContent = ev.time;
    if (els.venue) els.venue.textContent = ev.venue;
    if (els.price) els.price.textContent = ev.price;
    if (els.buy) els.buy.href = ev.tickets;
    
    // Evento para compartir
    if (els.share) {
      els.share.onclick = (e) => {
        e.preventDefault();
        const text = `🎤 ${ev.title} — ${ev.artist}\n📍 ${ev.city} · ${formatDate(ev.date)}\n⏰ ${ev.time}`;
        if (navigator.share) {
          navigator.share({ title: ev.title, text }).catch(() => {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => showToast("Evento copiado al portapapeles", "success"));
        }
      };
    }
    
    // Abrir modal
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  /* ── Close Evento Modal ────────────────– */
  function closeEventoModal() {
    const modal = document.getElementById("eventoDetailModal");
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  /* ── Init Evento Modal ─────────────────– */
  function initEventoModal() {
    const modal = document.getElementById("eventoDetailModal");
    const closeBtn = document.getElementById("eventoDetailClose");
    
    if (!modal || !closeBtn) return;
    
    // Cerrar con botón X
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeEventoModal();
    });
    
    // Cerrar al hacer click en el fondo del modal
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeEventoModal();
      }
    });
    
    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        closeEventoModal();
      }
    });
  }

  /* ── Main render ────────────────────────── */
  function renderContent() {
    const skeleton        = document.getElementById("evSkeleton");
    const featSection     = document.getElementById("evFeaturedSection");
    const featList        = document.getElementById("evFeaturedList");
    const nearSection     = document.getElementById("evNearSection");
    const nearList        = document.getElementById("evNearList");
    const nearCity        = document.getElementById("evNearCity");
    const soonSection     = document.getElementById("evSoonSection");
    const soonList        = document.getElementById("evSoonList");
    const allSection      = document.getElementById("evAllSection");
    const allList         = document.getElementById("evAllList");
    const allTitle        = document.getElementById("evAllTitle");
    const countBadgeEl    = document.getElementById("evCountBadge");
    const emptyState      = document.getElementById("evEmpty");

    if (!featSection) return;

    // Hide skeleton
    if (skeleton) skeleton.style.display = "none";

    const filtered  = filteredEvents();
    const isDefault = (evFilter === "all" && evSearch === "");

    // Reset all sections
    [featSection, nearSection, soonSection, allSection, emptyState].forEach(el => el.style.display = "none");

    if (filtered.length === 0) {
      emptyState.style.display = "";
      return;
    }

    if (isDefault) {
      // DEFAULT VIEW: 3 sections
      const featured = sortedEvents().filter(e => e.featured && !isPast(e));
      if (featured.length > 0) {
        featList.innerHTML = featured.map(e => cardHTML(e, "featured")).join("");
        attachCardEvents(featList);
        featSection.style.display = "";
      }

      // Near: use Barcelona as default city (España)
      const nearCityName = "Barcelona";
      const nearEvs = sortedEvents().filter(e => e.city === nearCityName && !isPast(e)).slice(0, 6);
      if (nearEvs.length > 0) {
        if (nearCity) nearCity.textContent = nearCityName;
        nearList.innerHTML = nearEvs.map(e => cardHTML(e, "normal")).join("");
        attachCardEvents(nearList);
        nearSection.style.display = "";
      }

      // Soon: next 4 non-featured upcoming
      const soon = sortedEvents().filter(e => !isPast(e) && !e.featured).slice(0, 4);
      if (soon.length > 0) {
        soonList.innerHTML = soon.map(e => cardHTML(e, "normal")).join("");
        attachCardEvents(soonList);
        soonSection.style.display = "";
      }

    } else {
      // FILTERED VIEW: show all
      const label = evFilter === "saved" ? "Guardados" : evFilter === "featured" ? "Destacados" : "Resultados";
      if (allTitle) allTitle.textContent = label;
      if (countBadgeEl) countBadgeEl.textContent = `${filtered.length} evento${filtered.length !== 1 ? "s" : ""}`;
      allList.innerHTML = filtered.map(e => cardHTML(e, "normal")).join("");
      attachCardEvents(allList);
      allSection.style.display = "";
    }

    // Restart countdown timers
    requestAnimationFrame(() => startCountdowns());
  }

  /* ── Public render (with skeleton on first load) ── */
  function render() {
    if (!rendered) {
      rendered = true;
      const skeleton = document.getElementById("evSkeleton");
      if (skeleton) skeleton.style.display = "";
      buildFilters();
      setTimeout(renderContent, 380);
    } else {
      renderContent();
    }
  }

  /* ── Search logic ─────────────────────── */
  function initSearch() {
    const input = document.getElementById("evSearchInput");
    const clear = document.getElementById("evSearchClear");
    if (!input) return;
    input.addEventListener("input", () => {
      evSearch = input.value;
      clear.style.display = evSearch ? "" : "none";
      if (evSearch) { evFilter = "all"; document.querySelectorAll(".ev-filter-pill").forEach(x => x.classList.remove("active")); document.querySelector(".ev-filter-pill[data-evfilter='all']")?.classList.add("active"); }
      renderContent();
    });
    clear.addEventListener("click", () => { input.value = ""; evSearch = ""; clear.style.display = "none"; renderContent(); input.focus(); });
  }

  /* ── Init ─────────────────────────────── */
  function init() {
    initSearch();
    initEventoModal();
  }

  return { render, init };
})();


function bootPremium() {
  injectPremiumDOM();
  patchExistingFunctions();
  setupPremiumEvents();

  // Init modules
  OfflineManager.init();
  OfflineManager.setupOfflineDetection();
  CloudSync.init();

  // Render offline playlist (after IDB is ready, slight delay)
  setTimeout(() => { renderOfflinePlaylist(); updateOfflineStatusBanner(); }, 400);

  // Ensure bottom nav slider recalculates after premium DOM (offline tab) is injected
  setTimeout(() => { try { if (typeof updateBottomNavSlider === 'function') updateBottomNavSlider(); } catch(_){} }, 500);

  // Register SW
  registerServiceWorker();

  console.info('[DROPLY Premium] ✓ Módulos cargados: Offline · Modo Coche · Cloud Sync');
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootPremium);
} else {
  // Small delay to ensure script.js has finished its init()
  setTimeout(bootPremium, 0);
}

/* ═══════════════════════════════════════════════════════════
   DROPLY — MIXES
   Colecciones curadas fijas. Para añadir canciones a un mix,
   edita el array `tracks` de cada mix con objetos del array `media`.
   
   ┌─────────────────────────────────────────────────────────┐
   │  Cómo añadir canciones a un mix:                        │
   │  Copia el objeto del track desde media[] y pégalo       │
   │  en el array tracks[] del mix correspondiente.          │
   └─────────────────────────────────────────────────────────┘
═══════════════════════════════════════════════════════════ */
















const MIXES = [
  {
    id: "reggaeton",
    name: "Album Los Diozes",
    cover: "https://images.genius.com/cf49bfced9c8501f41d1ebf2127e8c9b.1000x1000x1.png",
    tracks: [
    


             {
    type:     "music",
    title:    "KIÉN E?",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/quiene.mp3",
    category: "No se",
    duration: "3:41"
  },
              {
    type:     "music",
    title:    "PAYAS",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/payas.mp3",
    category: "No se",
    duration: "4:35"
  },
              {
    type:     "music",
    title:    "MARDOSA",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/mardosa.mp3",
    category: "No se",
    duration: "2:09"
  },
              {
    type:     "music",
    title:    "KIKE Y WANILLO",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/kikeywanillo.mp3",
    category: "No se",
    duration: "2:25"
  },
              {
    type:     "music",
    title:    "FELA",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/fela.mp3",
    category: "No se",
    duration: "2:18"
  },
              {
    type:     "music",
    title:    "POR ALGO SERÁ",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/poralgosera.mp3",
    category: "No se",
    duration: "2:39"
  },
              {
    type:     "music",
    title:    "MALDITA FARLOPA",
    artist:   "LOS DIOZES",
    cover:    "https://i.scdn.co/image/ab67616d00001e029583673af04af6d27def8a9c",
    file:     "./Music/malafarlopa.mp3",
    category: "No se",
    duration: "2:58"
  },
    ]
  },




























  {
    id: "reggaeton",
    name: "Album DtMF ",
    cover: "https://upload.wikimedia.org/wikipedia/en/e/ef/Bad_Bunny_-_Deb%C3%AD_Tirar_M%C3%A1s_Fotos.png",
    tracks: [
             {
    type:     "music",
    title:    "NUEVAYoL",
    artist:   "Bad Bunny",
    cover:    "https://upload.wikimedia.org/wikipedia/en/e/ef/Bad_Bunny_-_Deb%C3%AD_Tirar_M%C3%A1s_Fotos.png",
    file:     "./Music/nuevayol.mp3",
    category: "Reggaeton",
    duration: "3:43"
  },
             {
    type:     "music",
    title:    "VOY A LLeVARTE PA PR",
    artist:   "Bad Bunny",
    cover:    "https://upload.wikimedia.org/wikipedia/en/e/ef/Bad_Bunny_-_Deb%C3%AD_Tirar_M%C3%A1s_Fotos.png",
    file:     "./Music/voyallvartepapr.mp3",
    category: "Reggaeton",
    duration: "2:36"
  },
             {
    type:     "music",
    title:    "EoO",
    artist:   "Bad Bunny",
    cover:    "https://upload.wikimedia.org/wikipedia/en/e/ef/Bad_Bunny_-_Deb%C3%AD_Tirar_M%C3%A1s_Fotos.png",
    file:     "./Music/eoo.mp3",
    category: "Reggaeton",
    duration: "3:25"
  },
             {
    type:     "music",
    title:    "VeLDÁ",
    artist:   "Bad Bunny, Omar Courtz, Dei V",
    cover:    "https://upload.wikimedia.org/wikipedia/en/e/ef/Bad_Bunny_-_Deb%C3%AD_Tirar_M%C3%A1s_Fotos.png",
    file:     "./Music/velda.mp3",
    category: "Reggaeton",
    duration: "3:55"
  },
             {
    type:     "music",
    title:    "CAFé CON RON",
    artist:   "Bad Bunny, Omar Courtz, Dei V",
    cover:    "https://upload.wikimedia.org/wikipedia/en/e/ef/Bad_Bunny_-_Deb%C3%AD_Tirar_M%C3%A1s_Fotos.png",
    file:     "./Music/cafecron.mp3",
    category: "Reggaeton",
    duration: "3:48"
  },
    ]
  },























];

































/* ═══════════════════════════════════════════════════════════
   MixesManager — lógica interna (no tocar)
═══════════════════════════════════════════════════════════ */
const MixesManager = (function() {

  /* Placeholder SVG con gradiente si no hay portada */
  function _placeholder(name) {
    const palettes = [
      ["#8b5cf6","#6366f1"],["#ec4899","#8b5cf6"],["#3b82f6","#8b5cf6"],
      ["#f59e0b","#ef4444"],["#10b981","#3b82f6"],["#7c3aed","#ec4899"],
      ["#06b6d4","#6366f1"],
    ];
    const i = name.split("").reduce((a,c)=>a+c.charCodeAt(0),0) % palettes.length;
    const [c1,c2] = palettes[i];
    const initials = name.replace(/Mix$/i,"").trim().slice(0,2).toUpperCase();
    return `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
        </linearGradient></defs>
        <rect width="200" height="200" fill="url(#g)" rx="0"/>
        <text x="100" y="118" font-family="system-ui,sans-serif" font-size="62"
          font-weight="700" fill="rgba(255,255,255,.92)" text-anchor="middle">${initials}</text>
      </svg>`
    )}`;
  }

  /* Calcular duración total legible */
  function _duration(tracks) {
    let s = 0;
    tracks.forEach(t => {
      if (!t.duration) return;
      const p = String(t.duration).split(":").map(Number);
      s += p.length===2 ? p[0]*60+p[1] : p[0];
    });
    const m = Math.floor(s/60);
    return m < 60 ? `${m} min` : `${Math.floor(m/60)}h ${m%60}min`;
  }

  /* Sólo mostrar mixes que tengan al menos 1 track */
  function _visible() {
    return MIXES.filter(m => m.tracks && m.tracks.length > 0);
  }

  /* ── Tarjeta para el grid de pageMixes ── */
  function _makeCard(mix) {
    const fb  = _placeholder(mix.name);
    const src = mix.cover || fb;
    const dur = _duration(mix.tracks);

    const card = document.createElement("div");
    card.className = "mix-card";

    card.innerHTML = `
      <div class="mix-card-cover">
        <img src="${src}" alt="${mix.name}" onerror="this.src='${fb}'" loading="lazy"/>
        <div class="mix-card-overlay"></div>
        <span class="mix-card-badge">MIX</span>
        <button class="mix-card-play" aria-label="Reproducir">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </button>
      </div>
      <div class="mix-card-name">${mix.name}</div>
      <div class="mix-card-meta">${mix.tracks.length} canciones · ${dur}</div>
    `;

    card.querySelector(".mix-card-play").addEventListener("click", e => {
      e.stopPropagation();
      _play(mix, false);
    });
    card.addEventListener("click", () => openMixDetail(mix));
    return card;
  }

  /* ── Tarjeta compacta para el home ── */
  function _makeHomeCard(mix) {
    const fb  = _placeholder(mix.name);
    const src = mix.cover || fb;

    const card = document.createElement("div");
    card.className = "home-pl-card mix-home-card";

    card.innerHTML = `
      <div class="home-pl-cover-wrap" style="position:relative">
        <img class="home-pl-cover" src="${src}" alt="${mix.name}" onerror="this.src='${fb}'" loading="lazy"/>
        <span class="mix-home-badge">MIX</span>
      </div>
      <div class="home-pl-name">${mix.name}</div>
      <div class="home-pl-count">${mix.tracks.length} canciones</div>
    `;
    card.addEventListener("click", () => openMixDetail(mix));
    return card;
  }

  /* ── Reproducir mix (con shuffle opcional) ── */
  function _play(mix, shuffle) {
    if (!mix.tracks.length) return;
    let list = [...mix.tracks];
    if (shuffle) list = list.sort(()=>Math.random()-.5);
    if (typeof loadTrack === "function") loadTrack(list[0], false, list);
  }

  /* ── Abrir detalle ── */
  function openMixDetail(mix) {
    const modal = document.getElementById("mixDetailModal");
    if (!modal) return;

    const fb  = _placeholder(mix.name);
    const src = mix.cover || fb;
    const dur = _duration(mix.tracks);

    // Blurred BG
    const bg = document.getElementById("mixDetailBg");
    if (bg) bg.style.backgroundImage = `url('${src}')`;

    // Top title
    document.getElementById("mixDetailTopTitle").textContent = mix.name;

    // Cover
    const coverEl = document.getElementById("mixDetailCover");
    coverEl.innerHTML = "";
    const img = document.createElement("img");
    img.src = src;
    img.alt = mix.name;
    img.onerror = () => { img.src = fb; };
    img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;";
    coverEl.appendChild(img);

    // Meta
    document.getElementById("mixDetailName").textContent  = mix.name;
    document.getElementById("mixDetailDesc").textContent  = mix.desc || "";
    document.getElementById("mixDetailCount").textContent =
      `${mix.tracks.length} canciones · ${dur}`;

    // Track list
    const list = document.getElementById("mixDetailList");
    list.innerHTML = "";
    mix.tracks.forEach((track, idx) => {
      const row = document.createElement("div");
      row.className = "playlist-detail-item";

      const coverFb = track.cover || "";
      row.innerHTML = `
        <span class="playlist-detail-num">${idx+1}</span>
        <img class="playlist-detail-thumb" src="${coverFb}" alt="${track.title}" loading="lazy"
             onerror="this.style.opacity='.3'"/>
        <div class="playlist-detail-info">
          <div class="playlist-detail-track">${track.title}</div>
          <div class="playlist-detail-artist">${track.artist||""}</div>
        </div>
        <span class="playlist-detail-dur">${track.duration||""}</span>
      `;

      row.addEventListener("click", () => {
        if (typeof loadTrack === "function") loadTrack(track, false, mix.tracks);
      });
      row.addEventListener("contextmenu", e => {
        e.preventDefault();
        if (typeof openContextMenu === "function") openContextMenu(track);
      });
      list.appendChild(row);
    });

    // Buttons
    document.getElementById("btnPlayMix").onclick    = () => _play(mix, false);
    document.getElementById("btnShuffleMix").onclick = () => _play(mix, true);

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  /* ── Cerrar detalle ── */
  function closeMixDetail() {
    const modal = document.getElementById("mixDetailModal");
    if (modal) modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ── Render grid pageMixes ── */
  function renderGrid() {
    const grid = document.getElementById("mixesGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const visible = _visible();
    if (!visible.length) {
      grid.innerHTML = `
        <div class="mixes-empty">
          <svg viewBox="0 0 24 24" width="40" height="40"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          <p>Todavía no hay canciones en ningún mix.</p>
          <span>Añade tracks a los mixes en el archivo <code>script.js</code></span>
        </div>`;
      return;
    }
    visible.forEach(mix => grid.appendChild(_makeCard(mix)));
  }

  /* ── Render home row ── */
  function renderHome() {
    const row = document.getElementById("homeMixesRow");
    if (!row) return;
    row.innerHTML = "";
    const visible = _visible();
    const section = document.getElementById("homeMixesSection");
    if (!visible.length) {
      if (section) section.style.display = "none";
      return;
    }
    if (section) section.style.display = "";
    visible.forEach(mix => row.appendChild(_makeHomeCard(mix)));
  }

  /* ── Init ── */
  function init() {
    const closeBtn = document.getElementById("mixDetailClose");
    if (closeBtn) closeBtn.addEventListener("click", closeMixDetail);
    renderHome();
  }

  return { init, renderGrid, renderHome, openMixDetail };
})();

/* Boot */
(function(){
  function _boot(){ MixesManager.init(); }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",_boot);
  else setTimeout(_boot, 60);

/* ══════════════════════════════════════════════════════
   GLASS SLIDER INIT
══════════════════════════════════════════════════════ */
(function initGlassSlider() {
  const slider = document.getElementById("bnavGlassSlider");
  const nav = document.getElementById("bottomNav");
  if (!slider || !nav) return;
  const NAV_DEBUG = true; // set to false to disable debug logs
  
  // Posicionar en el primer botón activo
  const activeBtn = nav.querySelector(".bnav-btn.active");
  if (activeBtn) {
    const btnWidth = activeBtn.offsetWidth;
    const btnLeft = activeBtn.offsetLeft;
    slider.style.width = `${Math.max(btnWidth, 56)}px`;
    slider.style.left = `0px`;
    slider.style.transform = `translateX(${btnLeft}px)`;
  }

  let bnavDragActive = false;
  let bnavDragOffset = 0;

  const getNearestNavButton = (clientX) => {
    const buttons = Array.from(nav.querySelectorAll(".bnav-btn"));
    const navRect = nav.getBoundingClientRect();
    let nearest = buttons[0] || null;
    let closest = Infinity;
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(clientX - center);
      if (dist < closest) {
        closest = dist;
        nearest = btn;
      }
    });
    return nearest;
  };

  const clampSliderLeft = (left) => {
    const maxLeft = nav.clientWidth - slider.offsetWidth;
    return Math.min(Math.max(left, 0), Math.max(maxLeft, 0));
  };

  const onPointerMove = (event) => {
    if (!bnavDragActive) return;
    event.preventDefault();
    const clientX = event.clientX;
    const navRect = nav.getBoundingClientRect();
    const left = clampSliderLeft(clientX - navRect.left - bnavDragOffset);
    if (NAV_DEBUG) console.log('bnav: move', { clientX, left, dragOffset: bnavDragOffset });
    slider.style.transform = `translateX(${left}px)`;
  };

  // Touch fallback for older browsers / Safari that prefer touch events
  const onTouchMove = (e) => {
    if (!bnavDragActive) return;
    if (!e.touches || !e.touches[0]) return;
    e.preventDefault();
    const clientX = e.touches[0].clientX;
    const navRect = nav.getBoundingClientRect();
    const left = clampSliderLeft(clientX - navRect.left - bnavDragOffset);
    if (NAV_DEBUG) console.log('bnav: touchmove', { clientX, left, dragOffset: bnavDragOffset });
    slider.style.transform = `translateX(${left}px)`;
  };

  const endDrag = (event) => {
    if (!bnavDragActive) return;
    bnavDragActive = false;
    document.body.style.userSelect = "";
    // Normalize clientX for pointer and touch events
    let clientX = event && event.clientX;
    if (!clientX && event && event.changedTouches && event.changedTouches[0]) {
      clientX = event.changedTouches[0].clientX;
    }
    // Fallback to slider center if we couldn't get a coordinate
    if (!clientX) {
      const sRect = slider.getBoundingClientRect();
      clientX = sRect.left + sRect.width / 2;
    }
    const nearest = getNearestNavButton(clientX);
    // Re-enable transition so the slider animates to the final button
    slider.style.transition = '';
    if (NAV_DEBUG) console.log('bnav: end', { clientX, nearest: nearest ? nearest.dataset.page : null });
    if (nearest) {
      showPage(nearest.dataset.page);
    } else {
      // Snap back to active
      updateBottomNavSlider();
    }
  };

  nav.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const activeBtn = nav.querySelector(".bnav-btn.active");
    if (!activeBtn) return;
    const activeRect = activeBtn.getBoundingClientRect();
    const sliderRect = slider.getBoundingClientRect();
    const targetX = event.clientX;
    const isOnActive = targetX >= activeRect.left && targetX <= activeRect.right;
    const isOnSlider = targetX >= sliderRect.left && targetX <= sliderRect.right;
    if (!isOnActive && !isOnSlider) return;

    bnavDragActive = true;
    bnavDragOffset = event.clientX - sliderRect.left;
    document.body.style.userSelect = "none";
    // disable transition for smooth direct-follow dragging
    slider.style.transition = 'none';
    if (NAV_DEBUG) console.log('bnav: down', { clientX: event.clientX, sliderLeft: sliderRect.left, dragOffset: bnavDragOffset });
    slider.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  // Touch start handler
  nav.addEventListener('touchstart', (e) => {
    if (!e.touches || !e.touches[0]) return;
    const touchX = e.touches[0].clientX;
    const activeBtn = nav.querySelector(".bnav-btn.active");
    if (!activeBtn) return;
    const activeRect = activeBtn.getBoundingClientRect();
    const sliderRect = slider.getBoundingClientRect();
    const isOnActive = touchX >= activeRect.left && touchX <= activeRect.right;
    const isOnSlider = touchX >= sliderRect.left && touchX <= sliderRect.right;
    if (!isOnActive && !isOnSlider) return;

    bnavDragActive = true;
    bnavDragOffset = touchX - sliderRect.left;
    document.body.style.userSelect = "none";
    slider.style.transition = 'none';
    if (NAV_DEBUG) console.log('bnav: touchstart', { clientX: touchX, sliderLeft: sliderRect.left, dragOffset: bnavDragOffset });
  }, { passive: false });

  document.addEventListener("pointermove", onPointerMove, { passive: false });
  document.addEventListener("pointerup", endDrag);
  document.addEventListener("pointercancel", endDrag);
  // Touch fallback listeners
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', endDrag, { passive: false });
})();
})();
