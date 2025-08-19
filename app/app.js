const socket = io('ws://localhost:3500');
//const socket = new WebSocket("ws://localhost:3000");

function sendMessage(e){
    e.preventDefault();
    const input =document.querySelector('input')
    if(input.value){
        socket.emit('message', input.value)
        input.value =""
    }
    input.focus()
}

document.querySelector('form')
    .addEventListener('submit', sendMessage);

//Listen of messages
socket.on('message',({data}) =>{
    const li = document.createElement('li');
    li.textContent = data;
    document.querySelector('ul').appendChild(li);
}) 