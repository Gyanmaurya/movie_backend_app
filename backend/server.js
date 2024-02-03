
process.on('uncaughtException',(err)=>{
     console.log(err.message, err.name)
     process.exit(1)
    })
const app = require('./app.js')
const { connectDB } = require('./config/db.js')
const PORT = process.env.PORT || 8000


// console.log(process.env)


const server = app.listen(PORT,()=>{
     connectDB()
     console.log(`Listening at the port ${PORT}`)
})

process.on('unhandledRejection',(err)=>{
     console.log(err.message,err.name)
     server.close(()=>{
          console.log('server closed ')
          process.exit(1)
     })
     
})

