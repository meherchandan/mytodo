import React, { Component } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import ContentClear from 'material-ui/svg-icons/content/clear';
import { red500, grey500 } from 'material-ui/styles/colors';

const styles = {
    listitem: {
        display: 'flex',
        textAlign: 'left',
        display: 'inline-block',
    },
    container: {
        height: 'auto',
        width: 600,
        margin: 10,
        display: 'block',
        padding: 12,
        textAlign: 'start'
    },
    item: {
        lineHeight: '28px',
        fontSize: '26px',
        margin: 0,
        width: '88%',
        display: 'inline-block',
        position: 'relative',
        overflowWrap: 'break-word'

    },
    checkbox: {
        display: 'inline-block',
        width: 'auto'
    }
};

class ToDoItems extends Component {

    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            text: this.props.value,
            textupdate: this.props.value
        }
    }

    changetodotype() {
        this.setState({ edit: true });
    }

    modifytodo(event) {
        this.setState({
            text: event.target.value
        });
    }

    componentDidUpdate() {
        if (this.refs.textField) {
            this.refs.textField.focus();
        }
    }

    updatetodoitems(event) {
        if (event.which === 13) {
            this.setState({ edit: false });
        }
        if (event.which === 27) {
            let textupdate = this.state.textupdate;
            this.setState({
                edit: false,
                text: textupdate
            });
        }
    }

    saveonfocuschange(event) {
        this.setState({
            text: event.target.value,
            edit: false
        });
    }

    render() {
        let todolists;
        let todotexttype;
        if (this.state.edit === false) {
            todolists = < span style = { styles.item }
            onDoubleClick = { this.changetodotype.bind(this) } > { this.state.text } < /span>
        } else {
            todolists = < TextField value = { this.state.text }
            ref = "textField"
            id = { String(this.props.id) }
            onChange = { this.modifytodo.bind(this) }
            onKeyDown = { this.updatetodoitems.bind(this) }
            onBlur = { this.saveonfocuschange.bind(this) }
            / > 
        }

        let checkbox = < Checkbox key = { this.props.id }
        style = { styles.checkbox }
        id = { this.props.id }
        checked = { this.props.status }
        onCheck = { this.props.toggleCheck }
        />
        return ( < Paper style = { styles.container }
            zDepth = { 1 } > { checkbox } { todolists }

            < ContentClear color = { grey500 }
            hoverColor = { red500 }
            onClick = { this.props.deleteTodos }
            /> < /Paper >

        )
    }
}

export default ToDoItems;
