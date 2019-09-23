## This is Backend of todo application in nodejs

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
SECRET = secreteKey  // for JWT 
  </code><br/>
  <code>
DB_HOST=localhost    // for hostname in database  </code><br/>
    <code>
DB_USER=username     // your mysql username like root  </code><br/>
      <code>
DB_PASS=password     // your mysql password  </code><br/>
        <code>
DB_NAME=todoBackend  // your database name <br/>
</code><br/>

Table will create automatically by backend code
