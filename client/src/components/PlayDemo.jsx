import { useEffect, useState } from "react";
import { Col, Figure, Row, Button, Card } from "react-bootstrap";
import API from "../API/API.mjs";
import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import { useNavigate } from 'react-router';
import Timer from "./Timer";

function PlayDemo(){

    const [playStatus, setPlayStatus] = useState('startRound');
    const [currentCard, setCurrentCard] = useState({});
    const [ownedCard, setOwnedCard] = useState([]);
    const [playedCards, setPlayedCards] = useState([]);
    const [roundStatus, setRoundStatus] = useState(null);

    useEffect(() => {
        fetchInitialCards();
    }, []);

    const fetchInitialCards = async () => {
        try {
            let newCards = [];
            let excludedId = [];
            for (let i = 0; i < 3; i++) {
                const card = await API.getRandomCard(excludedId);
                newCards.push(card);
                excludedId.push(card.id);
            }
            newCards.sort((a, b) => a.index - b.index);
            setOwnedCard(newCards);
            setPlayedCards(excludedId);
        } catch (err) {
            console.log("Error loading initial cards : ", err);
            alert("Error loading initial cards");
        }
    };

    const handleButtonNextRound = async () => {
        try {
            const newCard = await API.getRandomCard(playedCards);
            setCurrentCard(newCard);

            setRoundStatus(null);
            setPlayStatus('game');
        } catch (err) {
            console.log("Error loading current card : ", err);
            alert("Error loading current card");
        }
    };

    const handleGuess = (index) => {
        let guess;

        if (index === null) {
            guess = 'lost';
        } else if (index === 0) {
            guess = currentCard.index < ownedCard[0].index ? 'won' : 'lost';
        } else if (index === ownedCard.length) {
            guess = currentCard.index > ownedCard[ownedCard.length - 1].index ? 'won' : 'lost';
        } else {
            guess = (currentCard.index > ownedCard[index - 1].index && currentCard.index < ownedCard[index].index) ? 'won' : 'lost';
        }

        if (guess === 'won') {
            const cards = [...ownedCard];
            cards.push(currentCard);
            cards.sort((a, b) => a.index - b.index);
            setOwnedCard(cards);
        }

        setRoundStatus(guess);
        setPlayStatus('end');
    };

    return (
        <>
            {playStatus === 'game' && <PlayGame cards={ownedCard} handleButtonNextRound={handleButtonNextRound} currentCard={currentCard} handleGuess={handleGuess} />}
            {playStatus === 'end' && <GameRecap cards={ownedCard} roundStatus={roundStatus} currentCard={currentCard} />}
            {playStatus === 'startRound' && <StartRound roundStatus={roundStatus} handleButtonNextRound={handleButtonNextRound} currentCard={currentCard} />}
        </>
    );
}

export default PlayDemo;

function PlayGame(props) {
    return (
        <>
            <Row>
                <Col xs={3}>
                    <Button
                        variant="danger"
                        size="lg"
                        disabled
                        style={{
                            backgroundColor: "#ff0000",
                            borderColor: "#ff0000",
                            opacity: 1
                        }}
                    >
                        DEMO
                    </Button>
                </Col>
                <Col xs={6}>
                    <Figure>
                        <Figure.Image
                            width={125}
                            height={138}
                            src={`http://localhost:3001/${props.currentCard.imageUrl}`}
                        />
                        <Figure.Caption style={{color: "black", fontSize: "1.2rem"}}>{props.currentCard.name}</Figure.Caption>
                    </Figure>
                </Col>
                <Col xs={3}><Timer round={1} onTimeout={() => props.handleGuess(null)} /></Col>
            </Row>

            <Row className="justify-content-center align-items-start mt-4">
                <Col xs="auto" className="text-center">
                    <Button variant="danger" size="sm" onClick={() => props.handleGuess(0)}>
                        <i className="bi bi-arrow-down"></i>
                    </Button>
                </Col>

                {props.cards.map((card, index) => (
                    <React.Fragment key={card.id}>
                        <Col xs="auto" className="text-center">
                            <Card
                                className="shadow-sm"
                                style={{
                                    width: "230px",
                                    height: "380px"
                                }}
                            >
                                <Card.Header className="p-1 fw-bold">
                                    {card.index}
                                </Card.Header>

                                <Card.Img
                                    src={`http://localhost:3001/${card.imageUrl}`}
                                    alt={card.name}
                                    style={{
                                        height: "160px",
                                        objectFit: "cover"
                                    }}
                                />

                                <Card.Body
                                    className="p-1"
                                    style={{ overflowY: "auto" }}
                                >
                                    <Card.Title className="fs-6 mb-1">
                                        {card.name}
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xs="auto" className="text-center">
                            <Button variant="danger" size="sm" onClick={() => props.handleGuess(index + 1)}>
                                <i className="bi bi-arrow-down"></i>
                            </Button>
                        </Col>
                    </React.Fragment>
                ))}
            </Row>
        </>
    );
}





function StartRound(props) {
    return (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <Button variant="danger" onClick={props.handleButtonNextRound}>Click here to start a new Round</Button>
        </div>
    );
}

function GameRecap(props) {
    const navigate = useNavigate();

    const handleExit = () => {
        navigate('/demo');
    };

    return (
        <>
            <Row>
                <h2>{props.roundStatus === 'won' ? 'YOU WON THE DEMO ROUND' : 'YOU LOST THE DEMO ROUND'}</h2>
            </Row>
            <Row className="justify-content-center align-items-start mt-4">
                {props.cards.map((card) => (
                    <React.Fragment key={card.id}>
                        <Col xs="auto" className="text-center">
                            <Card
                                className="shadow-sm"
                                style={{
                                    width: "220px",
                                    height: "410px"
                                }}
                            >
                                <Card.Header className="p-1 fw-bold">
                                    {card.index}
                                </Card.Header>

                                <Card.Img
                                    src={`http://localhost:3001/${card.imageUrl}`}
                                    alt={card.name}
                                    style={{
                                        height: "160px",
                                        objectFit: "cover"
                                    }}
                                />

                                <Card.Body
                                    className="p-1"
                                    style={{ overflowY: "auto" }}
                                >
                                    <Card.Title className="fs-6 mb-1">
                                        {card.name}
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    </React.Fragment>
                ))}
            </Row>
            <Button variant="danger" className="mt-3" onClick={handleExit}>Exit</Button>
        </>
    );
}