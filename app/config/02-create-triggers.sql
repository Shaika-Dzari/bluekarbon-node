-- Procedure to calculate stats
create or replace function calculate_statistics_message() returns trigger as $$
begin

    execute 'update  ' || TG_TABLE_SCHEMA || '.statistic set (value) = ' ||
            ' (select count(*) from ' || TG_TABLE_SCHEMA || '.message) where tablename = ''message'' and statname = ''total_count''';

    execute 'update ' || TG_TABLE_SCHEMA || '.statistic as s ' ||
            'set value = md.value ' ||
            'from (select d.code, count(*) as value from ' || TG_TABLE_SCHEMA || '.message m ' ||
            '   inner join ' || TG_TABLE_SCHEMA || '.module d on (m.moduleid = d.id) group by d.code) as md ' ||
            'where s.tablename = ''message'' ' ||
            '  and s.statname = lower(md.code) || ''_total_count''';

    return NEW;
end;
$$
LANGUAGE plpgsql
;

create or replace function calculate_statistics_file() returns trigger as $$
begin
    execute 'update ' || TG_TABLE_SCHEMA || '.statistic set (value) = ' ||
            '(select count(*) from ' || TG_TABLE_SCHEMA || '.file) where tablename = ''file'' and statname = ''total_count''';
    -- update statistic set (value) = (select count(*) from file) where tablename = 'file' and statname = 'total_count';
    return NEW;
end;
$$
LANGUAGE plpgsql
;

create or replace function calculate_statistics_comment() returns trigger as $$
begin
    execute 'update ' || TG_TABLE_SCHEMA || '.statistic set (value) = ' ||
            ' (select count(*) from ' || TG_TABLE_SCHEMA || '.comment) where tablename = ''comment'' and statname = ''total_count''';

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
