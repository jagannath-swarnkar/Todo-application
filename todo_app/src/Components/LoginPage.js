import React from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import {reactLocalStorage} from 'reactjs-localstorage';
import GoogleLogin from 'react-google-login';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {Redirect, Link} from 'react-router-dom';
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
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  login: {
    width:'auto',
    marginTop:'5px',
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [redirect, setRedirect] = React.useState(false);

  const googleLoginHandler = (email) =>{
    // e.preventDefault();
    axios
        .post('http://localhost:8080/login',({'email':email}))
        .then((data)=> {            
            if(data.data==="wrongPass"){
                setPassword('');
                swal("Wrong Password!", "Please enter a valid password!","error");
                }    
            else if(data.data==='err'){
                setEmail('')
                setPassword('')
                swal("Login failed!", "User detail does not exists, Please signup first!","error");
                }
            else{
                reactLocalStorage.set('token', data.data.toString());
                setEmail('')
                setPassword('')
                setRedirect(true)
            }
            })
        .catch((err)=>{
            setEmail('')
            setPassword('')
            swal("Login failed! ", "User detail does not exists, Please signup first!","error");
        })
    }
    const responseGoogle = (response) => {
      // console.log(response.tokenObj);
      // console.log(response.tokenObj.id_token);
      var userDetail=(response.profileObj.email);
      googleLoginHandler(userDetail)
    }

  const onSubmitHandler = (e) =>{
    e.preventDefault();
    axios
        .post('http://localhost:8080/login',({'email':email,'password':password}))
        .then((data)=> {            
            if(data.data==="wrongPass"){
                setPassword('');
                swal("Wrong Password!", "Please enter a valid password!","error");
                }    
            else if(data.data==='err'){
                setEmail('')
                setPassword('')
                swal("Login failed!", "User detail does not exists, Please signup first!","error");
                }
            else{
                reactLocalStorage.set('token', data.data.toString());
                setEmail('')
                setPassword('')
                setRedirect(true)
            }
            })
        .catch((err)=>{
            setEmail('')
            setPassword('')
            swal("Login failed! ", "User detail does not exists, Please signup first!","error");
        })
    }
    if(redirect){
        return(<Redirect to={'/home'} />);
    }
    if(reactLocalStorage.get('token')){
        return(<Redirect to={'/home'} />);
    }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={onSubmitHandler}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value )}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            // autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value )}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to='/forget' 
                style={{color:'blue'}}
                variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to='/signup' 
                style={{color:'blue'}}
                variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          <GoogleLogin
            clientId="619545785746-aeldlso5o53jo6ovnhm88uo9nsh6pgls.apps.googleusercontent.com"
            buttonText="Login with Google"
            className={classes.login}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            // cookiePolicy={'single_host_origin'}
          />
        </form>
      </div>
    </Container>
  );
}