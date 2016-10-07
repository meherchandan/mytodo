import React, { Component } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { deepOrange500 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import { List, ListItem } from 'material-ui/List';
import ToDoItems from './ToDoItems';
import FlatButton from 'material-ui/FlatButton';


const styles = {
    listitem: {
        alignItems: 'center',
        display: 'inline-block',
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
            newkey: 1
        }
    }
    componentWillMount() {
        fetch('http://localhost:8080/api/', {
                method: 'get',
                mode: 'cors'
            })
            .then(res => res.json())
            .then(data => {
                data.map(todo => {
                    let newtodolist = this.state.todolistitems;
                    newtodolist.push({
                        id: todo.id,
                        text: todo.text,
                        completed: todo.completed
                    });
                    this.setState({ todolistitems: newtodolist });
                });
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
            let newtodolist = this.state.todolistitems;
            newtodolist.push({
                text: event.target.value,
                completed: false
            });
            this.setState({ todolistitems: newtodolist });
            fetch('http://localhost:8080/api/mytodo', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                            // 'Content-Type': 'application/json'
                    },
                    mode: 'no-cors',
                    body: this.serialize({ text: event.target.value, completed: false })
                        // body: `text=%22${event.target.value}%22&completed=false`
                })
                .then(res => res.json())
                .then(data => {
                    data.map(todo => {
                        let newtodolist = this.state.todolistitems;
                        newtodolist.push({
                            id: todo.id,
                            text: todo.text,
                            completed: todo.completed
                        });
                        this.setState({ todolistitems: newtodolist });
                    });
                });
                // this.state.value=Date.now();
        }
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
        console.log(this.state.todolistitems);
    }

    removetodos(id) {

        let todolistitems = this.state.todolistitems;
        todolistitems = todolistitems.filter((el) => {
            return el.id !== id;
        });

        fetch('http://localhost:8080/api/mytodo/', {
                method: 'delete',
                mode: 'cors',
                id: id
            })
            .then(res => res.json())
            .then(data => {
                data.map(todo => {
                    let newtodolist = this.state.todolistitems;
                    this.setState({todolistitems:[]});
                    newtodolist.push({
                        id: todo.id,
                        text: todo.text,
                        completed: todo.completed
                    });
                    this.setState({ todolistitems: newtodolist });
                });
            })






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
            onClick = { this.clearcomplete.bind(this) }
            />
        }
        let todolist;
        todolist = this.state.todolistitems.map(todo => {
            return <ToDoItems value = { todo.text }
            id = { todo.id }
            status = { todo.completed }
            toggleCheck = { this.toggleCheckboxAction.bind(this, todo.id) }
            deleteTodos = { this.removetodos.bind(this, todo.id) }
            />

        });




        return ( < MuiThemeProvider >
            < div >
            < h1 > Todo List < /h1>  <div> < TextField hintText = { this.state.hint }
            onKeyPress = { this.addtodoitems.bind(this) }
            key = { this.state.value }

            / > < /div > { todolist } < br / > { clearButton }

            < /div> 

            < /MuiThemeProvider>

        )
    }
}

export default TodoList;
