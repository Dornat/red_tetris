module.exports = {
    index: (req, res) => {
        console.log("User Index");
    },
    test: (req, res) => {
        console.log(req);
        res.json({
            params: req.params
        });
    }
};
