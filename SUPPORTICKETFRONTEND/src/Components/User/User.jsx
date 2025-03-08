import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import CreateTicket from '../Models/CreateTicket ';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../../Context/AuthContext";
import { updateTicketForm, clearTicketForm, setErrorsCreateTicket, clearErrorsTicket } from "../../redux/userSlice";
import "./User.css";

const User = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [user, setUser] = useState([]);
    const { isAuthenticated } = useContext(AuthContext);
    const [loading, setLoading] = useState(true)
    const { formDataTicket } = useSelector((state) => state.users);
    const backendURL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
    const backendURLocal = import.meta.env.VITE_REACT_APP_BACKEND_BASEURLocal;
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            setShowModal(true);
        }
    };

    const closeModal = () => setShowModal(false);

    useEffect(() => {
        if (isAuthenticated) {
            handleUserData();
        }
        else{
            setLoading(false)
        }
    }, [isAuthenticated]);

    useEffect(() => {
        dispatch(clearTicketForm());
    }, [dispatch]);

    async function handleUserData() {
        setLoading(true)
        try {
            const response = await axios.get(`${backendURL}/api/user/getnormaluser`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            setUser(response.data.loginuser);
        } catch (error) {
            setLoading(false)
            console.error("Error fetching user data", error);
        }
        finally{
            setLoading(false)
           }
    }

    const handleCreateTicketClick = () => {
        if (!isAuthenticated) {
            navigate("/Login");
        } else {
            setShowModal(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitButton = document.getElementById('Submit_Button');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        try {
            await axios.post(`${backendURL}/api/user/tickets`, formDataTicket, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            dispatch(clearTicketForm());
            dispatch(clearErrorsTicket());
            closeModal();

            toast.success("Created Successfully",
                {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: { backgroundColor: "green", color: "#fff" },
                })

                setTimeout(() => {
                    navigate("my_tickets");
                }, 2500);

        } catch (error) {
            if (error.response && error.response.data.errors) {
                // dispatch(clearTicketForm());
                dispatch(setErrorsCreateTicket(error.response.data.errors));
            } else {
                console.error("Unexpected error:", error.message);
            }
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send';
        }
    };

    if (loading) {
        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        );
      }

    return (
        <>
            <Header />
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Container className="justify-content-center">
                    <Row className="justify-content-center">
                        <Col md={6}>
                            {isAuthenticated ? (
                                <div className="p-4 border rounded shadow-sm bg-white">
                                    <h3 className="text-center mb-2">Welcome <span>{user.firstName}</span> <span>{user.lastName}</span></h3>
                                    <h5 className="text-center mb-4">Email: <span>{user.email}</span></h5>
                                    <div className="profile">
                                        <h6 className='profile-name'>Profile Image:</h6>
                                        <img
                                            src={user.profileImage}
                                            alt="Profile"
                                            className="profile-image-user"
                                        />
                                    </div>
                                    <button type="button" className="btn btn-dark w-100 mt-4" onClick={handleCreateTicketClick}>
                                        Create Ticket
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 border rounded shadow-sm bg-white">
                                    <h3 className="text-center mb-4">Welcome</h3>
                                    <button type="button" className="btn btn-dark w-100" onClick={handleCreateTicketClick}>
                                        Create Ticket
                                    </button>
                                </div>
                            )}
                            <ToastContainer />
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Ticket Modal */}
            {showModal && (
                <CreateTicket
                    show={showModal}
                    handleClose={closeModal}
                    handleSubmit={handleSubmit}
                />
            )}
        </>
    );
};

export default User;
