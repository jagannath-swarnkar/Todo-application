import React, { Component } from 'react';
import ConfEmail from './ConfEmail';
import axios from 'axios';
import swal from 'sweetalert';

export class ForgetPass extends Component {
  confEmailSubmit=(email)=>{
    axios
    .post('http://localhost:8080/nodemailer',{'email':email})
    .then((data)=>{
      if(data.data==='noUser'){
        swal('User email does not exists','Please sign up first or try with valid email','warning')
      }else{
        swal('Please check your email','','success')
      }
      
    })
    .catch((err)=>{console.log('err in sending email to nodemailer :',err)
        swal('User email does not exists','Please sign up first or try with other email','warning')    
      })
  }
  
  render() {
    return (
     <React.Fragment>
       <ConfEmail confEmailSubmit={this.confEmailSubmit}/>
     </React.Fragment>
    )
  }
}

export default ForgetPass
