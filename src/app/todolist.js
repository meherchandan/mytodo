import React, { Component } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { deepOrange500 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import { List, ListItem } from 'material-ui/List';
import ToDoItems from './ToDoItems';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

import RefreshIndicator from 'material-ui/RefreshIndicator';

const styles = {
    listitem: {
        width: 800,
        display: 'flex',
        textAlign: 'left',
        display: 'inline-block',
        lineHeight: '28px',
        fontSize: '26px',
        margin: 0,
        width: '88%',
        position: 'relative',
    },
    refresh: {
        display: 'inline-block',
        position: 'relative',
    },
};

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500,
    },
});

class TodoList extends Component {
    constructor() {
        super();
        this.state = {
            todolistitems: [],
            hint: "Add todo item",
            value: Date.now(),
            newkey: 1,
            loading: true
        }
    }
    componentWillMount() {
        fetch('http://localhost:8080/mytodo', {
                method: 'get',
                mode: 'cors'
            })
            .then(res => res.json())
            .then(data => {
                let newtodolist=data.map(todo => {
                    return  {
                        id: todo._id,
                        text: todo.text,
                        completed: todo.Completed
                  }
                });
                newtodolist.reverse();
                this.setState({ todolistitems: newtodolist, loading:false});
            })
    }
    serialize(obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
        return str.join("&");
    }

    addtodoitems(event) {
        if (event.which === 13) {
            console.log("add called");

            if(event.target.value!==""){
            fetch('http://localhost:8080/mytodo', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    mode: 'no-cors',
                    body: this.serialize({ text: event.target.value, completed: false })
                        // body: `text=%22${event.target.value}%22&completed=false`
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data.message);
                 });
                let newtodolist=[];
                newtodolist.push({
                    id: Date.now(),
                    text: event.target.value,
                    completed:false
                });
                // newtodolist.push(this.state.todolistitems);
                for(let i in this.state.todolistitems){
                    newtodolist.push(this.state.todolistitems[i]);
                }
                this.setState({todolistitems: newtodolist});
            //      fetch('http://localhost:8080/mytodo', {
            //     method: 'get',
            //     mode: 'cors'
            // })
            // .then(res => res.json())
            // .then(data => {
            //     console.log("fetch called");
            //     let newtodolist=data.map(todo => {
            //         return  {
            //             id: todo._id,
            //             text: todo.text,
            //             completed: todo.Completed
            //       }
            //     });
            //     newtodolist.reverse();
            //     this.setState({ todolistitems: newtodolist, loading:false});
            // })
            this.state.value = Date.now();
        }}
    }

    toggleCheckboxAction(id) {

        let todolistitems = this.state.todolistitems;
        todolistitems.forEach((todo, index, array) => {
            if (todo.id == id) {
                // console.log(todo);
                array[index] = {
                    id: id,
                    text: todo.text,
                    completed: !todo.completed
                }
            }
        });

        this.setState({ todolistitems });
    }

    removetodos(id) {
        let todolistitem = this.state.todolistitems;
        todolistitem = todolistitem.filter((el) => {

            return el.id !== id;
        });

        this.setState({ todolistitems: todolistitem, value: Date.now() });
        let url = "http://localhost:8080/mytodo/" + id;
        
        fetch(url, {
                method: 'delete',
                mode: 'cors'

            })
            .then(res => res.json());
           
       
    }

    clearcomplete() {
        let todolistitems = this.state.todolistitems;
        todolistitems = todolistitems.filter((todo) => {

            return todo.completed == false;
        });
        this.setState({ todolistitems });
    }

    render() {
        let clearButton;
        if (this.state.todolistitems.length > 0) {
            clearButton = < FlatButton label = "Clear Completed"
            secondary = { true }
            key = { 123 }
            onClick = { this.clearcomplete.bind(this) }
            />
        }
        let todolist;

        if (this.state.loading === true) {
            // todolist= <CircularProgress />/>
            todolist = < RefreshIndicator
            size = { 60 }
            left = { 10 }
            top = { 40 }
            status = "loading"
            style = { styles.refresh }
            key="loader"
            />

        } else {
            todolist = this.state.todolistitems.map(todo => {
                return <ToDoItems value = { todo.text }
                id = { todo.id }
                key = { todo.id }
                status = { todo.completed }
                toggleCheck = { this.toggleCheckboxAction.bind(this, todo.id) }
                deleteTodos = { this.removetodos.bind(this, todo.id) }
                />

            });
        }
        return ( < MuiThemeProvider key="todolist" >
            < div key = 'mytodoitemlist' >
            < h1 key = 'heading' > Todo List < /h1>  <div key="tododata"> < TextField hintText = { this.state.hint }
            onKeyPress = { this.addtodoitems.bind(this) }
            key = { this.state.value }
            style = { styles.item }

            / > < /div > { todolist }  { clearButton }

            < /div> 

            < /MuiThemeProvider>

        )
    }
}

export default TodoList;
