require('dotenv').config();
require('module-alias/register');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const corsOptions = require('@config/corsConfig');
const sessionConfig = require('@config/sessionConfig');
const lifeMatrixRoutes = require('@routes/lifeMatrixRoutes');

const app = express();
const port = 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(session(sessionConfig));

app.use('/api', lifeMatrixRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});