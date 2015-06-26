Template.todolist.helpers({
   task: function(){return Tasks.find({})},
}),

Template.todolist.events({
	"submit #sortby": function(event){
		event.preventDefault();

		var sortby = event.target.sorts.value;
		if (sortby=="sortdue"){
			task = function(){return Tasks.find({},{sort:{dueAt:1}})};
		} if (sortby=="sortcat"){
			task = function(){return Tasks.find({},{sort:{group:1}})};
		} if (sortby=="sortalph"){
			task = function(){return Tasks.find({},{sort:{name:1}})};
		};
	},
	"submit #addtdl": function(event){
		event.preventDefault();

		var taskname = event.target.task.value;
		var due = event.target.due.value;
		var category = event.target.category.value;

		Tasks.insert({name:taskname, dueAt:due, group:category});
	}
})	