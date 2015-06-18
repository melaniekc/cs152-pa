
Template.edit.events({
	"submit #new_event": function(event){
		event.preventDefault();

		var evt = event.target.evt.value;
		console.log(JSON.stringify(evt));
		var starttime = event.target.start.value;
		console.log(JSON.stringify(starttime));
		var endtime = event.target.end.value;
		console.log(JSON.stringify(endtime));
		var reminder = event.target.reminder.value;
		console.log(JSON.stringify(remtime));
		var remtime = event.target.remtime.value;
		console.log(JSON.stringify(remtime));
		var remmessage = event.target.mssg.value;
		console.log(JSON.stringify(remmessage));

		if (reminder=="yes"){
			Activities.insert({time:starttime+"-"+endtime, activity:evt, notes:"reminder at "+remtime+": \""+remmessage+"\""});
		} else {	
			Activities.insert({time:starttime+"-"+endtime, activity:evt});
		}
		Router.go('schedule');
	}
})	