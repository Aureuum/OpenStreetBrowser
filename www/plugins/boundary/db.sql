drop table if exists osm_boundary;
create table osm_boundary (
  osm_id		text		not null,
  osm_tags		hstore		null,
  admin_level		int		not null,
  primary key(osm_id)
);
select AddGeometryColumn('osm_boundary', 'osm_way', 900913, 'LINESTRING', 2);
 
select assemble_boundary(id) from
  (select way_id as id from way_tags where k='boundary' and v in ('administrative', 'political')
  union
  select relation_members.member_id from relation_members join relation_tags on relation_members.relation_id=relation_tags.relation_id where relation_tags.k='boundary' and relation_tags.v='administrative' and relation_members.member_type='W'
) x;

create index osm_boundary_way_tags on osm_boundary using gist(osm_way, osm_tags);
