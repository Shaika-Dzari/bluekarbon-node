-- Procedure to calculate stats
create or replace function calculate_statistics_message() returns trigger as $$
begin
    update statistics set (value) = (select count(*) from message) where tablename = 'message' and statistic = 'total_count';
    return NEW;
end;
$$
LANGUAGE plpgsql
;

create or replace function calculate_statistics_file() returns trigger as $$
begin
    update statistics set (value) = (select count(*) from file) where tablename = 'file' and statistic = 'total_count';
    return NEW;
end;
$$
LANGUAGE plpgsql
;

create or replace function calculate_statistics_comment() returns trigger as $$
begin
    update statistics set (value) = (select count(*) from comment) where tablename = 'comment' and statistic = 'total_count';
    return NEW;
end;
$$
LANGUAGE plpgsql
;

-- Triggers to calculate statistics automatically
create trigger trg_message_insert_stats after insert on message execute Procedure calculate_statistics_message();
create trigger trg_message_delete_stats after delete on message execute Procedure calculate_statistics_message();

create trigger trg_file_insert_stats after insert on file execute Procedure calculate_statistics_file();
create trigger trg_file_delete_stats after delete on file execute Procedure calculate_statistics_file();

create trigger trg_comment_insert_stats after insert on comment execute Procedure calculate_statistics_comment();
create trigger trg_comment_delete_stats after delete on comment execute Procedure calculate_statistics_comment();
