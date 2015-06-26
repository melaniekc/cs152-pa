Template.todolist.helpers({
   task: function(){return Tasks.find({},{sort: Session.get('order')})},
}),

Template.todolist.events({
	"submit #sortby": function(event){
		event.preventDefault();

		var sortby = event.target.sorts.value;
		if (sortby=="sortdue"){
			return Session.set('order',{dueAt:1})};
		if (sortby=="sortcat"){
			return Session.set('order',{group:1})};
		if (sortby=="sortalph"){
			return Session.set('order',{name:1})
		};
	},
	"submit #addtdl": function(event){
		event.preventDefault();

		var taskname = event.target.task.value;
		var due = event.target.due.value;
		var category = event.target.category.value;

		Tasks.insert({name:taskname, dueAt:due, group:category});
	}
}),

Template.taskrow.events({
	'click .task-complete-icon': function(){Tasks.remove(this._id);}
})