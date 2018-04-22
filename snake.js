const snake = (function (window, document) {
	const speed = 80;
	let x = 0;
	let y = 0;
	let gameloop;
	let snakeBody = [
		{x: 0, y: 0},
		{x: 15, y: 0},
		{x: 30, y: 0},
		{x: 45, y: 0},
	];	
	let bonus = null;
	let ctx;
	let lastDirection = null;

	const reset = function()
	{
		ctx.clearRect(0, 0, 800, 600);
		document.getElementById('points').innerHTML = 0;
		
		snakeBody = [
			{x: 0, y: 0},
			{x: 15, y: 0},
			{x: 30, y: 0},
			{x: 45, y: 0},
		];	

		x = 0;
		y = 0;
		bonus = null;
		lastDirection = null;
		clearInterval(gameloop);
		gameloop = null;
	}

	const drawSnake = function()
	{
		let i = 0;
		for (const snakePart of snakeBody) {
			if (i < 255) {
				++i;
			}
			ctx.fillStyle = 'rgb(43, ' + Math.floor(255 - i)  + ', 71)';
        	ctx.strokeStyle = '#219538';
        	ctx.strokeRect(snakePart.x, snakePart.y, 15, 15);
        	ctx.fillRect(snakePart.x, snakePart.y, 15, 15);
		}
	}

	const bonusPoint = function()
	{
		if (bonus === null) {
			const randomX = Math.floor(Math.random()*780);
			const randomY = Math.floor(Math.random()*545);

			const pointX = Math.abs(randomX - (randomX % 15));
			const pointY = Math.abs(randomY - (randomY % 15));

			for (const snakePart of snakeBody) {
				if (pointX === snakePart.x && pointY === snakePart.y) {
					console.log('THE SAME');
					bonusPoint();
					return;	
				}
			}

			bonus = {x: pointX, y: pointY};
			console.log('BONUS: ', bonus);
		}

		ctx.fillStyle = '#FF5733';
    	ctx.strokeStyle = '#FFC300';
    	ctx.fillRect(bonus.x, bonus.y, 15, 15);
    	ctx.strokeRect(bonus.x, bonus.y, 15, 15);
    }

    const recalculateSnake = function(direction) {
    	const index = snakeBody.length - 1;
		const head = snakeBody[index];
		if (direction === 'right' && head.x >= 795) {
			snakeBody[index].x = 0;			
		}

		if (direction === 'left' && head.x < 0) {
			snakeBody[index].x = 795;
		}

		if (direction === 'down' && head.y >= 600) {
			snakeBody[index].y = 0;
		}

		if (direction === 'up' && head.y < 0) {
			snakeBody[index].y = 585;
		}

    }

	const clearSnake = function()
	{
		for (const snakePart of snakeBody) {
	    	ctx.clearRect(snakePart.x-1, snakePart.y-1, 17, 17);  	  
		}		
	}

	const draw = function(direction)
	{
		let head = snakeBody[snakeBody.length-1];

		let x = head.x;
		let y = head.y;

		if (direction === 'down') {
			y += 15;
		}

		if (direction === 'right') {
			x += 15;
		}

		if (direction === 'up')	{
			y -= 15;
		}

		if (direction === 'left') {
			x -= 15;
		}

		if (isCollision(x, y)) {
			ctx.font = "italic bold 30px Arial";
			ctx.textBaseline = "middle";
			ctx.fillText('GAME OVER', 300, 200);
			console.log('GAME OVER');
			console.log('Points:' + snakeBody.length);
			clearInterval(gameloop);
			return;
		}

		clearSnake();
		snakeBody.shift();
		snakeBody.push({x: x, y: y})
	
		recalculateSnake(direction);
		drawSnake();
		
		bonusPoint();	
		if (bonus.x === x && bonus.y === y) {
			snakeBody.unshift({x: snakeBody[0].x-15, y:0});
			bonus = null;
			document.getElementById('points').innerHTML = snakeBody.length - 4;
		}


	}

	const init = function() {

		const c = document.getElementById("myCanvas");
		ctx = c.getContext("2d");

		reset();
		let direction = 'right';
		let lastDirectionTime = null;
		// clearSnake();



		drawSnake();

		document.onkeydown = function(event) {
	        keyCode = window.event.keyCode; 
	        keyCode = event.keyCode;
	        
	        const d = new Date();
	        const currentTime = d.getTime();

	        if (lastDirectionTime !== null && (currentTime-lastDirectionTime) < speed) {
	        	draw(direction);
	        	return;
	        }

	        switch(keyCode) {	  
	        	case 32:
	        		clearInterval(gameloop);
	        		gameloop = null;
	        		end = true;    
	        		return false;
	        		break;

		        case 37: 
		        	if (direction !== 'right') {
		        		direction = 'left';			        	
		        	}
		            
		          	break;
		        case 39:
		        	if (direction !== 'left') {
		        		direction = 'right';
		        	}		          
		          	
		          	break;
		        case 38:		          
		        	if (direction !== 'down') {
		        		direction = 'up';
		        	}
		          	
		          	break;
		        case 40:		         
		        	if (direction !== 'up') {
		        		direction = 'down';		          	
		        	} 

		          	break;		
			}	

			const date = new Date();
			lastDirectionTime = date.getTime();
			
		}

		gameloop = setInterval(function() {
			draw(direction);

		}, speed);
	}

	const isCollision = function (x, y) {
		for (const item of snakeBody) {
			if (item.x === x && item.y === y) {
				console.log('COLLISION');
				return true;
			}
		}

		return false;
	}

	return {
		init: init
	}

}(window, document));
