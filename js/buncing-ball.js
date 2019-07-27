
	var ctx;
	var mousedown = false;
	var gravity = 4;
	var fricktionK = 0.98;
	var bouncyness = 0.9;
	var forceFactor = 0.3;
	var balls = new Array();
	var mousePos = new Array();
	var collision = {};

	// Debug
	var cons = $("#console");
	var collide=0;

	// Events
	function onMouseDown(evt) {
		mousedown = true;
		mousePos['downX'] = evt.pageX;
		mousePos['downY'] = evt.pageY;
		mousePos['movementX'] = mousePos['downX'];
		mousePos['movementY'] = mousePos['downY'];
	}

	function onMouseMove(evt) {
		if(mousedown) {
			mousePos['movementX'] = evt.pageX;
			mousePos['movementY'] = evt.pageY;
		}
	}

	function onMouseUp(evt){
		mousedown = false;
		mousePos['currentX'] = evt.pageX;
		mousePos['currentY'] = evt.pageY;

		// positionX, positionY, velocityX, velocityY, redius, bouncyness, color
		balls.push(new Ball(mousePos['downX'], mousePos['downY'], (evt.pageX - mousePos['downX']) * forceFactor, (evt.pageY - mousePos['downY']) * forceFactor, 10, bouncyness, random_color()));
	}

	function onwindowResize(){}

	$(document).mousedown(onMouseDown);
	$(document).mouseup(onMouseUp);
	$(document).mousemove(onMouseMove);
	$(window).bind('resize',onwindowResize);

	// Graphics
	function circle(x, y, r, c) {
		// draw a circle
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2, true);
		ctx.closePath();
		// style
		
		ctx.fillStyle = c;
		ctx.fill();
	}

	// FIXME: test
	function draw_line() {
		// draw line when mouse is down
		if(mousedown) {
			// draw a line with dots	
			var vx = (mousePos['movementX'] - mousePos['downX']) * forceFactor;
			var vy = (mousePos['movementY'] - mousePos['downY']) * forceFactor;
			var  x = mousePos['downX'];
			var  y = mousePos['downY'];

			for(var i=0;i<85;i++){
				vy += gravity * 0.2;
				 x += vx * 0.2;
				 y += vy * 0.2;

				circle(x, y, 1, 'green');
			}
			//cons.text("vx: " + vx + " vy: " + vy);
		}
	}
	// TODO: another todo test
	function random_color() {
		var color = ['#00afc4'];
		return color[balls.length % color.length];
	}
	// TODO: 02
	function draw_ball() {

		this.vy += gravity * 0.2; // v = a * t
         this.x += this.vx * 0.2; // s = v * t
         this.y += this.vy * 0.2;

        detectCollision();

        if(this.x - this.r < 0) {
        	this.x = this.r;
        	this.vx *= -1 * this.b;
        }

        if(this.x + this.r > canvas.width) {
        	this.x = canvas.width - this.r;
        	this.vx *= -1 * this.b;
        }

        if(this.y + this.r > canvas.height) {
        	this.y = canvas.height - this.r;
        	//this. b *= 0.7;
        	this.vy *= -1 * this.b;
        	this.vx *= fricktionK;
        }

        if(this.y - this.r < 0) {
        	this.y = this.r;
        	this.vy *= -1 * this.b;
        }

		circle(this.x, this.y, this.r, this.c);
	}


	// Collision detection 
	function detectCollision() {

		for(var i=0;i<balls.length-1;i++) {
			for(var j=i+1;j<balls.length;j++) {

					is_Collision(i, j);
				
			}
		}
	}

	function is_Collision(i, j){
		
		// Collision detection for rectengle
		// if(pointIsInCircle(o1.x - o1.r, o1.y - o1.r, o2)) return true;
		// if(pointIsInCircle(o1.x - o1.r, o1.y + o1.r, o2)) return true;
		// if(pointIsInCircle(o1.x + o1.r, o1.y - o1.r, o2)) return true;
		// if(pointIsInCircle(o1.x + o1.r, o1.y + o1.r, o2)) return true;

		var o1 = balls[i];
		var o2 = balls[j];

		var  dx = o1.x - o2.x;
		var  dy = o1.y - o2.y;
		var  rr = o1.r + o2.r;
		var  sq = Math.sqrt( dx*dx  + dy*dy );
		var dxr = (sq-rr);

		if( sq < rr ) {

			if(!collision[i][j]) {

				console.log(collision[i][j]);

				if(dx>0) {
					o1.x-=dxr;
				} else {
					o1.x+=dxr;
				}
				if(dy>0) {
					o1.y-=dxr;
				} else {
					o1.y+=dxr;
				}
			
				if(o1.vx * o2.vx >= 0) {

					o1.vx += o2.vx * 0.5 * o1.b;
					o2.vx *= -1 * 0.5 * o2.b;

        		} else {

					o1.vx *= -1 * o1.b;
					o2.vx *= -1 * o2.b;
        			
        		}

        		if(o1.vy * o2.vy >= 0) {
    			
        			o1.vy += o2.vy * 0.5 * o1.b;
					o2.vy *= -1 * 0.5 * o2.b;

        		} else {

        			o1.vy *= -1 * balls[i].b;
        			o2.vy *= -1 * o2.b;
        		}

    			// o1.vx *= -1;
    			// o2.vx *= -1;
    			// o1.vy *= -1;
    			// o2.vy *= -1;

		    }

			collision[i][j] = true;
			return true;
		
		} else {

			collision[i][j] = false;
			return false;
		}
		
	}
	// Collision detection helper function for rectengle
	function pointIsInCircle(x, y, o) {
		//if(x > o.x - o.r && x < o.x + o.r && y > o.y - o.r && y < o.y + o.r) return true;
		return false;
	}

	// Object
	function Ball(positionX, positionY, velocityX, velocityY, redius, bouncyness, color) {
		this.id = balls.length;
		this.x = positionX;
		this.y = positionY;
		this.vx = velocityX;
		this.vy = velocityY;
		this.r = redius;
		this.b = bouncyness;
		this.c = color;

		this.draw = draw_ball;

		for(var i=0;i<balls.length+1;i++){
			collision[i] = [];
			collision[i][this.id]=false;
		}
	}

	// Game Loop
	function game_loop() {

		ctx.clearRect(0,0, canvas.width, canvas.height);
		
		for(var i=0;i<balls.length;i++){
			balls[i].draw();
		}
		
		draw_line();
		cons.text("Balls: " + balls.length);

		window.requestAnimationFrame(game_loop);
	}
	// init
	function init() {
		ctx = $('#canvas')[0].getContext('2d');

		canvas.width = $(window).width();
		canvas.height = $(window).height();
		game_loop();
		
	}
	init();