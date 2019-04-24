BEGIN;
INSERT INTO party_requirements (id, requirement_id, party_id)
VALUES(
    1,
    9,
    'fb1d3c63-6a72-4013-be82-5b523c1dd1cd'
),
(
    2,
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
INSERT INTO spot_roles (id, spot_id, role_id)
VALUES(
    1,
    '64ed5ba8-78db-44c6-ae60-46e6a2a07ff9',
    14
),
(
    2,
    '64ed5ba8-78db-44c6-ae60-46e6a2a07ff9',
    2
);
INSERT INTO party_apps (id, user_id, party_id, spot_id, description)
VALUES(
    1,
    1,
    'fb1d3c63-6a72-4013-be82-5b523c1dd1cd',
    '64ed5ba8-78db-44c6-ae60-46e6a2a07ff9',
    'I need healing!'
);
COMMIT;