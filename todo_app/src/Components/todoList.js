import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
  
  export default function todoList(props) {
    const listState = props.defaultList;
    const todos = props.itemList.filter((it) => {
        if ( listState === 'pending' ) {            
            return !it.done;
        } else if ( listState === 'done') {
            return it.done;
        } else {
            return true;
        }
    })

    return (
        <List style={{
                width: '100%',
                display:"flex",
                flexDirection:"column"
                }}>
          {todos.map((value,index) => {
              if(value.id===props.todoId){
                return (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Checkbox checked={value.done} 
                                onClick={props.checkbox} 
                                id={value.id} />
                    </ListItemIcon>
                    <Input style={{width:"100%"}}
                            value={props.todo} 
                            onChange={props.editChangeHandler} 
                            error 
                            onKeyPress={props.addItem} 
                            autoFocus 
                            fullWidth/>
                  </ListItem>
                );
              }else{
                return (
                  <ListItem key={index} 
                    onDoubleClick={props.edit} 
                    value={value.text} 
                    id={value.id}>
                    <ListItemIcon>
                      <Checkbox checked={value.done} 
                        onClick={props.checkbox} 
                        id={value.id} />
                    </ListItemIcon>
                    <div onDoubleClick={props.edit} >
                      <ListItemText 
                        id={value.id} 
                        primary={`${value.text}`} />
                    </div>
                    <ListItemSecondaryAction>
                      <IconButton style={{alignItems:"flex-end"}}
                        edge="end" 
                        aria-label="comments"  
                        id={value.id} 
                        onClick={()=>{props.deleteHandler(value.id)}}>
                        <HighlightOffIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              }
          })}
        </List>
      );
  }
