var canvas = document.getElementById("canvas1");
var timer;

var score = {
	p1: 0,
	p2: 0
}

var paddleOne = {
  x: 0,
  y: 200,
  width: 20,
  height: 200,
  selected:false,
  selectedHere:false
};

var paddleTwo = {
  x: 780,
  y: 200,
  width: 20,
  height: 200,
  selected:false,
  selectedHere:false
};

var ball = {
	x:400,
	y:300,
	dx:0,
	dy:0,
	size:25
}

var socket = io('http://' + window.document.location.host)
//var socket = io('http://localhost:3000')

socket.on('player1Data', function(data) {
  console.log("data: " + data);
  console.log("typeof: " + typeof data);
  var locationData = JSON.parse(data);
  paddleOne.x = locationData.x;
  paddleOne.y = locationData.y;
  paddleOne.selected = locationData.selected;
  drawCanvas();
})
socket.on('player2Data', function(data) {
  console.log("data: " + data);
  console.log("typeof: " + typeof data);
  var locationData = JSON.parse(data);
  paddleTwo.x = locationData.x;
  paddleTwo.y = locationData.y;
  paddleTwo.selected = locationData.selected;
  drawCanvas();
})
socket.on('score', function(data) {
  console.log("data: " + data);
  console.log("typeof: " + typeof data);
  var locationData = JSON.parse(data);
  score.p1 = locationData.p1;
  score.p1 = locationData.p1;
  drawCanvas();
})
socket.on('ball', function(data) {
  console.log("data: " + data);
  console.log("typeof: " + typeof data);
  var locationData = JSON.parse(data);
  ball.x = locationData.x;
  ball.y = locationData.y;
  ball.dx = locationData.dx;
  ball.dy = locationData.dy;
  drawCanvas();
})


var UP_ARROW = 38;
var DOWN_ARROW = 40;

function handleKeyDown(e) {
  console.log("keydown code = " + e.which);

  if (e.which == 49){
  	if (!(paddleOne.selected)){
	  	paddleOne.selected = true;
	 	paddleOne.selectedHere = true;
	 }

 	if (paddleTwo.selectedHere && paddleTwo.selected) paddleTwo.selected = false;
 	paddleTwo.selectedHere = false;
  }
  	
  if (e.which == 50){
  	if (!(paddleTwo.selected)){
	  	paddleTwo.selected = true;
	  	paddleTwo.selectedHere = true;
  	}
 	if (paddleOne.selectedHere && paddleOne.selected) paddleOne.selected = false;
 	paddleOne.selectedHere = false;
  }

  if (e.which == 48){
 	if (paddleTwo.selectedHere && paddleTwo.selected) paddleTwo.selected = false;
 	paddleTwo.selectedHere = false;
 	if (paddleOne.selectedHere && paddleOne.selected) paddleOne.selected = false;
 	paddleOne.selectedHere = false;

  }

  var dXY = 5; //amount to move in both X and Y direction

  //upate server with position data
  //may be too much traffic?
  if (paddleOne.selected){
  	if (paddleOne.selectedHere){
  if (e.which == UP_ARROW && paddleOne.y >= dXY) paddleOne.y -= dXY; //up arrow
  if (e.which == DOWN_ARROW && paddleOne.y + paddleOne.height + dXY <= canvas.height) paddleOne.y += dXY; //down arrow 	
  }
  var dataObj1 = { x: paddleOne.x, y: paddleOne.y, selected: true};
  }
  else
  	var dataObj1 = { x: paddleOne.x, y: paddleOne.y, selected: false};

  if (paddleTwo.selected){
  	if (paddleTwo.selectedHere){
  if (e.which == UP_ARROW && paddleTwo.y >= dXY) paddleTwo.y -= dXY; //up arrow
  if (e.which == DOWN_ARROW && paddleTwo.y + paddleTwo.height + dXY <= canvas.height) paddleTwo.y += dXY; //down arrow

  	
  }
  var dataObj2 = { x: paddleTwo.x, y: paddleTwo.y, selected: true};
  }
  else 
  	var dataObj2 = { x: paddleTwo.x, y: paddleTwo.y, selected: false};

  //create a JSON string representation of the data object
  var jsonString1 = JSON.stringify(dataObj1);
  var jsonString2 = JSON.stringify(dataObj2);

  //update the server with a new location of the moving box
  //update the server with a new location of the moving box
  	socket.emit('player1Data', jsonString1);
  	socket.emit('player2Data', jsonString2);
}

function handleKeyUp(e) {
  console.log("key UP: " + e.which);

  /*if (paddleOne.selected)
  	var dataObj = { x: paddleOne.x, y: paddleOne.y, selected: true };
  if (paddleTwo.selected)
  	var dataObj = { x: paddleTwo.x, y: paddleTwo.y, selected: true };


  //create a JSON string representation of the data object
  var jsonString = JSON.stringify(dataObj);

  //update the server with a new location of the moving box
  if (paddleOne.selected)
  	socket.emit('player1Data', jsonString);
  if (paddleTwo.selected)
  	socket.emit('player2Data', jsonString);*/
}


function handleTimer() {
	
	if (ball.dx == 0 && ball.dy == 0){
		ball.dx = 1.5;
		ball.dy = 2;
	}


  ball.x += ball.dx;
  ball.y += ball.dy;

  //keep moving word within bounds of canvas
  if (ball.x + ball.size > canvas.width){
  	score.p1++;
  	ball.x = 400;
  	ball.y = 300;
  	ball.dx = 0;
  	ball.dy = 0;
  }
  if (ball.x - ball.size < 0){
  	score.p2++;
  	ball.x = 400;
  	ball.y = 300;
  	ball.dx = 0;
  	ball.dy = 0;
  }
  if (ball.y + ball.size > canvas.height){
  	ball.dy = ball.dy*-1;
  }
  if (ball.y - ball.size < 0){
  	ball.dy = ball.dy*-1;
  }

  if (ball.x + ball.size >= 780){
  	if (ball.y > paddleTwo.y && ball.y < paddleTwo.y + paddleTwo.height){
  		ball.dx *= -1;
  	}

  }

  if (ball.x - ball.size <= 20){
  	if (ball.y > paddleOne.y && ball.y < paddleOne.y + paddleOne.height){
  		ball.dx *= -1;
  	}

  }



  	var dataObjScore = { p1: score.p1, p2: score.p2 };
	var dataObjBall = { x: ball.x, y: ball.y, dx: ball.dx, dy: ball.dy}

	var jsonStringScore = JSON.stringify(dataObjScore);
	var jsonStringBall = JSON.stringify(dataObjBall);

  socket.emit('score', jsonStringScore);
  socket.emit('ball', jsonStringBall);

  drawCanvas();
}

var drawCanvas = function() {
  var context = canvas.getContext("2d");


  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height); //erase canvas
  context.font = "" + 18 + "pt " + "Arial";
  context.fillStyle = "blue";
  context.fillText(score.p1, 200, 50);
  context.fillStyle = "red";
  context.fillText(score.p2, 600, 50);

  

  if (paddleOne.selectedHere){
  	context.fillStyle = "blue"
  	context.fillRect(paddleOne.x, paddleOne.y, paddleOne.width, paddleOne.height);
  }
  if (paddleTwo.selectedHere){
  	context.fillStyle = "red";
  	context.fillRect(paddleTwo.x, paddleTwo.y, paddleTwo.width, paddleTwo.height);

  }

  if (paddleOne.selected && !paddleOne.selectedHere){
  	context.fillStyle = "black";
  	context.fillRect(paddleOne.x, paddleOne.y, paddleOne.width, paddleOne.height);
  }

  if (paddleTwo.selected && !paddleTwo.selectedHere){
  	context.fillStyle = "black";
  	context.fillRect(paddleTwo.x, paddleTwo.y, paddleTwo.width, paddleTwo.height);
  }

  if (!paddleOne.selected){
  	context.fillStyle = "grey";
  	context.fillRect(paddleOne.x, paddleOne.y, paddleOne.width, paddleOne.height);
  	context.fillStyle = "blue";
  	context.fillText("Press 1", 200, 550);
  }

  if (!paddleTwo.selected){
  	context.fillStyle = "grey";
  	context.fillRect(paddleTwo.x, paddleTwo.y, paddleTwo.width, paddleTwo.height);
  	context.fillStyle = "red";
  	context.fillText("Press 2", 550, 550);
  }

  if (paddleOne.selectedHere || paddleTwo.selectedHere){
	  context.fillStyle = "black";
	  context.font = "" + 12 + "pt " + "Arial";
	  context.fillText("Press 0 to Quit", 350, 590);
	}

  context.fillStyle = "black";


  //draw circle
  context.beginPath();
  context.arc(
    ball.x, //x co-ord
    ball.y, //y co-ord
    ball.size, //radius
    0, //start angle
    2 * Math.PI //end angle
  );

  context.stroke();
};


window.onload = () => {
	//This is called after the broswer has loaded the web page

	//add mouse down listener to our canvas object
	//document.getElementById('canvas1').onmousedown = handleMouseDown;
	

	timer = setInterval(handleTimer, 20);
	//add key handler for the document as a whole, not separate elements.	
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	
	drawCanvas();
};