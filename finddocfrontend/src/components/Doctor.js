import React from "react";
import { Card, Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Doctor({ doctor }) {
  return (
      <Card className="my-3 p-3 rounded ">
       <Link to={`/doctor/${doctor.user._id}`}>
        <Card.Img src={doctor.image} style={{ width: '250px', height: '150px' }} />
        </Link>


        <Card.Body>
            <Card.Title as="div">
              <h3>Dr. {doctor.user.name}</h3>
            </Card.Title>

          <Card.Text as="div">
            <p>Specialty: {doctor.specialization || "N/A"}</p>
          </Card.Text>
          
          <Button variant="primary" as={Link} to={`/doctor/${doctor.user._id}`}>
            View Profile
          </Button>
        </Card.Body>
      </Card>
  );
}

export default Doctor;