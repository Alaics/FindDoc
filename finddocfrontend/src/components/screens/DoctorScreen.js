import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import Loader from "../Loader";
import Message from "../Message";
import { useDispatch, useSelector } from "react-redux";
import {
  getDoctorDetails,
  createDoctorReview,
} from "../../actions/doctorActions";
import { createAppointment } from "../../actions/createAppointment";
import Rating from "../Rating";
import { DOCTOR_CREATE_REVIEW_RESET } from "../../constants/doctorConstants";

function DoctorScreen() {
  const { id } = useParams();
  const history = useHistory(); // Using useHistory to navigate
  const dispatch = useDispatch();

  const doctorDetail = useSelector((state) => state.doctorDetail);
  const { loading, error, doctor } = doctorDetail;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const appointmentCreate = useSelector((state) => state.appointmentCreate);
  const { loading: loadingAppointment, error: errorAppointment } = appointmentCreate;

  useEffect(() => {
    dispatch(getDoctorDetails(id)); // Directly using id
  }, [dispatch, id]);

  const bookHandler = async () => {
    try {
      console.log("Creating appointment for doctor ID:", id);
      await dispatch(createAppointment({ doctorId: id, appointmentTime: new Date() }));
      history.push(`/confirmation`);
    } catch (error) {
      console.error("Failed to create appointment", error);
      // Optionally show an error message here
    }
  };

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const doctorReviewCreate = useSelector((state) => state.doctorReviewCreate);
  const {
    success: successDoctorReview,
    loading: loadingDoctorReview,
    error: errorDoctorReview,
  } = doctorReviewCreate;

  useEffect(() => {
    if (successDoctorReview) {
      setRating(0);
      setComment("");
      dispatch({ type: DOCTOR_CREATE_REVIEW_RESET });
    }

    dispatch(getDoctorDetails(id));
  }, [dispatch, id, successDoctorReview]);

  const submitReviewHandler = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide a rating and a comment.");
      return;
    }
    dispatch(createDoctorReview(id, { rating, comment }));
  };

  return (
    <div>
      <Link to="/" className="btn btn-dark my-3">
        Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          An error occurred. Please try again later.
        </Message>
      ) : (
        doctor && (
          <>
            <Row>
              <Col md={6}>
                {doctor.image ? (
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    style={{ width: "650px", height: "400px" }}
                    fluid
                  />
                ) : (
                  <div>No image available</div>
                )}
              </Col>

              <Col md={3}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>Dr. {doctor.name}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Specialization: {doctor.specialization || "N/A"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Description: {doctor.description || "No description available."}
                  </ListGroup.Item>
                </ListGroup>
              </Col>

              <Col md={3}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Booking Fee:</Col>
                        <Col>
                          <strong>${doctor.fee || "N/A"}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {doctor.available ? "Available" : "Not Available"}
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      {loadingAppointment && <Loader />}
                      {errorAppointment && (
                        <Message variant="danger">{errorAppointment}</Message>
                      )}
                      <Button
                        className="btn-block"
                        disabled={!doctor.available || loadingAppointment}
                        type="button"
                        onClick={bookHandler}
                      >
                        Consult
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <h4 className="mt-3">Reviews</h4>

                {doctor.reviews.length === 0 && (
                  <Message variant="info">No Reviews</Message>
                )}

                <ListGroup variant="flush">
                  {doctor.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} color="f8e825" />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}

                  <ListGroup.Item>
                    <h4>Write a Review</h4>

                    {loadingDoctorReview && <Loader />}
                    {successDoctorReview && (
                      <Message variant="success">Review Submitted</Message>
                    )}
                    {errorDoctorReview && (
                      <Message variant="danger">{errorDoctorReview}</Message>
                    )}

                    {userInfo ? (
                      <Form onSubmit={submitReviewHandler}>
                        <Form.Group controlId="rating">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as="select"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="comment">
                          <Form.Label>Review</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows="5"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </Form.Group>

                        <Button
                          disabled={loadingDoctorReview}
                          type="submit"
                          variant="primary"
                          className="my-3"
                        >
                          Submit
                        </Button>
                      </Form>
                    ) : (
                      <Message variant="info">
                        Please <Link to="/login">Login</Link> to write a review.
                      </Message>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </>
        )
      )}
    </div>
  );
}

export default DoctorScreen;
