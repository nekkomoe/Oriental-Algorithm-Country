var scene=function(){};
scene.prototype={

	gameStartTime:0,
	gameNowTime:0,
	gameLastTime:0,
	gameStop:false,
	gameWin:false,
	gameLose:false,
	fps:0,
	hiscore:0,

	onKeyUp:function(e){
		var evt = e || event;
		var key = evt.keyCode || evt.which || evt.charCode;
		_player.action(key,false);
	},
	onKeyDown:function(e){
		var evt = e || event;
		var key = evt.keyCode || evt.which || evt.charCode;
		switch(key){
			case KeyEvent.VK_ESCAPE:
				this.gameStop=!this.gameStop;
			break;
			case KeyEvent.VK_ENTER:
				this.gameStop=false;
			break;
			default:
				_player.action(key,true);
			break;
		}
	},
	update:function(){
		if(stage_handle.curStage!=-1 && stage_handle.stage[stage_handle.curStage].visible){
			var cur=stage_handle.stage[stage_handle.curStage];
			cur.startTime=cur.startTime||new Date();
			cur.delay=cur.delay||0;
			if(now-cur.startTime>cur.delay){
				cur.build();
			}
		}else{
			if(stage_handle.curStage!=-1)stage_handle.curStage++;
			if(stage_handle.curStage==stage_handle.stage.length){
				stage_handle.curStage=-1;
				this.gameWin=true;
			}
		}

		_task.foreach(function(){
			var e=this.vars;
			if(e.visible && now-e.createTime>e.taskDelay){
				e.task();
				e.visible=false;
			}
		});

		if(_player.visible){
			_player.update();
		}

		_food.foreach(function(){
			var e=this.vars;
			if(e.visible){
				e.update();
			}
		});

		_boom.foreach(function(){
			var e=this.vars;
			if(e.visible){
				e.update();
			}
		});

	    _bullet.foreach(function(){
			var e=this.vars;
			if(e.visible && now-e.createTime>e.taskDelay){
				e.update();
				e.crash();
			}
		});

		_laser.foreach(function(){
			var e=this.vars;
			if(e.visible && now-e.createTime>e.taskDelay){
				e.update();
				e.crash();
			}
		});

		_enemy.foreach(function(){
			var e=this.vars;
			if(e.visible && now-e.createTime>e.taskDelay){
				e.update();
				e.crash();
			}
		});

		
		if(_player.life<=0){
			// this.gameLose=true;
		}


		if(!storage.getItem('hiscore'))storage.setItem('hiscore',0);
		this.hiscore=Math.max(parseInt(storage.getItem('hiscore')),_player.score);
		storage.setItem('hiscore',this.hiscore);
	},
	draw:function(){
		context.save();

		context.drawImage(_resource.image.background,0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
		context.setAlpha(0.5);
		context.fillStyle="black";
		context.fillRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
		context.setAlpha(1);

		if(_player.visible){
			_player.draw();
		}

		_food.foreach(function(id){
			var e=this.vars;
			if(e.visible){
				e.draw();
			}
		});

		_boom.foreach(function(id){
			var e=this.vars;
			if(e.visible){
				e.draw();
			}
		});

		_bullet.foreach(function(){
			var e=this.vars;
			if(e.visible && now-e.createTime>e.taskDelay){
				e.draw();
			}
		});

		_laser.foreach(function(){
			var e=this.vars;
			if(e.visible && now-e.createTime>e.taskDelay){
				e.draw();
			}
		});

		_enemy.foreach(function(){
			var e=this.vars;
			if(e.visible && now-e.createTime>e.taskDelay){
				e.draw();
			}
		});

		context.fillStyle = "#9999CC";
        context.font = "bold 20px Arial";
        
        context.textAlign='left';
		context.textBaseline='left';

        context.fillText("HiScore",WINDOW_GAME_WIDTH+20,50);
        context.fillText(this.hiscore,WINDOW_GAME_WIDTH+20+110,50);
        context.fillText("Score",WINDOW_GAME_WIDTH+20,80);
        context.fillText(_player.score,WINDOW_GAME_WIDTH+20+110,80);
        context.fillText("Player",WINDOW_GAME_WIDTH+20,130);
        context.fillText(_player.life,WINDOW_GAME_WIDTH+20+110,130);
        context.fillText("Power",WINDOW_GAME_WIDTH+20,160);
        context.fillText(_player.power,WINDOW_GAME_WIDTH+20+110,160);
        context.fillText("Point",WINDOW_GAME_WIDTH+20,190);
        context.fillText(_player.point,WINDOW_GAME_WIDTH+20+110,190);
        context.fillText("Graze",WINDOW_GAME_WIDTH+20,220);
        context.fillText(_player.graze,WINDOW_GAME_WIDTH+20+110,220);
        context.fillText("FPS",WINDOW_GAME_WIDTH+20,250);
        context.fillText(this.fps,WINDOW_GAME_WIDTH+20+110,250);
        context.fillText("Time",WINDOW_GAME_WIDTH+20,280);
        context.fillText(Math.round((this.gameNowTime-this.gameStartTime)/1000),WINDOW_GAME_WIDTH+20+110,280);

		context.drawImage(_resource.image.logo,WINDOW_GAME_WIDTH,315);

		context.textBaseline='top';		
		if(stage_handle.curStage!=-1 && stage_handle.stage[stage_handle.curStage].visible){
			var cur=stage_handle.stage[stage_handle.curStage];
			context.fillText(cur.name,5,5);
		}

		context.restore();
	},
	animate:function(){
		now = new Date();
		this.gameNowTime=now;
	    this.fps = Math.round(1000 / (now - this.gameLastTime));
	    this.gameLastTime = now;
	    fps=this.fps;
	    if(fps<=0||fps>=100)fps=this.fps=60;

	    if(!this.gameStop && !this.gameLose){
			this.update();
			this.draw();
		}
		if(this.gameStop || this.gameWin || this.gameLose){
	    	context.save();
	    	context.fillStyle = "#9999CC";
	        context.font = "bold 100px Arial";
	        context.textAlign='center';
			context.textBaseline='middle';

			if(this.gameLose){
				context.fillText("Lose",WINDOW_WIDTH/2,WINDOW_HEIGHT/2);
			}else if(this.gameWin){
				context.fillText("Win",WINDOW_WIDTH/2,WINDOW_HEIGHT/2);
			}else if(this.gameStop){
				context.fillText("Stop",WINDOW_WIDTH/2,WINDOW_HEIGHT/2);
			}
			context.restore();
	    }
		currentAnimation=requestNextAnimationFrame(this.animate.bind(this));
	},
	init:function(){
		window.onkeyup=this.onKeyUp.bind(this);
		window.onkeydown=this.onKeyDown.bind(this);
		if(currentAnimation!=0)cancelAnimationFrame(currentAnimation);

		sfx_demo.init();

		_player.init();

		fps=0;
		this.fps=0;

		this.gameStartTime=new Date();
		this.gameNowTime=this.gameStartTime;
		this.gameLastTime=this.gameStartTime;
		this.gameStop=false;
		this.gameWin=false;
		this.gameLose=false;

		this.hiscore=0;

		this.animate();
	}
};