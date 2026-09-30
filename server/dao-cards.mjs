import { db } from "./db.mjs";
import { Card } from "./card.mjs";

export const getCardById = (id) => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM cards WHERE cards.id=?";
        db.get(sql , [id]  , (err,row) => {
            if(err){
                reject(err);
            }else if(row===undefined){
                resolve({error : "Card not found"});
            }else{
                const card = new Card(row.id,row.name,row.index,row.imageUrl);
                resolve(card);
            }
        });
    });
}

export const getRandomCard = (excludedCardIds) => {
  return new Promise((resolve, reject) => {
    if (excludedCardIds.length === 0) {
      const sql = "SELECT * FROM cards ORDER BY RANDOM() LIMIT 1";
      db.get(sql, [] , (err, row) => {
        if (err){
            reject(err);
        }else if(row===undefined){
            resolve({error : "Card not found"});
        }else{
            const card = new Card(row.id,row.name,row.index,row.imageUrl);
            resolve(card);
        }
      });
    } else {
      const placeholders = excludedCardIds.map(() => '?').join(',');
      const sql = `SELECT * FROM cards WHERE id NOT IN (${placeholders}) ORDER BY RANDOM() LIMIT 1`;
      db.get(sql, excludedCardIds, (err, row) => {
        if (err){
            reject(err);
        }else if(row===undefined){
            resolve({error : "Card not found"});
        }else{
            const card = new Card(row.id,row.name,row.index,row.imageUrl);
            resolve(card);
        }
      });
    }
  });
}
