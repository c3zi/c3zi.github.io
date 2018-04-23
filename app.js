(function (snake) {
	const button = document.getElementById("start");
	snake.init();
	button.addEventListener("click",function(e){
    	    snake.init();	
	},false);

	
}(snake))
