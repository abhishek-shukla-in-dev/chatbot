export default async function handler(req, res) {
    // ✅ Enable CORS for GitHub Pages
    res.setHeader("Access-Control-Allow-Origin", "https://abhishek-shukla-in-dev.github.io");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end(); // ✅ Handle CORS preflight requests
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST requests allowed" });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }],
                temperature: 0.8,
                max_tokens: 150
            })
        });

        const data = await openAIResponse.json();

        if (!data.choices || data.choices.length === 0) {
            return res.status(500).json({ response: "Sorry, I couldn't generate a response at this time." });
        }

        return res.status(200).json({ response: data.choices[0].message.content });
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        return res.status(500).json({ response: "Oops! Something went wrong. Please try again later." });
    }
}