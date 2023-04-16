import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import './App.css';
import './style.css';

function App() {
  const [users, setUsers] = useState([]);
  const [nextLink, setNextLink] = useState('');
  const [prevLink, setPrevLink] = useState('');
  const [details, detailsUser] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [showDetails, setShowDetails] = useState([]);


  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async (since = '') => {
    try {
      const response = await axios.get(`http://localhost:9000/api/users?since=${since}`);
      setUsers(response.data.users);
      setNextLink(response.data.nextLink);
      setPrevLink(response.data.prevLink);
    } catch (error) {
      console.error(error);
    }
  };

  const detailUser = async (username) => {
    try {
      const response = await axios.get(`http://localhost:9000/api/users/${username}`);
      setSelectedUser(response.data);
      detailsUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getRepos = async (username) => {
    try {
      detailUser(username)
      const response = await axios.get(`http://localhost:9000/api/user/repos?username=${username}`);
      setRepos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetailsClick = async (user) => {
    setSelectedUser(user);
    getRepos(user.login);
    const index = showDetails.findIndex((detail) => detail === user.id);
    if (index > -1) {
      setShowDetails([...showDetails.slice(0, index), ...showDetails.slice(index + 1)]);
    } else {
      setShowDetails([...showDetails, user.id]);
    }
  };
  

  return (
    <Container fluid>
      <Row className="header">
        <Col>
          <h1>GitHub Users</h1>
          <p className='hire'>#hire me Shaw and Partners</p>
        </Col>
      </Row>
      <Row className="content main-content">
        <Col md={8} className="users-table">
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Login</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <React.Fragment key={user.id}>
                  <tr>
                    <td>{user.id}</td>
                    <td>{user.login}</td>
                    <td>
                      <Button className='style-button' variant="primary" onClick={() => handleDetailsClick(user)}>
                        {showDetails[user.id] ? 'Hide Details' : 'Show Details'}
                      </Button>
                    </td>
                  </tr>
                  {selectedUser && selectedUser.id === user.id && showDetails.includes(user.id) && (
                    <tr className='maaa'>
                      <td colSpan={3}>
                        <Row className="user-details">
                          <Col>
                            <h2>{details.login}</h2>
                            <p>ID: {details.id}</p>
                            <p>Profile URL: {details.html_url}</p>
                            <p>Created At: {details.created_at}</p>

                          </Col>
                        </Row>
                        <Row className="user-details user-details1">
                          <Col>
                            <Table striped bordered hover variant="dark">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Repo Name</th>
                                  <th>URL</th>
                                </tr>
                              </thead>
                              <tbody>
                                {repos.map((repo) => (
                                  <tr key={repo.id}>
                                    <td>{repo.id}</td>
                                    <td>{repo.name}</td>
                                    <td>
                                      <a href={repo.html_url}>{repo.html_url}</a>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Col>
                        </Row>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
          <div class="pagination-container">
          <Pagination>
            {prevLink && (
              <Pagination.Item
                onClick={() => getUsers(prevLink.split('=')[1])}
                className='previous'
                
              >

            <span className='previous'> 
                Previous
                </span>
              </Pagination.Item>
            )}
            {nextLink && (
              <Pagination.Item
                onClick={() => getUsers(nextLink.split('=')[1])}
                className='next'
              >
                <span className='next'>
                  Next
                </span>
              </Pagination.Item>
            )}
          </Pagination>
          </div>

        </Col>
      </Row>
    </Container>
  );
}

export default App;
