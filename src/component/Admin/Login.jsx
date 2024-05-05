import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { jwtDecode } from "jwt-decode";
import API_DATA from '../link';
import LoginStyles from './LoginStyles.module.css'

function Login({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const [validated, setValidated] = useState(false);
    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; // convert to seconds
                // console.log(decodedToken);
                // console.log(currentTime);
                if (decodedToken.exp < currentTime) {
                    // Token has expired, navigate to login
                    setIsAuthenticated(false);
                    navigate('/Login');
                } else {
                    // Token is still valid, set authentication status to true
                    setIsAuthenticated(true);
                    navigate('/Admin');
                }
            }
        };

        // Check token expiration every second
        const intervalId = setInterval(checkTokenExpiration, 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [navigate, setIsAuthenticated]);

    const handleChange = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value
        })
    }

    // const hashPassword = async (password) => {
    //     const saltRound = 10;
    //     return bcrypt.hash(password, saltRound);
    // }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {

            try {
                const response = await axios.post(API_DATA.login, {
                    username: user.username,
                    password: user.password,
                });

                console.log(response.data);

                setUser({
                    username: '',
                    password: '',
                });
                // Save the token in localStorage
                localStorage.setItem('token', response.data.token);
                // Set authentication status to true upon successful login
                setIsAuthenticated(true);
                navigate('/Admin')
            } catch (error) {

                console.error('Error during login:', error);
                // Handle specific error scenarios if needed
                console.error('Error response:', error.response?.data);
                console.error('Error status code:', error.response?.status);
                // Set an error state or show a user-friendly message

            }
        }

        setValidated(true);
    }

    return (
        <>
        <div className={LoginStyles.bgImage} />
            <Card style={{
                display: "block",
                margin: "auto",
                top: '15vw',
                width: "35vmax",
                boxShadow: "5px 5px 15px grey",
            }}>
                <Container>
                    <Card.Title style={{
                        paddingTop: "2vw",
                        textAlign: "center",
                        fontSize: "2rem",
                        fontWeight: "bold",
                    }}>
                        IT Room Reservation
                    </Card.Title>
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <InputGroup className="mt-4">
                                <InputGroup.Text id="username-input"><PersonIcon /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Username"
                                    aria-label="Username"
                                    name='username'
                                    value={user.username}
                                    onChange={handleChange}
                                    aria-describedby="username-input"
                                    required
                                />
                            </InputGroup>
                            <InputGroup className="mt-4">
                                <InputGroup.Text id="password-input"><LockPersonIcon /></InputGroup.Text>
                                <Form.Control
                                    placeholder="Password"
                                    aria-label="Password"
                                    name='password'
                                    value={user.password}
                                    onChange={handleChange}
                                    type='password'
                                    aria-describedby="password-input"
                                    required
                                />
                            </InputGroup>
                            <Card.Footer className='mt-4' style={{ background: "none" }}>
                                <Row className='mt-2'>
                                    <div className="d-flex justify-content-center">
                                        <Button variant='primary' type='submit' style={{ width: "15rem" }}>Login</Button>
                                    </div>
                                </Row>
                            </Card.Footer>
                        </Form>
                    </Card.Body>
                </Container>
            </Card>
        </>
    )
}

export default Login
