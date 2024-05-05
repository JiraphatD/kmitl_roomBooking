import React, { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Grid, Autocomplete } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Swal from "sweetalert2";
import API_DATA from "../../link";
import { ArrowBackIosNew } from "@mui/icons-material";
import moment from "moment";

function EditBooking() {
    const { bookingId } = useParams();
    const [bookingData, setBookingData] = useState();
    const [roomData, setRoomData] = useState([]);
    const [edited, setEdited] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(API_DATA.bookingData + `?bookingId=${bookingId}`)
            .then(response => { setBookingData(response.data) })
            .catch(error => { console.error(error.response.data.message) });
        axios.get(API_DATA.room)
            .then(response => { setRoomData(response.data) })
            .catch(error => { console.error(error) });
    }, []);
    useEffect(() => {
        const handleReload = (event) => {
            event.preventDefault();
        }
        if (edited) {
            window.onbeforeunload = handleReload;
        }
        return () => {
            window.onbeforeunload = null;
        }
    }, [edited]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const confirmSave = await Swal.fire({
            title: 'Save all edited data?',
            icon: 'question',
            text: 'All edited data will be save...',
            showCancelButton: true,
        });
        if (confirmSave.isConfirmed) {
            try {
                console.log(bookingData);
                const response = await axios.put(API_DATA.bookingData, { bookingData });
                const confirm = await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.data.message,
                    timer: 3000,
                });
                if (confirm.isConfirmed) {
                    navigate("/Admin/BookingManagement");
                }
            }
            catch (error) {
                Swal.fire({
                    title: 'Update Failed...',
                    icon: 'error',
                    text: error.response.data.message,
                })
            }
        }
    };
    const formOnChange = (e) => {
        if (!edited) {
            setEdited(true);
        }
        setBookingData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
            booker: {
                ...prevState.booker,
                [e.target.name]: e.target.value
            }
        }));
        console.log(bookingData);
    };
    return (
        <div style={
            {
                marginLeft: '3vw',
                marginRight: '3vw'
            }
        }>
            <form onSubmit={handleSubmit}>
                {bookingData && (<>
                    <div style={{ marginTop: '35px' }}>
                        <Link to={"../BookingManagement"}>
                            <p><ArrowBackIosNew /></p>
                        </Link>
                    </div>
                    <h1 style={{ margin: '20px' }}>
                        <IconButton color='primary' aria-label='back' onClick={() => navigate("/Admin/BookingManagement")}>
                            <ArrowBackIosNew />
                        </IconButton> Editing {bookingData.title}</h1>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                id="room_id"
                                value={bookingData.room_id}
                                options={roomData.map((room) => room.id)}
                                onChange={(event, newValue) => {
                                    setBookingData((prevState) => ({
                                        ...prevState,
                                        room_id: newValue, // Update selected room
                                        booker: {
                                            ...prevState.booker,
                                        }
                                    }))
                                }}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Room" required />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Title" name="title" value={bookingData.title} onChange={formOnChange} required fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Purpose" name="purpose" value={bookingData.purpose} onChange={formOnChange} required fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField InputLabelProps={{ shrink: true }} label="Booked Date Time" name="booked_datetime"
                                value={moment(bookingData.booked_datetime).format('YYYY-MM-DDTHH:mm')} onChange={formOnChange} type="datetime-local" required fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField InputLabelProps={{ shrink: true }} label="Check In Date Time" name="check_in_datetime"
                                value={moment(bookingData.check_in_datetime).format('YYYY-MM-DDTHH:mm')} onChange={formOnChange} type="datetime-local" required fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField InputLabelProps={{ shrink: true }} label="Check Out Date Time" name="check_out_datetime"
                                value={moment(bookingData.check_out_datetime).format('YYYY-MM-DDTHH:mm')} onChange={formOnChange} type="datetime-local" required fullWidth />
                        </Grid>

                        <Grid item xs={12}>
                            <h3>Booker Details</h3>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Name" name="name" value={bookingData.booker.name} onChange={formOnChange} required fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Email" name="email" value={bookingData.booker.email} onChange={formOnChange} type="email" required fullWidth />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Submit
                            </Button>
                        </Grid>
                    </Grid></>
                )}
            </form>
        </div>
    );
}

export default EditBooking
