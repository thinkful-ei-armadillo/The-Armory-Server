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
    'https://previews.dropbox.com/p/thumb/AAawi5ehHTlt8DY41QWN1fK_7_kGjjHmmEN4bN6uEAXO5dfu3-4Mqi4bTOKxQuW99KwyAqsoLy8532u-4vqfNA32LdoJSlC7IdvaIPYwNMBnAlbf6yt6-euQQljgyvP_4p3eo0HZWtBSbQu_xvDxHliYBkRABzuxgQ2A2pSgFOeR6AUawkiqDTgmLQFat69XaI4Mzkob5deTNh2r5QF3Z0Q0p-c-EEfWm79M71dHp9bINjxKkzz8K4WZ4jbZKyhmyiDmKbpJ3cJFrULADWw07BE06KMNxvaXnAqIP5kPzqnCuNJ0oezYIs9dUh7htyy5Coh7gA0Tw-XwBqwqD2tw-LT_/p.png?size_mode=5',
    '{"Shooter", "FPS"}',
    6
),
(
    '1c0aa6f7-0e03-4ceb-82de-ac53617f1b30',
    'Final Fantasy XIV',
    'https://previews.dropbox.com/p/thumb/AAYQomNTc2-tJIw-wSJ2LEhs30x29oeXiddFIoWruEyqalnJ5C3oJk8FPJ75aen-8eyydlSu5aQ5LN45cpBnoBiUCwz7BBROJzMqQQsvJ-ItKHVVzidnzBoaAO9VUbEyRZPawmDF6o0R7GC8nyYufMyCSkgYAS3m5USrIn-MDmzReEYhFAm936bG9OQrmX9pzYXeOZ8Bm5pg6nL7qbrqbHHaYN618t8HbzrUmi3OzMQCCMolF6DW0-f2fdVXyv_V3y2zUp1CG9IaYU2SJTu_jjkwrSNd0-IGC58dgUy-FEtv7i7o2qfs_5NN8qZSWWM8TU65kCzEzyGxi7S9zk6VcqSF/p.png?size_mode=5',
    '{"MMORPG"}',
    8
),
(
    '2e443716-4f9e-4a1c-89c9-ad4801f6dcc0',
    'League of Legends',
    'https://previews.dropbox.com/p/thumb/AAa_-2F701ZsMBCZmTw0Vks7ZYemSOROD5D1VETsx9c0u-bpCyVo70BTjee_w5XRZ9Q7GePxpWMJpwFW-VAEC4gMPYidQgrrq7xZiIcO7R9FNO-sodmbFXLvLObDB9NF7moHG83y6jeZgtEtiSLPD5cMhI2kpi9Un3rSUWa3aTX3pAjXnEkQjGwWRMabB3x5MXU0kPTPhn5bT5x97uP4lSehIgLkNE6L7_2DAzEF-bdPQ3SAPX70oAGOcWeHbCkITWxJ5OUlDYhh38d5QFau-brc5bhAwqYR473DvTGXabgKukxaRaZOor-MZLqrGPPLMEDKczBz7uNnK-VR1HsaqvyN/p.png?size_mode=5',
    '{"MOBA"}',
    5
),
(
    '1b1d0771-c2c7-4d3b-a13e-b89bbf0acbd7',
    'Fortnite',
    'https://previews.dropbox.com/p/thumb/AAbQAJq0ZnG7q1TfhUqsILA0pN37cF_6Hmjl85O0aCdlQdvLVF1M9Gp82UG5GYr2o-fb735GaggW53ZKgiUGTuRLUZqEZU_VVLG_iViWaXCbNN0DwgkTHexmx3_DLZTbfFX1gHhlUYZU3wjsM6d_ANldKpzoikfS-lQ36O_E51_gHWR09Sdpqqk2JMyaxFjGewWfcHHwLq4-szuJ0TFEvvrglVn6Bj-wAW1bln_k9bRmcOlrhubJ5SyCelPii2VsuQRjyRIlnaMUoGts5n-9zz1CsVkefeYlh_7OLroC_DlK-Q1IJ56s6jYDXmx4qXCpXyPhnSS7vKXmqJth_r-TtwlB/p.png?size_mode=5',
    '{"Shooter", "Battle Royale"}',
    4
),
(
    'c30ca766-064e-4ca1-b1bd-1a88d41993f8',
    'Apex Legends',
    'https://previews.dropbox.com/p/thumb/AAYvuY5PcPvCCEC8o_sLn2-TO-_7r1U8E-ZAlXCDIXLfoRy4IgJ9uwuOImGg9CYYkffMqoRpB2ybIEij8AMXJ-YBSg-zcJtD6Mh6tFLaNI8R2sbsCtwmwtsg4mjZ0gYWdZkoovZu3-icrzvWggCi4t88pr_w1EAHfVd6trDYKbfKVTrt5uBqYY74rD3JUWUNytKaezTVJqlP4Z7yj7159P8hE-qrTqFVKF31LDv_EjqwF7TN0A7TvbJ3NGnxWI1kC7KfVBRQ46vmxBz4QWppV774iEDSPg-O69Qrb8aHEgQqshIhS7H-ny8W9IYMVAreQ4T-LUuccKKDG3avP8wDypIS/p.png?size_mode=5',
    '{"Shooter", "FPS", "Battle Royale"}',
    3
),
(
    'daf6b132-61e6-45a1-81e4-1bac7657790a',
    'DOTA 2',
    'https://previews.dropbox.com/p/thumb/AAaFNQmFl0ZjX3FKbwDuZAJJL0TTMlpeqGhPhArd7KopYq-I0cZhopiYaRmUpdiHxYEY-KDolgZUQvilUpaMgzFSfc4LKMlseMXtDpyvGhKgH98-BNDEzvAeE6ho9v8RA9jhB5hfFk2eA6eIPAea2OL5LWbvGqOHfChbpoaoJokZedAMNAhyl_Ji-u1N6SsdXxgrMivKrry6FhB7t4cDqfVVF27zkAR4tfx7Lm9KZnt2eS5S3Tu1kfM2HXw6Rf9jRXlulFh41dydWklgtz8Bteul7Kdxh0oCEDw1did13nukxFLgHeNwpgOx2Tlk3NPCUcvyX8V6DVhxFY7TjHf9wsF9/p.png?size_mode=5',
    '{"MOBA"}',
    5
),
(
    '0be67bb2-4c4f-4046-961a-45f3ff94c32f',
    'CSGO',
    'https://previews.dropbox.com/p/thumb/AAY4LCk363K3Diz_vU6jubr8dKcVp8jy3iD3_n_e8NXVn8aqcL94rJU31l4ZeX-_1BgvUm70gShOL7pft9Us2ShiHY1lIECkAHQBwj9k9na_nyz29nZs-CWGWEBsGQHyezkZSKuFE9ObKcqgtSZvp7UxrRYpzHNmoevJaTIrGHatqPYgU0C3M9Jm8M6_4iChja-IcwiJuXuPoETKu2UQpEsjZM7gg6XxZ1OdlMuJmDzPwD03r-ToqXXhXfkAVsmo-QTxfCY-rfazKfkEuFfGSVu9JYXCE_IgaCYffaUbzmWuo6nFCUwyM0ByBiJitWtHxWXwtY9_fZI7vUOTFagxSWgn/p.png?size_mode=5',
    '{"Shooter", "FPS"}',
    6
),
(
    'ce4c02e2-02fd-4f9e-9686-ecc9385eb1d5',
    'Rainbow 6 Siege',
    'https://previews.dropbox.com/p/thumb/AAbFG9PFaFm-440mQ7dmca_xmO2LDy5lQM0Xxh0mdKKmGQws3lTnsp3YRIViF8aFt64yHJRZTlKkUFA8kMbseV7qFVTp9cD7IvXct9QN04E1RwXxIBYiKI7lrC9KavQewjCZ7Xiucwob33eUa4D-T2FJnvhOffMgOz4lg4plChrOaQr5N6ceyw4HsTcbB3M5id_7cpFfn7si1x65jUi6c14Q_CxCCn5AF1uwDe9p79nJ5tZJRRPH8kEi4qvRqSQFLPyu5JdFpS9hDYUF6tRyp1vhe9_NMcF8YVPABQryMHEhCWp2ltqxoDhRcSHBwNMRjMXGmeq9uCQSqYA2tfAHC_nx/p.png?size_mode=5',
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

INSERT INTO party (game_id, title, require_app, owner_id, description, gamemode, ready)
VALUES
  (
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    '1',
    true,
    2,
    'This is a description of this party.',
    1,
    true
  ),
  (
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    '2',
    true,
    3,
    'This is a description of this party.',
    1,
    true
  ),
  (
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    '3',
    true,
    4,
    'This is a description of this party.',
    1,
    true
  ),
  (
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    '4',
    true,
    5,
    'This is a description of this party.',
    1,
    true
  ),
  (
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    '5',
    true,
    6,
    'This is a description of this party.',
    1,
    true
  ),
  (
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    '6',
    true,
    7,
    'This is a description of this party.',
    1,
    true
  ),
  (
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    '7',
    true,
    8,
    'This is a description of this party.',
    1,
    true
  ),
  (
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    '8',
    true,
    9,
    'This is a description of this party.',
    1,
    true
  ),
  (
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    '9',
    true,
    10,
    'This is a description of this party.',
    1,
    true
  ),
  (
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    '10',
    true,
    11,
    'This is a description of this party.',
    1,
    true
  ),
  (
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    '11',
    true,
    12,
    'This is a description of this party.',
    1,
    true
  ),
  (
    'aa0e8ce9-1a71-42e7-804d-6838556fa6ed',
    '12',
    true,
    13,
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