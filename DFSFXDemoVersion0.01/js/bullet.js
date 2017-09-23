var bullet=function(){};
bullet.prototype={
    vars:{},
    init:function(vars){
        this.vars={
            x:0,
            y:0,
            vx:0,
            vy:0,
            visible:false,
            isGood:false,
            attackBlood:1,
            bounceTimes:0,
            taskDelay:0,
            createTime:new Date(),
            draw:bulletFunctions.draw.normal,
            update:bulletFunctions.update.normal,
            crash:bulletFunctions.crash.normal,
            onDestroy:bulletFunctions.onDestroy.normal
        };
        for(var i in vars){
            this.vars[i]=vars[i];
        }
    }
};

function addBullet(vars){
    for(var i=0;i<MAX_BULLET_TOTAL;i++){
        if(!_bullet[i].vars.visible){
            _bullet[i].init(vars);
            return i;
        }
    }
    //没有可用子弹
    return -1;
}



var bulletFunctions = {
    draw:{
        normal:function(){
            context.save();
            if(this.isGood){
                var t=_resource.cell.plasma;
                context.drawImage(_resource.image.plasma, this.x-t.w/2,this.y-t.h/2, t.w, t.h);
            }
            else{
                var t=_resource.cell.tamaCircle;
                context.drawImage(_resource.image.etama1,
                    t.x,t.y,t.w,t.h,
                    this.x-t.w/2,this.y-t.h/2, t.w, t.h);
            }
            context.restore();
        }
    },
    update:{
        normal:function(){
            if(this.x>WINDOW_GAME_WIDTH || this.x<0 || this.y>WINDOW_GAME_HEIGHT || this.y<0){
                this.visible=false;
            }
            var vx=this.vx||0;
            var vy=this.vy||0;
            this.x+=this.vx/fps;
            this.y+=this.vy/fps;
        },
        normalWithUncheck:function(){
            var vx=this.vx||0;
            var vy=this.vy||0;
            this.x+=this.vx/fps;
            this.y+=this.vy/fps;
        },
        bounce:function(){
            if(this.bounceTimes==-1 || this.bounceTimes>0){
                var ch=false;
                if(this.x<0 || this.x>WINDOW_GAME_WIDTH){
                    this.vx=-this.vx;
                    this.bounceTimes-=this.bounceTimes>0
                }else if(this.y<0 || this.y>WINDOW_GAME_HEIGHT){
                    this.vy=-this.vy;
                    this.bounceTimes-=this.bounceTimes>0
                }
            }else if(this.x>WINDOW_GAME_WIDTH || this.x<0 || this.y>WINDOW_GAME_HEIGHT || this.y<0){
                this.visible=false;
            }
        },
        split:function(){
            if(this.x<0 || this.x>WINDOW_GAME_WIDTH || this.y<0 || this.y>WINDOW_GAME_HEIGHT){
                this.visible=false;
                for(var i=0;i<360;i++){
                    var rnd=i/180*Math.PI;
                    var speed=50;
                    if(Math.random()>0.9){
                        addBullet({
                            visible:true,
                            x:this.x,
                            y:this.y,
                            bounceTimes:5,
                            vx:speed*Math.cos(rnd),
                            vy:speed*Math.sin(rnd),
                            update:function(){
                                bulletFunctions.update.normalWithUncheck.bind(this)();
                                bulletFunctions.update.bounce.bind(this)();
                            }
                        });
                    }
                }
            }
        }
    },
    crash:{
        normal:function(){
            if(this.isGood){
                for(var i=0;i<MAX_ENEMY_TOTAL;i++){
                    var e=_enemy[i].vars;
                    if (e.visible) {
                        var distance = Math.sqrt(
                            Math.pow(this.x - e.x, 2)
                            + Math.pow(this.y - e.y, 2)
                        );
                        if (distance < 20) {
                            this.onDestroy();
                            e.blood-=this.attackBlood;
                            if (e.blood <= 0) {
                                e.onDestroy();
                            }
                            break;
                        }
                    }
                }
            }else{
                if(_player.visible && !_player.isGod){
                    var distance = Math.sqrt(
                        Math.pow(this.x - _player.x, 2)
                        + Math.pow(this.y - _player.y , 2)
                    );
                    if (distance < 8) {
                        // this.onDestroy();
                        _player.onDestroy();
                    }else if(distance>=8 && distance<=12){
                        _player.graze++;
                    }
                }
            }
        }
    },
    onDestroy:{
        normal:function(){
            this.visible=false;
        }
    }
};