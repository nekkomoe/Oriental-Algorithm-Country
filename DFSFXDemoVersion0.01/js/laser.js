var laser=function(){};
laser.prototype={
	vars:{},
	init:function(vars){
		this.vars={
			createTime:new Date(),
			taskDelay:0,	//距离真实释放延时
			delay:0,		//释放延迟
			wait:0,			//释放时长
			visible:false,
			x:0,			//px
			y:0,			//px
			rotate:0,		//radian,clockwise,base line 3'o clock
			length:0,		//px
			turnOn:false,	//is turn on
			draw:laserFunctions.draw.normal,
			update:laserFunctions.update.normal,
			crash:laserFunctions.crash.normal,
			onDestroy:laserFunctions.onDestroy.normal
		};
		for(var i in vars){
			this.vars[i]=vars[i];
		}
	}
};

var laserFunctions={
	draw:{
		normal:function(){
			if(this.turnOn)laserFunctions.draw.turnOn.bind(this)();
			else laserFunctions.draw.turnOff.bind(this)();
		},
		turnOn:function(){
			
			if(now-this.createTime>this.taskDelay){
				context.save();
				context.translate(this.x,this.y);
				context.rotate(this.rotate);

				var cell=_resource.cell.laser5;
				this.curIndex=this.curIndex||0;
				this.curIndex+=10/fps;
				if(Math.round(this.curIndex)>=cell.length)this.curIndex=0;
				var id=Math.round(this.curIndex);

				context.drawImage(
					_resource.image.laser5,
					cell[id].x,cell[id].y,cell[id].w,cell[id].h,
					0,0-cell[id].h/2,this.length,cell[id].h
				);
				context.restore();
			}
		},
		turnOff:function(){
			
			if(now-this.createTime>this.taskDelay){
				context.save();
				context.translate(this.x,this.y);
				context.rotate(this.rotate);
				context.beginPath();
				context.moveTo(0,0);
				context.lineTo(this.length,0);
				context.closePath();
				context.lineWidth=2;
				context.setAlpha((now-this.createTime-this.taskDelay)/(this.delay));
				context.strokeStyle="white";
				context.stroke();
				context.restore();
			}
		}
	},
	update:{
		normal:function(){
			this.rotate%=2*Math.PI;
			if(this.turnOn)laserFunctions.update.turnOn.bind(this)();
			else laserFunctions.update.turnOff.bind(this)();
		},
		turnOn:function(){
			laserFunctions.update.turnOff.bind(this)();
		},
		turnOff:function(){
			
			if(now-this.createTime>this.taskDelay){
				if(now-this.createTime>this.delay+this.taskDelay){
					this.turnOn=true;
				}
				if(now-this.createTime>this.delay+this.wait+this.taskDelay){
					this.turnOn=false;
					this.onDestroy();
				}
			}
		}
	},
	crash:{
		normal:function(){
			if(this.turnOn)laserFunctions.crash.turnOn.bind(this)();
			else laserFunctions.crash.turnOff.bind(this)();
		},
		turnOn:function(){
			
			if(now-this.createTime>this.taskDelay){
	            if(_player.visible && !_player.isGod){
	                if (
	                    distance(_player.x,_player.y,this.x,this.y)<=this.length   &&
	                    Math.abs((90/180*Math.PI-Math.atan2(_player.x-this.x,_player.y-this.y))-this.rotate)<2/180*Math.PI
	                ) {
	                    // this.visible = false;
	                    _player.onDestroy();
	                }
	            }
	        }
		},
		turnOff:function(){}
	},
	onDestroy:{
		normal:function(){
			this.visible=false;
		}
	}
};

function addLaser(vars){
	for(var i=0;i<MAX_LASER_TOTAL;i++){
		if(!_laser[i].vars.visible){
			_laser[i].init(vars);
			return i;
		}
	}
	return -1;
}