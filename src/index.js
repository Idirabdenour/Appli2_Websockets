import './index.css';
import nameGenerator from './name-generator';
import isDef from './is-def';
  
  
// Store/retrieve the name in/from a cookie.
const cookies = document.cookie.split(';');
console.log(cookies)
let wsname = cookies.find(function(c) {
  if (c.match(/wsname/) !== null) return true;
  return false;
});
if (isDef(wsname)) {
  wsname = wsname.split('=')[1];
} else {
  wsname = nameGenerator();
  document.cookie = "wsname=" + encodeURIComponent(wsname);
}


/************************************Affichage******************************/

var canvas,ctx,flag = false,
prevX = 0,
prevY = 0,
currX = 0,
currY = 0;

var linewidth = 5,
linecolor = "red";

canvas = document.getElementById('canvas');
ctx = canvas.getContext("2d");

canvas.addEventListener("mousemove", function (e) {
  findxy('move', e)
  
}, false);
canvas.addEventListener("mousedown", function (e) {findxy('down', e)
}, false);
canvas.addEventListener("mouseup", function (e) {findxy('up', e)}, false);
canvas.addEventListener("mouseout", function (e) {findxy('out', e)}, false);


function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = linecolor;
    ctx.lineWidth = linewidth;
    ctx.stroke();
    ctx.closePath();
}

function findxy(res, e) {
  if (res === 'down') {
  flag = true;
    ctx.beginPath();
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;
    ctx.fillStyle = linecolor;
    ctx.fillRect(currX, currY, 2, 2);
    ctx.closePath();
    
  }
  if (res === 'move') {
    if (flag) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        draw();
        sendMessage(e);
        
       // console.log(prevX+'/'+prevY);
    }
  }
  if (res === 'up' || res === "out") {
    flag = false;
  }
}

// Set the name in the header
document.querySelector('header>p').textContent = decodeURIComponent(wsname);

// Create a WebSocket connection to the server
const ws = new WebSocket("ws://" + window.location.host+ "/socket");

// We get notified once connected to the server
ws.onopen = (event) => {
  console.log("We are connected.");
};

//Écoutez les messages provenant du serveur. Quand cela arrive, créez un nouveau <li> et ajoutez-le au DOM.
const messages = document.querySelector('#messages');
let line;
ws.onmessage = (event) => {
    //canvas.appendChild(draw());
    //ctx.beginPath();
    
    ctx.moveTo(event.data.split(';')[2],event.data.split(';')[3], 2, 2);
    ctx.lineTo( event.data.split(';')[0],event.data.split(';')[1], 2, 2);
    ctx.strokeStyle = linecolor;
    ctx.lineWidth = linewidth;
    ctx.stroke();
    ctx.closePath();
    
   // ctx.fillRect( event.data.split(';')[0],event.data.split(';')[1], 2, 2);
    
    line = document.createElement('li');
  line.textContent = event.data;
  messages.appendChild(line);
  
};

// Récupérer l'élément d'entrée. Ajouter des écouteurs afin d'envoyer le contenu de l'entrée lorsque la touche "retour" est pressée.
function sendMessage(event) {
  event.preventDefault();
  event.stopPropagation();
  //ws.send(prevX+";"+prevY);
  ws.send(prevX+";"+prevY+";"+currX+";"+currY);
  
  //console.log(prevX+";"+prevY);
  if (sendInput.value !== '') {
    // Send data through the WebSocket
    ws.send(sendInput.value);
    sendInput.value = '';
   
  }
}

const sendForm = document.querySelector('form');
const sendInput = document.querySelector('form input');
sendForm.addEventListener('submit', sendMessage, true);
sendForm.addEventListener('blur', sendMessage, true);
