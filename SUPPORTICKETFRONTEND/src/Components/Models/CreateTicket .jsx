import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import { updateTicketForm, clearTicketForm, setErrorsCreateTicket,clearErrorsTicket  } from "../../redux/userSlice";

import axios from "axios";

const CreateTicket = ({ show, handleClose, handleSubmit }) => {
    const dispatch = useDispatch();
    const {formDataTicket, errorscreateticket } = useSelector((state) => state.users);
    const userEmail = useSelector((state) => state.users.authuser.email);

    const handleChange = (e) => {
        dispatch(updateTicketForm({ field: e.target.name, value: e.target.value }));
    };


    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create a Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formDataTicket.email || userEmail}
                            disabled
                        />
                        {errorscreateticket.email && <div className="error">{errorscreateticket.email}</div>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formDataTicket.title}
                            onChange={handleChange}
                        />
                        {errorscreateticket.title && <div className="error">{errorscreateticket.title}</div>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Your Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            rows={4}
                            value={formDataTicket.description}
                            onChange={handleChange}
                        />
                        {errorscreateticket.description && <div className="error">{errorscreateticket.description}</div>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select name="status" value={formDataTicket.status} onChange={handleChange}>
                            <option value="Open">Open</option>
                            <option value="In_Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </Form.Select>
                        {errorscreateticket.status && <div className="status">{errorscreateticket.status}</div>}
                    </Form.Group>

                    <Button id="Submit_Button" type="submit" variant="dark" className="w-100">Send</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateTicket;
