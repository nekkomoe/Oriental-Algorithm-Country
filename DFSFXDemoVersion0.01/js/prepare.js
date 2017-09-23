var storage = window.localStorage;	//保存分数

var stage_handle;

var alreadyLoadCounts = 0;		//已经加载资源数

var fps;	//当前帧频
var now;	//当前时间

var WINDOW_WIDTH=935;
var WINDOW_HEIGHT=700;
var WINDOW_GAME_WIDTH=WINDOW_WIDTH*0.65;
var WINDOW_SCORE_WIDTH=WINDOW_WIDTH*0.25;
var WINDOW_GAME_HEIGHT=WINDOW_HEIGHT;
var WINDOW_SCORE_WIDTH=WINDOW_HEIGHT;

var MAX_ENEMY_TOTAL=1000;
var MAX_BULLET_TOTAL=1000;
var MAX_FOOD_TOTAL=1000;
var MAX_BOOM_TOTAL=1000;
var MAX_LASER_TOTAL=1000;
var MAX_TASK_TOTAL=1000;

var _enemy=[];
var _bullet=[];
var _food=[];
var _boom=[];
var _laser=[];
var _task=[];

var currentAnimation=0;


//Virtual Key Codes
var KeyEvent={
	VK_SHIFT: 16,
	VK_ENTER: 13,
	VK_ESCAPE: 27,
	VK_LEFT: 37,
	VK_UP: 38,
	VK_RIGHT: 39,
	VK_DOWN: 40,
	VK_A: 65,
	VK_B: 66,
	VK_C: 67,
	VK_D: 68,
	VK_E: 69,
	VK_F: 70,
	VK_G: 71,
	VK_H: 72,
	VK_I: 73,
	VK_J: 74,
	VK_K: 75,
	VK_L: 76,
	VK_M: 77,
	VK_N: 78,
	VK_O: 79,
	VK_P: 80,
	VK_Q: 81,
	VK_R: 82,
	VK_S: 83,
	VK_T: 84,
	VK_U: 85,
	VK_V: 86,
	VK_W: 87,
	VK_X: 88,
	VK_Y: 89,
	VK_Z: 90
};


Array.prototype.foreach = function (callback) {
    for (var i = 0; i < this.length; i++) {
        callback.apply(this[i], [i]);
    }
};

function BoomAndAddFood(arr){
	arr.foreach(function(){
		var e=this.vars;
		if(e.visible && !e.isGood){
			e.visible=false;
			if(Math.random()>0.5)
				addFood({
					visible:true,
					x:e.x,
					y:e.y,
					update:foodFunctions.update.follow
				});
		}
	});
}

function distance(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

var NONEACTION=function(){}