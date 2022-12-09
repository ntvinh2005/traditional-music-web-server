const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')

const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const courseRouter = require('./routes/course')

const connectDB = async () =>{
    try{
        await mongoose.connect(
            'mongodb+srv://vinh:31320053132005@q-a-database.p0d1m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        console.log("MongoDB connected")
    } catch(error){
        console.log(error.message)
        process.exit(1)
    }
}

connectDB()

const app = express();

app.use(express.json())
app.use(cors())
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
    });
app.get("/", (req, res) => res.send('Hello world'))

app.use('/api/auth', authRouter)
app.use('/api/post', postRouter)
app.use('/api/course', courseRouter)

const PORT = process.env.PORT || 5000 

app.listen(PORT, () => console.log("Ready on PORT " + PORT))