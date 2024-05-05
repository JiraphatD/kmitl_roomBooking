import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Box, Paper, Grid } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdminContext } from '../../AdminPage/AdminPage'
import WaitingApprovement from './WaitingApprovement'
import API_DATA from '../../../link'
import moment from 'moment'

function WaitingApprovementDisplay() {
    const { linkBookDB } = useContext(AdminContext);

    return (
        <Paper elevation={5} sx={
            {
                width: 'auto',
                paddingTop: '7px',
                paddingBottom: '7px',
                paddingLeft: "7px",

            }
        }>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box sx={
                    {
                        paddingTop: '10px',
                        paddingLeft: '10px',
                    }
                }>
                    <h4><b>รอการยืนยัน</b></h4>
                </Box>
                <Box sx={{
                    height: '330px',
                    margin: '1rem',
                    paddingLeft: '7px',
                    paddingRight: '14px',

                    /* WebKit scrollbar optimizations */
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    // '-webkit-overflow-scrolling': 'touch',

                    /* Styling for WebKit scrollbar (optional) */
                    '&::-webkit-scrollbar': {
                        width: '5px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(0, 0, 0, 0.2)',
                    },
                }}>
                    {linkBookDB.map((data) => {
                        if (!data.approvement.is_approved) {
                            return (
                                <WaitingApprovement key={data.id} title={data.title} bookername={data.booker.name} location={data.room_id} start_date={data.check_in_datetime} start_time={data.check_in_datetime} end_time={data.check_out_datetime} />
                            )
                        }
                    })}
                </Box>
            </Grid>
        </Paper>
    )
}

export default WaitingApprovementDisplay