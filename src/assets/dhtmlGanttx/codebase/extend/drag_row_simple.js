(function(){
    // fast repaint vertical dnd

    var verticalDND = false,
        allowNextRender = false,
        taskid,
        el,
        start_index;

    gantt.attachEvent("onRowDragStart", function(id, target, e){
        verticalDND = true;
        allowNextRender = true;
        taskid = id;
        start_index = gantt.getGlobalTaskIndex(id);
        return true;
    });

    gantt.attachEvent("onAfterTaskMove", function(id, parent, tindex) {
        if(gantt.isTaskExists(parent)){
            gantt.getTask(parent).$open = true;
        }
        return true;
    });

    gantt.attachEvent("onBeforeRowDragEnd", function(id, parent, tindex){
        verticalDND = false;
        taskid = null;
        start_index = null;
        return true;
    });

    var refresh = gantt.refreshData;

    gantt.refreshData = function() {
        if (verticalDND && !allowNextRender) {
            gantt._sync_order();
            gantt._get_tasks_data();

            if (!taskid || !gantt.isTaskExists(taskid)) return;
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
                el = null;
            }

            var task = gantt.getTask(taskid);
            var index = gantt.getGlobalTaskIndex(task.id);
            if(index > start_index) index++;
            var top = ((index * gantt.config.row_height ) - gantt.getScrollState().y)+ gantt.config.scale_height ;

            el = document.createElement("DIV");
            el.className = "dnd_highlighter";
            el.style.top = top + "px";
            var offset = (gantt.calculateTaskLevel(task) + 1) * 22 + gantt.calculateTaskLevel(task);
            el.style.left = offset + "px";
            el.style.width  = gantt.config.grid_width - offset + "px";
            gantt.$grid_data.appendChild(el);

            return;
        }
        allowNextRender = false;

        return refresh.apply(this, arguments);
    };

})();