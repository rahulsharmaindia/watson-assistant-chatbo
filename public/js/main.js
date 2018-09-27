
var socket = io("http://localhost:5000");

socket.on("disconnect", (message)=> {
    setTitle("Disconnected");
    printMessage(message);
});

socket.on("connect", ()=> {
	setTitle("Connected to Watson ChatBot");
});

socket.on("server message", function(message) {
	printMessage(message);
});

document.forms[0].onsubmit = function () {
    var input = document.getElementById("message");
    printMessage(input.value);
    socket.emit("client message", input.value);
    input.value = '';
};

function setTitle(title) {
    document.querySelector("h1").innerHTML = title;
}

function printMessage(message) {
    var p = document.createElement("p");
    p.innerText = message;
    document.querySelector("div.messages").appendChild(p);
}
