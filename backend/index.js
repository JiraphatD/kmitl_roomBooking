// Require PrismaClient Dependency
const { PrismaClient } = require('@prisma/client')

// Create PrismaClient Obj.
const prisma = new PrismaClient();

// Require Express Cors and use express for app.
const express = require('express');
const app = express();
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cron = require('node-cron');
const moment = require('moment');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
// Enable rate limiting
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
});
// Set up multer storage
// const storage = multer.memoryStorage(); // Store file in memory
const upload = multer();

// Require speakeasy to send OTP.
const speakeasy = require('speakeasy');

// Import function from other file
const { sendOTPEmail, sendCancelEmail, sendDeclineEmail, sendAdsMail, confirmedCancel } = require('./mail');
const { getSingleBooking, updateBooking, getBookingList,
    approveBooking, approveAll, deleteBooking, historyList } = require('./bookingQuery');
const { getEmails, getNonStudentEmails } = require('./ldap.js');

app.use(cors());
app.use(express.json());
moment.locale('th');

const currentDate = new Date();
const year = currentDate.getFullYear();

const month = currentDate.getMonth() + 1;
const formattedMonth = month < 10 ? `0${month}` : `${month}`;

const date = currentDate.getDate();

const formattedDate = `${year}-${formattedMonth}-${date}`;

// google calendar is below here.

require('dotenv').config()
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const oAuth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
})

app.get('/auth/google', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
        ],
    });
    res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oAuth2Client.getToken(code);
    // Store the access token and refresh token securely
    res.json(tokens);
});

app.get('/events', async (req, res) => {
    // Use the stored access token to make requests to the Google Calendar API
    const accessToken = 'YOUR_ACCESS_TOKEN';
    const calendar = google.calendar({ version: 'v3', auth: accessToken });
    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });
    res.json(response.data.items);
});

// google calendar is upper here.

// API Login

app.post('/api/login', async (req, res) => {

    const { username, password } = req.body;

    try {

        const superuser = await prisma.superUser.findUnique({
            where: {
                username,
            },
        });

        if (!superuser) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, superuser.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!process.env.JWT_SECRET) {
            const randomBytes = crypto.randomBytes(32);
            const randomSecretKey = randomBytes.toString('hex');
            process.env.JWT_SECRET = randomSecretKey;

            console.log(`Generated random JWT_SECRET: ${randomSecretKey}`);
        }

        const payload = {
            user: {
                id: superuser.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            // { expiresIn: 10 },
            (err, token) => {
                if (err) throw err;

                // Send the token in the response
                res.json({ token, message: 'Login successful' });
            }
        );
    } catch (error) {
        console.error('Error during login:', error);
        // Log the specific error details, if available
        if (error.response) {
            console.error('Server responded with:', error.response.data);
            console.error('Status code:', error.response.status);
        } else if (error.request) {
            console.error('No response received. Request made but no response.');
        } else {
            console.error('Error setting up the request:', error.message);
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Rest API

// API Software for testing table rendering
app.get('/getLabdata', async (req, res) => {
    const lab_software = await prisma.laboratory.findMany({
        include: {
            software: true
        }
    });
    res.json(lab_software);
})

app.get('/reservationList', async (req, res) => {
    const queryBooking = await prisma.booking.findMany();
    res.json(queryBooking);
})

app.get('/admin/approvementAllData', async (req, res) => {
    const queryApprovement = await prisma.approvement.findMany({
        where: {
            is_approved: true
        }
    });
    res.json(queryApprovement);
})

app.get('/admin/rejectedAllData', async (req, res) => {
    const queryRejected = await prisma.declineDeleteBooking.findMany();
    res.json(queryRejected);
})

app.get('/Room', limiter, async (req, res) => {
    const queryRoom = await prisma.room.findMany({
        include: {
            laboratory: {
                include: {
                    software: true,
                }
            },
            accessories: true,
        },
        orderBy: {
            room_name: 'asc'
        }
    });
    res.json(queryRoom);
})
app.put('/updateRoom', async (req, res) => {
    const { roomArray } = req.body;
    const updateResults = [];

    for (const room of roomArray) {
        const queryUpdateStatus = await prisma.room.update({
            where: { id: room[0] },
            data: { room_status: room[1] },
        });

        updateResults.push(queryUpdateStatus);
    }

    // Send a single response after all updates are done
    res.json(updateResults);
});
app.put('/updateEditRoom', async (req, res) => {
    const editedRoomData = req.body;
    //roomData, computerSpecs
    const roomData = editedRoomData.roomData;
    const computerSpecs = editedRoomData.computerSpecs;
    console.log(roomData);
    // console.log(computerSpecs);
    try {
        await prisma.accessories.deleteMany({
            where: {
                room_id: roomData.id
            }
        });
        await prisma.room.update({
            where: {
                id: roomData.id
            },
            data: {
                description: roomData.description,
                seat: parseInt(roomData.seat),
                room_status: roomData.room_status,
                room_category: roomData.room_category,
                accessories: {
                    createMany: {
                        data: roomData.accessories.filter((accs) => accs.id).map((accessory) => ({
                            id: accessory.id,
                            accessory_name: accessory.accessory_name,
                            quantity: parseInt(accessory.quantity),
                            setup_date: new Date()
                        }))
                    }
                }
            }
        });
        //Add new accessories.
        const newAccs = roomData.accessories.filter((accs) => accs.id == null);
        if (newAccs.length != 0) {
            await prisma.accessories.createMany({
                data: newAccs.map((accs) => ({
                    accessory_name: accs.accessory_name,
                    quantity: parseInt(accs.quantity),
                    setup_date: new Date(),
                    room_id: roomData.id
                }))
            });
        }
        if (computerSpecs.computer_quantity != 0) {
            await prisma.laboratory.update({
                where: {
                    room_id: roomData.id
                },
                data: {
                    computer_quantity: parseInt(computerSpecs.computer_quantity),
                    computer_brand: computerSpecs.computer_brand,
                    display: computerSpecs.display,
                    cpu: computerSpecs.cpu,
                    ram: computerSpecs.ram,
                    main_memory: computerSpecs.main_memory,
                    gpu: computerSpecs.gpu,
                    operation_system: computerSpecs.operation_system,
                    protection_system: computerSpecs.protection_system,
                }
            });
            await prisma.software.deleteMany({
                where: {
                    laboratory: {
                        every: {
                            room_id: roomData.id
                        }
                    }
                }
            });
            for (const software of computerSpecs.software_installed) {
                await prisma.software.create({
                    data: {
                        software_name: software,
                        laboratory: {
                            connect: {
                                room_id: roomData.id
                            }
                        }
                    }
                })
            }
        }
        console.log("Updated Room Data")
        res.status(200).json({ message: 'Updated Room Data' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to update data. Internal server error...' });
    }
});

//link Booker and Booking
app.get('/linkBook', limiter, async (req, res) => {
    const querylinkBook = await prisma.booking.findMany({
        include: {
            booker: true,
            approvement: true,
            room: true
        },
    });
    res.json(querylinkBook);
});

app.get('/roomLinkBook', async (req, res) => {
    const queryroomLinkBook = await prisma.room.findMany({
        include: {
            booking: {
                include: {
                    booker: true,
                }
            },
            laboratory: {
                include: {
                    software: true,
                }
            },
            accessories: true,
        },
    });
    res.json(queryroomLinkBook);
});

app.get('/BookingData', async (req, res) => {
    await getSingleBooking(req, res);
});
app.put('/BookingData', async (req, res) => {
    await updateBooking(req, res);
});
app.get('/BookingList', async (req, res) => {
    await getBookingList(req, res);
});
app.put('/BookingList', async (req, res) => {
    await approveBooking(req, res);
});
app.put('/BookingList/Many', async (req, res) => {
    await approveAll(req, res);
});
app.delete('/BookingList', async (req, res) => {
    await deleteBooking(req, res);
});
app.get('/historyList', async (req, res) => {
    await historyList(req, res);
});

app.get('/roomBook', async (req, res) => {
    const roomBook = await prisma.booking.findMany({
        include: {
            booker: true,
            room: true,
            advertise: true,
            approvement: true,
        },
    });
    res.json(roomBook);
})
app.get('/linkAds', limiter, async (req, res) => {
    const querylinkBook = await prisma.advertiseRoom.findMany({
        include: {
            advertise: true,
            room: true,
        },
    });
    res.json(querylinkBook);
})
app.get('/linkAds/:id', limiter, async (req, res) => {
    const querylinkBook = await prisma.advertiseRoom.findMany({
        where: {
            advertiseId: parseInt(req.params.id),
        },
        include: {
            advertise: true,
            room: true,
        },
    });
    res.json(querylinkBook);
})

app.get('/createAds', async (req, res) => {
    const room = await prisma.room.findMany();
    const advertise = await prisma.advertise.findMany();
    res.json({ room, advertise });
})
//Post Data to database
function resizeAndConvertBuffer(buffer, width, height) {
    return sharp(buffer)
        .resize({ width, height })
        .toBuffer();
}

async function convertBufferToImageUrl(buffer) {
    try {
        // Resize the buffer before encoding
        const resizedBuffer = await resizeAndConvertBuffer(buffer, 600, 800); // Adjust width and height as needed

        // Convert the resized buffer to a Base64 string
        const base64Image = resizedBuffer.toString('base64');

        // Construct the data URL with the resized Base64 string
        return `data:image/png;base64,${base64Image}`;
    } catch (error) {
        console.error('Error resizing and converting buffer:', error);
        throw error; // Propagate the error
    }
}
app.post('/createAds', upload.single('image'), async (req, res) => {

    try {
        let imageUrl = ''; // Initialize imageUrl to don't have file

        if (req.file) {
            const imageBuffer = req.file.buffer;
            imageUrl = await convertBufferToImageUrl(imageBuffer);
        }
        const { title, description, room_id, checkInDate, timeStart, timeEnd, sentNotification } = req.body;
        const formatDate = moment(checkInDate).format('YYYY-MM-DD');
        const formatStartTime = moment(timeStart).format('HH:mm:ss');
        const formatEndTime = moment(timeEnd).format('HH:mm:ss');
        const roomIdsArray = room_id.split(',');// Split the roomNames string into an array

        const advertise = await prisma.advertise.create({
            data: {
                title: title,
                description: description,
                image_url: imageUrl,
                active_date: new Date(`${formatDate}T${formatStartTime}`),
                end_date: new Date(`${formatDate}T${formatEndTime}`),
                notification: sentNotification,
            }
        });
        await prisma.advertiseRoom.createMany({
            data: roomIdsArray.map(roomId => ({
                advertiseId: advertise.id,
                roomId: roomId.trim(),
            })),
        });
        console.log("Advertise success !");
        res.status(200).json({
            message: 'ประกาศข่าวสำเร็จ !',
            advertise: { id: advertise.id }, // Include the advertiseId in the response
        });
    } catch (error) {
        console.error('Error creating advertisement:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update Data in the database
app.put('/editAdvertise/:id', upload.single('image'), async (req, res) => {     //edit Ads API

    try {
        const { title, description, room_id, checkInDate, timeStart, timeEnd, sentNotification, image } = req.body;
        const formatDate = moment(checkInDate).format('YYYY-MM-DD');
        const formatStartTime = moment(timeStart).format('HH:mm:ss');
        const formatEndTime = moment(timeEnd).format('HH:mm:ss');
        let imageUrl = '';
        if (req.file && req.file.buffer.length > 0) {
            console.log('File Buffer Size:', req.file.buffer.length);
            const imageBuffer = req.file.buffer;
            console.log('imageBuffer: ', imageBuffer);
            imageUrl = await convertBufferToImageUrl(imageBuffer);
        } else if (typeof image === 'string') {
            imageUrl = image;
        }
        const roomIdsArray = room_id.split(',');

        await prisma.advertiseRoom.deleteMany({
            where: { advertiseId: parseInt(req.params.id) }
        });
        // Update the main advertise data
        await prisma.advertise.update({
            where: { id: parseInt(req.params.id) },
            data: {
                title: title,
                description: description,
                image_url: imageUrl,
                active_date: new Date(`${formatDate}T${formatStartTime}`),
                end_date: new Date(`${formatDate}T${formatEndTime}`),
                notification: sentNotification,
            }
        });

        // Update the associated rooms
        await prisma.advertiseRoom.createMany({
            data: roomIdsArray.map(roomId => ({
                advertiseId: parseInt(req.params.id),
                roomId: roomId.trim(),
            })),
        });

        console.log("Advertise updated successfully!");
        res.status(200).json({ message: 'อัปเดตประกาศข่าวสำเร็จ !' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/deleteAdvertise/:id', async (req, res) => {    //delete Ads API
    // Delete the associated rooms
    await prisma.advertiseRoom.deleteMany({
        where: { advertiseId: parseInt(req.params.id) }
    });

    // Delete the main advertise data
    await prisma.advertise.delete({
        where: { id: parseInt(req.params.id) }
    });

    console.log("Advertise deleted successfully!");
    res.status(200).json({ message: 'ลบประกาศข่าวสำเร็จ !' });
});

app.get('/Booker', async (req, res) => {
    const queryBooker = await prisma.booker.findMany();
    res.json(queryBooker);
});
app.delete('/Booker', async (req, res) => {
    const booker_id = parseInt(req.query.id);
    console.log('deleting booker id: ' + booker_id);
    try {
        await prisma.booker.delete({
            where: {
                id: booker_id
            }
        });
        res.status(200).json({ message: 'ทำการลบสำเร็จ' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});
app.delete('/deleteManyBooker', async (req, res) => {
    const { booker } = req.body;
    console.log(booker);
    try {
        for (const each of booker) {
            await prisma.booker.delete({
                where: {
                    id: each
                }
            });
        }
        res.status(200).json({ message: 'ทำการลบสำเร็จ' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error...' })
    }
});
app.put('/Booker', async (req, res) => {
    const update_data = req.body;
    const ban_id = parseInt(req.query.id);
    const ban = req.query.ban == 'true' ? false : true;
    console.log(update_data);
    console.log(ban);
    if (ban_id == null) {
        try {
            await prisma.booker.update({
                where: {
                    id: update_data.id
                },
                data: {
                    name: update_data.name,
                    email: update_data.email,
                    role: update_data.role
                }
            });
            res.status(200).json({ message: 'updated booker...' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error });
        }
    } else {
        try {
            await prisma.booker.update({
                where: {
                    id: ban_id
                },
                data: {
                    verified: ban
                }
            });
            res.status(200).json({ message: 'updated ban...' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error })
        }
    }
});

app.get('/Booking', async (req, res) => {
    const queryBooking = await prisma.booking.findMany();
    res.json(queryBooking);
})

async function checkRole(email) {
    if (!email) {
        return res.status(401).json({ message: 'not have email' });
    }
    const studentEmails = await getEmails();
    const teacherEmails = await getNonStudentEmails();

    if (studentEmails.includes(email)) {
        return 'Student';
    } else if (teacherEmails.includes(email)) {
        return 'Teacher';
    } else {
        return 'Guest';
    }
}
app.get('/createBooker', async (req, res) => {
    const bookerList = await prisma.booker.findMany();
    const bookingList = await prisma.booking.findMany();
    res.json({ booker: bookerList, booking: bookingList });
})
// Post Data to database
app.post('/createBooker', limiter, async (req, res) => {
    const { fullname, email, title, checkInDate, purpose, room_id, timeStart, timeEnd, otp } = req.body;
    const booker_role = await checkRole(email);
    if (booker_role === 'Guest') {
        return res.status(401).json({ message: 'This email is not kmitl org. please contact officer.' })
    }
    const isValidOTP = speakeasy.totp.verify({
        secret: otpSecret.base32,
        encoding: 'base32',
        token: otp,
        step: 120
    });
    if (!isValidOTP) {
        console.log(otp);
        console.log("Invalid Verification Code");
        return res.status(401).json({ message: 'Invalid Verification Code' });
    }

    //Generate secret-key for user.
    console.log('Generated secret key for user...');
    const genSecret = () => {
        return speakeasy.generateSecret();
    }
    const userSecret = genSecret();
    const bookingDataModel = await prisma.booking.create({
        data: {
            booker: {
                connectOrCreate: {
                    where: {
                        email: email,
                    },
                    create: {
                        name: fullname,
                        email: email,
                        verified: true,
                        secret_key: userSecret.base32,
                        role: booker_role,
                    },
                }
            },
            title: title,
            booked_datetime: new Date(formattedDate),
            purpose: purpose,
            check_in_datetime: new Date(`${checkInDate}T${timeStart}`),
            check_out_datetime: new Date(`${checkInDate}T${timeEnd}`),
            room: {
                connect: {
                    id: room_id
                }
            },
            approvement: {
                create: {
                    is_approved: ['C1', 'C2', 'PT1', 'PT2', 'PT3'].includes(room_id) ? true : false,
                    approve_datetime: new Date(formattedDate)
                }
            }
        }
    });

    //send cancel email
    //Cancel code.
    const storedSecret = await prisma.booker.findFirst({
        where: {
            id: bookingDataModel.booker_id
        }
    });
    const gen_cancelCode = (secret) => {
        return speakeasy.hotp({
            secret: secret,
            encoding: 'base32',
            counter: bookingDataModel.id
        });
    }
    const cancel_code = gen_cancelCode(storedSecret.secret_key) + bookingDataModel.id;
    console.log('hotp: ' + cancel_code);
    await sendCancelEmail(email, title, cancel_code);

    console.log("Booking success !");
    res.status(200).json({ message: 'จองห้องสำเร็จ !' });
});
app.get('/adminCreateBooker', async (req, res) => {
    const bookerList = await prisma.booker.findMany();
    const bookingList = await prisma.booking.findMany();
    res.json({ booker: bookerList, booking: bookingList });
})
// Post Data to database
app.post('/adminCreateBooker', async (req, res) => {
    const { fullname, email, title, checkInDate, purpose, room_id, timeStart, timeEnd, advertiseId } = req.body;
    const { booking_many } = req.body;
    const roomIds = Array.isArray(room_id) ? room_id : [room_id];
    for (const roomId of roomIds) {
        if (!advertiseId) {
            for (const booking_data of booking_many) {
                const { title, purpose, room_name, booker_name, booker_email, start_date, start_time, end_date, end_time } = booking_data;
                const bookingByAdmin = await prisma.booking.create({
                    data: {
                        booker: {
                            connectOrCreate: {
                                where: {
                                    email: booker_email,
                                },
                                create: {
                                    name: booker_name,
                                    email: booker_email,
                                    verified: true,
                                    secret_key: '',
                                    role: await checkRole(booker_email),
                                },
                            }
                        },
                        title: title,
                        booked_datetime: new Date(formattedDate),
                        purpose: purpose,
                        check_in_datetime: new Date(`${start_date}T${start_time}`),
                        check_out_datetime: new Date(`${start_date}T${end_time}`),
                        room: {
                            connect: {
                                id: room_name
                            }
                        },
                        approvement: {
                            create: {
                                is_approved: true,
                                approve_datetime: new Date(formattedDate)
                            }
                        }
                    }
                })
            }
        } else {
            const formatDate = moment(checkInDate).format('YYYY-MM-DD');
            const formatStartTime = moment(timeStart).format('HH:mm:ss');
            const formatEndTime = moment(timeEnd).format('HH:mm:ss');
            const bookingDataModel = await prisma.booking.create({
                data: {
                    booker: {
                        connectOrCreate: {
                            where: {
                                email: email,
                            },
                            create: {
                                name: fullname,
                                email: email,
                                verified: true,
                                secret_key: '',
                                role: 'Admin',
                            },
                        }
                    },
                    title: title,
                    booked_datetime: new Date(formattedDate),
                    purpose: purpose,
                    check_in_datetime: new Date(`${formatDate}T${formatStartTime}`),
                    check_out_datetime: new Date(`${formatDate}T${formatEndTime}`),
                    room: {
                        connect: {
                            id: roomId
                        }
                    },
                    approvement: {
                        create: {
                            is_approved: true,
                            approve_datetime: new Date(formattedDate)
                        }
                    },
                    advertise: {
                        connect: {
                            id: advertiseId
                        }
                    }
                }
            });
        }
    }

    console.log("Booking success !");
    res.status(200).json({ message: 'จองห้องสำเร็จ !' });
});
// Request OTP
app.post('/user_requestVerify', async (req, res) => {
    const { email } = req.body;
    console.log(email);
    const totp = generateTOTP(otpSecret);
    console.log(totp);
    try {
        if (email !== '') {
            sendOTPEmail(email, totp);
            res.status(200).json({ message: 'Verification code sended' });
        }
        else {
            res.status(400).json({ message: 'No email.' });
        }
    } catch (error) {
        console.error("Error :", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// delete data from database
app.delete('/cancel_booking', async (req, res) => {
    const { cancel_code, email } = req.body;
    const booking_id = parseInt(cancel_code.slice(6));
    const cancellation_code = cancel_code.slice(0, 6);

    try {
        // Check if the booking exists
        const booking = await prisma.booking.findUnique({
            where: { id: booking_id },
            include: {
                booker: true,
                room: true,
            }
        });
        const verify = (userSecret) => {
            return speakeasy.hotp.verify({
                secret: userSecret,
                encoding: 'base32',
                token: cancellation_code,
                counter: booking_id
            });
        }
        if (!verify(booking.booker.secret_key)) {
            return res.status(404).json({ error: 'User secret-key error... [not found]' })
        }

        if (!booking) {
            return res.status(404).json({ error: 'No booking found.' });
        }

        if (!booking.booker) {
            return res.status(404).json({ error: 'No booker found.' });
        }

        // Delete the booking
        await prisma.booking.delete({
            where: { id: booking_id, booker_id: booking.booker_id },
        });

        confirmedCancel(booking.booker.email, booking.title);

        res.status(200).json({ message: 'Booking canceled successfully.' });
    } catch (error) {
        console.error('Error :', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Generate OTP
// Function to generate a new OTP secret
const generateOTPSecret = () => {
    const secret = speakeasy.generateSecret();
    return secret;
};
const otpSecret = generateOTPSecret();

// Function to generate a TOTP
const generateTOTP = (secret) => {
    return speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        step: 120
    });
};

app.get('/ldapStudentEmail', async (req, res) => {
    const emails = await getEmails();
    res.json(emails);
});
app.get('/ldapTeacherEmail', async (req, res) => {
    const emails = await getNonStudentEmails();
    res.json(emails);
});

cron.schedule('0 5 * * *', async () => {    //sent advertise email every 05:00
    console.log('running a task');
    try {
        const advertisements = await prisma.advertiseRoom.findMany({
            include: {
                advertise: true,
            },
        });
        const roomIdMap = {};
        const emailDataArray = [];

        for (const eachAdvertise of advertisements) {
            const { advertise: { title, description, active_date, end_date, notification }, advertiseId, roomId } = eachAdvertise;
            const currentDate = moment();
            const advertiseStartDate = moment(active_date);
            const advertiseEndDate = moment(end_date);
            const concatTime = `${advertiseStartDate.format('LT')} ถึง ${advertiseEndDate.format('LT')}`;

            if (!roomIdMap[advertiseId]) {
                roomIdMap[advertiseId] = [];
            }
            if (!roomIdMap[advertiseId].includes(roomId)) {
                roomIdMap[advertiseId].push(roomId);
            }
            if (currentDate.isSame(advertiseStartDate, 'day') && notification === 'Sent') {
                const existingData = emailDataArray.find(data => data.advertiseId === advertiseId);
                // Store the data in an array
                if (!existingData) {
                    emailDataArray.push({
                        advertiseId,
                        title,
                        description,
                        concatTime,
                        roomIdMap: { [advertiseId]: roomIdMap[advertiseId] },
                    });
                }
            }
        }
        const studentEmails = await getEmails();  // Call the function to get the emails
        const nonStudentEmails = await getNonStudentEmails();
        const allEmails = studentEmails.concat(nonStudentEmails);
        for (const email of allEmails) {  // Use the imported emails from ldap.js
            for (const emailData of emailDataArray) {
                sendAdsMail(email, emailData);
            }
        }
        console.log('Sent');
    } catch (error) {
        console.error("Error :", error);
    }
});

// RestAPI Working on port 3001
app.listen('3001', () => {
    console.log("server listen on port 3001.");
})
