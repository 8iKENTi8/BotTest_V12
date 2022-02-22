module.exports = (bot,guildMap,connect,Discord) => {
    bot
    .on('ready', ()=>require('./ready')(bot))
    .on('message', (message) => require('./message')(bot, message,guildMap,connect,Discord))
    .on('voiceStateUpdate', (oldMember,newMember) => require('./voiceStateUpdate')(oldMember,newMember,guildMap))
};