var cluster = require('cluster');
var http = require('http');
var numCpus = require('os').cpus().length;

if (cluster.isMaster) {
  for (var i =0; i < numCpus; i++){
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker %d died (%s). restarting...',
                worker.process.pid, signal || code);
                cluster.fork();
  });
  cluster.on('death', function(worker) {
    console.log('worker ' + worker.pid + ' died');
  });
  cluster.on('listening', function(address) {
    console.log('Worker is listening: ', address.id);
    console.log("A worker is now connected to " + address.address + ":" + address.port);
  });
  cluster.on('disconnect', function(worker) {
    console.log('The worker #' + worker.id + ' has disconnected');
  });
}else{
  http.Server(function(req, res){
    res.writeHead(200);
    res.end("hello");
  }).listen(8001);
}
