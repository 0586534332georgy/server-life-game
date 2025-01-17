const express = require('express');
const cors = require('cors');
const { LifeMatrix } = require('./dist/services/LifeMatrix');
const { getRandomMatrix } = require('./dist/utils/generateRandom');

const app = express();
const port = 5000;

let lifeMatrix;

app.use(cors());
app.use(express.json());

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
    lifeMatrix = new LifeMatrix(randomMatrix.dwellers);

    res.send({ message: 'Life matrix initialized', areaSize: areaSize, alives: randomMatrix.alives });
});

app.post('/next', (req, res) => {
    if (!lifeMatrix) {
        return res.status(400).send({ message: 'Life matrix not initialized' });
    }
    const nextGen = lifeMatrix.nextGeneration();
    res.send(nextGen);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});