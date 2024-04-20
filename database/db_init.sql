CREATE OR REPLACE FUNCTION trigger_set_updated() RETURNS TRIGGER AS $$
BEGIN
	NEW.updated = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE if NOT EXISTS proposals (
	title varchar(100) NOT NULL,
	summary TEXT NOT NULL,
	description TEXT NOT NULL,
	type varchar(32) NOT NULL,
	status varchar(32) DEFAULT 'draft' NOT NULL,
	id SERIAL PRIMARY KEY,
	created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated TIMESTAMP
);

CREATE OR REPLACE TRIGGER set_updated
BEFORE UPDATE ON proposals
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated();
