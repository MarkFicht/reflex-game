import React, { Component } from 'react';

class InstructionBtn extends Component {

    state = {
        showInstruction: false
    }

    showOrHideInstruction = () => {
        this.setState({ showInstruction: !this.state.showInstruction })
    }

    render() {
        const { showInstruction } = this.state;

        const textInstruction = (<>
            <h2>Zasady gry:</h2>
            <ol>
                <li><strong>1.</strong> Projekt jest cały czas rozwijany!</li>
                <li><strong>2.</strong> Można używać myszki i klawiatury.</li>
                <li><strong>3.</strong> Musimy kliknąć właściwy znak (wyświetlany losowo) nad przyciskami: A S D, by dostać punkt.</li>
                <li><strong>4.</strong> Punkty są odejmowane za pomyłki!</li>
                <li><strong>5.</strong> Wygyrwa gracz, który uzbiera więcej punktów w czasie 30 sek.</li>
            </ol>
        </>);

        const instruction = showInstruction
            ? (<div className='instruction-background'>
                <div className='instruction-container'>
                    <div className='instruction-close' onClick={ this.showOrHideInstruction }> x </div>
                    { textInstruction }
                </div>
            </div>)
            : null;

        return (
            <>
                <button className='btn-login' onClick={ this.showOrHideInstruction }> Instrukcja </button>
                { instruction }
            </>
        );
    }
}

export default InstructionBtn;