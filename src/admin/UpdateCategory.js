import React, { useState, useEffect } from 'react';
import Base from '../core/Base';
import { Link } from 'react-router-dom';
import { getCategories, getaCategory, updateCategory } from './helper/adminapicall';
import { isAuthenticated } from '../auth/helper/index';

const UpdateCategory = ({ match }) => {

	
	const [name, setName] = useState("");
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);

	const { user, token } = isAuthenticated();

	const preload = (categoryId) => {
		getaCategory(categoryId).then(data => {
			console.log("CATEGORY:", data)
			if (data.error) {
				setError(true)
			} else {
				preloadCategories()
				setName(data.name)
			}
		})
	};

	const preloadCategories = () => {
		getCategories()
			.then(data => {
				console.log("CATEGORIES:", data[0].name)
				if (data.error) {
					setError(true)
				} else {
					setName(data.name)
				}
			})
	}

	useEffect(() => {
		preload(match.params.categoryId)
	}, []);

	const handleChange = event => {
		setError("");
		setName(event.target.value);
	};

	// TODO: Category Name not going with response after submission
	const onSubmit = (event) => {
		event.preventDefault();
		setError("");
		setSuccess(false);
		console.log("User ID: ", user._id)
		console.log("Category ID: ", match.params.categoryId)
		console.log("NAME: ", { name })
		updateCategory(match.params.categoryId, user._id, token, { name })
			.then(data => {
				if (data.error) {
					setError(true)
				} else {
					setError("")
					setSuccess(true);
					setName("")
				}
			})
	};

	const successMessage = () => {
		if (success) {
			return <h4 className="text-success">Category updated successfully!</h4>
		}
	};

	const warningMessage = () => {
		if (error) {
			return <h4 className="text-danger">Failed to update category!</h4>
		}
	};

	// TODO: Redirect user to dashboard after creating product successfully
	// const RedirectDashboard = () => {
	// 		if (!loading && getaRedirect) {
	// 			setTimeout(function() {return <Redirect to="/admin/dashboard" />}, 200)
	// 		}
	// }

	const updateCategoryForm = () => (
		<form>
			<div className="form-group">
				<p className="lead">
					Enter the category
				</p>
				<input 
					type="text" 
					className="form-control my-3"
					onChange={handleChange}
					value={name}
					autoFocus
					required
				/>
				<button onClick={onSubmit} className="btn btn-outline-info">
					Update Category
				</button>
			</div>
		</form>
	);

	return (
		<Base
			title="Update a category here"
			description="Welcome to category updation section"
			className="container bg-info p-4"
		>
			<Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
				Admin Home
			</Link>
			<div className="row bg-dark text-white rounded">
				<div className="col-md-8 offset-md-2">
					{successMessage()}
					{warningMessage()}
					{updateCategoryForm()}
				</div>
			</div>
		</Base>
	)
};

export default UpdateCategory;