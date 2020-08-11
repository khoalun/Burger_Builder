import React, { Component } from 'react'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route} from 'react-router-dom';
import ContactData from './ContactData/ContactData';
 class Checkout extends Component {
    state = {
        // ingredients: {
        //     salad :1,
        //     meat: 1, 
        //     cheese: 1,
        //     bacon: 1
        // },
        ingredients: null,
        price :0 //??? should be totalPrice ???
    }

    componentWillMount () {
        const query = new URLSearchParams(this.props.location.search); //take from burgerbuilder.js in purchaseContinueHandler
        const ingredients ={};
        let price = 0;
        for(let param of query.entries()){
            // ['salad', '1']
            console.log(param);
            if(param[0] === 'price'){
                price = param[1]; // store the value of totalPrice from BurgerBuilder.js
            }else{
                ingredients[param[0]] = +param[1]; // + used to convert to number
            }
            
        }
        this.setState({ingredients: ingredients, totalPrice: price});
    }
    checkoutCancelledHandler =() =>{
        this.props.history.goBack();
    }

    checkoutContinuedHandler =() =>{
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}
                    />
                    <Route path={this.props.match.path + '/contact-data'} render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props} />)}/> {/*distribute props  after passing my own props which means whatever we get in props here will be passed on contactData and therefore, it will include history object and this.props.history.push('/'); can be used in ContactData.js*/}
            </div>
        )
    }
}
export default Checkout;