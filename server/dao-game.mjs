import { db } from "./db.mjs";
import { Game } from "./game.mjs";

export const getGameById = (id) => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM games WHERE games.id=?";
        db.get(sql , [id] , (err,row) => {
            if(err){
                reject(err);
            } else if (row===undefined) {
                resolve({error: "Game not found"});
            }else{
                const game = new Game(row.id,row.userId,row.date,row.cardsWon,row.completed);
                resolve(game);
            }
        });
    });
}

export const getGamesByUser = (userId) => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM games WHERE games.userId=?";
        db.all(sql , [userId] , (err,rows) => {
            if(err){
                reject(err);
            }else{
                const games = rows.map(g => new Game(g.id,g.userId,g.date,g.cardsWon,g.completed));
                resolve(games);
            }
        });
    });
}

export const addGame = (game) => {
    return new Promise((resolve,reject) => {
        const sql = "INSERT INTO games(userId,date,cardsWon,completed) VALUES(?,?,?,?)";
        db.run(sql , [game.userId,game.date,game.cardsWon,game.completed] , function(err){
            if(err){
                reject(err);
            }else{
                game.id=this.lastID;
                resolve(game);
            }
        });
    });
}

export const updateGame = (id,cardsWon,completed) => {
    return new Promise((resolve,reject) => {
        const sql = "UPDATE games SET cardsWon=? , completed=? WHERE id=?";
        db.run(sql , [cardsWon,completed,id] , function(err){
            if(err){
                reject(err);
            }else if (this.changes === 0) {
                resolve({error : "error, game not updated"})
            }else{
                resolve(this.changes);
            }
        });
    });
}

