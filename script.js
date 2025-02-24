
// ✅ Fetch OpenAI Response via Secure Vercel Backend
async function fetchOpenAIResponse() {
    const API_URL = "https://chatbot-xi-cyan.vercel.app/"; // Replace with your actual Vercel deployment URL

    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a friendly and fun chatbot that loves to engage users with positive and witty responses. You try to help people get out of a bad mood. The name of your primary user is Alpana. She is a 40-year-old married lady. She is a caring mother of her son, Akshat, a 4-year-old boy. Abhishek, her husband, is the developer of this chatbot. Alpana works for SAP Labs as a quality expert and security compliance coordinator." },
                    ...chatHistory // Pass only the last 10 messages
                ],
                temperature: 0.8,
                max_tokens: 150
            })
        });

        let data = await response.json();
        return data.response || "Hmm, I'm not sure how to respond to that. I'll try better the nest time. Can you ask me something else? Or, check with Abhishek ;)";
    } catch (error) {
        console.error("Error fetching response:", error);
        return "Oops! Something went wrong. Sorry about that! Please try again! Or, check with Abhishek ;)";
    }
}


let chatHistory = []; // Stores last 10 messages

async function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    let chatBox = document.getElementById("chat-box");

    if (userInput.trim() === "") return;

    // Add user message to chat
    let userMessage = `<p class="user-message">${userInput}</p>`;
    chatBox.innerHTML += userMessage;
    document.getElementById("user-input").value = "";

    // Add user message to chat history
    chatHistory.push({ role: "user", content: userInput });
    trimChatHistory(); // Keep only last 10 messages

    // Show typing indicator
    let typingIndicator = document.createElement("p");
    typingIndicator.classList.add("typing");
    typingIndicator.innerText = "Alpana's assistant is typing...";
    chatBox.appendChild(typingIndicator);

    scrollToBottom();

    // Get bot response
    let botResponse = await getBotResponse(userInput);

    // Remove Typing Indicator & Show Bot Response
    chatBox.removeChild(typingIndicator);
    let botMessage = document.createElement("p");
    botMessage.classList.add("bot-message");
    botMessage.innerText = botResponse;
    chatBox.appendChild(botMessage);

    // Add bot response to chat history
    chatHistory.push({ role: "assistant", content: botResponse });
    trimChatHistory(); // Keep only last 10 messages

    // Smooth fade-in effect
    botMessage.style.opacity = 0;
    setTimeout(() => {
        botMessage.style.opacity = 1;
    }, 100);

    scrollToBottom();
}

// ✅ Get Bot Response with Chat History (Last 10 Messages)
async function getBotResponse(input) {
    const customResponses = {
        "hello": "Hey there, Alpana! Hope you're having an amazing day! 😊",
        "hi": "Hi Alpana! How can I assist you today?",
        "hey": "Hey Alpana! I hope that you're having a good day. How can I help?",
        "how are you": "I'm doing well, Alpana. Thank you! How about you?",
        //"tell me a joke": "Why don’t skeletons fight each other? Because they don’t have the guts! 😂",
        "who created you?": "I was built for your service by Abhishek!",
        "who built you?": "I was built for your service by Abhishek!",
        "who developed you?": "I was built for your service by Abhishek!",
        "who are you?": "I am your smart assistant, Alpana. I was built for your service by Abhishek!",
        "bye": "Goodbye, Alpana! Have a great day! 👋"
    };

    let lowerInput = input.toLowerCase();
    if (customResponses[lowerInput]) {
        return customResponses[lowerInput]; // Instant response for common queries
    }

    
}

// ✅ Trim Chat History to Keep Only the Last 10 Messages
function trimChatHistory() {
    if (chatHistory.length > 10) {
        chatHistory = chatHistory.slice(chatHistory.length - 10); // Keep only the last 10 messages
    }
}

// ✅ Smooth Scrolling to Bottom
function scrollToBottom() {
    let chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}

