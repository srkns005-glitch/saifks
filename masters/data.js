let database=null;
export async function loadDatabase(){
  if(database) return database;
  const response=await fetch('data/masters.json',{cache:'no-store'});
  if(!response.ok) throw new Error('Master database failed to load');
  database=await response.json();
  return database;
}
export function findMaster(db,id){
  return db.masters.find(master=>master.id===id)??db.masters[0];
}
