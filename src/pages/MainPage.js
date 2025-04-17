import React from 'react';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import TaggingInterface from '../components/TaggingInterface/TaggingInterface';
import Timeline from '../components/Timeline/Timeline';
import Dashboard from '../components/Dashboard/Dashboard';
import { Container, Row, Col } from 'react-bootstrap';

export default function MainPage() {

  return (
    <Container fluid>
      <Row>
        <Col lg={6}>
          <VideoPlayer />
          <Timeline />
        </Col>
        <Col lg={6}>
          <TaggingInterface />
          <Dashboard />
        </Col>
      </Row>
    </Container>
  );
}
