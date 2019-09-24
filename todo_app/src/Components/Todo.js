import React from 'react';
import {Grid, TextField,Paper} from "@material-ui/core";

function Todo(props){
    return(
      <Paper style={{ margin: 16, padding: 14 }}>
            <Grid container>
                <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
                    <TextField
                        label="Add Todo here"
                        value={props.todo}
                        onChange={props.onChangeHandler}
                        onKeyPress={props.addItem}
                        fullWidth
                        autoFocus
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}
export default Todo