const createApp = require('./src/lib/createApp');
const dotenv = require('dotenv').config();
const createError = require('http-errors');
const cluster = require('cluster');


const PORT = process.env.PORT || 5000;
const main =async () => {
    try {
        if (cluster.isMaster) {
            var cpuCount = require('os').cpus().length;
            for (var i = 0; i < cpuCount; i += 1) {
                cluster.fork();
            }
            // Listen for terminating workers,restart them if they terminate
            cluster.on('exit', function (worker) {
                console.log(`Worker ${worker.id} died but it will be restarted`);
                cluster.fork();
            });

            return null;
        } else {
            const app = await createApp();
            await app.listen(PORT, async () => {
                console.log(
                    `Server started on port: http://localhost:${PORT}`
                );
        });
      return app;
    }
    } catch (error) {
        console.error(error); 
        process.exit(1);
        return null;
    }
}

module.exports = main();
