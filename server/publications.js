Meteor.publish("toDoList",function(){return Tasks.find();});
Meteor.publish("theSchedule",function(){return Activities.find();});


Meteor.publish("userData", function () {
  if (this.userId) {
	  return Meteor.users.find({}); //, //{_id: this.userId},
                             //{fields: {'profile': 1, 'things': 1}});
  } else {
    this.ready();
  }
});

