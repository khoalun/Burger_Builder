import React, { Component } from "react";


import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES ={
    salad: 0.5,
    cheese: 0.4,
    meat:1.3,
    bacon:0.7
};

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state ={...}
    // }
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        console.log(this.props);
        // axios.get('https://react-my-burger-bf037.firebaseio.com/ingredients.json')//fetch data from server
        //     .then(response => {
        //         this.setState({ingredients: response.data});
        //     })
        //     .catch(error => {
        //         this.setState({error: true});
        //     });
    }


    updatePurchaseState (ingredients){
        // const ingredients ={
        //     ...this.state.ingredients
        // };
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey] //return the number of each ingredients
                
            })
            .reduce((sum, el) => { //updated sum
                return sum + el;
            }, 0);
            console.log(sum);
        this.setState({purchasable: sum > 0});
    
    }

    addIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount +1;
       
        //console.log(updatedCount);
        const updatedIngredients ={
            ...this.state.ingredients
        };
        //console.log(updatedIngredients);
        updatedIngredients[type] =updatedCount;
        //console.log(updatedIngredients);
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice+ priceAddition;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);//call this function to update the button ORDER NOW
    }
    
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients ={
            ...this.state.ingredients
        };  
        updatedIngredients[type] =updatedCount;
        const priceDeductition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeductition;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);//call this function to update the button ORDER NOW
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler =() =>{
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => { //post data to server
        // alert("You can continue!");
        // this.setState({loading: true});
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice.toFixed(2),
        //     customer: {
        //         name: 'Nhan',
        //         address: {
        //             street: 'Vuorikatu 14',
        //             zipCode: '65100',
        //             country: 'Finland'
        //         },
        //         email: 'thiennhan07.2016@gmail.com'
        //     },
        //     deliveryMethod: 'fastest'
        // }

        // axios.post('/orders.json' , order)
        //     .then(response =>{
        //         this.setState({loading: false , purchasing: false});
        //     })
        //     .catch(error => {
        //         this.setState({loading: false , purchasing: false});
        //     });
        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        }); 

    }
    render() {
        const disabledInfo ={
            ...this.state.ingredients
        };
        for(let key in disabledInfo){ //after run this for loop, it will update the copied obj disableInfo 5.00 instead of state.ingred in removing ingredients safely lesson
            disabledInfo[key] = disabledInfo[key] <= 0 //turn true or false // need to add props.diable[crtl.type] in buildcontrols 
        }
        //{salad: true, meat: false,...}

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p>: <Spinner />;

        if(this.state.ingredients){ // if ingredients are loaded from server
            burger = (
                <Auxiliary>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls 
                        ingredientAdded ={this.addIngredientHandler}
                        ingredientRemoved ={this.removeIngredientHandler}
                        disabled ={disabledInfo}
                        purchasable= {this.state.purchasable}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler}
                    /> 
                </Auxiliary>  
            );
            orderSummary =  <OrderSummary 
            price={this.state.totalPrice}
            ingredients={this.state.ingredients}
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
            />;
        }
        if(this.state.loading){
            orderSummary = <Spinner />;
        }
        
        return(
            <Auxiliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}> {/*modal doesnot update when we set ordersummary, use shouldComponentupdate in Modal.js */}
                   {orderSummary}
                </Modal> 
                {burger} 
            </Auxiliary>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);