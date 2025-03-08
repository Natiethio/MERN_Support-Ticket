import React from 'react'
import { Modal, Button } from 'react-bootstrap';
// import './Dashboard.css';

const ConfirmDeleteModel = ({ show, handleClose, handleDelete, userName }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete <span className='usernamedelete'>{userName}?</span></p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmDeleteModel
