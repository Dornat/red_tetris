import express from 'express';

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
            this.createStaticFolder(options.staticFolderLocation);
        }

        if (options.onInit) {
            this.onInit = options.onInit;
        }

        this.initServer();
    }

    // Set static folder
    createStaticFolder(location) {
        this.app.use(express.static(location));
    }

    initServer() {
        const port = this.app.get('port');

        this.app.listen(port, () => {
            this.onInit(port);
        });
    }
}

export default Server;