const PORT = process.env.PORT || 1068,
    express = require('express'),
    app = express(),
    http = require('http').Server(app);

const balance = require('./util/balance');
let strt;

app.use(express.static(__dirname + '/site'));

app.get('/api', (_, res) => res.send({uptime: Date.now() - strt}));

app.get('/api/balance', (req, res) => {
    if (!req.query.q) return res.status(400).send({message: 'Missing required query: q'});
    let r;
    try {
        r = balance(req.query.q);
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'An unexpected error occurred.'});
    }
    if (!r) return res.status(400).send({message: 'Invalid query provided.'});
    res.json(r);
});

// TODO: 404 page.
app.use((_, res) => res.redirect('/'));

http.listen(PORT, () => {
    strt = Date.now();
    console.log('Server started at port', PORT);
});
