CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE albums (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE photos (
    id               SERIAL PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    acquisition_date TIMESTAMP,
    size             BIGINT,
    dominant_color   VARCHAR(7),
    url              VARCHAR(500) NOT NULL,
    album_id         INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);
