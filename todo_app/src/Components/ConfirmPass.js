import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';
import axios from 'axios';
import queryString from 'query-string';
import {Redirect} from 'react-router-dom';


export class ConfirmPass extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             password:'',
             confirmPassword:'',
             token:true,
             isLogin:false
        }
    }
    UNSAFE_componentWillMount(){
        const value=queryString.parse(this.props.location.search);
        const token=value.key;
        axios
        .post('verifyToken',{'token':token})
        .then((result)=>{
                if(result.data!=="tokenExpired"){console.log('Token valid')}
            else{
                swal('Token expired !','please resister your email again for new mail','warning');
                this.setState({token:false})
                }
        })

    }
    componentDidMount(){
        const value=queryString.parse(this.props.location.search);
        const token=value.key;
        axios
        .post('verifyToken',{'token':token})
        .then((result)=>{
                if(result.data!=="tokenExpired"){console.log('Token valid')}
            else{
                swal('Token expired !','please resister your email again for new mail','warning');
                this.setState({token:false})
                }
        })

    }

    passwordChange=(e)=>{
        this.setState({password:e.target.value})
    }
    confirmPasswordChange=(e)=>{
        this.setState({confirmPassword:e.target.value})
    }
    onSubmitHandler=(e)=>{
        e.preventDefault()
        const value=queryString.parse(this.props.location.search);
        const token=value.key;
        console.log(token)
        if(this.state.password===this.state.confirmPassword){
            axios
            .post('http://localhost:8080/newPassword',{'newPassword':this.state.password,'token':token})
            .then((result)=>{
                swal('Password changed successfully','Please go back to login page','success')
                this.setState({password:'',confirmPassword:'',isLogin:true})
            })
            .catch((err)=>{console.log('err in sending new password to backned ',err)})
        }else{
            swal('Password did not match','Please try again','warning')
        }
        
    }

    
    render() {
        if(!this.state.token){
            return(<Redirect to={'/forget'} />)
        }
        if(this.state.isLogin){
            return(<Redirect to={'/login'} />)
        }
        return (
            <React.Fragment>
                <Grid item  xs={12} sm={6} md={4}>
                    <Card>
                        <form onSubmit={this.onSubmitHandler}>
                        <CardHeader
                                title={'Password Confirmation'}
                                titleTypographyProps={{ align: 'center' }}
                                style={{background:'#f44336',color:'white'}}

                            />
                            <Typography component="h2" variant="h3" color="textPrimary" >
                            <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="password"
                                    label="New Password"
                                    name="password"
                                    type="password"
                                    autoFocus
                                    value={this.state.password}
                                    onChange={this.passwordChange}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={this.state.confirmPassword}
                                    onChange={this.confirmPasswordChange}
                                />
                                </Typography>
                                <Button
                                style={{marginTop:'20px'}}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                >
                                    Submit
                                </Button>
                            </form>
                    </Card>
                </Grid>
            </React.Fragment>
        )
    }
}

export default ConfirmPass
