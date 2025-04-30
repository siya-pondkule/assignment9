const cassandra = require("cassandra-driver");

// Replace 'localhost' with the name of your Docker container if you're using Docker Compose
const client = new cassandra.Client({
  contactPoints: ["127.0.0.1"], // or use ['cassandra'] if in Docker Compose
  localDataCenter: "datacenter1", // default for Cassandra Docker
  keyspace: "industry", // replace with your keyspace
});

async function connectToCassandra() {
  try {
    await client.connect();
    console.log("Connected to Cassandra");
  } catch (err) {
    console.error("Error connecting to Cassandra", err);
  }
}

module.exports = { client, connectToCassandra };
