import sqlite from "sqlite3";

const db = new sqlite.Database("stuffHappens.sqlite" ,(err) => {
    if(err){
        console.log("failed to open the database", err.message);
        throw err;
    }else{
        console.log("Successfully connected to the database");
    }
});

export {db};