-- TechFind fictional demo fixtures
-- Base records only: zones, units, brand groups, brands, issues

insert into public.service_zone (id, name, slug, display_order, active)
values
  ('10000000-0000-4000-8000-000000000001', 'North', 'north', 1, true),
  ('10000000-0000-4000-8000-000000000002', 'South', 'south', 2, true),
  ('10000000-0000-4000-8000-000000000003', 'Central', 'central', 3, true);

insert into public.unit (
    id,
    name,
    slug,
    is_built_in,
    can_be_stacked,
    can_be_commercial,
    can_be_gas,
    display_order,
    active
)
values
     (
    '11000000-0000-4000-8000-000000000001',
    'Washer',
    'washer',
    false,
    true,
    true,
    false,
    1,
    true
  ),
  (
    '11000000-0000-4000-8000-000000000002',
    'Dryer',
    'dryer',
    false,
    true,
    true,
    true,
    2,
    true
  ),
  (
    '11000000-0000-4000-8000-000000000003',
    'Refrigerator',
    'refrigerator',
    false,
    false,
    true,
    false,
    3,
    true
  ),
  (
    '11000000-0000-4000-8000-000000000004',
    'Stove',
    'stove',
    false,
    false,
    true,
    true,
    4,
    true
  ),
  (
    '11000000-0000-4000-8000-000000000005',
    'Wall Oven',
    'wall-oven',
    true,
    false,
    true,
    false,
    5,
    true
  ),
  (
    '11000000-0000-4000-8000-000000000006',
    'Legacy Dishwasher',
    'legacy-dishwasher',
    false,
    false,
    true,
    false,
    6,
    false
  );

insert into public.brand_group (id, name, slug, active, display_order)
values
  (
    '12000000-0000-4000-8000-000000000001',
    'Standard',
    'standard',
    true,
    1
  ),
  (
    '12000000-0000-4000-8000-000000000002',
    'Premium',
    'premium',
    true,
    2
  );

insert into public.brand (id, name, slug, group_id, active)
values
  (
    '13000000-0000-4000-8000-000000000001',
    'Whirlpool',
    'whirlpool',
    '12000000-0000-4000-8000-000000000001',
    true
  ),
  (
    '13000000-0000-4000-8000-000000000002',
    'Bosch',
    'bosch',
    '12000000-0000-4000-8000-000000000002',
    true
  ),
  (
    '13000000-0000-4000-8000-000000000003',
    'Samsung',
    'samsung',
    '12000000-0000-4000-8000-000000000001',
    true
  ),
  (
    '13000000-0000-4000-8000-000000000004',
    'LG',
    'lg',
    '12000000-0000-4000-8000-000000000001',
    true
  );
    
insert into public.specific_issue (id, name, slug, unit_id, active)
values
  (
    '14000000-0000-4000-8000-000000000001',
    'Compressor Replacement',
    'compressor-replacement',
    '11000000-0000-4000-8000-000000000003',
    true
  ),
  (
    '14000000-0000-4000-8000-000000000002',
    'Dryer Taking Several Cycles to Dry',
    'dryer-taking-several-cycles-to-dry',
    '11000000-0000-4000-8000-000000000002',
    true
  );

insert into public.technician (
  id,
  name,
  alias,
  active,
  notes,
  can_service_built_in,
  gas,
  commercial,
  can_service_stacked_washer,
  can_service_stacked_dryer,
  jobs_per_day,
  home_zip_code
)
values
  (
    '15000000-0000-4000-8000-000000000001',
    'Alex Demo',
    'Alex',
    true,
    'Demonstrates stacked washer and dryer matching.',
    false,
    false,
    false,
    true,
    true,
    '2-3',
    '00001'
  ),
  (
    '15000000-0000-4000-8000-000000000002',
    'Morgan Demo',
    'Morgan',
    true,
    'Has a qualifying skill but ignores LG.',
    false,
    false,
    false,
    false,
    false,
    '2-3',
    '00002'
  ),
  (
    '15000000-0000-4000-8000-000000000003',
    'Casey Demo',
    'Casey',
    true,
    'Demonstrates refrigerator issue matching.',
    false,
    false,
    false,
    false,
    false,
    '1-2',
    '00003'
  ),
  (
    '15000000-0000-4000-8000-000000000004',
    'Riley Demo',
    'Riley',
    true,
    'Demonstrates built-in wall oven matching.',
    true,
    false,
    false,
    false,
    false,
    '2-3',
    '00004'
  ),
  (
    '15000000-0000-4000-8000-000000000005',
    'Jordan Demo',
    'Jordan',
    true,
    'Demonstrates commercial dryer issue matching.',
    false,
    false,
    true,
    false,
    true,
    '3-4',
    '00005'
  ),
  (
    '15000000-0000-4000-8000-000000000006',
    'Taylor Demo',
    'Taylor',
    true,
    'Demonstrates gas stove matching.',
    false,
    true,
    false,
    false,
    false,
    '2-3',
    '00006'
  ),
  (
    '15000000-0000-4000-8000-000000000007',
    'Archived Demo',
    'Archived',
    false,
    'Management-only archived technician.',
    false,
    false,
    false,
    false,
    false,
    '1-2',
    '00007'
  );

update public.technician
set
  active = false,
  archived_at = '2026-01-15T12:00:00Z'::timestamptz,
  archived_by = null,
  active_before_archive = true
where id = '15000000-0000-4000-8000-000000000007';

insert into public.technician_service_zone (technician_id, zone_id)
values
  (
    '15000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001'
  ),
  (
    '15000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000001'
  ),
  (
    '15000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000002'
  ),
  (
    '15000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000003'
  ),
  (
    '15000000-0000-4000-8000-000000000005',
    '10000000-0000-4000-8000-000000000002'
  ),
  (
    '15000000-0000-4000-8000-000000000006',
    '10000000-0000-4000-8000-000000000003'
  ),
  (
    '15000000-0000-4000-8000-000000000007',
    '10000000-0000-4000-8000-000000000002'
  );

insert into public.technician_skill_set (
  id,
  technician_id,
  unit_id,
  brand_group_id,
  specific_issue_id,
  commercial
)
values
  -- Alex: standard Washer and Dryer
  (
    '16000000-0000-4000-8000-000000000001',
    '15000000-0000-4000-8000-000000000001',
    '11000000-0000-4000-8000-000000000001',
    '12000000-0000-4000-8000-000000000001',
    null,
    false
  ),
  (
    '16000000-0000-4000-8000-000000000002',
    '15000000-0000-4000-8000-000000000001',
    '11000000-0000-4000-8000-000000000002',
    '12000000-0000-4000-8000-000000000001',
    null,
    false
  ),

  -- Morgan: Washer skill, but LG is ignored separately
  (
    '16000000-0000-4000-8000-000000000003',
    '15000000-0000-4000-8000-000000000002',
    '11000000-0000-4000-8000-000000000001',
    '12000000-0000-4000-8000-000000000001',
    null,
    false
  ),

  -- Casey: base Refrigerator skill and Compressor Replacement issue
  (
    '16000000-0000-4000-8000-000000000004',
    '15000000-0000-4000-8000-000000000003',
    '11000000-0000-4000-8000-000000000003',
    '12000000-0000-4000-8000-000000000001',
    null,
    false
  ),
  (
    '16000000-0000-4000-8000-000000000005',
    '15000000-0000-4000-8000-000000000003',
    '11000000-0000-4000-8000-000000000003',
    null,
    '14000000-0000-4000-8000-000000000001',
    false
  ),

  -- Riley: Premium Wall Oven skill
  (
    '16000000-0000-4000-8000-000000000006',
    '15000000-0000-4000-8000-000000000004',
    '11000000-0000-4000-8000-000000000005',
    '12000000-0000-4000-8000-000000000002',
    null,
    false
  ),

  -- Jordan: commercial Dryer skill and Dryer issue skill
  (
    '16000000-0000-4000-8000-000000000007',
    '15000000-0000-4000-8000-000000000005',
    '11000000-0000-4000-8000-000000000002',
    null,
    null,
    true
  ),
  (
    '16000000-0000-4000-8000-000000000008',
    '15000000-0000-4000-8000-000000000005',
    '11000000-0000-4000-8000-000000000002',
    null,
    '14000000-0000-4000-8000-000000000002',
    false
  ),

  -- Taylor: Standard Stove skill
  (
    '16000000-0000-4000-8000-000000000009',
    '15000000-0000-4000-8000-000000000006',
    '11000000-0000-4000-8000-000000000004',
    '12000000-0000-4000-8000-000000000001',
    null,
    false
  );

insert into public.technician_ignore_list (
  id,
  technician_id,
  brand_id,
  unit_id,
  specific_issue_id
)
values
  (
    '17000000-0000-4000-8000-000000000001',
    '15000000-0000-4000-8000-000000000002',
    '13000000-0000-4000-8000-000000000004',
    null,
    null
  );