import passport from "passport";
import { db } from "./db.mjs";
import { User } from "./user.mjs";
import crypto from 'crypto';

export const getUserById = (id) => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM users WHERE users.id=?";
        db.get(sql , [id]  , (err,row) => {
            if(err){
                reject(err);
            }else if(row===undefined){
                resolve({error:"User not found"});
            }else{
                const user = new User(row.id,row.username,row.password,row.salt);
                resolve(user);
            }
        });
    });
}

export const getUser = (username,password) => {
    return new Promise((resolve,reject) => {
        const sql= 'SELECT * FROM users WHERE username=?';
        db.get(sql, [username] , (err,row) => {
            if(err){
                reject(err);
            }else if(row===undefined){
                resolve(false);
            }else{
                const user = {id: row.id , username: row.username };
                crypto.scrypt(password, row.salt , 32, function(err,hashedPassword) {
                    if(err){
                        reject(err);
                    }

                    if(!crypto.timingSafeEqual(Buffer.from(row.password , 'hex') , hashedPassword)){
                        resolve(false);
                    }else{
                        resolve(user);
                    }
                })
            }
        })
    })
}