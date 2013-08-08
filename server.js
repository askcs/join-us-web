var express = require('express'),
		cluster = require('cluster'),
		os 			= require('os'),
    app 		= express();

app.configure(function ()
{

	// app.use(express.static(path.join(__dirname, 'war')));

  /*app.use(function(req, res, next) {
	console.log("["+process.pid+"] request on: "+req.url);
	next();
  });*/

  app.use(express.static(__dirname + '/war'));

  app.use(express.logger('dev'));
});

app.get('/', function (req, res)
{
  res.sendfile(__dirname + '/war/index.html');
});


app.use(function (req, res, next)
{
	res.sendfile(__dirname + req.url);
});


if (cluster.isMaster)
{
	for (var i = 0; i < os.cpus().length; i++)
	{
		cluster.fork();
	}
	
	cluster.on('listening', function (worker, address)
	{
		console.log("Worker "+worker.process.pid+" listening on: "+address.port);
	});
	
}
else
{
	app.listen(3000);
}
