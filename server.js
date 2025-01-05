const express = require('express');
const { LifeMatrix } = require('./dist/services/LifeMatrix');
const { getRandomMatrix } = require('./dist/utils/generateRandom');

const app = express();
const port = 5000;

let lifeMatrix;

app.use(express.json());

app.post('/init/:areaSize', (req, res) => {
    const { areaSize } = +req.params.areaSize;
    lifeMatrix = new LifeMatrix(getRandomMatrix(areaSize));
    res.send({ message: 'Life matrix initialized', lifeMatrix: lifeMatrix.dwellers });
});

app.post('/next-generation', (req, res) => {
    if (!lifeMatrix) {
        return res.status(400).send({ message: 'Life matrix not initialized' });
    }
    const nextGen = lifeMatrix.nextGeneration();
    res.send({ message: 'Next generation computed', lifeMatrix: nextGen });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});