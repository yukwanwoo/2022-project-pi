const rp = require('request-promise');
const {sql} = require('./sqlmodule/sql.js')

const asensor = new sql('asensor')
const bsensor = new sql('bsensor')
const csensor = new sql('csensor')

function sendMAIN(){
    const requestPromises = [];
    const a = asensor.read();
    const b = bsensor.read();
    const c = csensor.read();
    const raw = translate(a,b,c);
    const accuracy = ((0.79<a.accuracy && a.accuracy<0.89)?0:1) + ((0.79<b.accuracy && b.accuracy<0.89)?0:1) + ((0.79<c.accuracy && c.accuracy<0.89)?0:1);
    var backforth=(((parseFloat(a.y)+parseFloat(b.y)+parseFloat(c.y))>2.46)?0:1);
    var both = (((-0.03<(parseFloat(a.x)-parseFloat(c.x))) && ((parseFloat(a.x)-parseFloat(c.x))<0.03))?0:1);
    const measure = {
        backforth:backforth ,
        both:both,
        accuracy:accuracy
    }
        const options = {
            uri: 'serveruri',
            method: 'post',
            body: {
                imei:'73ff34fce1',
                createdAt:gettimestamp(),
                raw:raw,
                result:measure,
            },
            json:true
        }
        requestPromises.push(rp(options))
        Promise.all(requestPromises)
        .then((data) => { 
            // 성공
            console.log(JSON.stringify(data))
            }
        )
        .catch((err) => {
            // 에러
            console.log(err)
        })
    }
function gettimestamp(){
        let today = new Date();
        let year = today.getFullYear();
        let month = ('0' + (today.getMonth() + 1)).slice(-2);
        let day = ('0' + today.getDate()).slice(-2);
        let hour = ('0' + today.getHours()).slice(-2);
        let minute = ('0' + today.getMinutes()).slice(-2);
        let second = ('0' + today.getSeconds()).slice(-2);
        let millisec =('00' + today.getMilliseconds()).slice(-3);
        return (`${year}.${month}.${day} ${hour}:${minute}:${second}`);
}
function translate(a,b,c){
    const result = {
        top:{x:a.x,y:a.y,z:a.z,pitch:a.p,row:a.r},
        middle:{x:b.x,y:b.y,z:b.z,pitch:b.p,row:b.r},
        low:{x:c.x,y:c.y,z:c.z,pitch:c.p,row:c.r}
    }
    return result;    
}
// setInterval(() => {
//     sendMAIN()
// }, 100);
setTimeout(() => {
    sendMAIN()
}, 1000);