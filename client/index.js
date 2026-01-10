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
  socket.send(JSON.stringify({"clientId": clientId, "connection": true}));
});

document.getElementById("send").onclick = function(){
    var userMessage = document.getElementById("chatbox-message-field").value;
    console.log(userMessage)
    socket.send(JSON.stringify({"clientId": clientId, "userMessage": userMessage}))
    displayMessage(clientId + " says: " + userMessage)
};

addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault()
      document.getElementById("send").click()
    }
})

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);

  if(JSON.parse(event.data).connection == true) {
    displayMessage(JSON.parse(event.data).clientId + " connected to the chatroom")
  } else if (JSON.parse(event.data).clientId == clientId) {
    console.log("client ID se shoduje")
    console.log(document.getElementById("chatbox-message-field").value = "")
    //displayMessage(clientId + " says: " + event.data)
  } else {
    console.log("client ID se neshoduje")
    const incomingMessage = JSON.parse(event.data)
    displayMessage(incomingMessage.clientId + " says: " + incomingMessage.userMessage)
  }
});


function displayMessage(userMessage) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = userMessage;   
  messageDiv.classList.add("message");
  document.getElementById("chatbox-text").appendChild(messageDiv);
  console.log(messageDiv)
}
