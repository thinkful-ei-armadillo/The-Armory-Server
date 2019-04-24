CREATE TABLE spots(
    id uuid PRIMARY KEY,
    party_id uuid REFERENCES party(id) ON DELETE CASCADE NOT NULL,
    filled int REFERENCES users(id) UNIQUE
);