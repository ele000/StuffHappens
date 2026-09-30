// imports
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { check , validationResult } from 'express-validator';
import { getCardById , getRandomCard } from './dao-cards.mjs';
import { getGameById, getGamesByUser , addGame , updateGame} from './dao-game.mjs';
import { addCardsGame, getCardsByGame } from './dao-cardsGame.mjs';
import { getUserById, getUser } from './dao-users.mjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import dayjs from 'dayjs';

// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));

app.use('/images', express.static('images'));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200 , 
  credentials: true
};

app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username , password , cb)  {
  const user = await getUser(username,password);
  if(!user){
    return cb(null,false, 'Incorrect username or password');
  }else{
    return cb(null, user);
  }
}))

passport.serializeUser(function (user,cb) {
  cb(null,user);
});

passport.deserializeUser(function (user,cb) {
  cb(null,user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.authenticate('session'));



async function validateUser(req,res,next){
  const {userId} = req.body;
  try{
    const result = await getUserById(userId);
    if(result.error){
      res.status(404).json(result).end();
    }else{
      next();
    }
  }catch(err){
    res.status(503).json({error: err.message}).end();
  }
}

async function validateGame(req,res,next){
  const {gameId} = req.body;
  try{
    const result = await getGameById(gameId);
    if(result.error){
      res.status(404).json(result).end();
    }else{
      next();
    }
  }catch(err){
    res.status(503).json({error: err.message}).end();
  }
}

async function validateCard(req,res,next){
  const {cardId} = req.body;
  try{
    const result = await getCardById(cardId);
    if(result.error){
      res.status(404).json(result).end();
    }else{
      next();
    }
  }catch(err){
    res.status(503).json({error: err.message}).end();
  }
}

//GET /api/cards/:cardId
app.get('/api/cards/:cardId', async (req, res) => {
  try{
    const card = await getCardById(req.params.cardId);
    if(card.error){
      res.status(404).json(card);
    }else{
      res.json(card);
    }
  }catch(err){
    console.log(err);
    res.status(500).json({error: "Internal server error"});
  }
});

//GET /api/randomCard
app.get('/api/randomCard', async (req, res) => {
  try{
    const excludedParam = req.query.excluded;
    const excludedCardIds = excludedParam ? excludedParam.split(',').map(Number) : [];
    const card = await getRandomCard(excludedCardIds); 
    if(card.error){
      res.status(404).json(card);
    }else{
      res.json(card);
    }
  }catch(err){
    console.log(err);
    res.status(500).json({error: "Internal server error"});
  }
});

//GET /api/users/:userId/games
app.get('/api/users/:userId/games'  ,async(req,res) => {
  try{
    const games = await getGamesByUser(req.params.userId);
    res.json(games);
  }catch(err){
    console.log(err);
    res.status(500).json({error : "Internal server error"});
  }
});

//GET /api/games/:gameId
app.get('/api/games/:gameId' , async(req,res) => {
  try{
    const game = await getGameById(req.params.gameId);
    if(game.error){
      res.status(404).json(game);
    }else{
      res.json(game);
    }
  }catch(err){
    console.log(err);
    res.status(500).json({error : "Internal server error"});
  }
});

//GET /api/games/:gameId/cards
app.get('/api/games/:gameId/cards' , async(req,res) => {
  try{
    const cards = await getCardsByGame(req.params.gameId);
    res.json(cards);
  }catch(err){
    console.log(err);
    res.status(500).json({error : "Internal server error"});
  }
});

//POST /api/games/add
app.post('/api/games/add' , 
  isLoggedIn,
  validateUser,
  [
  check('userId').isInt(),
  check('date').isDate({format: 'YYYY-MM-DD' , strictMode: true}),
  check('cardsWon').isInt({min: 0, max: 3}),
  check('completed').isInt({ min: 0, max: 1 })
], async (req,res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }

  const newGame = req.body;
  try{
    const game = await addGame(newGame);
    res.status(201).json({ message: "Game added", id: game.id });
  }catch(err){
    console.log(err);
    res.status(503).json({error: "Impossible to add the game"});
  }

});

//POST /api/cardsGame/add
app.post('/api/cardsGame/add', 
  isLoggedIn,
  validateGame,
  validateCard,
  [
  check('gameId').isInt(),
  check('cardId').isInt(),
  check('round').isInt({min:0,max:5}),
  check('result').isInt({min:-1,max:1})
] , async (req,res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }

  const newCardGame = req.body;
  try{
    const cardGame = await addCardsGame(newCardGame);
    res.status(201).json({ message: "Card added to the game", id: cardGame.id });
  }catch(err){
    console.log(err);
    res.status(503).json({error: "Impossible to add the card to the game"});
  }
});

//PUT /api/games/:gameId/update
app.put('/api/games/:gameId/update', isLoggedIn , 
  [
  check('cardsWon').isInt({min:0 , max:3}),
  check('completed').isInt({min:0 , max:1})
] , async(req,res) => {
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }

  const gameToUpdate = req.params.gameId;
  const {cardsWon , completed} = req.body;

  try{
    const result = await updateGame(gameToUpdate,cardsWon,completed);
    if (result.error) {
      res.status(404).json(result);
    } else {
      res.status(200).json(result);
    }
  }catch(err){
    console.log(err);
    res.status(503).json({error : "Impossible to update the game"})
  }
});

//POST /api/session
app.post('/api/session' , passport.authenticate('local') , function(req,res){
  return res.status(201).json(req.user);
})

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/sessions/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});


// activate the server
app.listen(port, () => {console.log(`Server listening at http://localhost:${port}`);});