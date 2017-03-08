/*

grant all on schema nakama to u4nakama;
grant all on all tables in schema nakama to u4nakama;
grant all on all sequences in schema nakama to u4nakama;
grant all on all functions in schema nakama to u4nakama;

*/

create table userinfo (
    id serial primary key,
    username text not null,
    password text not null,
    displayname text not null,
    email text not null,
    role text not null default 'author',
    enabled boolean not null default true,
    createdat timestamp with time zone not null default now(),
    updatedat timestamp with time zone,
    unique (username)
);

create table module (
    id serial primary key,
    code text not null,
    name text not null,
    moduleorder integer not null,
    enablemodule boolean not null default true,
    enablecomment boolean not null default true,
    enablecategory boolean not null default true,
    createdat timestamp with time zone not null default now(),
    updatedat timestamp with time zone,
    unique (name)
);

create table category (
    id serial primary key,
    name text not null,
    description text,
    moduleid integer not null,
    createdat timestamp with time zone not null default now(),
    updatedat timestamp with time zone,
    unique (name, moduleid),
    constraint fk_modmeta_moduleid foreign key (moduleid) references module (id)
);
create index idx_cat_moduleid on category(moduleid);

create table message (
    id serial primary key,
    title text not null,
    body text not null,
    html text not null,
    published boolean not null default false,
    authorname text not null,
    authorid integer,
    prettyurl text not null,
    moduleid integer not null,
    categories jsonb,
    createdat timestamp with time zone not null default now(),
    updatedat timestamp with time zone,
    constraint fk_message_accountid foreign key (authorid) references userinfo (id),
    constraint fk_message_moduleid foreign key (moduleid) references module (id)
);
create index idx_message_createdat on message(createdat);

create table comment (
    id serial primary key,
    body text not null,
    approved boolean not null default false,
    email text,
    authorname text not null,
    authorid integer,
    messageid integer,
    createdat timestamp with time zone not null default now(),
    updatedat timestamp with time zone,
    constraint fk_comment_messageid foreign key (messageid) references message (id),
    constraint fk_message_accountid foreign key (authorid) references userinfo (id)
);
create index idx_comment_msgid on comment(messageid);

create table file (
    id serial primary key,
    name text not null,
    filepath text not null,
    contenttype text not null default 'application/octet-stream',
    ownerid integer not null,
    ownername text not null,
    ispublic boolean not null default TRUE,
    createdat timestamp with time zone not null default now(),
    updatedat timestamp with time zone,
    constraint fk_file_accountid foreign key (ownerid) references userinfo (id)
);

create table statistic (
    id serial primary key,
    tablename text not null,
    statname text not null,
    value text not null,
    createdat timestamp with time zone not null default now(),
    updatedat timestamp with time zone,
    unique(tablename, statname)
);
