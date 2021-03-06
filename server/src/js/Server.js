/**
 * webGPSmap
 * Webentwicklung Hausarbeit Gruppenarbeit Gruppe 1
 *
 * Webserver
 *
 * Created by Dominik Wirtz & Philipp Dippel
 */

module.exports = class Server {

	constructor() {
		const express = require("express");
		const server = express();
		const port = getPortFromArguments();
		const router = new express.Router();
		const ListTracks = require("./ListTracks");

		const myTracklist = new ListTracks("./server/data");

		server.use(express.static("dist"));

        /**
         * save Port from Commandline argument 1 to variable port
         * @returns {Port from first Commandline argument or 8080 if argument is no valid port}
         */
		function getPortFromArguments() {
			let port = process.argv[2];
			if (!Number.isInteger(port) && !(port >= 1 && port <= 65535)) {
				port = 8080;
			}
			return port;
		}

        /**
         * add route for API List all tracks
         */
		router.get("/tracks", function (request, responds) {
			responds.json(myTracklist.tracklist);
		});

        /**
         * add route for API List single track
         */
		router.get("/tracks/:id", function (request, responds) {
			responds.json(myTracklist.trackobjects[request.params.id]);
		});

        /**
         * Bind router to server
         */
		server.use(router);

        /**
         * Start server on port
         */
		let errorObject = server.listen(port, function () {
			console.log(`Webserver listening on port: ${errorObject.address().port}`);
		});

        /**
         * Errorhandling start server
         */
		errorObject.on("error", function (err) {
			if (err.code === "EACCES") {
				if (port <= 1024) {
					console.error(`Error starting server with port: ${port}. permission needed to start server with port below 1024`);
				}
				else {
					console.error(`Error starting server with port: ${port}. Port already in use`);
				}
			}
			else {
				console.error("Something went terrible wrong!");
			}
			process.exit(1);
		});
	}
};
