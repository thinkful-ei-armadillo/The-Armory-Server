CREATE TABLE requirements(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    game_id int REFERENCES games(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    game_id int REFERENCES games(id) ON DELETE CASCADE NOT NULL
);