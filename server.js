const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { LifeMatrix } = require('./dist/services/LifeMatrix');
const { getRandomMatrix } = require('./dist/utils/generateRandom');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use(session({
    secret: 'your-secret-key', // Secret used to sign the session ID cookie
    resave: false, // Don't save the session if it wasn't modified
    saveUninitialized: true, // Create a session even if nothing is stored
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Session duration (e.g., 1 day)
    },
  }));

app.post('/init/:areaSize', (req, res) => {
   const areaSize = parseInt(req.params.areaSize, 10);
   console.log("areaSize: ", areaSize);
    if (isNaN(areaSize)) {
        return res.status(400).send({ message: 'Invalid Life matrix size' });
    }
    if (areaSize < 10 || areaSize > 1000) {
        return res.status(400).send({ message: 'The size of the Life matrix must be in the range [10 - 1000]' });
    }
    const randomMatrix = getRandomMatrix(areaSize);
    const lifeMatrix = new LifeMatrix(randomMatrix.dwellers);
    req.session.lifeMatrix = {matrix: lifeMatrix.dwellers};

    res.send({ message: 'Life matrix initialized', areaSize: areaSize, alives: randomMatrix.alives });
});

app.post('/next', (req, res) => {
    if (!req.session.lifeMatrix) {
        return res.status(400).send({ message: 'Life matrix not initialized' });
    }
    const lifeMatrix = LifeMatrix.fromObject(req.session.lifeMatrix);
    const nextGen = lifeMatrix.nextGeneration();    
    req.session.lifeMatrix = {
        matrix: nextGen.dwellers,
        generation: nextGen.generation
    };

    res.send({generation: nextGen.generation, alives: nextGen.alives});
});

app.get('/wakeup', (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});