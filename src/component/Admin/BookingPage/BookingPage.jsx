import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import { AdminContext } from '../AdminPage/AdminPage';
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import API_DATA from '../../link';

function BookingPage() {

    const { linkBookDB } = useContext(AdminContext);
    const [makeRecurrence, setMakeRecurrence] = useState(false)
    const [makeWeeklyReserve, setMakeWeeklyReserve] = useState(false);
    const [formData, setFormData] = useState({

        location: "",
        title: "",
        purpose: "",
        fullname: "",
        email: "",
        room: "",
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        selectedDays: [],
    });

    const showAlert = () => {
        Swal.fire({
            icon: 'success',
            title: 'จองสำเร็จ',
            showConfirmButton: false,
            timer: 1500
        }).then(
            setTimeout(() => {
                window.location.reload();
            }, 1500)
        );
    };

    const [validated, setValidated] = useState(false);

    const [roomData, setRoomData] = useState([]);
    useEffect(() => {
        axios.get(API_DATA.room)
            .then(response => setRoomData(response.data))
            .catch(error => console.log(error));
    }, [])

    const handleDayToggle = (day) => {

        const updatedDays = formData.selectedDays.includes(day)
            ? formData.selectedDays.filter((selectedDay) => selectedDay !== day)
            : [...formData.selectedDays, day];

        setFormData({
            ...formData,
            selectedDays: updatedDays,
        });
    }

    const handleRecurringChange = () => {
        setMakeRecurrence(!makeRecurrence);
        setMakeWeeklyReserve(!makeWeeklyReserve);
        setFormData({
            ...formData,
            end_date: "",
            selectedDays: [],
        });
    }

    // const handleMonthlyRecurringChange = () => {
    //     setMakeSchedule('Monthly');
    //     setFormData({ ...formData, end_date: "" })
    // }

    const generateRecurringDates = () => {

        const start_date_recurring = moment(formData.start_date);
        const end_date_recurring = (makeRecurrence && makeWeeklyReserve) ? moment(formData.end_date) : moment(formData.start_date);
        const recurringDates = [];

        while (start_date_recurring.isBefore(end_date_recurring) || start_date_recurring.isSame(end_date_recurring, 'day')) {

            if (makeRecurrence && makeWeeklyReserve) {

                // recurringDates.push(start_date_recurring.format("YYYY-MM-DD"));
                switch (formData.selectedDays.includes(start_date_recurring.format("dddd"))) {

                    case true:
                        recurringDates.push(start_date_recurring.format("YYYY-MM-DD"));
                        break;
                    case false:
                        // recurringDates.push(start_date_recurring.format("YYYY-MM-DD"));
                        break;
                }
            } else {

                recurringDates.push(start_date_recurring.format("YYYY-MM-DD"));

            }

            start_date_recurring.add(1, "days");
        }


        console.log(start_date_recurring.format("dddd"))
        return recurringDates;
    };

    const isEventOverlap = (recurrence_date) => {

        const { start_time, end_time } = formData;

        for (const start_date_select of recurrence_date) {

            const event_start = moment(`${start_date_select}T${start_time}`);
            const event_end = moment(`${start_date_select}T${end_time}`);

            for (const event_booked of linkBookDB) {

                const booked_starttime = moment(event_booked.check_in_datetime);
                const booked_endtime = moment(event_booked.check_out_datetime);
                const booked_room = event_booked.room_id;

                if ((event_start.isBetween(booked_starttime, booked_endtime) || event_end.isBetween(booked_starttime, booked_endtime)) && (booked_room === formData.room)) {

                    return false;
                }
            }
        }

        return true;

    }

    const handleSubmit = async (event) => {
        // do submit

        event.preventDefault();
        const form = event.currentTarget;
        const recurrencDates = generateRecurringDates();

        if (form.checkValidity() === false || !isEventOverlap(recurrencDates)) {

            event.preventDefault();
            event.stopPropagation();
        } else {
            //send to rest api
            try {

                // const recurrencDates = generateRecurringDates();
                console.log('recurrence date: ', recurrencDates)

                const booking_many = [];

                for (const recurringReserve of recurrencDates) {

                    console.log(formData.start_time)

                    booking_many.push({
                        title: formData.title,
                        purpose: formData.purpose,
                        room_name: formData.room,
                        booker_name: formData.fullname,
                        booker_email: formData.email,
                        start_date: recurringReserve,
                        start_time: formData.start_time,
                        end_date: formData.end_date,
                        end_time: formData.end_time,
                    })
                }

                const response = await axios.post(API_DATA.adminCreateManyBooker, { booking_many });
                console.log(response.data.message);

                setFormData({
                    location: "",
                    title: "",
                    purpose: "",
                    fullname: "",
                    email: "",
                    room: "",
                    start_date: "",
                    start_time: "",
                    end_date: "",
                    end_time: "",
                    selectedDays: [],
                });

                setMakeRecurrence(false);
                setMakeWeeklyReserve(false);
                setValidated(false);

                showAlert();

            } catch (error) {
                console.error('Error submitting form:', error.response.data.message);
                Swal.fire({
                    icon: 'error',
                    title: 'การจองล้มเหลว !',
                    text: error.response.data.message,
                });
            }
        }

        if (!isEventOverlap(recurrencDates)) {
            Swal.fire({
                icon: 'error',
                title: 'การจองล้มเหลว !',
                text: "มีการจองก่อนหน้าการจองของท่าน",
            });
        }
        setValidated(true);
    }

    const handleChange = (event) => {

        setFormData({

            ...formData,
            [event.target.name]: event.target.value

        })
    }

    const getCurrentDate = () => {
        const toDay = new Date();
        const year = toDay.getUTCFullYear();
        const month = String(toDay.getMonth() + 1).padStart(2, '0');
        const day = String(toDay.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    // const isMakeRecurrence = () => {
    //     const makeRecurrenceSwitch = document.getElementById('make-recurrence-switch')

    //     return makeRecurrenceSwitch.checked
    // }

    console.log(makeRecurrence)

    return (
        <Container>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className='mt-3'>
                    <Form.Group as={Col} md='6' controlId='validationTitle'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            name='title'
                            value={formData.title}
                            onChange={handleChange}
                            placeholder='Example: 060XXXXX วิชา Subject (ท) S-3....'
                        />
                        <Form.Control.Feedback type='invalid'>Please enter the title.</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md='6' controlId='validationPurpose'>
                        <Form.Label>Reservation purpose</Form.Label>
                        <Form.Select aria-label='select-prupose' name='purpose' value={formData.purpose} onChange={handleChange} required>
                            <option value="">-----Select-----</option>
                            <option value="การเรียนการสอน">การเรียนการสอน</option>
                            <option value="การสอบ">การสอบ</option>
                            <option value="กิจกรรมสันทนาการ">กิจกรรมสันทนาการ</option>
                        </Form.Select>
                        <Form.Control.Feedback type='invalid'>Please select reservation purpose.</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className='mt-3'>
                    <Form.Group as={Col} md='4'>
                        <Form.Label>Room</Form.Label>
                        <Form.Select aria-label='select-room' name='room' value={formData.room} onChange={handleChange} required>
                            <option value="">-----Select-----</option>
                            {roomData.map((roomDB) => (
                                <option key={`default-${roomDB.room_name}`} value={roomDB.room_name}>{roomDB.room_name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='validationName'>
                        <Form.Label>Booker Name</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            name='fullname'
                            value={formData.fullname}
                            // pattern='[\p{L}]+'
                            onChange={handleChange}
                            placeholder='John Doe'
                        />
                        <Form.Control.Feedback type='invalid'>Please enter a name.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='validationEmail'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            name='email'
                            pattern='[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='example@email.com'
                        />
                        <Form.Control.Feedback type='invalid'>Please enter an email.</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className='mt-4'>
                    <Form.Group as={Col} md='4' controlId='validationStartDate'>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            required
                            type='date'
                            name='start_date'
                            value={formData.start_date}
                            onChange={handleChange}
                            min={getCurrentDate()}
                        />
                        <Form.Control.Feedback type='invalid'>Please select your booking date.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='validationStartTime'>
                        <Form.Label>Start time</Form.Label>
                        <Form.Control
                            required
                            type='time'
                            name='start_time'
                            value={formData.start_time}
                            onChange={handleChange}
                            min={(formData.start_date === getCurrentDate()) ? getCurrentTime() : '07:00'}
                            max='18:30'
                        />
                        <Form.Control.Feedback type='invalid'>Please select start time.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md='4' controlId='validationStartTime'>
                        <Form.Label>End time</Form.Label>
                        <Form.Control
                            required
                            type='time'
                            name='end_time'
                            value={formData.end_time}
                            onChange={handleChange}
                            min={formData.start_time}
                            max='20:00'
                        />
                        <Form.Control.Feedback type='invalid'>Please select start time.</Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className='mt-4'>
                    <Form.Group as={Col} md='4'>
                        <Form.Check
                            type="switch"
                            id="make-recurrence-switch"
                            label="Make recurrence reservation"
                            onChange={handleRecurringChange}
                        />
                    </Form.Group>
                </Row>
                <Row className='mt-3'>
                    {makeRecurrence && (
                        <Container>
                            <Row className='mt-1'>
                                {/* <Form.Group as={Col} md='4' controlId='validationRecurrencPattern'>
                                    <Row>
                                        <Form.Label>Recurrence pattern</Form.Label>
                                        {["Daily", "Weekly"].map((schedule) => (
                                            <Form.Check
                                                key={`dafault-${schedule.toLocaleLowerCase()}`}
                                                type='radio'
                                                id={`${schedule.toLocaleLowerCase()}-radio`}
                                                value={schedule}
                                                checked={makeSchedule === schedule}
                                                name='recurrence-pattern-format'
                                                label={schedule}
                                                onChange={() => setMakeSchedule(schedule)}
                                            />
                                        ))}
                                    </Row>
                                </Form.Group> */}

                                <Form.Group as={Col} md='8'>
                                    <Row>
                                        <Form.Label>Make recurring on :</Form.Label>
                                        {["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"].map((day) => (
                                            <Form.Group as={Col} md='3' controlId='validationWeekRecurrence' key={`dafault-${day.toLowerCase()}`}>
                                                <Form.Check // prettier-ignore
                                                    type='checkbox'
                                                    id={`${day}-checkbox`}
                                                    label={`วัน${day}`}
                                                    onChange={() => handleDayToggle(day)}
                                                />
                                                <Form.Control.Feedback type='invalid'>Please select your booking date.</Form.Control.Feedback>
                                            </Form.Group>
                                        ))}
                                    </Row>
                                </Form.Group>
                            </Row>
                            <Row className='mt-4'>
                                <Form.Group as={Col} md='4' controlId='validationEndDate'>
                                    <Form.Label>End on</Form.Label>
                                    <Form.Control
                                        required
                                        type='date'
                                        name='end_date'
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        min={(formData.start_date)}
                                    />
                                    <Form.Control.Feedback type='invalid'>Please select your booking date.</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                        </Container>
                    )}
                </Row>
                <Row className='mt-4'>
                    <div className="d-flex justify-content-start">
                        <Button variant='primary' type='submit' style={{ width: "7.5rem" }}>Booking</Button>
                    </div>
                </Row>
            </Form>
        </Container>
    )
}

export default BookingPage