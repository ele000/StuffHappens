import { Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function LoginRules(props) {
    const [showRules, setShowRules] = useState(false);

    const navigate = useNavigate();

    const handleStartGame = () => {
        navigate('/home/game');
    }

    const handleUserProfile = () => {
        navigate('/home/userProfile');
    }

    return (
     <>
        {showRules ? <GameRules onClose={() => setShowRules(false)} /> : 
        <>
        <div>
            <h3 className="mb-4">Welcome, {props.user.username}!</h3>

            <hr style={{ width: "500px",margin: "20px auto",borderTop: "2px solid #ccc",opacity: 1,}}/>

            <h3 className="mb-4">MAIN MENU</h3>

            <Row className="mb-4 justify-content-center">
                <Button 
                    variant="danger" 
                    style={{ width: "220px" }} 
                    onClick={handleStartGame}
                >
                    🎮 Start Game
                </Button>
            </Row>

            <Row className="mb-4 justify-content-center">
                <Button
                    variant="danger"
                    style={{ width: "220px" }}
                    onClick={handleUserProfile}
                >
                    📜 History
                </Button>
            </Row>

            <Row className="mb-4 justify-content-center">
                <Button
                    variant="danger"
                    style={{ width: "220px" }}
                    onClick={() => setShowRules(true)}
                >
                    📖 Rules
                </Button>
            </Row>

            <Row className="mb-4 justify-content-center">
                <Button
                    variant="danger"
                    style={{ width: "220px" }}
                    onClick={props.handleLogout}
                >
                    🚪 Logout
                </Button>
            </Row>
        </div>
        
        </>
    }
     </>
    )
}

export default LoginRules;



function GameRules({ onClose }) {
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

          {/* BUTTONS */}
          <div className="d-flex justify-content-between mt-2">
            <Button
              variant="outline-secondary"
              onClick={onClose}
            >
                Close
            </Button>
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
}