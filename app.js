const express=require ('express');
const jwt= require('jsonwebtoken');
const cookieParser= require('cookie-parser');
const app=express();

app.use(express.json());
app.use(cookieParser());

const SECRET_KEY= "secret_shh123";
const credentials=[
    {username:'admin', password:'password123'}
]

app.post('/login',(req,res)=>{
    const {username, password}= req.body;
    const current_user= credentials.find(user=>user.username===username && user.password===password);
    if(!current_user)
    {
        return res.status(401).json({message: "Invalid credentials"});
    }
    const token= jwt.sign({username: current_user.username}, SECRET_KEY, {expiresIn:'10m'});
    console.log(token);
    res.cookie('token_authorization', token,{
        httpOnly:true,
        secure:true,
        maxAge:10*60*1000

    })
    res.json({token});
   
})

app.get('/protected',(req,res)=>{
    const token= req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized"});

    }
    try{
        const decoded_user= jwt.verify(token, SECRET_KEY);
        res.json({message:`Welcome to your dashboard ${decoded_user.username}`});
    }
    catch(error){
        res.status(401).json({message:"Unauthorized"});
    }
})
const PORT=3000;
app.listen(PORT, ()=>{
    console.log (`Server in ruuning on port ${PORT}`);
})