const API_URL = "https://chatbot-xi-cyan.vercel.app/api/chat"; // Correct Vercel API URL

async function fetchOpenAIResponse(input) {
    try {
        let response = await fetch(API_URL, {
            method: "POST", // ✅ Ensures it sends a POST request
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }) // ✅ Sends user message in request body
        });

        let data = await response.json();

        if (!data.response) {
            console.error("Error: No valid response from OpenAI", data);
            return "Oops! I couldn't generate a response. Please try again, or ask Abhishek ;)";
        }

        return data.response;
    } catch (error) {
        console.error("Error fetching response:", error);
        return "Oops! Something went wrong. Sorry about that! Please try again, or ask Abhishek ;).";
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
        "who created you?": "I was built for your service by Abhishek!",
        "who built you?": "I was built for your service by Abhishek!",
        "who developed you?": "I was built for your service by Abhishek!",
        "who are you?": "I am your smart assistant, Alpana. I was built for your service by Abhishek!",
        "bye": "Goodbye, Alpana! Have a great day! 👋"
    };

    let lowerInput = input.toLowerCase();
    if (customResponses[lowerInput]) {
        return customResponses[lowerInput]; // Return instant response for common queries
    }

    // If no predefined response, fetch AI-generated response from OpenAI (via Vercel)
    return await fetchOpenAIResponse(input);
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

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}


function showWelcomeMessage() {
    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    let messages = [
        "Hello, Alpana! 😊 I'm here to assist you. What can I do for you today?",
        "Hi there, Alpana! 👋 How can I help you today?",
        "Hey Alpana! 🎉 Ask me anything, I'm here to assist!",
        "Hi Alpana! I hope that you're doing well 😊 How can I help you?"
    ];

    let randomMessage = messages[Math.floor(Math.random() * messages.length)];

    let welcomeMessage = document.createElement("p");
    welcomeMessage.classList.add("bot-message");
    welcomeMessage.innerText = randomMessage;
    chatBox.appendChild(welcomeMessage);
}

// ✅ Function to Clear Chat and Show Welcome Message Again
function clearChat() {
    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = ""; // Clear all messages
    chatHistory = []; // Reset chat history

    showWelcomeMessage(); // ✅ Show the welcome message again
}

// ✅ Show the Welcome Message When Page Loads
window.onload = showWelcomeMessage;


