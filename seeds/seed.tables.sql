BEGIN;
TRUNCATE roles, requirements, party, party_requirements, party_apps, spot_roles, spots, games, users;
INSERT INTO users (id, username, email, password, avatar_url, not_verified)
VALUES(
    1,
    'admin',
    'armorysquad@gmail.com',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'https://www.dropbox.com/s/x05f307un1oind2/IMG_3504%20copy.jpg?dl=0',
    null
    );
INSERT INTO games (id, title, image_url, tags)
VALUES(
    1,
    'Overwatch',
    'https://static.playoverwatch.com/media/wallpaper/logo-burst-wide.jpg',
    '{"Shooter", "FPS"}'
),
(
    2,
    'Final Fantasy XIV',
    'https://img.finalfantasyxiv.com/lds/h/a/-A_KTovWBuvRDUZIadls49CHpk.jpg',
    '{"MMORPG"}'
),
(
    3,
    'League of Legends',
    'http://paperlief.com/images/league-of-legends-champions-wallpaper-3.jpg',
    '{"MOBA"}'
),
(
    4,
    'Fortnite',
    'https://cdn.gamerant.com/wp-content/uploads/fortnite-season-8-week-4-challenge-leak.jpg.optimal.jpg',
    '{"Shooter", "Battle Royale"}'
),
(
    5,
    'Apex Legends',
    'https://gameguidehq.com/wp-content/uploads/2019/02/apex_legends_intro_wallpaper.jpg',
    '{"Shooter", "FPS", "Battle Royale"}'
),
(
    6,
    'DOTA 2',
    'https://cdn.windowsreport.com/wp-content/uploads/2017/01/dota-2-cant-connect-to-game-server.png',
    '{"MOBA"}'
),
(
    7,
    'CSGO',
    'https://steamuserimages-a.akamaihd.net/ugc/3336341088177464117/8D53A0CBBA686F16DC97FD2722D4F6174D6897EB/',
    '{"Shooter", "FPS"}'
),
(
    8,
    'Rainbow 6 Siege',
    'https://i.redd.it/iznunq2m8vgy.png',
    '{"Shooter", "FPS"}'
);

INSERT INTO party (id, game_id, title, require_app, owner_id, description)
VALUES (
    'fb1d3c63-6a72-4013-be82-5b523c1dd1cd',
    1,
    'Try Hards',
    true,
    1,
    'This is a description of this party.'
);
COMMIT;