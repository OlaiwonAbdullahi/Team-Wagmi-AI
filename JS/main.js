const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#chat-icon");
const chatContainer = document.querySelector(".chat-container");

let userText = null;
const API_KEY = "b8ef490beemshc78108332381208p1cc891jsn167f1fd3a95e"; // Secure this in a backend!

const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;
};

const getChatResponse = async () => {
  const API_URL = "https://chatgpt-42.p.rapidapi.com/conversationgpt4-2";

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-rapidapi-ua": "RapidAPI-Playground",
      "x-rapidapi-key": API_KEY, // Inject your API key here
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: userText,
        },
      ],
      system_prompt: "",
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false,
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();

    // Check if there's a valid response and a message from the chatbot
    if (data && data.messages && data.messages[0]) {
      const botResponse = data.messages[0].content.trim();

      // Create the chatbot response element
      const botHtml = `<div class="chat-content">
                            <div class="chat-details">
                                <img src="./assets/Wagmi-AI.png" alt="chatbot-img" />
                                <p>${botResponse}</p>
                            </div>
                         </div>`;
      const incomingChatDiv = createElement(botHtml, "incoming");
      chatContainer.appendChild(incomingChatDiv);
    } else {
      throw new Error("Invalid response from the API.");
    }
  } catch (error) {
    console.error(error);
    const errorMessage = createElement(
      "Something went wrong. Please try again later.",
      "error"
    );
    chatContainer.appendChild(errorMessage);
  }
};

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

const handleOutgoingChat = () => {
  userText = chatInput.value.trim();
  if (!userText) return;

  const html = `<div class="chat-content">
                    <div class="chat-details">
                      <img src="./assets/user-regular.svg" alt="" />
                      <p>${userText}</p>
                    </div>
                  </div>`;
  const outgoingChatDiv = createElement(html, "outgoing");
  chatContainer.appendChild(outgoingChatDiv);
  chatInput.value = ""; // Clear the input field
  setTimeout(showTypingAnimation, 500);
};

sendButton.addEventListener("click", handleOutgoingChat);
