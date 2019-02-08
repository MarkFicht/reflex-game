import React from 'react';

const fakeChars = ['x', 'x', 'x'];

const gameButtonsDummy = (
    <div className="btns">
        { 
            fakeChars.map( (char, index) => {
                return <button key={index} className='btn-game btn-game-noEffect'>{ char }</button>
            })
        }
    </div>
);

export default gameButtonsDummy;