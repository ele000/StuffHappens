import { Table , Card} from "react-bootstrap";
import dayjs from 'dayjs';
import { useEffect , useState } from "react";
import API from "../API/API.mjs";

function GamesTable({userId}){

  const [history, setHistory] = useState([]);

    useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await buildHistory(userId);
        setHistory(data);
      } catch (error) {
        console.error("Error: Unable to retrieve game history.", error);
        alert("Error: Unable to retrieve game history.");
      }
    };

    fetchHistory();
  }, []);

    return(
        <>
            <div className="d-flex flex-column align-items-center">
                {history.map((h) => (
                    <div key={h.gameId} style={{ width: "90%", marginBottom: "1rem" }}>
                        <GameCard game={h} cards={h.cards} />
                    </div>))}
            </div>
        </>
    )
}

export default GamesTable;

const buildHistory = async (userId) => {
  const games = await API.getGamesByUser(userId);
  const completedGames = games
                        .filter(game => game.completed===1)
                        .sort((a, b) => dayjs(a.date).diff(dayjs(b.date))).reverse();

  const fullHistory = [];

  for (const game of completedGames) {
    const cardsGame = await API.getCardsByGame(game.id);
    const cardsWithInfo = [];

    for (const cardGame of cardsGame) {
      const card = await API.getCardById(cardGame.cardId);
      cardsWithInfo.push({
        cardId: card.id,
        name: card.name,
        round: cardGame.round,
        result: cardGame.result
      });
    }

    cardsWithInfo.sort((a, b) => a.round - b.round);

    fullHistory.push({
      gameId: game.id,
      date: game.date,
      cardsWon: game.cardsWon,
      cards: cardsWithInfo
    });
  }

  return fullHistory;
};

function GameCard(props) {
  return (
    <Card style={{ width: '100%' }}>
      <Card.Body>
        <Card.Title>Game - {dayjs(props.game.date).format('MMMM D, YYYY')}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{props.game.cardsWon===3 ? "✅Result: victory" : "❌Result: defeat"}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">🃏 Total Cards Collected: {props.game.cardsWon+3}</Card.Subtitle>
        <Card.Text>
          <CardsData cards={props.cards}/>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}


function CardsData(props) {
    return (
        <Table hover className="mb-0">
            <thead>
                <tr>
                    <th>Situation</th>
                    <th>Won</th>
                    <th>Round</th>
                </tr>
            </thead>

            <tbody>
                {props.cards.map((c) => (
                    <CardRow key={c.cardId} card={c} />
                ))}
            </tbody>
        </Table>
    );
}


function CardRow(props) {
    return (
        <tr>
            <td>{props.card.name}</td>
            <td>{props.card.result === -1 ? "-" : props.card.result === 1 ? "✅" : "❌"}</td>
            <td>{props.card.round === 0 ? "-" : props.card.round}</td>
        </tr>
    );
}