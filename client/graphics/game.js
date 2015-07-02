var rounds=10;
var bubbles=100;
var level=1;
var vel=20;
var num=0;
var total=0;
var complete=false;

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
	if (this.x+this.r >= 349.5 || this.x-this.r <= 0.5){
		this.vx = -this.vx; }
	if (this.y+this.r >= 349.5 || this.y-this.r <= 0.5){
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

var createModel = function(vel){
	console.log("created model");
	theModel = new BubbleModel(350,350); // we just created the model!
	for(var i=0; i<bubbles; i++){
		var randx = Math.random()*250+50;
		var randy = Math.random()*250+50;
		var randvx = Math.random()*80+vel;
		var randvy = Math.random()*80+vel;
		var posx = (Math.random()<0.3)?-0.7:1;
		var posy = (Math.random()<0.3)?-0.7:1;
		var randc1 = (Math.random()<0.5)?"green":"purple";
		var randc2 = (Math.random()<0.5)?"yellow":"orange";
		var randc3 = (Math.random()<0.5)?"black":"blue";
		var randc4 = (Math.random()<0.5)?"hotpink":"red";
		var randc_1 = (Math.random()<0.5)?randc1:randc2;
		var randc_2 = (Math.random()<0.5)?randc3:randc4
		var randc = (Math.random()<0.5)?randc_1:randc_2;;
		var randr = Math.random()*23+3;
		theModel.addBubble(new Bubble(randx,randy,randr,randc,posx*randvx,posy*randvy));
	}
	var lastTime = (new Date()).getTime();
}

createModel(vel);

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
	num=0;

	_.each(theModel.bubbleList,
		function(f) {
			if (!f.alive){
				num++;
				$("#popped").html("Bubbles popped: "+num+"/"+bubbles);
				if (num==bubbles){
					running=false;
					complete=true;
					$("#round").html('<button id="newgame" class="btn active">Next round</button>');
					bubbles+=25;
					level++;
					vel+=20;
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

Template.game.events({
	"click #startgame": function(event){
		console.log("pressed start");
		if(!running) {
			running=true;
			lastTime = (new Date()).getTime();
			gameLoop();
			$("#startgame").html("Pause");
			$("#round").html('<button id="newgame" class="btn active">Restart</button>');
			$("#lvl").html("<b><i>Level "+level+"</i></b>");
		} else {
			running=false;
			$("#startgame").html("Resume");
			$("#round").html('<button id="newgame" class="btn disabled">Restart</button>');
		}
	},
	"click #newgame": function(event){
		total +=num;
		if (running && !complete) running=false;
		gamesnum++;
		var roundsleft=rounds-gamesnum;
		$("#rounds").html("Rounds played: "+gamesnum);
		if (roundsleft<0){
			$("#game").html("<br><h5>No games left for now... get back to <b><a href=\"/schedule\">work</a></b></h5>");
			return;
		};
		createModel(vel);
		lastTime = (new Date()).getTime();
		gameLoop();
		$("#startgame").html("Pause");
		$("#mssg").html("You can play "+roundsleft+" more rounds, then get back to work!");
		$("#popped").html("Bubbles popped: 0/"+bubbles);
		$("#lvl").html("<b><i>Level "+level+"</i></b>");
		complete=false;
		running=true;
	},
	"submit #sendscore": function(event){
		event.preventDefault();
		var name = event.target.name.value;
		var lvl = level;
		var score = total;
		Scores.insert({name:name, level:lvl, score:score});
		event.target.name.value="";
	}	
});

Template.game.rendered = function() {
	document.getElementById("gameboard").addEventListener("mousemove", 
		function(e){
			if (running) {
				theModel.net.x = e.pageX - gameboard.offsetLeft;
    			theModel.net.y = e.pageY - gameboard.offsetTop;
			}
		}
	);
}

Template.game.helpers(
  {
	scores: function(){return Scores.find({},{sort:{level:-1,score:-1,name:1},limit:8});}
  }
);