import express from 'express'
import game from './controllers/gameController';

const routes = express();

routes.get('/', game.index);
routes.get('/room/:name/nickname/:nickname', game.test);

module.exports = routes;
