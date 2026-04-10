# SYSTEM-DESIGN.md
# Random Quote Generator Website (Vanilla JavaScript + Live API)

---

## Problem Statement

A beautiful, interactive website built with pure HTML, CSS, and JavaScript that fetches a fresh random quote from a live API every time the page loads or the user clicks a button. Users can copy any quote to their clipboard or download it as a `.txt` file with one click. The quote supply is infinite — no two sessions need ever show the same quote.

This app is for students, professionals, or anyone looking for a quick burst of inspiration or humor. It solves the problem of needing a fast, no-login, no-setup source of uplifting quotes — wrapped in a polished, modern UI.

---

## Requirements

### Functional
- [ ] Feature 1: Fetch and display a random quote (text + author) on page load from `quotable.io`
- [ ] Feature 2: "New Quote" button that fetches a brand new quote with a smooth fade animation
- [ ] Feature 3: "Copy to Clipboard" button that copies the current quote and author
- [ ] Feature 4: Show a brief visual confirmation (e.g., "Copied! ✓") after copying
- [ ] Feature 5: "Download" button that saves the current quote as a `.txt` file to the user's device
- [ ] Feature 6: Show a loading spinner while the API is fetching a new quote
- [ ] Feature 7: Show a friendly error message if the API call fails, with a "Try Again" button

### Non-Functional
- Language: HTML5, CSS3, Vanilla JavaScript (ES6+)
- No frameworks, no libraries, no npm
- Data Source: `https://api.quotable.io/random` (free, no API key required)
- Must run locally by opening `index.html` in any browser
- Or run with: `python -m http.server 8080`

---

## Architecture & Tech Stack

## Tech Stack

| Layer       | Choice                              |
|-------------|-------------------------------------|
| Markup      | HTML5                               |
| Styling     | CSS3 (Flexbox, animations, blur)    |
| Logic       | Vanilla JavaScript (ES6+)           |
| Data Source | quotable.io REST API (free, public) |
| Build Tool  | None — open `index.html` directly   |

## Project Structure

```
random-quote-generator/
├── index.html       # Full page structure and UI layout
├── style.css        # All styling, animations, and responsive design
├── app.js           # All JavaScript logic (fetch, copy, download, UI)
└── README.md        # How to run the project
```

---

## Data Model

### API Response from `https://api.quotable.io/random`

```json
{
  "_id": "abc123",
  "content": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs",
  "tags": ["inspirational", "work"],
  "length": 54
}
```

### Fields used by the app
- `content` → displayed as the quote text
- `author` → displayed as the quote author

---

## HTML Structure (`index.html`)

```html
<body>
  <div class="background">
    <div class="card" id="quote-card">

      <!-- Loading Spinner -->
      <div class="spinner" id="spinner"></div>

      <!-- Error State -->
      <div class="error hidden" id="error-box">
        <p id="error-message">Failed to load quote.</p>
        <button id="retry-btn">Try Again</button>
      </div>

      <!-- Quote Display -->
      <div class="quote-content" id="quote-content">
        <span class="decorative-quote">"</span>
        <p class="quote-text" id="quote-text"></p>
        <p class="quote-author" id="quote-author"></p>
      </div>

      <!-- Action Buttons -->
      <div class="buttons" id="buttons">
        <button id="new-quote-btn">🔄 New Quote</button>
        <button id="copy-btn">📋 Copy</button>
        <button id="download-btn">⬇️ Download</button>
      </div>

    </div>
  </div>
</body>
```

---

## JavaScript Contracts (`app.js`)

### `fetchQuote()`
- Called on page load and when "New Quote" is clicked
- Shows spinner, hides quote content and error box
- Calls `GET https://api.quotable.io/random`
- On success:
  - Stores `currentQuote = { text: data.content, author: data.author }`
  - Calls `displayQuote()` to update the DOM
- On failure:
  - Calls `showError("Failed to load quote. Please try again.")`
- Always hides spinner when done

### `displayQuote()`
- Fades out `#quote-content` (opacity 0)
- After fade-out transition ends:
  - Sets `#quote-text` innerText to `currentQuote.text`
  - Sets `#quote-author` innerText to `— ${currentQuote.author}`
  - Fades `#quote-content` back in (opacity 1)
- Hides error box, shows buttons

### `showError(message)`
- Hides spinner and quote content
- Sets `#error-message` innerText to `message`
- Shows `#error-box`

### `copyQuote()`
- Builds string: `"${currentQuote.text}" — ${currentQuote.author}`
- Calls `navigator.clipboard.writeText(string)`
- Changes `#copy-btn` text to `"Copied! ✓"`
- Resets button text back to `"📋 Copy"` after 2000ms

### `downloadQuote()`
- Builds string: `"${currentQuote.text}" — ${currentQuote.author}`
- Creates a `Blob` with `type: 'text/plain'`
- Creates a temporary `<a>` element with `href = URL.createObjectURL(blob)`
- Sets `download = "quote.txt"`
- Programmatically clicks the `<a>` to trigger download
- Revokes the object URL and removes the element after download

### Event Listeners
```javascript
document.getElementById('new-quote-btn').addEventListener('click', fetchQuote);
document.getElementById('copy-btn').addEventListener('click', copyQuote);
document.getElementById('download-btn').addEventListener('click', downloadQuote);
document.getElementById('retry-btn').addEventListener('click', fetchQuote);
window.addEventListener('load', fetchQuote);
```

---

## CSS Design Notes (`style.css`)

- **Background**: Full-screen gradient (deep purple → indigo → blue) using `linear-gradient`
- **Card**: Centered with Flexbox, frosted glass effect using `backdrop-filter: blur(16px)`, semi-transparent white border
- **Quote text**: Large italic font, white color, centered
- **Author**: Smaller text, light purple tint, preceded by em dash
- **Buttons**: Rounded pill shape (`border-radius: 50px`), distinct colors:
  - New Quote → indigo/purple
  - Copy → teal (turns green on "Copied!")
  - Download → pink/rose
- **Spinner**: CSS-only animated circle using `@keyframes spin` and `border-top` trick
- **Fade animation**: CSS `transition: opacity 0.4s ease` on `#quote-content`
- **Responsive**: Media query at 480px for mobile — smaller font, stacked buttons
- **Hidden utility class**: `.hidden { display: none; }`

---

## Testing Plan

### Manual Tests (run in browser)

- [ ] Page loads and displays a quote automatically (no blank screen)
- [ ] Loading spinner appears while fetching
- [ ] Quote displays correctly after fetch (text + author)
- [ ] "New Quote" button fetches and shows a brand new quote
- [ ] Fade animation plays smoothly on each new quote
- [ ] Loading spinner shows again while fetching new quote
- [ ] "Copy" button copies the full quote + author to clipboard
- [ ] "Copied! ✓" confirmation appears and resets after 2 seconds
- [ ] "Download" button saves a `.txt` file to the device
- [ ] Downloaded file contains the correct quote text and author
- [ ] Error message appears if internet is disconnected
- [ ] "Try Again" button retries the fetch successfully
- [ ] App is responsive on mobile screen sizes
- [ ] No console errors on load or interaction

### How to Run

```bash
# Option 1: Open directly in browser
Just double-click index.html

# Option 2: Local server (recommended to avoid CORS issues)
python -m http.server 8080
# Then open http://localhost:8080
```

---

## Review Checklist

- [ ] App starts without errors (no console errors on load)
- [ ] All 7 features are implemented and working
- [ ] API fetch works and displays real quotes from quotable.io
- [ ] Loading spinner shows during fetch
- [ ] Error state handled gracefully with retry option
- [ ] Fade animation plays on quote change
- [ ] Clipboard copy works and shows confirmation
- [ ] Download saves a properly formatted `.txt` file
- [ ] UI is polished — gradient background, frosted glass card, styled buttons
- [ ] Project structure matches the design (3 files only: index.html, style.css, app.js)
- [ ] No frameworks or libraries used — pure HTML/CSS/JS only
- [ ] App is responsive on mobile
