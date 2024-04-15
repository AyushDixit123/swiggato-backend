const mongoose = require('mongoose');
require('dotenv').config();


const User = mongoose.model('User_food', {

    email: String,
    password: String,
    token: String
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    // Once the connection is established, create and save the user
    const user1 = new User({
        email: "Ayush@itbhu.ac.in",
        password: "1234"
    });
    
    user1.save()
      .then(savedUser => {
        console.log("User saved successfully:", savedUser);
      })
      .catch(error => {
        console.error("Error saving user:", error);
      });
      
    
    
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports={
    User
}
 