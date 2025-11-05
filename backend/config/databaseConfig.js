const mongoose = require('mongoose');

let databaseConfig=()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((error) => {
        console.log("Database connection failed", error); 
    })
}
module.exports=databaseConfig;