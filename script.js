const messageBar = document.querySelector(".bar-wrapper input");
const sendBtn = document.querySelector(".bar-wrapper button");
const messageBox = document.querySelector(".message-box");

let API_URL = "https://api.openai.com/v1/chat/completions";
let API_KEY = "______"; 

// Histórico de mensagens
let messageHistory = [];

// Função para enviar a mensagem para o chatbot
function sendMessage() {
  if (messageBar.value.length > 0) {
    const UserTypedMessage = messageBar.value;
    messageBar.value = ""; // Limpar a caixa de entrada

    // Exibir mensagem do usuário na caixa de mensagens
    displayUserMessage(UserTypedMessage);

    // Adicionar mensagem do usuário ao histórico
    messageHistory.push({"role": "user", "content": UserTypedMessage});

    // Enviar mensagem para o chatbot
    fetchChatbotResponse(UserTypedMessage);
  }
}

// Função para exibir a mensagem do usuário na caixa de mensagens
function displayUserMessage(message) {
  let userMessageHTML =
    `<div class="chat message">
      <img src="img/user.jpg">
      <span>${message}</span>
    </div>`;
  
  messageBox.insertAdjacentHTML("beforeend", userMessageHTML);
}

// Função para exibir a resposta do chatbot na caixa de mensagens
function displayChatbotResponse(response) {
  let chatBotResponseHTML = `
    <div class="chat response">
      <img src="img/chatbot.jpg">
      <span>${response}</span>
    </div>`;
  
  messageBox.insertAdjacentHTML("beforeend", chatBotResponseHTML);
}

// Função para enviar a mensagem para o chatbot via API fetch
function fetchChatbotResponse(message) {
  // Exibir "..." enquanto aguardamos a resposta do chatbot
  displayChatbotResponse("...");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      "model": "gpt-4o",
      "messages": messageHistory
    })
  };

  fetch(API_URL, requestOptions)
    .then(res => res.json())
    .then(data => {
      // Remover "..." e exibir a resposta do chatbot
      const response = data.choices[0].message.content;
      messageBox.lastElementChild.remove(); // Remover o último elemento (...)
      displayChatbotResponse(response);

      // Adicionar resposta do chatbot ao histórico
      messageHistory.push({"role": "assistant", "content": response});
    })
    .catch(error => {
      console.error("Error:", error);
      const errorResponseHTML = `
        <div class="chat response">
          <img src="img/chatbot.jpg">
          <span>Oops! An error occurred. Please try again.</span>
        </div>`;
      
      messageBox.insertAdjacentHTML("beforeend", errorResponseHTML);
    });
}

// Event listener para a tecla Enter na caixa de mensagem
messageBar.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Evita o comportamento padrão de enviar o formulário
    sendMessage();
  }
});

// Event listener para o botão de enviar
sendBtn.addEventListener("click", function () {
  sendMessage();
});
