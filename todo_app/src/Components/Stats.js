import React from 'react';

class Stats extends React.Component  {

    totalItem=()=>{
        var total = this.props.itemList;
        return total.length
    }
    doneItem=()=>{
        var count =0
        var total = this.props.itemList;
        for(var i of total){
            if(i.done===true || i.done===1){
                count++                
            }
        }
        return count
    }
    pendingItem=()=>{
        var count =0
        var total = this.props.itemList;
        for(var i of total){
            if(i.done===false || i.done===0){
                count++                
            }
        }
        return count
    }

    render() {
        
        return (
            <div className="stats">
                <div data-id="total" onClick={this.props.listShouldbe}>Total:{this.totalItem()}</div>
                <div data-id="done" onClick={this.props.listShouldbe}>Done:{this.doneItem()}</div>
                <div data-id="pending" onClick={this.props.listShouldbe}>Pending:{this.pendingItem()}</div>
            </div>
        )
    }
}

export default Stats;
