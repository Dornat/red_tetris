import Server from './server';
import Database from './database';
import dotenv from 'dotenv';
import * as path from 'path';

// For .env file to work
dotenv.config();

const server = new Server({
    port: process.env.SERVER_PORT || 3000,
    createStaticFolder: true,
    staticFolderLocation: path.join('../public'),
    onInit: (port) => {
        console.log("Red Tetris is running on http://localhost:" + port);
    }
});

const database = new Database({
    uri: process.env.MONGODB_URI,
    db_name: process.env.MONGODB_NAME
});

database.initConnection();