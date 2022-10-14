const express = require('express');
const bodyParser = require('body-parser');
const ip = require('ip');
const { sensor9250 } = require(__dirname + '/sensor9250.js')
const { networkInterfaces } = require('os');
const {sql} = require('./sql.js')
const asensor = new sql('asensor')
const bsensor = new sql('bsensor')
const csensor = new sql('csensor')
const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}


const app = express();

const port = process.argv[2]?process.argv[2]:65001;


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req,res)=>{
    const reqip = req.header["x-forwarded-for"] || req.socket.remoteAddress;
    console.log(reqip)
    const a = asensor.read();
    const b = bsensor.read();
    const c = csensor.read();
    res.json(
        {  
            myip:results,
            a:a,
            b:b,
            c:c,
        }
    )
})
function jsonarray(acc,ang) {
    return ({
        accel:acc,
        angle:ang
    })
}



app.listen(port,ip.address(),()=>{
    console.log('http://'+ip.address() +':'+ port  + ' 노드 운영중')
})
