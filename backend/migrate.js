const mongoose = require('mongoose');

const localUri = 'mongodb://127.0.0.1:27017/sanitary_ware_store';
const atlasUri = 'mongodb+srv://farhanrashid938_db_user:furyisop56@cluster0.xxwpfch.mongodb.net/sanitary_ware_store?retryWrites=true&w=majority&appName=Cluster0';

async function migrate() {
  console.log('Connecting to Local DB...');
  const localDb = await mongoose.createConnection(localUri).asPromise();
  
  console.log('Connecting to Atlas DB...');
  const atlasDb = await mongoose.createConnection(atlasUri).asPromise();

  // Get collections from local
  const collections = await localDb.db.listCollections().toArray();
  
  for (let collInfo of collections) {
    const collName = collInfo.name;
    console.log(`Migrating collection: ${collName}...`);
    
    const localCollection = localDb.collection(collName);
    const atlasCollection = atlasDb.collection(collName);
    
    const docs = await localCollection.find({}).toArray();
    
    if (docs.length > 0) {
      // Clear atlas collection first to avoid duplicates
      await atlasCollection.deleteMany({});
      await atlasCollection.insertMany(docs);
      console.log(`  -> Copied ${docs.length} documents.`);
    } else {
      console.log(`  -> No documents found.`);
    }
  }

  console.log('Migration Complete!');
  process.exit(0);
}

migrate().catch(console.error);
