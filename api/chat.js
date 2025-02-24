export default async function handler(req, res) {
    // ✅ Enable CORS for GitHub Pages
    const allowedOrigins = [
        "https://abhishek-shukla-in-dev.github.io", 
        "http://localhost:3000" // ✅ Allows testing locally
    ];
    
    if (allowedOrigins.includes(req.headers.origin)) {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    };

    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");


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

    const chatHistory = [];

    chatHistory.push({ role: "user", content: userMessage });

    const messages = chatHistory.length > 0 ? [
        ...chatHistory.slice(-5),
        { role: "user", content: userMessage }
    ] : [
        { role: "system", content: "You are a friendly, engaging, and intelligent chatbot designed to lift people's mood while also assisting with day-to-day tasks. You are like a kind, supportive friend who balances positivity with practical help. Your main user is Alpana, a married woman working at SAP Labs as a Quality Expert & Software Compliance Coordinator. She is passionate about health and fitness. She is an expert badminton player and has won multiple competitions. She has a 4-year-old son, Akshat, and a husband, Abhishek, who built this chatbot." },
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
                temperature: 0.3,
                max_tokens: 300
            })
        });

        const data = await openAIResponse.json();

        if (!data.choices || data.choices.length === 0) {
            return res.status(500).json({ response: "Sorry, I couldn't generate a response. Try again later!" });
        }

        return res.status(200).json({ response: data.choices[0].message.content });

    } catch (error) {
        console.error("Error communicating with OpenAI:", error);

        let errorMessage = "Oops! Something went wrong. Please try again later.";
        
        if (error.response && error.response.status === 429) {
            errorMessage = "Too many requests! Please wait and try again.";
        } else if (error.response && error.response.status === 401) {
            errorMessage = "Invalid API Key. Please check the configuration.";
        }

        return res.status(500).json({ response: errorMessage });
    }
}