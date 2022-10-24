#프로젝트 설명

https://user-images.githubusercontent.com/46319374/192773251-5bc993ba-b498-42ce-a3b3-899dcba3efc3.jpg

본 프로젝트의 목표는 척추 부근에 센서를 달아 얻는 데이터를 통해 사용자의 현재 허리 상태를 측정하고 이를 처리하여 사용자가 현재 자신의 허리 자세를 인지하고 올바른 자세를 취할 수 있게 하는 것입니다. 본 레포지토리에서는 라즈베리리 파이만 다룹니다.

라즈베리파이는 센서로부터 데이터를 수신받아 자체적으로 처리한 뒤 이를 웹서버로 전송합니다. 데이터는 사용자의 척추에 붙어있는 세개의 9축 센서의 고유 측정값과 한번 정제 과정을 거쳐 얻은 정보들입니다. 여러가지 한계로 인해 라즈베리파이는 고유IP를 가지고 있지 않습니다. 따라서 라즈베리파이는 웹서버의 응답을 제외하면 웹서버에게 단방향으로만 송신합니다. 웹서버가 수신하는 데이터는 REST 기반의 JSON 타입의 객체입니다.

# 2022-project-pi

2022 종프 파이 소스코드입니다.

사용법 : 
 node sensors/topSensor.js
 
 node sensors/midSensor.js
 
 node sensors/lowSensor.js
 
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
