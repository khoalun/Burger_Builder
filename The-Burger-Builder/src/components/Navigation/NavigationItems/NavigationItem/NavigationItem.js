import React from 'react';
import classes from './NavigationItem.module.css';
import {NavLink} from 'react-router-dom';

const NavigationItem = (props) => {
    return (
        <li className={classes.NavigationItem}>
            <NavLink
                to={props.link} 
                exact={props.exact}//only get used with the only link we choose
                // className={props.active ? classes.active: null} because navLink automatically defined active class
                activeClassName={classes.active}>
                {props.children}</NavLink>
        </li>
    );
};

export default NavigationItem;