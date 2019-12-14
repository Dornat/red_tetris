import mongoose, {Schema, model} from 'mongoose';

const ScoreSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    score: {
        type: Number,
        required: true
    }
}, {collection : 'scores'});


let ScoreModel = mongoose.model('Score', ScoreSchema, 'scores');

export default ScoreModel;