# How to run?
1. Install npm
2. Clone the Github Repository
3. In the CLI run the following commands
```
npm i
npm start
```

# Folders

### Models
- Schema for model "Order"
```
Order: {
  orderedBy: String
  capacity: Number
  date: Date
}
```

### Routes
- API Endpoints for "orders"
 1. GET '/' : View all Orders
 2. POST '/add': Add a new Order
 3. PUT '/update/:id' : Update an existing Order using its `_id`
 4. GET '/capacity' : Get Capacity (litres) of Milk `grouped by date`
 5. GET '/checkCapactity/:date' : Get milk left (MAX_CAPACITY - Milk ordered on that date)
 6. DELETE '/delete/:id' : Delete an existing order

### Test
- Contains a VSCode Test File (REST Client for Testing APIs). Tests are already written, you can add your custom tests.

# Files

### Index.js
- Mongoose Connection (Database: MongoDB)
- Express App (Default Port 5000)

### Package.json
- Dependencies, Libraries, Scripts, etc.
