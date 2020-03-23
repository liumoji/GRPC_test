const grpcLibrary = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const loadOptions = require('./options');
const echoDef = protoLoader.loadSync('echo.proto', loadOptions);
const echoProto = grpcLibrary.loadPackageDefinition(echoDef);
const echoClient = new echoProto.example.EchoService(
    '127.0.0.1:3001',
    grpcLibrary.credentials.createInsecure()
)



// echoClient.Echo({ message: 'hello world' },
//     (err, res) => {//server response shouldn't with 'attached'
//         console.log('called Echo', err, res);
//     });

// //Bidirectional streaming RPC
// let echoStream = echoClient.EchoStream();
// echoStream.on('data', (data) => {
//     console.log(data);
// });
// echoStream.on('end', () => {

// });
// echoStream.on('error', (err) => {
//     console.log(`echoStream on error : ${err}`);
// });
// setInterval(() => {
//     echoStream.write({
//         message: "stream request"
//     });
// }, 5000);



const braftCliDef = protoLoader.loadSync('braftcli.proto', loadOptions);
const braftCliProto = grpcLibrary.loadPackageDefinition(braftCliDef);
const barftCli = new braftCliProto.braft.CliService(
    '10.1.1.248:8100',
    grpcLibrary.credentials.createInsecure()
)

//与braft交互
let getLeader = (cb) => {
    barftCli.get_leader(
        { group_id: 'Counter' },
        (err, res) => {
            //server response shouldn't with 'attached'
            if (err) {
                console.log('called get_leader', err, res);
                getLeader(cb);
            } else {
                cb(res);
            }
        });
}
getLeader((res) => {
    console.log(`getLeader response`, res);
})


// //与braft Block交互
// const blockDef = protoLoader.loadSync('block.proto', loadOptions);
// const blockProto = grpcLibrary.loadPackageDefinition(blockDef);

// const blockCli = new blockProto.example.BlockService(
//     '10.1.1.248:8200',
//     grpcLibrary.credentials.createInsecure()
// )

// const blockSize = 64 * 1024 * 1024;
// setInterval(() => {
//     if (Math.random() > 0.5) {
//         blockCli.read(
//             { offset: parseInt(Math.random() * blockSize) },
//             (err, res) => {
//                 //server response shouldn't with 'attached'
//                 console.log('read response', err, res);
//             });
//     } else {
//         blockCli.write(
//             { offset: parseInt(Math.random() * blockSize) },
//             (err, res) => {
//                 //server response shouldn't with 'attached'
//                 console.log('write response', err, res);
//             });
//     }
// }, 500)
//与braft Block交互
const reportDef = protoLoader.loadSync('report.proto', loadOptions);
const reportProto = grpcLibrary.loadPackageDefinition(reportDef);

const reportCli = new reportProto.report.reportService(
    '10.1.1.248:8102',
    grpcLibrary.credentials.createInsecure()
)

setInterval(() => {
    if (Math.random() > 0) {
        reportCli.rigister(
            { type: 1 },
            (err, res) => {
                //server response shouldn't with 'attached'
                console.log('read response', err, res);
            });
    } else {
        reportCli.heartbeat(
            { id: "23123sadas" },
            (err, res) => {
                //server response shouldn't with 'attached'
                console.log('write response', err, res);
            });
    }
}, 50)
