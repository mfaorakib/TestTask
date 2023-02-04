import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useParams } from "react-router-dom";
// import { useHistory } from 'react-router-dom';
import './Home.css'
import { Form, FormGroup, FormControl, Button, Row, Col, Container, Table } from "react-bootstrap";

function Home() {
  const [name, setName] = useState('');
  const [sectors, setSectors] = useState('');
  const [options, setOptions] = useState([])
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(1);
  const [singleWorker, setsingleWorker] = useState({})
  const [members, setmembers] = useState([]);
  const [formData, setFormData] = useState({});
  // All Sector Members details API Call For Table
  useEffect(() => {
    axios.get('http://localhost:8000/workers')
      .then(res => setmembers(res.data))
      .catch(err => console.log(err));
  }, []);


  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleOptionChange = (event) => {
    setSectors(event.target.value);

  };
  const handleCheckboxChange = (event) => {
    setTermsAgreed(event.target.checked);

  };

  // All Sectors Options Call form API
  useEffect(() => {
    axios.get('http://localhost:8000/sectors')
      .then(res => setOptions(res.data))
      .catch(err => console.log(err));
  }, []);


  // Post Single Worker Data
  const handleSubmit = (event) => {

    event.preventDefault();

    if (!name) {
      setError('Please enter your name');
    } else if (!sectors) {
      setError('Please select an Sector');
    } else if (!termsAgreed) {
      setError('Please agree to the terms');
    }
    else {
      setError('');
      setForm(2)
      const data = {
        name: name,
        sector: sectors,
        terms: termsAgreed
      };
      axios
        .post("http://localhost:8000/workers", data)
        .then(function (response) {
          console.log("post Data", response.data);
          window.location.reload();
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    
  };

  //Single Member Details API Call 
  const SubmitWorker = (id) => {
    setForm(2)
    axios.get(`http://localhost:8000/workers/${id}`)

      .then(res => {
        const [worker] = res.data
        setsingleWorker(worker)
      })
      .catch(err => console.log(err))
  }
  const id = singleWorker.id
  const handleUpdateSubmit = (event) => {
    event.preventDefault();

    if (!singleWorker.name) {
      setError('Retype or Update your name');
    } else if (!singleWorker.sector) {
      setError('Reselect or Update Your Sector');
    } else if (!termsAgreed) {
      setError('Please agree to the terms');
    }
    else {
      setError('');
      const data = {
        name: name || singleWorker.name,
        sector: sectors || singleWorker.sector,
        terms: termsAgreed
      };
      console.log("Update Data", data)
      axios
        .put(`http://localhost:8000/update/${id} `, data)
        .then(function (response) {
          console.log("put Data", response.data);
          window.location.reload();
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    
  }

  return (
    <Container fluid>
      <Row fluid>
        <Col xs={12} md={6} fluid>
          <Container fluid>
            <p className='h3 mt-3 mb-3'>Please enter your name and pick the Sectors you are currently involved in.</p>
            <Row className="justify-content-md-center mb-3">
              <Col md={8} fluid>
                {form === 1 && (
                  <Form onSubmit={handleSubmit}>
                    <FormGroup className='mb-3 mt-3'>
                      <FormControl
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={handleNameChange}
                      />
                    </FormGroup>
                    <FormGroup className='mb-3'>
                      <FormControl as="select" value={sectors} onChange={handleOptionChange}>
                        <option value=""> Select One Sector </option>

                        {
                          options.map((option) => (
                            <option key={option.id} value={option.name}>{option.name}</option>
                          ))
                        }
                      </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formBasicCheckbox" className='mb-3'>
                      <Form.Check
                        type="checkbox"
                        label="Agree to terms"
                        checked={termsAgreed}
                        onChange={handleCheckboxChange}
                      />
                    </FormGroup>
                    {error && <p className='danger'>{error}</p>}
                    <Button variant="primary" type="submit">
                      Save
                    </Button>
                  </Form>
                )}
                {form === 2 && (
                  <Form onSubmit={handleUpdateSubmit}>
                    <FormGroup className='mb-3 mt-3'>
                      <FormControl type="text"
                        value={name || singleWorker.name}
                        onChange={handleNameChange} />
                    </FormGroup>
                    <FormGroup>
                      <FormControl as="select" value={sectors} onChange={handleOptionChange}>
                        <option value={singleWorker.sector}>{"" || singleWorker.sector}</option>
                        {
                          options.map((option) => (
                            <option key={option.id} value={option.name}>{option.name}</option>
                          ))
                        }
                      </FormControl>
                    </FormGroup>

                    <FormGroup controlId="formBasicCheckbox" className='mb-3'>
                      <Form.Check
                        type="checkbox"
                        label="Agree to terms"
                        checked={termsAgreed}
                        onChange={handleCheckboxChange}
                      />
                    </FormGroup>

                    {error && <p className='danger'>{error}</p>}
                    <button className='btn btn-info' type="submit">Update</button>
                  </Form>)}
              </Col>
            </Row>
          </Container>
        </Col>
        <Col xs={12} md={6} fluid>
          <p className='h3 m-4'>Workers Data </p>
          <Table striped bordered hover fluid>
            <thead>
              <tr>

                <th>Name</th>
                <th>Sector</th>
                <th>Action </th>
              </tr>
            </thead>
            <tbody>
              {
                members.map((member) =>
                  <tr key={member.id}>

                    <td >{member.name}</td>
                    <td >{member.sector}</td>
                    <td><button className='btn btn-info' onClick={() => { SubmitWorker(member.id) }}>Edit</button>  </td>
                  </tr>
                )
              }

            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )

}


export default Home