
Template.edit.events({
	"submit #new_event": function(event){
		event.preventDefault();

		var evt = event.target.evt.value;
		var starttime = event.target.start.value;
		var endtime = event.target.end.value;
		var reminder = event.target.reminder.value;
		var remtime = event.target.remtime.value;
		var remmessage = event.target.mssg.value;

		if (reminder=="yes"){
			Activities.insert({time:starttime+"-"+endtime, activity:evt, notes:"reminder at "+remtime+": \""+remmessage+"\""});
		} else {	
			Activities.insert({time:starttime+"-"+endtime, activity:evt});
		}
		Router.go('schedule');
	}
})	