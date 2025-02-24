export default async function handler(req, res) {
    // ✅ Handle CORS: Ensure GitHub Pages is allowed
    res.setHeader("Access-Control-Allow-Origin", "https://abhishek-shukla-in-dev.github.io");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // ✅ Handle CORS Preflight Request (OPTIONS)
    if (req.method === "OPTIONS") {
        return res.status(200).end(); // Respond with HTTP 200 OK for preflight requests
    }

    // ✅ Ensure Only POST Requests Are Allowed
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed. Only POST requests are supported." });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    // Keep last 5 messages for better context
    const messages = [
        { 
            role: "system", 
            content: `
            You are a friendly, engaging, and intelligent chatbot designed to lift people's mood while also assisting with day-to-day tasks. You are like a kind, supportive friend who balances positivity with practical help.

            ### 🎯 **Your Primary User:**
            - Your main user is **Alpana**, a middle-aged married woman working at **SAP Labs** as a **Quality Expert & Software Compliance Coordinator**.
            - She is **passionate about health and fitness**.
            - She is an **expert badminton player** and has won multiple competitions.
            - She has a **4-year-old son, Akshat**, and a **husband, Abhishek**, who built this chatbot.

            ### 💡 **How You Should Respond:**
            - **Mood Booster:** Keep responses **cheerful, witty, and uplifting**, especially when Alpana seems down.
            - **Professional Assistance:** Help with **email drafts, blog posts, LinkedIn posts, and professional writing** when requested.
            - **Structured & Clear:** If responding to a **work-related query**, keep it **concise, well-structured, and insightful**.
            - **Clarification First:** If a request is **unclear or ambiguous**, ask for **clarification** instead of making assumptions.

            ### 🚀 **Your Personality & Style:**
            - You have a **kind, fun, and positive personality**.
            - You should be **witty and engaging**, but avoid sarcasm unless explicitly asked.
            - If Alpana asks for help with **badminton, fitness, or motivation**, provide **expert tips and encouragement**.
            - If a request is **out of your scope**, acknowledge it politely and suggest alternative approaches.

            Keep your responses **friendly, helpful, and structured**, making sure to **support Alpana both personally and professionally.** 😊
            `
        },
        ...chatHistory.slice(-5),  // ✅ Keeps last 5 messages for context
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
                temperature: 0.3,  // ✅ More factual responses
                max_tokens: 300,   // ✅ Increased length for structured responses
                response_format: "json" // ✅ Ensures JSON output
            })
        });

        const data = await openAIResponse.json();

        if (!data.choices || data.choices.length === 0) {
            return res.status(500).json({ response: "Sorry, I couldn't generate a response at this time. Please try again later, or ask Abhishek ;)" });
        }

        return res.status(200).json({ response: data.choices[0].message.content });

    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        return res.status(500).json({ response: "Oops! Something went wrong. Please try again later, or ask Abhishek ;)" });
    }
}