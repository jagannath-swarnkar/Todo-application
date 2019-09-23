const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const checkToken = require('./tokenvar');
const {DB_HOST,DB_USER,DB_PASS,DB_NAME} = require('./config').envdata;
var cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');


// Creating connections for mysql server with knex query;
var knex = require('knex')({
    client: 'mysql',
    connection: {
      host:DB_HOST,
      user:DB_USER,
      database:DB_NAME,
      password:DB_PASS
    },useNullAsDefault:true
});

// creating table for storing todos
knex.schema.hasTable('todo').then(function(exists){
    if(!exists){
        return knex.schema.createTable('todo', function (table) {
            table.increments('id').primary().notNullable();
            table.integer('userId').notNullable();
            table.string('text').notNullable();
            table.boolean('done').notNullable();
          })
    }
})

// creating user detail table to store signup data
knex.schema.hasTable('userdetail').then((exists)=>{
    if(!exists){
        return knex.schema.createTable('userdetail',(t)=>{
            t.increments('userId').primary().unique().notNullable();
            t.string('name').notNullable();
            t.string('email').unique().notNullable();
            t.string('password');
            t.string('forget');
        },()=>{
            console.log('userdetail table created successfuly');
        })
    }
})

// Creating app and use another modules in app
var app = express();
app.use(express.json())
app.use(cookieParser());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE")
	next();
  });

// get method to send todos from database(tododb), table(todo) to frontend 
app.get('/get',checkToken,(req,res)=>{   
    jwt.verify(req.token,process.env.SECRET,(err,authData)=>{
        if(!err){
            knex('todo')
            .where('todo.userId',JSON.parse(authData.data).userId)
            .then((result)=>{
                if(result.length>0){
                    res.json(result)
                    }
                })
            .catch((err)=>{console.log('err in getting the todos from database : ',err)});
        }else{
            console.log('Token expired ');
            res.send('tokenExpires')
        }
    })
})

// Post method to store a new todo into database,table(todo) and return back to the frontend from database
app.post('/post',checkToken,(req,res)=>{
    jwt.verify(req.token,process.env.SECRET,(err,authData)=>{
        if(!err){
            req.body.data.userId = JSON.parse(authData.data).userId;
            knex('todo')
            .insert(req.body.data)
            .then(() => {console.log('data inserted',req.body.data);
                    knex('todo')
                    .where('todo.userId',JSON.parse(authData.data).userId)
                    .then((result)=>{
                        if(result.length>0){
                            res.send(result)
                            }
                        })
                    .catch((err)=>{console.log(err)});
                })
            .catch(err => console.log(err));
        }else{console.log('Token expired ');}
    })   
})

// Put method to store edited todo into database,table(todo) and return back to update in frontend;
app.put('/put/:id',checkToken,(req,res)=>{
    jwt.verify(req.token,process.env.SECRET,(err,authData)=>{
        if(!err){
            let text = req.body.text;          
            knex('todo')
            .where('todo.userId',JSON.parse(authData.data).userId).andWhere('todo.id',req.body.id)
            .update({text:text})
            .then((data) =>{console.log('database data',data);})
            .catch((err)=>console.log('token expired please login again'))
        }else{console.log('Token expired ');}
    })
})

// Put method to update the states like done or pending into database and return back to update in frontend
app.put('/done/:id',checkToken,(req,res)=>{
    jwt.verify(req.token,process.env.SECRET,(err,authData)=>{
        if(!err){
            knex('todo')
            .where('todo.id',req.body.id).andWhere('todo.userId',JSON.parse(authData.data).userId)
            .update({done:req.body.done})
            .then(() => console.log('done updated in db'))
            .catch((err)=>{res.send('err')})
        }else{console.log('Token expired ');}
    })
})
  

// Post method for signup page / inserting user detail into database
app.post('/signup',(req,res)=>{
    console.log(req.body);
    knex('userdetail')
        .insert({name:req.body.name,email:req.body.email,password:req.body.password1})
        .then(()=>{console.log('user signup detail has saved to database successfyly');
            knex('userdetail')
            .where('userdetail.email',req.body.email)
            .then((result)=>{
                console.log(result);
                
                res.send(result)
            })
           .catch((err)=>console.log(err)
           ) 
            })
        .catch((err)=>{console.log('err in inserting signup detail of user into database',err),res.send('err')})
})

// post method for login page, verifying login email Id with signup detail and creating JWT token and send to frontend
app.post('/login',(req,res)=>{
    knex('userdetail')
    .where('userdetail.email',req.body.email)
    .then((data)=>{
        if(data.length>0){
            if(req.body.password){
                if(data[0].password===req.body.password){
                    jwt.sign({data:JSON.stringify(data[0])}, process.env.SECRET,{expiresIn:'1m'}, (err, token) => {
                    if(!err){
                        res.send(token.toString())
                        }else{console.log('some err in sending token in cookie',err);}
                    })
                }else{console.log('wrong password'),res.send('wrongPass')}
            }else{
                jwt.sign({data:JSON.stringify(data[0])}, process.env.SECRET,{expiresIn:'1m'}, (err, token) => {
                    if(!err){
                        res.send(token.toString())
                        }else{console.log('some err in sending token in cookie',err);}
                    })
            }
        }else{console.log('user does not exists please signup first');res.send('err')}
    })
    .catch((err)=>{console.log(err);})
})

// Post method to delete a todo from database and update database and resend back updated data to fronted to update;
app.post('/delete/:id',checkToken,(req,res)=>{
    jwt.verify(req.token,process.env.SECRET,(err,authData)=>{
        if(!err){
            knex('todo')
            .del()
            .where('todo.id',req.body.id)
            .then((data)=>{
                knex('todo').select('*').where('todo.userId',req.body.userId)
                .then((result)=>{console.log(result);res.send(result)})
                .catch((err)=>console.log(err))
                })
            .catch((err)=>{console.log('err in deleting data in backend',err)})
        }else{console.log('Token expired ');}
    })
})

// // Creating endpoint to send verification mail to email id for reset password using nodemailer
app.post('/nodemailer',(req,res)=>{
    console.log('this is email from frontend in nodemaier',req.body.email)
    knex('userdetail')
    .where('userdetail.email',req.body.email)
    .then((data)=>{
        console.log(data[0])
        jwt.sign({data:JSON.stringify(data[0].email)},process.env.SECRET,{expiresIn:'5m'}, (err, token)=>{
            data[0].forget=token

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                    user: 'no.todo.reply@gmail.com',
                    pass: 'notodo@reply',
                tls: {	
                    rejectUnauthorized: false
                }
                }
            });
            let HelperOption = {
                from: 'Todo Application'+'<'+'no.todo.reply@gmail.com',
                to: req.body.email ,
                subject: 'Reset Password',
                html:`<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="padding: 0;">
                    <div id="wrapper" dir="ltr" style="background-color: #f7f7f7; margin: 0; padding: 70px 0; width: 100%; -webkit-text-size-adjust: none;">
                    <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
                    <tr>
                    <td align="center" valign="top">
                                        <div id="template_header_image">
                                                            </div>
                                        <table border="0" cellpadding="0" cellspacing="0" width="600" id="template_container" style="background-color: #ffffff; border: 1px solid #dedede; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1); border-radius: 3px;">
                    <tr>
                    <td align="center" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0" width="600" id="template_header" style='background-color: #1976d2; color: #ffffff; border-bottom: 0; font-weight: bold; line-height: 100%; vertical-align: middle; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif; border-radius: 3px 3px 0 0;'><tr>
                    <td id="header_wrapper" style="padding: 36px 48px; display: block;">
                                                        <h1 style='font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif; font-size: 30px; font-weight: 300; line-height: 150%; margin: 0; text-align: left; text-shadow: 0 1px 0 #4791db; color: #ffffff;'>Password Reset Request</h1>
                                                    </td>
                                                    </tr></table>
                    </td>
                                        </tr>
                    <tr>
                    <td align="center" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0" width="600" id="template_body"><tr>
                    <td valign="top" id="body_content" style="background-color: #ffffff;">
                                                        <table border="0" cellpadding="20" cellspacing="0" width="100%"><tr>
                    <td valign="top" style="padding: 48px 48px 32px;">
                                                                <div id="body_content_inner" style='color: #515151; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif; font-size: 14px; line-height: 150%; text-align: left;'>
                    
                    <p style="margin: 0 0 16px;">Hi ${data[0].name},</p>
                    <p style="margin: 0 0 16px;">You have requested a new password for your Todo Account</p>
                    <p style="margin: 0 0 16px;">Email: ${data[0].email}</p>
                    <p style="margin: 0 0 16px;">If you didn't make this request, just ignore this email. If you'd like to proceed:</p>
                    <p style="margin: 0 0 16px;">
                        <a class="link" href="http://localhost:3000/newPassword?key=${data[0].forget}&id=${data[0].userId}" style="font-weight: normal; text-decoration: underline; color: #1976d2;">		Click here to reset your password	</a>
                    </p>
                    <p style="margin: 0 0 16px;">Thanks for reading.</p>
                    
                                                                </div>
                                                                </td>
                                                            </tr></table>
                    </td>
                                                    </tr></table>
                    </td>
                                        </tr>
                    </table>
                    </td>
                                </tr>
                    <tr>
                    <td align="center" valign="top">
                                        <table border="0" cellpadding="10" cellspacing="0" width="600" id="template_footer"><tr>
                    <td valign="top" style="padding: 0; border-radius: 6px;">
                                                <table border="0" cellpadding="10" cellspacing="0" width="100%"><tr>
                    <td colspan="2" valign="middle" id="credit" style='border-radius: 6px; border: 0; color: #7d7d7d; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif; font-size: 12px; line-height: 150%; text-align: center; padding: 24px 0;'>
                                                        <p style="margin: 0 0 16px;">Sent by <a href="https://localhost:3000/" style="color: #1976d2; font-weight: normal; text-decoration: underline;">React-Todo</a>.</p>
                                                    </td>
                                                    </tr></table>
                    </td>
                                        </tr></table>
                    </td>
                                </tr>
                    </table>
                    </div>
                </body>`
            }
            transporter.sendMail(HelperOption, (error, info) =>{
                if(error){
                    return console.log(error);
                } else {
                    console.log("The message was sent ");
                    res.send(data)
                }
            })
        })
    })
})

// // Creating endpoint to verify the confirmation token in email
app.post('/verifyToken',(req,res)=>{
    jwt.verify(req.body.token,process.env.SECRET,(err,authData)=>{
        if(!err){
            res.send('validToken')
        }else(res.send('tokenExpired'))
    })
})

// // Creating endpoint to update new Password to database
app.post('/newPassword',checkToken,(req,res)=>{
    jwt.verify(req.token,process.env.SECRET,(err,authData)=>{
        if(!err){
            knex('userdetail')
            .where('userdetail.email',JSON.parse(authData.data))
            .update({password:req.body.newPassword})
            .then((data)=>{console.log('new password updated :',data)})
            .catch((err)=>{console.log('err in updatng new password : ',err)})
        }else{
            console.log('err in verifying token',err)
        }
    })
})



// defining the port on which App is running
app.listen(PORT=8080,()=>{
    console.log("Your backend is working on port : ",PORT);
})
