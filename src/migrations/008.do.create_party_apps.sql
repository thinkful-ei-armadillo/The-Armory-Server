CREATE TABLE party_apps(
    id SERIAL PRIMARY KEY,
    user_id int REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    party_id int REFERENCES party(id) ON DELETE CASCADE NOT NULL,
    description VARCHAR(140)
);