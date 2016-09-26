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

controller.hears(['stats'],['direct_message','direct_mention'],function(bot,message) {

	var stats = '';

	stats += "*<Name>* - <Level> <Race> <Class>\n";
	stats += ">*:high_brightness: Experience* - <Current XP> / <Total XP>\n\n\n";

	stats += ">*:heart: Health* - <Current HP> / <Total HP>\n"
	stats += ">*:shield: Armor* - <Armor>\n\n\n"

	stats += ">*:crossed_swords: Strength* - <Strength>\n"
	stats += ">*:bow_and_arrow: Dexterity* - <Dexterity>\n"
	stats += ">*:crystal_ball: Intelligence* - <Intelligence>\n"
	
	bot.startConversation(message,function(err,convo) {
    	convo.say('I sent you your stats');
  	});

  	bot.startPrivateConversation(message, function(err, convo){
  		convo.say(stats);
  	});
});

function getCurrentXP(user)
{
	//return SELECT 'currentxp' FROM 'players' WHERE 'user' = user
}

function getTotalXP(user)
{
	//return SELECT 'totalxp' FROM 'players' WHERE 'user' = user
}