CREATE TABLE games(
    id int PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    tags TEXT[]
);