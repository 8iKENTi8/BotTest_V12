module.exports = async (bot,message,args,argsF) => {
    const user = await bot.users.fetch(message.author.id)
    user.send('hello')
    
}