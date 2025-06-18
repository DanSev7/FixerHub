const { createClient } = require('@supabase/supabase-js');

// const supabaseUrl = 'https://cqwjkhshvecdssmeimfn.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxd2praHNodmVjZHNzbWVpbWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NjEzNTQsImV4cCI6MjA1OTQzNzM1NH0.9qSArgPZ2WY1n_m6CwKMHWcJOI3IS3nOFSLFBrliBYw';
// const supabase = createClient(supabaseUrl, supabaseKey);

const supabaseUrl = 'https://rocybqlpxknfmpazibyn.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xd2VpanhoeWtyYnVpcGh0YmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NzA2ODksImV4cCI6MjA2NTA0NjY4OX0.yPclqcfzwaxozr_PFdyAcqVZ5yio__tHNF57lmzrJFE';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvY3licWxweGtuZm1wYXppYnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTg1MzEsImV4cCI6MjA1OTU5NDUzMX0.WG-d2q_xLOrnZKZSza8O1eWoIon0al-6TXGQJC6eKb4';
const supabase = createClient(supabaseUrl, supabaseKey);


module.exports = supabase;

