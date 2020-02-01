import Score from '../model/Score';

class ScoreService {
    static async addScoreResult({nickname, score}) {
        const filter = {nickname: nickname};
        const update = {score: score};

        try {
            let scoreResult = await Score.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true
            });

            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async getScoreResults({count, page}) {
        const limit = count;
        const skip = count * page - count;

        try {
            const result = await Score.find().limit(limit).skip(skip).sort({'score': 'descending'});
            const total = await Score.find().countDocuments();

            let items = [];

            result.forEach((item, index) => {

                const {nickname, score} = item;

                items[index] = {
                    nickname: nickname,
                    score: score,
                    rank: skip + index + 1
                };
            });

            return {
                page: page,
                returned: items.length,
                total: total,
                items: items,
                pages: Math.ceil(total / count)
            };
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async getPersonalScore(nickname) {
        try {
            const result = await Score.findOne({nickname: nickname});

            if (result === null) {
                return {msg: 'noGamesYet'};
            }

            const position = await Score.mapReduce(
                () => {
                    emit(null, this.nickname);
                },
                (key, values) => {
                },
                {
                    'sort': {'score': -1},
                    'out': {'inline': 1}
                }
            );

            return {
                msg: 'found',
                score: result.score,
            };
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

export default ScoreService;