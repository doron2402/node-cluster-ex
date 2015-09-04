var cluster = require('cluster');
var http = require('http');
var numCpus = require('os').cpus().length;

if (cluster.isMaster) {
  for (var i =0; i < numCpus; i++){
    cluster.fork();
  }

  cluster.on('death', function(worker) {
    console.log('worker ' + worker.pid + ' died');
  });
  cluster.on('listening', function(address) {
      console.log('Worker is listening: ', address.id);
  });
}else{
  http.Server(function(req, res){
    res.writeHead(200);
    res.end("hello");
  }).listen(8001);
}
