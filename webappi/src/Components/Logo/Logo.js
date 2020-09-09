import React from 'react';
import Tilt from 'react-tilt';
import smile from './smile.png'
import './Logo.css';
const Logo = () =>
{
    return (
        <div className = 'ma4 mt0'>
            <Tilt className="Tilt br2 shadow-3" options={{ max : 25 }} style={{ height: 150, width: 150 }} >
            <div className="Tilt-inner pa3"> <img alt = 'logo' src =  {smile}/> </div>
            </Tilt>
        </div>
    );
}

export default Logo;