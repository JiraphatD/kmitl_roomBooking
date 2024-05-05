import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Container as MUIContainer, Box, Paper, Badge } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdminContext } from '../../AdminPage/AdminPage'
import API_DATA from '../../../link'

function EventCalendar() {

    const { linkBookDB } = useContext(AdminContext);

    return (
        <Paper elevation={2} sx={
            {
                width: 'auto',
                paddingTop: '7px',
                paddingBottom: '7px',
                paddingLeft: "7px",
            }
        }>
            <Box sx={
                {
                    margin: '7px'
                }
            }>
                <h3><b>Calendar</b></h3>
            </Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateCalendar />
            </LocalizationProvider>
        </Paper>
    )
}

export default EventCalendar