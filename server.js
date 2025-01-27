const mongoose =  require('mongoose');
const express =  require('express')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express()

const cors = require('cors');
app.use(cors());
// const bodyPares =  require('body-parser');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 4000;
const User =  require("./model/User");
// console.log(User)

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any email service you use
  auth: {
    user: 'johnpetro335@gmail.com',
    pass: 'pbjh ttup hxxk lhuz', // Make sure to use an app password if you're using Gmail
  },
});





app.get('/us', (req, res) => {
  console.log('GET request to /us');
  res.send('Hello from /us');
});

app.post('/app', async (req, res) => {
    // console.log('Received request:', req.body);  // Log the request body
    // console.log("app")
    const { user_name,email,password,phone,amount } = req.body;
   try{
    let user = new User({
      username:user_name,
      password:password,
      email:email,
      phone:phone,
      amount:amount
      })
      user = await user.save()
      res.json(user);
   }catch(ex){
    console.log("eror"+ex)

   }
   
  });



  // handlle logins
app.post('/login', async(req,res)=>{
  const {email,password}=req.body
  if(email==""&&password=="")return res.status(401).json("do not enter null value")
  try{
    let result =  await User.find({email:email});
    if(!result)return res.status(401).json("Bad Request")
    const pass = result[0].password;
    if(pass==password){
    // return  res.status(200).json(result)//main return here
    const otp = crypto.randomInt(100000, 999999).toString();

    // Send OTP email
    const mailOptions = {
      from: 'johnpetro335@gmail,com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(500).json('Error sending OTP: ' + error);
      } else {
        return  res.status(200).json({"result":result,"otp":otp})//main return here
      }
    });
    }else{
     return  res.status(400).json("Incorrect Credential")
    }
    // res.status(200).json(result[0].)

  }catch(e){
   return  res.status(500).send("Incorrect email or password")

  }
   
})

app.get('/user/:phone',async(req,res)=>{
  // console.log('GET request to /us'+ req.params.phone);
  // res.send('Hello from /us');
  try{
 
 
    const phone =  req.params.phone;

    let user =  await User.find({phone:phone})
    if(!user)return res.status(400).json({"error":"User with such number not found"})
     return res.status(200).json(user)
    
    console.log(user)

  }catch(ex){
     res.status(500).json({"error":"Intenal server Error."})
  }
})

// app.post('/transfer',async(req,res)=>{
//   const {myId,phone,amount} = req.body;
//   try{
//     let user =  await User.find({_id:myId})
//     if(!user)return res.status(400).json({"error":"User with such number not found"})
//     //  console.log(user)
   
//     if(user[0].amount>amount){
//     let amountSum = user[0].amount-amount;
//     console.log(amountSum)
//     let data =  await User.findByIdAndUpdate(myId,{amount:amountSum},{new:true})
//     console.log(data)
//     if(data){
//        user =  await User.find({phone:phone})
//        amountTotal = user[0].amount+amount
//        let result =  await User.findByIdAndUpdate(user[0]._id,{amount:amountTotal},{new:true})
//        console.log(result)
//     }
//   }else{
//     res.status(400).json({"message":"No enought balance."})
//   }

//   }catch(ex){
//      res.status(500).json({"error":"Intenal server Error."})
//   }
  
// })


// app.post('/transfer', async (req, res) => {
//   const { myId, phone, amount } = req.body;
//   try {
//     // Fetch sender user by ID
//     let user = await User.findOne({ _id: myId });
//     if (!user) return res.status(400).json({ "error": "User with such ID not found" });

//     // Check if the sender has enough balance
//     if (user.amount > amount) {
//       // Deduct amount from sender
//       let amountSum = user.amount - amount;
//       console.log(amountSum);

//       let data = await User.findByIdAndUpdate(myId, { amount: amountSum }, { new: true });
//       console.log(data);

//       if (data) {
//         // Fetch recipient user by phone number
//         let recipient = await User.findOne({ phone: phone });
//         if (!recipient) return res.status(400).json({ "error": "Recipient user not found" });

//         // Add amount to recipient
//         let amountTotal = recipient.amount + amount;
//         let result = await User.findByIdAndUpdate(recipient._id, { amount: amountTotal }, { new: true });
//         console.log(result);
//         return res.status(200).json({ "message": "Transfer successful", result });
//       }
//     } else {
//       return res.status(400).json({ "message": "Not enough balance." });
//     }
//   } catch (ex) {
//     console.error(ex.message); // Log error for debugging
//     res.status(500).json({ "error": "Internal server error." });
//   }
// });
 

app.post('/transfer', async (req, res) => {
  const { myId, phone, amount } = req.body;

  try {
    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount." });
    }

    // Fetch sender
    let user = await User.findOne({ _id: myId });
    if (!user) return res.status(400).json({ error: "User with such ID not found" });

    let senderAmount = Number(user.amount);
    if (senderAmount < amount) {
      return res.status(400).json({ message: "Not enough balance." });
    }

    // Deduct from sender
    let amountSum = senderAmount - amount;
    await User.findByIdAndUpdate(myId, { amount: amountSum }, { new: true });

    // Fetch recipient
    let recipient = await User.findOne({ phone: phone });
    if (!recipient) return res.status(400).json({ error: "Recipient user not found" });

    // Add to recipient
    let recipientAmount = Number(recipient.amount);
    let amountTotal = recipientAmount + Number(amount);
    await User.findByIdAndUpdate(recipient._id, { amount: amountTotal }, { new: true });

    res.status(200).json({ message: "Transfer successful" });
  } catch (ex) {
    console.error(ex.message); // Log error for debugging
    res.status(500).json({ error: "Internal server error." });
  }
});


  

const  connectDB =  async ()=>{
    try{
        mongoose.connect("mongodb+srv://johnpetro335:z3IOOCaREDfqjl2w@cluster0.q0jvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
          .then(()=>console.log("Connected...."))
         .catch(err=>console.error("Failed to connect ...m.."+ err))
    }catch(error){
        console.log(error);

    }
}
connectDB()
app.listen(PORT,()=>console.log(`applicatin is running on port: ${PORT}`))
