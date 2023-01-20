\c fmrn_express_db

create table if not exists expenses (
    expense_id serial primary key,
    expense_name varchar(255) not null,
    expense_value integer not null,
    expense_description text,
    expense_date date,
    token varchar(255) not null
);

create table if not exists incomes (
    income_id serial primary key,
    income_name varchar(255) not null,
    income_value integer not null,
    income_description text,
    income_date date,
    token varchar(255) not null
);

    create table if not exists users (
        user_id serial primary key,
        user_name varchar(255) not null,
        user_email varchar(255) not null,
        user_password varchar(255) not null,
        user_token varchar(255)
    );