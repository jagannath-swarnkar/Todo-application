import React from 'react';
// import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';

import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },

  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },

  },
}));


export default function Pricing(props) {
  const classes = useStyles();
  const [email, setEmail] = React.useState('');
  const confEmailSubmit=(e)=>{
    e.preventDefault()
    props.confEmailSubmit(email)
    setEmail('')
}
  return (
    <React.Fragment>
        <div>
        
            <Grid item  xs={12} sm={6} md={4}>
            
                <Card>
                    <CardHeader
                        title={'Enter your Email Id '}
                        titleTypographyProps={{ align: 'center' }}
                        className={classes.cardHeader}
                    />
                    <CardContent>
                    <form onSubmit={confEmailSubmit}>
                            <Typography component="h2" variant="h3" color="textPrimary">
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
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </Typography>
                            <CardHeader
                                align={'center'}
                                subheader={'Check your mail after submit or wait for response'}
                                ></CardHeader>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}

                            >
                                Submit
                            </Button></form>
                       
                    </CardContent>
                </Card>
               
            </Grid> </div>
    </React.Fragment>
  );
}