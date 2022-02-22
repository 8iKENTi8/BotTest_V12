module.exports = async (guildMap,mapKey,msg) => {
   
    if (guildMap.has(mapKey)) {
        let val = guildMap.get(mapKey);
        if (val.voice_Channel) val.voice_Channel.leave()
        if (val.voice_Connection) val.voice_Connection.disconnect()
        guildMap.delete(mapKey)
    } else {
        msg.reply("Cannot leave because not connected.")
    }
}