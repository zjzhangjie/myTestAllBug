(function () {
	var delTaskParent;

	function checkParents(id) {
		setTaskType(id);
		var parent = gantt.getParent(id);
		if (parent != gantt.config.root_id) {
			checkParents(parent);
		}
	}

	function setTaskType(id) {
		id = id.id ? id.id : id;
		var task = gantt.getTask(id),
			type;
		if (gantt.hasChild(task.id)) {
			type = gantt.config.types.project;
		}
		else {
			type = task.type == gantt.config.types.milestone ? gantt.config.types.milestone : gantt.config.types.task;
		}

		if (type != task.type) {
			task.type = type;
			gantt.updateTask(id);
		}
	}

	gantt.attachEvent("onParse", function () {
		gantt.eachTask(function (task) {
			setTaskType(task);
		});
	});

	gantt.attachEvent("onAfterTaskAdd", function onAfterTaskAdd(id) {
		gantt.batchUpdate(function () {
			checkParents(id);
		});
	});

	gantt.attachEvent("onBeforeTaskDelete", function onBeforeTaskDelete(id, task) {
		delTaskParent = gantt.getParent(id);
		return true;
	});

	gantt.attachEvent("onAfterTaskDelete", function onAfterTaskDelete(id, task) {
		if (delTaskParent != gantt.config.root_id) {
			gantt.batchUpdate(function () {
				checkParents(delTaskParent);
			});
		}
	});

	gantt.attachEvent("onTaskCreated", function(item){
		if(item.duration == 1){
			item.duration = 72;
		}
		return true;
	});
})();