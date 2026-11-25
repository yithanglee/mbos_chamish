// Imports only into an empty database. Existing data is never overwritten.
const fs = require('node:fs/promises');
const path = require('node:path');
const {Client} = require('pg');
const root = path.resolve(process.argv[2] || 'data/blog-export');
const tables = ['categories','brands','products','sections','slides','pages'];
function rewrite(value) {
  return typeof value === 'string' ? value.replace(/https?:\/\/blog\.damienslab\.com\/images\/uploads\//g,'/images/uploads/') : value;
}
(async()=>{
  const data=JSON.parse(await fs.readFile(path.join(root,'source.json'),'utf8'));
  const client=new Client({connectionString:process.env.DATABASE_URL});
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query(await fs.readFile(path.join(__dirname,'../deployment/linode/schema.sql'),'utf8'));
    for(const table of tables) {
      const {rows:[count]}=await client.query(`SELECT count(*) FROM "${table}"`);
      if(Number(count.count)) throw new Error(`Refusing to overwrite nonempty ${table}`);
      const {rows:columns}=await client.query('SELECT column_name FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2',['public',table]);
      const allowed=new Set(columns.map(c=>c.column_name));
      for(const row of data[table]) {
        const keys=Object.keys(row).filter(k=>allowed.has(k));
        await client.query(`INSERT INTO "${table}" (${keys.map(k=>'"'+k+'"').join(',')}) VALUES (${keys.map((_,i)=>'$'+(i+1)).join(',')})`,keys.map(k=>rewrite(row[k])));
      }
      console.log(`${table}: ${data[table].length}`);
    }
    await client.query('COMMIT');
  } catch(e) {await client.query('ROLLBACK');throw e;} finally {await client.end();}
})().catch(e=>{console.error(e.message);process.exitCode=1});
