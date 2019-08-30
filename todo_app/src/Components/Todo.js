import React from 'react';

function Todo(props){

    return(
        <div className="todo">
            <input autoFocus type="text" value={props.todo} onChange={props.onChangeHandler}/>
            <button onClick={props.addItem}>Submit</button>
        </div>
    )
}
export default Todo
