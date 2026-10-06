 const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const getMoodBasedMovie = async (moodText) => {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Based on this mood/feeling: "${moodText}", suggest exactly ONE real movie title that fits. Reply with ONLY the movie title, nothing else — no explanation, no quotes, no extra text.`,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to get mood-based suggestion");

  const data = await res.json();
  const title = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!title) throw new Error("No movie suggestion received");
  return title;
};
  