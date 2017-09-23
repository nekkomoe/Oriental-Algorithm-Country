var mainpanel=function(){};
mainpanel.prototype={
	currentChoice:1,
	/*
		1: start
		2: quit
	*/

	text_title:"東方算法鄉",

	text_menu:[null,"Start","Quit"],

	draw:function(){
		context.save();

		now = new Date();
		this.gameNowTime=this.gameNowTime||0;
		this.gameLastTime=this.gameLastTime||0;
		this.gameNowTime=now;
	    this.fps = Math.round(1000 / (now - this.gameLastTime));
	    this.gameLastTime = now;
	    fps=this.fps;

		context.drawImage(_resource.image.background,0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
		
		context.fillStyle = "#99CCFF";
		context.textAlign='center';
		context.textBaseline='middle';


		var sz=WINDOW_HEIGHT*0.7/this.text_title.length;

        context.font = "bold "+sz+"px Arial";


        for(var i=0;i<this.text_title.length;i++)context.fillText(this.text_title[i], WINDOW_WIDTH/2, WINDOW_HEIGHT*0.15+sz*i+sz/2);


        context.fillStyle = "#9999CC";
        context.font = "bold 30px Arial";
        for(var i=1;i<=this.text_menu.length-1;i++){
        	var stl=context.fillStyle;
        	if(this.currentChoice==i)context.fillStyle="#CCFFFF";
        	context.fillText(this.text_menu[i],WINDOW_WIDTH/1.2,WINDOW_HEIGHT/2+i*30);
        	context.fillStyle=stl;
        }

        context.font = "bold 20px Arial";
        context.textAlign="left";
        context.fillText("TotalResourcesLoadedCounts: "+alreadyLoadCounts,10,30);
        context.fillText("FPS: "+fps,10,70);

		context.restore();

	},
	onKeyUp:function(e){},
	onKeyDown:function(e){
		var evt = e || event;
		var key = evt.keyCode || evt.which || evt.charCode;
		switch(key){
			case KeyEvent.VK_UP:
				if(this.currentChoice>1)this.currentChoice--;else this.currentChoice=2;
			break;
			case KeyEvent.VK_DOWN:
				if(this.currentChoice<2)this.currentChoice++;else this.currentChoice=1;
			break;
			case KeyEvent.VK_ENTER:
				if(this.currentChoice==1){
					if(currentAnimation!=0)cancelAnimationFrame(currentAnimation);
					_scene.init();
				}else if(this.currentChoice==2){
					window.close();
				}
			break;
		}
	},
	animate:function(){
		this.draw();
		currentAnimation=requestNextAnimationFrame(this.animate.bind(this));
	},
	init:function(){
		window.onkeyup=this.onKeyUp.bind(this);
		window.onkeydown=this.onKeyDown.bind(this);
		if(currentAnimation!=0)cancelAnimationFrame(currentAnimation);
		this.animate();
	}
};
