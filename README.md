# Todo-application(React & nodejs)
This App has hosted on AWS and you can get this app on http://react-todo.cf

### This is Backend of todo application in nodejs

run command `npm install` to get all the packages <br/>
and run command `node server.js` to run backend  <br/>
you can also use nodemon instead of node <br/>
install nodemon with command `sudo npm install nodemon -g`  <br/>

you also have to do `mysql` setup for database (that used in this project)  <br/>
first install mysql and create a database named `todoBackend` (used in this project) <br/>

and for mysql connection in backend code, create a file in this directory name `.env` and open this file and make the following connections: <br/>

`touch .env` // to create `.env ` file   <br/>
`nano .env`  // to edit `.env` file  <br/>
write :<br/>
<code>
SECRET = secreteKey  </code> // for JWT  <br/>
  <code>
DB_HOST=localhost  </code>// for hostname in database <br/>
    <code>
DB_USER=username   </code>   // your mysql username like root <br/>
      <code>
DB_PASS=password    </code>  // your mysql password <br/>
        <code>
DB_NAME=todoBackend  </code>  // your database name <br/>

Table will create automatically by backend code



### Todo-app Frontend( React js)

first you need to run command `npm install` to get all the packages <br/>
then run `npm start` to run the app, it will open in your default browser automaticaly <br/>
within frontend you also need to run backend aside to make the app work properly <br/>
