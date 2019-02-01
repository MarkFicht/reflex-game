import React from 'react';
import randomChar from '../other/randomChar';

const gameButtonsDummy = (
    <div className="btns">
        {randomChar.map(char => {
            return <button key={char} className='btn-game btn-game-noEffect'>{char}</button>
        })}
    </div>
);

export default gameButtonsDummy;