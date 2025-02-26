// 1️⃣ Constants
const API_URL = "https://chatbot-xi-cyan.vercel.app/api/chat"; 
let chatHistory = [];

// 2️⃣ Utility Functions
function trimChatHistory() {
    if (chatHistory.length > 5) {
        chatHistory.splice(0, chatHistory.length - 5);  // ✅ Efficient slicing
    }
}

function scrollToBottom() {
    let chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function addMessageToChatbox(text, type) {
    let chatBox = document.getElementById("chat-box");
    let messageElement = document.createElement("p");
    messageElement.classList.add(type === "user" ? "user-message" : "bot-message");
    messageElement.innerText = text;
    chatBox.appendChild(messageElement);
    scrollToBottom();
}

// 3️⃣ API Call Functions
async function fetchOpenAIResponse(input) {
    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        let data = await response.json();
        if (!data.response) {
            throw new Error("Invalid response format from OpenAI");
        }

        return data.response;
    } catch (error) {
        console.error("Error fetching response:", error);

        if (error.message.includes("429")) {
            return "Too many requests! Please wait and try again.";
        } else if (error.message.includes("401")) {
            return "Invalid API Key. Please check your configuration.";
        }

        return "Oops! Something went wrong. Please try again, or ask Abhishek ;)";
    }
}

async function getBotResponse(input) {
    const customResponses = {
        "hello": "Hey there, Alpana! Hope you're having an amazing day! 😊",
        "hi": "Hi Alpana! How can I assist you today?",
        "hey": "Hey Alpana! I hope that you're having a good day. How can I help?",
        "how are you": "I'm doing well, Alpana. Thank you! How about you?",
        "what's your name": "I'm Alpana's assistant! How can I assist you today?",
        "who created you?": "I was built for your service by Abhishek!",
        "who developed you?": "I was built for your service by Abhishek!",
        "bye": "Goodbye, Alpana! Have a great day! 👋"
    };

    let lowerInput = input.toLowerCase();
    if (customResponses.hasOwnProperty(lowerInput)) {
        return customResponses[lowerInput];  // ✅ Instant return for predefined responses
    }

    return await fetchOpenAIResponse(input);
}

// 4️⃣ Main Chatbot Logic
async function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") return;

    addMessageToChatbox(userInput, "user");
    document.getElementById("user-input").value = "";

    chatHistory.push({ role: "user", content: userInput });
    trimChatHistory();

    let typingIndicator = document.createElement("p");
    typingIndicator.classList.add("typing");
    typingIndicator.innerText = "Alpana's assistant is typing...";
    document.getElementById("chat-box").appendChild(typingIndicator);

    let botResponse = await getBotResponse(userInput);

    document.getElementById("chat-box").removeChild(typingIndicator);
    addMessageToChatbox(botResponse, "bot");

    chatHistory.push({ role: "assistant", content: botResponse });
    trimChatHistory();
}

// 5️⃣ UI Functions
function showWelcomeMessage() {
    addMessageToChatbox("Hi Alpana! 👋 I’m here to help. How can I assist you today?", "bot");
}

function clearChat() {
    document.getElementById("chat-box").innerHTML = "";
    chatHistory = [];
    showWelcomeMessage();
}

// 6️⃣ Event Listeners & Initialization
window.onload = showWelcomeMessage;
document.getElementById("user-input").addEventListener("keypress", handleKeyPress);
document.getElementById("clear-chat").addEventListener("click", clearChat);