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
  socket.send("User " + clientId + " has joined the channel.");
});

document.getElementById("send").onclick = function(){
    var userMessage = document.getElementById("chatbox-message-field").value;
    console.log(userMessage)
    socket.send(JSON.stringify({"clientId": clientId, "userMessage": userMessage}))
    displayMessage({"clientId": clientId, "userMessage": userMessage}
    )
};

// Listen for messages
socket.addEventListener("message", (event) => {
  //console.log("Message from server ", event.data);
  if(JSON.parse(event.data).clientId == clientId) {
    console.log("client ID se shoduje")
    displayMessage(clientId + " says: " + event.data)
  } else {
    console.log("client ID se neshoduje")
    displayMessage(clientId + " says: " + event.data)
  }
});


function displayMessage(userMessage) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = userMessage;   
  messageDiv.classList.add("message");
  document.getElementById("chatbox-text").appendChild(messageDiv);
}
