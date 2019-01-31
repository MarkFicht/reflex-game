import React, { Component } from 'react';

class Instruction extends Component {
    hideInstruction = e => {
        if (typeof this.props.sendMethod === "function") {
            this.props.sendMethod(false);
        }
    }

    render() {
        return (
            <div className='instruction'>
                <div className='instruction-center'>
                    <div className='close-instruction' onClick={this.hideInstruction}> x </div>
                    <h2>Zasady gry:</h2>
                    <ol>
                        <li><strong>1.</strong> Projekt jest cały czas rozwijany!</li>
                        <li><strong>2.</strong> Można używać myszki i klawiatury.</li>
                        <li><strong>3.</strong> Musimy kliknąć właściwy znak (wyświetlany losowo) nad przyciskami: A S D, by dostać punkt.</li>
                        <li><strong>4.</strong> Punkty są odejmowane za pomyłki!</li>
                        <li><strong>5.</strong> Wygyrwa gracz, który uzbiera więcej punktów w czasie 30 sek.</li>
                    </ol>
                </div>
            </div>
        );
    }
}

export default Instruction;