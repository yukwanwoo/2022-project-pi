const express = require('express');
const bodyParser = require('body-parser');
const ip = require('ip');
const { networkInterfaces } = require('os');
const {sql} = require('./sqlmodule/sql.js')
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
    const a = asensor.read();
    const b = bsensor.read();
    const c = csensor.read();
    const accuracy = ((0.8<a.accuracy && a.accuracy<0.85)?0:1) + ((0.8<b.accuracy && b.accuracy<0.85)?0:1) + ((0.8<c.accuracy && c.accuracy<0.85)?0:1);
    var backforth=(((parseFloat(a.y)+parseFloat(b.y)+parseFloat(c.y))>2.46)?0:1) + (((parseFloat(a.y)+parseFloat(b.y)+parseFloat(c.y))>2.4)?0:1);
    var both = (((parseFloat(a.x)-parseFloat(c.x))<-0.03)?-1:0) + ((0.03<(parseFloat(a.x)-parseFloat(c.x)))?1:0) + (((parseFloat(a.x)-parseFloat(c.x))<-0.05)?-1:0) + ((0.05<(parseFloat(a.x)-parseFloat(c.x)))?1:0);
    const measure = {
        backforth:backforth ,
        both:both
    };
    console.log(parseFloat(a.x)-parseFloat(c.x))
    res.json(
        {  
            myip:results,
            a:a,
            b:b,
            c:c,
            measure:measure,
            accuracy:accuracy
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
