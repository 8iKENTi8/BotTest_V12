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

               if(res[0].id_r==4){
                const embed = new Discord.MessageEmbed()
               .setColor('#ff0000')
               .setTitle('Преподователь')
               .setFooter("!My_appreciations\n!Mysuggestions\n!My_visitability\n!All_users\nGive_elder")
               return message.channel.send(embed);
               }
               if(res[0].id_r==2){
                const embed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Староста')
                .setFooter("!My_appreciations\n!Mysuggestions\n!My_visitability\n!All_student")
                return message.channel.send(embed);
               }
               if(res[0].id_r==1){
                const embed = new Discord.MessageEmbed()
                .setColor('#22467d')
                .setTitle('Студент')
                .setFooter("!My_appreciations\n!Mysuggestions\n!My_visitability")
                return message.channel.send(embed);
               }
              

            }
            else{
                message.delete()
                return message.channel.send("Неккоректные данные")
                
            }})
    };
    

    
 
    