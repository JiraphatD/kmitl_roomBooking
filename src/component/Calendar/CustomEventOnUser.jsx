import React from 'react'

function CustomEventOnUser({ event }) {
    return (
        <>
            <p>
                <b>{event.roomName} : </b>{event.roomDesc} <br /><br />
                <b>รหัสวิชา : </b>{event.subjectID}<br /><br />
                <b>วิชา/กิจกรรม : </b> {event.subject} <br /><br />
                <b>ผู้ใช้งาน : <br /></b>{event.booker}
            </p>
        </>
    )
}

export default CustomEventOnUser