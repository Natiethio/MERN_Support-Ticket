import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Header from '../Header/Header';
import { Card, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { getAllTicket } from "../../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./AllTickets.css";

const AllTickets = () => {

    const dispatch = useDispatch();
    const alltickets = useSelector((state) => state.users.alltickets);
    const [selectedStatus, setSelectedStatus] = useState({});
    const [enableUpdate, setEnableUpdate] = useState({});
    const [expandedDescriptions, setExpandedDescriptions] = useState({}); // Track expanded descriptions

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/user/all_tickets", {
                withCredentials: true,
            });
            dispatch(getAllTicket(response.data));
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };

    const handleStatusChange = (ticketId, newStatus) => {
        setSelectedStatus((prev) => ({ ...prev, [ticketId]: newStatus }));
        setEnableUpdate((prev) => ({ ...prev, [ticketId]: true }));
    };

    const handleUpdate = async (ticketId) => {
        if (!selectedStatus[ticketId]) return;

        try {
            await axios.post(
                `http://localhost:5001/api/user/update_ticket/${ticketId}`,
                { status: selectedStatus[ticketId] },
                { withCredentials: true }
            );

            toast.success("Updated Successfully",
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
                fetchTickets();
            }, 2500);

            setEnableUpdate((prev) => ({ ...prev, [ticketId]: false }));

        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };

    const toggleDescription = (ticketId) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [ticketId]: !prev[ticketId],
        }));
    };

    return (

        <>
            <Header />
            <div className="tickets-container">
                {alltickets.map((ticket) => (
                    <Card key={ticket.id} className="ticket-card">

                        <Card.Img
                            variant="top"
                            src={`http://localhost:5001/uploads/${ticket.user?.profileImage}`}
                            alt="User Profile"
                            className="profile-imgTickets" />
                        <Card.Body>
                            <Card.Title>{ticket.user?.firstName} {ticket.user?.lastName}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{ticket.user?.email}</Card.Subtitle>
                            <Card.Text>
                                <strong>{ticket.title}</strong>
                            </Card.Text>
                            <Card.Text className="description">
                                {expandedDescriptions[ticket.id]
                                    ? ticket.description // Show full description
                                    : `${ticket.description.substring(0, 100)}... `}
                                {ticket.description.length > 100 && (
                                    <span className="view-more" onClick={() => toggleDescription(ticket.id)}>
                                        {expandedDescriptions[ticket.id] ? " View Less" : " View More"}
                                    </span>
                                )}
                            </Card.Text>

                            <div className="status-container">
                                <Form.Select
                                    value={selectedStatus[ticket.id] || ticket.status}
                                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                >
                                    <option value="Open">Open</option>
                                    <option value="In_Progress">In Progress</option>
                                    <option value="Closed">Closed</option>
                                </Form.Select>
                                <Button
                                    variant="success"
                                    className="update-btn"
                                    disabled={!enableUpdate[ticket.id]}
                                    onClick={() => handleUpdate(ticket.id)}
                                >
                                    <FontAwesomeIcon icon={faEdit} className="btn btn-success btn-icon btn-md p-2" />
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </>

    )
}

export default AllTickets
