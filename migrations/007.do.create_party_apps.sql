CREATE TABLE party_apps(
    id SERIAL PRIMARY KEY,
    user_id int REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    party_id uuid REFERENCES party(id) ON DELETE CASCADE NOT NULL,
    spot_id uuid REFERENCES spots(id) ON DELETE CASCADE NOT NULL,
    description VARCHAR(140)
);