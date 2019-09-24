import React, {Component} from 'react';
import {reactLocalStorage} from 'reactjs-localstorage';
import {Redirect} from 'react-router-dom';

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
            redirect:false
        }
    }

    UNSAFE_componentWillMount(){
        var Token =reactLocalStorage.get('token');
        axios
        .get('http://localhost:8080/get',{params:{token:Token}})
        .then(result=>{
                console.log('get method',result.data);
                if(result.data==='tokenExpires'){
                    console.log('true');
                    reactLocalStorage.get('token','')
                    reactLocalStorage.clear();
                    this.setState({redirect:true})
                }else{
                    this.setState({itemList:result.data})
                }
                
        })
        .catch(err=>{
            console.log('this is err',err);
        })
    }
    // componentDidMount(){
    //     if(reactLocalStorage.get('token')){
    //         console.log('user logged in !')
    //     }else{
    //         this.setState({redirect:true})
    //     }
    // }

// this function checks the expiry of token and after expiry it will remove token from localstorage and redirect login page
    componentWillUpdate(){
        var Token =reactLocalStorage.get('token');
        axios
        .get('http://localhost:8080/get',{params:{token:Token}})
        .then(result=>{
                console.log('get method',result.data);
                if(result.data==='tokenExpires'){
                    console.log('true');
                    reactLocalStorage.get('token','')
                    reactLocalStorage.clear();
                    this.setState({redirect:true})
                }
        })
        .catch(err=>{
            console.log('this is err in componentWillUpdate',err);
        })
    }

// this is logout feature when user click logout then it will render login page and remove token from localstorage
    logout=()=>{this.setState({redirect:true})}

    onChangeHandler = (e) => {
        this.setState({
            item:e.target.value
        })
    }

// this function is for add and update todo while editing or adding new todo, it sends data to backend and return back and update;    
    addItem = (e) => {
    if(e.key==='Enter' || e.target.id === 'button'){
        var Token =reactLocalStorage.get('token').toString();
        console.log('this is token from local storage ; ',Token.toString());
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
                    .post('http://localhost:8080/post',{token:Token,data:this.state.itemList[this.state.itemList.length-1]})
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
                        .put("http://localhost:8080/put/"+i, {token:Token,text:this.state.editItem,id:itemList[i].id})
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
        var Token =reactLocalStorage.get('token');
        const itemList = this.state.itemList;
        var dict = _.findWhere(this.state.itemList,{id:parseInt(e.target.id,10)});     
        if(dict.done===0 || dict.done === false){            
            dict.done = true;
            this.setState({ itemList })            
            axios
            .put('http://localhost:8080/done/'+dict.id,{done:true,text:dict.text,token:Token,id:dict.id})
            .then(()=>{console.log('done updated to true')
            })
            .catch((err)=>{console.log('err in done updating',err)
            })
        }else{
            dict.done = false;
            this.setState({ itemList })
            
            axios
            .put('http://localhost:8080/done/'+dict.id,{done:false,text:dict.text,token:Token,id:dict.id})
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
        var Token =reactLocalStorage.get('token');
        // var listIns = this.state.itemList;
        var dict = _.findWhere(this.state.itemList,{id:e})
        axios
        .post('http://localhost:8080/delete/'+e,{id:e,token:Token,userId:dict.userId})
        .then((result)=>{
            this.setState({itemList:result.data})
        })
        .catch((err)=>{console.log('err in sending delete id to backend',err)})
    }
    
    render(){
        if(this.state.redirect){
            return(<Redirect to={'/login'} />)
        }
        return (
            <div className="app">
                <div className="subapp">
                    <Header logout={this.logout}
                        itemList={this.state.itemList} 
                    />
                    {/* <Stats listShouldbe={this.listShouldbe} itemList={this.state.itemList} /> */}
                    <Todo addItem={this.addItem} 
                            todo={this.state.item} 
                            onChangeHandler={this.onChangeHandler} 
                        />
                    <List addItem={this.addItem} 
                            checkbox={this.checkbox} 
                            empty={this.state.empty} 
                            deleteHandler={this.deleteHandler} 
                            editChangeHandler={this.editChangeHandler} 
                            itemList={this.state.itemList} 
                            defaultList={this.state.defaultList} 
                            todo={this.state.editItem} 
                            todoId={this.state.todoId} 
                            edit={this.edit}
                        />
                </div>
            </div>
        )
    }
}
