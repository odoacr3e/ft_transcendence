
create table preferences (
	id_preference integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"name" varchar(250) NOT NULL,
	description text NOT NULL,
	colors JSONB not null
);

alter table users add column id_preference int,
add constraint fk_preference foreign key (id_preference) references preferences(id_preference);
