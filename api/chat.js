export default async function handler(req, res) {
    // 1️⃣ ✅ Constants & Configuration
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const allowedOrigins = new Set([
        "https://abhishek-shukla-in-dev.github.io",
        "http://localhost:3000"
    ]);

    // 2️⃣ ✅ CORS Handling
    if (allowedOrigins.has(req.headers.origin)) {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // ✅ Handle CORS Preflight Requests
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // 3️⃣ ✅ Request Validation
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST requests allowed" });
    }

    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    // 4️⃣ ✅ Chat History Management
    const chatHistory = req.body.history || [];
    chatHistory.push({ role: "user", content: userMessage });

    if (chatHistory.length > 5) {
        chatHistory.splice(0, chatHistory.length - 5);
    }

    // 5️⃣ ✅ OpenAI API Request
    const messages = chatHistory.length > 0 ? [
        ...chatHistory,
        { role: "user", content: userMessage }
    ] : [
        { role: "system", content: "You are a friendly and engaging chatbot that assists Alpana, a software professional, a caring mother to Akshat, a 4-year-old son, and a loving wife to Abhishek. Alpana is passionate about health and fitness. You are like a funny, kind, supportive friend who balances positivity with practical help." },
        { role: "user", content: userMessage }
    ];

    try {
        const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: messages,
                temperature: 0.7,
                max_tokens: 100
            })
        });

        if (!openAIResponse.ok) {
            throw new Error(`OpenAI API Error: ${openAIResponse.status} ${openAIResponse.statusText}`);
        }

        const data = await openAIResponse.json();
        if (!data.choices || data.choices.length === 0) {
            throw new Error("Empty response from OpenAI");
        }

        return res.status(200).json({ response: data.choices[0].message.content });

    } catch (error) {
        console.error("Error communicating with OpenAI:", error);

        let errorMessage = "Oops! Something went wrong. Please try again later.";
        if (error.message.includes("429")) errorMessage = "Too many requests! Please wait and try again.";
        if (error.message.includes("401")) errorMessage = "Invalid API Key. Please check the configuration.";
        if (error.message.includes("500")) errorMessage = "Server error. Please try again later.";

        return res.status(500).json({ response: errorMessage });
    }
}