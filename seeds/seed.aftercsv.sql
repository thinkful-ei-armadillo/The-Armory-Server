BEGIN;
INSERT INTO party_requirements (id, requirement_id, party_id)
VALUES(
    1,
    9,
    1
),
(
    2,
    1,
    1
);
INSERT INTO spots (id, party_id, filled)
VALUES(
    1,
    1,
    1
),
(
    2,
    1,
    null
);
INSERT INTO spot_roles (id, spot_id, role_id)
VALUES(
    1,
    2,
    14
),
(
    2,
    2,
    2
);
INSERT INTO party_apps (id, user_id, party_id, spot_id, description)
VALUES(
    1,
    1,
    1,
    2,
    'I need healing!'
);
COMMIT;