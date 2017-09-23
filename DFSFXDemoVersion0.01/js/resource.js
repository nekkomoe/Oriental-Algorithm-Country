var resource=function(){};
resource.prototype={
	src:[
		"image/logo.png",
	    "image/background.png",
	    "image/loading.png",
	    "image/enemy.png",
	    "image/etama1.png",
	    "image/etama2.png",
	    "image/etama3.png",
	    "image/explosion.png",
	    "image/bubble.png",
	    "image/player.png",
	    "image/plasma.png",
	    "image/wing.png",
	    "image/laser/laser1.png",
	    "image/laser/laser2.png",
	    "image/laser/laser3.png",
	    "image/laser/laser4.png",
	    "image/laser/laser5.png",
	    "image/laser/laser6.png",
	    "image/laser/laser7.png"
	],
	image:{},
	cell:{},
	sound:{},
	init:function(){
		for(var i=this.src.length-1;i>=0;i--){
			var str=this.src[i].split("/");
			var name=str[str.length-1].split(".")[0];
			if(this.src[i].search("image")!=-1){
				this.image[name]=new Image();
		        this.image[name].src=this.src[i];
		        this.image[name].onload=function(){alreadyLoadCounts++;};
		    }
		};

		this.cell.explosion = [
		    {x:   0, y: 0, w: 66, h: 64},
		    {x:  64, y: 0, w: 68, h: 64},
		    {x: 128, y: 0, w: 67, h: 64},
		    {x: 194, y: 0, w: 61, h: 64},
		    {x: 254, y: 0, w: 62, h: 64},
		    {x: 317, y: 0, w: 67, h: 64},
		    {x: 380, y: 0, w: 59, h: 64},
		    {x: 445, y: 0, w: 61, h: 64},
		    {x: 510, y: 0, w: 67, h: 64},
		    {x: 574, y: 0, w: 69, h: 64},
		    {x: 640, y: 0, w: 67, h: 64},
		    {x: 705, y: 0, w: 65, h: 64},
		    {x: 765, y: 0, w: 67, h: 64},
		    {x: 830, y: 0, w: 67, h: 64}
		];

		this.cell.bubble = [
			{x:0,y:0,w:32,h:32},
			{x:32,y:0,w:32,h:32},
			{x:64,y:0,w:32,h:32},
			{x:96,y:0,w:32,h:32},
			{x:128,y:0,w:32,h:32},
			{x:160,y:0,w:32,h:32},
			{x:192,y:0,w:32,h:32},
			{x:224,y:0,w:32,h:32}
		];

		this.cell.player = [
		    {x:   0, y: 0, w: 32, h: 48},
		    {x:  32, y: 0, w: 32, h: 48},
		    {x:  64, y: 0, w: 32, h: 48},
		    {x:  96, y: 0, w: 32, h: 48},
		    {x: 128, y: 0, w: 32, h: 48},
		    {x: 160, y: 0, w: 32, h: 48},
		    {x: 192, y: 0, w: 32, h: 48},
		    {x: 224, y: 0, w: 32, h: 48}
		];

		this.cell.playerLeft = [
		    {x:   0, y: 48, w: 32, h: 48},
		    {x:  32, y: 48, w: 32, h: 48},
		    {x:  64, y: 48, w: 32, h: 48},
		    {x:  96, y: 48, w: 32, h: 48},
		    {x: 128, y: 48, w: 32, h: 48},
		    {x: 160, y: 48, w: 32, h: 48},
		    {x: 192, y: 48, w: 32, h: 48},
		    {x: 224, y: 48, w: 32, h: 48}
		];

		this.cell.spellcard = {
			x:0,	y:112,
			w:16,	h:16
		};

		this.cell.playerRight = [
		    {x: 0, y: 96, w: 32, h: 48},
		    {x: 32, y: 96, w: 32, h: 48},
		    {x: 64, y: 96, w: 32, h: 48},
		    {x: 96, y: 96, w: 32, h: 48},
		    {x: 128, y: 96, w: 32, h: 48},
		    {x: 160, y: 96, w: 32, h: 48},
		    {x: 192, y: 96, w: 32, h: 48},
		    {x: 224, y: 96, w: 32, h: 48}
		];

		this.cell.playerChild = {
			x:64,	y:144,
			w:16,	h:16
		};

		this.cell.enemyBlue = [
			{x:   0, y: 0, w: 32, h: 32},
		    {x:  32, y: 0, w: 32, h: 32},
		    {x:  64, y: 0, w: 32, h: 32},
		    {x:  96, y: 0, w: 32, h: 32},
		    {x: 128, y: 0, w: 32, h: 32}
		    // ,
		    // {x: 160, y: 0, w: 32, h: 32},
		    // {x: 192, y: 0, w: 32, h: 32},
		    // {x: 224, y: 0, w: 32, h: 32},
		    // {x: 256, y: 0, w: 32, h: 32},
		    // {x: 288, y: 0, w: 32, h: 32},
		    // {x: 320, y: 0, w: 32, h: 32},
		    // {x: 252, y: 0, w: 32, h: 32}
		];

		this.cell.magicMatrix = {
			x: 128,
		    y: 64 + 16,
		    w: 128,
		    h: 128
		};

		this.cell.tamaRice = {
			x: 128,
			y: 128,
			w: 32,
			h: 32
		};

		this.cell.plasma = {
			x:0,
			y:0,
			w:70,
			h:70
		};

		this.cell.wingBlue = [
			{x:0+0*580/12,y:172,w:580/12,h:164/2},
			{x:0+1*580/12,y:172,w:580/12,h:164/2},
			{x:0+2*580/12,y:172,w:580/12,h:164/2},
			{x:0+3*580/12,y:172,w:580/12,h:164/2},
			{x:0+4*580/12,y:172,w:580/12,h:164/2},
			{x:0+5*580/12,y:172,w:580/12,h:164/2},
			{x:0+6*580/12,y:172,w:580/12,h:164/2},
			{x:0+7*580/12,y:172,w:580/12,h:164/2},
			{x:0+8*580/12,y:172,w:580/12,h:164/2},
			{x:0+9*580/12,y:172,w:580/12,h:164/2},
			{x:0+10*580/12,y:172,w:580/12,h:164/2},
			{x:0+11*580/12,y:172,w:580/12,h:164/2},

			{x:0+0*580/12,y:254,w:580/12,h:164/2},
			{x:0+1*580/12,y:254,w:580/12,h:164/2},
			{x:0+2*580/12,y:254,w:580/12,h:164/2},
			{x:0+3*580/12,y:254,w:580/12,h:164/2},
			{x:0+4*580/12,y:254,w:580/12,h:164/2},
			{x:0+5*580/12,y:254,w:580/12,h:164/2},
			{x:0+6*580/12,y:254,w:580/12,h:164/2},
			{x:0+7*580/12,y:254,w:580/12,h:164/2},
			{x:0+8*580/12,y:254,w:580/12,h:164/2},
			{x:0+9*580/12,y:254,w:580/12,h:164/2},
			{x:0+10*580/12,y:254,w:580/12,h:164/2},
			{x:0+11*580/12,y:254,w:580/12,h:164/2}
		];

		this.cell.tamaCircle = {
			x:0,
			y:16*2,
			w:16,
			h:16
		};

		this.cell.power = {
			x:0,
			y:208,
			w:16,
			h:16
		};
		
		this.cell.point = {
			x:16,
			y:208,
			w:16,
			h:16
		};

		this.cell.laser5 = [
			{x:0,y:0,w:256,h:32},
			{x:0,y:32,w:256,h:32},
			{x:0,y:64,w:256,h:32},
			{x:0,y:96,w:256,h:32}
		];
	}
};
