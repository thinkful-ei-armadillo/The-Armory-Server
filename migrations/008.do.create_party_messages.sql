CREATE TABLE party_messages(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_id uuid NOT NULL REFERENCES party(id),
    owner_id INT REFERENCES users(id),
    message_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    message_body TEXT NOT NULL,
    time_created TEXT NOT NULL
);