import express from 'express'
import * as GameController from './controller/GameController';

const router = express.Router();

router.get('/game', GameController.create);

export default router;
