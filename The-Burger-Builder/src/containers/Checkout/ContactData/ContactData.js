import React, { Component } from 'react'
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            }, 
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            }, 
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Postal Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            }, 
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            }, 
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                   options: [
                       {value: 'fastest', displayValue: 'Fastest'},
                       {value: 'cheapest', displayValue: 'Cheapest'}
                    ]

                },
                value: 'fastest',
                validation: {},
                valid: true
            },
        },    
        formIsValid: false,
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault(); //prevent(send the request) reload the form in the page bc we are inside the form and that is default behavior
        // console.log(this.props.ingredients);
        //code below from purchaseContinueHandler () in BurgerBuilder.js
        //post data to server
        this.setState({loading: true});
        const formData = {};
        
        for(let formElementIdentifier in this.state.orderForm){ //formElementIdentifiers are country, email,...
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;   
        }

        const order = {
            ingredients: this.props.ingredients, // this.props.ingredients used in Checkout.js
            price: this.props.price, // to Route in checkout.js
            orderData: formData
        }

        axios.post('/orders.json' , order) // link where to post data to server
            .then(response =>{
                this.setState({loading: false });
                this.props.history.push('/');

            })
            .catch(error => {
                this.setState({loading: false});
            });
         
        }

        checkValidity =(value, rules) =>{
            let isValid = true;
            if( ! rules ){
                return true;
            }
            if(rules.required){
                isValid = value.trim() !== '' && isValid;
            }
            if(rules.minLength){
                isValid = value.length >= rules.minLength && isValid;
            }
            if(rules.maxLength){
                isValid = value.length <= rules.maxLength && isValid;
            }
            return isValid;
        }

        inputChangeHandler = (event, inputIdentifier) => { //two way binding
            // console.log(event.target.value);
            const updatedOrderForm ={ //street, name, zipCode..
                ...this.state.orderForm
            };
            // console.log(updatedOrderForm);
            const updatedFormElement= { //elementType, elementConfig, value , inputIdentifiers are street, name, zipcode..
                ...updatedOrderForm[inputIdentifier] 
            };
            // console.log(updatedFormElement);
            updatedFormElement.value = event.target.value;
            updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
            updatedFormElement.touched = true; //check if user input st on that line then start to check validity, if not, dont check
            updatedOrderForm[inputIdentifier] = updatedFormElement; //update modified elements
            
            console.log(updatedFormElement);

            let formIsValid = true;
            for(let inputIdentifier in updatedOrderForm){
                formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid; // check validity for overall form, if true, can click the button
            }
            this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid}); //set state
        }
        render() {
            const formElementsArray = [];
            for(let key in this.state.orderForm){
                formElementsArray.push({
                    id: key, //name, street, zipcode...
                    config: this.state.orderForm[key] //the id's object
                })
            }
            let form = (
                <form onSubmit={this.orderHandler}>
                    {formElementsArray.map(formElement => (
                        <Input 
                            key= {formElement.id}
                            elementType ={formElement.config.elementType}
                            elementConfig= {formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid} //at first, valid is false, (validation feedback) because if invalid = true, it will push classes.Invalid in input.js
                            shouldValidate={formElement.config.validation} // to ignore drop down menu
                            touched = {formElement.config.touched}
                            changed={(event) => this.inputChangeHandler(event, formElement.id)}
                        />
                    ))}
                    <Button btnType="Success" clicked={this.orderHandler} disabled={!this.state.formIsValid}>ORDER</Button> {/**at first, formIsValid is false, so disable should be true to disable button so !formIsValid */}
                </form>
            );
            if(this.state.loading) { /*when loading is true (in axios.post), it is uploading data to server, then its state is back to false */
                form = <Spinner />;
            }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form} 
            </div>
        )
    }
}
export default ContactData;