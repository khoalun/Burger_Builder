import React, {Component} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Auxiliary from '../Auxiliary/Auxiliary';

//handling errors
const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component  {
        state ={
            error: null
        }
        componentWillMount (){ //componentDidMount is called after all child components have been rendered // xemlaiditmount and willmount
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null}); // when send request, dont have error setup anymore
                return req;
            });
            this.resInterceptor = axios.interceptors.response.use(res => res, error =>{
                this.setState({error : error})
            });
        }

        componentWillUnmount(){
            // console.log('Will Unmount', this.reqInterceptor, this.resInterceptor);// clean up interceptors when we dont need burger builder anymore
              axios.interceptors.request.eject(this.reqInterceptor);
              axios.interceptors.response.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () =>{
            this.setState({error: null});
        }
        render(){
            return (
                <Auxiliary>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Auxiliary>
           );
        }
    }
}

export default withErrorHandler;

//request: from client to server, get and post
//response: data sent from server to client