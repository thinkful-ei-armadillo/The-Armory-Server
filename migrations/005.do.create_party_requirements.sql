CREATE TABLE party_requirements(
    id SERIAL PRIMARY KEY,
    party_id uuid REFERENCES party(id) ON DELETE CASCADE NOT NULL,
    requirement_id int REFERENCES requirements(id) ON DELETE CASCADE NOT NULL
);