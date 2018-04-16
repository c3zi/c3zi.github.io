const snake = (function (window, document) {
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
		clearSnake();
		if (bonus) {
			clearBonus();	
		}
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
			ctx.fillStyle = 'rgb(43, ' + Math.floor(100 +  i)  + ', 71)';
			// ctx.fillStyle = '#2BB647';
        	ctx.strokeStyle = '#219538';
        	ctx.strokeRect(snakePart.x, snakePart.y, 15, 15);
        	ctx.fillRect(snakePart.x, snakePart.y, 15, 15);
        	i++;
		}
	}

	const clearSnake = function()
	{
		for (const snakePart of snakeBody) {
	    	ctx.clearRect(snakePart.x-1, snakePart.y-1, 17, 17);  	  
		}		
	}

	const clearBonus = function()
	{
    	ctx.clearRect(bonus.x-1, bonus.y-1, 17, 17);  	  		
	}

	const bonusPoint = function()
	{
		if (bonus === null) {
			const randomX = Math.floor(Math.random()*799);
			const randomY = Math.floor(Math.random()*599);

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
		}

		ctx.fillStyle = '#FF5733';
    	ctx.strokeStyle = '#FFC300';
    	ctx.fillRect(bonus.x, bonus.y, 15, 15);
    	ctx.strokeRect(bonus.x, bonus.y, 15, 15);
    }

	const draw = function(direction)
	{
		bonusPoint();
		const head = snakeBody[snakeBody.length-1];

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

		if (x > 800 || x < 0 || y >= 600 || y < 0 || isCollision(x, y)) {
			ctx.font = "italic bold 30px Arial";
			ctx.textBaseline = "middle";
			ctx.fillText('GAME OVER', 300, 200);
			console.log('GAME OVER');
			console.log('Points:' + snakeBody.length);
			clearInterval(gameloop);
			return;
		}

		if (bonus.x === x && bonus.y === y) {
			snakeBody.unshift({x: snakeBody[0].x-15, y:0});
			bonus = null;
			document.getElementById('points').innerHTML = snakeBody.length - 4;
		}

		clearSnake();
		snakeBody.shift();
		snakeBody.push({x: x, y: y})
		drawSnake();
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

	        if (lastDirectionTime !== null && (currentTime-lastDirectionTime) < 80) {
	        	draw(direction);
	        	return;
	        }

	        switch(keyCode) {	      
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

		}, 80);
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
