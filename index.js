import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import SpotifyWebApi from "spotify-web-api-node";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

app.post("/login", async (req, res) => {
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

        res.json({ access_token, refresh_token, expires_in });
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
});

app.post("/refresh", async (req, res) => {
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