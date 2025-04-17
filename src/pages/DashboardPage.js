import React from 'react';
import Dashboard from '../components/Dashboard/Dashboard';
import Export from '../components/Export/Export';
import { Container, Row, Col } from 'react-bootstrap';

export default function DashboardPage() {
  return (
    <Container fluid>
      <Row>
        <Col lg={12}>
          <Dashboard />
          <Export />
        </Col>
      </Row>
    </Container>
  );
}
