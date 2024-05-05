import React from 'react'
import { Box, Paper, Grid } from '@mui/material'
import BookerRolesCounter from './BookerRolesCounter'

function BookerRolesCounterDisplay() {
  return (
    <Paper elevation={5} sx={
      {
        width: 'auto',
        paddingTop: '4px',
        paddingBottom: '10px',
        paddingLeft: "7px",

      }
    }>
      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
        <Box
          sx={
            {
              paddingTop: '10px',
              paddingLeft: '10px',
            }
          }
        >
          <h4><b>จำนวนผู้จอง</b></h4>
          <BookerRolesCounter />
        </Box>
      </Grid>
    </Paper>
  )
}

export default BookerRolesCounterDisplay