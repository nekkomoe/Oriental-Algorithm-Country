var player=function(){};
player.prototype={

	INTERVAL_MOVE:150,
	INTERVAL_SHOOT:10,
	LOW_SPEED:100,
	SPEED:300,
	SHOOT_SPEED:1000,
	lastMoveTime:0,
	lastShootTime:0,

	x:0,
	y:0,
	onLeft:false,
	onRight:false,
	onUp:false,
	onDown:false,
	onShoot:false,
	onLowSpeed:false,
	onSpellCard:false,
	onPlayingSpellCard:false,
	visible:true,
	isGod:false,

	life:6,					//剩余生命
	power:1,
	point:0,
	graze:0,
	score:0,

	currentPosition:0,		//当前图片位置
	INTERVAL_POSITION:100,
	lastPositionTime:0,

	shoot:function(){
		addBullet({
			x:this.x,
			y:this.y,
			vx:0,
			vy:-this.SHOOT_SPEED,
			visible:true,
			isGood:true
		});
		this.lastSnipeTime=this.lastSnipeTime||new Date();
		if(now-this.lastSnipeTime>300){
			this.lastSnipeTime=now;
			for(var i=0;i<MAX_ENEMY_TOTAL;i++){
				var e=_enemy[i].vars;
				if(e.visible){
					var tX=e.x,tY=e.y;
					var dis=Math.sqrt(Math.pow(tX-this.x,2)+Math.pow(tY-this.y,2));
					addBullet({
						identify:e,
						attackBlood:Math.min(5,this.power),
						visible:true,
						isGood:true,
						x:this.x,
						y:this.y,
						update:function(){
							var e=this.identify;
							if(!e.visible)this.visible=false;
							var tX=e.x,tY=e.y,v=500;
							var dis=Math.sqrt(Math.pow(tX-this.x,2)+Math.pow(tY-this.y,2));
							this.vx=(tX-this.x)*v/dis,
							this.vy=(tY-this.y)*v/dis,
							bulletFunctions.update.normal.bind(this)();
						},
						draw:function(){
							context.save();
							var t=_resource.cell.spellcard;
                			context.drawImage(_resource.image.etama1, t.x,t.y,t.w,t.h,this.x-t.w/2,this.y-t.h/2, t.w, t.h);
                			context.restore();
						}
					});
					break;
				}
			}
		}
	},
	onDestroy:function(){
		this.power=1;
		this.visible = false;
        this.life--;
        addBoom(this);
        addTask({
        	visible:true,	taskDelay:1000,
        	task:function(){
        		_player.isGod = true;
            	_player.visible = true;
            	addTask({
            		visible:true,taskDelay:5000,
		        	task:function(){
		        		_player.isGod=false;
		        	}
            	});
        	}
        });
	},
	playSpellCard:function(){
		
		BoomAndAddFood(_bullet);

		this.onPlayingSpellCard=false;
	},
	action:function(e,isKeyDown){
		switch(e){
			case KeyEvent.VK_UP:
				this.onUp=isKeyDown;
			break;
			case KeyEvent.VK_DOWN:
				this.onDown=isKeyDown;
			break;
			case KeyEvent.VK_LEFT:
				this.onLeft=isKeyDown;
			break;
			case KeyEvent.VK_RIGHT:
				this.onRight=isKeyDown;
			break;
			case KeyEvent.VK_Z:
				this.onShoot=isKeyDown;
			break;
			case KeyEvent.VK_X:
				this.onSpellCard=isKeyDown;
			break;
			case KeyEvent.VK_SHIFT:
				this.onLowSpeed=isKeyDown;
			break;
		}
	},

	update:function(){

		this.score=this.point*17+this.graze*23;

		if(now-this.lastPositionTime>this.INTERVAL_POSITION){
			this.lastPositionTime=now;
			if(this.currentPosition<_resource.cell.player.length-1)this.currentPosition++;
			else this.currentPosition=0;
		}
		if(now-this.lastShootTime>this.INTERVAL_SHOOT && this.onShoot){
			this.lastShootTime=now;
			this.shoot();
		}
		if(this.onPlayingSpellCard==false && this.onSpellCard==true){
			this.onPlayingSpellCard=true;
			this.playSpellCard();
		}
		var speed=(this.onLowSpeed?this.LOW_SPEED:this.SPEED)/fps;
		if(this.onUp)this.y-=speed;
		if(this.onDown)this.y+=speed;
		if(this.onLeft)this.x-=speed;
		if(this.onRight)this.x+=speed;
		if(this.x<16)this.x=16;
		if(this.x>WINDOW_GAME_WIDTH-16)this.x=WINDOW_GAME_WIDTH-16;
		if(this.y<24)this.y=24;
		if(this.y>WINDOW_GAME_HEIGHT-24)this.y=WINDOW_GAME_HEIGHT-24;
	},

	draw:function(){
		context.save();

		context.setAlpha(this.isGod?0.5:1);

		var cur=_resource.cell.player[this.currentPosition];
		context.drawImage(_resource.image.player,
			cur.x,cur.y,cur.w,cur.h,
			this.x-cur.w/2,this.y-cur.h/2,cur.w,cur.h);
		if(this.onLowSpeed){
			context.beginPath();
			context.fillStyle = "red";
			context.arc(this.x, this.y, 3, 0, 2 * Math.PI);
			context.fill();
			context.beginPath();
			context.fillStyle = "white";
			context.arc(this.x, this.y, 2, 0, 2 * Math.PI);
			context.fill();
		}
		if(this.isGod){
			
			this.last_god_wing=this.last_god_wing || 0;
			this.now_god_wing=this.now_god_wing || 0;
			
			var cur=_resource.cell.wingBlue[this.now_god_wing];

		    context.save();
		    context.drawImage(
		    	_resource.image.wing,
		    	cur.x,cur.y,cur.w,cur.h,
		    	this.x,this.y-cur.h/2,
		    	cur.w,cur.h
		    );
			context.translate(canvas.width,0);
			context.scale(-1,1);
			context.drawImage(
		    	_resource.image.wing,
		    	cur.x,cur.y,cur.w,cur.h,
		    	WINDOW_GAME_WIDTH*1.5-this.x+cur.w/2,(this.y-cur.h/2),
		    	cur.w,cur.h
		    );
		    context.restore();

			if(now-this.last_god_wing>70){
				this.last_god_wing=now;
				this.now_god_wing++;
		    	if(this.now_god_wing==_resource.cell.wingBlue.length)this.now_god_wing=0;
			}
		}
		context.restore();
	},

	init:function(){
		this.lastMoveTime=new Date();
		this.lastShootTime=new Date();
		this.lastPositionTime=new Date();
		this.onLeft=false;
		this.onRight=false;
		this.onUp=false;
		this.onDown=false;
		this.onShoot=false;
		this.onLowSpeed=false;
		this.onSpellCard=false;
		this.visible=true;
		this.onPlayingSpellCard=false;
		this.isGod=false;
		this.life=6;
		this.power=1;
		this.point=0;
		this.graze=0;
		this.x=WINDOW_GAME_WIDTH/2;
		this.y=WINDOW_GAME_HEIGHT-50;
	}
};