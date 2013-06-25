/*
The bubble game model is a 100x100 square where the bubbles float in the top 100x80
rectangle and the user tries to pop the bubbles by blowing through a straw centered at the bottom of the box and rotated at an angle of "a" degrees.

There are two types of objects in the model:
  bubbles (which have position, velocity, radius and color properties and
    and update() method to change their position)
  puffs (which are like bubbles, but don't bounce off walls, they just disappear)
and
  straws (which have an angle and a shoot() method that creates a new object and shoots it into the world)

The Game Architecture consists of
gm: a model that keeps track of the positions and velocities of all objects
draw_view(): a function that draws the model on the screen
update_model(): a function that updates the positions and velocities of all objects
game_loop(): a function that updates the model then draws the view
create_game(): a function that creates the initial state of the game

The global variables are
    gm: the game model
and nothing else...
*/

// the gameView is an object describing the view on the screen...
gameView = {w:400, h:400};

var pewser = 50;


var img = new Image();
img.src = 'cage head.png';

var imgBee = new Image();
imgBee.src = 'bee2.png';

function game_model(){
	this.actors=[];
	this.airballs=[];
	this.running=false;
	//makes bubbles
	for(var i=0; i<10;i++){
		this.actors.push(
				new bubble(Math.random()*100,Math.random()*100,4));
	}
	copyActors=this.actors.length;
	//makes airballs
	//for(var i=0; i<10;i++){
		//this.airballs.push(
			//	new bubble(Math.random()*100,Math.random()*100,1));
	//}
	
	this.update = function () {
		for(var i = 0; i<this.actors.length;i++){
			this.actors[i].update();
			
		}
		for(var i = 0; i<this.airballs.length;i++){
			var a = this.airballs[i];
			a.update();
			if(a.y>=100){
				a.visible=false;
			}
			
		}
		//airballs collide with bubbles
		for(var i = 0;i<this.airballs.length;i++){
			var a = this.airballs[i];
			for(var j=0;j<this.actors.length;j++){
				var b = this.actors[j];
				if(a.intersects(b)){
					b.visible = false;
					if(this.collided==false){
						copyActors-=1;
					}
					this.collided = true;
				}
			}
		}

	}
}

function bubble(x,y,r){
	this.x=x;
	this.y=y;
	this.r=r;
	this.collided = false;
	this.stop = true;
	this.vx = Math.random();
	this.vy = Math.random();
	this.c ="color(255,0,0)";
	this.dt = 0.1;
	this.visible = true;
	this.intersects = function(b){
		var dx = this.x - b.x;
		var dy = this.y - b.y;
		var d = Math.sqrt(dx*dx +dy*dy);
		return(d<this.r+b.r);
	}
	this.update = function(){
		this.x+=this.vx*this.dt;
		this.y+=this.vy*this.dt;
		if(this.x>100 || this.x<0){
			this.vx*=-1;
		}
		if(this.y>100 || this.y<0){
			this.vy*=-1;
		}

	}
	this.draw = function(cont){
		if(!this.visible)return;
		//cont.drawImage(img,x,y);
		cont.beginPath();111
		cont.fillStyle = "#007";
		//convert from model coordinates x,y, r to sceen ones, px, py,pr
		var px = this.x*gameView.w/100;
		var py = gameView.h-gameView.h*this.y/100;
		var pr = this.r*gameView.w/100;
		
		cont.drawImage(img,px,py,50,50);
		/*
		cont.arc(px,py,pr,0,2*Math.PI);
		cont.strokeStyle = this.c;
		cont.fill();
		*/
	}
}
//cause i dont really have prototyping down
function bee(x,y,r){
	this.x=x;
	this.y=y;
	this.r=r;
	this.vx = Math.random();
	this.vy = Math.random();
	this.c ="color(255,0,0)";
	this.dt = 0.1;
	this.visible = true;
	this.intersects = function(b){
		var dx = this.x - b.x;
		var dy = this.y - b.y;
		var d = Math.sqrt(dx*dx +dy*dy);
		return(d<this.r+b.r);
	}
	this.update = function(){
		this.x+=this.vx*this.dt;
		this.y+=this.vy*this.dt;
		if(this.x>100 || this.x<0){
			this.vx*=-1;
		}
		if(this.y>100 || this.y<0){
			this.vy*=-1;
		}
	}
	this.draw = function(cont){
		if(!this.visible)return;
		//cont.drawImage(img,x,y);
		cont.beginPath();111
		cont.fillStyle = "#007";
		//convert from model coordinates x,y, r to sceen ones, px, py,pr
		var px = this.x*gameView.w/100;
		var py = gameView.h-gameView.h*this.y/100;
		var pr = this.r*gameView.w/100;
		
		cont.drawImage(imgBee,px,py,25,25);
		/*
		cont.arc(px,py,pr,0,2*Math.PI);
		cont.strokeStyle = this.c;
		cont.fill();
		*/
	}
}

function game_loop(){
	gm.update();
	draw_view(); 
}

function draw_view(){
	if (!gm.running) return;
	var can = document.getElementById("mycanvas");
	var cont = can.getContext("2d");
	/*  clear the canvas */
	cont.fillStyle = "#FFF";
	cont.fillRect(0,0,gameView.w, gameView.h);
	cont.fillStyle ="#00F";
	cont.textBaseline = "top";
	cont.font = "bold "+ 24 + "pt fantasy";
	//cont.fillText("Bubble Game",20,20);
	
	for(var i=0;i<gm.actors.length;i++){
		gm.actors[i].draw(cont);
	}
	for(var i=0;i<gm.airballs.length;i++){
		gm.airballs[i].draw(cont);
	}

}

/*
function bee(x,y){
	this.x=x;
	this.y=y;
}
*/
bubble.prototype.bee = new function(){
	
}
function toggle(){
	gm.running = !gm.running;
}

function shoot(){
	var b = new bee(pewser,0,1);
	b.vx=0;
	b.vy=40;
	gm.airballs.push(b);
	
}

function left (){
	pewser-=2;
}

function right () {
	pewser+=2;
}

var gm = new game_model();

window.setInterval(game_loop,10);



