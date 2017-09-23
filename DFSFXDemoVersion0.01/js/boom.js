var boom = function(){};
boom.prototype = {
	vars:{},
	init:function(vars){
		this.vars={
			x:0,
			y:0,
			visible:false,
			INTERVAL_IMAGE_CHANGE:50,
			lastImageChange:0,
			curIndex:0,
			draw:function(){
				context.save();
				// var t=_resource.cell.explosion[this.curIndex];
				// context.drawImage(_resource.image.explosion,t.x,t.y,t.w,t.h,this.x-t.w/2,this.y-t.h/2,t.w,t.h);
				var t=_resource.cell.bubble[this.curIndex];
				context.drawImage(_resource.image.bubble,t.x,t.y,t.w,t.h,this.x-t.w/2,this.y-t.h/2,t.w,t.h);
				context.restore();
			},
			update:function(){
				
				if(now-this.lastImageChange>this.INTERVAL_IMAGE_CHANGE){
					this.lastImageChange=now;
					this.curIndex++;
					// if(this.curIndex==_resource.cell.explosion.length){
					if(this.curIndex==_resource.cell.bubble.length){
						this.curIndex=0;
						this.visible=false;
					}
				}
			}
		};
		for(var i in vars){
            this.vars[i]=vars[i];
        }
	}
};

function addBoom(obj){
	for(var i=0;i<MAX_BOOM_TOTAL;i++){
		if(!_boom[i].visible){
			_boom[i].init({
				visible:true,
				x:obj.x,
				y:obj.y
			});
		}
		return i;
	}
}