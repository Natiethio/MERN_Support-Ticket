import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import "./Login.css"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../../Context/AuthContext"
import Header from '../Header/Header';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { getauthUser } from '../../redux/userSlice.jsx';
import api from '../../Utils/axiosInstance';
import { updateFormData, clearErrors, updateImage, setErrors } from '../../redux/userSlice';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [role, setRole] = useState("");
    const { auth, logout, setAuth, fetchUser, isLoggedout, setIsLoggedout } = useContext(AuthContext);

    useEffect(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("admin-user")
    }, []);


    const navigate = useNavigate();


    const handelSubmit = async (e) => {
        e.preventDefault();
        console.log("email", email)
        console.log("password", password)

        const formdata = new FormData();
        formdata.append("email", email)
        formdata.append("password", password)

        document.getElementById('Login_Button').disabled = true
        document.getElementById('Login_Button').innerHTML = 'Signing in...'

        try {
            const response = await api.post("/user/login", formdata, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            setAuth(response.data.role)

            setIsLoggedout(false)

            fetchUser();

            if (response) {
                // const role = response.data.role
                // localStorage.setItem('token', JSON.stringify(response.data.token));

                handleSubsequentRequests();
            }

        }
        catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
            console.error(error.message)
            setIsLoggedout(true)
            navigate("/login")
        }
        document.getElementById('Login_Button').disabled = false
        document.getElementById('Login_Button').innerHTML = 'Login'
    }

    async function handleSubsequentRequests() {

        await api.get('/user/getauthuser', {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        })
            .then(response => {
                const user = response.data.loginuser;
                
                const role = user.role;
                setRole(role);
                console.log(role)

                if (role === "user") {
                    navigate("/");
                    setIsLoggedout(false)
                }
                else if (role === "admin") {
                    navigate("/dashboard");
                    setIsLoggedout(false)
                }
            })
            .catch(error => {
                console.error(error.message)
                console.error('Subsequent request error')
                setIsLoggedout(true)
                navigate("/login")
            });
    };

    const handleChange = (e) => {
        clearErrorMessage()
    };

    const clearErrorMessage = () => {
        setErrors("");
    };

    return (
        <>
            <Header />
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Container className="justify-content-center">
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <div className="p-4 border rounded shadow-sm bg-white">
                                <h3 className="text-center mb-4">Login</h3>
                                <Form onSubmit={handelSubmit}>
                                    <Form.Group controlId='formBasicEmail' className="mt-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Enter Your Email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                                handleChange()
                                            }}
                                        />
                                        {errors.nouser && <div className="error">{errors.nouser}</div>}
                                        {errors.email && <div className="error">{errors.email}</div>}
                                    </Form.Group>

                                    <Form.Group controlId='formPassword' className="mt-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Enter Your Password"
                                            value={password}
                                            //  onChange={handelInputChange}
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                                handleChange()
                                            }}
                                        />
                                        {errors.password && <div className="error">{errors.password}</div>}
                                    </Form.Group>

                                    <Button Id="Login_Button" variant="dark" type="submit" className="mt-4 mb-3 w-100">
                                        Login
                                    </Button>

                                    <Link to={"/Register"} className='color-primary link-register'>Don't have an accout yet? Register</Link>

                                </Form>
                                <ToastContainer />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Login
