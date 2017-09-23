var sfx_demo={
	name:"",							//地图名
	author:"",							//作者
	issueDate:"",						//发布时间（准确地说应该是完成时间）
	curStage:0,							//当前关卡
	init:function(){},					//初始化函数
	stage:[
		{
			name:"Stage1-Test",			//关卡名
			visible:true,				//当visible为false的时候，标志进入下一个关卡
			createTime:new Date(),		//关卡开始时间，自动生成
			delay:0,					//关卡产生延时
			nextTime:0,					//进入下一关时间，可选，自己使用
			build:function(){}			//更新（生成）函数，更新时调用
		}
	]
};