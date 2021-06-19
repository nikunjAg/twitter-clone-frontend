import axios from 'axios';
const serverBaseURL = 'https://twitter-server-clone.herokuapp.com';
// const serverBaseURL = 'http://localhost:8080';

const instance = axios.create({
	baseURL: serverBaseURL,
});

export default instance;
export { serverBaseURL };
