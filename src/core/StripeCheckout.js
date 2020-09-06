import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import { cartEmpty, loadCart } from './helper/cartHelper';
import StripeCheckoutButton from 'react-stripe-checkout';
import { API } from '../backend';

const StripeCheckout = ({
	products,
	setReload = f => f,
	reload = undefined
}) => {

	const [data, setData] = useState({
		loading: false,
		success: false,
		error: "",
		address: ""
	});

	const token = isAuthenticated() && isAuthenticated().token;
	const userId = isAuthenticated() && isAuthenticated().user._id;

	const getFinalAmount = () => {
		let amount = 0;
		products.map(p => {
			amount = amount + p.price
		})
		return amount;
	};

	const makePayment = (token) => {
		const body = {
			token,
			products
		};

		const headers = {
			"Content-Type": "application/json"
		}
		return fetch(`${API}/stripepayment`, {
			method: "POST",
			headers,
			body: JSON.stringify(body)
		})
		.then(response => {
			console.log("RESPONSE: ", response)
			const { status } = response;
			console.log("STATUS: ", status);
			console.log("PAYMENT SUCCESS")
			// Empty the cart
			// cartEmpty(() => {
			// 	console.log("Empty cart")
			// })
			// Force reload
			// setReload(!reload)
		})
		.catch(err => console.log(err))
	}


	const showStripeButton = () => {
		return isAuthenticated() ? 
			(
				<StripeCheckoutButton
					stripeKey="pk_test_51GuuOrJwxv4L2d21Ri30VSmu0vKeTH56PM3l8ajkyRxvLJsc7Ld0zGsX5Tjt0TVdGujkhLz4St0KeHrcOFbbRoUC00zyLumMgC"
					token={makePayment()}
					amount={getFinalAmount() * 100}
					name="Buy Tshirts"
					shippingAddress
					billingAddress
				>
					<button className="btn btn-success">Pay with stripe</button>
				</StripeCheckoutButton>
			) : (
				<Link to="/signin">
					<button className="btn btn-warning">	
						Signin
					</button>
				</Link>
			)
	};

	return (
		<div>
			<h3 className="text-white">Stripe Checkout {getFinalAmount()}</h3>
			{showStripeButton()}
		</div>
	)
};

export default StripeCheckout;