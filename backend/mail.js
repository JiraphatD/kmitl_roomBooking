// Require nodemailer for send email.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();
const emailSMTP = process.env.EMAIL;
const passwordSMTP = process.env.PASSWORD;

async function sendCancelEmail(email, title, cancel_code) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailSMTP,
            pass: passwordSMTP,
        },
    });
    const mailOptions = {
        from: emailSMTP,
        to: email,
        subject: title,
        text: `Your cancel ID for reservation is ${cancel_code}
        Please go to localhost:5173/Cancellation if you want to cancel your reservation.`,
        html: `
        <div style="background-image: url('https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/itkmitl-panorama-1.jpg'); background-size: cover; background-position: center; ">
            <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; text-align: center">
                <img src="https://ci3.googleusercontent.com/meips/ADKq_NbQBJ5LjKUuAjXP6GhmHZJULtIiVahcAT-A5Y5zHjqWj1Q8sqOM5XnfVWSsKwwGZsPqP6epFLdpTgJZpS7D_4_FBr1ifE7PQkY=s0-d-e1-ft#https://carbon.it.kmitl.ac.th/img/logo.29b407b5.png" >
                <h2 style="color: #333; margin-bottom: 10px; margin-top: 30px;">ระบบจองห้องคณะเทคโนโลยีสารสนเทศ</h2>
                <h3 style="color: #555; margin-bottom: 5px;">รหัสการจอง</h3>
                <h1 style="color: #333; margin-bottom: 10px;">${cancel_code}</h1>
                <h3 style="color: #555; margin-bottom: 5px;">หัวข้อการจอง</h3>
                <h1 style="color: #333; margin-bottom: 10px;">${title}</h1>
                <h3 style="color: #555; margin-bottom: 5px;">อีเมลที่ใช้ในการจอง</h3>
                <h3 style="color: #777;">
                    ${email}
                </h3>
                <h3 style="color: #555; margin-bottom: 5px;">ท่านสามารถใช้ข้อมูลดังกล่าวยกเลิกการจองได้ที่</h3>
                <h3 style="color: #777;">
                    <a href='http://localhost:5173/Cancellation'>IT KMITL Cancel Reservation</a>
                </h3>
            </div>
        </div>
        `,
    };
    await transporter.sendMail(mailOptions);
}

async function sendOTPEmail(email, totp) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailSMTP,
                pass: passwordSMTP,
            },
        });
        const mailOptions = {
            from: emailSMTP,
            to: email,
            subject: 'Reservation OTP',
            text: `Your OTP is ${totp}`,
            html: `
        <div style="background-image: url('https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/itkmitl-panorama-1.jpg'); background-size: cover; background-position: center; ">
            <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; text-align: center">
                <img src="https://ci3.googleusercontent.com/meips/ADKq_NbQBJ5LjKUuAjXP6GhmHZJULtIiVahcAT-A5Y5zHjqWj1Q8sqOM5XnfVWSsKwwGZsPqP6epFLdpTgJZpS7D_4_FBr1ifE7PQkY=s0-d-e1-ft#https://carbon.it.kmitl.ac.th/img/logo.29b407b5.png" >
                <h2 style="color: #333; margin-bottom: 10px; margin-top: 30px;">ระบบจองห้องคณะเทคโนโลยีสารสนเทศ</h2>
                <h3 style="color: #555; margin-bottom: 5px;">รหัส OTP ยืนยันการจอง</h3>
                <h1 style="color: #333; margin-bottom: 10px;">${totp}</h1>
                <h3 style="color: #555; margin-bottom: 5px;">สำหรับการจองของ</h3>
                <h3 style="color: #333;">
                    ${email}
                </h3>
            </div>
        </div>
        `,
        };
        await transporter.sendMail(mailOptions);
        console.log('done');
    } catch (err) {
        console.error(err);
    }
}

async function sendDeclineEmail(email, reason, title, location) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailSMTP,
            pass: passwordSMTP,
        },
    });
    const mailOptions = {
        from: emailSMTP,
        to: email,
        subject: 'Booking Declined...',
        text: `Your Booking have been declined because ${reason}
        for more info or question... please contact admin.`,
        html: `
        <div style="background-image: url('https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/itkmitl-panorama-1.jpg'); background-size: cover; background-position: center; ">
            <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; text-align: center">
                <img src="https://ci3.googleusercontent.com/meips/ADKq_NbQBJ5LjKUuAjXP6GhmHZJULtIiVahcAT-A5Y5zHjqWj1Q8sqOM5XnfVWSsKwwGZsPqP6epFLdpTgJZpS7D_4_FBr1ifE7PQkY=s0-d-e1-ft#https://carbon.it.kmitl.ac.th/img/logo.29b407b5.png" >
                <h2 style="color: #333; margin-bottom: 10px; margin-top: 30px;">เจ้าหน้าที่เพิกถอนการจองหรือไม่อนุมัติการใช้งาน</h2>
                <h3 style="color: #555; margin-bottom: 5px;">หัวข้อ</h3>
                <h1 style="color: #333; margin-bottom: 10px;">${title}</h1>
                <h3 style="color: #555; margin-bottom: 5px;">สถานที่ห้อง</h3>
                <h3 style="color: #777;">
                    ${location}
                </h3>
                <h3 style="color: #777; margin-top: 10px;">หมายเหตุการเพิกถอนหรือไม่อนุมัติ</h3>
                <h3 style="color: #777; margin-top: 10px;">${reason}</h3>
            </div>
        </div>
        `,
    };
    await transporter.sendMail(mailOptions);
}

async function confirmedCancel(email, title) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailSMTP,
            pass: passwordSMTP,
        },
    });
    const mailOptions = {
        from: emailSMTP,
        to: email,
        subject: 'Booking canceled by user...',
        html: `
        <div style="background-image: url('https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/itkmitl-panorama-1.jpg'); background-size: cover; background-position: center; ">
            <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; text-align: center">
                <img src="https://ci3.googleusercontent.com/meips/ADKq_NbQBJ5LjKUuAjXP6GhmHZJULtIiVahcAT-A5Y5zHjqWj1Q8sqOM5XnfVWSsKwwGZsPqP6epFLdpTgJZpS7D_4_FBr1ifE7PQkY=s0-d-e1-ft#https://carbon.it.kmitl.ac.th/img/logo.29b407b5.png" >
                <h2 style="color: #333; margin-bottom: 10px; margin-top: 30px;">ระบบยกเลิกการจองคณะเทคโนโลยีสารสนเทศ</h2>
                <h1 style="color: #333; margin-bottom: 10px;">${title}</h1>
                <h3 style="color: #555; margin-bottom: 5px;">การจองของท่านได้ถูกยกเลิกแล้ว</h3>
                <h3 style="color: #777; margin-top: 10px;">***หากท่านไม่ได้เป็นผู้ยกเลิก สามารถติดต่อได้ที่ IT Support***</h3>
            </div>
        </div>
        `,
    };
    await transporter.sendMail(mailOptions);
}

async function sendNotifyEmail(email, title) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailSMTP,
            pass: passwordSMTP,
        },
    });
    const mailOptions = {
        from: emailSMTP,
        to: email,
        subject: 'Your Booking time arrived...',
        text: `This Email are send to notify you that your booking time of ${title} has arrived...`,
        html: `
        <div style="background-image: url('https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/itkmitl-panorama-1.jpg'); background-size: cover; background-position: center; ">
            <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; text-align: center">
                <img src="https://ci3.googleusercontent.com/meips/ADKq_NbQBJ5LjKUuAjXP6GhmHZJULtIiVahcAT-A5Y5zHjqWj1Q8sqOM5XnfVWSsKwwGZsPqP6epFLdpTgJZpS7D_4_FBr1ifE7PQkY=s0-d-e1-ft#https://carbon.it.kmitl.ac.th/img/logo.29b407b5.png" >
                <h2 style="color: #333; margin-bottom: 10px; margin-top: 30px;">ระบบจองห้องคณะเทคโนโลยีสารสนเทศ</h2>
                <h3 style="color: #333;">ถึง : ${email}</h3>
                <h3 style="color: #333;">อีเมลนี้ถูกส่งเพื่อแจ้งเตือนเวลาการจอง</h3>
                <h1 style="color: #333; margin-bottom: 10px;">${title}</h1>
                <h3 style="color: #333;">ถึงเวลาเข้าใช้งานแล้ว</h3>
            </div>
        </div>
        `,
    };
    await transporter.sendMail(mailOptions);
}

async function sendNotifyBookingApproved(email, title, location, dateTime, startTime, endTime) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailSMTP,
            pass: passwordSMTP,
        }
    })

    const mailOptions = {
        from: emailSMTP,
        to: email,
        subject: `เจ้าหน้าที่ได้ทำการ Approve ${title} แล้ว`,
        text: `เจ้าหน้าที่ได้ทำการ Approve ${title} แล้ว`,
        html: `
        <div style="background-image: url('https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/itkmitl-panorama-1.jpg'); background-size: cover; background-position: center; ">
            <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; text-align: center">
                <img src="https://ci3.googleusercontent.com/meips/ADKq_NbQBJ5LjKUuAjXP6GhmHZJULtIiVahcAT-A5Y5zHjqWj1Q8sqOM5XnfVWSsKwwGZsPqP6epFLdpTgJZpS7D_4_FBr1ifE7PQkY=s0-d-e1-ft#https://carbon.it.kmitl.ac.th/img/logo.29b407b5.png" >
                <h2 style="color: #333; margin-bottom: 10px; margin-top: 30px;">เจ้าหน้าที่รับเรื่องการจองและอนุมัติการใช้งาน</h2>
                <h1 style="color: #333; margin-bottom: 10px;">${title}</h1>
                <h3 style="color: #555; margin-bottom: 5px;">สถานที่ห้อง</h3>
                <h3 style="color: #777;">
                    ${location}
                </h3>
                <h3 style="color: #777; margin-top: 10px;">วันที่ ${dateTime}</h3>
                <h3 style="color: #777; margin-top: 10px;">เวลาเข้าใช้งาน ${startTime} - ${endTime}</h3>
            </div>
        </div>
        `,
    }

    await transporter.sendMail(mailOptions);
}

async function sendNotifyBookingUpdate(email, name, room_id, title, purpose, start_date, start_time, end_time) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailSMTP,
            pass: passwordSMTP,
        }
    })

    const mailOptions = {
        from: emailSMTP,
        to: email,
        subject: `เจ้าหน้าที่ได้ทำการแก้ไขการจองในหัวข้อ ${title}`,
        text: `เจ้าหน้าที่ได้ทำการแก้ไขการจองในหัวข้อ ${title}`,
        html: `
        <div style="background-image: url('https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/itkmitl-panorama-1.jpg'); background-size: cover; background-position: center; ">
            <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; text-align: center">
                <img src="https://ci3.googleusercontent.com/meips/ADKq_NbQBJ5LjKUuAjXP6GhmHZJULtIiVahcAT-A5Y5zHjqWj1Q8sqOM5XnfVWSsKwwGZsPqP6epFLdpTgJZpS7D_4_FBr1ifE7PQkY=s0-d-e1-ft#https://carbon.it.kmitl.ac.th/img/logo.29b407b5.png" >
                <h2 style="color: #333; margin-bottom: 10px; margin-top: 30px;">เจ้าหน้าที่ได้ทำการแก้ไขการจองในหัวข้อ</h2>
                <h1 style="color: #333; margin-bottom: 10px;">${title}</h1>
                <h3 style="color: #555; margin-bottom: 5px;">สถานที่ห้อง</h3>
                <h3 style="color: #777;">
                    ${room_id}
                </h3>
                <h3 style="color: #777; margin-top: 10px;">ผู้จอง ${name}</h3>
                <h3 style="color: #777; margin-top: 10px;">อีเมลผู้จอง ${email}</h3>
                <h3 style="color: #777; margin-top: 10px;">วัตถุประสงค์การจอง ${purpose}</h3>
                <h3 style="color: #777; margin-top: 10px;">วันที่ ${start_date}</h3>
                <h3 style="color: #777; margin-top: 10px;">เวลาเข้าใช้งาน ${start_time} - ${end_time}</h3>
            </div>
        </div>
        `,
    }

    await transporter.sendMail(mailOptions);
}

// async function sendNotifyBookingRejected(email, title, location, dateTime, startTime, endTime) {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: emailSMTP,
//             pass: passwordSMTP,
//         }
//     })

//     const mailOptions = {
//         from: emailSMTP,
//         to: email,
//         subject: 'Your booking has been rejected...',
//         text: `เจ้าหน้าที่ได้ทำการ Approve ${title} แล้ว`,
//         html: `
//         <div style="background-image: url('https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/itkmitl-panorama-1.jpg'); background-size: cover; background-position: center; ">
//             <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; text-align: center">
//                 <img src="https://ci3.googleusercontent.com/meips/ADKq_NbQBJ5LjKUuAjXP6GhmHZJULtIiVahcAT-A5Y5zHjqWj1Q8sqOM5XnfVWSsKwwGZsPqP6epFLdpTgJZpS7D_4_FBr1ifE7PQkY=s0-d-e1-ft#https://carbon.it.kmitl.ac.th/img/logo.29b407b5.png" >
//                 <h2 style="color: #333; margin-bottom: 10px; margin-top: 30px;">เจ้าหน้าที่รับเรื่องการจองและเพิกถอนการจอง</h2>
//                 <h1 style="color: #333; margin-bottom: 10px;">${title}</h1>
//                 <h3 style="color: #555; margin-bottom: 5px;">สถานที่ห้อง</h3>
//                 <h3 style="color: #777;">
//                     ${location}
//                 </h3>
//                 <h3 style="color: #777; margin-top: 10px;">วันที่</h3>
//                 <h3 style="color: #777; margin-top: 10px;">${dateTime}</h3>
//                 <h3 style="color: #777; margin-top: 10px;">เวลา</h3>
//                 <h3 style="color: #777; margin-top: 10px;"> ${startTime} - ${endTime}</h3>
//             </div>
//         </div>
//         `,
//     }

//     await transporter.sendMail(mailOptions);
// }

// Run the cron job every minute
cron.schedule('* * * * *', async () => {
    const currentBooking = await prisma.booking.findMany({
        where: {
            check_in_datetime: {
                lte: new Date()
            },
            notified_user: false
        },
        include: {
            booker: true
        }
    });
    for (booking of currentBooking) {
        sendNotifyEmail(booking.booker.email, booking.title);
        await prisma.booking.update({
            where: {
                id: booking.id
            },
            data: {
                notified_user: true
            }
        });
    }
});

async function sendAdsMail(email, emailData) {
    const { advertiseId, title, description, concatTime, roomIdMap } = emailData;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailSMTP,
            pass: passwordSMTP,
        },
    });
    const mailOptions = {
        from: emailSMTP,
        to: email,
        subject: 'วันนี้ที่คณะไอทีมีการจัดกิจกรรม',
        html: `
        <div style="background-image: url('https://www.it.kmitl.ac.th/wp-content/themes/itkmitl2017wp/img/itkmitl-panorama-1.jpg'); background-size: cover; background-position: center; ">
            <div style="max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px; text-align: center">
                <img src="https://identity.it.kmitl.ac.th/static/img/logo.png" width="100%">
                <h2 style="color: #333; margin-bottom: 10px; margin-top: 30px;">วันนี้มีกิจกรรม</h2>
                <h1 style="color: #333; margin-bottom: 10px;">${title}</h1>
                <h3 style="color: #555; margin-bottom: 10px;">${description}</h3>
                <h3 style="color: #555; margin-bottom: 5px;">สถานที่จัดกิจกรรม</h3>
                <h3 style="color: #777;">
                    ${Object.values(roomIdMap[advertiseId] || {}).map(roomId => `<p>${roomId}</p>`).join('')}
                </h3>
                <h3 style="color: #777; margin-top: 10px;">เวลา ${concatTime}</h3>
            </div>
        </div>
        `,
    };
    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendOTPEmail,
    sendCancelEmail,
    sendDeclineEmail,
    sendAdsMail,
    sendNotifyBookingApproved,
    sendNotifyBookingUpdate,
    confirmedCancel
};
