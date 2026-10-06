# Prompts.md — AI-Assisted Debugging Log (Sprint 9: Next.js Migration)

This document records where I used an AI assistant (Claude) to debug issues and understand concepts while migrating Cine-Stream from a Vite/React SPA to Next.js with the App Router.

---

## 1. Understanding Server vs Client Components

Going into this sprint, I didn't have a clear picture of how Server and Client Components actually split up in the App Router — I initially put `"use client"` at the top of my entire `page.js` file, which technically worked but defeated the purpose of the migration (nothing was actually server-rendered).

I had it explained to me that the real pattern is: keep `page.js` as a plain `async` Server Component that does the initial data fetch directly with `await`, no `useEffect`, and move all the interactive logic (state, event handlers, hooks) into a separate component that *does* carry `"use client"`. I restructured the app into `src/app/page.js` (Server Component, fetches popular movies) and `src/components/HomeClient.jsx` (Client Component, holds search/favorites/infinite-scroll/mood-matcher logic), with the server-fetched data passed down as props.

---

## 2. Hydration Mismatch — Favorites from localStorage

**Issue:** After splitting into Server/Client components, the console threw a hydration error: "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties."

**Root cause:** My `favorites` state used a lazy `useState` initializer that read `localStorage` immediately:
```js
const [favorites, setFavorites] = useState(() => {
  const stored = localStorage.getItem("favorites");
  return stored ? JSON.parse(stored) : [];
});
```
On the server, `localStorage` doesn't exist, so the server always rendered as if there were zero favorites. On the client, if I actually had saved favorites, the initializer picked them up immediately — so the favorite heart icon on at least one card didn't match between what the server sent and what the client rendered.

**Fix:** Changed `favorites` to always start as `[]` on both server and client, and moved the `localStorage` read into a `useEffect` with an empty dependency array, so it only runs after the component has mounted in the browser:
```js
const [favorites, setFavorites] = useState([]);

useEffect(() => {
  const stored = localStorage.getItem("favorites");
  if (stored) setFavorites(JSON.parse(stored));
}, []);
```

---

## 3. Hydration Mismatch — Multi-line className Strings

**Issue:** Even after fixing the favorites issue, the same hydration error kept appearing intermittently, pointing at `MovieCard`.

**Root cause:** I had written several `className` strings across multiple lines inside the JSX for readability, e.g.:
```jsx
<div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg
overflow-hidden shadow-lg">
```
This embeds a literal newline character inside the string. The server and client apparently normalized that newline slightly differently (`\r\n` vs `\n\n` showed up in the diff Next.js printed), so the className strings didn't match exactly even though they looked identical.

**Fix:** Went through every component rendered on the first page load (`Navbar`, `SearchBar`, `MovieGrid`, `MovieCard`, `MoodMatcher`) and collapsed every multi-line `className` onto a single line. This fully resolved the hydration error.

**Takeaway:** This was a subtle one — the two class strings were visually identical in the error message, so I had to look closely at the whitespace characters themselves to figure out they weren't actually the same string.

---

## 4. Dynamic Routes and generateMetadata

I hadn't worked with dynamic segments (`[id]`) or `generateMetadata` before. Had it explained that:
- A folder named `[id]` under `app/movie/` creates a route like `/movie/123`, and the `id` is available via the `params` prop.
- `generateMetadata` is a special async function Next.js calls on the server before rendering, and whatever `title`/`description` it returns gets injected into the page's `<head>` — which is how I was able to give each movie its own SEO title/description without writing any manual `<head>` manipulation.

I used this to build `src/app/movie/[id]/page.js`, which fetches a single movie's details server-side and renders a detail page, along with a `getMovieDetails()` function added to `tmdb.js`.

---

## Reflections

This sprint was less about new features and more about understanding a different rendering model than what I'd worked with before. The hydration errors in particular forced me to actually understand what "server rendering" means in practice — that the server and the client both produce HTML independently and React expects them to match exactly, down to whitespace. That's not something I'd have appreciated by just reading about Server/Client Components in the abstract; debugging the mismatches myself is what made it click.

