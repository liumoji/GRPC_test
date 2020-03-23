const grpcLibrary = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const loadOptions = require('./options');
const echoDef = protoLoader.loadSync('echo.proto');
const echoProto = grpcLibrary.loadPackageDefinition(echoDef);
const raftDef = protoLoader.loadSync('braftcli.proto', loadOptions);
const raftProto = grpcLibrary.loadPackageDefinition(raftDef);
const server = new grpcLibrary.Server();

const userMap = {};
const clientCallMap = {};

let flag = true;
let onlineId = 0;

//和client不同的是结尾有个.service
server.addService(echoProto.example.EchoService.service, {
  Echo: (call, callback) => {
    console.log("Echo called", call.request);
    callback(null, { message: call.request.message });
  },
  EchoStream: function (call) {
    onlineId++;
    console.log("ID  " + onlineId);
    call.on('data', (data) => {
      console.log(data);
      if (!call.onlineId) {
        call.onlineId = onlineId;
        clientCallMap[onlineId] = call;
        console.log(call);
      }
      call.write({
        message: "stream response"
      });
      if (clientCallMap[1]) {
        console.log("~~~~~true " + Object.keys(clientCallMap).length);
        console.log(clientCallMap[1]);
      } else {
        console.log("~~~~~false");
        console.log(call);
      }
    });
    call.on('end', () => {
      if (call.onlineId == 1) {
        console.log("online 1 end");
        delete clientCallMap[1];
      }
      call.end()
    });
    call.on('error', (err) => {
      console.log(`echoStream on error : ${err}`);
    });
  },
  MatchEchoStream: dealMatch
})

server.addService(raftProto.braft.CliService.service, {
  get_leader: (call, callback) => {
    console.log("Echo called", call.request);
    callback(null, { leader_id: call.request.group_id });
  }
})

server.bind('127.0.0.1:3001', grpcLibrary.ServerCredentials.createInsecure());
server.start();

function dealMatch(call) {
  call.on('data', (data) => {
    console.log(data);
    if (!clientCallMap[data.clientId]) {
      clientCallMap[data.clientId] = call;
    }
    let userInfo = {};
    userInfo.userId = data.userId;
    userInfo.userName = data.userName;
    userInfo.petList = data.petList;
    userInfo.clientId = data.clientId;
    call.write({
      message: "stream response"
    });
  });

  call.on('end', () => {
    console.log("dealMatch end");
    call.end()
  });

  call.on('error', (err) => {
    console.log(`dealMatch on error : ${err}`);
  });
}
