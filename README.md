<p align="center">
    <h2>Squad Armory</h2> 
    <span>An app for gamers to find friends to play with in their favorite online multiplayer game.</span>
    <br/>
    <br/>
    <a href="https://squad-armory.now.sh">Live Version</a>
    <br/>
    <a href="https://limitless-brushlands-45977.herokuapp.com/api">API</a>
    </p>

## Why

Finding friends to play online video games with is hard. Sometimes life gets in the way and schedules don't line up. Or maybe you just don't have any friends to begin with. Don't fret because that's where Squad Armory comes in! Find your favorite game and join a squad that's looking exactly for whatever role you play. Can't find one that's right for you? Create your own squad and find your perfect teammates! Whether you're looking for something more casual or more competitive, you can be as general or as specific as you'd like when creating a squad. Chat with your new squadmates within the app and plan out your gaming session. Squad up and join Squad Armory!

## Features

**Join a squad**: Users can find squads that match their gaming preferences and join available spots

**Create a squad**: Users can create a squad with as much specificity as they want when looking for squadmates

**Chat with squadmates**: Everyone in a squad can chat with each other in real time

## Upcoming Features

**Voice chat**: Users can opt in to use voice chat upon joining a squad

**Private squads**: Creators of squads can require applications for potential new squadmates

## Tech Stack

- [Create React App](https://github.com/facebook/create-react-app)
- [React](https://github.com/facebook/react)

- [Socket.io](https://socket.io)

- [Node](https://github.com/nodejs/node)
- [Express](https://github.com/expressjs/express)
- [Nodemailer](https://nodemailer.com)
- [Supertest](https://www.npmjs.com/package/supertest)
- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)
- [Enzyme](https://airbnb.io/enzyme/)

## API

```
/api
.
├── /auth
│   └── POST
│       ├── /token
├── /games
│   └── GET /
│   |   ├── /:id
│   |   └── /:gameId/parties
├── /party
│   └── GET
│       ├── /:partyId
│       ├── /auth/:partyId
│       ├── /messages/:partyId
│   └── POST
│       └── /
├── /user
│   └── GET
│       └── /:userId
│   └── POST
│       └── /
│   └── PATCH
│       └── /:userId
```

## Team

- Project Manager Andrew Bituin
- Product Manager Alex Reich
- Design Lead Jake Derhalli
- Testing Lead William Wong
