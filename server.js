const express = require("express");
const db = require('./db/connection');
const apiRoutes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use('/api',apiRoutes);

// Start server after db connection
db.connect((err)=>{
  if(err) throw err;
  console.log("Database Connected!");
  app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`);
  })
})