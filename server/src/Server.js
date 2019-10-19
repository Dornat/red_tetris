import express from 'express';
import router from './router';

class Server {

    /**
     * @required port
     * @option createStaticFolder
     * @option staticFolderLocation
     * @option onInit (callback function)
     */
    constructor(options) {
        this.app = express();

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
        this.app.get(/^(?!\/api)/, function(req, res, next) {
            res.sendFile(__dirname + '/resources/index.html');
        });

        this.app.use('/api', router);

        this.app.listen(port, () => {
            this.onInit(port);
        });

    }
}

export default Server;