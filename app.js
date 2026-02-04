/* ===============================
   GLOBAL STATE
================================ */

let articles = [];          // current learning dataset
let allArticles = [];       // FR + DPSP + Duties (for quiz)
let index = 0;              // article index
let isDark = false;         // dark / light mode

const app = document.getElementById("app");
const searchInput = document.getElementById("searchInput");

/* ===============================
   DARK / LIGHT MODE
================================ */

function toggleMode(){
  isDark = !isDark;
  document.body.classList.toggle("dark", isDark);
}

/* ===============================
   TAB HIGHLIGHT HANDLER
================================ */

function setTab(tabId){
  document
    .querySelectorAll(".bottom-tabs button")
    .forEach(btn => btn.classList.remove("active"));

  const tab = document.getElementById(tabId);
  if(tab) tab.classList.add("active");
}

/* ===============================
   LOAD DATASETS
================================ */

function loadFR(){
  articles = articlesFR;
  index = 0;
  setTab("tab-fr");
  renderArticle();
}

function loadDPSP(){
  articles = articlesDPSP;
  index = 0;
  setTab("tab-dpsp");
  renderArticle();
}

function loadDuties(){
  articles = articlesDuties;
  index = 0;
  setTab("tab-duties");
  renderArticle();
}

/* ===============================
   SEARCH ARTICLE
================================ */

function searchArticle(){
  const value = searchInput.value.trim().toLowerCase();
  if(!value) return;

  const foundIndex = articles.findIndex(a =>
    a.no.toLowerCase().includes(value)
  );

  if(foundIndex !== -1){
    index = foundIndex;
    renderArticle();
  }
}

/* ===============================
   RENDER ARTICLE CARD
================================ */

function renderArticle(){
  if(!articles || articles.length === 0){
    app.innerHTML = "<p>No articles available.</p>";
    return;
  }

  const a = articles[index];
  const progress = Math.round(((index + 1) / articles.length) * 100);

  app.innerHTML = `
    <div class="card">

      <div class="progress">
        <div class="progress-bar" style="width:${progress}%"></div>
      </div>

      <h2>${a.no} – ${a.title}</h2>

      <p><b>🧠 Logic:</b> ${a.logic}</p>
      <p><b>📘 Meaning:</b> ${a.meaning}</p>
      <p><b>🌍 Example:</b> ${a.example}</p>

      <div class="controls">
        <button onclick="prevArticle()">⬅ Prev</button>
        <button onclick="nextArticle()">Next ➡</button>
      </div>

      <p class="counter">${index + 1} / ${articles.length}</p>
    </div>
  `;
}

/* ===============================
   ARTICLE NAVIGATION
================================ */

function nextArticle(){
  if(index < articles.length - 1){
    index++;
    renderArticle();
  }
}

function prevArticle(){
  if(index > 0){
    index--;
    renderArticle();
  }
}

/* ===============================
   QUIZ LOGIC (FINAL)
================================ */

let quizScore = 0;
let quizTotal = 0;

function loadQuiz(){
  setTab("tab-quiz");

  // combine all articles for quiz
  allArticles = [
    ...articlesFR,
    ...articlesDPSP,
    ...articlesDuties
  ];

  quizScore = 0;
  quizTotal = 0;

  renderQuizQuestion();
}

function renderQuizQuestion(){
  const article =
    allArticles[Math.floor(Math.random() * allArticles.length)];

  const situation =
    article.situations[
      Math.floor(Math.random() * article.situations.length)
    ];

  // generate smart options (article numbers)
  let options = allArticles
    .map(a => a.no)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  if(!options.includes(article.no)){
    options[0] = article.no;
    options.sort(() => 0.5 - Math.random());
  }

  quizTotal++;

  app.innerHTML = `
    <div class="card">
      <h2>🧠 Quiz</h2>

      <p><b>Situation:</b><br>${situation}</p>

      <select id="quizAnswer">
        <option value="">-- Select Correct Article --</option>
        ${options.map(o => `<option value="${o}">${o}</option>`).join("")}
      </select>

      <button onclick="submitQuiz('${article.no}')">
        Submit Answer
      </button>

      <p style="margin-top:0.6rem;">
        Score: <b>${quizScore}/${quizTotal - 1}</b>
      </p>
    </div>
  `;
}

function submitQuiz(correct){
  const userAnswer = document.getElementById("quizAnswer").value;

  if(!userAnswer){
    alert("⚠️ Please select an article");
    return;
  }

  if(userAnswer === correct){
    quizScore++;
    alert("✅ Correct Answer!");
  }else{
    alert(`❌ Wrong Answer!\nCorrect: ${correct}`);
  }

  renderQuizQuestion();
}

/* ===============================
   INITIAL LOAD
================================ */

loadFR();
