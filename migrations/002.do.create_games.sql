CREATE TABLE games(
    id uuid PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    tags TEXT[]
);