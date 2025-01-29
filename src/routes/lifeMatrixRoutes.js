const express = require('express');
const router = express.Router();
const { getRandomMatrix } = require('@utils/generateRandom');
const { LifeMatrix } = require('@services/LifeMatrix');

router.post('/init/:areaSize', (req, res) => {
    const areaSize = parseInt(req.params.areaSize, 10);
    if (isNaN(areaSize)) {
        return res.status(400).send({ message: 'Invalid Life matrix size' });
    }
    if (areaSize < 10 || areaSize > 1000) {
        return res.status(400).send({ message: 'The size of the Life matrix must be in the range [10 - 1000]' });
    }
    const randomMatrix = getRandomMatrix(areaSize);
    const lifeMatrix = new LifeMatrix(randomMatrix.dwellers);
    req.session.lifeMatrix = { matrix: lifeMatrix.dwellers };

    res.send({ message: 'Life matrix initialized', areaSize: areaSize, alives: randomMatrix.alives });
});

router.post('/next', (req, res) => {
    if (!req.session.lifeMatrix) {
        return res.status(400).send({ message: 'Life matrix not initialized' });
    }
    const lifeMatrix = LifeMatrix.fromObject(req.session.lifeMatrix);
    const nextGen = lifeMatrix.nextGeneration();
    req.session.lifeMatrix = {
        matrix: nextGen.dwellers,
        generation: nextGen.generation,
    };

    res.send({ generation: nextGen.generation, alives: nextGen.alives });
});

router.delete('/del', (req, res) => {
    if (!req.session || !req.session.lifeMatrix) {
        return res.status(400).send({ message: 'No active session to delete' });
    }
    req.session = null;
    res.status(200).send({ message: 'Session was deleted successfully' });

});

router.get('/wakeup', (req, res) => {
    res.sendStatus(200);
});

module.exports = router;