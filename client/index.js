function createClientId() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  // Helper to get random characters
  const randChars = (chars, length) =>
    Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

  const part1 = randChars(letters, 3);
  const part2 = randChars(numbers, 3);
  const part3 = randChars(letters + numbers, 3);

  return `${part1}-${part2}-${part3}`;
}

const clientId = createClientId()

// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");
// Connection opened
socket.addEventListener("open", (event) => {
  socket.send(JSON.stringify({ "clientId": clientId, "connection": true }));
});

document.getElementById("send").onclick = function () {
  sendMessage()
};

addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault()
    sendMessage()
  }
})

const chatboxMessageField = document.getElementById("chatbox-message-field");

const sendMessage = () => {
  var userMessage = chatboxMessageField.value;
  typingActive = false;
  if (userMessage == "") {
    return
  }
  socket.send(JSON.stringify({ "clientId": clientId, "userMessage": userMessage }))
  displayMessage(clientId + " says: " + userMessage)
}

// Listen for messages
socket.addEventListener("message", (event) => {
  const incomingMessage = JSON.parse(event.data)

  if (incomingMessage.connection == true) {
    displayMessage(incomingMessage.clientId + " connected to the chatroom")
  } else if (incomingMessage.clientId == clientId && incomingMessage.userMessage) {
    // matching Ids
    chatboxMessageField.value = ""
    displayActiveTyping(incomingMessage)
  } else {
    // not matching Ids
    displayActiveTyping(incomingMessage)
    if (incomingMessage.userMessage){
      displayMessage(incomingMessage.clientId + " says: " + incomingMessage.userMessage)
    }
  }
});

const displayMessage = (userMessage) => {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = userMessage;
  messageDiv.classList.add("message");
  document.getElementById("chatbox-text").appendChild(messageDiv);
}

const displayActiveTyping = (incomingMessage) => {
  const typingElement = document.getElementById("typing-users")
  if (incomingMessage.typing) {
      console.log("User " + incomingMessage.clientId + "is typing...")
      typingElement.style.display = "inline-block";
      return
    } else if (incomingMessage.typing == false) {
      console.log("User " + incomingMessage.clientId + "is no longer typing...")
      typingElement.style.display = "none";
      return
    }
}

let typingTimeout;
let typingActive = false;

chatboxMessageField.addEventListener("input", () => {
  if (!typingActive) {
    typingActive = true;
    socket.send(JSON.stringify({"clientId": clientId, "typing": true})
  )}

  clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    typingActive = false;
    socket.send(JSON.stringify({ "clientId": clientId, "typing": false})
  );
  }, 1000);
});

