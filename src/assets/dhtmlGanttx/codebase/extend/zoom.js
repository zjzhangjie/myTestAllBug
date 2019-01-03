if(!window.ganttModules){
	window.ganttModules = {};
}

ganttModules.zoom = (function(gantt){

    var configs = {
        1: function () {
            gantt.config.scale_unit = "month";
            gantt.config.step = 1;
            gantt.config.date_scale = "%Y年%M";
            gantt.config.min_column_width =50;
            gantt.config.subscales =[
                {unit: "day", step: 1, date: "%d日"},
            ]
            gantt.config.round_dnd_dates = true;
            gantt.config.scale_height = 60;
            gantt.templates.date_scale = null;
        },
        2: function () {
            gantt.config.scale_unit = "year";
            gantt.config.round_dnd_dates = false;
            gantt.config.step = 1;
            gantt.config.date_scale = "%Y";
            gantt.config.min_column_width = 50;
            gantt.config.scale_height = 60;
            gantt.templates.date_scale = null;
            gantt.config.subscales = [
                {unit: "week", step: 1, date: "第%W周"},
                {unit: "day", step: 1, date: "%D"}
            ];
        },
        3: function () {
            gantt.config.scale_unit = "year";
            gantt.config.round_dnd_dates = false;
            gantt.config.step = 1;
            gantt.config.date_scale = "%Y";
            gantt.config.min_column_width = 50;
            gantt.config.scale_height = 60;
            gantt.templates.date_scale = null;
            gantt.config.subscales = [
                {unit: "week", step: 1, date: "第%W周"},
                // {unit: "day", step: 1, date: "%D"}
            ];
        },
        4: function () {
            gantt.config.scale_unit = "year";
            gantt.config.round_dnd_dates = false;
            gantt.config.step = 1;
            gantt.config.date_scale = "%Y年";
            gantt.config.min_column_width = 50;
            gantt.config.scale_height = 60;
            gantt.templates.date_scale = null;
            gantt.config.subscales = [
                {unit: "month", step: 1, date: "%F"}
            ];
        },
        5: function () {
            gantt.config.scale_unit = "year";
            gantt.config.round_dnd_dates = false;
            gantt.config.step = 1;
            gantt.config.date_scale = "%Y年";
            gantt.config.min_column_width = 50;
            gantt.config.scale_height = 60;
            gantt.templates.date_scale = null;
            gantt.config.subscales = [];
        }
    }

    var isActive = true;
	var current = 0;

	function setScaleConfig(config){
		configs[config]();
	}


	function refresh(){
		if(gantt.$container)
			gantt.render();
	}

	return {
		deactivate: function(){
			isActive = false;
		},
		setZoom: function(level){
			isActive = true;
			current = level;

			setScaleConfig(current);
			refresh();
		},
		zoomOut: function(){
			if(this.canZoomOut()){
				isActive = true;
				current = (current + 1);
				if(!configs[current])
					current = 6;

				setScaleConfig(current);
				refresh();
			}
		},
		zoomIn: function(){
			if(this.canZoomIn()){
				isActive = true;
				current = (current - 1);
				if(!configs[current])
					current = 1;
				setScaleConfig(current);
				refresh();
			}
		},
		canZoomOut: function() {
			return  !isActive || !!(configs[current + 1]);
		},
		canZoomIn: function(){
			return !isActive || !!(configs[current - 1]);
		}
	};
})(gantt);