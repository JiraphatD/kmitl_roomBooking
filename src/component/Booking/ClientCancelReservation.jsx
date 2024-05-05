import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Form, Col, Row, Container } from 'react-bootstrap'
import { Card } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import API_DATA from '../link';


function ClientCancelReservation() {

    const [formData, setFormData] = useState({
        cancel_code: '',
        email: ''
    });
    const [check, setCheck] = useState(false);
    const handle_change = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };
    const handle_submit = async (e) => {
        e.preventDefault();
        setCheck(true);
        if (Object.values(formData).some((value) => value.trim() === '')) {
            return;
        }
        try {
            const response = await axios.delete(API_DATA.cancel_booking, { data: formData });
            console.log('submit successfully. ', response.data);
            Swal.fire({
                icon: 'success',
                title: 'Booking Cancelled!',
                text: 'Your booking has been successfully cancelled.',
            });
            setFormData({ cancel_code: '', email: '' })
            setCheck(false);
        } catch (error) {
            console.error('error : ', error.response.data);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                html: `An error occurred while cancelling the booking. <br>${error.response.data.error} Please try again.`,
            });
        }
    };

    return (
        <div style={
            {
                marginLeft: '3vw',
                marginRight: '3vw'
            }
        }>
            <section>
                <Row className='mt-4'>
                    <h1>Cancellation Booking</h1>
                </Row>
                <br></br>
                <Card>
                    <Card.Body>
                        <Form noValidate onSubmit={handle_submit}>
                            <Row className='mt-2 d-flex justify-content-center'>
                                <Form.Group as={Col} md='4' controlId='validationBookingID'>
                                    <Form.Label>ระบุรหัสการยกเลิก</Form.Label>
                                    <Form.Control
                                        required
                                        type='text'
                                        name='cancel_code'
                                        value={formData.cancel_code}
                                        onChange={handle_change}
                                        onKeyDown={(e) => {
                                            const isNumeric = /^[0-9]+$/.test(e.key);
                                            const bkSpace = e.key === 'Backspace';
                                            if (!isNumeric && !bkSpace) {
                                                e.preventDefault();
                                            }
                                        }}
                                        isInvalid={check && formData.cancel_code.trim() === ''}
                                    />
                                    <Form.Control.Feedback type='invalid'>This can't be empty.</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md='4' controlId='validationEmail'>
                                    <Form.Label>ระบุอีเมลจอง</Form.Label>
                                    <Form.Control
                                        required
                                        type='text'
                                        name='email'
                                        value={formData.email}
                                        onChange={handle_change}
                                        isInvalid={check && formData.email.trim() === ''}
                                    />
                                    <Form.Control.Feedback type='invalid'>This can't be empty.</Form.Control.Feedback>
                                </Form.Group>
                                <Col md='4'>
                                    <div className='d-flex align-items-end justify-content-start' style={{ height: '100%' }}>
                                        <Button variant='outline-info' type='submit'>Search</Button>
                                    </div>
                                </Col>
                                {/* <Form.Group as={Col} md='6'>
                                <Button variant='primary' type='submit'>Search</Button>
                            </Form.Group> */}
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </section>
        </div>
    )
}

export default ClientCancelReservation;
