const socket = io();

const loginScreen = document.getElementById('loginScreen');
const gameScreen = document.getElementById('gameScreen');
const resultScreen = document.getElementById('resultScreen');
const playerNameInput = document.getElementById('playerName');
const playerClassInput = document.getElementById('playerClass');
const startBtn = document.getElementById('startBtn');
const adminBtn = document.getElementById('adminBtn');
const castBtn = document.getElementById('castBtn');
const fishTarget = document.getElementById('fishTarget');
const gameCanvas = document.getElementById('gameCanvas');
const statusMessage = document.getElementById('statusMessage');
const questionModal = document.getElementById('questionModal');
const questionText = document.getElementById('questionText');
const answerOptions = document.getElementById('answerOptions');
const resultSummary = document.getElementById('resultSummary');
const leaderboardBox = document.getElementById('leaderboardBox');
const reviewBox = document.getElementById('reviewBox');
const playAgainBtn = document.getElementById('playAgainBtn');

const adminModal = document.getElementById('adminModal');
const adminLoginPanel = document.getElementById('adminLoginPanel');
const adminPanel = document.getElementById('adminPanel');
const adminPasswordInput = document.getElementById('adminPassword');
const loginAdminBtn = document.getElementById('loginAdminBtn');
const saveQuestionsBtn = document.getElementById('saveQuestionsBtn');
const questionsEditor = document.getElementById('questionsEditor');
const adminStatus = document.getElementById('adminStatus');
const closeAdminBtn = document.getElementById('closeAdminBtn');

const hudName = document.getElementById('hudName');
const hudClass = document.getElementById('hudClass');
const hudScore = document.getElementById('hudScore');
const hudBait = document.getElementById('hudBait');
const hudTarget = document.getElementById('hudTarget');
const hudTime = document.getElementById('hudTime');
const fishCaughtCount = document.getElementById('fishCaughtCount');
const progressText = document.getElementById('progressText');
const ctx = gameCanvas.getContext('2d');

const rarityConfig = {
  umum: { label: 'Umum', points: 40, color: '#74d87a', spawnWeight: 55 },
  langka: { label: 'Langka', points: 80, color: '#48d5ff', spawnWeight: 28 },
  super: { label: 'Super', points: 140, color: '#d38bff', spawnWeight: 15 },
  epik: { label: 'Epik', points: 240, color: '#ffc857', spawnWeight: 7 }
};

const defaultQuestions = [
  {
    question: '1. Tokoh pemimpin pasukan Tentara Keamanan Rakyat (TKR) yang gugur di awal Pertempuran Ambarawa adalah...',
    options: ['Jenderal Sudirman', 'Letkol Isdiman', 'Bung Tomo', 'Jenderal A.H. Nasution'],
    answer: 1,
    explanation: 'Jawaban yang benar adalah Letkol Isdiman. Ia gugur di awal pertempuran dan menjadi simbol keberanian pasukan TKR di Ambarawa.',
    rarity: 'umum'
  },
  {
    question: '2. Setelah gugurnya pimpinan sebelumnya, komando pasukan TKR di Ambarawa langsung diambil alih oleh...',
    options: ['Jenderal Oerip Soemohardjo', 'Letjen MT Haryono', 'Kolonel Sudirman', 'Mayor Ahmad Tahir'],
    answer: 2,
    explanation: 'Jawaban yang benar adalah Kolonel Sudirman. Setelah Letkol Isdiman gugur, kolonel ini memimpin langsung operasi di Ambarawa.',
    rarity: 'umum'
  },
  {
    question: '3. Taktik pengepungan ganda yang digunakan oleh Kolonel Sudirman untuk menjepit tentara Sekutu di Ambarawa dikenal dengan nama taktik...',
    options: ['Perang Gerilya', 'Bumi Hangus', 'Supit Urang', 'Pagar Betis'],
    answer: 2,
    explanation: 'Jawaban yang benar adalah Supit Urang. Taktik ini adalah strategi pengepungan ganda yang efektif untuk memotong jalur Sekutu.',
    rarity: 'langka'
  },
  {
    question: '4. Pasukan Sekutu (Inggris) yang mendarat di Semarang dan kemudian memicu pertempuran di Ambarawa dipimpin oleh...',
    options: ['Brigadir Jenderal A.W.S. Mallaby', 'Brigadir Jenderal Bethell', 'Letnan Jenderal Christison', 'Mayor Jenderal Mansergh'],
    answer: 1,
    explanation: 'Jawaban yang benar adalah Brigadir Jenderal Bethell. Ia adalah komandan pasukan Sekutu yang datang di wilayah Jawa Tengah.',
    rarity: 'langka'
  },
  {
    question: '5. Tujuan awal kedatangan pasukan Sekutu ke wilayah Jawa Tengah pada akhir tahun 1945 adalah untuk...',
    options: ['Menjajah kembali Indonesia', 'Melucuti senjata tentara Jepang dan mengurus tawanan perang', 'Membangun pangkalan militer di Ambarawa', 'Membantu Belanda merebut Yogyakarta'],
    answer: 1,
    explanation: 'Jawaban yang benar adalah melucuti senjata tentara Jepang dan mengurus tawanan perang. Tujuan ini berhubungan dengan pasca-kemerdekaan dan proses pendudukan pasukan Sekutu.',
    rarity: 'super'
  },
  {
    question: '6. Ketegangan di Ambarawa bermula karena pasukan Sekutu secara sepihak membebaskan dan mempersenjatai...',
    options: ['Pasukan Jepang yang tersisa', 'Tentara bayaran Gurkha', 'Bekas tawanan perang Belanda (NICA)', 'Penduduk lokal Ambarawa'],
    answer: 2,
    explanation: 'Jawaban yang benar adalah bekas tawanan perang Belanda atau NICA. Kebijakan ini memicu konflik karena NICA dianggap kembali berperan di Indonesia.',
    rarity: 'super'
  },
  {
    question: '7. Sebelum pertempuran memuncak, sempat diadakan perundingan gencatan senjata pada 2 November 1945 di Magelang antara Brigjen Bethell dan...',
    options: ['Ir. Soekarno', 'Drs. Mohammad Hatta', 'Sutan Sjahrir', 'Kolonel Sudirman'],
    answer: 0,
    explanation: 'Jawaban yang benar adalah Ir. Soekarno. Perundingan tersebut merupakan upaya komunikasi sebelum konflik semakin memanas.',
    rarity: 'epik'
  },
  {
    question: '8. Pertempuran Ambarawa berakhir dengan mundurnya pasukan Sekutu ke Semarang pada tanggal...',
    options: ['10 November 1945', '15 Desember 1945', '1 Maret 1949', '20 Oktober 1945'],
    answer: 1,
    explanation: 'Jawaban yang benar adalah 15 Desember 1945. Pada tanggal ini, pasukan Sekutu mundur ke Semarang dan Indonesia menandai kemenangan di Ambarawa.',
    rarity: 'epik'
  },
  {
    question: '9. Untuk mengenang keberhasilan pasukan Indonesia dalam Pertempuran Ambarawa, setiap tanggal 15 Desember diperingati oleh TNI AD sebagai...',
    options: ['Hari Pahlawan', 'Hari Kesaktian Pancasila', 'Hari Juang Kartika (Hari Infanteri)', 'Hari Kebangkitan Nasional'],
    answer: 2,
    explanation: 'Jawaban yang benar adalah Hari Juang Kartika atau Hari Infanteri. Tanggal 15 Desember diingat sebagai hari perjuangan infanteri Indonesia.',
    rarity: 'super'
  },
  {
    question: '10. Monumen yang didirikan di Kabupaten Semarang untuk mengenang peristiwa bersejarah ini adalah...',
    options: ['Monumen Nasional', 'Monumen Palagan Ambarawa', 'Monumen Yogya Kembali', 'Monumen Tugu Muda'],
    answer: 1,
    explanation: 'Jawaban yang benar adalah Monumen Palagan Ambarawa. Monumen ini dibangun untuk mengenang Pertempuran Ambarawa dan semangat juang rakyat Indonesia.',
    rarity: 'umum'
  },
  {
    question: '11. Palagan Ambarawa terjadi setelah Proklamasi Kemerdekaan Indonesia dan merupakan bagian dari perjuangan mempertahankan kemerdekaan.',
    options: ['Benar', 'Salah'],
    answer: 0,
    explanation: 'Benar. Palagan Ambarawa terjadi setelah proklamasi dan menjadi salah satu pertempuran penting dalam mempertahankan kemerdekaan Indonesia.',
    rarity: 'umum'
  },
  {
    question: '12. Kedatangan pasukan Sekutu ke Ambarawa sejak awal bertujuan untuk menjajah kembali Indonesia.',
    options: ['Benar', 'Salah'],
    answer: 1,
    explanation: 'Salah. Kedatangan Sekutu pada awalnya bertujuan untuk melucuti senjata Jepang dan menangani tawanan perang, bukan langsung menjajah kembali Indonesia.',
    rarity: 'umum'
  },
  {
    question: '13. Konflik antara pasukan Indonesia dan Sekutu di Ambarawa dipengaruhi oleh keterlibatan NICA yang berusaha mengembalikan kekuasaan Belanda.',
    options: ['Benar', 'Salah'],
    answer: 0,
    explanation: 'Benar. NICA berusaha mengembalikan kekuasaan Belanda, sehingga konflik di Ambarawa memanas.',
    rarity: 'langka'
  },
  {
    question: '14. Strategi Supit Urang dilakukan dengan mengepung posisi pasukan lawan dari kedua sisi sehingga ruang geraknya semakin terbatas.',
    options: ['Benar', 'Salah'],
    answer: 0,
    explanation: 'Benar. Strategi Supit Urang adalah taktik pengepungan ganda dari dua sisi yang menekan lawan.',
    rarity: 'langka'
  },
  {
    question: '15. Kemenangan Indonesia dalam Palagan Ambarawa terutama disebabkan oleh keunggulan persenjataan TKR dibandingkan pasukan Sekutu.',
    options: ['Benar', 'Salah'],
    answer: 1,
    explanation: 'Salah. Kemenangan bukan semata-mata karena persenjataan, melainkan strategi, semangat juang, dan koordinasi pasukan.',
    rarity: 'super'
  },
  {
    question: '16. Jenderal Soedirman mengambil peran penting dalam mengatur strategi pasukan Indonesia setelah menjadi pimpinan dalam pertempuran Ambarawa.',
    options: ['Benar', 'Salah'],
    answer: 0,
    explanation: 'Benar. Jenderal Sudirman memiliki peran besar dalam merancang strategi dan memimpin perjuangan di Ambarawa.',
    rarity: 'super'
  },
  {
    question: '17. Palagan Ambarawa menunjukkan bahwa perjuangan mempertahankan kemerdekaan hanya bergantung pada tentara, tanpa keterlibatan masyarakat.',
    options: ['Benar', 'Salah'],
    answer: 1,
    explanation: 'Salah. Perjuangan ini melibatkan rakyat, pejuang, dan elemen masyarakat serta tentara.',
    rarity: 'epik'
  },
  {
    question: '18. Kondisi geografis wilayah Ambarawa turut memengaruhi strategi yang digunakan oleh pasukan Indonesia dalam menghadapi lawan.',
    options: ['Benar', 'Salah'],
    answer: 0,
    explanation: 'Benar. Kondisi wilayah dan medan amat memengaruhi taktik dan strategi pasukan Indonesia.',
    rarity: 'epik'
  },
  {
    question: '19. Keberhasilan pasukan Indonesia dalam Palagan Ambarawa memiliki dampak terhadap meningkatnya kepercayaan diri bangsa Indonesia dalam mempertahankan kemerdekaan.',
    options: ['Benar', 'Salah'],
    answer: 0,
    explanation: 'Benar. Kemenangan di Ambarawa memperkuat semangat dan kepercayaan diri Indonesia dalam mempertahankan kemerdekaan.',
    rarity: 'super'
  },
  {
    question: '20. Palagan Ambarawa berakhir dengan kemenangan pasukan Sekutu sehingga Indonesia kehilangan kendali atas wilayah Ambarawa.',
    options: ['Benar', 'Salah'],
    answer: 1,
    explanation: 'Salah. Kemenangan ada di pihak Indonesia, dan pasukan Sekutu mundur ke Semarang setelah kekalahan di Ambarawa.',
    rarity: 'umum'
  }
];

let questionBank = [...defaultQuestions];
let fishList = [];
let currentPlayer = {
  name: '',
  kelas: '',
  score: 0,
  baitLeft: 15,
  target: 500,
  fishCaught: 0,
  review: [],
  timeLeft: 60,
  usedQuestions: [],
  isPlaying: false,
  hasEnded: false,
  selectedRarity: 'semua'
};

let boat = { x: 170, y: 120, direction: 1 };
let anchor = { x: boat.x + 120, y: boat.y + 90, active: false, direction: 1, swing: 0, angle: 0, targetX: boat.x + 120, targetY: boat.y + 90, reached: false, targetFishId: null };
let lastSpawn = 0;
let lastFrame = 0;
let questionIsOpen = false;

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function pickRarity() {
  const pool = [];
  Object.entries(rarityConfig).forEach(([rarity, config]) => {
    for (let i = 0; i < config.spawnWeight; i += 1) pool.push(rarity);
  });
  return randomFrom(pool);
}

function getQuestionByRarity(rarity) {
  const usedKeys = new Set((currentPlayer.usedQuestions || []).map((item) => String(item).trim()));
  const eligible = questionBank.filter((item) => {
    const matchesRarity = item.rarity === rarity || rarity === 'semua';
    const isUsed = usedKeys.has(String(item.question || '').trim());
    return matchesRarity && !isUsed;
  });

  const pool = eligible.length ? eligible : questionBank.filter((item) => item.rarity === rarity || rarity === 'semua');

  if (!pool.length) {
    currentPlayer.usedQuestions = [];
    return randomFrom(questionBank.filter((item) => item.rarity === rarity || rarity === 'semua') || questionBank);
  }

  const chosen = randomFrom(pool);
  currentPlayer.usedQuestions = [...(currentPlayer.usedQuestions || []), String(chosen.question || '').trim()];
  return chosen;
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateStatus(text) {
  statusMessage.textContent = text;
}

function updateHud() {
  hudName.textContent = currentPlayer.name || '-';
  hudClass.textContent = currentPlayer.kelas || '-';
  hudScore.textContent = currentPlayer.score;
  hudBait.textContent = currentPlayer.baitLeft;
  hudTarget.textContent = currentPlayer.target;
  hudTime.textContent = formatTime(currentPlayer.timeLeft ?? 60);
  fishCaughtCount.textContent = currentPlayer.fishCaught;
  const percent = Math.min(100, Math.round((currentPlayer.score / currentPlayer.target) * 100));
  progressText.textContent = `${percent}%`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function renderLeaderboard(entries) {
  if (!entries || !entries.length) {
    leaderboardBox.innerHTML = '<h3>Leaderboard</h3><p>Belum ada data.</p>';
    return;
  }

  leaderboardBox.innerHTML = `
    <h3>Leaderboard Pemenang</h3>
    <ul>
      ${entries.map((entry, index) => `<li><strong>${index + 1}.</strong> ${escapeHtml(entry.name || 'Anonim')} (${escapeHtml(entry.kelas || '-')}) - ${Number(entry.score || 0)} poin</li>`).join('')}
    </ul>
  `;
}

function renderReview(entries) {
  if (!entries || !entries.length) {
    reviewBox.innerHTML = '<h3>Pembahasan soal</h3><p>Belum ada soal yang dijawab.</p>';
    return;
  }

  reviewBox.innerHTML = `
    <h3>Pembahasan soal</h3>
    <ul>
      ${entries.map((item) => `
        <li>
          <strong>Q:</strong> ${escapeHtml(item.question || '-') }<br>
          <strong>Jawaban kamu:</strong> ${escapeHtml(item.selected || '-') }<br>
          <strong>Jawaban benar:</strong> ${escapeHtml(item.correct || '-') }<br>
          <strong>Pembahasan:</strong> ${escapeHtml(item.explanation || '-') }<br>
          <strong>Hasil:</strong> ${escapeHtml(item.result || '-') }
        </li>`).join('')}
    </ul>
  `;
}

function showScreen(screen) {
  loginScreen.classList.add('hidden');
  gameScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  screen.classList.remove('hidden');
}

function spawnFish() {
  if (!currentPlayer.isPlaying || currentPlayer.hasEnded) return;

  const rarity = pickRarity();
  const fish = {
    id: Date.now() + Math.random(),
    x: gameCanvas.width + 30 + Math.random() * 200,
    y: 220 + Math.random() * 150,
    velocity: 0.9 + Math.random() * 1.6,
    size: 18 + Math.random() * 18,
    rarity,
    color: rarityConfig[rarity].color,
    question: getQuestionByRarity(rarity),
    bob: Math.random() * Math.PI * 2,
    drift: (Math.random() - 0.5) * 0.6
  };

  fishList.push(fish);
}

function drawScene() {
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  ctx.fillStyle = '#118fe2';
  ctx.fillRect(0, 0, gameCanvas.width, 240);

  ctx.fillStyle = '#1d4766';
  ctx.fillRect(0, 260, gameCanvas.width, 180);

  ctx.fillStyle = '#f5f8ff';
  for (let i = 0; i < 18; i += 1) {
    ctx.fillRect(i * 42 + 10, 50 + (i % 5) * 18, 2, 2);
  }

  ctx.fillStyle = '#dcebff';
  ctx.fillRect(0, 385, gameCanvas.width, 40);

  const boatX = boat.x;
  const boatY = boat.y;

  ctx.fillStyle = '#8d5634';
  ctx.beginPath();
  ctx.moveTo(boatX - 90, boatY + 20);
  ctx.quadraticCurveTo(boatX - 35, boatY - 30, boatX, boatY - 18);
  ctx.quadraticCurveTo(boatX + 35, boatY - 30, boatX + 90, boatY + 20);
  ctx.lineTo(boatX + 65, boatY + 48);
  ctx.quadraticCurveTo(boatX, boatY + 58, boatX - 65, boatY + 48);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#f4dfb4';
  ctx.fillRect(boatX - 24, boatY - 14, 48, 18);
  ctx.fillStyle = '#2b2d36';
  ctx.fillRect(boatX - 18, boatY - 36, 18, 22);
  ctx.fillRect(boatX + 6, boatY - 30, 14, 18);
  ctx.fillStyle = '#d8e8ff';
  ctx.fillRect(boatX - 30, boatY - 56, 60, 18);

  const lineEndX = anchor.active ? anchor.x : boatX + Math.sin(anchor.angle) * 120;
  const lineEndY = anchor.active ? anchor.y : boatY + 90 + Math.cos(anchor.angle) * 26;

  ctx.strokeStyle = anchor.active ? '#ffffff' : '#ebf3ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(boatX, boatY + 15);
  ctx.lineTo(lineEndX, lineEndY);
  ctx.stroke();

  ctx.fillStyle = '#d7ae6e';
  ctx.beginPath();
  ctx.arc(lineEndX, lineEndY, anchor.active ? 12 : 10, 0, Math.PI * 2);
  ctx.fill();

  fishList.forEach((fish) => {
    const bob = Math.sin(fish.bob) * 4;
    ctx.save();
    ctx.translate(fish.x, fish.y + bob);
    ctx.scale(fish.drift >= 0 ? 1 : -1, 1);
    ctx.fillStyle = fish.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, fish.size, fish.size * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(fish.size, 0);
    ctx.lineTo(fish.size + 12, -6);
    ctx.lineTo(fish.size + 12, 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#0a1116';
    ctx.beginPath();
    ctx.arc(-fish.size * 0.25, -2, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function renderGameLoop(timestamp) {
  const delta = timestamp - lastFrame;
  lastFrame = timestamp;

  if (currentPlayer.isPlaying && !currentPlayer.hasEnded) {
    currentPlayer.timeLeft = Math.max(0, (currentPlayer.timeLeft ?? 60) - (delta / 1000));
    updateHud();

    if (currentPlayer.timeLeft <= 0) {
      endGame();
    }

    anchor.angle = Math.sin(timestamp * 0.0028) * 1.1;
    anchor.direction = anchor.angle >= 0 ? 1 : -1;
    boat.direction = anchor.direction;

    if (!anchor.active) {
      anchor.x = boat.x + Math.sin(anchor.angle) * 120;
      anchor.y = boat.y + 90 + Math.cos(anchor.angle) * 26;
      anchor.targetX = anchor.x;
      anchor.targetY = anchor.y;
      anchor.reached = false;
      anchor.targetFishId = null;
    } else if (anchor.targetFishId) {
      const targetFish = fishList.find((fish) => fish.id === anchor.targetFishId);
      if (targetFish) {
        const dx = boat.x - targetFish.x;
        const dy = (boat.y + 20) - targetFish.y;
        targetFish.x += dx * 0.06;
        targetFish.y += dy * 0.06;
        targetFish.bob += 0.15;

        anchor.targetX = targetFish.x;
        anchor.targetY = targetFish.y + Math.sin(targetFish.bob) * 4;
        anchor.x += (anchor.targetX - anchor.x) * 0.22;
        anchor.y += (anchor.targetY - anchor.y) * 0.22;

        if (Math.hypot(boat.x - targetFish.x, (boat.y + 20) - targetFish.y) < 28) {
          openQuestion(targetFish);
          anchor.active = false;
          anchor.targetFishId = null;
          anchor.reached = true;
          questionIsOpen = true;
        }
      }
    }

    fishList = fishList.filter((fish) => fish.x > -60);
    fishList.forEach((fish) => {
      fish.x -= fish.velocity * (delta / 17);
      fish.y += Math.sin(fish.bob) * 0.18;
      fish.bob += 0.08;
    });

    if (timestamp - lastSpawn > 1200) {
      lastSpawn = timestamp;
      if (fishList.length < 6) spawnFish();
    }
  }

  drawScene();
  requestAnimationFrame(renderGameLoop);
}

function openQuestion(fish) {
  if (!fish || questionIsOpen) return;

  questionText.textContent = fish.question.question;
  answerOptions.innerHTML = '';

  fish.question.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    btn.addEventListener('click', () => answerQuestion(fish, index));
    answerOptions.appendChild(btn);
  });

  questionModal.classList.remove('hidden');
  questionIsOpen = true;
}

function answerQuestion(fish, selectedIndex) {
  if (!fish || !Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= (fish.question?.options?.length || 0)) {
    updateStatus('Pilihan jawaban tidak valid. Silakan pilih ulang.');
    questionModal.classList.add('hidden');
    questionIsOpen = false;
    anchor.active = false;
    return;
  }

  const correctIndex = Number.isInteger(fish.question?.answer) ? fish.question.answer : 0;
  const isCorrect = selectedIndex === correctIndex;
  const reviewItem = {
    question: fish.question.question,
    selected: fish.question.options[selectedIndex],
    correct: fish.question.options[correctIndex],
    explanation: fish.question.explanation,
    result: isCorrect ? 'benar' : 'salah'
  };

  currentPlayer.review.push(reviewItem);
  fishList = fishList.filter((item) => item.id !== fish.id);
  questionModal.classList.add('hidden');
  questionIsOpen = false;
  anchor.active = false;

  if (isCorrect) {
    const bonus = rarityConfig[fish.rarity].points;
    currentPlayer.score += bonus;
    currentPlayer.fishCaught += 1;
    updateStatus(`Jawaban benar! Ikan ${rarityConfig[fish.rarity].label} berhasil ditangkap (+${bonus} poin).`);
  } else {
    updateStatus('Jawaban salah, ikan kabur.');
  }

  updateHud();
  if (currentPlayer.score >= currentPlayer.target) endGame();
}

function castAnchor() {
  if (!currentPlayer.isPlaying || currentPlayer.hasEnded) return;
  if (currentPlayer.baitLeft <= 0) {
    endGame();
    return;
  }

  currentPlayer.baitLeft -= 1;
  updateHud();

  const targetX = boat.x + Math.sin(anchor.angle) * 180;
  const targetY = boat.y + 80 + Math.cos(anchor.angle) * 28;
  anchor.x = boat.x;
  anchor.y = boat.y + 15;
  anchor.targetX = targetX;
  anchor.targetY = targetY;
  anchor.active = true;
  anchor.reached = false;
  anchor.targetFishId = null;

  const allowedRarity = currentPlayer.selectedRarity === 'semua' ? null : currentPlayer.selectedRarity;
  const candidate = fishList
    .filter((fish) => {
      if (allowedRarity && fish.rarity !== allowedRarity) return false;
      return Math.abs(fish.x - targetX) < 160 && Math.abs(fish.y - targetY) < 110;
    })
    .sort((a, b) => Math.abs(a.x - targetX) - Math.abs(b.x - targetX))[0];

  if (candidate) {
    anchor.targetFishId = candidate.id;
    anchor.targetX = candidate.x;
    anchor.targetY = candidate.y + Math.sin(candidate.bob) * 4;
    updateStatus(`Ikan ${rarityConfig[candidate.rarity].label} siap ditangkap. Kail sedang meraih ke arahnya!`);
  } else {
    const availableFish = fishList.filter((fish) => {
      if (currentPlayer.selectedRarity !== 'semua' && fish.rarity !== currentPlayer.selectedRarity) return false;
      return true;
    });

    if (availableFish.length === 0) {
      updateStatus('Belum ada ikan yang cocok untuk target saat ini. Coba lagi nanti.');
    } else {
      updateStatus('Tidak ada ikan pada arah itu. Jangkar tetap bergoyang otomatis.');
    }

    setTimeout(() => {
      anchor.active = false;
    }, 220);
  }

  if (currentPlayer.baitLeft <= 0 && currentPlayer.score < currentPlayer.target) {
    setTimeout(() => endGame(), 500);
  }
}

function endGame() {
  if (currentPlayer.hasEnded) return;

  currentPlayer.hasEnded = true;
  currentPlayer.isPlaying = false;
  questionModal.classList.add('hidden');

  const entry = {
    name: currentPlayer.name,
    kelas: currentPlayer.kelas,
    score: currentPlayer.score,
    catches: currentPlayer.fishCaught,
    baitLeft: currentPlayer.baitLeft,
    target: currentPlayer.target,
    questions: currentPlayer.review
  };

  fetch('/api/leaderboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.leaderboard) renderLeaderboard(data.leaderboard);
    })
    .catch(() => renderLeaderboard([]));

  const status = entry.score >= entry.target ? 'Target berhasil tercapai!' : currentPlayer.timeLeft <= 0 ? 'Waktu habis! Skor akhir ditampilkan di papan skor.' : 'Permainan selesai, target belum tercapai.';
  resultSummary.innerHTML = `
    <p><strong>Nama:</strong> ${escapeHtml(entry.name)}</p>
    <p><strong>Kelas:</strong> ${escapeHtml(entry.kelas)}</p>
    <p><strong>Skor akhir:</strong> ${Number(entry.score || 0)}</p>
    <p><strong>Ikan tertangkap:</strong> ${Number(entry.catches || 0)}</p>
    <p><strong>Umpan tersisa:</strong> ${Number(entry.baitLeft || 0)}</p>
    <p><strong>Waktu:</strong> ${formatTime(currentPlayer.timeLeft ?? 0)}</p>
    <p><strong>Status:</strong> ${escapeHtml(status)}</p>
  `;

  renderReview(entry.questions);
  showScreen(resultScreen);
}

function closeAdminModal() {
  adminModal.classList.add('hidden');
  adminPasswordInput.value = '';
  adminStatus.textContent = '';
}

function startGame() {
  closeAdminModal();

  const name = playerNameInput.value.trim();
  const kelas = playerClassInput.value.trim();

  if (!name || !kelas) {
    updateStatus('Nama dan kelas harus diisi terlebih dahulu.');
    return;
  }

  currentPlayer = {
    name,
    kelas,
    score: 0,
    baitLeft: 15,
    target: 500,
    fishCaught: 0,
    review: [],
    timeLeft: 60,
    usedQuestions: [],
    isPlaying: true,
    hasEnded: false,
    selectedRarity: fishTarget.value
  };

  boat = { x: 170, y: 120, direction: 1 };
  anchor = { x: boat.x + 120, y: boat.y + 90, active: false, direction: 1, swing: 0, angle: 0, targetX: boat.x + 120, targetY: boat.y + 90, reached: false, targetFishId: null };
  fishList = [];
  lastSpawn = 0;
  questionIsOpen = false;

  for (let i = 0; i < 4; i += 1) spawnFish();
  updateHud();
  showScreen(gameScreen);
  questionModal.classList.add('hidden');
  updateStatus('Permainan dimulai! Jangkar bergerak otomatis ke kanan dan kiri.');
  socket.emit('player:register', { name, kelas });
}

function loadQuestions() {
  fetch('/api/questions')
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data.questions) && data.questions.length) {
        questionBank = data.questions;
      }
    })
    .catch(() => {
      questionBank = [...defaultQuestions];
    });
}

function loadLeaderboard() {
  fetch('/api/leaderboard')
    .then((res) => res.json())
    .then((data) => renderLeaderboard(data.leaderboard || []))
    .catch(() => renderLeaderboard([]));
}

startBtn.addEventListener('click', startGame);
castBtn.addEventListener('click', () => {
  currentPlayer.selectedRarity = fishTarget.value;
  castAnchor();
});

window.addEventListener('keydown', (event) => {
  if (!currentPlayer.isPlaying || currentPlayer.hasEnded) return;
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    castAnchor();
  }
});

adminBtn.addEventListener('click', () => {
  adminModal.classList.remove('hidden');
  adminLoginPanel.classList.remove('hidden');
  adminPanel.classList.add('hidden');
  adminPasswordInput.value = '';
  adminStatus.textContent = '';
});

closeAdminBtn.addEventListener('click', closeAdminModal);

loginAdminBtn.addEventListener('click', async () => {
  const password = adminPasswordInput.value;
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const data = await res.json();

  if (data.success) {
    adminLoginPanel.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    questionsEditor.value = JSON.stringify(questionBank, null, 2);
    adminStatus.textContent = 'Admin berhasil masuk.';
  } else {
    adminStatus.textContent = data.message || 'Password salah.';
  }
});

saveQuestionsBtn.addEventListener('click', async () => {
  try {
    const payload = JSON.parse(questionsEditor.value);
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPasswordInput.value, questions: payload })
    });
    const data = await res.json();
    adminStatus.textContent = data.message || 'Soal disimpan.';
    if (data.success) {
      questionBank = Array.isArray(payload) ? payload : questionBank;
      updateStatus('Daftar soal berhasil diperbarui.');
    }
  } catch {
    adminStatus.textContent = 'Format JSON tidak valid. Periksa data soal.';
  }
});

playAgainBtn.addEventListener('click', () => {
  resultScreen.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  playerNameInput.value = '';
  playerClassInput.value = '';
  updateStatus('Silakan masuk kembali.');
});

socket.on('leaderboard:updated', (data) => {
  if (data && data.leaderboard) renderLeaderboard(data.leaderboard);
});

socket.on('server:status', (data) => {
  updateStatus(data.message || 'Terhubung ke server.');
});

loadQuestions();
loadLeaderboard();
updateHud();
renderReview([]);
renderLeaderboard([]);
showScreen(loginScreen);
drawScene();
requestAnimationFrame(renderGameLoop);
