CREATE TABLE spot_roles(
    id SERIAL PRIMARY KEY,
    spot_id int REFERENCES spot(id) ON DELETE CASCADE NOT NULL,
    role_id int REFERENCES party_attributes(id) ON DELETE CASCADE NOT NULL
);