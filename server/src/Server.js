import express from 'express';
import router from './router';
import http from 'http';
import socketIO from 'socket.io';

class Server {

    /**
     * @required port
     * @option createStaticFolder
     * @option staticFolderLocation
     * @option onInit (callback function)
     */
    constructor(options) {
        this.app = express();
        this.server = http.Server(this.app);

        this.app.set('port', options.port);

        if (options.createStaticFolder) {
            this.createStaticFolder();
        }

        if (options.onInit) {
            this.onInit = options.onInit;
        }

        this.initServer();
    }

    // Set static folder
    createStaticFolder() {
        this.app.use(express.static(__dirname + '/resources'));
    }

    initServer() {
        const port = this.app.get('port');

        // Non-API Routes
        this.app.get(/^(?!\/api)/, function(req, res) {
            res.sendFile(__dirname + '/resources/index.html');
        });

        this.app.use('/api', router);

        // Heroku doesn't need a definition of socket.io port.
        if (typeof process.env.HEROKU === 'undefined') {
            this.app.listen(port, () => {
                this.onInit(port);
            });

            this.server.listen(process.env.IO_SERVER_PORT, () => {
                this.onInit(process.env.IO_SERVER_PORT);
            });
        } else {
            this.server.listen(port, () => {
                this.onInit(port);
            });
        }

        this.io = socketIO(this.server);
    }
}

export default Server;