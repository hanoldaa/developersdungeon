var Botkit = require('../lib/Botkit.js');


if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var controller = Botkit.slackbot({
 debug: false
});

controller.spawn({
  token: process.env.token
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});


controller.hears(['create'],['direct_message'],function(bot,message) 
{
	var name = '';
	var race = '';
	var clas = '';

	bot.startConversation(message,function(err,convo) 
	{

	    convo.say('Hmmm...');
	    convo.say('I see...');
		convo.ask('You wish to become an adventurer then?',
		[
	  	{
	        pattern: bot.utterances.yes,
	        callback: function(response,convo) 
	        {
	          convo.say('Great! Let\'s start with the basics.');
	          askName(response, convo);
	          convo.next();
	        }
	  	},
	  	{
	        pattern: bot.utterances.no,
	        callback: function(response,convo) {
	          convo.say('You don\'t look much like an adventurer, anyways.');
	          // do something else...
	          convo.next();
	        }
	  	},
	  	{
	        default: true,
	        callback: function(response,convo) 
	        {
	          // just repeat the question
	          convo.repeat();
	          convo.next();
	        }
	  	}]);
	});

	var askName = function(response, convo)
	{
		convo.ask('What is your name?', function(response, convo)
		{
				name = response.text;
				controller.storage.users.get(message.user,function(err, user) 
				{
					if(err)
						console.log(err);
					
					if (!user) 
					{
						user = { id: message.user, };
					}
					user.name = name;
					controller.storage.users.save(user, function(err, resp){ 
						if(err)
							console.log(err);
					});
				});
				convo.say('That\'s a good one!');
				askRace(response, convo);
				convo.next();
		});
	}
	


	var askRace = function(response, convo)
	{
		convo.ask('What is your race, ' + name + '? (human, dwarf, elf)', 
		[
			{
				pattern: 'human',
				callback: function(response, convo)
				{
					race = 'human';
					convo.say("A noble choice.");
					convo.next();
				}
			},
			{
				pattern: 'dwarf',
				callback: function(response, convo)
				{
					race = 'dwarf';
					convo.say("Dwarves, as strong as they are stubborn.");
					convo.next();
				}
			},
			{
				pattern: 'elf',
				callback: function(response, convo)
				{
					race = 'elf';
					convo.say("Ancient and wise beings, elves.")
					convo.next();
				}
			},
			{
				default: true,
				callback: function(response, convo)
				{
					convo.say('That\'s not a race, you fool!');
					askRace(response, convo);
					convo.next();
				}
			}
		]);
	}
});	

controller.hears(['who am i', 'what is my name'],['direct_message','direct_mention','mention'],function(bot,message) {
	var name = getName(message.user);
	if(name == 'N/A')
	{
		bot.reply(message, "A (wo)man has no name.");
	}
	else
	{
		bot.reply(message,"Your name is " + getName(message.user) + ".");
	}
});

var getName = function(passed_user)
{
	name = '';
	controller.storage.users.get(passed_user,function(err, user) {
		if(err)
			console.log(err);
		
		if (user && user.name) {
			name = user.name;
		} else {
			name =  'N/A';
		}
	});
	return name;
}