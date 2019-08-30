const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3');

// creating database........
let db = new sqlite3.Database('Todo',(err)=>{
    if (err) {
        console.log('Could not connect to database', err)
      } else {
        console.log('Connected to database`tododb`')
      }
})

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./tododb"
    },useNullAsDefault:true
});

knex.schema.hasTable('todo').then(function(exists){
    if(!exists){
        return knex.schema.createTable('todo', function (table) {
            table.increments('id').primary();
            table.string('text');
            table.boolean('done');
          })
    }
})


var app = express();
app.use(express.json())
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE")
	next();
  });

app.get('/get',(req,res)=>{
    knex('todo')
    .then((result)=>{res.json(result)})
    .catch(err=>console.log('err in get method')
    )
    })
    


app.post('/post',(req,res)=>{
    knex('todo')
    .insert(req.body)
    .then(() => console.log('data inserted',req.body))
    .catch(err => console.log(err));
})
app.put('/put/:id',(req,res)=>{
    let id = parseInt(req.params.id)+1;
    let text = req.body;  
      
    knex('todo')
    .where('todo.id',id)
    .update(text)
    .then(() => console.log('updated'))
    .catch((err)=>console.log(err))
})
app.put('/done/:id',(req,res)=>{
    let id = parseInt(req.params.id)+1;
    let item = req.body;
    
    knex('todo')
    .where('todo.id',id)
    .update(item)
    .then(() => console.log('done updated in db'))
    .catch((err)=>console.log(err))
})

app.listen(PORT=8080,()=>{
    console.log("Your backend is working on port : ",PORT);
})
