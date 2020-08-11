//burger we are really rendering to the screen
import React from 'react';
import {withRouter} from 'react-router-dom';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/Burgeringredient';

const Burger = (props) => {
    // console.log(props);
    let transformedIngredients = Object.keys( props.ingredients ) //[...Array(3)] can create an array with 3 empty/undefined spaces
        .map( igKey => { //transform this string values into an array which as many elements as we have. if we have 2 cheese ingre , i want to transform to an array which simply contain 2 elements(should have a length of 2)  //create an array with Key Ingre and the number of array depends on values of that key in object
            return [...Array( props.ingredients[igKey] )].map((_, i) => { //map through elements
                    return <BurgerIngredient key={igKey + i} type={igKey} />; //igKey like salad, i like 1,2,3 and so on. this create a unique key for each ingredient for key={} (like igKey +i such as salad1, salad2)
                });
        })
        .reduce((arr ,el) => { //The reduce() method reduces the array to a single value (from left-to-right). reduce(previousValue, currentValue)
           
            return arr.concat(el); //The return value of the function is stored in an accumulator (result/total). // {return {arr.concat(el);}, []};//empty arr as previousVa at first time( means initial value) and take current value as adding object to empty arr(how to reduces the array to a single value. )}
        }, []); // arr.concat(el) used to connect 2 or more arrays.This method does not change the existing array, but instead returns a new array.
        if(transformedIngredients.length === 0){
            transformedIngredients =<p>Please start adding ingredients! </p>;
        }

     console.log(transformedIngredients);   
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default withRouter(Burger);
