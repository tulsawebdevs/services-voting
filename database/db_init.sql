CREATE TABLE if NOT EXISTS proposals (
	title varchar(255) NOT NULL,
	summary TEXT NOT NULL,
	description TEXT NOT NULL,
	type varchar(32) NOT NULL,
	status varchar(32) DEFAULT 'draft' NOT NULL,
	id SERIAL PRIMARY KEY,
	created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated TIMESTAMP
)
