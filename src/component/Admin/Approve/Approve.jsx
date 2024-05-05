import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import "./Approve.css"
import Decline from "../Decline";

function Approve() {
    const [showDecline, setShowDecline] = useState(false);
    const openDecline = () => {
        setShowDecline(true);
    };
    const closeDecline = () => {
        setShowDecline(false);
    };

    return (
        <div className="approve">
            <h1>Title name</h1>
            <div className="detail">
                <h4>Room: </h4>
                <h4>Name: </h4>
                <h4>Email: </h4>
                <h4>Objective: </h4>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={3} className="detail-box">
                            <Typography variant="h6">Date</Typography>
                            <Typography>DD - MM - YYYY</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={3} className="detail-box">
                            <Typography variant="h6">Start</Typography>
                            <Typography>HH.MM</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={3} className="detail-box">
                            <Typography variant="h6">End</Typography>
                            <Typography>HH.MM</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={3} className="detail-box">
                            <Typography variant="h6">Week</Typography>
                            <Typography>Number of week</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
            <div className="approve-button">
                <Button variant="contained" className="btn btn-primary me-3">
                    Approve
                </Button>
                <Button variant="contained" className="btn btn-outline-danger me-3"
                    onClick={openDecline}>
                    Decline
                </Button>
            </div>
            <Decline showDecline={showDecline} closeDecline={closeDecline} />
        </div>
    );
}

export default Approve
