CREATE TABLE spots(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_id uuid REFERENCES party(id) ON DELETE CASCADE NOT NULL,
    filled int REFERENCES users(id) UNIQUE
);