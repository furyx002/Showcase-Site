const { MongoClient } = require('mongodb');

async function migrate() {
  const atlasUri = process.argv[2];
  
  if (!atlasUri) {
    console.error("\n❌ ERROR: Please provide your Atlas Connection String as an argument.");
    console.error("Example: node migrate-to-atlas.js \"mongodb+srv://user:pass@cluster.mongodb.net/sanitary_ware_store\"\n");
    process.exit(1);
  }

  const localUri = 'mongodb://127.0.0.1:27017/sanitary_ware_store';
  
  console.log("🚀 Starting Database Migration to Cloud...");

  let localClient;
  let atlasClient;

  try {
    // 1. Connect to Local DB
    console.log("1️⃣ Connecting to Local Database...");
    localClient = new MongoClient(localUri);
    await localClient.connect();
    const localDb = localClient.db();
    
    // 2. Connect to Atlas DB
    console.log("2️⃣ Connecting to Atlas Cloud Database...");
    atlasClient = new MongoClient(atlasUri);
    await atlasClient.connect();
    // Use the DB specified in the connection string (or fallback)
    const atlasDb = atlasClient.db();
    
    console.log(`Connected! Migrating to cloud database: ${atlasDb.databaseName}`);

    // 3. Get all collections from local
    const collections = await localDb.listCollections().toArray();
    
    for (let colInfo of collections) {
      const colName = colInfo.name;
      console.log(`\n📦 Migrating collection: ${colName}...`);
      
      const localCollection = localDb.collection(colName);
      const atlasCollection = atlasDb.collection(colName);
      
      const docs = await localCollection.find({}).toArray();
      
      if (docs.length > 0) {
        // Optional: clear target collection first to avoid duplicate key errors
        await atlasCollection.deleteMany({});
        
        await atlasCollection.insertMany(docs);
        console.log(`✅ Successfully copied ${docs.length} documents into ${colName}.`);
      } else {
        console.log(`⚠️ Collection ${colName} is empty. Skipping.`);
      }
    }

    console.log("\n🎉 MIGRATION COMPLETE! Your local data is now in the cloud.");
    
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
  } finally {
    if (localClient) await localClient.close();
    if (atlasClient) await atlasClient.close();
    process.exit(0);
  }
}

migrate();
