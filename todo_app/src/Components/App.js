import React, {Component} from 'react';
import Header from './Header';
import './App.css';
// import Stats from './Stats';
import Todo from './Todo';
import List from './todoList';
import axios from 'axios';
import _ from 'underscore';

export default class App extends Component{

    constructor(){
        super()
        this.state = {
            item:'',
            itemList:[],
            defaultList:'total',
            editId:"",
            jwt:'',
            todoId:'',
            editItem:'',
        }
    }

    UNSAFE_componentWillMount(){     
        this.setState({jwt:this.props.jwt},()=>{
        axios
        .get('/get',{params:{token:this.state.jwt}})
        .then(result=>{console.log('get method',result.data);
            
                this.setState({
                itemList:result.data    
            })
        })
        .catch(err=>{
            console.log('this is err',err);
            
        })
        
    })
} 

    onChangeHandler = (e) => {
        this.setState({
            item:e.target.value
        })
    }

    addItem = (e) => {
    if(e.key==='Enter' || e.target.id === 'button'){
        
        if(this.state.item.length>0 || this.state.editItem.length>0){
            var itemList = this.state.itemList;
            if(this.state.editId===""){
            itemList.push({
                text:  this.state.item,
                    done: false
                });
                this.setState({
                    itemList:itemList,
                    item:''
                },()=>{
                    axios
                    .post('/post',{token:this.state.jwt,data:this.state.itemList[this.state.itemList.length-1]})
                    .then((data) => {
                        itemList[itemList.length-1]['id']=data.data[data.data.length-1].id;
                        itemList[itemList.length-1]['userId']=data.data[data.data.length-1].userId;
                            this.setState({
                                itemList:itemList,
                                item:''
                        })
                })   
                .catch(err => console.log(err));
                });
            }else{                                               
                for(var i in itemList){ 
                    if(itemList[i].id===parseInt(this.state.editId,10)){                     
                        itemList[i].text=this.state.editItem;
                        axios
                        .put("/put/"+i, {token:this.state.jwt,text:this.state.editItem,id:itemList[i].id})
                        .then(()=>{console.log();})
                        .catch((err)=>{console.log( 'err in put',err);})
                    }
                }
            this.setState({
                itemList:itemList,
                editId:"",
                editItem:'',
                todoId:null
            })
        }
        }}
    }

    checkbox = (e) => {        
        const itemList = this.state.itemList;
        var dict = _.findWhere(this.state.itemList,{id:parseInt(e.target.id,10)});     
        if(dict.done===0 || dict.done === false){            
            dict.done = true;
            this.setState({ itemList })            
            axios
            .put('/done/'+dict.id,{done:true,text:dict.text,token:this.state.jwt,id:dict.id})
            .then(()=>{console.log('done updated to true')
            })
            .catch((err)=>{console.log('err in done updating',err)
            })
        }else{
            dict.done = false;
            this.setState({ itemList })
            
            axios
            .put('/done/'+dict.id,{done:false,text:dict.text,token:this.state.jwt,id:dict.id})
            .then(()=>{console.log('done updated to false')
            })
            .catch((err)=>{console.log('err in done updating',err)
            })
        }

    }

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
        var dict = _.findWhere(this.state.itemList,{id:parseInt(e.target.id,10)})        
        this.setState({
            editItem:dict.text,
            editId:e.target.id,
            todoId:dict.id
        })  
    }
    editChangeHandler=(e)=>{
        this.setState({editItem:e.target.value})
    }
    deleteHandler=(e)=>{
        var listIns = this.state.itemList;
        var dict = _.findWhere(this.state.itemList,{id:e})
        axios
        .post('/delete/'+e,{id:e,token:this.state.jwt,userId:dict.userId})
        .then((result)=>{
            this.setState({itemList:result.data})
        })
        .catch((err)=>{console.log('err in sending delete id to backend',err)})
    }
    
    render(){
        return (
            <div className="app">
                <div className="subapp">
                <Header />
                {/* <Stats listShouldbe={this.listShouldbe} itemList={this.state.itemList} /> */}
                <Todo addItem={this.addItem} todo={this.state.item} onChangeHandler={this.onChangeHandler} />
                <List addItem={this.addItem} checkbox={this.checkbox} empty={this.state.empty} deleteHandler={this.deleteHandler} editChangeHandler={this.editChangeHandler} itemList={this.state.itemList} defaultList={this.state.defaultList} todo={this.state.editItem} todoId={this.state.todoId} edit={this.edit}/>
            </div>
            </div>
        )
    }
}
