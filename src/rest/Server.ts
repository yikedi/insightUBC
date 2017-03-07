/**
 * This is the REST entry point for the project.
 * Restify is configured here.
 */

import restify = require('restify');

import Log from "../Util";
import {InsightResponse, QueryRequest} from "../controller/IInsightFacade";
import InsightFacade from "../controller/InsightFacade";

/**
 * This configures the REST endpoints for the server.
 */
export default class Server {

    private port: number;
    private rest: restify.Server;

    constructor(port: number) {
        Log.info("Server::<init>( " + port + " )");
        this.port = port;
    }

    /**
     * Stops the server. Again returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        Log.info('Server::close()');
        let that = this;
        return new Promise(function (fulfill) {
            that.rest.close(function () {
                fulfill(true);
            });
        });
    }

    /**
     * Starts the server. Returns a promise with a boolean value. Promises are used
     * here because starting the server takes some time and we want to know when it
     * is done (and if it worked).
     *
     * @returns {Promise<boolean>}
     */
    public start(): Promise<boolean> {
        let that = this;
        return new Promise(function (fulfill, reject) {
            try {
                Log.info('Server::start() - start');

                that.rest = restify.createServer({
                    name: 'insightUBC'
                });

                that.rest.use(restify.bodyParser());

                that.rest.get('/', function (req: restify.Request, res: restify.Response, next: restify.Next) {
                    res.send(200);
                    return next();
                });

                // provides the echo service
                // curl -is  http://localhost:4321/echo/myMessage
                that.rest.get('/echo/:msg', Server.echo);

                that.rest.put('/dataset/:id', Server.put);

                that.rest.del('/dataset/:id', Server.del);

                that.rest.post('/query', Server.post);

                // Other endpoints will go here

                that.rest.listen(that.port, function () {
                    Log.info('Server::start() - restify listening: ' + that.rest.url);
                    fulfill(true);
                });

                that.rest.on('error', function (err: string) {
                    // catches errors in restify start; unusual syntax due to internal node not using normal exceptions here
                    Log.info('Server::start() - restify ERROR: ' + err);
                    reject(err);
                });
            } catch (err) {
                Log.error('Server::start() - ERROR: ' + err);
                reject(err);
            }
        });
    }

    // The next two methods handle the echo service.
    // These are almost certainly not the best place to put these, but are here for your reference.
    // By updating the Server.echo function pointer above, these methods can be easily moved.
    //
    public static echo(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::echo(..) - params: ' + JSON.stringify(req.params));
        try {
            let result = Server.performEcho(req.params.msg);
            Log.info('Server::echo(..) - responding ' + result.code);
            res.json(result.code, result.body);
        } catch (err) {
            Log.error('Server::echo(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static performEcho(msg: string): InsightResponse {
        if (typeof msg !== 'undefined' && msg !== null) {
            return {code: 200, body: {message: msg + '...' + msg}};
        } else {
            return {code: 400, body: {error: 'Message not provided'}};
        }
    }

    public static put(req: restify.Request, res: restify.Response, next: restify.Next) {
        //Log.trace('Server::put(..) - params: ' + req.body);
        try {
            Server.performPut(req.params.id.toString(), req.body).then(function (result) {
                Log.info('Server::put(..) - responding ' + result.code);
                res.json(result.code, result.body);
            }).catch(function (result) {
                Log.info('Server::put(..) - responding ' + result.code);
                res.json(result.code, result.body);
            });
        } catch (err) {
            Log.error('Server::put(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static performPut(id:string, content: string): Promise<InsightResponse> {
        let temp = new InsightFacade();
        return temp.addDataset(id, content);
    }

    public static del(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::del(..) - params: ' + JSON.stringify(req.params.id));
        try {
            Server.performDel(req.params.id.toString()).then(function (result) {
                Log.info('Server::del(..) - responding ' + result.code);
                res.json(result.code, result.body);
            }).catch(function (result) {
                Log.info('Server::del(..) - responding ' + result.code);
                res.json(result.code, result.body);
            });
        } catch (err) {
            Log.error('Server::del(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static performDel(id:string): Promise<InsightResponse> {
        let temp = new InsightFacade();
        return temp.removeDataset(id);
    }

    public static post(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::post(..) - params: ' + JSON.stringify(req.body));
        try {
            Server.performPost(req.body).then(function (result) {
                Log.info('Server::post(..) - responding ' + result.code);
                res.json(result.code, result.body);
            }).catch(function (result) {
                Log.info('Server::post(..) - responding ' + result.code);
                res.json(result.code, result.body);
            });
        } catch (err) {
            Log.error('Server::post(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static performPost(query:QueryRequest): Promise<InsightResponse> {
        let temp = new InsightFacade();
        return temp.performQuery(query);
    }

}
