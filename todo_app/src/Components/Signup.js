import React, { Component } from 'react';
import './Signup.css';
import axios from 'axios';
import swal from 'sweetalert';

export class Signup extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
             name:'',
             email:'',
             password1:'',
             password2:''
        }
    }


    onSubmitHandler = (e) =>{
        e.preventDefault();
        axios
        .post('/signup',(this.state))        
        .then((result)=>{
            if(result.data!=='err'){swal("Signup successful!", "Please signin !","success")}
            else{swal("Signup failed!", "User email already exists, Please signin !","error")};
            this.props.login()
            this.setState({name:'',email:'',password1:'',password2:''})
        })
        
        .catch((err)=>{console.log('err in posting signup data'.err)})
        
    }
    nameChange = (e) =>{
        this.setState({name:e.target.value})
    }
    emailChange = (e) =>{
        this.setState({email:e.target.value})
    }
    password1Change = (e) =>{
        this.setState({password1:e.target.value})
    }
    password2Change = (e) =>{
        this.setState({password2:e.target.value})
    }
    
    render() {
        return (
            <div className="body">
    <div className="form">
    <ul className="tab-group">
    	<li className="tab active"><a href="#signup">Sign Up</a></li>
        <li className="tab"><a onClick={this.props.login}> Log In</a></li>
    </ul>
      
    <div className="tab-content">
        <div id="signup">   
          <h1>Sign Up for Free</h1>
          
	        <form onSubmit={this.onSubmitHandler}>
	          
		        <div className="top-row">
		            <div className="field-wrap">
		              <label>
		                Full Name<span className="req">*</span>
		              </label>
		              <input onChange={this.nameChange} value={this.state.name} className="box-size bl" type="text" autoComplete="off" required name="name" placeholder=" Your name" autoFocus/>
		            </div>
		        </div>

	         	<div className="field-wrap">
		            <label>
		              Email Address<span className="req">*</span>
		            </label>
	            	<input onChange={this.emailChange} value={this.state.email} className="box-size bl" type="email" required autoComplete="off" name="email" placeholder=" abc@gmail.com"/>
	          	</div>
	          
	          	<div className="field-wrap">
		            <label>
		              Set A Password<span className="req">*</span>
		            </label>
		            <input onChange={this.password1Change} value={this.state.password1} className="box-size bl" type="password" required autoComplete="off" name="password" placeholder=" Password"/>
	          	</div>
	          	
	          	<div className="field-wrap">
		            <label>
		              Confirm Password<span className="req">*</span>
		            </label>
		            <input onChange={this.password2Change} value={this.state.password2} className="box-size bl" type="password" required autoComplete="off" name="password2" placeholder=" Confirm Password"/>
	          	</div>
	          
            <button className="button button-block"> Get Started </button>
	          
	        </form>

        </div>   
    </div> 
      
</div> 
            </div>
        )
    }
}

export default Signup;
