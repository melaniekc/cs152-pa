Meteor.startup(function(){

	if (Activities.find({}).count()==0){

		Activities.insert({time:"09:30-10:30", activity: "Morning Meeting"});
		Activities.insert({time:"12:00-13:00", activity: "Lunch"});
		Activities.insert({time:"13:30-15:30", activity: "Presentation", notes:"reminder at 13:15: \"go to Room 315\""});
		Activities.insert({time:"16:00-?", activity: "Finish report", notes:"reminder at 16:00: \"report due today at 10\""});
		Activities.insert({time:"15:30-16:00", activity: "Workout"});
	}
	if (Tasks.find({}).count()==0){

		Tasks.insert({name:"Finish PA3", dueAt:"20:00", group:"CS152"});
		Tasks.insert({name:"Buy tickets", dueAt:"-", group:"other"});
	}
});
