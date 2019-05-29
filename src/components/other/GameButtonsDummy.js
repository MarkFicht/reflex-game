import React from 'react'
import { fakeChars } from '../other/randomChar'

const GameButtonsDummy = (
    <div className="btns">
        {fakeChars.map((char, index) => {
            return <button key={index} className='btn-game btn-game-noEffect'>{ char }</button>
        })}
    </div>
)

export default GameButtonsDummy