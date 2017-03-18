import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";
import InsightFacade from "../controller/InsightFacade";

import Log from "../Util";
import {isUndefined} from "util";
import forEach = require("core-js/fn/array/for-each");
import keys = require("core-js/fn/array/keys");
import indexOf = require("core-js/fn/array/index-of");

var insightFacade = new InsightFacade();

class Event {
    start_time: string;
    hour: number;
    course: string;
    room: string;

}

var interested_course_info: {[index: string]: any};

/*{adhe_327: { course_name: 'adhe_327', num_section: 3, size: 34 },
 adhe_328: { course_name: 'adhe_328', num_section: 1, size: 32 },}
 */

var dept_num: {[index: string]: any};

/* baac: [ 'baac_500', 'baac_501', 'baac_510', 'baac_511', 'baac_550' ],
 *  babs: [ 'babs_502', 'babs_540', 'babs_550' ],
 * */

var num_dept: {[index: string]: any};

var buildings: {[index: string]: any};

/*{ AERL:
 { building: 'AERL',
 lat: 49.26372,
 lon: -123.25099,
 rooms: [ [Object] ] },
 ALRD:
 { building: 'ALRD',
 lat: 49.2699,
 lon: -123.25318,
 rooms: [ [Object], [Object], [Object], [Object], [Object] ] },

 a room looks like
 { room_name: 'AERL_120',
 seats: 144,
 room_type: 'Tiered Large Group',
 room_furniture: 'Classroom-Fixed Tablets' }
 */
var distance_matrix: {[index: string]: any};

/*
 * DMP:
 [ { building: 'DMP', distance: 0 },
 { building: 'FSC', distance: 106.76503763192835 },
 { building: 'MCLD', distance: 108.8284898137126 },
 { building: 'ORCH', distance: 131.20465434237062 },
 { building: 'CHBE', distance: 131.48531963650163 },...
 ]*/

export default class ScheduleManager {

    courses: any[];
    rooms: any[];

    constructor() {

    }

    // assume every course has the expected form here, dept, id, num_section, size


    schedule(rooms: any[], courses: any[]): Promise<InsightResponse> {


        return new Promise((fulfill,reject)=>{

            try{
                let events :Event[]= [];
                courses=sortby_id(courses,"size");
                courses=this.get_union(courses,"course_name");
                rooms=sortby_id(rooms,"seats");
                rooms=this.get_union(rooms,"room_name");

                // course on MWF
                for (let i = 0; i < 17 - 8; i++) {
                    let event = new Event();
                    for (let room of rooms) {
                        let prev_name = "";
                        for (let course of courses) {
                            let course_name = course["dept"] + "_" + course["id"];
                            if (course["num_section"] > 0) {
                                if (Number(course["size"]) <= Number(room["seats"])) {
                                    event.start_time = i + 8 + ": 00";
                                    event.hour = 1;
                                    event.course = course_name;
                                    event.room = room["name"];
                                    course["num_section"] = course["num_section"] - 1;
                                    events.push(event);
                                    break;
                                }
                            }
                        }
                    }
                }

                // course on T TH
                for (let i = 0; i < 17 - 8; i += 1.5) {
                    let event = new Event();
                    for (let room of rooms) {
                        let prev_name = "";
                        for (let course of courses) {
                            let course_name = course["dept"] + "_" + course["id"];
                            if (course["num_section"] > 0) {
                                if (Number(course["size"]) <= Number(room["seats"])) {

                                    let time: string;
                                    if ((i / 1.5) % 2 == 0) {
                                        time = i + 8 + ": 00";
                                    }
                                    else {
                                        time = i - 0.5 + 8 + ": 30";
                                    }
                                    event.start_time = time;
                                    event.hour = 1.5;
                                    event.course = course_name;
                                    event.room = room["name"];
                                    course["num_section"] = course["num_section"] - 1;
                                    events.push(event);
                                }
                            }
                        }
                    }
                }
                fulfill({code:200,body:events});
            }
            catch (err){
                reject({code:400,body:"error in schedule 142 "+err.message});
            }

        });


    }


    setup_course(): Promise<InsightResponse> {
        let query: any = {
            "WHERE": {
                "AND": [
                    {

                        "EQ": {
                            "courses_year": 2014
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "count",
                    "size"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["courses_dept", "courses_id", "count", "size"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "courses_dept",
                    "courses_id"
                ],
                "APPLY": [
                    {
                        "count": {
                            "COUNT": "courses_uuid"
                        }
                    },
                    {
                        "size": {
                            "MAX": "courses_size"
                        }
                    }

                ]
            }
        };


        return new Promise((fulfill, reject) => {

            insightFacade.performQuery(query).then((response: any) => {

                let result = response.body["result"];
                let ret_obj: {[index: string]: any} = {};

                // set up interested_course_info
                for (let item of result) {
                    let key = item["courses_dept"] + "_" + item["courses_id"];
                    let num_section = Math.ceil(item["count"] / 3);
                    let size = item["size"];

                    let course = {"course_name": key, "num_section": num_section, "size": size};
                    ret_obj[key] = course;
                }
                interested_course_info = ret_obj;
                console.log(interested_course_info);

                // set up dept_num
                ret_obj = {};
                let prev_dept = result[0]["courses_dept"];
                ret_obj[prev_dept] = [];
                for (let item of result) {
                    let dept = item["courses_dept"];

                    if (dept == prev_dept) {
                        let id = item["courses_id"];
                        ret_obj[prev_dept].push(dept + "_" + id);
                    }
                    else {
                        prev_dept = dept;
                        let id = item["courses_id"];
                        ret_obj[prev_dept] = [];
                        ret_obj[prev_dept].push(dept + "_" + id);
                    }
                }
                dept_num = ret_obj;
                console.log(dept_num);
                // set up num_dept
                ret_obj = {};
                result.sort((a: any, b: any) => {
                    if (a["courses_id"] < b["courses_id"]) {
                        return -1;
                    }
                    else if (a["courses_id"] > b["courses_id"]) {
                        return 1;
                    }
                    else {
                        if (a["courses_dept"] < b["courses_dept"]) {
                            return -1;
                        }
                        else if (a["courses_dept"] > b["courses_dept"]) {
                            return 1;
                        }
                    }
                    return 0;
                });

                let prev_id = result[0]["courses_id"];
                ret_obj[prev_id] = [];
                for (let item of result) {

                    let id = item["courses_id"];

                    if (id == prev_id) {
                        let dept = item["courses_dept"];
                        ret_obj[prev_id].push(dept);
                    }
                    else {

                        prev_id = id;
                        let dept = item["courses_dept"];
                        ret_obj[prev_id] = [];
                        ret_obj[prev_id].push(dept);
                    }
                }

                num_dept = ret_obj;


                console.log(dept_num);
                console.log(num_dept);

                fulfill({code: 200, body: "set up done"});
            }).catch(function (err) {
                reject({code: 400, body: "error occurred in set up 166"});
            });
        });


    }

    setup_room(): Promise<InsightResponse> {

        let query: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "rooms_name",
                    "rooms_seats",
                    "rooms_lat",
                    "rooms_lon",
                    "rooms_type",
                    "rooms_furniture"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["rooms_shortname", "rooms_name", "rooms_seats", "rooms_lat", "rooms_lon", "rooms_type", "rooms_furniture"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "rooms_shortname",
                    "rooms_name",
                    "rooms_seats",
                    "rooms_lat",
                    "rooms_lon",
                    "rooms_type",
                    "rooms_furniture"
                ],
                "APPLY": []
            }
        };


        return new Promise((fulfill, reject) => {
            insightFacade.performQuery(query).then((response: any) => {
                let result = response.body["result"];

                // set up buildings as the form {"building":buildingname,"lat":lat,"lon":lon,"rooms":[{},{}]}
                let prev_buildingname = result[0]["rooms_shortname"];
                let prev_lat = result[0]["rooms_lat"];
                let prev_lon = result[0]["rooms_lon"];
                let ret_obj: {[index: string]: any} = {};
                ret_obj[prev_buildingname] = {
                    "building": prev_buildingname,
                    "lat": prev_lat,
                    "lon": prev_lon,
                    "rooms": {}
                };

                for (let item of result) {

                    let building_name = item["rooms_shortname"];
                    let rooms_name = item["rooms_name"];
                    let rooms_seats = item["rooms_seats"];
                    let rooms_type = item["rooms_type"];
                    let rooms_furniture = item["rooms_furniture"];

                    if (prev_buildingname == building_name) {
                        let room = {
                            "room_name": rooms_name,
                            "seats": rooms_seats,
                            "room_type": rooms_type,
                            "room_furniture": rooms_furniture
                        };
                        ret_obj[prev_buildingname]["rooms"][rooms_name] = room;
                    }
                    else {
                        prev_buildingname = building_name;
                        prev_lat = item["rooms_lat"];
                        prev_lon = item["rooms_lon"];
                        ret_obj[prev_buildingname] = {
                            "building": prev_buildingname,
                            "lat": prev_lat,
                            "lon": prev_lon,
                            "rooms": {}
                        };
                        let room = {
                            "room_name": rooms_name,
                            "seats": rooms_seats,
                            "room_type": rooms_type,
                            "room_furniture": rooms_furniture
                        };
                        ret_obj[prev_buildingname]["rooms"][rooms_name] = room;
                    }

                }

                buildings = ret_obj;
                //console.log(buildings);

                /*
                 set up the distance matrix as a nested JSON with the form as
                 {

                 "DMP":[
                 {"building":building1,"distance":distance},
                 {"building":building1,"distance":distance}
                 ],
                 "LSK":[{},{}], ...

                 ]}

                 */

                ret_obj = {};
                let keys = Object.keys(buildings);
                for (let target_key of keys) {
                    let target = buildings[target_key];
                    let target_lat = target["lat"];
                    let target_lon = target["lon"];
                    let target_name = target["building"];
                    ret_obj[target_name] = [];
                    for (let building_key of keys) {
                        let building = buildings[building_key];
                        let building_lat = building["lat"];
                        let building_lon = building["lon"];
                        let building_name = building["building"];
                        let distance = getDistanceFromLatLonInM(target_lat, target_lon, building_lat, building_lon);
                        let temp = {"building": building_name, "distance": distance};
                        ret_obj[target_name].push(temp);

                    }
                    ret_obj[target_name].sort((a: any, b: any) => {
                        if (a["distance"] < b["distance"]) {
                            return -1;
                        }
                        else if (a["distance"] > b["distance"]) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    });
                }

                distance_matrix = ret_obj;
                //console.log(distance_matrix);
                let a = this.get_all_rooms();
                console.log(a);

                fulfill({code: 200, body: "set up rooms done"});
            }).catch(function (err) {
                reject({code: 400, body: "error occurred in set up rooms 292 " + err.message})
            });
        });


    }

    get_result(query: any): Promise<any[]> {

        return new Promise((fulfill, reject) => {
            insightFacade.performQuery(query).then(function (response: any) {
                let ret_obj = response.body["result"];
                fulfill(ret_obj);
            }).catch(function (err) {
                reject("error in get_result 34");
            });
        });

    }

    get_courses_byname(course_name_list: any[]): any[] {
        let courses_list = [];
        for (let item of course_name_list) {
            courses_list.push(interested_course_info[item]);
        }
        return courses_list;
    }

    get_courses_bydept(dept: string): any[] {
        let courses_list = [];
        let course_in_dept = dept_num[dept];
        courses_list = this.get_courses_byname(course_in_dept);
        return courses_list;
    }

    get_all_courses(): any[] {
        let courses_list = [];
        let keys = Object.keys(interested_course_info);
        for (let key of keys) {
            courses_list.push(interested_course_info[key]);
        }
        return courses_list;
    }

    get_rooms_byname(room_name_list: any[]): any[] {

        let rooms_list = [];
        for (let item of room_name_list) {
            let dept = item.substring(0, item.indexOf("_"));
            let building = buildings[dept];
            let rooms = building["rooms"];
            let room = rooms[item];
            rooms_list.push(room);
        }
        return rooms_list;
    }

    get_rooms_bybuilding(dept: string): any[] {
        let rooms_list = [];
        let building = buildings[dept];
        let rooms = building["rooms"];

        let keys = Object.keys(rooms);
        for (let key of keys) {
            rooms_list.push(rooms[key]);
        }
        return rooms_list;
    }

    get_rooms_bytype(type_list: any[]): any[] {

        let rooms = this.get_all_rooms();
        let ret_list = [];
        for (let type of type_list) {
            for (let room of rooms) {
                if (room["room_type"] == type) {
                    ret_list.push(room);
                }
            }
        }

        return ret_list;
    }

    get_rooms_byfur(furlist: any[]): any[] {
        let rooms = this.get_all_rooms();
        let ret_list = [];
        for (let fur of furlist) {
            for (let room of rooms) {
                if (room["room_furiture"] == fur) {
                    ret_list.push(room);
                }
            }
        }
        return ret_list;
    }

    get_all_rooms(): any[] {
        let rooms_list: any[] = [];
        let building_names = Object.keys(buildings);
        for (let building_name of building_names) {
            rooms_list = rooms_list.concat(this.get_rooms_bybuilding(building_name));
        }
        return rooms_list;
    }

    get_rooms_bydistance(building: string, distance: number): any[] {
        let rooms_list: any[] = [];
        let target = distance_matrix[building];
        for (let item of target) {
            // an item looks like { building: 'FNH', distance: 111.80900099393709 }

            if (item["distance"] < distance) {
                let rooms_in_building = this.get_courses_bydept(item["building"]);
                rooms_list = rooms_list.concat(rooms_in_building);
            }
        }
        return rooms_list;
    }

    add_course_tolist(courses: any[]) {
        this.courses = this.courses.concat(courses);
    }

    add_room_tolist(rooms: any[]) {
        this.rooms = this.rooms.concat(rooms);
    }

    get_union(list: any[], id: string):any[] {
        let ret_list: any[] = []
        ret_list.push(list[0]);
        for (var i = 1; i < list.length; i++) {
            if (list[i][id] != list[list.length - 1][id]) {
                ret_list.push(list[i]);
            }
        }
        return ret_list;
    }

    get_intersection(list: any[], id: string, length: number):any[] {
        let ret_list: any[] = []

        for (var i = 0; i < list.length; i++) {
            var in_intersection = false;

            var index = i + length - 1;
            if (index < list.length) {

                if (list[i].id == list[index].id) {
                    in_intersection = true;
                }
            }
            else {
                in_intersection = false;
            }

            if (in_intersection) {
                ret_list.push(list[i]);
            }
        }
        return ret_list;
    }


}


// this code is taken from stack overflow
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000; // Distance in m
    return d;
}

// this code is taken from stack overflow
function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}

function sortby_id(list:any[],id:string):any[]{

    list.sort((a: any, b: any) => {
        if (a[id] < b[id]) {
            return -1;
        }
        else if (a[id] > b[id]) {
            return 1;
        }
        else
            return 0;
    });
    return list;
}


