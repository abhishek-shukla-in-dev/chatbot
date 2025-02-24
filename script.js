
const API_KEY = "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"; // Replace with your actual API key

async function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    let chatBox = document.getElementById("chat-box");

    if (userInput.trim() === "") return;

    // Add user message to chat
    let userMessage = `<p class="user-message">${userInput}</p>`;
    chatBox.innerHTML += userMessage;
    document.getElementById("user-input").value = "";

    // Show typing indicator
    let typingIndicator = document.createElement("p");
    typingIndicator.classList.add("typing");
    typingIndicator.innerText = "Alpana's assistant is typing...";
    chatBox.appendChild(typingIndicator);

    scrollToBottom();

    // Get response (Custom or AI-generated)
    let botResponse = await getBotResponse(userInput);

    // Remove Typing Indicator & Show Bot Response
    chatBox.removeChild(typingIndicator);
    let botMessage = document.createElement("p");
    botMessage.classList.add("bot-message");
    botMessage.innerText = botResponse;
    chatBox.appendChild(botMessage);

    // Smooth fade-in effect
    botMessage.style.opacity = 0;
    setTimeout(() => {
        botMessage.style.opacity = 1;
 }, 100);

    scrollToBottom();
}

// ✅ Predefined Responses for Common Questions
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

    // If no predefined response, fetch AI-generated response
    return await fetchOpenAIResponse(input);
}

// ✅ Call OpenAI API for Dynamic Responses
async function fetchOpenAIResponse(input) {
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
 };

    const body = {
        model: "gpt-3.5-turbo",
        messages: [
 { role: "system", content: "You are a friendly and fun chatbot that loves to engage users with positive and witty responses. You try to help people get out of a bad mood. The name of your primary user is Alpana. She is a 40 years old married lady. She is a caring mother of her son, Akshat, a 4 year old boy. Abhishek, her husband, is the developer of this chatbot. Alpana works for SAP Labs as a quality expert and security compliance coordinator. She is passionate about health and fitness. She is an expert badminton player and has won many awards in SAP for badminton." },
 { role: "user", content: input }
 ],
        temperature: 0.8,
        max_tokens: 150
 };

    try {
        let response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
 });

        let data = await response.json();
        console.log("API Response:", data);

        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content.trim();
 } else {
            return "Hmm, I'm not sure how to respond to that. I'll try better the nest time. Can you ask me something else? Or, check with Abhishek ;)";
 }
 } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Oops! Something went wrong. Sorry about that! Please try again! Or, check with Abhishek ;)";
 }
}

// ✅ Smooth Scrolling to Bottom
function scrollToBottom() {
    let chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}
