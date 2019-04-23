CREATE TYPE req_role AS ENUM ('req', 'role');

CREATE TABLE party_attributes(
    id SERIAL PRIMARY KEY,
    attribute_type req_role NOT NULL,
    game_id int REFERENCES games(id) ON DELETE CASCADE NOT NULL
);