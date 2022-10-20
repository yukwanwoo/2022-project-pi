# 2022-project-pi

2022 종프 파이 소스코드입니다.

사용법 : 
 node /sensors/topSensor.js
 node /sensors/midSensor.js
 node /sensors/lowSensor.js
 node SendtoServer.js

mpu9250 3개에서 측정한 센서를 Rest API로 보거나 서버로 보낼 수 있습니다.

Raspberry pi 4 model B에서 동작하며 라즈베리 파이 OS위에서 노드를 사용합니다.

리눅스 커널 버전은 5.10 노드버전은 v8.17.0을 사용합니다.

# /sensors/topSensor.js
i2c 1번 센서 측정 소스파일로 0x69번 주소의 mpu9250값을 읽어와 mysql에 저장합니다.
측정 주기는 10ms
# /sensors/midSensor.js
i2c 0번 센서 측정 소스파일로 0x68번 주소의 mpu9250값을 읽어와 mysql에 저장합니다.
측정 주기는 10ms
# /sensors/lowSensor.js
i2c 0번 센서 측정 소스파일로 0x69번 주소의 mpu9250값을 읽어와 mysql에 저장합니다.
측정 주기는 10ms
# SendtoServer.js
서버로 측정값을 전송합니다.
전송 주기는 100ms
# webip.js
REST API로 측정값을 제공합니다.
