import { API } from '../../backend';

export const createOrer = (userId, token, orderData) => {
	return fetch(`${API}/order/create/${userId}`,{
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Beaer ${token}`
		},
		body: JSON.stringify({order: orderData})
	})
	.then(response => {
		return response.json()
	})
	.catch(err => console.log(err))
};