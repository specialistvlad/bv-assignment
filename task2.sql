--PostgreSQL 9.5
--'\\' is a delimiter


DROP TABLE IF EXISTS flights\\
DROP TABLE IF EXISTS airlines\\
DROP TABLE IF EXISTS airports\\
            
CREATE TABLE if not exists airports(id serial primary key, name VARCHAR, code VARCHAR, address VARCHAR)\\
CREATE TABLE if not exists airlines(id serial primary key, name VARCHAR, abbreviation VARCHAR)\\
CREATE TABLE if not exists flights(
    id serial primary key,
    number VARCHAR,
    origin_id INTEGER REFERENCES airports(id),
    destination_id INTEGER REFERENCES airports(id),
    airline_id INTEGER REFERENCES airlines(id),
    duration INTEGER,
    distance INTEGER,
    price MONEY
)\\


INSERT INTO airports (name, code, address) VALUES ('Kyiv Borispol', 'KBP', 'some address')\\
INSERT INTO airports (name, code, address) VALUES ('Kyiv Zhulyani', 'IEV', 'some address1')\\
INSERT INTO airports (name, code, address) VALUES ('London Luton', 'LTN', 'some address2')\\
INSERT INTO airports (name, code, address) VALUES ('Colombo airport', 'CMB', 'some address3')\\

INSERT INTO airlines (name, abbreviation) VALUES ('Ukrainian airlines', 'MAU')\\
INSERT INTO airlines (name, abbreviation) VALUES ('Wiz Air', 'WZA')\\
INSERT INTO airlines (name, abbreviation) VALUES ('American airlines', 'AMA')\\

INSERT INTO flights (number, origin_id, destination_id, airline_id, duration, distance, price)
    VALUES ('KBPLTNMAU', 1, 3, 1, 110, 700, 250)\\
INSERT INTO flights (number, origin_id, destination_id, airline_id, duration, distance, price)
    VALUES ('KBPLTNWZA', 1, 3, 2, 105, 300, 350)\\
INSERT INTO flights (number, origin_id, destination_id, airline_id, duration, distance, price)
    VALUES ('KBPLTNAMA', 1, 3, 3, 90, 1500, 750)\\
INSERT INTO flights (number, origin_id, destination_id, airline_id, duration, distance, price)
    VALUES ('KBPCMBWZA', 1, 4, 2, 105, 300, 350)\\
INSERT INTO flights (number, origin_id, destination_id, airline_id, duration, distance, price)
    VALUES ('KBPCMBAMA', 1, 4, 3, 90, 1500, 750)\\
    
select f.number as "Flight number", duration from flights f
    join airports oa on f.origin_id = oa.id
    join airports da on f.destination_id = da.id
    where oa.code = 'KBP' AND da.code = 'LTN'
    order by duration ASC
    LIMIT 1\\
    
select
    DISTINCT ON (al.name)
    oa.code as "Origin airport code",
    da.code as "Destination airport code",
    al.name as "Airport name",
    al.abbreviation as "Airport abbreviation"
    from flights f
    join airports oa on f.origin_id = oa.id
    join airports da on f.destination_id = da.id
    join airlines al on f.airline_id = al.id
    where oa.code = 'KBP'
    group by oa.code, da.code, al.name, al.abbreviation\\
 
select al.name as duration, cast((cast(distance as decimal) / cast(duration as decimal)) * 60 as integer) as "flight_speed" from flights f
    join airlines al on f.airline_id = al.id
    group by al.name, distance, duration
    order by flight_speed desc
    \\
