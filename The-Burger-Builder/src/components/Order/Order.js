import React from 'react';
import classes from './Order.module.css';
const Order = (props) => {
    const Ingredients = [];
    for (let IngredientName in props.ingredients){
        Ingredients.push(
            {
                name: IngredientName,
                amount: props.ingredients[IngredientName]
            }
        );
    }

    const ingredientOutput = Ingredients.map (ig => {
        return <span 
            style={{
                textTransform: 'capitalize',
                display: 'inline-block',
                margin: '0 8px',
                border: '1px solid #ccc',
                padding: '5px'
                }}
            key={ig.name}>{ig.name} ({ig.amount})</span>
    })

    return (
        <div className={classes.Order}>
            <p>{ingredientOutput}</p>
            <p>Price: <strong>USD {Number.parseFloat(props.price).toFixed(2)}</strong></p> {/*bc information fetched from server is a string*/ }
        </div>
    );
};

export default Order;