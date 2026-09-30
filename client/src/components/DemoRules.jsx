
import { Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";

function DemoRules() {
  const navigate = useNavigate();

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100%",
        padding: "0.35rem",
      }}
    >
      <Card
        className="shadow border-0"
        style={{
          maxWidth: "860px",
          width: "100%",
          overflow: "hidden",
          fontSize: "0.92rem",
        }}
      >
        <Card.Body className="p-2">

          {/* HEADER */}
          <div className="text-center mb-2">
            <h2 className="fw-bold mb-0" style={{ fontSize: "1.35rem" }}>🎮 Game Rules</h2>
          </div>

          {/* MISSION */}
          <Card
            className="mb-2 border-0"
            style={{ backgroundColor: "#f1f3f5", fontSize: "0.94rem" }}
          >
            <Card.Body className="py-1 px-2">
              <strong>🎯 Mission:</strong> Collect 6 horrible cards
            </Card.Body>
          </Card>

          {/* RULES GRID (COMPATTO) */}
          <Row className="g-2">

             <Col xs={12} md={6}>
              <Card className="h-100">
                <Card.Body className="py-2" style={{ fontSize: "0.9rem" }}>
                  🃏 <strong>Starting the game</strong><br />
                  You begin with 3 cards already sorted from least to most
                  unfortunate. You can see both the situation and its value.
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100">
                <Card.Body className="py-2">
                  🤔 <strong>New card</strong><br />
                  Each round, a new card appears. Its value is hidden, and
                  you have 30 seconds to choose the correct position.
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100">
                <Card.Body className="py-2">
                  ⚖️ <strong>Outcome</strong><br />
                  If correct, the card is added to your collection.
                  If wrong or time runs out, the card is discarded.
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100">
                <Card.Body className="py-2">
                  🏆 You win by correctly placing 3 cards<br />
                  💀 You lose after 3 mistakes
                </Card.Body>
              </Card>
            </Col>

          </Row>

          {/* ALERT */}
          <Alert variant="warning" className="mt-2 py-1 mb-2">
            <strong>Demo:</strong> only 1 round
          </Alert>

          {/* BUTTONS */}
          <div className="d-flex justify-content-between mt-2">
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/")}
            >
              Back
            </Button>

            <Button
              variant="danger"
              onClick={() => navigate("/demo/game")}
            >
              Start Game
            </Button>
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default DemoRules;
