const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect("mongodb+srv://hmtsyrk:426485.h-m@cluster0-2rrr3.mongodb.net/test?retryWrites=true&w=majority", { useMongoClient: true });
    mongoose.connection.on("open", () => {
        console.log("MongoDb Connected");
    });
    mongoose.connection.on("error", () => {
        console.log("MongoDb Error: ", error);
    });

    mongoose.Promise = global.Promise;
    
};