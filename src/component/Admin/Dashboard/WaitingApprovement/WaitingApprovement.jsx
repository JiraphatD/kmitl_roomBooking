import React from 'react'
import { useState, useEffect } from 'react';
import { Grid, Card, CardActionArea } from '@mui/material'
import { Link } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import moment from 'moment';

function WaitingApprovement({ title, bookername, location, start_date, start_time, end_time }) {

    const [colorCard, setColorCard] = useState('');

    const bg_cardColor = {
        sunday: '#F76262',
        monday: '#CBCE18',
        tuesday: '#FD81FF',
        wednesday: '#4BAF5A',
        thursday: '#FFAE00',
        friday: '#53C9F9',
        saturday: '#BF53F9'
        // sunday: 'radial-gradient(circle, rgba(255,153,153,1) 0%, rgba(224,76,76,1) 100%)',
        // monday: 'radial-gradient(circle, rgba(214,226,119,1) 0%, rgba(206,207,21,1) 100%)',
        // tuesday: 'radial-gradient(circle, rgba(255,150,246,1) 0%, rgba(255,45,250,1) 100%)',
        // wednesday: 'radial-gradient(circle, rgba(115,233,121,1) 0%, rgba(41,159,42,1) 100%)',
        // thursday: 'radial-gradient(circle, rgba(255,218,124,1) 0%, rgba(255,162,0,1) 100%)',
        // friday: 'radial-gradient(circle, rgba(84,231,255,1) 0%, rgba(0,138,255,1) 100%)',
        // saturday: 'radial-gradient(circle, rgba(230,162,255,1) 0%, rgba(209,0,255,1) 100%)'
    }

    // console.log(moment(start_date).format('dddd'))

    useEffect(() => {
        const adjustmentColorDays = () => {
            switch (moment(start_date).format('dddd')) {
                case 'อาทิตย์':
                    setColorCard(bg_cardColor.sunday);
                    break;
                case 'จันทร์':
                    setColorCard(bg_cardColor.monday);
                    break;
                case 'อังคาร':
                    setColorCard(bg_cardColor.tuesday);
                    break;
                case 'พุธ':
                    setColorCard(bg_cardColor.wednesday);
                    break;
                case 'พฤหัสบดี':
                    setColorCard(bg_cardColor.thursday);
                    break;
                case 'ศุกร์':
                    setColorCard(bg_cardColor.friday);
                    break;
                case 'เสาร์':
                    setColorCard(bg_cardColor.saturday);
                    break;
                default:
                    setColorCard('grey');
                    break;
            }
        };
        adjustmentColorDays();
    }, [])

    // switch (moment(start_date).format('dddd')) {
    //     case 'อาทิตย์':
    //         setColorCard('#F76262');
    //         break;
    //     case 'จันทร์':
    //         setColorCard('#F5FF61');
    //         break;
    //     case 'อังคาร':
    //         setColorCard('#FE9BF3');
    //         break;
    //     case 'พุธ':
    //         setColorCard('#4BAF5A');
    //         break;
    //     default:
    //         setColorCard('#FFFFFF')
    // }

    return (
        <Card elevation={3} sx={
            {
                background: colorCard,
                color: '#FFFFFF',
                marginTop: '1rem',
            }
        } >
            <CardActionArea LinkComponent={Link} to='BookingManagement' >

                <Grid container sx={
                    {
                        paddingLeft: '10px',
                        fontSize: '14px',
                    }
                }>
                    <Grid item lg={12} md={12} sm={12} xs={12} sx={{ paddingTop: '7px', paddingLeft: '10px' }}>
                        <h5>
                            <b>{title}</b>
                        </h5>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12} sx={{ paddingTop: '7px', paddingLeft: '20px' }}>
                        <Grid container>
                            <Grid item xl={1} lg={1} md={2} sm={1} xs={2}>
                                <AccountCircleIcon />
                            </Grid>
                            <Grid item xl={5} lg={5} md={10} sm={5} xs={10}>
                                <p>{bookername}</p>
                            </Grid>
                            <Grid item xl={1} lg={1} md={2} sm={1} xs={2}>
                                <WhereToVoteIcon />
                            </Grid>
                            <Grid item xl={5} lg={5} md={10} sm={5} xs={10}>
                                <p>{location}</p>
                            </Grid>
                            <Grid item xl={1} lg={1} md={2} sm={1} xs={2}>
                                <CalendarMonthIcon />
                            </Grid>
                            <Grid item xl={5} lg={5} md={10} sm={5} xs={10}>
                                <p>{moment(start_date).format('YYYY/MM/DD')}</p>
                            </Grid>
                            <Grid item xl={1} lg={1} md={2} sm={1} xs={2}>
                                <WatchLaterIcon />
                            </Grid>
                            <Grid item xl={5} lg={5} md={10} sm={5} xs={10}>
                                <p>{moment(start_time).format('HH:mm')} - {moment(end_time).format('HH:mm')}</p>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </CardActionArea>
        </Card>
    )
}

export default WaitingApprovement