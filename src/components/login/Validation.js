import React, { Component } from 'react';

class Validation extends Component {
    render() {
        return (
            <div className="validation" style={{ display: this.props.containerValidation ? 'block' : 'none' }}>
                {this.props.onlinePlayer >= 2
                    ? <p>Jest 2 graczy. Poczekaj chwilkę.</p>
                    : null
                }
                {this.props.nickValidation
                    ? null
                    : <p>Nick musi zawierac od 3 do 9 znakow!</p>
                }
            </div>
        );
    }
}

export default Validation;