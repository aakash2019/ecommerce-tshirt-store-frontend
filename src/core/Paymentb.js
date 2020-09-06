import React, { useState, useEffect } from 'react';
import DropIn from 'braintree-web-drop-in-react';
import { Link } from 'react-router-dom';
import { loadCart, cartEmpty }  from './helper/cartHelper';
import { getmeToken, processPayment } from './helper/paymentBHelper';
import { createOrder } from './helper/orderHelper';
import { isAuthenticated } from '../auth/helper/index';

const Paymentb = ({
	products, 
	setReload = f => f,
	reload = undefined
}) => {

	const [info, setInfo] = useState({
		loading: false,
		success: false,
		clientToken: null,
		error: "",
		instance: {}
	});

	const userId = isAuthenticated() && isAuthenticated().user._id;
	const token = isAuthenticated() && isAuthenticated().token;

	const getToken = (userId, token) => {
		getmeToken(userId, token)
			.then(info => {
				console.log("INFO: ", info)
				if (info.error) {
					setInfo({
						...info,
						error: info.error
					})
				} else {
					const clientToken = info.clientToken
					setInfo({clientToken})
				}
			})
	};
	
	useEffect(() => {
		getToken(userId, token)
	}, []);

	const showbtdropIn = () => {
		return (
			<div>
				{info.clientToken !== null && products.length > 0 ? (
					<div>
						<DropIn
							options={{ authorization: info.clientToken }}
							onInstance={instance=> (info.instance = instance)}
						/>
						<button
							className="btn btn-block btn-success"
							onClick={onPurchase}
						>
							Buy
						</button>
					</div>
				) : (
					<h3>Please login or add something to cart</h3>
				)}
			</div>
		)
	}


	const onPurchase = () => {
		setInfo({loading: true})
		let nonce;
		let getNonce = info.instance
			.requestPaymentMethod()
			.then(data => {
				nonce = data.nonce
				const paymentData = {
					paymentMethodNonce: nonce,
					amount: getAmount()
				};
				processPayment(userId, token, paymentData)
					.then(response => {
						setInfo({
							...info,
							loading: false,
							success: response.success
						})
						console.log("PAYMENT SUCCESS")
						// TODO: Empty the cart
						cartEmpty(() => {
							console.log("ASDASDSA")
						})
						// TODO: Force reload
						setReload(!reload)
					})
					.catch(err => {
						setInfo({
							loading: false,
							success: false
						})
						console.log("PAYMENT FAILED")
					})
			})
	};

	const getAmount = () => {
		let amount = 0;
		products.map(p => {
			amount = amount + p.price
		})
		return amount
	}

	return (
		<div>
			<h3>Your bill is {getAmount()} $</h3>
			{showbtdropIn()}
		</div>
	)
};

export default Paymentb;