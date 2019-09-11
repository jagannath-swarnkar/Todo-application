import React, { Component } from 'react';
import LoginPage from './Components/LoginPage';
import App from './Components/App';
import Signup from './Components/Signup';

export class Main extends Component {
    constructor(props) {
        super(props);
        this.state={
            jwt:'',
            signup:false
        }
    }


jwtHandler=(e)=>{
    this.setState({jwt:e})
    
  }
  login =()=>{
    this.setState({signup:false},()=>{console.log('signup false',this.state.signup);
    })
  }
  signup = () =>{      
      this.setState({signup:true},()=>{console.log('signup true',this.state.signup);
      })
  }


  render(){
    

    if(this.state.jwt==='' && this.state.signup===false){
    var a=<LoginPage jwtHandler={this.jwtHandler} signup={this.signup}/>
    }
    else if(this.state.signup===true ){
        a=<Signup login={this.login}/>
    }
    else{
        a=<App jwt={this.state.jwt}/>
    }
        return (
            <div id="loginPage">
                {a}
            </div>
        )
    }
}


export default Main
