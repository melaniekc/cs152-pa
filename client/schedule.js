var today = new Date();

function clock(event) {
	var now = new Date();
	document.getElementById("clock").innerHTML = "The time is <b>"+now.toLocaleTimeString()+"</b>";
	setInterval(500);
}

var final_transcript = "";
var mssg = "";
var recognizing = false;
var speaking = 0;
var evt; var starttime; var endtime; var reminder; var remtm;
	
if ('webkitSpeechRecognition' in window) {
	console.log("webkit is available!");
	var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = function() {
      recognizing = true;
    };
 
    recognition.onerror = function(event) {
      console.log(event.error);
    };
 
    recognition.onend = function() {
      recognizing = false;
    };
 
    recognition.onresult = function(event) {
    	final_span.innerHTML="";
    	speaking++;
      	for (var i = event.resultIndex; i < event.results.length; ++i) {
		  console.log("i="+i);
		  var results = event.results[i][0].transcript.toLowerCase();
		  final_transcript = event.results[i][0].transcript;
		  console.log('final events.results[i][0].transcript = '+ JSON.stringify(event.results[i][0].transcript));
			if (results.includes("event")) {
				recognition.stop();
				mssg = "What is the name of the event you would like to add?";
				var reply = new SpeechSynthesisUtterance(mssg);
				window.speechSynthesis.speak(reply);
				document.getElementById("message").innerHTML=mssg;
				document.getElementById("voice").innerHTML="Respond";
			} else if (speaking == 2) {
				recognition.stop();
				evt = final_transcript;
				console.log(JSON.stringify(evt));
				mssg = "What time is the event?";
				var reply = new SpeechSynthesisUtterance(mssg);
				window.speechSynthesis.speak(reply);
				document.getElementById("message").innerHTML="Event name: "+final_transcript+"\n<br>"+mssg+"\n";
			} else if (speaking == 3){
				recognition.stop();
				starttime = final_transcript;
				console.log(JSON.stringify(starttime));
				mssg = evt +" starts at "+ starttime +". What time does it end?";
				var reply = new SpeechSynthesisUtterance(mssg);
				window.speechSynthesis.speak(reply);
				document.getElementById("message").innerHTML=mssg+"\n";
			} else if (speaking == 4){
				recognition.stop();
				endtime = final_transcript;
				console.log(JSON.stringify(endtime));
				mssg = "Would you like a reminder for "+evt+"?";
				var reply = new SpeechSynthesisUtterance(mssg);
				window.speechSynthesis.speak(reply);
				document.getElementById("message").innerHTML=evt+" from "+starttime+" to "+endtime+".\n"+mssg+"\n";
			} else if (speaking == 5){
				recognition.stop();
				reminder = final_transcript;
				console.log(JSON.stringify(reminder));
				if (reminder=="no") {
					Activities.insert({time:starttime+"-"+endtime, activity:evt});
					return;
				} else {
					mssg = "New reminder. For what time and what is the reminder message?";
					var reply = new SpeechSynthesisUtterance(mssg);
					window.speechSynthesis.speak(reply);
					document.getElementById("message").innerHTML=mssg+"\n";
				}
			} else if (speaking == 6){
				recognition.stop();
				remtm = final_transcript;
				console.log(JSON.stringify(remtm));
				mssg = "Reminder set. Thank you!";
				var reply = new SpeechSynthesisUtterance(mssg);
				window.speechSynthesis.speak(reply);
				document.getElementById("message").innerHTML=mssg+"\n";
				Activities.insert({time:starttime+"-"+endtime, activity:evt, notes:"reminder at "+remtm});
			}
			startDictation(event);
        }
        var transcript = "<i>" + final_transcript + "</i><br>";
      document.getElementById("final_span").innerHTML += transcript;
    };
}

function startDictation(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = "";
  recognition.lang = 'en-US';
  recognition.start();
  final_span.innerHTML = "";
}

Template.schedule.helpers(
 {
   activity: function(){return Activities.find({},{sort:{time:1}})},
   date: today.toDateString(),
   time: today.toLocaleTimeString()
 }
);

Template.schedule.events({
	'click #refresh': function(event){
		clock(event);
	},
	'click #add': function(event){
		Router.go('edit');
	},
	'click #voice': function(event){
		startDictation(event);
	}
});

Template.schedrow.events({
	'click .activity-delete-icon': function(){Activities.remove(this._id);}
})

