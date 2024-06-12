use local_library_pp;

delimiter //

drop function if exists get_author_id_by_last_name;
create function get_author_id_by_last_name(in last_name varchar(255)) returns int
begin
    return (select id from author where author.last_name like concat('%', last_name, '%'));
end //

drop function if exists get_book_id_by_title;
create function get_book_id_by_title(in title varchar(255)) returns int
begin
    return (select id from book where book.title like concat('%', title, '%'));
end //

drop function if exists get_genre_id_by_name;
create function get_genre_id_by_name(in name varchar(255)) returns int
begin
    return (select id from genre where genre.name like concat('%', name, '%'));
end //

drop function if exists get_status_id_by_name;
create function get_status_id_by_name(in name varchar(255)) returns int
begin
    return (select id from status where status.name like concat('%', name, '%'));
end //

delimiter ;

drop table if exists author;
create table author
(
    id            int          not null auto_increment,
    first_name    varchar(255) not null,
    last_name     varchar(255) not null,
    date_of_birth date         not null,
    date_of_death date,
    created_at    timestamp    not null default current_timestamp,
    updated_at    timestamp    not null default current_timestamp on update current_timestamp,
    primary key (id)
);

drop table if exists book;
create table book
(
    id         int          not null auto_increment,
    author_id  int          not null,
    title      varchar(255) not null,
    summary    text         not null,
    isbn       varchar(255) not null,
    created_at timestamp    not null default current_timestamp,
    updated_at timestamp    not null default current_timestamp on update current_timestamp,
    primary key (id),
    foreign key (author_id) references author (id) on delete cascade
);

drop table if exists status;
create table status
(
    id         int          not null auto_increment,
    name       varchar(255) not null,
    created_at timestamp    not null default current_timestamp,
    updated_at timestamp    not null default current_timestamp on update current_timestamp,
    primary key (id)
);

drop table if exists copy;
create table copy
(
    id         int          not null auto_increment,
    book_id    int          not null,
    status_id  int          not null,
    imprint    varchar(255) not null,
    due_back   date,
    created_at timestamp    not null default current_timestamp,
    updated_at timestamp    not null default current_timestamp on update current_timestamp,
    primary key (id),
    foreign key (book_id) references book (id) on delete cascade,
    foreign key (status_id) references status (id) on delete cascade
);

drop table if exists genre;
create table genre
(
    id         int          not null auto_increment,
    name       varchar(255) not null,
    created_at timestamp    not null default current_timestamp,
    updated_at timestamp    not null default current_timestamp on update current_timestamp,
    primary key (id)
);

drop table if exists book_genre_relation;
create table book_genre_relation
(
    id         int       not null auto_increment,
    book_id    int       not null,
    genre_id   int       not null,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp on update current_timestamp,
    primary key (id),
    unique (book_id, genre_id),
    foreign key (book_id) references book (id) on delete cascade,
    foreign key (genre_id) references genre (id) on delete cascade
);

insert into author (first_name, last_name, date_of_birth, date_of_death)
values ('Patrick', 'Rothfuss', '1973-06-06', null),
       ('Ben', 'Bova', '1932-11-08', null),
       ('Isaac', 'Asimov', '1920-01-02', '1992-04-06'),
       ('Bob', 'Billings', '1915-05-18', '1980-10-08'),
       ('Jim', 'Jones', '1971-12-16', null);

insert into genre (name)
values ('Fantasy'),
       ('Science Fiction'),
       ('French Poetry');

insert into book (title, author_id, summary, isbn)
values ('The Name of the Wind (The Kingkiller Chronicle, #1)',
        get_author_id_by_last_name('Rothfuss'),
        'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.',
        '9781473211896'),
       ('The Wise Man\'s Fear (The Kingkiller Chronicle, #2)',
        get_author_id_by_last_name('Rothfuss'),
        'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.',
        '9788401352836'),
       ('The Slow Regard of Silent Things (Kingkiller Chronicle)',
        get_author_id_by_last_name('Rothfuss'),
        'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.',
        '9780756411336'),
       ('Apes and Angels',
        get_author_id_by_last_name('Bova'),
        'Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...',
        '9780765379528'),
       ('Death Wave',
        get_author_id_by_last_name('Bova'),
        'In Ben Bova\'s previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...',
        '9780765379504'),
       ('Test Book 1',
        get_author_id_by_last_name('Jones'),
        'Summary of test book 1',
        'ISBN111111');

insert into book_genre_relation (book_id, genre_id)
values (get_book_id_by_title('The Name of the Wind (The Kingkiller Chronicle, #1)'),
        get_genre_id_by_name('Fantasy')),
       (get_book_id_by_title('The Wise Man''s Fear (The Kingkiller Chronicle, #2)'),
        get_genre_id_by_name('Fantasy')),
       (get_book_id_by_title('The Slow Regard of Silent Things (Kingkiller Chronicle)'),
        get_genre_id_by_name('Fantasy')),
       (get_book_id_by_title('Apes and Angels'),
        get_genre_id_by_name('Science Fiction')),
       (get_book_id_by_title('Death Wave'),
        get_genre_id_by_name('Science Fiction')),
       (get_book_id_by_title('Test Book 1'),
        get_genre_id_by_name('Fantasy')),
       (get_book_id_by_title('Test Book 1'),
        get_genre_id_by_name('Science Fiction'));

insert into status (name)
values ('Available'),
       ('Maintenance'),
       ('Loaned');

insert into copy (book_id, imprint, due_back, status_id)
values (get_book_id_by_title('The Name of the Wind (The Kingkiller Chronicle, #1)'),
        'London Gollancz, 2014.', null, get_status_id_by_name('Available')),
       (get_book_id_by_title('The Wise Man''s Fear (The Kingkiller Chronicle, #2)'),
        'Gollancz, 2011.', null, get_status_id_by_name('Loaned')),
       (get_book_id_by_title('The Slow Regard of Silent Things (Kingkiller Chronicle)'),
        'Gollancz, 2015.', null, get_status_id_by_name('Available')),
       (get_book_id_by_title('Apes and Angels'), 'New York Tom Doherty Associates, 2016.', null,
        get_status_id_by_name('Available')),
       (get_book_id_by_title('Apes and Angels'), 'New York Tom Doherty Associates, 2016.', null,
        get_status_id_by_name('Available')),
       (get_book_id_by_title('Apes and Angels'), 'New York Tom Doherty Associates, 2016.', null,
        get_status_id_by_name('Available')),
       (get_book_id_by_title('Death Wave'), 'New York, NY Tom Doherty Associates, LLC, 2015.', null,
        get_status_id_by_name('Available')),
       (get_book_id_by_title('Death Wave'), 'New York, NY Tom Doherty Associates, LLC, 2015.', null,
        get_status_id_by_name('Maintenance')),
       (get_book_id_by_title('Death Wave'), 'New York, NY Tom Doherty Associates, LLC, 2015.', null,
        get_status_id_by_name('Loaned')),
       (get_book_id_by_title('The Name of the Wind (The Kingkiller Chronicle, #1)'), 'Imprint XXX2',
        null, get_status_id_by_name('Available')),
       (get_book_id_by_title('The Wise Man''s Fear (The Kingkiller Chronicle, #2)'), 'Imprint XXX3',
        null, get_status_id_by_name('Loaned'));
