export async function refineText(content, instruction) {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("Missing API key");
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin, 
        "X-Title": "Anchor"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a professional text refinement assistant.
- Improve grammar, clarity, and tone
- Follow user instruction strictly
- Do NOT add explanations
- Preserve original meaning`
          },
          {
            role: "user",
            content: `Instruction: ${instruction}\nText: ${content}`
          }
        ]
      })
    });

    // 🔥 Get raw response text first
    const raw = await res.text();

    if (!res.ok) {
      console.error("❌ OpenRouter Error:", raw);
      throw new Error("API response not ok");
    }

    const data = JSON.parse(raw);

    if (!data?.choices?.[0]?.message?.content) {
      console.error("❌ Invalid format:", data);
      throw new Error("Invalid response format");
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error("Refinement Error:", error);
    return "Oops, I am finding difficulty while refining. Please try after some time.";
  }
}