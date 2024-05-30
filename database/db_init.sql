CREATE OR REPLACE FUNCTION trigger_set_updated() RETURNS TRIGGER AS $$
BEGIN
	NEW.updated = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/*
SETUP PROPOSALS TABLE
*/
CREATE TABLE if NOT EXISTS proposals (
	title varchar(100) NOT NULL,
    author_name TEXT NOT NULL,
    voter_email TEXT NOT NULL,
	summary TEXT NOT NULL,
	description TEXT DEFAULT '' NOT NULL,
	type varchar(32) NOT NULL,
	status varchar(32) DEFAULT 'open' NOT NULL,
	id SERIAL PRIMARY KEY,
	created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated TIMESTAMPTZ
);

CREATE OR REPLACE TRIGGER set_updated
BEFORE UPDATE ON proposals
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated();

/*
SETUP VOTING TABLE
*/

CREATE TABLE if NOT EXISTS votes (
	voter_email TEXT NOT NULL,
	proposal_id INT NOT NULL REFERENCES proposals(id),
	vote INT,
    comment TEXT DEFAULT '' NOT NULL ,
	created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated TIMESTAMPTZ,
	id SERIAL PRIMARY KEY,
    CONSTRAINT unique_vote UNIQUE (voter_email, proposal_id)
);

CREATE OR REPLACE TRIGGER set_updated
BEFORE UPDATE ON votes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated();

/*
SETUP DRAFTS TABLE
*/
CREATE TABLE if NOT EXISTS drafts (
     title varchar(100) DEFAULT '' NOT NULL,
     summary TEXT DEFAULT '' NOT NULL,
     description TEXT DEFAULT '' NOT NULL,
     type varchar(32) DEFAULT '' NOT NULL,
     id SERIAL PRIMARY KEY,
     created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
     updated TIMESTAMPTZ
);

CREATE OR REPLACE TRIGGER set_updated
BEFORE UPDATE ON drafts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated();
