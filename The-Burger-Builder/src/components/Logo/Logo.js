import React from 'react';
import classes from './Logo.module.css';
import BurgerLogo from '../../assets/images/burgerlogo2.png';

const Logo = (props) => {
    return (
        <div className={classes.Logo} style={{height: props.height}}>
            <img src={BurgerLogo} alt="Logo"/>
        </div>
    );
};

export default Logo;