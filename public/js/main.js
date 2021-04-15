const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();
// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// message from Server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM

function outputMessage({ username, text, time }) {
  const markup = `<div class="message">
                      <p class="meta">${username} <span>${time}</span></p>
                      <p class="text">${text}</p>
                </div>`;
  chatMessages.insertAdjacentHTML("beforeend", markup);

// Second method of inserting in DOM
  // const div = document.createElement("div");
  // div.classList.add("message");
  // div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
  //                 <p class="text">${message}</p>`;
  // document.querySelector(".chat-messages").append(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
 ${users.map((user) => `<li>${user.username}</li>`).join('')}
 `;
}
