import React from 'react';
import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

const Toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            {/* <div>MENU</div> */}
            <DrawerToggle clicked={props.drawerToggleClicked} />
            {/* <Logo height="80%"/> */}
            <div className={classes.Logo}>
                <Logo />
            </div>
            <nav className={classes.DesktopOnly}>  
                <NavigationItems />
            </nav>
        </header>
    );
};

export default Toolbar;