var con = require('../DB/conDb');
module.exports = async (bot,message,args,argsF,Discord) => {
   
       // OTA3NjEzNDkwODU0OTIwMjIy.YYpu7g.pUEzFnCtPIvQjnIfRdclAKZDDis

    const cont = argsF.join(" ")

    

    if(cont==""){
        message.delete()

      
       return message.channel.send("Для авторизации введите пароль после !auth")
   }

   

   con.query('SELECT * FROM `users` WHERE `users`.`id` = ? AND `users`.`pass` = ? ',
   [message.author.id, cont], async (err,res,fields)=>{
       if(err)
          return console.log(err.message);
  
          if(!res.length ==0) {

            // setTimeout(()=>{
            //     bot.message.delete()
            // },3000)

            message.delete()
            
               message.channel.send("Авторизация прошла успешно ")

               const embed = new Discord.MessageEmbed()
               .setColor('#ff0000')
               .setTitle('Error')
               return message.channel.send(embed);

            }
            else{
                message.delete()
                return message.channel.send("Неккоректные данные")
                
            }})
    };
    

    
 
    