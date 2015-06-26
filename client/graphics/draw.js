var rounds=10;
var bubbles=70;
var level=1;

function Bubble(x,y,r,c,vx,vy){
	this.x=x;this.y=y;
	this.r=r;
	this.c=c;
	this.vx=vx;this.vy=vy;
	this.alive=true;
}

function BubbleNet(x,y,r,c){
	this.x=x;this.y=y;this.r=r;this.c=c;
}

BubbleNet.prototype.caught = function(f) {
	var d = distFromOrigin(f.x-this.x,f.y-this.y);
	return (d<(f.r+this.r));
}

function distFromOrigin(x,y) { return Math.sqrt(x*x + y*y);}

Bubble.prototype.update = function(dt){
	if (this.x+this.r >= 348 || this.x-this.r <= 2){
		this.vx = -this.vx; }
	if (this.y+this.r >= 348 || this.y-this.r <= 2){
		this.vy = -this.vy; }
	this.x += this.vx*dt;
	this.y += this.vy*dt;
}

function BubbleModel(){
	this.w=350;
	this.h=350;
	this.net=new BubbleNet(20,20,5,"white");
	this.bubbleList=[];
}

BubbleModel.prototype.addBubble = function(f){
	this.bubbleList.push(f);
}

BubbleModel.prototype.update = function(dt){
	var theNet = this.net;
	_.each(this.bubbleList,
		function(f){
			f.update(dt);
			if (theNet.caught(f)) {
				f.alive=false;
			}
		}	
	);
}

var createModel = function(){
	theModel = new BubbleModel(350,350); // we just created the model!
	for(var i=0; i<bubbles; i++){
		var randx = Math.random()*150+30;
		var randy = Math.random()*150+30;
		var randvx = Math.random()*45+20;
		var randvy = Math.random()*45+20;
		var randc1 = (Math.random()<0.5)?"green":"purple";
		var randc2 = (Math.random()<0.5)?"yellow":"orange";
		var randc3 = (Math.random()<0.5)?"black":"blue";
		var randc4 = (Math.random()<0.5)?"hotpink":"red";
		var randc_1 = (Math.random()<0.5)?randc1:randc2;
		var randc_2 = (Math.random()<0.5)?randc3:randc4
		var randc = (Math.random()<0.5)?randc_1:randc_2;;
		var randr = Math.random()*26+5;
		theModel.addBubble(new Bubble(randx,randy,randr,randc,randvx,randvy));
	}
	var lastTime = (new Date()).getTime();
}

createModel();

function draw(){

	var drawContext = gameboard.getContext("2d");
	drawContext.fillStyle="#eee";
	drawContext.fillRect(0,0,350,350);

	var net = theModel.net;
	drawContext.strokeStyle="black";
	drawContext.beginPath();
	drawContext.arc(net.x,net.y,net.r,0,2*Math.PI,true);
	drawContext.stroke();drawContext.stroke();drawContext.stroke();
	drawContext.fillStyle=net.c;
	drawContext.fill();
	var num=0;

	_.each(theModel.bubbleList,
		function(f) {
			if (!f.alive){
				num++;
				$("#popped").html("Bubbles popped: "+num+"/"+bubbles);
				if (num==bubbles){
					running=false;
					$("#round").html('<button id="newgame" class="btn active">Next round</button>');
					bubbles+=15;
					level++;
				}
				return;
			};
			drawContext.strokeStyle=f.c;
			drawContext.beginPath();
			drawContext.arc(f.x,f.y,f.r,0,2*Math.PI,true);
			drawContext.stroke();
		}
	);		
	
}	

function gameLoop(){
	var theTime = (new Date()).getTime();
	var dt = theTime - lastTime;  // in milliseconds
	lastTime = theTime;
	theModel.update(dt/1000.0);
	draw();
	if (running) window.requestAnimationFrame(gameLoop);
}


drawIt = draw;
var running = false;
var gamesnum = 0;

Template.draw.events({
	"click #startgame": function(event){
		console.log("pressed start");
		if(!running) {
			running=true;
			lastTime = (new Date()).getTime();
			gameLoop();
			$("#startgame").html("Pause");
			$("#round").html('<button id="newgame" class="btn disabled">Restart</button>');
			$("#lvl").html("<b><i>Level "+level+"</i></b>");
		} else {
			running=false;
			$("#startgame").html("Resume");
			$("#round").html('<button id="newgame" class="btn active">Restart</button>');
		}
	},
	"click #newgame": function(event){
		gamesnum++;
		var roundsleft=rounds-gamesnum;
		$("#rounds").html("Rounds played: "+gamesnum);
		if (roundsleft<0){
			$("#game").html("<br><h5>No games left for now... get back to <b><a href=\"/schedule\">work</a></b></h5>");
			return;
		};
		running=true;
		createModel();
		draw();
		gameLoop();
		$("#startgame").html("Pause");
		$("#round").html('<button id="newgame" class="btn disabled">-</button>');
		$("#mssg").html("You can play "+roundsleft+" more rounds, then get back to work!");
		$("#popped").html("Bubbles popped: 0/"+bubbles);
		$("#lvl").html("<b><i>Level "+level+"</i></b>");
	}
})

Template.draw.rendered = function() {
	document.getElementById("gameboard").addEventListener("mousemove", 
		function(e){
			if (running) {
				theModel.net.x = 220*e.pageX/gameboard.width - 0.1*gameboard.offsetLeft;
				theModel.net.y = 220*e.pageY/gameboard.height - 0.1*gameboard.offsetTop;
			}
		}
	);
}