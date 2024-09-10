const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#chat-icon");
const chatContainer = document.querySelector(".chat-container");

let userText = null;
const API_KEY =
  "YOUR_API_KEY"; // Insert your OpenAI API key here

// Function to create a chat element
const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

// Function to get chat response from OpenAI
const getChatResponse = async () => {
  const API_URL = "https://api.openai.com/v1/chat/completions";

  // Defines the properties and data for the API request
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4", // Use the model specified
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: userText,
        },
      ],
      max_tokens: 2048,
      temperature: 0.2,
      n: 1,
      stop: null,
    }),
  };

  try {
    const response = await (await fetch(API_URL, requestOptions)).json();

    const botResponse = response.choices[0]?.message.content.trim();
    const botHtml = `<div class="chat-content">
                          <div class="chat-details">
                              <img src="./assets/Wagmi-AI.png" alt="chatbot-img" />
                              <p>${botResponse}</p>
                          </div>
                       </div>`;
    const incomingChatDiv = createElement(botHtml, "incoming");
    chatContainer.appendChild(incomingChatDiv);
  } catch (error) {
    console.error(error);
    const errorMessage = createElement(
      "Something went wrong. Please try again later.",
      "error"
    );
    chatContainer.appendChild(errorMessage);
  }
};

// Function to show typing animation
const showTypingAnimation = () => {
  const html = `<div class="chat-content">
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
