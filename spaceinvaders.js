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

In this version we add airballs that can pop bubbles ...

Airballs are just bubbles but they are updated differently. 
If any airball collides with a bubble it disappears.
The airball itself disappears when it gets too close to a wall.
*/

// the gameView is an object describing the view on the screen...
gameView = {w:400, h:400};

/*
The game model takes place in a 100x100 board where the bubbles
stay in the top 80% of the board...
*/
function game_model(){
	this.directionRight = true;
	this.moveDownLevel = false;
	this.invaders=[];
	this.airballs=[];
	this.running=false;
	this.startTime = 0;
	this.theStraw = new straw();
	this.update = function(){
		// Change Bubble direction if one runs into an edge!
		for(var i = 0;  i < this.invaders.length; i++){
			var bubb = this.invaders[i];
			if (bubb.x<bubb.r && bubb.active) {
				this.directionRight = true;
				this.moveDownLevel = true;
			} else if (bubb.x>100-bubb.r && bubb.active) {
				this.directionRight = false;
				this.moveDownLevel = true;
			}
		}
		// to update the model just update all of the bubbles
		for(var i=0; i<this.invaders.length; i++){
			this.invaders[i].update();
		}
		this.moveDownLevel = false;
		/*
		if (this.moveDownLevel) {
			this.moveDownLevel = false;
			for(var i=0; i<this.bubbles.length; i++){
				this.bubbles[i].update();
			}
		}
		*/
		// check for collisions
		var airballList = this.airballs;
		for(var i=airballList.length-1; i>=0; i--){
			var a = this.airballs[i];
			a.update();
			for(var j=0; j<this.invaders.length; j++){
				var b = this.invaders[j];
				//console.log("test intersection "+[a,b])
				if (a.intersects(b)){
					b.active=false;
					//console.log("intersect!!! ");
				}
			}
			if (a.y > 95 || a.x<5 || a.x > 95) {
				this.airballs = this.airballs.slice(0,i).concat(this.airballs.slice(i+1));
				// remove element a from airballList
				
			}
		}
	}

	for(var i=0;i<10;i++){
		var bx=10 + Math.round(Math.random()*80);
		var by=30+Math.round(Math.random()*70);
		this.invaders.push(new invader(bx,by,4) );
	}
	/*	
	for(var i=0; i<4;i++){
		var bx=Math.round(Math.random()*100);
		var by=35;
		var b = new bubble(bx,by,1);
		//b.vx *= 4; b.vy*=4;
		this.airballs.push(b);
	}
	*/
}

function bubble(x,y,r){
	this.x=x;
	this.y=y;
	this.vx=Math.random()*10;
	this.vy=Math.random()*10;
	this.r=r;
	this.lastTime = +new Date();
	this.active=true;
	this.update = function(){
		// to update a bubble calculate its new position
        // based on how much time has elapsed since it was last updated
		var t = +new Date();
		var dt = t-this.lastTime;
		this.lastTime=t;
		this.x += this.vx*dt/1000.0;
		this.y += this.vy*dt/1000.0;
		// and change velocity if it runs into an edge!
		if (this.x<this.r || this.x>100-this.r) this.vx *= -1;
		if (this.y<this.r|| this.y>100-this.r) this.vy *= -1;		
	}
	this.draw = function(cont){
		if (!this.active) return;
		gScale = Math.min(gameView.w,gameView.h);
		px = gScale*this.x/100;
		py = gScale*(100-this.y)/100;
		pr = gScale*this.r/100;
		cont.beginPath();
		cont.arc(px,py,pr,0,2*Math.PI,false);
		//cont.strokeStyle="#AAF";
		//cont.stroke();
		cont.fillStyle="#006";
		cont.fill();
	}
	this.intersects = function(b) {
		var dx = this.x -b.x;
		var dy = this.y - b.y;
		var d = Math.sqrt(dx*dx + dy*dy);
		//console.log([this,b,dx,dy,d]);
		return (d < b.r+this.r);
	}
}

function invader(x,y,r){
	this.x=x;
	this.y=y;
//	this.vx= 10;
//	this.vy= 0;
	this.r=r;
	this.lastTime = +new Date();
	this.active=true;
}

invader.prototype.update = function(){
		// to update a bubble calculate its new position
        // based on how much time has elapsed since it was last updated
		var t = +new Date();
		var dt = t-this.lastTime;
		this.lastTime=t;
		if (gm.moveDownLevel) {
			this.y -= 100.0*dt/1000.0
		}
		if (gm.directionRight) {
			this.x += 10.0*dt/1000.0
		} else {
			this.x -= 10.0*dt/1000.0
		}
//		this.x += this.vx*dt/1000.0;
//		this.y += this.vy*dt/1000.0;	
}

invader.prototype.draw = function(cont){
		if (!this.active) return;
		gScale = Math.min(gameView.w,gameView.h);
		px = gScale*this.x/100;
		py = gScale*(100-this.y)/100;
		pr = gScale*this.r/100;
		cont.beginPath();
		cont.arc(px,py,pr,0,2*Math.PI,false);
		//cont.strokeStyle="#AAF";
		//cont.stroke();
		cont.fillStyle="#006";
		cont.fill();
}
invader.prototype.intersects = function(b) {
		var dx = this.x -b.x;
		var dy = this.y - b.y;
		var d = Math.sqrt(dx*dx + dy*dy);
		//console.log([this,b,dx,dy,d]);
		return (d < b.r+this.r);
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
	cont.fillStyle = "#000";
	cont.clearRect(0,0,gameView.w, gameView.h);
	cont.fillStyle ="#00F";
	cont.textBaseline = "top";
	cont.font = "bold "+ 24 + "pt fantasy";
	cont.fillText("Spooce inBaderz",20,20);
	//console.log([gm.bubbles.length,+new Date()]);
	for(var i=0; i<gm.invaders.length; i++){
		gm.invaders[i].draw(cont);
	}
	for(var i=0; i<gm.airballs.length; i++){
		gm.airballs[i].draw(cont);
	}
	draw_straw(cont);

}

function straw(){
    this.x = 200;
}


function draw_straw(cont, straw){
	// we can draw a straw easily using translation and rotation of the context
	cont.fillStyle = "#0F0";
	cont.fillRect(gm.theStraw.x,360,10,45);

}

function restart () {
    gm = new game_model();
    toggle();
    }
function shoot(){
    console.log(gm.theStraw.x);
    var trans = gm.theStraw.x/4;
	var a = new bubble(trans,1,1);
	a.vy = 50;
	a.vx = 0;
	gm.airballs.push(a);
	
}

function left(){
    if(gm.theStraw.x > 0) {
        gm.theStraw.x -= 20;
	}
}

function right(){
    console.log(gm.theStraw.x);
	if(gm.theStraw.x < 380) {
        gm.theStraw.x += 20;
	}
}


function toggle(){
	gm.running = !gm.running;
}

function initialize() {
	var c = document.getElementById("mycanvas");
	gm.running=true;
	document.onkeydown = function(evt){
		if (evt.keyCode==' '.charCodeAt(0)) {
			shoot();
		}else if (evt.keyCode=='A'.charCodeAt(0)){
			left();
		} else if (evt.keyCode='D'.charCodeAt(0)){
			right();
		}
		//console.log("evt = "+evt.keyCode+ ['A'.charCodeAt(0),'D'.charCodeAt(0),' '.charCodeAt(0)]);
	}
	//alert("added keydown");
}

var gm = new game_model();

window.setInterval(game_loop,10);
window.onload = initialize;

