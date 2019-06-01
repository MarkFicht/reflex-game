import React from 'react'
const avatars = [
    {value: 'bardock',  text: 'Bardock'},
    {value: 'c18',      text: 'C18'},
    {value: 'gokussj3', text: 'Goku Ssj3'},
    {value: 'vegeta',   text: 'Vegeta'} 
]

const AvatarsList = avatars.map(char => {
    return <option value={char.value} key={char.value}>{ char.text }</option>
})
export default AvatarsList