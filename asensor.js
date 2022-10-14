console.log('------------------(START SCRIPT)------------------');

var mpu9250 = require('mpu9250');
const {sql} = require('./sql.js')

const MYSQL = new sql('asensor')
MYSQL.reset()
var mpu = new mpu9250({
  device: '/dev/i2c-1',
  address: 0x69,
  UpMagneto: true,
  DEBUG: false,
  ak_address: 0x0c,
  GYRO_FS: 0,
  ACCEL_FS: 1
});
 
var timer = 0;
 
var kalmanX = new mpu.Kalman_filter();
var kalmanY = new mpu.Kalman_filter();

if (mpu.initialize()) {
  console.log('MPU VALUE : ', mpu.getMotion9());
  console.log('Temperature : ' + mpu.getTemperatureCelsius());
  var values = mpu.getMotion9();
  var pitch = mpu.getPitch(values);
  var roll = mpu.getRoll(values);
  var yaw = mpu.getYaw(values);
  console.log('pitch value : ', pitch);
  console.log('roll value : ', roll);
  console.log('yaw value : ', yaw);
  kalmanX.setAngle(roll);
  kalmanY.setAngle(pitch);
 
  var micros = function() {
    return new Date().getTime();
  };
  var dt = 0;
 
  timer = micros();
 
  var interval;
 
  var kalAngleX = 0,
    kalAngleY = 0,
    kalAngleZ = 0,
    gyroXangle = roll,
    gyroYangle = pitch,
    gyroZangle = yaw,
    gyroXrate = 0,
    gyroYrate = 0,
    gyroZrate = 0,
    compAngleX = roll,
    compAngleY = pitch,
    compAngleZ = yaw;
 

 
   setTimeout(function(data) {
    interval = setInterval(function() {
      var values = mpu.getMotion9();

      var dt = (micros() - timer) / 1000000;
      timer = micros();

      pitch = mpu.getPitch(values);
      roll = mpu.getRoll(values);
      yaw = mpu.getYaw(values);

      var gyroXrate = values[3] / 131.0;
      var gyroYrate = values[4] / 131.0;
      var gyroZrate = values[5] / 131.0;

      if ((roll < -90 && kalAngleX > 90) || (roll > 90 && kalAngleX < -90)) {
        kalmanX.setAngle(roll);
        compAngleX = roll;
        kalAngleX = roll;
        gyroXangle = roll;
      } else {
        kalAngleX = kalmanX.getAngle(roll, gyroXrate, dt);
      }

      if (Math.abs(kalAngleX) > 90) {
        gyroYrate = -gyroYrate;
      }
      kalAngleY = kalmanY.getAngle(pitch, gyroYrate, dt);

      gyroXangle += gyroXrate * dt;
      gyroYangle += gyroYrate * dt;
      compAngleX = 0.93 * (compAngleX + gyroXrate * dt) + 0.07 * roll;
      compAngleY = 0.93 * (compAngleY + gyroYrate * dt) + 0.07 * pitch;

      if (gyroXangle < -180 || gyroXangle > 180) gyroXangle = kalAngleX;
      if (gyroYangle < -180 || gyroYangle > 180) gyroYangle = kalAngleY;

      var accel = {
        pitch: compAngleY,
        roll: compAngleX
      };
      write(values,accel)
    }, 10);
  }  , 1000); 
}

function write(value, acc){
  let val = []
  for(let x = 0 ; x < 3 ; x ++){
    val.push(value[x]/10000)
  }
  MYSQL.write(val,acc)
}