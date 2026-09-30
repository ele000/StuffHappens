import dayjs from "dayjs";

function Game(id,userId,date,cardsWon,completed){
    this.id=id;
    this.userId=userId;
    this.date=dayjs(date).format('YYYY-MM-DD');
    this.cardsWon=cardsWon;
    this.completed=completed;
}

export {Game};