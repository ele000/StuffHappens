import cors from 'cors';
import { Game } from "../../../server/game.mjs";
import { CardsGame } from "../../../server/cardsGame.mjs";
import { Card } from "../../../server/card.mjs";

//GET /api/users/:userId/games
const getGamesByUser = async (userId) => {
    const response = await fetch(`http://localhost:3001/api/users/${userId}/games`);
    if(response.ok){
        const gamesJson = await response.json();
        return gamesJson.map(g => new Game(g.id,g.userId,g.date,g.cardsWon,g.completed));
    }else{
        throw new Error("Internal Server Error");
    }
}

//GET /api/games/:gameId/cards
const getCardsByGame = async (gameId) => {
    const response = await fetch(`http://localhost:3001/api/games/${gameId}/cards`);
    if(response.ok){
        const cardsGameJson = await response.json();
        return cardsGameJson.map(g => new CardsGame(g.id,g.gameId,g.cardId,g.round,g.result));
    }else{
        throw new Error("Internal Server Error");
    }
}

//GET /api/cards/:cardId
const getCardById = async (cardId) => {
    const response = await fetch(`http://localhost:3001/api/cards/${cardId}`);
    if(response.ok){
        const cardJson = await response.json();
        return new Card(cardJson.id, cardJson.name, cardJson.index, cardJson.imageUrl);
    }else{
        throw new Error("Internal Server Error");
    }
}

//GET /api/randomCard
const getRandomCard = async (excludedCards) => {
    const excluded = excludedCards.join(',');
    const response = await fetch(`http://localhost:3001/api/randomCard?excluded=${excluded}`);
    if(response.ok){
        const cardJson = await response.json();
        return new Card(cardJson.id, cardJson.name, cardJson.index, cardJson.imageUrl);
    }else{
        throw new Error("Internal Server Error");
    }
}

//POST //POST /api/games/add
const addGame = async(game) => {
    try{
        const response = await fetch("http://localhost:3001/api/games/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(game)
        });

        if(response.ok){
            const game =await response.json();
            return game;
        }else{
            throw new Error(`Server responded with ${response.status}`);
        }
    }catch(error){
        throw error;
    }
}

//POST /api/cardsGame/add
const addCardsGame = async(cardsGame) => {
    try{
        const response = await fetch("http://localhost:3001/api/cardsGame/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(cardsGame)
        });

        if(response.ok){
            const cardsGame = await response.json();
            return cardsGame;
        }else{
            throw new Error(`Server responded with ${response.status}`);
        }
    }catch(error){
        throw error;
    }
}

//PUT /api/games/:gameId/update
const updateGame = async (gameId,nextCardsWon,nextCompleted) => {
    try{
        const response = await fetch(`http://localhost:3001/api/games/${gameId}/update` , {
            method: 'PUT',
            headers: {
                    'Content-Type': 'application/json'
                },
            credentials: 'include',
            body: JSON.stringify({cardsWon: nextCardsWon, completed: nextCompleted})
        })

        if(response.ok){
            return await response.json();
        }else{
            throw new Error(`Server responded with ${response.status}`);
        }
    }catch(err){
        throw err;
    }
}


//POST /api/session
const login = async(credentials) => {
    const response = await fetch("http://localhost:3001/api/session" , {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });

    if(response.ok){
        const user = await response.json();
        return user;
    }else{
        const err = await response.text();
        throw err;
    }
}

//GET /api/sessions/current
const getUserInfo = async () => {
  const response = await fetch("http://localhost:3001/api/sessions/current" , {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  
  }
};

//DELETE /api/sessions/current
const logout = async() => {
  const response = await fetch("http://localhost:3001/api/sessions/current", {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}


const API = { getGamesByUser , getCardsByGame , getCardById , getRandomCard , addGame, addCardsGame ,updateGame, login , logout , getUserInfo};
export default API;


