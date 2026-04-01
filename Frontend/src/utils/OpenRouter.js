export async function refineText(content, instruction) {
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
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
                        - Preserve original meaning`,
                    },
                    {
                        role: "user",
                        content: `Instruction: ${instruction}\nText: ${content}`,
                    },
                ],
            }),
        });

        if (!res.ok) throw new Error("API response not ok");

        const data = await res.json();

        if (!data?.choices?.[0]?.message?.content) {
            throw new Error("Invalid response format");
        }

        return data.choices[0].message.content;

    } catch (error) {
        console.error("Refinement Error:", error);
        return "Oops, try again later.";
    }
}

// const ans = refineText("hi i am abhishek ihjbkb/..oij","");
// console.log(ans);