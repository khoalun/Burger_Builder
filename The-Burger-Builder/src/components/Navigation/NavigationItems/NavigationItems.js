import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const NavigationItems = () => {
    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/" exact >Burger Builder</NavigationItem> {/*exact is from exact props in navigationitem.js */}
            <NavigationItem link="/orders">Orders</NavigationItem>
        </ul>
    );
};

export default NavigationItems;

