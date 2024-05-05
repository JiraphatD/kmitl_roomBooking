import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import API_DATA from "../link";

function Decline({ showDecline, setShowDecline, declineOrDelete, declineId }) {
    const [text, setText] = useState('');

    const handleChange = (e) => {
        setText(e.target.value);
    };
    const quickAdd = (e) => {
        setText(e)
    };

    const buttonMargin = {
        margin: "3px",
    };

    const [disableButton, setDisable] = useState(false);
    const [delayTime, setDelayTime] = useState(5);
    const delayButton = async () => {
        if (text !== '') {
            try {
                const response = await axios.delete(API_DATA.bookingList, {
                    params:
                    {
                        bookingId: declineId,
                        reason: text
                    }
                });
                console.log(response.data.message);
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                });
                setShowDecline(!showDecline);
            }
            catch (error) {
                console.error("Error: ", error.response.data.message);
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Reason',
                text: 'Please provide a reason.',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };
    useEffect(() => {
        let timer;
        if (showDecline) {
            setDisable(true);
            timer = setInterval(() => {
                if (delayTime === 0) {
                    setDisable(false);
                    clearInterval(timer);
                } else {
                    setDelayTime((prevDelayTime) => prevDelayTime - 1);
                }
            }, 1000);
        } else {
            setDelayTime(5);
        }

        return () => {
            clearInterval(timer);
        };
    }, [showDecline, delayTime]);

    return (
        <Modal show={showDecline} onHide={setShowDecline} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Please provide a reason for {declineOrDelete}.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <div style={{ display: "flex", flexWrap: "wrap", margin: "5px" }}>
                        <Button variant="outline-secondary" style={buttonMargin} onClick={() => quickAdd("Only for professor")}>Only for professor</Button>
                        <Button variant="outline-secondary" style={buttonMargin} onClick={() => quickAdd("Unavailable Room")}>Unavailable Room</Button>
                    </div>
                    <textarea
                        className="form-control"
                        id="declineText"
                        rows="4"
                        value={text}
                        onChange={handleChange}
                    ></textarea>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => setShowDecline(false)}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={delayButton} disabled={disableButton}>
                    {delayTime > 0 ? `Confirm ${declineOrDelete} (${delayTime}s)` : `Confirm ${declineOrDelete}`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Decline
