import React from 'react'
import { useState, useEffect } from 'react'
import { AdminContext } from '../../AdminPage/AdminPage'
import { Container, Box, Paper } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import GroupsIcon from '@mui/icons-material/Groups';

function CardSumary({ card_name, quantity, icon }) {
    return (
        <Paper elevation={5}>
            <Box sx={
                {
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    paddingTop: '1rem'
                }
            }>
                <Box sx={
                    {
                        alignItems: 'center',
                        display: 'flex',
                        paddingBottom: '1rem'
                    }
                }>
                    {icon === 'EventIcon' && (
                        <EventIcon color='primary' sx={{ fontSize: '3rem' }} />
                    )}

                    {icon === 'CheckCircleIcon' && (
                        <CheckCircleIcon color='success' sx={{ fontSize: '3rem' }} />
                    )}

                    {icon === 'CancelIcon' && (
                        <CancelIcon sx={{ color: '#CF0505', fontSize: '3rem' }} />
                    )}
                    {icon === 'GroupsIcon' && (
                        <GroupsIcon color='secondary' sx={{fontSize: '4rem' }} />
                    )}
                </Box>
                <Box>
                    <h3><b>{quantity}</b></h3>
                    <p>{card_name}</p>
                </Box>
            </Box>
        </Paper>
    )
}

export default CardSumary