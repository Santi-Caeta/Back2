import express from 'express'
import path from 'path'
import mongoose from "mongoose"
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import session from 'express-session'
import { create } from 'express-handlebars'
import indexRouter from './routes/indexRoutes.js'
import initializatePassport from './config/passport.js'
import dotenv from 'dotenv';
import __dirname from './path.js'


dotenv.config();

const username = encodeURIComponent(process.env.USERNAME)
const password = encodeURIComponent(process.env.PASSWORD)

const dbnameuri = `mongodb+srv://${username}:${password}@cluster0.ttxoa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const app = express()
const PORT = 8080 
const hbs = create()

app.use(express.json())
app.use(cookieParser(process.env.SECRET_COOKIE))
app.use(session({
    store: MongoStore.create({
        mongoUrl: dbnameuri,
        ttl: 25
    }),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true
}))

mongoose.connect(dbnameuri)
.then(() => console.log("DB is connected"))
.catch((e) => console.log(e))

initializatePassport()
app.use(passport.initialize())
app.use(passport.session())
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})