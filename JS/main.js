const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#chat-icon");
const chatContainer = document.querySelector(".chat-container");
const delete_btn = document.querySelector(".typing-controls .delete_btn");
const dark_mode = document.querySelector(".typing-controls .dark_mode");
const body = document.body;
let userText = null;

delete_btn.onclick = () => {
  window.location.reload();
};
dark_mode.onclick = () => {
  body.classList.add("dark-mode");
};

const API_KEY = "AIzaSyBK3_FJ8YctWNWQm0kiUERPJ81qnLYkAto"; // Insert your actual API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

// Function to get chat response from API
const getChatResponse = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userText }],
          },
        ],
      }),
    });
    const data = await response.json();
    console.log("API Response:", data);
    const apiResponse =
      data?.candidates[0].content.parts[0].text ||
      "Sorry, I couldn't get a response.";

    const typingAnimationDiv = document.querySelector(
      ".typing-animation-container"
    );
    if (typingAnimationDiv) {
      typingAnimationDiv.remove();
    }

    // Create bot's chat message and append to chat container
    const botHtml = `<div class="chat-content">
                          <div class="chat-details">
                              <img src="./assets/Wagmi-AI.png" alt="chatbot-img" />
                              <p>${apiResponse}</p>
                          </div>
                       </div>`;
    const incomingChatDiv = createElement(botHtml, "incoming");
    chatContainer.appendChild(incomingChatDiv);
  } catch (error) {
    console.log(error);
  }
};

// Function to show typing animation
const showTypingAnimation = () => {
  const html = `<div class="chat-content typing-animation-container">
                  <div class="chat-details">
                    <img src="./assets/Wagmi-AI.png" alt="chatbot-img" />
                    <div class="typing-animation">
                      <div class="typing-dot" style="--delay: 0.2s"></div>
                      <div class="typing-dot" style="--delay: 0.3s"></div>
                      <div class="typing-dot" style="--delay: 0.4s"></div>
                    </div>
                  </div>
                </div>`;
  const typingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(typingChatDiv);
  getChatResponse();
};

// Function to handle user input and outgoing chat
const handleOutgoingChat = () => {
  userText = chatInput.value.trim(); // Get chatInput value and removes extra spaces
  if (!userText) return;

  const html = `<div class="chat-content">
                  <div class="chat-details">
                    <img src="./assets/user-regular.svg" alt="user-icon" />
                    <p>${userText}</p>
                  </div>
                </div>`;

  // Create an outgoing chat div with user's message and appends it to the chat container
  const outgoingChatDiv = createElement(html, "outgoing");
  chatContainer.appendChild(outgoingChatDiv);
  chatInput.value = ""; // Clear input field after sending
  setTimeout(showTypingAnimation, 500); // Show typing animation before fetching the bot's response
};

// Event listener to handle chat on button click
sendButton.addEventListener("click", handleOutgoingChat);
