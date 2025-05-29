import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function ApplicationDetails(props) {
    const title = `${props.isNew ? 'New ' : 'Update'} Application`;
    const apiUrl = process.env.REACT_APP_API_URL;
    const { show, handleClose, handleShow, sendUpdates } = props
    const [validated, setValidated] = useState(false);

    const [formData, setFormData] = useState({
        companyName: '',
        position: '',
        dateApplied: '',
        status: 0
    });

    useEffect(() => {
        setFormData(props.application);
    },  [props.application]);

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        } else {
            try {
                formData.status = parseInt(formData.status) || 1;
                let response = {};
                if (props.isNew) {
                    response = await axios.post(apiUrl + '/applications', formData);
                } else {
                    response = await axios.put(`${apiUrl}/applications/${props.application.id}`, formData);
                }

                alert('\nApplication saved successfully.');
                sendUpdates(response.data);
                handleClose(true);
                console.log('Form data submitted successfully: ', response.data);
            } catch (error) {
                console.error('Error submitting form data: ', error);
            }
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Form validated={validated} onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="app-company-name">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="companyName"
                            autoFocus
                            value={formData.companyName || ""}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter the company name.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="app-position">
                        <Form.Label>Position</Form.Label>
                        <Form.Control
                            type="text"
                            name="position"
                            value={formData.position || ""}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter the position you applied for.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Row>
                        <Col lg={6}>
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select aria-label="app-status" name="status" onChange={handleChange} required>
                                    { props.statuses !== undefined && props.statuses.map((status) => (
                                        <option selected={status.id === formData.status} key={status.id} value={status.id}>{status.name}</option>)
                                    )}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Please select the status of the application.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <Form.Group className="mb-3" controlId="app-date-applied">
                                <Form.Label>Date Applied</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateApplied"
                                    format="DD/MM/YYYY"
                                    value={formData.dateApplied || ""}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter the date you applied.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default ApplicationDetails;