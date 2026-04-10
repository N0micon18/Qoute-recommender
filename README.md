# Random Quote Generator

A polished random quote website built with pure HTML, CSS, and Vanilla JavaScript.

## Features

- Fetches a fresh quote and author from `https://api.quotable.io/random` with automatic fallback if unavailable
- Loads a new quote on page load and on **New Quote**
- Smooth fade transition when the quote updates
- Copy the current quote to clipboard with visual **Copied! ✓** feedback
- Download the current quote as `quote.txt`
- Loading spinner while quotes are fetched
- Friendly error message with a **Try Again** action if API requests fail
- Responsive design for desktop and mobile

## Project Files

- `index.html` - page structure
- `style.css` - styling, animations, responsive layout
- `app.js` - API fetch, copy, download, and UI state logic

## Run

1. Open `index.html` directly in a browser.
2. Or run a local server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.
