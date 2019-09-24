import React from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import GoogleLogin from 'react-google-login';

import {Link} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  googleSignup: {
    width:'auto',
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const googleLoginHandler = (email,name) =>{
    axios
    .post('http://localhost:8080/signup',({'name':name,'email':email}))        
    .then((result)=>{
        if(result.data!=='err'){swal("Signup successful!", "Please signin !","success");
        console.log('signup successfull!')
          }
        else{swal("Signup failed!", "User email already exists, Please signin !","error");
          console.log('user exists!')
          };
    })
    .catch((err)=>{console.log('err in posting signup data'.err)})
  }
  
  const responseGoogle = (response) => {
    var userDetail=(response.profileObj);
    googleLoginHandler(userDetail.email,userDetail.name)
  }

    const onSubmitHandler = (e) =>{
        e.preventDefault();
        axios
        .post('http://localhost:8080/signup',({'name':name,'email':email,'password1':password}))        
        .then((result)=>{
            if(result.data!=='err'){swal("Signup successful!", "Please signin !","success");
            console.log('signup successfull!')
              }
            else{swal("Signup failed!", "User email already exists, Please signin !","error");
            console.log('user exists!')
              };
            setName('')
            setLastName('')
            setEmail('')
            setPassword('')
        })
        .catch((err)=>{console.log('err in posting signup data'.err)})
    }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={onSubmitHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"  
                label="First Name"
                // autoFocus
                value={name}
                onChange={(e) => setName(e.target.value )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
                {/* <routLink to='/login'> */}
              <Link to="/login" 
                style={{color:'blue'}}>
                Already have an account? Sign in
              </Link>
              {/* </routLink> */}
            </Grid>
          </Grid>
        </form>
      </div>
      <GoogleLogin
            clientId="619545785746-aeldlso5o53jo6ovnhm88uo9nsh6pgls.apps.googleusercontent.com"
            buttonText="Signup with Google"
            fullWidth
            className={classes.googleSignup}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            // cookiePolicy={'single_host_origin'}
          />
    </Container>
  );
}