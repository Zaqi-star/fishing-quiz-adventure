const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Kelompok123';
const rootDir = __dirname;
const dataDir = path.join(rootDir, 'data');
const questionsPath = path.join(dataDir, 'questions.json');
const leaderboardPath = path.join(dataDir, 'leaderboard.json');

const ALLOWED_RARITIES = new Set(['umum', 'langka', 'super', 'epik']);

const defaultQuestions = [
  {
    question: 'Benda yang dapat menyerap panas matahari paling besar adalah?',
    options: ['Air', 'Batu', 'Udara', 'Kayu'],
    answer: 0,
    explanation: 'Air memiliki kapasitas panas yang tinggi, jadi ia menyerap dan menyimpan panas dengan baik.',
    rarity: 'umum'
  },
  {
    question: 'Salah satu ciri makhluk hidup adalah...',
    options: ['Bergerak tanpa tujuan', 'Bernapas', 'Mudah hancur', 'Tidak butuh makanan'],
    answer: 1,
    explanation: 'Makhluk hidup bernapas untuk mendapatkan energi dan menjaga proses metabolisme.',
    rarity: 'umum'
  },
  {
    question: 'Planet terbesar di tata surya adalah?',
    options: ['Mars', 'Jupiter', 'Bumi', 'Saturnus'],
    answer: 1,
    explanation: 'Jupiter adalah planet terbesar di tata surya dan memiliki ukuran yang sangat besar.',
    rarity: 'langka'
  },
  {
    question: 'Satuan luas yang benar dalam SI adalah?',
    options: ['Meter', 'Kilogram', 'Meter persegi', 'Liter'],
    answer: 2,
    explanation: 'Satuan luas dalam SI adalah meter persegi (m²).',
    rarity: 'langka'
  },
  {
    question: 'Hasil dari 8 x 7 adalah?',
    options: ['45', '54', '56', '65'],
    answer: 2,
    explanation: '8 dikali 7 sama dengan 56.',
    rarity: 'super'
  },
  {
    question: 'Ibu kota Indonesia adalah?',
    options: ['Bandung', 'Jakarta', 'Surabaya', 'Medan'],
    answer: 1,
    explanation: 'Jakarta adalah ibu kota Indonesia.',
    rarity: 'super'
  },
  {
    question: 'Benua terbesar di dunia adalah?',
    options: ['Afrika', 'Amerika', 'Asia', 'Eropa'],
    answer: 2,
    explanation: 'Asia adalah benua terluas di dunia.',
    rarity: 'epik'
  },
  {
    question: 'Hewan yang hidup di air dan bernapas dengan insang adalah?',
    options: ['Kucing', 'Burung', 'Ikan', 'Kelinci'],
    answer: 2,
    explanation: 'Ikan bernapas menggunakan insang untuk mengambil oksigen dari air.',
    rarity: 'epik'
  }
];

function normalizeQuestion(item = {}) {
  const options = Array.isArray(item.options) ? item.options.slice(0, 4).map((option) => String(option ?? '').trim()).filter(Boolean) : [];
  const answer = Number.isInteger(item.answer) ? item.answer : 0;
  const rarity = String(item.rarity ?? 'umum').trim().toLowerCase();

  if (options.length < 2) {
    return null;
  }

  const safeAnswer = answer >= 0 && answer < options.length ? answer : 0;
  const safeText = String(item.question ?? '').trim();

  return {
    question: safeText,
    options,
    answer: safeAnswer,
    explanation: String(item.explanation ?? '').trim(),
    rarity: ALLOWED_RARITIES.has(rarity) ? rarity : 'umum'
  };
}

function normalizeLeaderboardEntry(entry = {}) {
  return {
    name: String(entry.name ?? 'Anonim').trim() || 'Anonim',
    kelas: String(entry.kelas ?? '-').trim() || '-',
    score: Number.isFinite(Number(entry.score)) ? Math.max(0, Number(entry.score)) : 0,
    catches: Number.isFinite(Number(entry.catches)) ? Math.max(0, Number(entry.catches)) : 0,
    baitLeft: Number.isFinite(Number(entry.baitLeft)) ? Math.max(0, Number(entry.baitLeft)) : 0,
    target: Number.isFinite(Number(entry.target)) ? Math.max(0, Number(entry.target)) : 0,
    questions: Array.isArray(entry.questions) ? entry.questions.map((question) => ({
      question: String(question?.question ?? '').trim(),
      selected: String(question?.selected ?? '').trim(),
      correct: String(question?.correct ?? '').trim(),
      explanation: String(question?.explanation ?? '').trim(),
      result: String(question?.result ?? '').trim()
    })) : [],
    createdAt: entry.createdAt || new Date().toISOString()
  };
}

function ensureFiles() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(questionsPath)) {
    fs.writeFileSync(questionsPath, JSON.stringify(defaultQuestions, null, 2));
  }

  if (!fs.existsSync(leaderboardPath)) {
    fs.writeFileSync(leaderboardPath, JSON.stringify([], null, 2));
  }
}

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (error) {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(rootDir, 'public')));

app.get('/api/questions', (req, res) => {
  const rawQuestions = readJson(questionsPath, defaultQuestions);
  const questions = Array.isArray(rawQuestions)
    ? rawQuestions.map((item) => normalizeQuestion(item)).filter(Boolean)
    : defaultQuestions;
  res.json({ questions: questions.length ? questions : defaultQuestions });
});

app.post('/api/questions', (req, res) => {
  const { password, questions } = req.body || {};

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Password admin salah.' });
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ success: false, message: 'Data soal tidak valid.' });
  }

  const validQuestions = questions
    .map((item) => normalizeQuestion(item))
    .filter(Boolean)
    .filter((item) => item.question);

  if (validQuestions.length === 0) {
    return res.status(400).json({ success: false, message: 'Soal yang dikirim tidak memiliki format yang benar.' });
  }

  writeJson(questionsPath, validQuestions);
  io.emit('admin:questions-updated', { count: validQuestions.length });
  res.json({ success: true, count: validQuestions.length, message: 'Daftar soal berhasil diperbarui.' });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  const valid = password === ADMIN_PASSWORD;
  res.json({ success: valid, message: valid ? 'Berhasil masuk admin.' : 'Password salah.' });
});

app.get('/api/leaderboard', (req, res) => {
  const leaderboard = readJson(leaderboardPath, []).map((entry) => normalizeLeaderboardEntry(entry));
  leaderboard.sort((a, b) => (b.score || 0) - (a.score || 0));
  res.json({ leaderboard: leaderboard.slice(0, 10) });
});

app.post('/api/leaderboard', (req, res) => {
  const { name, kelas, score, catches, baitLeft, target, questions } = req.body || {};

  const entry = normalizeLeaderboardEntry({
    name,
    kelas,
    score,
    catches,
    baitLeft,
    target,
    questions,
    createdAt: new Date().toISOString()
  });

  const leaderboard = readJson(leaderboardPath, []).map((item) => normalizeLeaderboardEntry(item));
  leaderboard.push(entry);
  leaderboard.sort((a, b) => (b.score || 0) - (a.score || 0));
  const top = leaderboard.slice(0, 10);
  writeJson(leaderboardPath, top);

  io.emit('leaderboard:updated', { leaderboard: top });
  res.json({ success: true, leaderboard: top });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  socket.emit('server:status', { message: 'Terhubung ke server game memancing.' });

  socket.on('player:register', (payload) => {
    const name = String(payload?.name || 'Player').trim();
    const kelas = String(payload?.kelas || 'Tanpa Kelas').trim();
    socket.data.name = name;
    socket.data.kelas = kelas;
    socket.emit('player:registered', { name, kelas });
  });
});

ensureFiles();

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
