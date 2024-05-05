import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Card, CardActionArea, CardMedia, CardContent, Container, Box, Grid } from '@mui/material'
// import { AdminContext } from '../../AdminPage/AdminPage'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import moment from 'moment';

function DisplayEvent({title, bookername, location, start_time, end_time, img}) {

    return (
        <Card sx={
            {
                display: 'inline-block',
                margin: '7px',
                width: '370px'
            }
        }>
            <CardActionArea>
                <CardMedia
                    component='img'
                    height="180"
                    image={img}
                    alt=''
                />
                <CardContent>
                    <h5><b>{title}</b></h5>
                    <Grid container>
                        <Grid item xs={1}>
                            <AccountCircleIcon color='disabled' />
                        </Grid>
                        <Grid item xs={6}>
                            <p>&nbsp;{bookername}</p>
                        </Grid>
                        <Grid item xs={1}>
                            <LocationOnIcon color='disabled' />
                        </Grid>
                        <Grid item xs={4}>
                            <p>&nbsp;{location}</p>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={1}>
                            <CalendarMonthIcon color='disabled' />
                        </Grid>
                        <Grid item xs={6}>
                            <p>&nbsp;{moment(start_time).format('DD/MM/YYYY')}</p>
                        </Grid>
                        <Grid item xs={1}>
                            <WatchLaterIcon color='disabled' />
                        </Grid>
                        <Grid item xs={4}>
                            <p>&nbsp;{moment(start_time).format('HH:mm')}-{moment(end_time).format('HH:mm')}</p> 
                            {/* Don't use format input 'MM' in Hour and Minute */}
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default DisplayEvent