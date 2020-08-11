import React, {Component} from 'react';
import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component{
    state ={
        showSideDrawer: false
    }

    sideDrawerCloseHandler = () =>{
        this.setState({showSideDrawer: false});  
    }

    sideDrawerToggleHanler = () =>{
        // this.setState({showSideDrawer : !this.state.showSideDrawer}); lead to unexpected outcome
        this.setState((prevState) => {
           return {showSideDrawer : !prevState.showSideDrawer}; 
        });
    }
    render(){
        return (
            <Aux>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHanler} />
                <SideDrawer 
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerCloseHandler}
                />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}


export default Layout;