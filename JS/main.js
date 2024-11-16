const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#chat-icon");
const chatContainer = document.querySelector(".chat-container");
const delete_btn = document.querySelector(".typing-controls .delete_btn");
const dark_mode = document.querySelector(".typing-controls .dark_mode");
const body = document.body;

let userText = null;

// Delete button to reload the page
delete_btn.onclick = () => {
  window.location.reload();
};

// Dark mode toggle
dark_mode.onclick = () => {
  body.classList.toggle("dark-mode");
};

// API key and endpoint
const API_KEY = "AIzaSyBMbfCKf_bpdtIMu2ich78rX71loxc9kPU";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// Helper function to create chat elements
const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

// Fetch response from the API
const getChatResponse = async () => {
  try {
    // API call
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: { text: userText },
        maxTokens: 150, // Adjust as needed
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Extract API response
    const apiResponse =
      data?.candidates?.[0]?.content || "Sorry, I couldn't get a response.";

    // Remove typing animation
    const typingAnimationDiv = document.querySelector(
      ".typing-animation-container"
    );
    if (typingAnimationDiv) typingAnimationDiv.remove();

    // Add chatbot response to the chat container
    const botHtml = `<div class="chat-content">
                        <div class="chat-details">
                            <img src="./assets/Wagmi-AI.png" alt="chatbot-img" />
                            <p>${apiResponse}</p>
                        </div>
                     </div>`;
    const incomingChatDiv = createElement(botHtml, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the latest message
  } catch (error) {
    console.error("Error fetching chat response:", error);

    // Remove typing animation
    const typingAnimationDiv = document.querySelector(
      ".typing-animation-container"
    );
    if (typingAnimationDiv) typingAnimationDiv.remove();

    // Show error message
    const errorHtml = `<div class="chat-content">
                          <div class="chat-details">
                              <p>Sorry, an error occurred. Please try again later.</p>
                          </div>
                       </div>`;
    const errorDiv = createElement(errorHtml, "incoming");
    chatContainer.appendChild(errorDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
};

// Show typing animation while waiting for API response
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

// Handle user input and display outgoing messages
const handleOutgoingChat = () => {
  userText = chatInput.value.trim();
  if (!userText) return;

  // Create outgoing chat bubble
  const html = `<div class="chat-content">
                  <div class="chat-details">
                       <i class="fa-regular fa-user" style="color: #8c00ff; font-size: 45px;"></i>
                    <p>${userText}</p>
                  </div>
                </div>`;

  const outgoingChatDiv = createElement(html, "outgoing");
  chatContainer.appendChild(outgoingChatDiv);
  chatInput.value = ""; // Clear input field
  setTimeout(showTypingAnimation, 500); // Add slight delay before showing typing animation
};

// Event listener for the send button
sendButton.addEventListener("click", handleOutgoingChat);