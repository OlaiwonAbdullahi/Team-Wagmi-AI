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
  body.classList.toggle("dark-mode");
};

const API_KEY = "AIzaSyBK3_FJ8YctWNWQm0kiUERPJ81qnLYkAto";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

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

const handleOutgoingChat = () => {
  userText = chatInput.value.trim();
  if (!userText) return;

  const html = `<div class="chat-content">
                  <div class="chat-details">
                       <i class="fa-regular fa-user" style="color: #8c00ff; font-size: 45px;"></i>
                    <p>${userText}</p>
                  </div>
                </div>`;

  const outgoingChatDiv = createElement(html, "outgoing");
  chatContainer.appendChild(outgoingChatDiv);
  chatInput.value = "";
  setTimeout(showTypingAnimation, 500);
};

sendButton.addEventListener("click", handleOutgoingChat);
