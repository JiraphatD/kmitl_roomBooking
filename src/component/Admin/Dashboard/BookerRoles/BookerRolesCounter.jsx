import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../AdminPage/AdminPage'
import { PieChart } from '@mui/x-charts';
import { HighQuality } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

function BookerRolesCounter() {
    const { linkBookDB } = useContext(AdminContext);
    const studentCounter = linkBookDB.filter(student => student.booker.role === 'Student');
    const professorCounter = linkBookDB.filter(prof => prof.booker.role === 'Teacher');
    const guestCounter = linkBookDB.filter(guest => guest.booker.role === 'Guest');
    const officerCounter = linkBookDB.filter(officer => officer.booker.role === 'Admin');
    console.log('Student Counter :' ,studentCounter,)
    console.log('Prof. Counter :' ,professorCounter,)
    console.log('guest Counter :' ,guestCounter,)

    const dataSet = [
        {
            id: 'Student',
            value: studentCounter.length,
            label: 'นักศึกษา'
        },
        {
            id: 'Prof',
            value: professorCounter.length,
            label: 'อาจารย์'
        },
        {
            id: 'guest',
            value: guestCounter.length,
            label: 'บุคคลากรภายนอกคณะ'
        },
        {
            id: 'officer',
            value: officerCounter.length,
            label: 'เจ้าหน้าที่'
        }
    ]

    return (
        <>
            <PieChart
                series={
                    [
                        {
                            data: dataSet,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 20, additionalRadius: -20, color: 'grey' },
                            cx: 140
                        }
                    ]
                }
                height={150}
            />
        </>
    )
}

export default BookerRolesCounter