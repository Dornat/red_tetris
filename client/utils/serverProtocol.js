const FOLDER = '/js/';

export const buildUrl = () => {
    return process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.PORT + FOLDER;
};
