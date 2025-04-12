import { Controller } from "./controller.js";
import { Service } from "./service.js";

let service;

function enterChat(){

    const name = document.getElementById('name-input').value;
    const url = window.location.hostname === 'brenoveras.com.br' 
        ? 'wss://brenoveras.com.br/live-chat-server' 
        : 'ws://localhost:8080';
    const socket = new WebSocket(`${url}?user=${name}`);

    if (!name){
        alert('Por favor insira um nome');
        return
    }   

    service = new Service(socket, name)
    const controller = new Controller(service);     
   
    
    socket.addEventListener("open", controller.onOpen.bind(controller));

    socket.addEventListener("message", controller.onMessage.bind(controller));

    socket.addEventListener("error", controller.onError.bind(controller));

    socket.addEventListener("close", controller.onClose.bind(controller));
}

function sendMessage(event){
    service.sendMessage(event)
}

window.sendMessage = sendMessage

window.enterChat = enterChat

