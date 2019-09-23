import React from 'react';
import Signup from './Components/Signup';
import { BrowserRouter as Router,Switch, Route } from "react-router-dom";
import LoginPage from './Components/LoginPage';
import App from './Components/App';
import ForgetPass from './Components/ForgetPass';
import ConfirmPass from './Components/ConfirmPass';

function AppRouter(){    
return(
 <Router>
     <Switch>
        <Route path='/' exact component={App} />
        <Route path='/login' exact component={LoginPage} />
        <Route path='/home' exact component={App} />    
        <Route path='/signup' exact component={Signup} />
        <Route path='/forget' exact component={ForgetPass} />
        <Route path='/newPassword' component={ConfirmPass} />
    </Switch>
</Router>)}

export default AppRouter;
