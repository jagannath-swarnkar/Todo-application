import React, {Component} from 'react';
import './App.css'
import Stats from './Stats';
import Todo from './Todo';
import List from './todoList';
import axios from 'axios';


export default class App extends Component{

    constructor(){
        super()
        this.state = {
            item:'',
            itemList:[],
            defaultList:'total',
            editId:""
        }
    }

    UNSAFE_componentWillMount(){        
        axios
        .get('/get')
        .then(result=>{console.log(result.data);
        
            this.setState({
                itemList:result.data    
            })
        })
        .catch(err=>{
            console.log('this is err',err);
            
        })
    }

    onChangeHandler = (e) => {
        this.setState({
            item:e.target.value
        })
    }

    addItem = () => {
        if(this.state.item.length>0){
            var itemList = this.state.itemList;
            if(this.state.editId===""){
            itemList.push({
                text:  this.state.item,
                done: false
            });
            this.setState({
                itemList:itemList,
                item:''
            });
        }else{
            console.log('this is else')
            console.log(this.state.editId)
            for(var i in itemList){
                if(itemList[i].text===this.state.editId){
                    itemList[i].text=this.state.item;
                    axios
                    .put("/put/"+i, {text:this.state.item})
                    .then(()=>{
                        console.log("put mehtonfsnj");
                    })
                    .catch((err)=>{console.log( 'err in put',err);
                    })
                }
            }
            console.log(this.state.itemList)
            this.setState({
                itemList:itemList,
                editId:"",
                item:''
            })
        }
        axios
        .post('/post',this.state.itemList[this.state.itemList.length-1])
        .then(() => console.log('data uploaded!'))
        .catch(err => console.log(err));

        }
    }

    checkbox = (e) => {
        const itemList = this.state.itemList;
        for(var i in itemList){            
            if(itemList[i].text===e.target.id){
                itemList[i].done = true;
                this.setState({ itemList })
                axios
                .put('/done/'+i,{done:true})
                .then(()=>{console.log('done')
                })
                .catch((err)=>{console.log('err in done updating',err)
                })
            }
        }
    }
localhost
    listShouldbe = (e) =>{ 
        if(e.target.dataset.id==='pending'){
        this.setState({ defaultList:e.target.dataset.id })
        }
        else if(e.target.dataset.id==='done'){
            this.setState({ defaultList:e.target.dataset.id })
        }
        else{
            this.setState({ defaultList:e.target.dataset.id })
        }
    }
    edit = (e) =>{
        var itemList = this.state.itemList
        for(var i in itemList){
            if(itemList[i].text===e.target.id){
                this.setState({
                    item:itemList[i].text,
                    editId:e.target.id
                })
            }
        }
    }

    render(){
        return (
            <div>
                <Stats listShouldbe={this.listShouldbe} itemList={this.state.itemList} />
                <Todo  todo={this.state.item} onChangeHandler={this.onChangeHandler} addItem={this.addItem}/>
                <List  checkbox={this.checkbox} itemList={this.state.itemList} defaultList={this.state.defaultList} edit={this.edit}/>
            </div>
        )
    }
}