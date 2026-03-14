require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await mongoose.connection.db.collection('users')
    .find({}, { projection: { email: 1, role: 1, name: 1 } })
    .toArray();
  console.log('\nUsers in database:');
  users.forEach(u => console.log(`  - ${u.email}  (role: ${u.role}, name: ${u.name})`));
  await mongoose.disconnect();
}
run().catch(e => { console.error(e.message); process.exit(1); });
