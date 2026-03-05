import * as BunnySDK from "https://esm.sh/@bunny.net/edgescript-sdk@0.12.0";

// --- Word List (~200 common 5-letter words) ---
const WORDS = [
  "ABOUT","ABOVE","ACUTE","ADMIT","ADOPT","AGENT","AGREE","ALARM","ALBUM","ALERT",
  "ALIEN","ALIGN","ALLEY","ALLOW","ALONE","AMAZE","AMPLE","ANGEL","ANGER","ANGLE",
  "APPLE","ARENA","ARISE","ARMOR","ASIDE","AWAKE","BADGE","BASIC","BEACH","BEGIN",
  "BEING","BELOW","BENCH","BLACK","BLADE","BLAME","BLANK","BLAST","BLAZE","BLEED",
  "BLEND","BLESS","BLIND","BLOCK","BLOOD","BLOOM","BOARD","BONUS","BOOST","BOUND",
  "BRAIN","BRAND","BRAVE","BREAD","BREAK","BREED","BRICK","BRIEF","BRING","BROAD",
  "BROWN","BRUSH","BUILD","BURST","CABIN","CANDY","CARRY","CATCH","CAUSE","CHAIN",
  "CHAIR","CHARM","CHASE","CHEAP","CHECK","CHEST","CHIEF","CHILD","CHINA","CHOSE",
  "CIVIL","CLAIM","CLASS","CLEAN","CLEAR","CLIMB","CLING","CLOCK","CLOSE","CLOUD",
  "COACH","COAST","COLOR","COMET","CORAL","COUNT","COURT","COVER","CRACK","CRAFT",
  "CRANE","CRASH","CRAZY","CREAM","CREEP","CRIME","CROSS","CROWD","CROWN","CRUEL",
  "CRUSH","CURVE","CYCLE","DANCE","DEATH","DEBUG","DELAY","DENSE","DEPOT","DEPTH",
  "DIARY","DIRTY","DITCH","DOUBT","DRAFT","DRAIN","DRAMA","DRANK","DRAWN","DREAM",
  "DRESS","DRIED","DRIFT","DRILL","DRINK","DRIVE","DROIT","DRONE","DROVE","DYING",
  "EAGER","EARLY","EARTH","EIGHT","ELECT","ELITE","EMBED","EMBER","EMPTY","ENEMY",
  "ENJOY","ENTER","EQUAL","ERROR","EVENT","EVERY","EXACT","EXAMS","EXIST","EXTRA",
  "FABLE","FAITH","FALSE","FANCY","FATAL","FAULT","FEAST","FENCE","FEVER","FIBER",
  "FIELD","FIFTH","FIFTY","FIGHT","FINAL","FIRST","FLAME","FLASH","FLEET","FLESH",
  "FLOAT","FLOOD","FLOOR","FLOUR","FLUID","FLUSH","FLUTE","FOCUS","FORCE","FORGE",
  "FORTH","FORUM","FOUND","FRAME","FRANK","FRAUD","FRESH","FRONT","FROST","FRUIT",
];

// --- Game State ---
interface GameSession {
  word: string;
  guesses: string[];
  status: "playing" | "won" | "lost";
}

const games = new Map<string, GameSession>();

function generateId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 16; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function pickWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function evaluateGuess(guess: string, word: string): { letter: string; status: "correct" | "present" | "absent" }[] {
  const result: { letter: string; status: "correct" | "present" | "absent" }[] = [];
  const wordArr = word.split("");
  const guessArr = guess.split("");
  const remaining: (string | null)[] = [...wordArr];

  // First pass: mark correct letters
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === wordArr[i]) {
      result[i] = { letter: guessArr[i], status: "correct" };
      remaining[i] = null;
    }
  }

  // Second pass: mark present/absent
  for (let i = 0; i < 5; i++) {
    if (result[i]) continue;
    const idx = remaining.indexOf(guessArr[i]);
    if (idx !== -1) {
      result[i] = { letter: guessArr[i], status: "present" };
      remaining[idx] = null;
    } else {
      result[i] = { letter: guessArr[i], status: "absent" };
    }
  }

  return result;
}

// Validate guess is 5 alpha characters
function isValidGuess(guess: string): boolean {
  return /^[A-Z]{5}$/.test(guess);
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// --- Routes ---
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/") {
    return new Response(HTML_PAGE, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (req.method === "POST" && url.pathname === "/api/new") {
    const id = generateId();
    games.set(id, { word: pickWord(), guesses: [], status: "playing" });
    return jsonResponse({ gameId: id });
  }

  if (req.method === "POST" && url.pathname === "/api/guess") {
    try {
      const body = await req.json();
      const { gameId, guess } = body;
      const session = games.get(gameId);

      if (!session) return jsonResponse({ error: "Game not found" }, 404);
      if (session.status !== "playing") {
        return jsonResponse({ error: "Game is over", status: session.status, answer: session.word });
      }

      const upper = (guess as string).toUpperCase();
      if (!isValidGuess(upper)) {
        return jsonResponse({ error: "Invalid guess. Must be 5 letters." }, 400);
      }

      const result = evaluateGuess(upper, session.word);
      session.guesses.push(upper);

      if (upper === session.word) {
        session.status = "won";
      } else if (session.guesses.length >= 6) {
        session.status = "lost";
      }

      const resp: Record<string, unknown> = { result, status: session.status, guessNumber: session.guesses.length };
      if (session.status !== "playing") {
        resp.answer = session.word;
      }

      return jsonResponse(resp);
    } catch {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }
  }

  if (req.method === "POST" && url.pathname === "/api/state") {
    try {
      const body = await req.json();
      const session = games.get(body.gameId);
      if (!session) return jsonResponse({ error: "Game not found" }, 404);

      const history = session.guesses.map((g) => ({
        guess: g,
        result: evaluateGuess(g, session.word),
      }));

      const resp: Record<string, unknown> = { status: session.status, history };
      if (session.status !== "playing") resp.answer = session.word;
      return jsonResponse(resp);
    } catch {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }
  }

  return new Response("Not Found", { status: 404 });
}

// --- HTML Page ---
const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wordle</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background: #121213;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100dvh;
    user-select: none;
  }
  header {
    width: 100%;
    max-width: 500px;
    text-align: center;
    padding: 12px 0;
    border-bottom: 1px solid #3a3a3c;
  }
  header h1 { font-size: 2rem; font-weight: 700; letter-spacing: 0.15em; }
  #message {
    height: 32px;
    line-height: 32px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #fff;
    text-align: center;
  }
  #board {
    display: grid;
    grid-template-rows: repeat(6, 1fr);
    gap: 5px;
    padding: 10px 0;
  }
  .row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 5px;
  }
  .tile {
    width: 62px; height: 62px;
    border: 2px solid #3a3a3c;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 700;
    text-transform: uppercase;
    transition: transform 0.1s;
  }
  .tile.filled { border-color: #565758; animation: pop 0.1s; }
  .tile.reveal {
    animation: flip 0.35s ease forwards;
  }
  .tile.correct { background: #538d4e; border-color: #538d4e; }
  .tile.present { background: #b59f3b; border-color: #b59f3b; }
  .tile.absent  { background: #3a3a3c; border-color: #3a3a3c; }

  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.12); }
    100% { transform: scale(1); }
  }
  @keyframes flip {
    0%   { transform: rotateX(0); }
    45%  { transform: rotateX(90deg); }
    100% { transform: rotateX(0); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-4px); }
    40%, 80% { transform: translateX(4px); }
  }
  .row.shake { animation: shake 0.3s; }

  #keyboard {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding-bottom: 16px;
  }
  .kb-row { display: flex; gap: 5px; }
  .key {
    height: 58px;
    min-width: 36px;
    padding: 0 8px;
    border: none;
    border-radius: 4px;
    background: #818384;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    transition: background 0.2s;
  }
  .key.wide { min-width: 65px; font-size: 0.75rem; }
  .key.correct { background: #538d4e; }
  .key.present { background: #b59f3b; }
  .key.absent  { background: #3a3a3c; }

  #new-game {
    display: none;
    margin-top: 12px;
    padding: 12px 32px;
    border: none;
    border-radius: 4px;
    background: #538d4e;
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.05em;
  }
  #new-game:hover { background: #6aaf5e; }

  @media (max-width: 400px) {
    .tile { width: 52px; height: 52px; font-size: 1.6rem; }
    .key  { height: 50px; min-width: 28px; font-size: 0.75rem; }
    .key.wide { min-width: 52px; }
  }
</style>
</head>
<body>
<header><h1>WORDLE</h1></header>
<div id="message"></div>
<div id="board"></div>
<div id="keyboard"></div>
<button id="new-game">New Game</button>

<script>
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
let gameId = null;
let currentRow = 0;
let currentCol = 0;
let currentGuess = "";
let gameOver = false;
let isRevealing = false;

const board = document.getElementById("board");
const messageEl = document.getElementById("message");
const keyboardEl = document.getElementById("keyboard");
const newGameBtn = document.getElementById("new-game");

// Build board
for (let r = 0; r < MAX_GUESSES; r++) {
  const row = document.createElement("div");
  row.className = "row";
  row.dataset.row = r;
  for (let c = 0; c < WORD_LENGTH; c++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.row = r;
    tile.dataset.col = c;
    row.appendChild(tile);
  }
  board.appendChild(row);
}

// Build keyboard
const rows = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","BACK"]
];
const keyStatus = {};

rows.forEach(keys => {
  const row = document.createElement("div");
  row.className = "kb-row";
  keys.forEach(k => {
    const btn = document.createElement("button");
    btn.className = "key" + (k.length > 1 ? " wide" : "");
    btn.textContent = k === "BACK" ? "⌫" : k;
    btn.dataset.key = k;
    btn.addEventListener("click", () => handleKey(k));
    row.appendChild(btn);
  });
  keyboardEl.appendChild(row);
});

// Physical keyboard
document.addEventListener("keydown", e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "Enter") handleKey("ENTER");
  else if (e.key === "Backspace") handleKey("BACK");
  else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
});

function getTile(row, col) {
  return board.querySelector(\`.tile[data-row="\${row}"][data-col="\${col}"]\`);
}

function showMessage(msg, duration = 1500) {
  messageEl.textContent = msg;
  if (duration > 0) setTimeout(() => { messageEl.textContent = ""; }, duration);
}

function shakeRow(row) {
  const rowEl = board.querySelector(\`.row[data-row="\${row}"]\`);
  rowEl.classList.add("shake");
  rowEl.addEventListener("animationend", () => rowEl.classList.remove("shake"), { once: true });
}

function handleKey(key) {
  if (gameOver || isRevealing) return;

  if (key === "BACK") {
    if (currentCol > 0) {
      currentCol--;
      currentGuess = currentGuess.slice(0, -1);
      const tile = getTile(currentRow, currentCol);
      tile.textContent = "";
      tile.classList.remove("filled");
    }
    return;
  }

  if (key === "ENTER") {
    if (currentGuess.length < WORD_LENGTH) {
      showMessage("Not enough letters");
      shakeRow(currentRow);
      return;
    }
    submitGuess();
    return;
  }

  if (currentCol < WORD_LENGTH) {
    const tile = getTile(currentRow, currentCol);
    tile.textContent = key;
    tile.classList.add("filled");
    currentGuess += key;
    currentCol++;
  }
}

async function submitGuess() {
  isRevealing = true;
  try {
    const res = await fetch("/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, guess: currentGuess })
    });
    const data = await res.json();

    if (data.error) {
      showMessage(data.error);
      shakeRow(currentRow);
      isRevealing = false;
      return;
    }

    // Reveal tiles with staggered animation
    const result = data.result;
    const STAGGER = 150;
    const COLOR_DELAY = 160;
    for (let i = 0; i < WORD_LENGTH; i++) {
      const tile = getTile(currentRow, i);
      setTimeout(() => {
        tile.classList.add("reveal");
        setTimeout(() => {
          tile.classList.add(result[i].status);
          updateKeyStatus(result[i].letter, result[i].status);
        }, COLOR_DELAY);
      }, STAGGER * i);
    }

    await delay(STAGGER * (WORD_LENGTH - 1) + COLOR_DELAY + 200);

    if (data.status === "won") {
      const msgs = ["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"];
      showMessage(msgs[currentRow] || "Nice!", 0);
      gameOver = true;
      newGameBtn.style.display = "block";
    } else if (data.status === "lost") {
      showMessage(data.answer, 0);
      gameOver = true;
      newGameBtn.style.display = "block";
    }

    currentRow++;
    currentCol = 0;
    currentGuess = "";
  } catch (err) {
    showMessage("Network error");
  }
  isRevealing = false;
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function applyTileInstant(row, col, letter, status) {
  const tile = getTile(row, col);
  tile.textContent = letter;
  tile.classList.add("filled", status);
}

function updateKeyStatus(letter, status) {
  const priority = { correct: 3, present: 2, absent: 1 };
  const prev = keyStatus[letter];
  if (!prev || priority[status] > priority[prev]) {
    keyStatus[letter] = status;
    const keyBtn = keyboardEl.querySelector(\`[data-key="\${letter}"]\`);
    if (keyBtn) keyBtn.className = "key " + status;
  }
}

async function restoreGame(id) {
  try {
    const res = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: id })
    });
    const data = await res.json();
    if (data.error) return false;

    gameId = id;
    data.history.forEach((entry, r) => {
      for (let c = 0; c < WORD_LENGTH; c++) {
        applyTileInstant(r, c, entry.result[c].letter, entry.result[c].status);
        updateKeyStatus(entry.result[c].letter, entry.result[c].status);
      }
    });
    currentRow = data.history.length;

    if (data.status === "won") {
      const msgs = ["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"];
      showMessage(msgs[currentRow - 1] || "Nice!", 0);
      gameOver = true;
      newGameBtn.style.display = "block";
    } else if (data.status === "lost") {
      showMessage(data.answer, 0);
      gameOver = true;
      newGameBtn.style.display = "block";
    }
    return true;
  } catch {
    return false;
  }
}

function resetBoard() {
  for (let r = 0; r < MAX_GUESSES; r++) {
    for (let c = 0; c < WORD_LENGTH; c++) {
      const tile = getTile(r, c);
      tile.textContent = "";
      tile.className = "tile";
    }
  }
  document.querySelectorAll(".key").forEach(k => {
    if (!k.classList.contains("wide")) k.className = "key";
    else k.className = "key wide";
  });
  Object.keys(keyStatus).forEach(k => delete keyStatus[k]);
  currentRow = 0;
  currentCol = 0;
  currentGuess = "";
  gameOver = false;
  isRevealing = false;
  messageEl.textContent = "";
  newGameBtn.style.display = "none";
}

newGameBtn.addEventListener("click", async () => {
  resetBoard();
  await newGame();
});

async function startGame() {
  const saved = localStorage.getItem("wordle_gameId");
  if (saved) {
    const restored = await restoreGame(saved);
    if (restored) return;
  }
  await newGame();
}

async function newGame() {
  const res = await fetch("/api/new", { method: "POST" });
  const data = await res.json();
  gameId = data.gameId;
  localStorage.setItem("wordle_gameId", gameId);
}

startGame();
</script>
</body>
</html>`;

// --- Server ---
console.log("Starting Wordle server...");
const listener = BunnySDK.net.tcp.unstable_new();
console.log("Listening on:", BunnySDK.net.tcp.toString(listener));

BunnySDK.net.http.serve(
  async (req: Request) => {
    console.log(`[INFO]: ${req.method} ${new URL(req.url).pathname}`);
    return handleRequest(req);
  },
);
