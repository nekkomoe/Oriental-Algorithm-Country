var enemy=function(){};
enemy.prototype={

	vars:{},

    init:function(vars){
        this.vars={
        	x:0,
        	y:0,

        	vx:0,
        	vy:0,

        	blood:0,
			maxblood:0,
			visible:false,

        	currentIndex:0,
        	lastIndexTime:0,
        	INTERVAL_IMAGE_CHANGE:100,

        	lastMoveTime:0,
        	INTERVAL_MOVE:10,

        	lastShootTime:0,
			INTERVAL_SHOOT:300,

			createTime:new Date(),
			taskDelay:0,		

        	draw:enemyFunctions.draw.normal,
        	update:enemyFunctions.update.normal,
        	crash:enemyFunctions.crash.normal,
        	shoot:enemyFunctions.shoot.normal,
        	move:enemyFunctions.move.normal,
        	onDestroy:enemyFunctions.onDestroy.normal

        };

        for(var i in vars){
            this.vars[i]=vars[i];
        }
    }
}

var enemyFunctions = {
	draw:{
		normal:function(){
			context.save();
			var cur=_resource.cell.enemyBlue[this.currentIndex];
			context.drawImage(_resource.image.enemy,
					cur.x,cur.y,cur.w,cur.h,
					this.x-cur.w/2,this.y-cur.h/2,cur.w,cur.h);

			context.textAlign="center";
			context.textBaseline="top";
			context.fillStyle = "#CC99FF";
	        context.font = "bold 20px Arial";
			context.fillText(
				this.blood+"/"+this.maxblood,
				this.x,this.y+cur.h/2
			);
			context.restore();
		},
		magicMatrix:function(){
			context.save();
			var r=this.magicMatrix_r||0;
		    var t=_resource.cell.magicMatrix;
		    this.magicMatrix_rotateAngle=this.magicMatrix_rotateAngle || 0;
		    context.translate(this.x,this.y);
		    context.rotate(this.magicMatrix_rotateAngle / 180 * Math.PI);
		    context.drawImage(_resource.image.etama2,
		        t.x,t.y,t.w,t.h,
		        0-t.w/2+r/2,0-t.h/2+r/2,t.w-r,t.h-r
		    );
		    this.magicMatrix_rotateAngle+=36/fps;
		    this.magicMatrix_rotateAngle%=360;
		    context.restore();
		}
	},
	update:{
		normal:function(){
			if(this.x>WINDOW_GAME_WIDTH || this.x<0 || this.y>WINDOW_GAME_HEIGHT || this.y<0){
                this.visible=false;
            }

			
			
			this.move();

			if(now-this.lastShootTime>this.INTERVAL_SHOOT){
				this.lastShootTime=now;
				this.shoot();
			}
			if(now-this.lastIndexTime>this.INTERVAL_IMAGE_CHANGE){
				this.lastIndexTime=now;
				if(this.currentIndex<_resource.cell.enemyBlue.length-1)this.currentIndex++;
				else this.currentIndex=0;
			}
		}
	},
	crash:{
		normal:function(){
			if(_player.visible && !_player.isGod){
                var distance = Math.sqrt(
                    Math.pow(this.x - _player.x, 2)
                    + Math.pow(this.y - _player.y , 2)
                );
                if (distance < 10) {
                    _player.visible = false;
                    _player.life--;
                    addBoom(_player);
                    setTimeout(function () {
                        _player.isGod = true;
                        _player.visible = true;
                        setTimeout(function () {
                            _player.isGod = false;
                        }, 5000);
                    }, 1000);
                }
            }
		}
	},
	shoot:{
		normal:function(){
			addBullet({
				visible:true,
				x:this.x,
				y:this.y,
				vx:0,
				vy:10
			});
		},
		snipe:function(){
			var tX=_player.x;
			var tY=_player.y;
			var v=this.shootVelocity;
			var dis=distance(tX,tY,this.x,this.y);
			addBullet({
				visible:true,
				x:this.x,
				y:this.y,
				vx:(tX-this.x)*v/dis,
				vy:(tY-this.y)*v/dis
			});
		},
		circle:function(){
			var tot=this.circleTotal||6;
			var angle=this.circleAngle||0;
			var shootVelocity=this.shootVelocity||10;
			for(var i=1;i<=tot;i++){
				var ang=angle+360/tot*(i-1)*Math.PI/180;
				addBullet({
					visible:true,
					x:this.x,
					y:this.y,
					vx:shootVelocity*Math.cos(ang),
					vy:shootVelocity*Math.sin(ang)
				});
			}
		},
		circleWithBounce:function(){
			var tot=this.circleTotal||6;
			var angle=this.circleAngle||0;
			var shootVelocity=this.shootVelocity||10;
			for(var i=1;i<=tot;i++){
				var ang=angle+360/tot*(i-1)*Math.PI/180;
				addBullet({
					visible:true,
					x:this.x,
					y:this.y,
					vx:this.shootVelocity*Math.cos(ang),
					vy:this.shootVelocity*Math.sin(ang),
					bounceTimes:this.bulletBounceTimes,
					update:function(){
						bulletFunctions.update.normalWithUncheck.bind(this)();
						bulletFunctions.update.bounce.bind(this)();
					}
				});
			}
		}
	},
	move:{
		normal:function(){
			var vx=this.vx||0;
            var vy=this.vy||0;
            this.x+=this.vx/fps;
            this.y+=this.vy/fps;
		},
		moveTo:function(){
			var sX=this.sourceX;
			var sY=this.sourceY;
			var tX=this.targetX;
			var tY=this.targetY;
			var v=this.moveVelocity;
			var dis=Math.sqrt(Math.pow(tX-sX,2)+Math.pow(tY-sY,2));
			var dis2=Math.sqrt(Math.pow(tX-this.x,2)+Math.pow(tY-this.y,2));
			if(Math.abs(dis2)>5){
				this.x+=(tX-sX)*v/dis/fps;
				this.y+=(tY-sY)*v/dis/fps;
			}else{
				this.moveToOver=true;
			}
		}
	},
	onDestroy:{
		normal:function(){
			this.visible = false;
            addBoom(this);
            addFood({
                x:this.x,
                y:this.y,
                vx:0,
                vy:100,
                visible:true,
                update:foodFunctions.update.follow,
                type:["point","power"][Math.random()>0.2?0:1]
            });
		}
	}
};


function addEnemy(vars){
	for(var i=0;i<MAX_ENEMY_TOTAL;i++){
		if(!_enemy[i].vars.visible){
			_enemy[i].init(vars);
			return i;
		}
	}
	//无可用敌机
	return -1;
}
