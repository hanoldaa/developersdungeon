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
	var prof = '';

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
	          convo.say('We shall see if you have what it takes. Let\'s start with the basics.');
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
		convo.ask('What race is ' + name + '? (human, dwarf, elf)', 
		[
			{
				pattern: 'human',
				callback: function(response, convo)
				{
					race = 'Human';
					convo.say("A noble choice.");
					askClass(response, convo);
					convo.next();
				}
			},
			{
				pattern: 'dwarf',
				callback: function(response, convo)
				{
					race = 'Dwarf';
					convo.say("Dwarves, as strong as they are stubborn.");
					askClass(response, convo);
					convo.next();
				}
			},
			{
				pattern: 'elf',
				callback: function(response, convo)
				{
					race = 'Elf';
					convo.say("Ancient and wise beings, elves.");
					askClass(response, convo);
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

	var askClass = function(response, convo)
	{
		convo.ask('And what kind of hero is ' + name + ' the ' + race + '? (deathomancer [dm], muscle mage [mm], doom knight [dk], bruhzerker [bz])', 
		[
			{
				pattern: 'deathomancer|dm',
				callback: function(response, convo)
				{
					var descr = "You want so desperately to be edgy. I get it. I _really_ do. ";
					descr += "Deathomancers are masters of everything death, obviously. ";
					descr += "Summoning the dead, shooting death from their wand, speaking to the dead. "
					descr += "If that doesn't spell 'edge', then I don't know what does."
					
					confirmClass(convo, descr, "Deathomancer");
					convo.next();
				}
			},
			{
				pattern: 'muscle mage|mm',
				callback: function(response, convo)
				{
					var descr = "WHAT'S BETTER THAN A FIREBALL SLUGGING MAGE IN SICK ASS, FLOWY ROBES!? ";
					descr += "THAT'S RIGHT! A FIREBALL SLUGGING MAGE IN SICK ASS, FLOWY ROBES THAT ARE ";
					descr += "TOO TIGHT FOR HIS OR HER RIPPLING MUSCLES BECAUSE HE OR SHE IS FUELED BY THE ";
					descr += "RAW AND PRIMAL POWER OF WHEY PROTEIN!";
					
					confirmClass(convo, descr, "Muscle Mage");
					convo.next();
				}
			},
			{
				pattern: 'doom knight|dk',
				callback: function(response, convo)
				{
					var descr = "_Repent! The end is ni!_ Doom Knights are the rare and chosen ";
					descr += "few who spread the word of the inevitable end of all things. ";
					descr += "Chosen by whome? Well, no one really knows. Probably some psycopath ";
					descr += "who thinks arming powerful brainwashed zealots makes for a fun hump-day ";
					descr += "evening.";

					confirmClass(convo, descr, "Doom Knight");
					convo.next();
				}
			},
			{
				pattern: 'bruhzerker|bz',
				callback: function(response, convo)
				{
					var descr = "You're the kind of person who says worlds like 'bruh' to mean 'bro', ";
					descr += "and get all cocky and puffy-chested when around other Bruhzerkers. ";
					descr += "You are obviously compensating for something with the massive weapon ";
					descr += "you use to cleave hordes of evil. You are fueled by lite ale rather than ";
					descr += "rage and exert your dominance by storing dip-spit for the ultimate hock.";

					confirmClass(convo, descr, "Bruhzerker");
					convo.next();
				}	
			},
			{
				default: true,
				callback: function(response, convo)
				{
					convo.say('Can\'t you do anything right? Try again!');
					askClass(response, convo);
					convo.next();
				}
			}
		]);

		var confirmClass = function(convo, descr, className)
		{
			convo.say(descr);
			convo.ask('Does this sound like ' + name + '?',
			[
			  	{
			        pattern: bot.utterances.yes,
			        callback: function(response,convo) 
			        {
			        	prof = className;
			        	convo.say('That is all for now...');
			          	convo.next();
			        }
			  	},
			  	{
			        pattern: bot.utterances.no,
			        callback: function(response,convo) 
			        {
			          	askClass(response, convo);
			          	convo.next();
			        }
			  	},
			  	{
			        default: true,
			        callback: function(response,convo) 
			        {
			          confirmClass(convo, descr, className);
			          convo.next();
			        }
			  	}
		  	]);
		}
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