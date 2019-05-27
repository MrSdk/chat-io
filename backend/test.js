const Sequelize = require("sequelize")
// console.log(process.env);

var db = new Sequelize(process.env.db_name, process.env.db_user, process.env.db_pass, {
    host: process.env.host,
    dialect: "mysql",
    // operatorsAliases: true,
    define: {
        timestamps: false
    },

    // pool: {
    //     max: 5,
    //     min: 0,
    //     acquire: 30000,
    //     idle: 10000
    // },
})

var User = db.define('users', {
    name: {
        type: Sequelize.STRING
    },
    email: Sequelize.STRING
});

(async function () {
    // create => await User.create().then((res)=>{ console.log(res.dataValues)  })
    // User.create({ name: "Sdk"  }).then((res)=>{
    //     console.log(res.dataValues);
        
    // }).catch(e=>{
    //     console.log(e);
        
    // })

    // findAll
    // var a = []
    // var users = await User.findAll( ).then((res)=>{
    //                     return res;
    //                     // console.log("___________________________________________________________________");
    //                 }).catch(e=>{
    //                     console.log(e);
    //                     console.log("___________________________________________________________________");
    //                 })
    //           users.forEach((user)=>{
    //               a.push(user.dataValues)
    //           })
    //                 console.log(a);
                    
    // users.forEach(user => {
    //     console.log(user.dataValues);    
    // });

    // findOne
    //     var user = await User.findOne({where: { id: 22 }}).then((res)=>{
    //                     return res;
    //                     // console.log("___________________________________________________________________");
    //                 }).catch(e=>{
    //                     console.log(e);
    //                     console.log("___________________________________________________________________");
    //                 })
    // console.log(user ? true : false); 
    // console.log(user.dataValues);
       

    // findOneAndUpdate
    // if (await User.findOne({ where: { id: 22 } })) { 
        
    //     var user = await User.update({ name: "Sdk5" }, { where: { id: 22 } }).then((res) => {
    //         return res;
    //         // console.log("___________________________________________________________________");
    //     }).catch(e => {
    //         console.log(e);
    //         console.log("___________________________________________________________________");
    //     })
    //     console.log(user);
    // }
    
    // console.log((await User.findOne({ where: { id: 4 } })).dataValues);

    //findOneAndRemove
    // if( await User.findOne({ where: { id: 4 } }) ){
        // User.destroy({ where: { email: "sdk@mail.com" } }).then((res)=>{
        //     console.log(res);   
        //     console.log("AAAAAAAAA");
            
        // }).catch(e=>{
        //     console.log(e);
        //     console.log("_________________________________");
            
        // })
    // }
})()