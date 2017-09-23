var sfx_demo={
	name:"Demo",
	author:"KingSann",
	issueDate:"2017.4.4 19:17:15",
	curStage:0,
	init:function(){
		/*
			啊终于写完了。。。没有可视化编辑器好累啊。。
			看来需要写一个可视化编辑器了。。。
													——KingSann 2017.4.4
		*/
		/*
			后记：把task加了进去，可能会bug连篇。
													——KingSann 2017.4.5
		*/
	},
	stage:[
		{
			name:"Stage 0 (init......)",
			visible:true,
			build:function(){
				this.visible=false;
			}
		},
		{
			name:"Stage 1",
			visible:true,
			delay:5000,
			nextTime:10000,
			build:function(){
				if(now-this.startTime>this.delay+this.nextTime){
					this.visible=false;
				}
				if(!this.hasBeen){
					this.hasBeen=true;
					var dir=1;
					for(var i=1;i<=6;i++){
						for(var j=1;j<=8;j++){
							var x=WINDOW_GAME_WIDTH/2+((64+(60*j)%96)*dir);
							var y=(8*j)%64;
							addTask({
								visible:true,
								taskDelay:i*1500+j*100,
								task:function(){
									addEnemy({
										visible:true,
										blood:10,			maxblood:10,
										x:this.x,			y:this.y,
										sourceX:this.x,		sourceY:this.y,
										targetX:this.x,		targetY:this.y+100,
										moveVelocity:100,	move:enemyFunctions.move.moveTo,
										INTERVAL_SHOOT:500,	shootVelocity:300,
										shoot:enemyFunctions.shoot.snipe
									});
								}.bind({
									x:x,	y:y
								})
							});
						}
						dir*=-1;
					}
				}
			}
		},
		{
			name:"Stage 2",
			visible:true,
			delay:2000,
			nextTime:30000,
			build:function(){
				if(now-this.startTime>this.delay+this.nextTime){
					this.visible=false;
				}
				if(!this.hasBeen){
					this.hasBeen=true;
					var dir=1;
					for(var i=1;i<=20;i++){
						dir*=-1;
						var wid=(Math.random()*WINDOW_GAME_WIDTH*0.2);
						addTask({
							visible:true,
							taskDelay:i*1000,
							task:function(){
								addEnemy({
									visible:true,
									blood:30,				maxblood:30,
									x:this.x,				y:0,
									vx:0,					vy:50,
									INTERVAL_SHOOT:200,		shootVelocity:200,
									shoot:enemyFunctions.shoot.snipe,
									update:function(){
										if(this.x>WINDOW_GAME_WIDTH || this.x<0 || this.y>WINDOW_GAME_HEIGHT || this.y<0){
											this.vy=-this.vy;
										}
										enemyFunctions.update.normal.bind(this)();
										if(this.blood>0)this.visible=true;
									}
								});
							}.bind({
								x:dir==1?wid:WINDOW_GAME_WIDTH*0.8+wid
							})
						});
					}
				}
			}
		},
		{
			name:"Stage 3",
			visible:true,
			delay:2000,
			nextTime:60000,
			build:function(){
				if(now-this.startTime>this.delay+this.nextTime){
					this.visible=false;
				}
				if(!this.hasBeen){
					this.hasBeen=true;
					for(var i=1;i<=2;i++){
						for(var j=1;j<=5;j++){
							var x=5+WINDOW_GAME_WIDTH/5*j;
							var y=10+50*i;
							addTask({
								visible:true,
								taskDelay:i*5000+200*j,
								task:function(){
									addEnemy({
										visible:true,
										x:this.x,			y:0,
										blood:100,			maxblood:100,
										sourceX:this.x,		sourceY:0,
										targetX:this.x,		targetY:this.y,
										moveVelocity:100,	move:enemyFunctions.move.moveTo,
										shootVelocity:100,	circleTotal:10,
										circleAngle:Math.random()*360,
										shoot:function(){
											this.circleAngle=Math.random()*360;
											enemyFunctions.shoot.circle.bind(this)();
										}
									});
								}.bind({
									x:x,y:y
								})
							});
						}
					}
				}
			}
		},
		{
			name:"Stage 4",
			visible:true,
			delay:2000,
			nextTime:20000,
			build:function(){
				if(now-this.startTime>this.delay+this.nextTime){
					this.visible=false;
				}
				if(!this.hasBeen){
					this.hasBeen=true;
					
					for(var i=1;i<=16;i++){
						var x=WINDOW_GAME_WIDTH*Math.random();
						var y=0;
						addTask({
							visible:true,
							taskDelay:i*1000,
							task:function(){
								addEnemy({
									visible:true,
									blood:50,							maxblood:50,
									x:this.x,							y:0,
									sourceX:this.x,						sourceY:this.y,
									targetX:this.x,						targetY:this.y+250,
									moveVelocity:200,					move:enemyFunctions.move.moveTo,
									INTERVAL_SHOOT:500,					shootVelocity:300,
									shoot:enemyFunctions.shoot.snipe,	laser:[],
									update:function(){
										if(!this.shootLaser){
											this.shootLaser=true;
											for(var i=1;i<=4;i++){
												this.laser[i]=addLaser({
													visible:true,
													x:this.x,
													y:this.y,
													length:130,
													rotate:90*i/180*Math.PI,
													update:function(){
														this.rotate+=1/180*Math.PI*50/fps;
														laserFunctions.update.normal.bind(this)();
														this.visible=true;
														this.turnOn=true;
													}
												});
											}
										}
										for(var i=1;i<=4;i++){
											var las=_laser[this.laser[i]].vars;
											las.x=this.x;
											las.y=this.y;
										}
										enemyFunctions.update.normal.bind(this)();
									},
									onDestroy:function(){
										if(this.laser.length){
											for(var i=1;i<=4;i++){
												var las=_laser[this.laser[i]].vars;
												las.update=function(){
													this.x+=(2*Math.cos(this.rotate)*this.length)/fps;
													this.y+=(2*Math.sin(this.rotate)*this.length)/fps;
													laserFunctions.update.normal.bind(this)();
													this.visible=true;
													this.turnOn=true;
												}
											}
										}
										enemyFunctions.onDestroy.normal.bind(this)();
									}
								});
							}.bind({
								x:x,y:y
							})
						});
					}
				}
			}
		},
		{
			name:"Stage 5",
			visible:true,
			delay:2000,
			nextTime:30000,
			build:function(){
				if(now-this.startTime>this.delay+this.nextTime){
					this.visible=false;
				}
				if(!this.hasBeen){
					this.hasBeen=true;
					for(var i=1;i<=3;i++){
						addEnemy({
							blood:1000,							maxblood:1000,
							visible:true,
							x:WINDOW_GAME_WIDTH/4*i,			y:0,
							sourceX:WINDOW_GAME_WIDTH/4*i,		sourceY:0,
							targetX:WINDOW_GAME_WIDTH/4*i,		targetY:WINDOW_GAME_HEIGHT*0.2,
							moveVelocity:70,
							move:enemyFunctions.move.moveTo,
							INTERVAL_SHOOT:1000,
							circleTotal:10,
							bulletBounceTimes:1,
							shootVelocity:40,
							circleAngle:2*Math.PI*Math.random(),
							shoot:function(){
								this.circleAngle=2*Math.PI*Math.random();
								enemyFunctions.shoot.circleWithBounce.bind(this)();
								if(Math.random()>0.8){
									addLaser({
										x:this.x,		y:this.y,
										length:1000,	rotate:90/180*Math.PI-Math.atan2(_player.x-this.x,_player.y-this.y),
										delay:2000,		visible:true,	wait:500
									});
								}
							}
						});
					}
				}
			}
		},
		{
			name:"Stage 6",
			visible:true,
			delay:2000,
			nextTime:15000,
			build:function(){
				if(now-this.startTime>this.delay+this.nextTime){
					this.visible=false;
				}
				this.startLaserTime=this.startLaserTime||new Date();
				if(now-this.startLaserTime>1000){
					this.startLaserTime=now;
					addLaser({
						visible:true,
						delay:1000,		wait:1000,
						x:_player.x,	y:0,
						length:WINDOW_GAME_HEIGHT,	rotate:90/180*Math.PI
					});
					addLaser({
						visible:true,
						delay:1000,		wait:1000,
						x:0,			y:_player.y,
						length:WINDOW_GAME_WIDTH,	rotate:0
					});

					var tot=10;
					var angle=Math.random()*2*Math.PI;
					var shootVelocity=70;
					var pos=[[0.1,0.1],[0.9,0.9],[0.1,0.9],[0.9,0.9]];
					for(var i=1;i<=tot;i++){
						var ang=angle+360/tot*(i-1)*Math.PI/180;
						for(var j=1;j<=4;j++){
							addBullet({
								visible:true,
								x:WINDOW_GAME_WIDTH*pos[j-1][0],
								y:WINDOW_GAME_HEIGHT*pos[j-1][1],
								vx:shootVelocity*Math.cos(ang),
								vy:shootVelocity*Math.sin(ang)
							});
						}
					}
				}
			}
		},
		{
			name:"Stage 7",
			visible:true,
			delay:2000,
			nextTime:20000,
			build:function(){
				
				if(now-this.startTime>this.delay+this.nextTime){
					this.visible=false;
				}
				this.lastShootTime=this.lastShootTime||new Date();
				if(now-this.lastShootTime>1000){
					this.lastShootTime=now;
					var w=100;var h=50;
			        var x=Math.random()*(WINDOW_GAME_WIDTH-w);var y=0;
			        var vy=0;var avy=200;
			        addBullet({
			        	visible:true,
			        	w:w,h:h,x:x,y:y,vy:vy,avy:avy,
			        	draw:function(){
			        		context.save();
			        		context.fillStyle="#4f4f4e";
			        		context.fillRect(this.x,this.y,this.w,this.h);
			        		context.beginPath();
			        		context.moveTo(this.x,0);
			        		context.lineTo(this.x,WINDOW_GAME_HEIGHT);
			        		context.moveTo(this.x+this.w,0);
			        		context.lineTo(this.x+this.w,WINDOW_GAME_HEIGHT);
			        		context.closePath();
			        		context.setAlpha((this.y+this.h)/WINDOW_GAME_HEIGHT);
			        		context.strokeStyle="white";
			        		context.lineWidth=2;
			        		context.stroke();
			        		context.restore();
			        	},
			        	update:function(){
		        			this.y+=this.vy/fps;
			        		this.vy+=this.avy/fps;
			        		
			        		this.lastPush=this.lastPush||0;
			        		this.INTERVAL_PUSH=300;
			        		
			        		if(now-this.lastPush>this.INTERVAL_PUSH){
			        			this.lastPush=now;
			        			for(var i=0;i<=1;i++){
					        		addBullet({
					        			x:this.x+w*i,	y:this.y+h,		visible:true,
					        			vx:0,			vy:0,			from:this,
					        			update:function(){
					        				if(this.from.vy<0 && this.vx==0){
					        					this.vx=(Math.random()>0.5?1:-1)*(10+Math.random()*10);
					        					this.vy=(Math.random()>0.5?1:-1)*(10+Math.random()*10);
					        				}
					        				bulletFunctions.update.normal.bind(this)();
					        			}
					        		});
					        	}
				        	}
			        		if(this.y+this.h>=WINDOW_GAME_HEIGHT && this.vy>0){
			        			this.vy=-this.vy;
			        			this.avy=-this.avy;
			        		}
			        		if(this.y+this.h<=0 && this.y<0){
			        			this.visible=false;
			        		}
			        	},
			        	crash:function(){
			        		if(_player.visible && !_player.isGod){
			        			var x=this.x;
			        			var y=this.y;
			                    if (
			                    	x<=_player.x && _player.x<=x+w 	&&
			                    	y<=_player.y && _player.y<=y+h
			                    ) {
			                        // this.visible = false;
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
			        });
				}
			}
		},
		{
			name:"Stage 8",
			visible:true,
			delay:2000,
			nextTime:40000,
			build:function(){
				if(now-this.startTime>this.delay+this.nextTime){
					this.visible=false;
				}
				this.lastUpdateTime=this.lastUpdateTime||new Date();
				if(now-this.lastUpdateTime>5000){
					this.lastUpdateTime=now;
					var x=(Math.random()>0.5?0:WINDOW_GAME_WIDTH);
					var y=Math.random()*WINDOW_GAME_HEIGHT;
					for(var i=1;i<=10;i++){
						addTask({
							visible:true,	taskDelay:1000*(i-1),
							task:function(){
									addEnemy({
										visible:true,
										blood:20,				maxblood:20,
										x:this.x,				y:this.y,
										vx:this.x==0?70:-70,	vy:0,
										INTERVAL_SHOOT:500,		shootVelocity:70,
										shoot:enemyFunctions.shoot.snipe
									});
								}.bind({
									x:x,y:y
								})
						});
					}
				}
			}
		},
		{
			name:"Stage 9",
			visible:true,
			delay:2000,
			nextTime:100000,
			build:function(){
				if(now-this.startTime>this.delay+this.nextTime){
					this.visible=false;
				}
				var w=12,h=12;
				var x=WINDOW_GAME_WIDTH/w;
				var y=WINDOW_GAME_HEIGHT/h;
				if(!this.hasBeen){
					this.hasBeen=true;
					for(var i=1;i<=w;i++){
						addLaser({
							visible:true,
							x:x*i, y:0, length:WINDOW_GAME_HEIGHT,	rotate:90/180*Math.PI,
							delay:2000,	wait:2000,
						});
					}
					for(var i=1;i<=h;i++){
						addLaser({
							visible:true,
							x:0, y:y*i, length:WINDOW_GAME_WIDTH,	rotate:0,
							delay:2000,	wait:2000
						});
					}
					for(var i=1;i<=w;i++){
						for(var j=1;j<=h;j++){
							addTask({
								visible:true,	taskDelay:2000,
								task:function(){
									addBullet({
										visible:true,
										x:this.x*i,			y:this.y*j,
										update:function(){
											if(now-this.createTime>102000 && !this.vx && !this.vy){
												this.vx=(Math.random()>0.5?1:-1)*100;
												this.vy=0;
												if(Math.random()>0.5)
													this.vy=this.vx,this.vx=0;
											}
											bulletFunctions.update.normal.bind(this)();
										}
									});
								}.bind({x:x,y:y})
							});
						}
					}
				}
				this.lastUpdateTime=this.lastUpdateTime||new Date();
				if(now-this.lastUpdateTime>200){
					this.lastUpdateTime=now;
					var x=Math.round(Math.random()*WINDOW_GAME_WIDTH);
					var y=Math.round(Math.random()*WINDOW_GAME_HEIGHT);
					var vx=70*(Math.random()>0.5?1:-1);
					var vy=0;
					if(Math.random()>0.5)
						vy=vx,vx=0;
					var length=vx>0?WINDOW_GAME_WIDTH*0.3:WINDOW_GAME_HEIGHT*0.3;
					var rotate=[0,90,180,270][Math.round(Math.random()*3)]/180*Math.PI;
					addLaser({
						visible:true,	delay:1000, 	wait:3000,
						x:x,	y:y,	length:length,	rotate:rotate,
						vx:vx,	vy:vy,
						update:function(){
							this.x+=this.vx/fps;
							this.y+=this.vy/fps;
							laserFunctions.update.normal.bind(this)();
						}
					});
				}
				this.lastUpdateEnemyTime=this.lastUpdateEnemyTime||new Date();
				if(now-this.lastUpdateEnemyTime>7000){
					this.lastUpdateEnemyTime=now;
					var x=(Math.random()>0.5?0:WINDOW_GAME_WIDTH);
					var y=Math.random()*WINDOW_GAME_HEIGHT;
					var vx=x==0?100:-100;

					var pos=[
						[0,Math.random()*WINDOW_GAME_HEIGHT,100,0],
						[WINDOW_GAME_WIDTH,Math.random()*WINDOW_GAME_HEIGHT,-100,0],
						[Math.random()*WINDOW_GAME_WIDTH,0,0,100],
						[Math.random()*WINDOW_GAME_WIDTH,WINDOW_GAME_HEIGHT,0,-100]
					][Math.round(Math.random()*3)];
					for(var i=1;i<=8;i++){
						addTask({
							visible:true,	taskDelay:1000*(i-1),
							task:function(){
								addEnemy({
									visible:true,
									blood:10,				maxblood:10,
									x:this.pos[0],			y:this.pos[1],
									vx:this.pos[2],			vy:this.pos[3],
									INTERVAL_SHOOT:1000,	shootVelocity:100,
									shoot:enemyFunctions.shoot.snipe
								});
							}.bind({pos:pos})
						});
					}
				}
			}
		},
		{
			name:"Stage 10 (Final Stage)",
			visible:true,
			delay:2000,
			build:function(){
				if(!this.hasBeen){
					this.hasBeen=true;
					addEnemy({
						x:WINDOW_GAME_WIDTH/2,				y:WINDOW_GAME_HEIGHT/5,
						identify:this,						visible:true,
						blood:50000,						maxblood:50000,
						/*
							大概要打15min？  1000blood<->20s	 -->  1s<->50blood	50000/50=1000s
							10张符卡吧
							5000blood一张
						*/
						shoot:NONEACTION,
						onDestroy:function(){
							this.identify.visible=false;
							enemyFunctions.onDestroy.normal.bind(this)();
						},
						draw:function(){
							enemyFunctions.draw.normal.bind(this)();
							enemyFunctions.draw.magicMatrix.bind(this)();
						},
						update:function(){
							//this.blood=Math.min(this.blood,5000); //关卡测试，删掉就行

							var bet=function(t,l,r){return l<t && t<=r;};
							if(bet(this.blood,45000,50000)){
								if(!this.sc1){BoomAndAddFood(_bullet);BoomAndAddFood(_laser);BoomAndAddFood(_enemy);}
								this.sc1=true;

								this.lastSc1_1=this.lastSc1_1||new Date();
								if(now-this.lastSc1_1>1000){
									this.lastSc1_1=now;
									var tX=_player.x;
									var tY=_player.y;
									var v=350;
									var dis=Math.sqrt(Math.pow(tX-this.x,2)+Math.pow(tY-this.y,2));
									for(var i=1;i<=5;i++){
										addTask({
											visible:true,	taskDelay:80*(i-1),
											task:function(){
												addBullet({
													visible:true,
													x:this.x,
													y:this.y,
													vx:(tX-this.x)*v/dis,
													vy:(tY-this.y)*v/dis
												});
											}.bind({x:this.x,y:this.y,tX:tX,tY:tY,v:v,dis:dis})
										});
									}
								}
								
								this.lastSc1_2=this.lastSc1_2||new Date();
								if(now-this.lastSc1_2>500){
									this.lastSc1_2=now;
									this.circleTotal=20;
									this.circleAngle=this.circleAngle||0;
									this.circleAngle=(this.circleAngle+30/180*Math.PI)%(2*Math.PI);
									this.shootVelocity=100;
									enemyFunctions.shoot.circle.bind(this)();
								}

								this.lastSc1_3=this.lastSc1_3||new Date();
								if(now-this.lastSc1_3>2000){
									this.lastSc1_3=now;
									addLaser({
										visible:true,
										delay:1000,		wait:1000,
										x:_player.x,	y:0,
										length:WINDOW_GAME_HEIGHT,	rotate:90/180*Math.PI
									});
									addLaser({
										visible:true,
										delay:1000,		wait:1000,
										x:0,			y:_player.y,
										length:WINDOW_GAME_WIDTH,	rotate:0
									});
								}
							}else if(bet(this.blood,40000,45000)){
								if(!this.sc2){BoomAndAddFood(_bullet);BoomAndAddFood(_laser);BoomAndAddFood(_enemy);}
								this.sc2=true;

								this.lastSc2_1=this.lastSc2_1||new Date();
								if(now-this.lastSc2_1>1000){
									this.lastSc2_1=now;
									if(Math.random()>0.5)
										addLaser({
											visible:true,
											delay:2000,		wait:5000,
											x:_player.x,	y:0,
											length:WINDOW_GAME_HEIGHT,	rotate:90/180*Math.PI
										});
									else
										addLaser({
											visible:true,
											delay:2000,		wait:5000,
											x:0,			y:_player.y,
											length:WINDOW_GAME_WIDTH,	rotate:0
										});
								}
							}else if(bet(this.blood,35000,40000)){
								if(!this.sc3){BoomAndAddFood(_bullet);BoomAndAddFood(_laser);BoomAndAddFood(_enemy);}
								this.sc3=true;

								this.lastSc3_1=this.lastSc3_1||new Date();
								if(now-this.lastSc3_1>1500){
									this.lastSc3_1=now;
									var tot=20;
									var r=70;
									var ang=Math.random()*2*Math.PI;
									var vx=100*Math.cos(ang);
									var vy=100*Math.sin(ang);
									for(var i=1;i<=tot;i++){
										addBullet({
											visible:true,
											x:this.x+r*Math.cos(2*Math.PI*i/tot),
											y:this.y+r*Math.sin(2*Math.PI*i/tot),
											vx:vx,vy:vy,
											bounceTimes:2,
											update:function(){
												bulletFunctions.update.normalWithUncheck.bind(this)();
												bulletFunctions.update.bounce.bind(this)();
											}
										});
									}
								}

								this.lastSc3_2=this.lastSc3_2||new Date();
								if(now-this.lastSc3_2>3000){
									this.lastSc3_2=now;
									var sx=this.x,sy=this.y;
									var tx=_player.x,ty=_player.y;
									addLaser({
										visible:true,
										delay:1000,wait:2000,
										x:sx,y:sy,
										length:1000,
										rotate:Math.atan2(ty-sy,tx-sx)
									});
								}

								this.lastSc3_3=this.lastSc3_3||new Date();
								if(now-this.lastSc3_3>65000){
									this.lastSc3_3=now;
									for(var i=1;i<=4;i++){
										addLaser({
											visible:true,
											delay:2000,wait:60000,
											x:this.x,y:this.y,
											length:1000,
											rotate:Math.PI*i/2,
											update:function(){
												this.rotate=this.rotate+2*Math.PI/(this.wait/1000)/fps;
												laserFunctions.update.normal.bind(this)();
											}
										});	
									}
								}
							}else if(bet(this.blood,30000,35000)){
								if(!this.sc4){BoomAndAddFood(_bullet);BoomAndAddFood(_laser);BoomAndAddFood(_enemy);}
								this.sc4=true;

								this.lastSc4_1=this.lastSc4_1||new Date();
								if(now-this.lastSc4_1>3000){
									this.lastSc4_1=now;
									var tX=_player.x,tY=_player.y;
									var v=300;
									var dis=distance(tX,tY,this.x,this.y);
									addBullet({
										visible:true,			identify:this,
										x:this.x,				y:this.y,
										tx:tX,					ty:tY,
										vx:(tX-this.x)*v/dis,	vy:(tY-this.y)*v/dis,
										update:function(){
											if(distance(this.x,this.y,this.tx,this.ty)<5){
												this.visible=false;
												this.identify.x=this.x;
												this.identify.y=this.y;
												this.identify.shootVelocity=100;
												this.identify.circleTotal=30;
												this.identify.circleAngle=2*Math.PI*Math.random();
												enemyFunctions.shoot.circle.bind(this.identify)();
											}
											bulletFunctions.update.normal.bind(this)();
										}
									});
								}

								this.lastSc4_2=this.lastSc4_2||new Date();
								if(now-this.lastSc4_2>3000){
									this.lastSc4_2=now;
									addLaser({
										visible:true,
										delay:1000,		wait:1000,
										x:_player.x,	y:0,
										length:WINDOW_GAME_HEIGHT,	rotate:90/180*Math.PI
									});
									addLaser({
										visible:true,
										delay:1000,		wait:1000,
										x:0,			y:_player.y,
										length:WINDOW_GAME_WIDTH,	rotate:0
									});
								}
							}else if(bet(this.blood,25000,30000)){
								if(!this.sc5){BoomAndAddFood(_bullet);BoomAndAddFood(_laser);BoomAndAddFood(_enemy);}
								this.sc5=true;

								this.lastSc5_1=this.lastSc5_1||new Date();
								this.sc5_1_x=this.sc5_1_x||0;
								if(now-this.lastSc5_1>100){
									this.lastSc5_1=now;
									this.sc5_1_x=(this.sc5_1_x+10/180*Math.PI)%(2*Math.PI);
									addBullet({
										visible:true,
										x:WINDOW_GAME_WIDTH,
										y:WINDOW_GAME_HEIGHT/2+WINDOW_GAME_HEIGHT/2*Math.sin(this.sc5_1_x),
										vx:-100,
										vy:0
									});
									addBullet({
										visible:true,
										x:WINDOW_GAME_WIDTH/2+WINDOW_GAME_WIDTH/2*Math.cos(this.sc5_1_x),
										y:WINDOW_GAME_HEIGHT,
										vx:0,
										vy:-100
									});
								}

								this.lastSc5_2=this.lastSc5_2||new Date();
								if(now-this.lastSc5_2>5000){
									this.lastSc5_2=now;
									addLaser({
										visible:true,
										delay:1000,		wait:1000,
										x:_player.x,	y:0,
										length:WINDOW_GAME_HEIGHT,	rotate:90/180*Math.PI
									});
									addLaser({
										visible:true,
										delay:1000,		wait:1000,
										x:0,			y:_player.y,
										length:WINDOW_GAME_WIDTH,	rotate:0
									});
								}

								this.lastSc5_3=this.lastSc5_3||new Date();
								if(now-this.lastSc5_3>1000){
									this.lastSc5_3=now;
									this.circleAngle=(this.circleAngle+30/180*Math.PI)%(2*Math.PI);
									this.circleTotal=20;
									this.shootVelocity=100;
									enemyFunctions.shoot.circle.bind(this)();
								}
							}else if(bet(this.blood,20000,25000)){
								if(!this.sc6){BoomAndAddFood(_bullet);BoomAndAddFood(_laser);BoomAndAddFood(_enemy);}
								this.sc6=true;

								this.lastSc6_1=this.lastSc6_1||new Date();
								if(now-this.lastSc6_1>300){
									this.lastSc6_1=now;

									this.circleTotal=30;
									this.shootVelocity=50;
									this.circleAngle=this.circleAngle||0;
									this.circleAngle=(this.circleAngle+Math.random()*2*Math.PI)%(2*Math.PI);

									enemyFunctions.shoot.circle.bind(this)();
									
									this.circleAngle=-this.circleAngle;
									enemyFunctions.shoot.circle.bind(this)();

									this.circleAngle=-this.circleAngle;
								}

								this.lastSc6_2=this.lastSc6_2||new Date();
								if(now-this.lastSc6_2>5000){
									this.lastSc6_2=now;
									for(var i=1;i<=32;i++){
										addLaser({
											visible:true,
											delay:2000,wait:3000,
											x:this.x,y:this.y,
											length:1000,
											rotate:Math.atan2(_player.y-this.y,_player.x-this.x)+Math.PI*i/16
										});
									}
								}
							}else if(bet(this.blood,15000,20000)){
								if(!this.sc7){BoomAndAddFood(_bullet);BoomAndAddFood(_laser);BoomAndAddFood(_enemy);}
								this.sc7=true;

								this.lastSc7_1=this.lastSc7_1||new Date();
								if(now-this.lastSc7_1>1500){
									this.lastSc7_1=now;
									var tot=20;
									for(var i=1;i<=tot;i++){
										var v=20;
										addBullet({
											visible:true,
											x:0,	y:WINDOW_GAME_HEIGHT/tot*i,
											vx:v,vy:Math.random()*v,
											bounceTimes:2,
											update:function(){
												bulletFunctions.update.bounce.bind(this)();
												bulletFunctions.update.normalWithUncheck.bind(this)();
												if(this.vx<0)this.visible=false;
											}
										});
										addBullet({
											visible:true,
											x:WINDOW_GAME_WIDTH,	y:WINDOW_GAME_HEIGHT/tot*i,
											vx:-v,vy:Math.random()*v,
											bounceTimes:2,
											update:function(){
												bulletFunctions.update.bounce.bind(this)();
												bulletFunctions.update.normalWithUncheck.bind(this)();
												if(this.vx>0)this.visible=false;
											}
										});
									}
								}

								this.lastSc7_2=this.lastSc7_2||new Date();
								if(now-this.lastSc7_2>5000){
									this.lastSc7_2=now;
									addLaser({
										visible:true,
										delay:1000,		wait:1000,
										x:_player.x,	y:0,
										length:WINDOW_GAME_HEIGHT,	rotate:90/180*Math.PI
									});
									addLaser({
										visible:true,
										delay:1000,		wait:1000,
										x:0,			y:_player.y,
										length:WINDOW_GAME_WIDTH,	rotate:0
									});
								}

								this.lastSc7_3=this.lastSc7_3||new Date();
								if(now-this.lastSc7_3>35000){
									this.lastSc7_3=now;
									BoomAndAddFood(_bullet);
								}
							}else if(bet(this.blood,10000,15000)){
								if(!this.sc8){BoomAndAddFood(_bullet);BoomAndAddFood(_laser);BoomAndAddFood(_enemy);}
								this.sc8=true;

								this.lastSc8_1=this.lastSc8_1||new Date();
								if(now-this.lastSc8_1>1000){
									this.lastSc8_1=now;

									var v=100;
									var dis=distance(_player.x,_player.y,this.x,this.y);
									
									addBullet({
										visible:true,
										x:this.x,y:this.y,
										vx:(_player.x-this.x)*v/dis,
										vy:(_player.y-this.y)*v/dis,
										bounceTimes:-1,
										Sc8_1_Bullet:true,
										update:function(){
											bulletFunctions.update.normalWithUncheck.bind(this)();
											bulletFunctions.update.bounce.bind(this)();
										}
									});
								}

								this.lastSc8_2=this.lastSc8_2||new Date();
								if(now-this.lastSc8_2>5000){
									this.lastSc8_2=now;
									for(var i=0;i<MAX_BULLET_TOTAL;i++){
										if(_bullet[i].vars.visible && _bullet[i].vars.Sc8_1_Bullet){
											_bullet[i].vars.draw=function(){
												this.magicMatrix_r=100;
												enemyFunctions.draw.magicMatrix.bind(this)();
												bulletFunctions.draw.normal.bind(this)();
											}
											addTask({
												visible:true,	taskDelay:1000,
												identify:_bullet[i].vars,
												identify2:this,
												task:function(){
													this.identify2.x=this.identify.x;
													this.identify2.y=this.identify.y;
												}
											});
											break;
										}
									}
								}

								this.lastSc8_3=this.lastSc8_3||new Date();
								if(now-this.lastSc8_3>3000){
									this.lastSc8_3=now;
									addLaser({
										visible:true,
										delay:1000,		wait:1000,
										x:_player.x,	y:0,
										length:WINDOW_GAME_HEIGHT,	rotate:90/180*Math.PI
									});
									addLaser({
										visible:true,
										delay:1000,		wait:1000,
										x:0,			y:_player.y,
										length:WINDOW_GAME_WIDTH,	rotate:0
									});
								}
							}else if(bet(this.blood, 5000,10000)){
								if(!this.sc9){BoomAndAddFood(_bullet);BoomAndAddFood(_laser);BoomAndAddFood(_enemy);}
								this.sc9=true;

								this.lastSc9_1=this.lastSc9_1||new Date();
								if(now-this.lastSc9_1>1000){
									this.lastSc9_1=now;
									var pos=[
										[0,0,WINDOW_GAME_WIDTH,WINDOW_GAME_HEIGHT],
										[0,WINDOW_GAME_HEIGHT,WINDOW_GAME_WIDTH,0]
									];
									for(var i=0;i<=1;i++){
										var x=pos[i][0],y=pos[i][1],tx=pos[i][2],ty=pos[i][3];
										var length=distance(x,y,tx,ty);
										var rotate=Math.atan2(ty-y,tx-x);
										addLaser({
											visible:true,	
											delay:1000,		wait:1000,
											x:x,			y:y,
											length:length,	rotate:rotate
										});
									}
								}

								this.lastSc9_2=this.lastSc9_2||new Date();
								if(now-this.lastSc9_2>500){
									this.lastSc9_2=now;
									this.circleAngle=this.circleAngle||0;
									this.circleAngle=(this.circleAngle+10/180*Math.PI)%(2*Math.PI);
									this.circleTotal=20;
									this.shootVelocity=50;
									enemyFunctions.shoot.circle.bind(this)();
								}

								this.lastSc9_3=this.lastSc9_3||new Date();
								if(now-this.lastSc9_3>5000){
									this.lastSc9_3=now;
									for(var i=0;i<MAX_BULLET_TOTAL;i++){
										if(_bullet[i].vars.visible && !_bullet[i].vars.isGood){
											_bullet[i].vars.draw=function(){
												this.magicMatrix_r=100;
												enemyFunctions.draw.magicMatrix.bind(this)();
												bulletFunctions.draw.normal.bind(this)();
											}
											addTask({
												visible:true,	taskDelay:1000,
												identify:_bullet[i].vars,
												identify2:this,
												task:function(){
													if(this.identify.visible){
														this.identify2.x=this.identify.x;
														this.identify2.y=this.identify.y;
														this.identify.draw=bulletFunctions.draw.normal;
										        		_player.isGod = true;
										            	addTask({
										            		visible:true,taskDelay:3000,
												        	task:function(){
												        		_player.isGod=false;
												        	}
										            	});
													}
												}
											});
											break;
										}
									}
								}
							}else if(bet(this.blood,    0, 5000)){
								if(!this.sc10){BoomAndAddFood(_bullet);BoomAndAddFood(_laser);BoomAndAddFood(_enemy);}
								this.sc10=true;

								this.lastSc10_1=this.lastSc10_1||new Date();
								if(now-this.lastSc10_1>3000){
									this.lastSc10_1=now;

									var x=this.x,y=this.y,
										tx=_player.x,ty=_player.y;
									var length=distance(x,y,tx,ty);
									var rotate=Math.atan2(ty-y,tx-x);

									addLaser({
										visible:true,	identify:this,
										x:x,			y:y,
										tx:tx,			ty:ty,
										length:length,	rotate:rotate,
										delay:700,		wait:2300,
										onDestroy:function(){
											this.identify.x=this.tx;
											this.identify.y=this.ty;
											laserFunctions.onDestroy.normal.bind(this)();
										}
									});
								}

								this.lastSc10_2=this.lastSc10_2||new Date();
								if(now-this.lastSc10_2>500){
									this.lastSc10_2=now;
									this.circleAngle=this.circleAngle||0;
									this.circleAngle=(this.circleAngle+10/180*Math.PI)%(2*Math.PI);
									this.circleTotal=20;
									this.shootVelocity=100;
									enemyFunctions.shoot.circle.bind(this)();
								}
							}
							enemyFunctions.update.normal.bind(this)();
							if(this.blood>0)this.visible=true;//避免像Sc8那样卡到夹缝里挂了
						}
					});
				}
			}
		}
	]
};
