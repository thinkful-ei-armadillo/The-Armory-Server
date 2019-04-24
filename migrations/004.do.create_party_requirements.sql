CREATE TABLE party_requirements(
    id SERIAL PRIMARY KEY,
    party_id uuid REFERENCES party(id) ON DELETE CASCADE NOT NULL,
    requirement_id INT NOT NULL
);