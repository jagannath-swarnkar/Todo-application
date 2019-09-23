import React, { Component } from 'react';
import ConfEmail from './ConfEmail';

export class ForgetPass extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }
  confEmailSubmit=(email)=>{
    console.log(email)
  }
  
  render() {
    return (
     <React.Fragment>
       <ConfEmail confEmailSubmit={this.confEmailSubmit(email)}/>
     </React.Fragment>
    )
  }
}

export default ForgetPass
