-- Basic Modules
insert into module(code, name, moduleorder, enablecomment, enablecategory) values('BLOG', 'Blog', 0, true, true);
insert into module(code, name, moduleorder, enablecomment, enablecategory) values('STORY', 'Stories', 1, true, true);
insert into module(code, name, moduleorder, enablecomment, enablecategory) values('PROJECT', 'Projects', 2, true, false);
insert into module(code, name, moduleorder, enablemodule, enablecomment, enablecategory) values('ABOUT', 'About', 3, false, false, false);

-- Default Categories
with module_blog as ( select * from module where code = 'BLOG' ),
cats as (
    select 'Development' as name union all
    select 'Movie' union all
    select 'Book' union all
    select 'Blog'
)
insert into category(name, moduleid)
select c.name, m.id
from cats c, module_blog m
;

-- Statistic
insert into statistics(tablename, statistic, value) values('file', 'total_count', '0');
insert into statistics(tablename, statistic, value) values('message', 'total_count', '0');
insert into statistics(tablename, statistic, value) values('comment', 'total_count', '0');

-- Default / disabled account
insert into userinfo(username, password, displayname, email, role, enabled)
values('admin@system', '-', 'System', 'admin@system', 'author', false);

-- Welcome message
with module_blog as ( select * from module where code = 'BLOG' ),
default_account as ( select * from userinfo where username = 'admin@system' )
insert into message(title, body, html, published, authorname, authorid, prettyurl, moduleid)
select 'Welcome', 'Welcome to your blog!', '<p>Welcome to your blog!</p>', true, a.displayname, a.id, '/welcome', m.id
from module_blog m, default_account a;
