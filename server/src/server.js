import express from 'express';
import dotenv from 'dotenv';
import * as path from 'path';

// For .env file to work
dotenv.config();

export default class Server {

    constructor() {
        this.app = express();

        this.setDefaultConfiguration();
    }

    // Set default configurations from .env file
    setDefaultConfiguration()
    {
        this.app.set('port', process.env.SERVER_PORT || 3000);
    }

    // Set static folder
    createStaticFolder()
    {
        this.app.use(express.static(path.join('../public')));
    }

    initServer() {

        this.createStaticFolder();

        this.app.listen(this.app.get('port'), () => {
            console.log("Red Tetris is running on http://localhost:" + this.app.get('port'));
        });
    }
}