const PROTOCOL = 'http';
const HOST = 'localhost';
const PORT = '3000';
const FOLDER = '/js/';

export const buildUrl = () => {
    return PROTOCOL + '://' + HOST + ':' + PORT + FOLDER;
};
