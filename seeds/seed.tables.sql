BEGIN;
TRUNCATE archived_messages, party_messages, party, party_requirements, party_apps, spot_roles, spots, games, users;
INSERT INTO users (username, email, password, avatar_url, not_verified)
VALUES
    (
      'admin',
      'armorysquad@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test1',
      'test1@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test2',
      'test2@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test3',
      'test3@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test4',
      'test4@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test5',
      'test5@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test6',
      'test6@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test7',
      'test7@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test8',
      'test8@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test9',
      'test9@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test10',
      'test10@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test11',
      'test11@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test12',
      'test12@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    ),
    (
      'test13',
      'test13@gmail.com',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
      'https://i.ebayimg.com/images/g/PfAAAOSwA3dYIPRN/s-l300.jpg',
      null
    );


INSERT INTO games (id, title, image_url, tags, party_limit)
VALUES(
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    'Overwatch',
    'https://res.cloudinary.com/squadarmory/image/upload/v1557172650/overwatch_epjgky.png',
    '{"Shooter", "FPS"}',
    6
),
(
    '1c0aa6f7-0e03-4ceb-82de-ac53617f1b30',
    'Final Fantasy XIV',
    'https://res.cloudinary.com/squadarmory/image/upload/v1557172654/FFXIV_n7geqy.png',
    '{"MMORPG"}',
    8
),
(
    '2e443716-4f9e-4a1c-89c9-ad4801f6dcc0',
    'League of Legends',
    'https://res.cloudinary.com/squadarmory/image/upload/v1557172653/league-of-legends_zwxsyj.png',
    '{"MOBA"}',
    5
),
(
    '1b1d0771-c2c7-4d3b-a13e-b89bbf0acbd7',
    'Fortnite',
    'https://res.cloudinary.com/squadarmory/image/upload/v1557172653/fortnite_bcyojw.png',
    '{"Shooter", "Battle Royale"}',
    4
),
(
    'c30ca766-064e-4ca1-b1bd-1a88d41993f8',
    'Apex Legends',
    'https://res.cloudinary.com/squadarmory/image/upload/v1557172654/apexLegends_hdizhp.png',
    '{"Shooter", "FPS", "Battle Royale"}',
    3
),
(
    'daf6b132-61e6-45a1-81e4-1bac7657790a',
    'DOTA 2',
    'https://res.cloudinary.com/squadarmory/image/upload/v1557172650/dota2_nwztht.png',
    '{"MOBA"}',
    5
),
(
    '0be67bb2-4c4f-4046-961a-45f3ff94c32f',
    'CSGO',
    'https://res.cloudinary.com/squadarmory/image/upload/v1557172653/csgo_i9nmb4.png',
    '{"Shooter", "FPS"}',
    6
),
(
    'ce4c02e2-02fd-4f9e-9686-ecc9385eb1d5',
    'Rainbow 6 Siege',
    'https://res.cloudinary.com/squadarmory/image/upload/v1557172651/rainbowSix_dm967t.png',
    '{"Shooter", "FPS"}',
    6
);

INSERT INTO party (id, game_id, title, require_app, owner_id, description, gamemode, ready)
VALUES 
  (
    'fb1d3c63-6a72-4013-be82-5b523c1dd1cd',
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    'Admin',
    true,
    1,
    'This is a description of this party.',
    1,
    true
  );
INSERT INTO party_requirements (requirement_id, party_id)
VALUES(
    2,
    'fb1d3c63-6a72-4013-be82-5b523c1dd1cd'
),
(
    1,
    'fb1d3c63-6a72-4013-be82-5b523c1dd1cd'
);
INSERT INTO spots (id, party_id, filled)
VALUES(
    '25539899-aae0-469e-92c1-a2116badc84c',
    'fb1d3c63-6a72-4013-be82-5b523c1dd1cd',
    1
),
(
    '64ed5ba8-78db-44c6-ae60-46e6a2a07ff9',
    'fb1d3c63-6a72-4013-be82-5b523c1dd1cd',
    null
);
INSERT INTO spot_roles (spot_id, role_id)
VALUES(
    '64ed5ba8-78db-44c6-ae60-46e6a2a07ff9',
    14
),
(
    '64ed5ba8-78db-44c6-ae60-46e6a2a07ff9',
    2
);
INSERT INTO party_apps (user_id, party_id, spot_id, description)
VALUES(
    1,
    'fb1d3c63-6a72-4013-be82-5b523c1dd1cd',
    '64ed5ba8-78db-44c6-ae60-46e6a2a07ff9',
    'I need healing!'
);
COMMIT;