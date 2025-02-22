import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import Message from '../Message';
import { getUserDetails, updateUserProfile, logout } from '../../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import { listMyOrders } from '../../actions/orderActions';

function ProfileScreen({ history }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Success message for profile update
    const [countdown, setCountdown] = useState(5); // Countdown state
    const [showCountdown, setShowCountdown] = useState(false); // To toggle countdown visibility

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userDetails);
    const { error, loading, user } = userDetails;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const { success } = userUpdateProfile;

    const orderListMy = useSelector(state => state.orderListMy);
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;
    
    const [isOrdersFetched, setIsOrdersFetched] = useState(false);

    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        } else {
            if (!user || !user.name) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET });
                dispatch(getUserDetails('profile'));
            }
    
            // Fetch orders only if they haven't been fetched yet
            if (!isOrdersFetched) {
                dispatch(listMyOrders()).then(() => setIsOrdersFetched(true));
            }
        }
    
        // Success message logic remains unchanged
        if (success) {
            setSuccessMessage('Profile updated successfully!');
            setShowCountdown(true);
            const countdownInterval = setInterval(() => {
                setCountdown(prevCount => {
                    if (prevCount === 1) {
                        clearInterval(countdownInterval);
                        dispatch(logout());
                        history.push('/');
                    }
                    return prevCount - 1;
                });
            }, 1000);
        }
    
        return () => {
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
        };
    }, [dispatch, history, userInfo, user, success, isOrdersFetched]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        dispatch(updateUserProfile({ id: user._id, name, email, password }));
    };

    return (
        <Row className='justify-content-center'>
            <Col md={10} className='justify-content-center'>
                <h2>Your Profile</h2>
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader />}
                {successMessage && <Message variant='success'>{successMessage}</Message>}

                {showCountdown && (
                    <div style={{ border: '1px solid green', padding: '10px', marginTop: '20px' }}>
                        <p>Logging out in {countdown} seconds...</p>
                    </div>
                )}

                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            placeholder={(userInfo && userInfo.name) || (user && user.name) || null}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            required
                            type='email'
                            placeholder={(userInfo && userInfo.email) || (user && user.email) || null}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId='passwordConfirm'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                        Update
                    </Button>
                </Form>
            </Col>

            <Col>
                <h2 className='text-center'>Purchases</h2>
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant='danger'>{errorOrders}</Message>
                ) : (
                    <Table striped responsive className='table-sm text-center'>
                        <thead>
                            <tr>
                                <th>Date of Purchase</th>
                                <th>Cost of Medicine</th>
                                <th>Paid</th>
                                <th>See Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>
                                        {order.isPaid ? (
                                            <i className='fas fa-check' style={{ color: 'green' }}></i>
                                        ) : (
                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                        )}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button className='btn-sm'>Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    );
}

export default ProfileScreen;
