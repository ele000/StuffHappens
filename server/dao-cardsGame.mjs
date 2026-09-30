import { db } from "./db.mjs";
import { CardsGame } from "./cardsGame.mjs";

export const getCardsByGame = (gameId) => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM cardsGame WHERE cardsGame.gameId=?";
        db.all(sql , [gameId] , (err,rows) => {
            if(err){
                reject(err);
            }else{
                const cards = rows.map(c => new CardsGame(c.id,c.gameId,c.cardId,c.round,c.result));
                resolve(cards);
            }
        });
    });
}

export const addCardsGame = (cardsGame) => {
    return new Promise((resolve,reject) => {
        const sql = "INSERT INTO cardsGame(gameId,cardId,round,result) VALUES(?,?,?,?)";
        db.run(sql , [cardsGame.gameId,cardsGame.cardId,cardsGame.round,cardsGame.result] , function(err){
            if(err){
                reject(err);
            }else{
                cardsGame.id=this.lastID;
                resolve(cardsGame);
            }
        });
    });
}