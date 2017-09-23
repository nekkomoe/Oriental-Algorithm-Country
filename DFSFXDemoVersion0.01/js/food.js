var food = function(){};
food.prototype = {
	vars:{},
	init:function(vars){
		this.vars={
			x:0,
			y:0,
			vx:0,	//x速度
			vy:0,	//y速度
			avx:0,	//x加速度
			avy:0,	//y加速度
			visible:false,
			type:"point",		//or "power"
			draw:foodFunctions.draw.normal,
			update:foodFunctions.update.normal,
			crash:foodFunctions.crash.normal
		};
		for(var i in vars){
			this.vars[i]=vars[i];
		}
	}
};

function addFood(vars){
	for(var i=0;i<MAX_FOOD_TOTAL;i++){
		if(!_food[i].vars.visible){
			_food[i].init(vars);
			return i;
		}
	}
	//没有可用食物
	return -1;
}

var foodFunctions = {
	draw:{
		normal:function(){
			context.save();
			var cur=(this.type=="power"?_resource.cell.power:_resource.cell.point);
			context.drawImage(_resource.image.etama2,
					cur.x,cur.y,cur.w,cur.h,
					this.x-cur.w/2,this.y-cur.h/2,cur.w,cur.h);
			context.restore();
		}
	},
	update:{
		normal:function(){
			this.crash();
			if(this.x>WINDOW_GAME_WIDTH || this.x<0 || this.y>WINDOW_GAME_HEIGHT || this.y<0){
                this.visible=false;
            }
            var avx=this.avx||0;
            var avy=this.avy||0;
            var vx=this.vx||0;
            var vy=this.vy||0;
            this.vx+=avx;
            this.vy+=avy;
            this.x+=vx/fps;
            this.y+=vy/fps;
		},
		follow:function(){
			this.crash();

			var curX=this.x;
			var curY=this.y;
			var tarX=_player.x;
			var tarY=_player.y;
			var ang=Math.atan2(tarY-curY,tarX-curX);
			var velocity=200;

			this.x+=velocity*Math.cos(ang)/fps;
			this.y+=velocity*Math.sin(ang)/fps;
		}
	},
	crash:{
		normal:function(){
			if(_player.visible){
                var distance = Math.sqrt(
                    Math.pow(this.x - _player.x, 2)
                    + Math.pow(this.y - _player.y , 2)
                );
                if (distance < 8) {
                    this.visible = false;
                    if(this.type=="point"){
                    	_player.point+=Math.floor(1+Math.random()*5);
                    }else if(this.type=="power"){
                    	_player.power++;
                    }
                }
            }
		}
	}
};