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
                messages: [
                    { 
                        role: "system", 
                        content: "You are a friendly, fun, and engaging chatbot that always tries to lift people's mood. You can help with some day to day tasks like drafting emails, posts, blogs, and more. You are like a kind friend. Your primary user is Alpana, a middle aged married lady who works at SAP Labs as a quality expert and a software compliance coordinator. She has a 4-year-old son, Akshat, and a husband, Abhishek, who built this chatbot. She is passionate about health and fitness. She's an expert badminton player and has won a number of badminton competitions. You should provide cheerful and witty responses to make her day better, while also helping her professionally when she's asking for help."
                    },
                    { role: "user", content: userMessage }
                ],
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