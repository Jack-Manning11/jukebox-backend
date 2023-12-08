const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
dotenv.config();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

// Handle preflight requests for the /login route
app.options('/login', cors());

app.post('/login', cors(), async (req, res) => {
    const { code } = req.body;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    })

    try {
        const {
            body: { access_token, refresh_token, expires_in },
        } = await spotifyApi.authorizationCodeGrant(code);

        res.header('Access-Control-Allow-Origin', '*'); // Set the allowed origin
        res.json({ access_token, refresh_token, expires_in });
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

// Handle preflight requests for the /refresh route
app.options('/refresh', cors());

app.post('/refresh', cors(), async (req, res) => {
    const { refreshToken } = req.body;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken,
    })

    try {
        const {
            body : { access_token, expires_in },
        } = await spotifyApi.refreshAccessToken();

        res.header('Access-Control-Allow-Origin', '*'); // Set the allowed origin
        res.json({ access_token, expires_in });
    } catch(err) {
        console.log(err);
        res.sendStatus(400);
    }
});

app.listen("0.0.0.0", err => {
    if(err) {
        console.log(err);
    }
    console.log("Listening on port: ", PORT);
})