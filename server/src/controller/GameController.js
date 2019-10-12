const create = (req, res) => {
    console.log("hello world");
    res.send({ test: 'test'})
};

export {create};