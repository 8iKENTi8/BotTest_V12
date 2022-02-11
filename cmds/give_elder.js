var con = require('../DB/conDb');

module.exports = async (bot,message,args,argsF) => {

    

    const cont = argsF.join(" ") // все что пишеться после !reg
    const res1 = cont.split(" ") // Разделеяем все записи на масив
    
    var user = message.guild.members.cache.get(message.author.id);

    console.log(user.roles);

    // 933467032291266610 преподоавтель
    // 931628294409945138 студент
    // 879638814098866217 абобус главный
    // 257871068532834304 староста

  

    function Check_User_id(student,callback){
        console.log(student);
           //  Проверка сушествует ли Фамилия и Имя студента
     con.query('SELECT `id` FROM `users` WHERE `id_s` = ?',
     [student], async (err,res,fields)=>{
 
         //Проверка на выполнение запроса
         if(err){
             console.log(err.message);
             
             return callback(0,false)
         }
             
            if(res.length ==0) {
                
             message.channel.send("такого юзера не существует ")
             return callback(0,false)
           }
           else{
               console.log(res[0].id)
            return callback(res[0].id,true)
           }
           
            
    })

    }

    function Stage1(student){

        Check_User_id(student,function (id_u,res) {
              

            if(res){

                con.query('UPDATE `users` SET `id_r` = 2 WHERE `users`.`id` = ?',
          [id_u], async (err,res,fields)=>{
      if(err)
         return console.log(err.message);
 
         message.delete()
         message.channel.send("Роль у пользователя изменилась")
         
        //  var role = message.guild.roles.cache.find(role => role.id === "933467032291266610")
        //  var user = await bot.users.fetch(id_u).catch(console.error);
        //  console.log(user);

        const memberID = id_u;   // you want to add/remove roles. Only members have roles not users. So, that's why I named the variable memberID for keeping it clear.
        const roleID = '933483006511972352';

        const guild = bot.guilds.cache.get('859156583928561705');  
        const role = guild.roles.cache.get(roleID);  
        const member = await guild.members.fetch(memberID); 
        member.roles.add(role);   
         

         
        //  var user = message.guild.members.cache.get(message.author.id);
        //   user.UpdateRole(role.id)
        //  console.log(id_u);
       
        })
            }
            else
            return console.log("Роль не была обнавлена");
          


        })
    }
        
          
    


    function Check_group(callback) {
         
        //Проверка сушествует ли данная группа
       con.query('SELECT * FROM `groups` WHERE `groups`.`name` =?',
    [res1[0]], async (err,res,fields)=>{

        //Проверка на выполнение запроса
        if(err){
            console.log(err.message);
            
            return callback(0,false)
        }
            
           if(res.length ==0) {
          
            message.channel.send("такой группы не существует")
            
            return callback(0,false)
          }else{
            
            // берем id группы если такая существует
            return callback(res[0].id_g,true)
           
           
          } 
           
   })
   
    }

    function Check_student(grop,callback) {
        //  Проверка сушествует ли Фамилия и Имя студента
     con.query('SELECT * FROM `students` WHERE `students`.`lastname` = ? AND `students`.`firstname` =? AND `students`.`id_g` = ?',
     [res1[1],res1[2],grop], async (err,res,fields)=>{
 
         //Проверка на выполнение запроса
         if(err){
             console.log(err.message);
             
             return callback(0,false)
         }
             
            if(res.length ==0) {
                console.log(res1[0],res1[1],res1[2]);
             message.channel.send("такого студента не существует ")
             return callback(0,false)
           }
           else{
            return callback(res[0].id_s,true)
           }
           
            
    })

    }



    function UpdateRole() {
        result = true
        grop = 0
    
        // Вызываем метод для проверки на сущ группы, если результат true, 
        // группа найдена, если нет, то выходим и говорим "Регистрация не была произведена"
        //Так же если группа найдена , то в параметр груп записываем id группы
        Check_group(function (grop,result) {
            console.log(result);
            
            // Если группа найдена
           if(result){
               
            //Тут проблема в том , что параметр !!!!grop!!!! из "Check_group" я не могу выташить отсюда
            //Я создаю новую перменую, и присваиваю туда grop, но когда выхожу почему то не меняет!!
            // Поэтому в этой проверке я вызовую проверку на студента , туда я передаю группу, и в запросе 
            // смотрю есть ли такой студент или нет
            // так же есть параметр student , это id студента, который ищеться по фамили и его имени, и найденому id группы,
            // после чего Insert_reg выполняет запрос на добавление юзера
            
            Check_student(grop,function (student,result) {
                console.log(result);
                if(result){
                    Stage1(student)
                }
                else
                    return console.log("Роль не выдана");
            })
           
            
        }
        // Если группа не найдена
        else
            return console.log("Не была выдана роль старосты");
            
        })
        
    }

    
    if(user.roles.cache.find(role => role.name == "Преподаватель")){
        if(res1.length!=3){
            message.delete()
           
           return message.channel.send("Для изменения старосты необходимо повторить данную команду !give_elder `your_group` `your_lastname` `your_firstname`")
       }
          UpdateRole()
       }
       else{
        message.delete()
        return message.channel.send("Только преподователи могут выдавать старосту")
       }
       
   
};

