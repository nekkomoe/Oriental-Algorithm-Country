var task=function(){};
task.prototype={
	vars:{},
	init:function(vars){
		this.vars={
			visible:false,				//是否能执行
			taskDelay:0,				//延时
			createTime:new Date(),		//创建时间
			task:function(){}			//任务
		};
		for(var i in vars){
			this.vars[i]=vars[i];
		}
	}
};

function addTask(vars){
	for(var i=0;i<MAX_TASK_TOTAL;i++){
		if(!_task[i].vars.visible){
			_task[i].init(vars);
			return i;
		}
	}
	return -1;
}