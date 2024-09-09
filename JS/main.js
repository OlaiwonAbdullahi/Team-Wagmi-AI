const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#chat-icon");
const chatContainer = document.querySelector(".chat-container");



let userText = null;

const API_KEY = "";

const createElement = (html, className) => {
    // Create new div and apply chat, specified class and set html content of div

    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; //Return the created chat div
}


const getChatResponse = async () => {
    const API_URL = "https://api.openai.com/v1/completions";



    // Defines the properties and data for the API request

    const requestOptions = {

        method: "POST",

        headers: {

            "Content-Type": "application/json",
            "Authorization": `Bearer ${"API_KEY"}`

        },

        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })

    }

    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        console.log(response)
    } catch (error) {
        console.log(error);
    }
}

const showTypingAnimation = () => {
    const html =
        `<div class="chat-content">
          <div class="chat-details">
            <img src="./assets/Wagmi-AI.png" alt="chatbot-img" />
            <div class = "typing-animation">

            <div class="typing-dot" style = "--delay: 0.2s"></div>
            <div class="typing-dot" style = "--delay: 0.3s"></div>
            <div class="typing-dot" style = "--delay: 0.4s"></div>
            </div>
          </div>
          <i class="fa-regular fa-clipboard"></i>
        </div>
      </div>`;

    // Create an outgoing chat div with user's message and appends it to the chat container
    const outgoingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(outgoingChatDiv);
    getChatResponse();
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); //Get chatInput value and removes extra spaces

    const html =
        `<div class="chat-content">
            <div class="chat-details">
                <img src="./assets/user-regular.svg" alt="" />
                <p>
                    ${userText}
                </p>
            </div>
        </div>`;

    // Create an outgoing chat div with user's message and appends it to the chat container
    const outgoingChatDiv = createElement(html, "outgoing");
    chatContainer.appendChild(outgoingChatDiv);
    setTimeout(showTypingAnimation, 500);
    // console.log(userText);
}

sendButton.addEventListener("click", handleOutgoingChat);


