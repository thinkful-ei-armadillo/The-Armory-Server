CREATE TABLE party(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    require_app BOOLEAN,
    owner_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    description VARCHAR(140),
    gamemode INT NOT NULL,
    ready BOOLEAN default false,
    date_posted TIMESTAMP DEFAULT now() NOT NULL
);