import React, { Component } from 'react';

class Validation extends Component {

    render() {
        const { containerValidation, onlinePlayer, nickValidation } = this.props;
        const showOrHide = containerValidation ? 'block' : 'none';
        const statement1 = onlinePlayer >= 2 
            ? <p>Jest 2 graczy. Poczekaj chwilkę.</p> 
            : null;
        const statement2 = nickValidation 
            ? null 
            : <p>Nick musi zawierac od 3 do 9 znakow!</p>;
        
        /** */
        return (
            <div className="validation" style={{ display: showOrHide }}>
                { statement1 }
                { statement2 }
            </div>
        );
    }
}

export default Validation;