CREATE TABLE party(
    id SERIAL PRIMARY KEY,
    game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    require_app BOOLEAN,
    owner_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    description VARCHAR(140)
);