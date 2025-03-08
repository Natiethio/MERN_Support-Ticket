import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Header from '../Header/Header';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import CreateTicket from '../Models/CreateTicket ';
import CofirmDeleteTicket from "../Models/CofirmDeleteTicket";
import { Table, Button } from 'react-bootstrap';
import { getUserTicket } from "../../redux/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteTicket } from '../../redux/userSlice.jsx';
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { updateTicketForm, clearTicketForm, setErrorsCreateTicket, clearErrorsTicket } from "../../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./MyTickets.css";

const MyTickets = () => {

    const dispatch = useDispatch();
    const { formDataTicket } = useSelector((state) => state.users);
    const tickets = useSelector(state => state.users.tickets);
    const { isAuthenticated } = useContext(AuthContext);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalTicket, setModalTicket] = useState(false);

    // const openModal = () => {
    //     if (!isAuthenticated) {
    //         navigate("/login");
    //     } else {
    //         setShowModal(true);
    //     }
    // };

    const openModal = (ticket) => {
        setSelectedTicket(ticket);
        setModalTicket(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const closeTicketModal = () => {
        setSelectedTicket(null);
        setModalTicket(false);
    };


    const handleCreateTicketClick = () => {
        setShowModal(true);
    };

    useEffect(() => {
        fetchTickets();
    }, [dispatch]);


    const fetchTickets = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/user/mytickets", {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });

            dispatch(getUserTicket(response.data.tickets));
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitButton = document.getElementById('Submit_Button');
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        try {
            await axios.post("http://localhost:5001/api/user/tickets", formDataTicket, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            dispatch(clearTicketForm());
            dispatch(clearErrorsTicket());
            closeModal();
            fetchTickets();
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

    const handleDelete = async () => {
        if (!selectedTicket) return;
        const id = selectedTicket.id;
        try {
            console.log(id)
            const response = await axios.delete(`http://localhost:5001/api/user/deleteticket/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            })
            dispatch(deleteTicket({ id }))

            fetchTickets();

            setModalTicket(false);

        }

        catch (error) {
            setModalTicket(false);

            toast.error("Unable To Delete!",
                {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: { backgroundColor: "red", color: "#fff" },
                })

            console.error("There was an error deleting the ticket!", error);
        }
    };


    return (
        <>
            <Header />

            <div className="my-tickets-container">
                <div className="header table">
                    <h2>My Tickets</h2>
                    <button className="create-ticket-btn" onClick={handleCreateTicketClick}>
                        Create Ticket
                    </button>
                </div>


                <Table striped bordered hover className="table table-striped">
                    <thead className="">
                        <tr className="">
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length > 0 ? (
                            tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>{ticket.title}</td>
                                    <td>{ticket.description}</td>
                                    <td>
                                        <span className={`${ticket.status.toLowerCase()}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <FontAwesomeIcon icon={faEdit} className="btn btn-success btn-icon btn-md mr-2 p-2" />
                                            {/* <FontAwesomeIcon icon={faTrashAlt} className="delete-icon" /> */}
                                            <button
                                                onClick={() => openModal(ticket)}
                                                className="btn btn-danger btn-icon btn-sm mr-2">
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No tickets found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {showModal && (
                <CreateTicket
                    show={showModal}
                    handleClose={closeModal}
                    handleSubmit={handleSubmit}
                />
            )}

            {showModalTicket && (
                <CofirmDeleteTicket
                    show={showModalTicket}
                    handleClose={closeTicketModal}
                    handleDelete={handleDelete}
                />
            )}
        </>

    )
}

export default MyTickets
