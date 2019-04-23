CREATE TABLE party_requirements(
    id SERIAL PRIMARY KEY,
    party_id int REFERENCES party(id) ON DELETE CASCADE NOT NULL,
    attribute_id int REFERENCES party_attributes(id) ON DELETE CASCADE NOT NULL
);