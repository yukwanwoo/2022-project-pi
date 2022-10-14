const MySql = require('sync-mysql');

class sql {
    constructor(tablename){
        this.connection = new MySql({
            host: "localhost",
            user: "root",
            password: "gachon654321",
            database: "whdvm",
        });
        this.times = -10;
        this.tablename=tablename
    }
    write(sensor,kalman){
        this.times++;
        this.connection.query(`INSERT INTO ${this.tablename} (xacc, yacc, zacc, pitch, roll) VALUES 
        (${(sensor[0].toFixed(4)).toString()},${(sensor[1].toFixed(4)).toString()},${(sensor[2].toFixed(4)).toString()},${(kalman.pitch.toFixed(4)).toString()},${(kalman.roll.toFixed(4)).toString()});`)
        if(this.times>99){
            this.delete()
            this.times = 0
        }
    }
    delete(){
        let rst = this.connection.query(`select seq from ${this.tablename} orders limit 100`)
        this.connection.query(`delete from ${this.tablename} where seq < ${rst[99].seq}`)
        this.connection.query(`OPTIMIZE TABLE ${this.tablename}`)
    }
    read(){
        let rst = this.connection.query(`select * from ${this.tablename} orders limit 10`)
        let x,y,z,p,r;
        x=0;
        y=0;
        z=0;
        p=0;
        r=0;
        rst.forEach(element => {
            x = x + parseFloat(element.xacc);
            y = y+parseFloat(element.yacc);
            z = z+parseFloat(element.zacc);
            p = p +parseFloat(element.pitch);
            r = r +parseFloat(element.roll);
        });
        let result = {
            x:(x/10).toFixed(4),
            y:(y/10).toFixed(4),
            z:(z/10).toFixed(4),
            p:(p/10).toFixed(4),
            r:(r/10).toFixed(4)
        }
        return result;
    }
    reset(){
        this.connection.query(`truncate ${this.tablename}`)
        this.connection.query(`OPTIMIZE TABLE ${this.tablename}`)
    }
}
module.exports.sql = sql;