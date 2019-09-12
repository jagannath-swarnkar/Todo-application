import React, { Component } from 'react';
import './LoginPage.css';
import axios from 'axios';
import swal from 'sweetalert';

export class LoginPage extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             email:'',
             password:''
        }
    }
    onChangeEmail=(e)=>{        
        this.setState({
            email:e.target.value
        })
    }
    onChangePass=(e)=>{
        this.setState({
            password:e.target.value
        })
    }
    onSubmitHandler=(e)=>{
        e.preventDefault();
        axios
        .post('http://localhost:8080/login',(this.state))
        .then((data)=> {
            console.log('data checking',data.data);
            
            if(data.data==="wrongPass"){
                this.setState({password:''},()=>{swal("Wrong Password!", "Please enter a valid password!","error");})
                // document.getElementById('pass').focus();
                }    
            else if(data.data==='err'){
                this.setState({email:'',password:''},()=>{swal("Login failed!", "User detail does not exists, Please signup first!","error");})
                }
            else{
                // this.props.login()
                console.log("data send successfuly");console.log(data.data)
                this.props.jwtHandler(data.data.toString())
                this.setState({email:'',password:''},()=>{swal("Login successful!", "...Please press enter for the next!");})
                }
            
            })
        .catch((err)=>{
            this.setState({email:'',password:''},()=>{swal("Login failed! ", "User detail does not exists, Please signup first!","error");})
        }
        )
    }

    render() {
        return (
            <div className="body">
                <div className="form" id="login">   
                    <h1>Welcome Back!</h1>
                    
                        <form onSubmit={this.onSubmitHandler}>
                            <div className="field-wrap">
                                <label>
                                    Email Address<span className="req">*</span>
                                </label>
                                <input autoFocus className="box-size bl" onChange={this.onChangeEmail} value={this.state.email} type="email" required autoComplete="off" name="email" placeholder=" abc@gmail.com"/>
                            </div>

                            <div className="field-wrap">
                                <label>
                                Password<span className="req">*</span>
                                </label>
                                <input id="pass" className="box-size bl" onChange={this.onChangePass} value={this.state.password} type="password" required autoComplete="off" name="Password" placeholder=" abc@123$ABC"/>
                            </div>
                                <p><a onClick={this.props.signup}>Signup</a></p><br/>
                                    {/* <p><a href="#">Forgot Password?</a></p>  */}
                                <button onClick={this.props.login} id="login" className="button button-block">Log In</button>
                        
                        
                        </form>

                    </div>
            </div>
        )
    }
}

export default LoginPage
