import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function ConfirmModal() {
    const [show, setShow] = useState();
    const handleClose = () => {
        setShow(false);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to proceed?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleClose}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    )

}

export default ConfirmModal
