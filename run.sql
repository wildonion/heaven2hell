create database if not exists heaven2hell;
create table if not exists heavennfts(
    id SERIAL PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    points INTEGER NOT NULL,
    heavennfts TEXT[] DEFAULT ARRAY[]::TEXT[],  -- ARRAY of TEXT
    sent_tx_hashes TEXT[] DEFAULT ARRAY[]::TEXT[],
    hell TEXT[] DEFAULT ARRAY[]::TEXT[],
    converted_at BIGINT NOT NULL
);