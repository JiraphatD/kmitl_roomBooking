import React, { useState } from 'react';
import { useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { CSVLink } from "react-csv";

function Export({ showExport, exportClick, handleExport, bookExport, concludeExport }) {
    const phone = useMediaQuery('(max-width:600px)');
    const [exportOption, setExportOption] = useState('all'); // 'all' or 'select'
    const handleExportOptionChange = (event) => {
        setExportOption(event.target.value);
    };
    const concludeHeader = [
        { label: 'ชื่อห้อง', key: 'name' },
        { label: 'ชั้น', key: 'floor' },
        { label: 'ชั่วโมงการใช้งาน', key: 'totalHours' },
        { label: 'ช่วงเวลาการใช้งานมากที่สุด', key: 'mostUsedTimeRange' },
        { label: 'เวลาเริ่มต้นของช่วงเวลาการใช้งานมากที่สุด', key: 'mostUsedTimeRangeStart' },
        { label: 'เวลาสิ้นสุดของช่วงเวลาการใช้งานมากที่สุด', key: 'mostUsedTimeRangeEnd' },
        { label: 'ช่วงเวลาการใช้งานน้อยที่สุด', key: 'leastUsedTimeRange' },
        { label: 'เวลาเริ่มต้นของช่วงเวลาการใช้งานน้อยที่สุด', key: 'leastUsedTimeRangeStart' },
        { label: 'เวลาสิ้นสุดของช่วงเวลาการใช้งานน้อยที่สุด', key: 'leastUsedTimeRangeEnd' },
        { label: 'ปี', key: 'year' },
    ];
    const headers = [
        { label: 'ชื่อห้อง', key: 'room' },
        { label: 'ชั้น', key: 'floor' },
        { label: 'ชั่วโมงการใช้งาน', key: 'timeDiff' },
        { label: 'ช่วงเวลาการใช้งาน', key: 'concatTime' },
        { label: 'เวลาเริ่มต้น', key: 'startTime' },
        { label: 'เวลาสิ้นสุด', key: 'endTime' },
        { label: 'ประเภทของการจอง', key: 'purpose' },
        { label: 'ตำแหน่ง', key: 'role' },
        { label: 'วันที่', key: 'startDay' },
        { label: 'เดือน', key: 'monthName' },
        { label: 'ปี', key: 'startYear' },
        // Add more headers as needed
    ];
    const csvReport = {
        data: exportOption === 'all' ? bookExport : concludeExport,
        headers: exportOption === 'all' ? headers : concludeHeader,
        filename: exportOption === 'all' ? 'select_booking_data.csv': 'conclude_booking_data.csv'
    };


    return (
        <Dialog open={showExport} onClose={exportClick} fullWidth={true} maxWidth="xs">
            <DialogTitle>Export CSV</DialogTitle>
            <DialogContent>
                <p>กรุณาเลือกประเภทของการ EXPORT</p>
                <FormControl style={{ fontSize: phone ? '5vw' : 'initial'}}>
                    <InputLabel id="export-option-label">Export Option</InputLabel>
                    <Select label="export-option-label" value={exportOption} onChange={handleExportOptionChange} sx={{ fontFamily: 'Prompt' }}>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value="all">Export ข้อมูลที่เลือก</MenuItem>
                        <MenuItem sx={{ fontFamily: 'Prompt' }} value="select">Export ข้อมูลสรุป</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={exportClick} sx={{fontFamily: 'Prompt'}}>
                    ปิด
                </Button>
                <Button variant="contained" color="primary" onClick={handleExport}>
                    <CSVLink {...csvReport} style={{color: 'white', textDecoration: 'none'}}>ดาวน์โหลด</CSVLink>
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Export
