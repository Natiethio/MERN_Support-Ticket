import React, { useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormData, updateImage } from '../../redux/userSlice';
import { clearErrors } from '../../redux/userSlice';
import { setErrors } from '../../redux/userSlice';
import axios from 'axios';

const Register = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { formDataRegister, errorsRegister, image } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(clearErrors());
    }, [dispatch]);

    const handleChange = (e) => {
        dispatch(clearErrors());
        dispatch(updateFormData({ field: e.target.name, value: e.target.value }));
    };

    const handleFileChange = (e) => {
        dispatch(updateImage(e.target.files[0]));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitButton = document.getElementById('Submit_Button');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Registering...';
    
        const formDataToSend = new FormData();
        Object.entries(formDataRegister).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });
        if (image) {
            formDataToSend.append('profileImage', image);
        }
    
        try {
            const response = await axios.post(
                'http://localhost:5001/api/user/register',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log(response.data.message);
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                dispatch(clearErrors());
                dispatch(setErrors(error.response.data.errors)); 
            } else {
                console.error("Unexpected error:", error.message);
            }
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Register';
        }
    };
    
    return (
        <>
            <Header />
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <div className="p-4 border rounded shadow-sm bg-white">
                            <h3 className="text-center mb-4">Register Here</h3>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter first name"
                                        name="firstName"
                                        value={formDataRegister.firstName}
                                        onChange={handleChange}
                                    />
                                    {errorsRegister.firstName && <div className="error">{errorsRegister.firstName}</div>}
                                </Form.Group>

                                <Form.Group controlId="formLastName" className="mt-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter last name"
                                        name="lastName"
                                        value={formDataRegister.lastName}
                                        onChange={handleChange}
                                    // required
                                    />
                                    {errorsRegister.lastName && <div className="error">{errorsRegister.lastName}</div>}
                                </Form.Group>

                                <Form.Group controlId="formGenderPreferences" className="mt-3">
                                    <Form.Label>Sex</Form.Label>
                                    <div className="radio-group">
                                        <Form.Check
                                            type="radio"
                                            label="Male"
                                            value="male"
                                            name="sex" // Shared name for radio group
                                            onChange={handleChange} // Use existing handleChange
                                            checked={formDataRegister.sex === "male"} // Bind to formDataRegister.sex
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Female"
                                            value="female"
                                            name="sex"
                                            onChange={handleChange}
                                            checked={formDataRegister.sex === "female"}
                                        />
                                    </div>
                                    {errorsRegister.sex && <div className="error">{errorsRegister.sex}</div>}
                                </Form.Group>


                                <Form.Group controlId="formEmail" className="mt-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        name="email"
                                        value={formDataRegister.email}
                                        onChange={handleChange}
                                    // required
                                    />
                                    {errorsRegister.email && <div className="error">{errorsRegister.email}</div>}
                                </Form.Group>

                                <Form.Group controlId="formPhone" className="mt-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Enter phone number"
                                        name="phone"
                                        value={formDataRegister.phone}
                                        onChange={handleChange}
                                    // required
                                    />
                                    {errorsRegister.phone && <div className="error">{errorsRegister.phone}</div>}
                                </Form.Group>

                                <Form.Group controlId="formPassword" className="mt-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        name="password"
                                        value={formDataRegister.password}
                                        onChange={handleChange}
                                    // required
                                    />
                                    {errorsRegister.password && <div className="error">{errorsRegister.password}</div>}
                                </Form.Group>

                                <Form.Group controlId="formConfirmPassword" className="mt-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm password"
                                        name="confirmPassword"
                                        value={formDataRegister.confirmPassword}
                                        onChange={handleChange}
                                    // required
                                    />
                                    {errorsRegister.confirmPassword && <div className="error">{errorsRegister.confirmPassword}</div>}
                                    {errorsRegister.role && <div className="error">{errorsRegister.role}</div>}
                                </Form.Group>

                                <Form.Group controlId="formFile" className="mt-3">
                                    <Form.Label>Profile Image (Max 5MB)</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="profile_pic"
                                        onChange={handleFileChange}
                                    />
                                    {errorsRegister.profileImage && <div className="error">{errorsRegister.profileImage}</div>}
                                </Form.Group>

                                <Button
                                    variant="dark"
                                    id="Submit_Button"
                                    type="submit"
                                    className="mt-4 mb-3 w-100"
                                >
                                    Register
                                </Button>
                                <Link to={'/Login'} className="color-primary link-login">
                                    Already have an account? Login
                                </Link>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Register;
