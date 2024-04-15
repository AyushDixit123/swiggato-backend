const express=require('express');
const { User }=require('./Database')
const schema = require('./Zod')
const cors=require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const app = express();app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173"
}));


const Port = 3000;
app.use(express.json());
const JWT_SECRET = '1234';

app.post("/signup", async (req, res) => {
    const inputData = {
        email: req.body.email,
        password: req.body.password
    };

    const validateData = schema.safeParse(inputData);
    if (!validateData.success) {
        return res.status(400).json({
            msg: "Data input is wrong"
        });
    }

    try {
        const userExist = await User.findOne({ email: inputData.email });
        if (userExist) {
        
            return res.status(400).json({
                msg: "Email already exists"
            });
        }

        const encryptedpass = await bcrypt.hash(inputData.password, 10);
        const newUser = await User.create({
            email: inputData.email,
            password: encryptedpass
        });

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
        newUser.token = token;
        await newUser.save();
        newUser.password = undefined;

        return res.status(201).json(newUser);
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});
app.post('/signin',async(req,res)=>{
    const inputData = {
        email: req.body.email,
        password: req.body.password
    };
    const validateData = schema.safeParse(inputData);
    if (!validateData.success) {
        return res.status(400).json({
            msg: "Data input is wrong"
        });
    }
    const userExist = await User.findOne({ email: inputData.email });
    if(!userExist){
        return res.status(400).json({
            msg:"email does not exist"
        })
    }
    const match=await bcrypt.compare(req.body.password,userExist.password)
    if(userExist && match){
       const token= jwt.sign(
            {id:userExist._id},
            JWT_SECRET,{
                expiresIn: "2h"
            }
        );
        userExist.token=token
        userExist.password=undefined
        return res.status(200).json({token})
    }
    

})



app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`)});

