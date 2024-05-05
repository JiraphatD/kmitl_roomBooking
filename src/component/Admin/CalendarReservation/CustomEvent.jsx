import React from 'react'

function CustomEvent({ event }) {

    // const titlePath = event.title;
    // const regExpres = /ห้อง\s+(\w+)\s+.*?(?:รหัสวิชา\s+(\d+)\s+)?วิชา\s+([^()]+)/;
    // let subjectID = '';
    // let subject = '';
    
    // if (titlePath.match(regExpres) !== null) {
    //     [, ,subjectID, subject] = titlePath.match(regExpres);
    //     console.log(titlePath.match(regExpres))
    // }

    return (
        <>
            <p>
                <b>{event.roomName} : </b>{event.roomDesc} <br /><br />
                <b>รหัสวิชา : </b>{event.subjectID}<br /><br />
                <b>วิชา/กิจกรรม : </b> {event.subject} <br /><br />
                <b>ผู้ใช้งาน : </b>{event.booker}
            </p>
        </>
    )
}

export default CustomEvent