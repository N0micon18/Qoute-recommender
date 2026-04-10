const QUOTE_APIS = [
  "https://api.quotable.io/random",
  "https://dummyjson.com/quotes/random",
];
const REQUEST_TIMEOUT_MS = 8000;
const LOCAL_FALLBACK_QUOTES = [
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
];

let currentQuote = { text: "", author: "" };
let copyResetTimerId = null;

const spinner = document.getElementById("spinner");
const errorBox = document.getElementById("error-box");
const errorMessage = document.getElementById("error-message");
const quoteContent = document.getElementById("quote-content");
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const buttons = document.getElementById("buttons");
const newQuoteBtn = document.getElementById("new-quote-btn");
const copyBtn = document.getElementById("copy-btn");
const downloadBtn = document.getElementById("download-btn");
const retryBtn = document.getElementById("retry-btn");

async function fetchQuote() {
  spinner.classList.remove("hidden");
  errorBox.classList.add("hidden");
  quoteContent.classList.add("hidden");
  buttons.classList.add("hidden");

  try {
    currentQuote = await getQuoteFromAvailableApi();
    displayQuote();
  } catch (error) {
    currentQuote = getLocalFallbackQuote();
    displayQuote();
  } finally {
    spinner.classList.add("hidden");
  }
}

async function getQuoteFromAvailableApi() {
  for (const apiUrl of QUOTE_APIS) {
    try {
      const response = await fetchWithTimeout(apiUrl, REQUEST_TIMEOUT_MS);
      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      if (typeof data.content === "string" && typeof data.author === "string") {
        return {
          text: data.content,
          author: data.author || "Unknown",
        };
      }

      if (typeof data.quote === "string" && typeof data.author === "string") {
        return {
          text: data.quote,
          author: data.author || "Unknown",
        };
      }
    } catch (error) {
      continue;
    }
  }

  throw new Error("No quote API available");
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function getLocalFallbackQuote() {
  const index = Math.floor(Math.random() * LOCAL_FALLBACK_QUOTES.length);
  return LOCAL_FALLBACK_QUOTES[index];
}

function displayQuote() {
  errorBox.classList.add("hidden");
  buttons.classList.remove("hidden");
  quoteContent.classList.remove("hidden");

  const applyQuote = () => {
    quoteText.innerText = currentQuote.text;
    quoteAuthor.innerText = `— ${currentQuote.author}`;
    quoteContent.style.opacity = "1";
  };

  if (!quoteText.innerText.trim()) {
    applyQuote();
    return;
  }

  quoteContent.style.opacity = "0";
  const onFadeOutEnd = () => {
    quoteContent.removeEventListener("transitionend", onFadeOutEnd);
    applyQuote();
  };
  quoteContent.addEventListener("transitionend", onFadeOutEnd);
}

function showError(message) {
  spinner.classList.add("hidden");
  quoteContent.classList.add("hidden");
  buttons.classList.add("hidden");
  errorMessage.innerText = message;
  errorBox.classList.remove("hidden");
}

async function copyQuote() {
  const textToCopy = `"${currentQuote.text}" — ${currentQuote.author}`;
  try {
    await copyToClipboard(textToCopy);
    copyBtn.innerText = "Copied! ✓";
    copyBtn.classList.add("copied");
  } catch (error) {
    copyBtn.innerText = "Copy failed";
    copyBtn.classList.remove("copied");
  }

  if (copyResetTimerId !== null) {
    window.clearTimeout(copyResetTimerId);
  }

  copyResetTimerId = window.setTimeout(() => {
    copyBtn.innerText = "📋 Copy";
    copyBtn.classList.remove("copied");
    copyResetTimerId = null;
  }, 2000);
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  textArea.setSelectionRange(0, textArea.value.length);

  const success = document.execCommand("copy");
  textArea.remove();

  if (!success) {
    throw new Error("Clipboard copy not supported");
  }
}

function downloadQuote() {
  const content = `"${currentQuote.text}" — ${currentQuote.author}`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "quote.txt";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

newQuoteBtn.addEventListener("click", fetchQuote);
copyBtn.addEventListener("click", copyQuote);
downloadBtn.addEventListener("click", downloadQuote);
retryBtn.addEventListener("click", fetchQuote);
window.addEventListener("load", fetchQuote);
