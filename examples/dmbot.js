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