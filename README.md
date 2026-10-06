# 🎬 Cine-Stream (Next.js Edition)

A movie discovery web app built with Next.js 15 (App Router), migrated from an earlier Vite + React SPA. Built as part of Sprint 9 of my Software Developer Internship at Prodesk IT, focused on moving a client-rendered app to a server-rendered architecture for better SEO and performance.

**Live Demo:** [add your deployed link here]
**GitHub Repo:** [add your repo link here]

---

## ✨ Features

- **Popular Movies Grid** — Server-rendered on initial load, fetched directly from TMDB with no client-side loading flash.
- **Debounced Search** — Search movies by title with a 500ms debounce.
- **Infinite Scroll** — Loads more movies as you scroll, using the Intersection Observer API.
- **Favorites** — Save movies to a personal favorites list, persisted in `localStorage`.
- **Movie Detail Pages** — Each movie has its own dynamic route (`/movie/[id]`) with full details and dynamically generated SEO metadata (title + description per movie).
- **Dark / Light Mode** — Toggle between themes.
- **Responsive Design** — Works across mobile, tablet, and desktop.
- **🎭 Mood Matcher (AI-powered)** — Describe your mood and get a movie suggestion, powered by the Gemini API and cross-referenced against TMDB.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15/16 (App Router)
- **Styling:** Tailwind CSS
- **APIs:** TMDB API for movie data, Google Gemini API for mood-based suggestions
- **Persistence:** Browser `localStorage` for favorites

---

## 📂 Project Structure

```
cine-stream-next/
├── src/
│   ├── app/
│   │   ├── page.js               # Server Component — fetches popular movies on the server
│   │   ├── movie/[id]/page.js     # Dynamic movie detail route with generateMetadata
│   │   └── layout.js
│   ├── components/
│   │   ├── HomeClient.jsx         # Client Component — all interactive state/logic
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieGrid.jsx
│   │   └── MoodMatcher.jsx
│   └── api/
│       ├── tmdb.js
│       └── gemini.js
└── README.md
```

---

## 🧠 Why Next.js? What Changed From the Original Version

The original version of this app (built with Vite + React) was a single-page application — fully client-rendered, meaning all data fetching happened in the browser *after* the page had already loaded. That created two problems: search engines had a harder time indexing the content (since there was nothing in the initial HTML), and there was always a brief loading flash on first visit.

This Next.js version restructures the app around that problem:

- **Server Component for the initial load.** `src/app/page.js` is now a plain `async` function that fetches the first page of popular movies directly on the server using `await`, with no `useEffect` involved. The HTML sent to the browser already contains real movie data, not a loading spinner.
- **Client Component for everything interactive.** `src/components/HomeClient.jsx` receives that server-fetched data as props and takes over from there — search, infinite scroll, favorites, and the mood matcher all still work exactly as before, just now layered on top of a server-rendered starting point.
- **Per-movie SEO.** Each movie now has its own route at `/movie/[id]`, generated dynamically, with a unique page `<title>` and `<meta description>` built from that movie's own data via Next.js's `generateMetadata` function — something the single-page Vite version had no way of doing, since it only ever had one static title for the whole app.
- **File-based routing.** `react-router-dom` (used in the Vite version) was dropped entirely in favor of Next.js's folder-based routing (`app/movie/[id]/page.js`), and the favorites route that was planned but never finished in the original SPA is a natural next addition here since each route is just a folder.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A TMDB API key
- A Google Gemini API key

### Installation

1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd cine-stream-next
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

