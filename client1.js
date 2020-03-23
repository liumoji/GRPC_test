const grpcLibrary = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('echo.proto');
const echoProto = grpcLibrary.loadPackageDefinition(packageDefinition);
const echoClient = new echoProto.example.EchoService(
    '127.0.0.1:3001',
    grpcLibrary.credentials.createInsecure()
)



echoClient.Echo({ message: 'hello world' },
    (err, res) => {//server response shouldn't with 'attached'
        console.log('called Echo', err, res.message);
    });

//Bidirectional streaming RPC
let echoStream = echoClient.EchoStream();
echoStream.on('data', (data) => {
    console.log(data);
});
echoStream.on('end', () => {
    console.log("server close");
});
echoStream.on('error', (err) => {
    console.log(`echoStream on error : ${err}`);
});
setInterval(() => {
    echoStream.write({
        message: "stream request",
        ID: 2
    });
}, 5000);
