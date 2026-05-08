
create table preferences (
	id_preference integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"name" varchar(250) NOT NULL,
	description text NOT NULL,
	colors JSONB not null
);
