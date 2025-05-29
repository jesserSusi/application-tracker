import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import ApplicationDetails from "./ApplicationDetails";
import axios from "axios";

let app = {};

function ApplicationList(props) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [applications, setApplications] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        app = {}
    }
    const handleShow = () => setShow(true);
    const handleUpdates = (data) => {
        var index =  applications.findIndex(application => application.id === data.id);

        if (index > -1) {
            applications[index] = data;
            setApplications([...applications]);
        }
        else {
            setApplications([...applications, data]);
        }
    };

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(apiUrl + "/applications");
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching data:', error); // Handle errors
            }
        };
        const fetchStatuses = async () => {
            try {
                const response = await axios.get(apiUrl + "/statuses");
                setStatuses(response.data);
            } catch (error) {
                console.error('Error fetching data:', error); // Handle errors
            }
        };
        fetchApplications();
        fetchStatuses();
    }, []);

    return (
        <>
            <Row>
                <Col lg={2} />
                <Col lg={8}>
                    <ApplicationDetails isNew={(app.id ? false : true)} application={app} statuses={statuses} show={show}
                                        handleClose={handleClose} handleShow={handleShow} sendUpdates={handleUpdates} setValidated={false}/>
                    <h2>Applications</h2>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Position</th>
                            <th>Status</th>
                            <th>Date Applied</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {applications !== [] && applications.map((application) => (
                            <tr key={application.id}>
                                <td>{application.companyName}</td>
                                <td>{application.position}</td>
                                <td>{statuses.find(x => x.id == application.status).name}</td>
                                <td>{formatDate(application.dateApplied)}</td>
                                <td align="center">
                                    <Button variant="link" onClick={() => {
                                        app = application; handleShow()}  }>
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    <Row>
                        <Col lg={3} sm={5}>
                            <Button variant="primary" onClick={() => handleShow()}>
                                Add New Application
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col lg={2} />
            </Row>
        </>
    )
}

function formatDate(date) {
    let newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
}

export default ApplicationList;