import mongoose from 'mongoose';

class Database {

    /**
     * @required uri
     * @required db_name
    */
    constructor(options)
    {
        this.uri = options.uri;
        this.db_name = options.db_name;
    }

    async initConnection() {
        try {
            const connection = await mongoose.connect(`mongodb://${this.uri}/${this.db_name}`, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            });

            console.log("\x1b[35m", "*** Database connection established ***", '\x1b[0m')
        }
        catch(exception) {
            console.error("\x1b[31m", "*** Database connection error ***", '\x1b[0m')
        }
    }
}

export default Database;