import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-bf037.firebaseio.com/'
});

export default instance;

//request: from client to server, get and post
//response: data sent from server to client