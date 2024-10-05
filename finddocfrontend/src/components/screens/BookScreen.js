import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorDetails } from "../../actions/doctorActions";
import Loader from '../Loader';
import Message from '../Message';

function BookScreen({ match, location, history }) {
//   const [slt, setSlt] = useState(1);
  const dispatch = useDispatch();
  const slt = location.search ? Number(location.search.split('=')[1]) : 1
  const doctorId = match.params.id
  const doctorDetail = useSelector((state) => state.doctorDetail);
  const { loading, error, doctor } = doctorDetail;

  // Fetch doctor details
  useEffect(() => {
    if (doctorId) {
        dispatch(getDoctorDetails(doctorId, slt))
    }
}, [dispatch, doctorId, slt])

  // Function to handle booking
  const bookHandler = () => {
    const bookingItem = {
      doctorId: doctor.user._id,
      doctorName: doctor.user.name,
      fee: doctor.fee,
      slot: slt,
    };

    history.push(`/confirm/${match.params.id}?slt=${slt}`);
  };

  return (
    <div>
      <Link to="/" className="btn btn-dark my-3">
        Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
         
      <Image src={doctor.image || null} alt={doctor.name || null} style={{ width: '650px', height: '400px' }} fluid />

          </Col>

          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                {/* <h3>Dr. {doctor.user.name}</h3> */}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup variant="flush">

              <ListGroup.Item>
                  <Row>
                    <Col>Dr.:</Col>
                    <Col>
                      <strong>{doctor.user.name}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Booking Fee:</Col>
                    <Col>
                      <strong>${doctor.fee}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {doctor.available && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Remaining Slot:</Col>
                      <Col>{doctor.max_appointments}</Col>
                    </Row>
                  </ListGroup.Item>
                )}


                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    disabled={!doctor.available}
                    type="button"
                    onClick={bookHandler}
                  >
                    Book Appointment
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default BookScreen;
