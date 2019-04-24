const express = require('express')
const gamesRouter = express.Router()
const GamesService = require('./games-service')

gamesRouter
    .get('/', async (req, res, next) => {
    const games = await GamesService.getAllGames(req.app.get('db'))
    const partyCount = await GamesService.getPartyCount(req.app.get('db'))
    
    const array = []
    games.map(game => {
        const match = partyCount.find(item => item.id === game.id)
        game.party_count = match.party_count
        array.push(game)
    })
    res.status(200).json(array)
    });
    

module.exports = gamesRouter