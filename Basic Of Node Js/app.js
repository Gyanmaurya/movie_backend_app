const http= require("http");
const fs = require('fs');
const URL=require('url')
const userEvent=require("./Events/eventUserCustom")



const html=fs.readFileSync("./Template/index.html", 'utf8')
const productHtml=fs.readFileSync("./Template/product-list.html", 'utf8')
const productData = JSON.parse(fs.readFileSync("./Data/products.json",'utf8'));
const proDetailsHtml=fs.readFileSync("./Template/product-details.html", 'utf8')
// console.log(product)



function replaceHtml(Template,prod){
      
          let output = Template.replace("{{%IMAGE%}}",prod.productImage)
          output = output.replace("{{%MODELNAME%}}",prod.modelName)
          output = output.replace("{{%NAME%}}",prod.name)
          output = output.replace("{{%MODELNO%}}",prod.modelNumber)
          output = output.replace("{{%MODELNAME%}}",prod.size)
          output = output.replace("{{%CAMERA%}}",prod.camera)
          output = output.replace("{{%PRICE%}}",prod.price)
          output = output.replace("{{%COLOR%}}",prod.color)
          output = output.replace("{{%ID%}}",prod.id)
          
          return output;
   
}


const server=http.createServer((request,response)=>{
const {query,pathname:path} =URL.parse(request.url,true)
let =  request.url;
//   console.log(query.id,path)
 
if(path === "/" || path === "/Home"){
     response.writeHead(200,{
          'Content-Type':'text/html',
          "Gyan":"Hello gyan"
     })
     response.end(html.replace("{{%CONTENT%}}","This is home page"))

}
else if( path === "/About"){
     response.writeHead(200,{
          'Content-Type':'text/html',
          "Gyan":"Hello gyan"
     })
     response.end(html.replace("{{%CONTENT%}}","This is abour page"))
   
}
else if(path === "/Contact"){
     response.writeHead(200,{
          'Content-Type':'text/html',
          "Gyan":"Hello gyan"
     })
     response.end(html.replace("{{%CONTENT%}}","This is contact page"))
}
else if(path === "/Products"){
    if(!query.id){

    const productHtmlArray =  productData.map((pro)=>{
        return replaceHtml(productHtml,pro)
      })
     
     response.writeHead(200,{
          'Content-Type':'text/html',
          "Gyan":"Hello gyan"
     })
     // console.log(productHtmlArray.join(','))
     response.end(html.replace("{{%CONTENT%}}",productHtmlArray.join(' ')))
    }
    else{

//     let pdata= productData[query.id];
//      const proDetails=replaceHtml(proDetailsHtml,pdata);
//      // console.log(proDetails)
//      response.end(html.replace("{{%CONTENT%}}",proDetails))

      
    }
   
     
}
else{
     let pdata= productData[query.id];
     const proDetails=replaceHtml(proDetailsHtml,pdata);
     console.log(proDetails)
     response.end(html.replace("{{%CONTENT%}}",proDetails))
     // response.writeHead(404,{
     //      'Content-Type':'text/html',
     //      "Gyan":"Hello gyan page not found"
     // })
     // response.end(html.replace("{{%CONTENT%}}","page not found"))
}
})


const user = new userEvent();
user.on('created',(id,name)=>{
     console.log(`Emmiter created successfully at id: ${id} with ${name}` )
})
user.emit('created',4,"John")

// genral way to read files and store and then give the result takes lot time
// server.on('request',()=>{
//      let read=fs.readFileSync("path",(err,data)=>{
//         console.log(data)   
//         response.end()       
//      })
// })

// In stream way to read files and store and then give the result takes lot time

// server.on('request',(req,res)=>{
//     let rs=fs.createReadStream('files path');
//     rs.on('data',(chunk)=>{
//      rs.write(chunk)
    
//     })
//     rs.on('end',()=>{
//      resizeBy.end()
//     })
//     rs.on('error',(errr)=>{
// res.end(errr)
//     })
// })

// Here is pipe methode which help to balaced to read and write methods 

// server.on('request',(req,res)=>{
//     let rs=fs.createReadStream('files path');
//    rs.pipe(res)
// })


server.listen(8000,"127.0.0.1",()=>{
console.log("Sever is connected")
})



