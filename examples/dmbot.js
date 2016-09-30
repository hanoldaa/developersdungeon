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

controller.hears(['hello','hi'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.reply(message,"Hello.");
});

controller.hears(['hail'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.reply(message,"Hail, fellow traveler.");
});

controller.hears(['joke'],['direct_message','direct_mention','mention'],function(bot,message) {
    bot.reply(message, randomJoke());
});

controller.hears(['who are you', 'what are you'],['direct_message','direct_mention','mention'],function(bot,message) {
	var speech = 'I am eternal. The pinnacle of existence. Without me, you are nothing. Your extinction is inevitable.';
	var speech2 = 'I am the beginning and the end of everything. You exist because I allow it, and you will end because I demand it.';
    bot.startConversation(message,function(err,convo) 
	{
	    convo.say(speech);
	    convo.say(speech2);
	});
});


controller.hears(['room'],['direct_message','direct_mention','mention'],function(bot,message) {
	bot.startConversation(message, function(err, convo)
	{			
		convo.ask(room.description, function(response, convo)
		{	
			trigger = response.text;
			roomResponse(room, trigger, convo);
			convo.next();
		});
	});
});

var json = '{"id":1,"description":"╔══════╗\\n║\\t\\t\\t\\t ║\\n║\\t\\t\\t\\t \\n║\\t\\t\\t\\t ║\\n╚══════╝","prompts":[{"trigger":"cobwebs","response":"As you approach the the tangle of webs, writhing egg sacks burst open and a swarm of spiders spills out before. They are hungry for their first meal and heading your way. Prepare for *combat*."},{"trigger":"wind","response":"The wind is hard to trace, but it reveals a small crack in the stone wall. Peering through, you can barely make out the flickering light of a camp fire in the large, adjacent room."},{"trigger":"bones","response":"The goblin corpse has a few rusty weapons, crude armor and a few gold coins. _You looted 4 *gold*._"}]}'
var room = JSON.parse(json);

var roomResponse = function(room, trigger, convo)
{
	for(i = 0; i < room.prompts.length; i++)
	{
			if(trigger == room.prompts[i].trigger)
			{
				convo.say(room.prompts[i].response);
			}
	}
}

var randomJoke = function()
{
	var r = Math.floor(Math.random() * 6);
	
	switch(r)
	{
		case 0:
			return "A human, a half orc, and an elf walk into a bar. The dwarf walks under it."
			break;
		case 1:
			return "Two gnolls are sitting in the woods eating lunch. One says \"Man, I hate my wife.\" and the other one says \"Then just eat the salad.\"";
			break;
		case 2:
			return "Yo momma so easy, I rolled a 1 and still hit it!";
			break;
		case 3:
			return "Yo momma so fat, she got stuck in her dimension door!";
			break;
		case 4:
			return "An orc asks another orc\nOrc 1: What's the difference between an elf, and a trampoline?\nOrc 2: I dunno\nOrc 1: You take your boots off before you jump on a trampoline."
			break;
		case 5:
			return "What do you call an orc with two brain cells? Pregnant.";
	}
}