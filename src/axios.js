import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://twitter-server-clone.herokuapp.com',
});

export default instance;
