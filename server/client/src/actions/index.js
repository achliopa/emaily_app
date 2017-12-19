import axios from 'axios';
import { FETCH_USER } from './types';

// const fetchUser = () => {
// 	const request = axios.get('/api/current_user');

// 	return {
// 		type: FETCH_USER,
// 		payload: request
// 	};
// };

// refactor using Redux Thunk
// redux thunk will always check our action creator
// if it sees we return a function then it will call it passing the 
// dispatch argument

export const fetchUser = () => async dispatch => {
	const res = await axios.get('/api/current_user')
	
	dispatch({ type: FETCH_USER, payload: res.data });
};