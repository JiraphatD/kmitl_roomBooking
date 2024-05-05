import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Card, Container, Paper, Box } from '@mui/material'
import DisplayEvent from './DisplayEvent'
import { AdminContext } from '../../AdminPage/AdminPage'
import moment from 'moment'

function DisplayAllEvent() {

    const { roomBook } = useContext(AdminContext);

    const handleScroll = (event) => {
        // Prevent unnecessary re-renders
        if (event.nativeEvent.target.scrollLeft === event.currentTarget.scrollLeft) {
          return;
        }
      };

    // console.log(roomBook)

    return (
        <Paper elevation={5}>
            <Box sx={
                {
                    paddingTop: '20px',
                    paddingLeft: '10px',
                    margin: '7px',
                }
            }>
                <h4><b>กิจกรรมที่ดำเนินอยู่</b></h4>
            </Box>
            <Box sx={
                {
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    whiteSpace: 'nowrap',
                    height: '350px',
                    WebkitOverflowScrolling: 'touch',
                    // '-webkit-overflow-scrolling': 'touch',

                    /* Styling for WebKit scrollbar (optional) */
                    '&::-webkit-scrollbar': {
                        height: '10px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(0, 0, 0, 0.2)',
                    },
                }
            }>
                {roomBook.map((event_data) => {
                    // Dubug  Code below this line
                    // return <DisplayEvent key={event_data.id} title={event_data.title} bookername={event_data.booker.name} location={event_data.room.room_name} start_time={event_data.check_in_datetime} end_time={event_data.check_out_datetime} img={event_data.advertiseId === null ? event_data.room.room_image : event_data.advertise.image_url} />
                    if (moment().isBetween(moment(event_data.check_in_datetime), moment(event_data.check_out_datetime)))
                        return <DisplayEvent key={event_data.id} title={event_data.title} bookername={event_data.booker.name} location={event_data.room.room_name} start_time={event_data.check_in_datetime} end_time={event_data.check_out_datetime} img={event_data.advertiseId === null ? event_data.room.room_image : event_data.advertise.image_url} />
                })}
            </Box>
        </Paper>
    )
}

export default DisplayAllEvent