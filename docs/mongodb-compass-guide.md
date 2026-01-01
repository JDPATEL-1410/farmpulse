# MongoDB Compass Connection Guide

Complete guide to connect to your MongoDB Atlas cluster and set up the FarmPulse database.

## Step 1: Download MongoDB Compass

1. Visit [MongoDB Compass Download Page](https://www.mongodb.com/try/download/compass)
2. Download the version for Windows
3. Install MongoDB Compass (follow the installation wizard)
4. Launch MongoDB Compass

## Step 2: Connect to MongoDB Atlas

### Connection String
```
mongodb+srv://JD1410:jdpatel1410@cluster0.pcsjosu.mongodb.net/?appName=Cluster0
```

### Connection Steps

1. **Open MongoDB Compass**
2. **Paste Connection String:**
   - In the "New Connection" screen, paste the connection string above
   - Click "Connect"

3. **Verify Connection:**
   - You should see "Cluster0" in the left sidebar
   - You'll see existing databases (admin, local, etc.)

> [!TIP]
> If connection fails, check:
> - Your internet connection
> - MongoDB Atlas IP whitelist (should allow connections from anywhere: `0.0.0.0/0`)
> - Username and password are correct

## Step 3: Create FarmPulse Database

1. **Create Database:**
   - Click the "+ Create Database" button
   - Database Name: `FarmPulse`
   - Collection Name: `users` (we'll add more collections next)
   - Click "Create Database"

2. **Verify Database Created:**
   - You should now see "FarmPulse" in the databases list
   - Click on it to expand and see the `users` collection

## Step 4: Create Collections

Create the following collections in the FarmPulse database:

### Method 1: Using Compass UI

1. Click on "FarmPulse" database
2. Click "+ Create Collection" button
3. Create each collection:
   - `farms`
   - `workers`
   - `workerTransactions`
   - `fertilizerExpenses`
   - `tractorExpenses`
   - `otherExpenses`

### Method 2: Using MongoDB Shell (Advanced)

1. Click on "FarmPulse" database
2. Click the "MongoDB Shell" tab at the bottom
3. Run these commands:

```javascript
db.createCollection("farms")
db.createCollection("workers")
db.createCollection("workerTransactions")
db.createCollection("fertilizerExpenses")
db.createCollection("tractorExpenses")
db.createCollection("otherExpenses")
```

## Step 5: Create Indexes for Performance

Indexes make database queries faster. Create these indexes:

### For `users` collection:

1. Click on `users` collection
2. Go to "Indexes" tab
3. Click "Create Index"
4. Add index:
   ```json
   { "username": 1 }
   ```
5. Check "Unique" option
6. Click "Create Index"

### For `farms` collection:

Create index:
```json
{ "userId": 1 }
```

### For `workers` collection:

Create compound index:
```json
{ "farmId": 1, "userId": 1 }
```

### For `workerTransactions` collection:

Create index:
```json
{ "workerId": 1 }
```

### For expense collections (fertilizerExpenses, tractorExpenses, otherExpenses):

Create compound index for each:
```json
{ "farmId": 1, "date": -1 }
```

> [!NOTE]
> The `-1` means descending order (newest first), `1` means ascending order

## Step 6: Add Validation Schemas (Optional but Recommended)

Validation ensures data integrity. Here's how to add validation for the `users` collection:

1. Click on `users` collection
2. Go to "Validation" tab
3. Click "Add Validation"
4. Select "JSON Schema"
5. Add this schema:

```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["username", "password", "role"],
    "properties": {
      "username": {
        "bsonType": "string",
        "description": "Username must be a string and is required"
      },
      "password": {
        "bsonType": "string",
        "description": "Hashed password must be a string and is required"
      },
      "role": {
        "enum": ["ADMIN", "MANAGER"],
        "description": "Role must be either ADMIN or MANAGER"
      }
    }
  }
}
```

6. Set Validation Level: "Strict"
7. Set Validation Action: "Error"
8. Click "Update"

### Validation Schema for `farms`:

```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["userId", "name", "location", "areaSize", "season"],
    "properties": {
      "userId": {
        "bsonType": "objectId",
        "description": "Reference to user who owns this farm"
      },
      "name": {
        "bsonType": "string",
        "description": "Farm name"
      },
      "location": {
        "bsonType": "string",
        "description": "Farm location"
      },
      "areaSize": {
        "bsonType": "number",
        "minimum": 0,
        "description": "Farm area size in acres"
      },
      "season": {
        "bsonType": "string",
        "description": "Current season"
      },
      "createdAt": {
        "bsonType": "date",
        "description": "Creation timestamp"
      }
    }
  }
}
```

## Step 7: View and Manage Data

### Insert Sample Document (Testing)

1. Click on `users` collection
2. Click "Add Data" → "Insert Document"
3. Add a sample user:

```json
{
  "username": "testuser",
  "password": "$2a$10$abcdefghijklmnopqrstuv",
  "role": "ADMIN"
}
```

4. Click "Insert"

### Query Data

1. Click on any collection
2. Use the filter bar to search:
   - Find all admins: `{ "role": "ADMIN" }`
   - Find specific user: `{ "username": "testuser" }`
   - Find farms by user: `{ "userId": ObjectId("...") }`

### Update Documents

1. Click on a document
2. Click the "Edit" button (pencil icon)
3. Modify fields
4. Click "Update"

### Delete Documents

1. Click on a document
2. Click the "Delete" button (trash icon)
3. Confirm deletion

## Step 8: Monitor Database

### View Database Statistics

1. Click on "FarmPulse" database
2. You'll see:
   - Total collections
   - Total documents
   - Storage size
   - Indexes

### View Collection Statistics

1. Click on any collection
2. Go to "Schema" tab to see:
   - Field types
   - Data distribution
   - Sample documents

## Troubleshooting

### Connection Issues

**Problem:** Cannot connect to MongoDB Atlas

**Solutions:**
- Check if MongoDB Atlas cluster is running (login to MongoDB Atlas website)
- Verify IP whitelist includes your current IP or `0.0.0.0/0` for all IPs
- Check username and password are correct
- Ensure you have internet connection

### Authentication Failed

**Problem:** "Authentication failed" error

**Solutions:**
- Verify username: `JD1410`
- Verify password: `jdpatel1410`
- Check if user has proper permissions in MongoDB Atlas

### Slow Queries

**Problem:** Queries are slow

**Solutions:**
- Ensure indexes are created (Step 5)
- Check "Explain Plan" in Compass to see if indexes are being used
- Consider adding more specific indexes based on your query patterns

## Next Steps

After setting up MongoDB Compass:

1. ✅ Database and collections created
2. ✅ Indexes configured for performance
3. ✅ Validation schemas added (optional)
4. 📝 Proceed to backend implementation
5. 📝 Test API endpoints with real database
6. 📝 Deploy to production

## Additional Resources

- [MongoDB Compass Documentation](https://www.mongodb.com/docs/compass/current/)
- [MongoDB Query Language](https://www.mongodb.com/docs/manual/tutorial/query-documents/)
- [MongoDB Indexes](https://www.mongodb.com/docs/manual/indexes/)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
