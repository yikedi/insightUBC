/**
 * This is the REST entry point for the project.
 * Restify is configured here.
 */

import restify = require('restify');

import Log from "../Util";
import {InsightResponse, QueryRequest} from "../controller/IInsightFacade";
import InsightFacade from "../controller/InsightFacade";
import ScheduleManager from "../controller/ScheduleManager";
import {fullResponse} from "restify";
import {isUndefined} from "util";
var scheduleManager: ScheduleManager = new ScheduleManager();

/**
 * This configures the REST endpoints for the server.
 */
export default class Server {

    private port: number;
    private rest: restify.Server;

    constructor(port: number) {
        //Log.info("Server::<init>( " + port + " )");
        this.port = port;
    }

    /**
     * Stops the server. Again returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        //Log.info('Server::close()');
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
                //Log.info('Server::start() - start');

                that.rest = restify.createServer({
                    name: 'insightUBC'
                });

                that.rest.use(restify.bodyParser({mapParams: true, mapFiles: true}));

                that.rest.get('/', function (req: restify.Request, res: restify.Response, next: restify.Next) {
                    res.send(200);
                    return next();
                });

                // provides the echo service
                // curl -is  http://localhost:4321/query
                that.rest.get('/echo/:msg', Server.echo);

                that.rest.put('/dataset/:id', Server.put);

                that.rest.del('/dataset/:id', Server.del);

                that.rest.post('/query', Server.post);

                that.rest.post('/query_rooms_distance', Server.performPostd4room);


                // Other endpoints will go here

                Server.perform_setup().then( ()=> {
                    that.rest.listen(that.port, function () {
                        //Log.info('Server::start() - restify listening: ' + that.rest.url);
                        fulfill(true);
                    });
                });


                that.rest.on('error', function (err: string) {
                    // catches errors in restify start; unusual syntax due to internal node not using normal exceptions here
                    //Log.info('Server::start() - restify ERROR: ' + err);
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
            //Log.info('Server::echo(..) - responding ' + result.code);
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
            let content = new Buffer(req.params.body).toString('base64');
            Server.performPut(req.params.id.toString(), content).then(function (result) {
                //Log.info('Server::put(..) - responding ' + result.code);
                res.json(result.code, result.body);
            }).catch(function (result) {
                //Log.info('Server::put(..) - responding ' + result.code);
                res.json(result.code, result.body);
            });
        } catch (err) {
            Log.error('Server::put(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static performPut(id: string, content: string): Promise<InsightResponse> {
        let temp = new InsightFacade();

        return temp.addDataset(id, content);
    }

    public static del(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::del(..) - params: ' + JSON.stringify(req.params.id));
        try {
            Server.performDel(req.params.id.toString()).then(function (result) {
                //Log.info('Server::del(..) - responding ' + result.code);
                res.json(result.code, result.body);
            }).catch(function (result) {
                //Log.info('Server::del(..) - responding ' + result.code);
                res.json(result.code, result.body);
            });
        } catch (err) {
            Log.error('Server::del(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static performDel(id: string): Promise<InsightResponse> {
        let temp = new InsightFacade();
        return temp.removeDataset(id);
    }

    public static post(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::post(..) - params: ' + JSON.stringify(req.body));
        try {
            Server.performPost(req.body).then(function (result) {
                //Log.info('Server::post(..) - responding ' + result.code);
                res.json(result.code, result.body);
            }).catch(function (result) {
                //Log.info('Server::post(..) - responding ' + result.code);
                res.json(result.code, result.body);
            });
        } catch (err) {
            Log.error('Server::post(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static performPost(query: QueryRequest): Promise<InsightResponse> {
        let temp = new InsightFacade();
        return temp.performQuery(query);
    }

    public static perform_setup():Promise<InsightResponse> {
        return new Promise((fulfill,reject)=>{
            scheduleManager.setup_room().then(function (response) {
                scheduleManager.setup_course().then(function () {
                    fulfill({code:200,body:"setup done"});
                }).catch(function (err) {
                    reject({code:400,body:"setup fail"});
                });
            }).catch(function (err) {
                reject({code:400,body:"setup fail"});
            });
        })


    }

    public static performPostd4room_helper(query: any): Promise<InsightResponse> {

        return new Promise((fulfill, reject) => {

            scheduleManager.get_result(query).then((response: any) => {
                let rooms = response;
                let distance_filter = query["EXTRA"];
                let and_or = distance_filter["and_or"];
                let columns=Object.keys(rooms[0]);
                /*
                 {
                 "WHERE":{  },
                 "OPTIONS":{  },
                 "EXTRA":{
                 "building_name":"123123123123123123",
                 "distance":11111
                 }
                 }
                 */
                if (!isUndefined(distance_filter)){
                    let target = distance_filter["building_name"];
                    let distance = Number(distance_filter["distance"]);
                    let rooms2 = scheduleManager.get_rooms_bydistance(target, distance);
                    rooms = rooms.concat(rooms2);
                    if (and_or == "AND") {
                        rooms = scheduleManager.get_intersection(rooms, "rooms_name");
                    }
                    else {
                        rooms = scheduleManager.get_union(rooms, "rooms_name");
                    }
                }

                let ret_list:any[]=[];
                for (let room of rooms){
                    let ret_room:any={};
                    for (let key of columns){
                        ret_room[key]=room[key];
                    }
                    ret_list.push(ret_room);
                }



                fulfill({code:200,body:{"result":ret_list}});

            }).catch(function (err) {
                reject({code:400,body:{"Error":err.message}});
            });
        });

    }

    public static performPostd4room(req: restify.Request, res: restify.Response, next: restify.Next){
        Log.trace('Server::post(..) - params: ' + JSON.stringify(req.body));
        try {
            Server.performPostd4room_helper(req.body).then(function (result) {
                //Log.info('Server::post(..) - responding ' + result.code);
                res.json(result.code, result.body);
            }).catch(function (result) {
                //Log.info('Server::post(..) - responding ' + result.code);
                res.json(result.code, result.body);
            });
        } catch (err) {
            Log.error('Server::post(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static get_courses_byname_helper(courses_name:any[]): Promise<InsightResponse>{
        return new Promise((fulfill,reject)=>{
           let courses=scheduleManager.get_courses_byname(courses_name);
           fulfill({code:200,body:courses});
           
        });
    }

    public static get_courses_byname(){

    }

}
