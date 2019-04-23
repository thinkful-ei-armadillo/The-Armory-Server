CREATE TABLE spots(
    id SERIAL PRIMARY KEY,
    party_id int REFERENCES party(id) ON DELETE CASCADE NOT NULL,
    filled int REFERENCES users(id)
);