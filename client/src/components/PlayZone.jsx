import { useEffect, useState, useRef } from "react";
import { Col, Figure, Row, Button, Card } from "react-bootstrap";
import API from "../API/API.mjs";
import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import { useNavigate } from 'react-router';
import dayjs from "dayjs";
import { Game } from "../../../server/game.mjs";
import { CardsGame } from "../../../server/cardsGame.mjs";
import Timer from "./Timer";

function PlayZone(props){

    const [round,setRound] = useState(0);
    const [playStatus,setPlayStatus] = useState('startRound');
    const [currentCard,setCurrentCard] = useState({});
    const [ownedCard,setOwnedCard] = useState([]);
    const [playedCards,setPlayedCards] = useState([]);
    const [roundsLost,setRoundLost] = useState(0);
    const [roundsWon,setRoundsWon] = useState(0);
    const [completed,setCompleted] = useState(0);
    const [gameId,setGameId] = useState();
    const [roundStatus,setRoundStatus] = useState(null);
    const [loading,setLoading] = useState(true);

    const initialize = useRef(false)

    useEffect(() => {
        if (!initialize.current) {
            initialize.current = true;
            fetchInitialCards();
        }
    }, []);

    const fetchInitialCards = async () => {
        try {
            setLoading(true);
            const game = new Game(null, props.user.id, dayjs().format('YYYY-MM-DD'), 0, 0);
            const newGame = await API.addGame(game);
            setGameId(newGame.id);
            setCompleted(0);

            let newCards = [];
            let excludedId = [];
            for (let i = 0; i < 3; i++) {
                const card = await API.getRandomCard(excludedId);
                newCards.push(card);
                excludedId.push(card.id);

                const cardsGame = new CardsGame(null, newGame.id, card.id, 0, -1);
                await API.addCardsGame(cardsGame);
            }

            newCards.sort((a, b) => a.index - b.index);
            setOwnedCard(newCards);
            setPlayedCards(excludedId);

            setLoading(false);
        } catch (err) {
            console.log("Error loading initial cards : ", err);
            alert("Error loading initial cards");
        }
    }

    const handleButtonNextRound = async () => {
        try {
            let newRoundsWon = roundsWon;
            let newRoundsLost = roundsLost;
            let newOwnedCard = [...ownedCard];

            if (roundStatus === 'won') {
                const cardsGame = new CardsGame(null, gameId, currentCard.id, round, 1);
                await API.addCardsGame(cardsGame);
                newRoundsWon += 1;
                newOwnedCard.push(currentCard);
                newOwnedCard.sort((a, b) => a.index - b.index);
                setOwnedCard(newOwnedCard);
                setRoundsWon(newRoundsWon);
            } else if (roundStatus === 'lost') {
                const cardsGame = new CardsGame(null, gameId, currentCard.id, round, 0);
                await API.addCardsGame(cardsGame);
                newRoundsLost += 1;
                setRoundLost(newRoundsLost);
            }

            const p = [...playedCards, currentCard.id];
            setPlayedCards(p);

            if (newRoundsWon === 3 || newRoundsLost === 3) {
                setCompleted(1);
                await API.updateGame(gameId, newRoundsWon, 1);
                setPlayStatus('end');
            } else {
                const newCard = await API.getRandomCard(p);
                setCurrentCard(newCard);

                const nextRound = round + 1;

                setRound(nextRound);
                setRoundStatus(null);
                setPlayStatus('game');
                let now = dayjs();
            }
        } catch (err) {
            console.log("An error occurred while setting up the round : ", err);
            alert("An error occurred while setting up the round");
        }
    }

    const handleGuess = async (index) => {
        try {
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

            setRoundStatus(guess);
            setPlayStatus('startRound');
        } catch (err) {
            console.log("An error occurred : ", err);
            alert("An error occurred at the end of the round");
        }
    }

    return (
        <>
            {loading ? (
                <h2>Loading game...</h2>
            ) : (
                <>
                    {playStatus === 'game' && <PlayGame cards={ownedCard} round={round} roundsLost={roundsLost} handleButtonNextRound={handleButtonNextRound} currentCard={currentCard} handleGuess={handleGuess} />}
                    {playStatus === 'end' && <GameRecap cards={ownedCard} roundsWon={roundsWon} currentCard={currentCard} />}
                    {playStatus === 'startRound' && <StartRound roundStatus={roundStatus} handleButtonNextRound={handleButtonNextRound} currentCard={currentCard} completed={completed} />}
                </>
            )}
        </>
    )
}

export default PlayZone;

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
                        ROUND {props.round}
                    </Button>
                    <div className="mt-2" aria-label={`${3 - props.roundsLost} lives remaining`}>
                        {Array.from({ length: 3 }, (_, lifeIndex) => (
                            <i
                                key={lifeIndex}
                                className="bi bi-heart-fill mx-1"
                                style={{
                                    color: lifeIndex >= 3 - props.roundsLost ? "#808080" : "#ff0000",
                                    fontSize: "1.75rem"
                                }}
                            ></i>
                        ))}
                    </div>
                </Col>
                <Col xs={6}>
                    <Figure>
                        <Figure.Image
                            width={125}
                            height={138}
                            src={`http://localhost:3001/${props.currentCard.imageUrl}`}
                        />
                        <Figure.Caption style={{color: "black",fontSize: "1.2rem"}}>{props.currentCard.name}</Figure.Caption>
                    </Figure>
                </Col>
                <Col xs={3}>
                    <Timer round={props.round} onTimeout={() => props.handleGuess(null)} />
                </Col>
            </Row>

            <Row className="justify-content-center align-items-start mt-4">
                <Col xs="auto" className="text-center">
                    <Button variant="danger" size="sm" onClick={() => props.handleGuess(0)}>
                        <i className="bi bi-arrow-down"></i>
                    </Button>
                </Col>

      {/*
        {props.cards.map((card,index) => (
          <React.Fragment key={card.id}>
            <Col xs="auto" className="text-center">
              <Figure style={{ width: "100px" }}>
                <Figure.Caption
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  {card.index}
                </Figure.Caption>

                <Figure.Image
                  width={100}
                  height={105}
                  src={`http://localhost:3001/${card.imageUrl}`}
                  alt={card.name}
                />

                <Figure.Caption
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                >
                  {card.name}
                </Figure.Caption>
              </Figure>
            </Col>

            <Col xs="auto" className="text-center">
              <Button variant="danger" size="sm" onClick={() => props.handleGuess(index+1)}>
                <i className="bi bi-arrow-down"></i>
              </Button>
            </Col>
          </React.Fragment>
        ))}
          */}

          {props.cards.map((card, index) => (
            <React.Fragment key={card.id}>
              <Col xs="auto" className="text-center">
                <Card 
                  className="shadow-sm"
                                    style={{
                                        width: "220px",
                                        height: "420px"
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

                    <Card.Text
                      className="mb-0 lh-sm"
                      style={{
                        fontSize: "0.75rem"
                      }}
                    >
                      {card.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs="auto" className="d-flex align-items-center">
                <Button 
                  variant="danger"
                  size="sm"
                  onClick={() => props.handleGuess(index + 1)}
                >
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
        <>
            {props.roundStatus === 'won' && (
                <div className="text-center">
                    <h2>
                        You won this card 
                        <i 
                            className="bi bi-emoji-smile-fill ms-2" 
                            style={{ color: 'orange' }}
                        ></i>
                    </h2>

                    <Card 
                        className="mx-auto shadow"
                        style={{ width: "300px" }}
                    >
                        <Card.Header className="fw-bold">
                            {props.currentCard.index}
                        </Card.Header>

                        <Card.Img
                            src={`http://localhost:3001/${props.currentCard.imageUrl}`}
                            alt={props.currentCard.name}
                            style={{
                                height: "280px",
                                objectFit: "cover"
                            }}
                        />

                        <Card.Body className="p-2">
                            <Card.Title>
                                {props.currentCard.name}
                            </Card.Title>
                        </Card.Body>
                    </Card>
                </div>
            )}
            {props.roundStatus === 'lost' && (
                <div className="text-center">
                    <h2>
                        You lost this card 
                        <i 
                            className="bi bi-emoji-frown-fill ms-2" 
                            style={{ color: 'orange' }}
                        ></i>
                    </h2>

                    <Card 
                        className="mx-auto shadow"
                        style={{ width: "300px" }}
                    >
                        <Card.Img
                            src={`http://localhost:3001/${props.currentCard.imageUrl}`}
                            alt={props.currentCard.name}
                            style={{
                                height: "280px",
                                objectFit: "cover"
                            }}
                        />

                        <Card.Body className="p-2">
                            <Card.Title>
                                {props.currentCard.name}
                            </Card.Title>
                        </Card.Body>
                    </Card>
                </div>
            )}
            <div className="d-flex justify-content-center align-items-center mt-5">
                <Button variant="danger" onClick={props.handleButtonNextRound}>
                    Click here to start a new Round
                </Button>
            </div>
        </>
    )
}

function GameRecap(props) {
    const navigate = useNavigate();

    const handleExit = () => {
        navigate('/home');
    }

    return (
        <>
            <Row>
                <h2>{props.roundsWon === 3 ? 'YOU WON THE GAME' : 'YOU LOST THE GAME'}</h2>
            </Row>
            <Row className="justify-content-center align-items-start mt-4">
                {props.cards.map((card, index) => (
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

                                    <Card.Text
                                        className="mb-0 lh-sm"
                                        style={{
                                            fontSize: "0.75rem"
                                        }}
                                    >
                                        {card.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </React.Fragment>
                ))}
            </Row>

            <Button variant="danger" className="mt-3" onClick={handleExit}>Exit Game</Button>
        </>
    )
}