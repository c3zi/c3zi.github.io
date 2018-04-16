(function (snake) {
	const button = document.getElementById("start");
	button.addEventListener("click",function(e){
    	snake.init();	
	},false);

	
}(snake))