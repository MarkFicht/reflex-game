import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ChooseNick extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        }
    }

    validation = (arg) => {
        if (arg) { return <FontAwesomeIcon icon="check-circle" style={{ color: '#5c7b1e' }} /> }
        else { return <FontAwesomeIcon icon="times-circle" style={{ color: 'red' }} /> }
    }

    inputNick = e => {
        if (typeof this.props.sendMethod === "function") {
            this.props.sendMethod(e);
        }
        this.setState({ name: e.target.value });
    }

    render() {
        return (
            <div>
                <label htmlFor="nick">Podaj Nick:</label>
                <input id='nick' placeholder='Nickname' type='text' value={this.state.name} onChange={this.inputNick} />
                <div className="validation-icon">{this.validation(this.props.nickValidation)}</div>
            </div>
        );
    }
}

export default ChooseNick;