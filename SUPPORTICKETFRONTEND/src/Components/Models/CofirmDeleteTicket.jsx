import React from 'react'
import { Modal, Button } from 'react-bootstrap';

const CofirmDeleteTicket = ({show, handleClose, handleDelete} ) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this ticket?</p>
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

export default CofirmDeleteTicket
