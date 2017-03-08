/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";
import {isUndefined} from "util";
import forEach = require("core-js/fn/array/for-each");
import keys = require("core-js/fn/array/keys");
var JSZip = require('jszip');
var fs = require('fs');
var request = require('request');
var http = require('http');
var parse5 = require('parse5');

let dictionary: {[index: string]: string} = {};

dictionary = {
    "courses_dept": "Subject",
    "courses_id": "Course",
    "courses_avg": "Avg",
    "courses_instructor": "Professor",
    "courses_title": "Title",
    "courses_pass": "Pass",
    "courses_fail": "Fail",
    "courses_audit": "Audit",
    "courses_uuid": "id",
    "courses_year": "Year",
    "rooms_fullname": "rooms_fullname",
    "rooms_shortname": "rooms_shortname",
    "rooms_number": "rooms_number",
    "rooms_name": "rooms_name",
    "rooms_address": "rooms_address",
    "rooms_lat": "rooms_lat",
    "rooms_lon": "rooms_lon",
    "rooms_seats": "rooms_seats",
    "rooms_type": "rooms_type",
    "rooms_furniture": "rooms_furniture",
    "rooms_href": "rooms_href",
    "rooms_id": "id"

};

class Dataset_obj {
    id: string;

    constructor() {
        this.id = null;
    }

    getValue(target: string): any {
        return null;
    }

    setValue(target: string, value: string) {
    }
}

class Course_obj extends Dataset_obj {

    Subject: string;
    Course: string;
    Avg: number;
    Professor: string;
    Title: string;
    Pass: number;
    Fail: number;
    Audit: number;
    id: string;
    Year: number;

    constructor() {
        super();
        this.Subject = null;
        this.Course = null;
        this.Avg = null;
        this.Professor = null;
        this.Title = null;
        this.Pass = null;
        this.Fail = null;
        this.Audit = null;
        this.id = null;
        this.Year = null;
    };

    getValue(target: string): any {

        switch (target) {
            case "Subject": {
                return this.Subject;
            }
            case "Course": {
                return this.Course;
            }
            case "Avg": {
                return this.Avg;
            }
            case "Professor": {
                return this.Professor;
            }
            case "Title": {
                return this.Title;
            }
            case "Pass": {
                return this.Pass;
            }
            case "Fail": {
                return this.Fail;
            }
            case "Audit": {
                return this.Audit;
            }
            case "id": {
                return this.id;
            }
            case "Year": {
                return this.Year;
            }
            default :
                throw new Error(target);
        }


    }

    setValue(target: string, value: string) {
        switch (target) {
            case "Subject": {
                this.Subject = value.toString();
                break;
            }
            case "Course": {
                this.Course = value.toString();
                break;
            }
            case "Avg": {
                this.Avg = Number(value);
                break;
            }
            case "Professor": {
                this.Professor = value;
                break;
            }
            case "Title": {
                this.Title = value.toString();
                break;
            }
            case "Pass": {
                this.Pass = Number(value);
                break;
            }
            case "Fail": {
                this.Fail = Number(value);
                break;
            }
            case "Audit": {
                this.Audit = Number(value);
                break;
            }
            case "id": {
                this.id = value.toString();
                break;
            }
            case "Year": {
                this.Year = Number(value);
                break;
            }
            default :
                throw new Error(target);
        }
    }
}

class Rooms_obj extends Dataset_obj {

    rooms_fullname: string;
    rooms_shortname: string;
    rooms_number: string;
    rooms_name: string;
    rooms_address: string;
    rooms_lat: number;
    rooms_lon: number;
    rooms_seats: number;
    rooms_type: string;
    rooms_furniture: string;
    rooms_href: string;
    id: string;

    constructor() {
        super();
        this.rooms_fullname = null;
        this.rooms_shortname = null;
        this.rooms_number = null;
        this.rooms_name = null;
        this.rooms_address = null;
        this.rooms_lat = null;
        this.rooms_lon = null;
        this.rooms_seats = null;
        this.rooms_type = null;
        this.rooms_furniture = null;
        this.rooms_href = null;
        this.id = null;
    };

    getValue(target: string): any {

        switch (target) {
            case "rooms_fullname": {
                return this.rooms_fullname;
            }
            case "rooms_shortname": {
                return this.rooms_shortname;
            }
            case "rooms_number": {
                return this.rooms_number;
            }
            case "rooms_name": {
                return this.rooms_name;
            }
            case "rooms_address": {
                return this.rooms_address;
            }
            case "rooms_lat": {
                return this.rooms_lat;
            }
            case "rooms_lon": {
                return this.rooms_lon;
            }
            case "rooms_seats": {
                return this.rooms_seats;
            }
            case "rooms_type": {
                return this.rooms_type;
            }
            case "rooms_furniture": {
                return this.rooms_furniture;
            }
            case "rooms_href": {
                return this.rooms_href;
            }
            case "id": {
                return this.id;
            }
            default :
                throw new Error(target);
        }


    }

    setValue(target: string, value: string) {
        switch (target) {
            case "rooms_fullname": {
                this.rooms_fullname = value.toString();
                break;
            }
            case "rooms_shortname": {
                this.rooms_shortname = value.toString();
                break;
            }
            case "rooms_number": {
                this.rooms_number = value.toString();
                break;
            }
            case "rooms_name": {
                this.rooms_name = value.toString();
                break;
            }
            case "rooms_address": {
                this.rooms_address = value.toString();
                break;
            }
            case "rooms_lat": {
                this.rooms_lat = Number(value);
                break;
            }
            case "rooms_lon": {
                this.rooms_lon = Number(value);
                break;
            }
            case "rooms_seats": {
                this.rooms_seats = Number(value);
                break;
            }
            case "rooms_type": {
                this.rooms_type = value.toString();
                break;
            }
            case "rooms_furniture": {
                this.rooms_furniture = value.toString();
                break;
            }
            case "rooms_href": {
                this.rooms_href = value.toString();
                break;
            }
            case "id": {
                this.id = value.toString();
                break;
            }
            default :
                throw new Error(target);
        }
    }
}

export default class InsightFacade implements IInsightFacade {
    rooms_dataset: string;
    courses_dataset: string;

    constructor() {


        var path: string = "src/courses.txt";
        var exist: boolean = fs.existsSync(path);
        if (exist) {
            this.courses_dataset = fs.readFileSync(path, 'utf-8');
        } else {
            this.courses_dataset = null;
        }
        var path: string = "src/rooms.txt";
        var exist: boolean = fs.existsSync(path);
        if (exist) {
            this.rooms_dataset = fs.readFileSync(path, 'utf-8');
        } else {
            this.rooms_dataset = null;
        }

        Log.trace('InsightFacadeImpl::init()');
    }

//
    addDataset(id: string, content: string): Promise<InsightResponse> {

        return new Promise((fulfill, reject) => {

            var ret_obj = null;
            var zip = new JSZip();
            var exist: boolean = fs.existsSync("src/" + id + ".txt");

            zip.loadAsync(content, {"base64": true})
                .then((data: JSZip) => {


                    var promise_list: Promise<string>[] = [];
                    var name_list: string[] = [];

                    if (id == "courses") {
                        data.forEach(function (path, file) {
                            name_list.push(file.name);
                            promise_list.push(file.async("string"));

                        });

                        var final_string = "{\"" + id + "\":[";

                        Promise.all(promise_list).then((list) => {

                            var i = 0;

                            for (let item of list) {

                                if (i > 0) {
                                    var temp;
                                    try {
                                        temp = JSON.parse(item);
                                        //console.log(temp["result"]);
                                        if (temp["result"].length == 0) {
                                            i++;
                                            continue;
                                        }
                                        var content = '{\"' + name_list[i] + '\":' + item + '},';
                                        final_string += content;
                                    }
                                    catch (Error) {
                                        //console.log("in catch for each list line 190");
                                        //return reject({code: 400, body: {"error": Error.message}});
                                    }

                                }
                                i++;
                            }
                            final_string = final_string.substr(0, final_string.length - 1) + "]}";
                            var j_objs: any = null;
                            try {
                                j_objs = JSON.parse(final_string);
                                if (j_objs[id].length == 0) {
                                    ret_obj = {code: 400, body: {"error": "No valid json object exist"}};
                                }

                                j_objs = JSON.stringify(j_objs);

                            }
                            catch (err) {
                                ret_obj = {code: 400, body: {"error": err.message + "     380"}};
                                return reject(ret_obj)
                            }


                            fs.writeFile('src/' + id + '.txt', j_objs, (err: Error) => {
                                if (err) {

                                    ret_obj = {code: 400, body: {"error": err.message + "      388"}};
                                    //console.log("write file error if line 216");
                                    return reject(ret_obj);
                                }
                                else {
                                    //console.log("write file error else line 220");
                                    if (exist) {
                                        ret_obj = {code: 201, body: j_objs};
                                    }
                                    else {
                                        ret_obj = {code: 204, body: j_objs};
                                    }
                                    this.courses_dataset = j_objs;
                                    return fulfill(ret_obj);
                                }
                            });

                        }).catch(function (err: Error) {
                            //console.log("in write file catch line 228");
                            ret_obj = {code: 400, body: {"error": err.message + "      406"}};
                            return reject(ret_obj);
                        });

                    }
                    else {
                        var index_file: any
                        data.forEach(function (path, file) {

                            name_list.push(file.name);
                            promise_list.push(file.async("string"));

                        });

                        Promise.all(promise_list).then((list) => {
                            //let index_valid:boolean = true;

                            try {
                                for (var i = 0; i < name_list.length; i++) {

                                    if (name_list[i] == "index.htm") {

                                        index_file = list[i];
                                        try {
                                            parse5.parse(index_file);
                                        } catch (err) {
                                            let ret_obj = {code: 400, body: "invalid index.htm  431"};
                                            return reject(ret_obj);
                                        }
                                        break;
                                    }
                                    parse5.parse(list[i]);
                                }
                            } catch (error) {
                                //  index_valid=false;
                                console.log("line 413");
                            }

                            //if (index_valid) {
                            var tbody_start = index_file.indexOf("<tbody>");
                            var tbody_end = index_file.indexOf("</tbody>");
                            var temp = index_file.substring(tbody_start + "<tbody>".length, tbody_end);


                            var buildings = temp.split("</tr>");
                            buildings.pop();
                            var final_buildings: any[] = [];
                            for (let item of buildings) {

                                let building: {[index: string]: any} = {};
                                var temp_s = "a href=\"";
                                var a_href = extract_info(item, temp_s, "\"");

                                temp_s = "building-code\" >";
                                var short_name = extract_info(item, temp_s, "</td>");

                                temp_s = "views-field-title\" >";
                                var full_name_index = item.indexOf(temp_s) + temp_s.length;
                                temp_s = "title=\"Building Details and Map\">";
                                var full_name_index = item.indexOf(temp_s, full_name_index) + temp_s.length;
                                var full_name = item.substring(full_name_index, item.indexOf("</a>", full_name_index));

                                temp_s = "field-building-address\" >";
                                var address = extract_info(item, temp_s, "</td>");

                                building["a_href"] = a_href;
                                building["short_name"] = short_name;
                                building["full_name"] = full_name;
                                building["address"] = address;

                                final_buildings.push(building);
                            }


                            var lat_lon_list: Promise<Object>[] = [];
                            for (let i = 0; i < final_buildings.length; i++) {
                                lat_lon_list.push(new Promise(function (fulfill, reject) {
                                    let uri = final_buildings[i]["address"];
                                    let uri_encoded = encodeURIComponent(uri);
                                    let url = "http://skaha.cs.ubc.ca:11316/api/v1/team132/" + uri_encoded;

                                    request(url, function (error: any, response: any, body: any) {
                                        if (!error && response.statusCode == 200) {
                                            return fulfill(body);
                                        } else {
                                            return fulfill("{\"lat\":\"\",\"lon\":\"\"}");
                                        }
                                    })
                                }))
                            }
                            Promise.all(lat_lon_list).then((lat_lon_list) => {
                                //change abvoe

                                let parsed_list = JSON.parse(JSON.stringify(lat_lon_list));
                                var final_rooms: any[] = [];

                                var num_rooms = 0;
                                var invalid_count = 0;
                                for (var i = 0; i < list.length; i++) {
                                    var item = list[i];
                                    for (var j = 0; j < final_buildings.length; j++) {

                                        if ("./" + name_list[i] == final_buildings[j]["a_href"]) {

                                            try {
                                                parse5.parse(item);
                                            }
                                            catch (err) {
                                                invalid_count++;
                                                console.log("file " + i + " is invalid");
                                                continue;
                                            }

                                            var room_shortname = final_buildings[j]["short_name"];
                                            var room_fullname = final_buildings[j]["full_name"];
                                            var room_address = final_buildings[j]["address"];
                                            var room_href = null;
                                            var room_number = null;
                                            var room_seats = null;
                                            var room_furniture = null;
                                            var room_type = null;
                                            var room_name = null;

                                            let lat_lon = JSON.parse(parsed_list[j]);
                                            var room_lat = lat_lon["lat"];
                                            var room_lon = lat_lon["lon"];

                                            tbody_start = item.indexOf("<tbody>");
                                            tbody_end = item.indexOf("</tbody>");
                                            if (tbody_start != -1) {
                                                temp = item.substring(tbody_start + "<tbody>".length, tbody_end);
                                                var rooms = temp.split("</tr>");

                                                rooms.pop();
                                                for (let room of rooms) {

                                                    let room_obj: {[index: string]: any} = {};

                                                    var temp_s = "a href=\"";
                                                    room_href = extract_info(room, temp_s, "\"");

                                                    temp_s = "title=\"Room Details\">";
                                                    room_number = extract_info(room, temp_s, "</a>");

                                                    temp_s = "room-capacity\" >";
                                                    room_seats = extract_info(room, temp_s, "</td>");

                                                    temp_s = "room-furniture\" >";
                                                    let furniture = extract_info(room, temp_s, "</td>");
                                                    room_furniture = furniture.replace(/&amp;/g, '&');


                                                    temp_s = "room-type\" >";
                                                    room_type = extract_info(room, temp_s, "</td>");

                                                    room_name = final_buildings[j]["short_name"] + "_" + room_number;

                                                    room_obj["rooms_fullname"] = room_fullname;
                                                    room_obj["rooms_shortname"] = room_shortname;
                                                    room_obj["rooms_name"] = room_name;
                                                    room_obj["rooms_number"] = room_number;
                                                    room_obj["rooms_address"] = room_address;
                                                    room_obj["rooms_seats"] = room_seats;
                                                    room_obj["rooms_furniture"] = room_furniture;
                                                    room_obj["rooms_href"] = room_href;
                                                    room_obj["rooms_lat"] = room_lat;
                                                    room_obj["rooms_lon"] = room_lon;
                                                    room_obj["rooms_type"] = room_type;

                                                    room_obj["id"] = num_rooms;
                                                    num_rooms++;
                                                    final_rooms.push(room_obj);
                                                }

                                            }


                                            break;

                                        }

                                    }

                                }
                                if (invalid_count == final_buildings.length) {
                                    let ret_obj = {code: 400, body: "no valid files 613"};
                                    return reject(ret_obj);
                                }

                                var room_file = {"rooms": final_rooms};
                                var j_objs = JSON.stringify(room_file);
                                fs.writeFile('src/' + id + '.txt', j_objs, (err: Error) => {
                                    if (err) {

                                        ret_obj = {code: 400, body: {"error": err.message + "    628"}};
                                        //console.log("write file error if line 216");
                                        return reject(ret_obj);
                                    }
                                    else {
                                        //console.log("write file error else line 220");
                                        if (exist) {
                                            ret_obj = {code: 201, body: j_objs};
                                        }
                                        else {
                                            ret_obj = {code: 204, body: j_objs};
                                        }
                                        this.rooms_dataset = j_objs;
                                        return fulfill(ret_obj);
                                    }
                                });
                            });

                        }).catch(function (err) {
                            return reject({code: 400, body: "error catched 535"});
                        });


                    }


                }).catch(function (err: Error) {
                //console.log("in JSZip catch line 235");
                ret_obj = {code: 400, body: {"error": err.message + "  658"}};
                return reject(ret_obj);
            });


        });


    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise((fulfill, reject) => {
            var ret_obj = null;
            var path = "src/" + id + ".txt";
            var exist: boolean = fs.existsSync("src/" + id + ".txt");
            if (!exist) {
                ret_obj = {
                    code: 404,
                    body: "The operation was unsuccessful because the dataset was already removed before"
                };
                return reject(ret_obj);
            }
            else {
                fs.unlink(path, (err: Error) => {
                    if (err) {
                        ret_obj = {code: 404, body: {"error": err.message} + " 680"};
                        return reject(ret_obj);
                    } else {
                        ret_obj = {code: 204, body: "The operation was successful"};
                        if (id == "courses") {
                            this.courses_dataset = null;
                        }
                        else if (id == "rooms") {
                            this.rooms_dataset = null;
                        }
                        return fulfill(ret_obj);
                    }
                });
            }

        });
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        return new Promise((fulfill, reject) => {

                /*******/
                // var id = "courses";

                // var exist: boolean = fs.existsSync("src/" + id + ".txt");


                let valid = validate(query);
                if (valid.code == 400) {
                    return reject({code: 400, body: {"error": "invalid json or query 698   " + valid.body}});
                }

                var j_query = JSON.stringify(query);
                var j_obj = JSON.parse(j_query);

                var options = j_obj["OPTIONS"];
                var columns = options["COLUMNS"];
                var order = options["ORDER"];
                var form = options["FORM"];
                var transformations = j_obj["TRANSFORMATIONS"];


                if (!isUndefined(transformations)) {

                    perform_Query_transform(query, this).then(function (response) {
                        return fulfill(response);
                    }).catch(function (err) {
                        return reject({code: 400, body: {"error": "invalid json or query 753 " + err.message}});
                    });
                }
                else {
                    if (columns.length != 0) {
                        var column0 = columns[0];
                        var id: string = column0.substring(0, column0.indexOf("_"));

                        var exist: boolean = fs.existsSync("src/" + id + ".txt");
                    } else {
                        return reject({code: 400, body: {"error": " empty column 721"}});
                    }

                    if (exist) {
                        let data: string;
                        if (id == "courses") {
                            data = this.courses_dataset;
                        } else if (id == "rooms") {
                            data = this.rooms_dataset;
                        }
                        var table: Dataset_obj[];
                        if (id == "courses") {
                            table = build_table(data);
                        }
                        else {
                            table = build_table_rooms(data);
                        }

                        var missing_col: string[] = [];
                        var error_400: Object[] = [];

                        // let order_valid = check_order(order, columns);
                        //
                        // for (let column of columns) {
                        //     var value = dictionary[column];
                        //
                        //     if (column.substring(0, column.indexOf("_")) != id) {
                        //         missing_col.push(column);
                        //     }
                        //
                        // }
                        // if (!isUndefined(order)) {
                        //     if (!order_valid)
                        //         missing_col.push(order);
                        // }
                        //
                        // if (form != "TABLE") {
                        //     missing_col.push(form);
                        // }
                        //
                        // if (missing_col.length > 0) {
                        //     return reject({code: 400, body: {"error": "invalid query 764"}});
                        // }

                        missing_col = [];
                        var body = null;
                        try {
                            body = filter(table, query, missing_col, error_400);  ///**type
                        } catch (err) {
                            return reject({code: 400, body: err.message + "   778"});
                        }

                        if (missing_col.length > 0) {
                            var missing_ids: string[] = [];
                            for (let missing_item of missing_col) {
                                try {
                                    var vals = missing_item.toString();
                                    var missing_id = vals.substring(0, vals.indexOf("_"));  //Could trigger error
                                    var exist: boolean = fs.existsSync("src/" + missing_id + ".txt");
                                    if (!exist) {
                                        missing_ids.push(missing_id);
                                    }
                                }
                                catch (err) {
                                    return reject({code: 400, body: err.message + "   793"});
                                }
                            }

                            if (missing_ids.length > 0) {
                                return reject({code: 424, body: {"missing": missing_ids}});
                            }

                            return reject({code: 400, body: {"missing": missing_col}});


                        } else if (error_400.length > 0) {
                            return reject({code: 400, body: error_400[0] + "   805 "});
                        }

                        let ret_obj = {render: form, result: body};
                        return fulfill({code: 200, body: ret_obj});


                    }
                    else {
                        let ret_obj = {code: 424, body: {"missing": [id]}};
                        return reject(ret_obj);
                    }


                }
            }
        )
    }

}

function build_table(data: string): Array<Course_obj> {

    var temp = JSON.parse(data);
    var courses = temp["courses"];


    var course_list: Course_obj[] = [];

    var interest_info = ["Subject", "Course", "Avg", "Professor", "Title", "Pass", "Fail", "Audit", "id", "Year"];

    for (let course of courses) {

        var keys_inner_1 = Object.keys(course);
        var course_info = course[keys_inner_1[0]];
        var results = course_info["result"];

        for (let item of results) {
            var each_course: Course_obj = new Course_obj();

            try {
                for (let s of interest_info) {
                    var value = item[s];
                    if (s == "id" || s == "Course") {
                        each_course.setValue(s, value.toString());
                    } else {
                        if (s == "Year" && item["Section"] == "overall") {
                            each_course.setValue(s, "1900");
                        }
                        else {
                            each_course.setValue(s, value);
                        }
                    }
                }
            } catch (err) {
                //console.log(err.toString());
            }

            course_list.push(each_course);
        }
    }

    return course_list;
}

function build_table_rooms(data: string): Array<Rooms_obj> {

    var temp = JSON.parse(data);
    var rooms = temp["rooms"];


    var interest_info = ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_number",
        "rooms_address", "rooms_lat", "rooms_lon", "rooms_seats", "rooms_furniture", "rooms_href", "id", "rooms_type"];

    var room_list: Rooms_obj[] = [];
    for (let room of rooms) {
        var room_obj = new Rooms_obj();
        for (let s of interest_info) {
            room_obj.setValue(s, room[s]);
        }
        room_list.push(room_obj);
    }

    return room_list;
}

function filter(table: Array<Dataset_obj>, query: QueryRequest, missing_col: string [], error_400: Object[]): any {

    var j_query = JSON.stringify(query);
    var j_obj = JSON.parse(j_query);

    var options = j_obj["OPTIONS"];
    var where = j_obj["WHERE"];

    let where_keys = Object.keys(where);
    // console.log(where_keys);
    // console.log(where_keys.length);


    var query: QueryRequest = where;
    var ret_table = [];

    if (where_keys.length < 1) {
        ret_table = table;
    }
    else {
        try {
            ret_table = filter_helper(table, query, missing_col, error_400);
        } catch (err) {
            throw err;
        }
    }

    var columns = options["COLUMNS"];
    var order = options["ORDER"];


    if (!isUndefined(order)) {
        let order_keys = Object.keys(order);
        if (typeof order == "object") {
            let dir = order["dir"];
            let keys = order["keys"];

            if (dir == "UP") {
                if (!isUndefined(order)) {
                    ret_table.sort((a: Dataset_obj, b: Dataset_obj) => {
                        for (let i = 0; i < keys.length; i++) {
                            if (a.getValue(dictionary[keys[i]]) < b.getValue(dictionary[keys[i]])) {
                                return -1;
                            }
                            else if (a.getValue(dictionary[keys[i]]) > b.getValue(dictionary[keys[i]])) {
                                return 1;
                            }
                        }
                        return 0;
                    });
                }
            }
            else if (dir == "DOWN") {
                if (!isUndefined(order)) {
                    ret_table.sort((a: Dataset_obj, b: Dataset_obj) => {
                        for (let i = 0; i < keys.length; i++) {
                            if (a.getValue(dictionary[keys[i]]) < b.getValue(dictionary[keys[i]])) {
                                return 1;
                            }
                            else if (a.getValue(dictionary[keys[i]]) > b.getValue(dictionary[keys[i]])) {
                                return -1;
                            }
                        }
                        return 0;
                    });
                }
            }
            else {
                throw Error("invalid direction line 963");
            }
        }
        else {

            ret_table.sort((a: Dataset_obj, b: Dataset_obj) => {
                if (typeof b.getValue(dictionary[order]) == "number")
                    return a.getValue(dictionary[order]) - b.getValue(dictionary[order]);
                else
                    return a.getValue(dictionary[order]).localeCompare(b.getValue(dictionary[order]));
            });

        }
    }


    var ret_array: any = [];

    for (let item of ret_table) {

        let ret_obj: {[index: string]: any} = {};
        for (let column of columns) {
            try {
                if (!isUndefined(dictionary[column]))
                    ret_obj[column] = item.getValue(dictionary[column]);
            } catch (err) {
                throw err;
            }
        }
        ret_array.push(ret_obj);
    }


    return ret_array;
}

function filter_helper(table: Array<Dataset_obj>, query: QueryRequest, missing_col: string[], error_400: Object[]): Array<Dataset_obj> {

    var j_query = JSON.stringify(query);
    var j_obj = JSON.parse(j_query);
    var keys = Object.keys(j_obj);
    var key = keys[0];
    var ret_array: Dataset_obj[] = [];

    if (key == "IS") {

        var inner_query = j_obj[key];
        var inner_keys = Object.keys(inner_query);
        if (Object.keys(inner_query).length == 0) {
            throw new Error("empty IS");
        }
        if (inner_keys.length > 1) {
            throw new Error("too many parameters");
        }

        check_missing(inner_keys, missing_col);

        if (missing_col.length == 0) {

            var target = dictionary[inner_keys[0]];
            for (let item of table) {

                try {
                    var input = inner_query[inner_keys[0]];

                    if (typeof input == "string" && typeof item.getValue(target) == "string") {

                        var index_of_partial_first: number = input.indexOf("*");
                        if (index_of_partial_first == 0 && input.length > 1) {
                            var index_of_partial_second: number = input.indexOf("*", input.length - 1);
                            if (index_of_partial_second != -1) {
                                //*aaa*

                                var sub_input = input.substring(1, input.length - 1);
                                if (item.getValue(target).includes(sub_input)) {
                                    ret_array.push(item);
                                }

                            } else {//*aa

                                if (item.getValue(target).endsWith(input.substring(1))) {
                                    ret_array.push(item);
                                }
                            }
                        } else if (index_of_partial_first == input.length - 1 && input.length > 1) {// aaa*

                            if (item.getValue(target).startsWith(input.substring(0, input.length - 1))) {
                                ret_array.push(item);
                            }
                        }
                        else {
                            if (input == item.getValue(target)) {
                                ret_array.push(item);
                            }
                        }

                    }

                    else {
                        error_400.push({"error": "type error IS"});
                    }
                } catch (err) {
                    error_400.push({"error": err.message + " 1004"});
                }

            }
        }
    }
    else if (key == "GT") {


        var inner_query = j_obj[key];
        var inner_keys = Object.keys(inner_query);


        if (Object.keys(inner_query).length == 0) {
            throw new Error("empty GT");
        }

        if (inner_keys.length > 1) {
            throw new Error("too many parameters");
        }

        check_missing(inner_keys, missing_col);

        if (missing_col.length == 0) {
            var target = dictionary[inner_keys[0]];
            for (let item of table) {

                try {
                    if (typeof inner_query[inner_keys[0]] == "number" && typeof item.getValue(target) == "number") {
                        if (item.getValue(target) > inner_query[inner_keys[0]]) {
                            ret_array.push(item);
                        }
                    }
                    else {
                        error_400.push({"error": "type error GT"});
                    }
                } catch (err) {
                    error_400.push({"error": "error at line 996"});
                }

            }
        }
    }
    else if (key == "LT") {

        var inner_query = j_obj[key];
        var inner_keys = Object.keys(inner_query);

        if (inner_keys.length > 1) {
            throw new Error("too many parameters");
        }

        if (Object.keys(inner_query).length == 0) {
            throw new Error("empty LT");
        }
        check_missing(inner_keys, missing_col);

        if (missing_col.length == 0) {
            var target = dictionary[inner_keys[0]];
            for (let item of table) {

                try {
                    if (typeof inner_query[inner_keys[0]] == "number" && typeof item.getValue(target) == "number") {
                        if (item.getValue(target) < inner_query[inner_keys[0]]) {
                            ret_array.push(item);
                        }
                    }
                    else {
                        error_400.push({"error": "type error LT"});
                    }
                } catch (err) {
                    error_400.push({"error": err.message + " 1075"});
                }

            }
        }
    }
    else if (key == "EQ") {
        var inner_query = j_obj[key];
        var inner_keys = Object.keys(inner_query);
        if (inner_keys.length > 1) {
            throw new Error("too many parameters");
        }


        if (Object.keys(inner_query).length == 0) {
            throw new Error("empty EQ");
        }
        check_missing(inner_keys, missing_col);

        if (missing_col.length == 0) {
            var target = dictionary[inner_keys[0]];
            for (let item of table) {

                try {
                    if (typeof inner_query[inner_keys[0]] == "number" && typeof item.getValue(target) == "number") {
                        if (item.getValue(target) == inner_query[inner_keys[0]]) {
                            ret_array.push(item);
                        }
                    }
                    else {
                        error_400.push({"error": "type error EQ"});
                    }
                } catch (err) {
                    error_400.push({"error": err.message + " 1108"});
                }

            }
        }
    }
    else if (key == "AND") {
        var and_list = j_obj[key];
        var final_array: Dataset_obj[] = [];

        if (and_list.length == 0) {
            throw new Error("empty AND");
        }

        for (let item of and_list) {
            var a = JSON.stringify(item);
            var query: QueryRequest = item;
            var temp = filter_helper(table, query, missing_col, error_400);
            final_array = final_array.concat(temp);
        }
        final_array.sort(compare);
        for (var i = 0; i < final_array.length; i++) {
            var in_intersection = false;

            var index = i + and_list.length - 1;
            if (index < final_array.length) {

                if (final_array[i].id == final_array[index].id) {
                    in_intersection = true;
                }
            }
            else {
                in_intersection = false;
            }

            if (in_intersection) {
                ret_array.push(final_array[i]);
            }
        }

    }
    else if (key == "OR") {
        var or_list = j_obj[key];
        var final_array: Dataset_obj[] = [];

        if (or_list.length == 0) {
            throw new Error("empty OR");
        }

        for (let item of or_list) {
            var a = JSON.stringify(item);
            var query: QueryRequest = item;
            var temp = filter_helper(table, query, missing_col, error_400);
            final_array = final_array.concat(temp);
        }
        final_array.sort(compare);

        if (!isUndefined(final_array[0]))
            ret_array.push(final_array[0]);
        for (var i = 1; i < final_array.length; i++) {
            if (final_array[i].id != ret_array[ret_array.length - 1].id) {
                ret_array.push(final_array[i]);
            }
        }
    }
    else if (key == "NOT") {


        var inner_query = j_obj[key];
        var inner_keys = Object.keys(inner_query);
        if (inner_keys.length > 1) {
            throw new Error("too many parameters");
        }
        if (Object.keys(inner_query) == []) {
            throw new Error("empty NOT");
        }

        var query: QueryRequest = inner_query;
        var before_negate = filter_helper(table, query, missing_col, error_400);


        var final_array = before_negate.concat(table);
        final_array.sort(compare);

        var element_1 = final_array[0];
        for (var i = 1; i < final_array.length; i++) {
            var element_2 = final_array[i];
            if (element_2.id != element_1.id) {
                ret_array.push(element_1);
                element_1 = final_array[i];
            } else if ((i + 1) < final_array.length) {
                element_1 = final_array[i + 1];
                i++;
            }
        }
        if (final_array[final_array.length - 2].id != final_array[final_array.length - 1].id) {
            ret_array.push(final_array[final_array.length - 1]);
        }


    }
    else
        throw new Error("invalid query missing filter word 736");

    return ret_array;
}

function perform_Query_transform(query: QueryRequest, this_obj: InsightFacade): Promise<InsightResponse> {
    let j_query = JSON.stringify(query);
    let j_obj = JSON.parse(j_query);

    let where = j_obj["WHERE"];
    let transformation = j_obj["TRANSFORMATIONS"];
    let group = transformation["GROUP"];
    let apply = transformation["APPLY"];
    let options = j_obj["OPTIONS"];
    let columns = options["COLUMNS"];
    let order = options["ORDER"];
    let form = options["FORM"];

    let temp: string = group[0];
    let id = temp.substring(0, temp.indexOf("_"));

    let all_columns: string[];
    if (id == "courses") {
        all_columns = [
            "courses_dept",
            "courses_avg",
            "courses_uuid",
            "courses_title",
            "courses_instructor",
            "courses_fail",
            "courses_audit",
            "courses_pass",
            "courses_year",
            "courses_id"
        ];
    }
    else if (id == "rooms") {

        all_columns = [
            "rooms_fullname",
            "rooms_shortname",
            "rooms_name",
            "rooms_number",
            "rooms_address",
            "rooms_lat",
            "rooms_lon",
            "rooms_seats",
            "rooms_furniture",
            "rooms_href",
            "rooms_type"
        ];
    }


    let helper_query = {
        "WHERE": where,
        "OPTIONS": {
            "COLUMNS": all_columns
            ,
            "FORM": "TABLE"
        }
    };

    return new Promise((fulfill, reject) => {
        this_obj.performQuery(helper_query).then(function (response: InsightResponse) {
            // get the groups

            let j_response = JSON.parse(JSON.stringify(response.body));

            let table = j_response["result"];

            if (table.length < 1) {
                return fulfill(response);
            }
            for (let tuple of table) {

                let group_id_value: string = "";
                for (let group_key of group) {
                    group_id_value += tuple[group_key] + "_";
                }
                // group_id_value=group_id_value.substring(0,group_id_value.length-1);
                tuple["group_id"] = group_id_value;

            }

            table.sort((a: any, b: any) => {

                if (a["group_id"] < b["group_id"]) {
                    return -1;
                }
                else if (a["group_id"] > b["group_id"]) {
                    return 1;
                }
                else
                    return 0;
            });


            let prev_group_name = table[0]["group_id"];
            let groups: {[index: string]: any} = {};
            groups[prev_group_name] = [];
            let j = 0;
            for (let i = 0; i < table.length; i++) {
                let group_name = table[i]["group_id"];
                if (prev_group_name == group_name) {
                    groups[prev_group_name].push(table[i]);
                }
                else {
                    prev_group_name = group_name;
                    groups[prev_group_name] = [];
                    groups[prev_group_name].push(table[i]);
                }
            }

            //console.log(groups);
            let group_keys = Object.keys(groups);

            let final_groups = [];

            for (let key of group_keys) {

                let group = groups[key];
                let result_list = [];
                let final_group_obj: {[index: string]: any} = {};

                final_group_obj["group_id"] = key;


                for (let item of apply) {

                    let item_key = Object.keys(item)[0];  //ie maxSeats
                    let function_use = Object.keys(item[item_key])[0]; // "MAX"
                    let function_target = item[item_key][function_use]; //"rooms_seats"

                    let result;

                    switch (function_use) {
                        case "MAX":

                            //groups[group_keys[0]]   [{...}, {...}, {...} ]  same as  groups[key]  = group
                            // groups[group_keys[0]][0]    {....}   group[0]
                            // group[group_keys[0]][0] [function_target]  group[0][function_target] a specific value

                            if (typeof group[0][function_target] != "number") {
                                throw Error("Invalid type 1440");
                            }

                            let max = group[0][function_target];

                            // console.log(max);
                            for (let obj of group) {
                                if (obj[function_target] > max) {
                                    max = obj[function_target];
                                }
                            }

                            result = max;
                            break;
                        case "MIN":

                            if (typeof group[0][function_target] != "number") {
                                throw Error("Invalid type 1440");
                            }

                            let min = group[0][function_target];

                            for (let obj of group) {
                                if (obj[function_target] < min) {
                                    min = obj[function_target];
                                }
                            }
                            result = min;
                            break;
                        case "AVG":
                            let sum = 0;
                            result = 0;
                            if (typeof group[0][function_target] != "number") {
                                throw Error("Invalid type 1440");
                            }

                            let counter = 0;

                            for (let obj of group) {
                                sum += obj[function_target];
                                counter++;
                            }

                            result = sum / counter;
                            result = Number(result.toFixed(2));

                            break;
                        case"COUNT":

                            result = 0;
                            let temp = group;
                            if (temp.length > 0) {

                                temp.sort((a: any, b: any) => {

                                    if (a[function_target] < b[function_target]) {
                                        return -1;
                                    }
                                    else if (a[function_target] > b[function_target]) {
                                        return 1;
                                    }
                                    else
                                        return 0;
                                });

                                let prev_val = temp[0][function_target];
                                result = 1;
                                for (let obj of temp) {
                                    if (obj[function_target] != prev_val) {
                                        result++;
                                        prev_val = obj[function_target];
                                    }
                                }

                            }
                            else {
                                console.log("empty list 1501,count =0");
                            }

                            break;
                        case"SUM":
                            result = 0;
                            if (typeof group[0][function_target] != "number") {
                                throw Error("Invalid type 1440");
                            }

                            for (let obj of group) {
                                result += obj[function_target];
                            }

                            break;
                        default:
                            throw Error("invalid function to use 1447");
                    }

                    result_list.push(result);
                    final_group_obj[item_key] = result;


                    // group item also need a column


                }


                let temp_group = transformation["GROUP"];

                for (let item of temp_group) {
                    final_group_obj[item] = group[0][item];
                }
                final_groups.push(final_group_obj);
                //console.log(result_list);

            }
            //console.log(final_groups);

            let valid_list: any[] = [];
            valid_list = valid_list.concat(group);

            //console.log(valid_list);

            let apply_keys = [];
            for (let item of apply) {
                let item_key = Object.keys(item)[0];
                apply_keys.push(item_key);
            }


            valid_list = valid_list.concat(apply_keys);

            // console.log(apply_keys);
            // console.log(valid_list);

            // for (let item of columns) {
            //
            //     let valid: boolean = false;
            //     for (let validator of valid_list) {
            //         if (item == validator) {
            //             valid = true;
            //             break;
            //         }
            //     }
            //     if (!valid) {
            //         throw Error("invalid key in column 1581");
            //     }
            // }

            //console.log(order);
            if (!isUndefined(order)) {

                if (typeof order == "object") {
                    let dir = order["dir"];
                    let keys = order["keys"];

                    if (dir == "UP") {
                        final_groups.sort((a: any, b: any) => {
                            return local_compare(a, b, keys);
                        });

                    }
                    else if (dir == "DOWN") {

                        final_groups.sort((a: any, b: any) => {
                            return -1 * local_compare(a, b, keys);
                        });

                    }
                    else {
                        throw Error("invalid direction line 903");
                    }
                }
                else {

                    final_groups.sort((a: any, b: any) => {
                        if (typeof a[order] == "number")
                            return a[order] - b[order];
                        else
                            return a[order].localeCompare(b[order]);
                    });

                }
            }

            let ret_list = [];
            for (let group of final_groups) {
                let ret_obj: {[index: string]: any} = {};

                for (let column of columns) {
                    let temp = column.indexOf("_");
                    ret_obj[column] = group[column];

                }
                ret_list.push(ret_obj);
            }

            // console.log(ret_list);
            // console.log("----------------------");
            // console.log(final_groups);

            let ret_obj = {render: form, result: ret_list}
            fulfill({code: 200, body: ret_obj});
        }).catch(function (err) {
            reject({code: 400, body: {"error": "error in perform_query_transform 1647"}});
        });

    });


}

function compare(a: Dataset_obj, b: Dataset_obj): number {
    return Number(a.id) - Number(b.id);
}

function check_missing(keys: any, missing_col: string []) {

    for (var i = 0; i < keys.length; i++) {
        var val = dictionary[keys[i]];
        if (isUndefined(val)) {
            var vals: string = keys[i].toString();
            missing_col.push(keys[i]);
        }
    }
}

function extract_info(target: string, key_start: string, key_end: string): string {

    var key_start_index = target.indexOf(key_start) + key_start.length;
    var ret_str = target.substring(key_start_index, target.indexOf(key_end, key_start_index)).trim();

    return ret_str;
}

function local_compare(a: any, b: any, keys: any[]): number {
    for (let i = 0; i < keys.length; i++) {
        if (a[keys[i]] < b[keys[i]]) {
            return -1;
        }
        else if (a[keys[i]] > b[keys[i]]) {
            return 1;
        }
    }
    return 0;
}

function check_order(order: any, columns: any): boolean {

    if (!isUndefined(order)) {
        if (typeof order == "string") {
            let valid = false;
            for (let column of columns) {
                if (order == column) {
                    valid = true;
                    break;
                }

            }
            if (!valid || isUndefined(dictionary[order])) {
                return false;
            }
        }
        else {
            if (isUndefined(order["dir"]) || isUndefined(order["keys"])) {
                return false;
            }

            if (order["dir"] != "UP" && order["dir"] != "DOWN") {
                return false;
            }

            if (order["keys"].length == 0) {
                return false;
            }

            for (let item of order["keys"]) {
                let valid: boolean = false;
                for (let column of columns) {
                    if (item == column) {
                        valid = true;
                        break;
                    }
                }
                if (!valid) {
                    return false
                }


            }
        }


    }
    return true;
}

function validate(query: QueryRequest): InsightResponse {

    let ret_obj: InsightResponse = {code: 200, body: "valid"};

    try {
        var j_query = JSON.stringify(query);
        var j_obj = JSON.parse(j_query);

        var options = j_obj["OPTIONS"];
        var columns = options["COLUMNS"];
        var order = options["ORDER"];
        var form = options["FORM"];
        var transformations = j_obj["TRANSFORMATIONS"];

    }
    catch (err) {
        ret_obj = {code: 400, body: "invalid query 1723"};
        return ret_obj;
    }

    if (!isUndefined(transformations)) {

        let apply = transformations["APPLY"];
        let group = transformations["GROUP"];
        if (isUndefined(group) || isUndefined(apply)) {
            ret_obj = {code: 400, body: "invalid transformations"};
            return ret_obj;
        }
        if (group.length == 0) {
            ret_obj = {code: 400, body: "empty group"};
            return ret_obj;
        }

        let temp = group[0].toString();
        let id = temp.substring(0, temp.indexOf("_"));

        for (let item of group) {
            let this_id;
            this_id = item.toString().substring(0, item.indexOf("_"));
            if (id != this_id && this_id != "") {
                return ret_obj = {code: 400, body: "two datasets in group"};
            }

            if (isUndefined(dictionary[item])) {
                return ret_obj = {code: 400, body: "invalid group key"};
            }

        }

        let valid_list: any[] = [];
        valid_list = valid_list.concat(group);

        let apply_keys = [];
        for (let item of apply) {
            let item_key = Object.keys(item)[0];
            apply_keys.push(item_key);
        }


        valid_list = valid_list.concat(apply_keys);

        for (let item of columns) {

            let valid: boolean = false;
            for (let validator of valid_list) {
                if (item == validator) {
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                return ret_obj = {code: 400, body: "invalid key in column key 1786"};
            }
        }

    }
    else {

        if (columns.length != 0) {

            var column0 = columns[0];
            var id: string = column0.substring(0, column0.indexOf("_"));
            var exist: boolean = fs.existsSync("src/" + id + ".txt");
            if (!exist) {
                return ret_obj = {code: 424, body: "dataset not exist"};
            }

        } else {
            return ret_obj = {code: 400, body: "empty column"};
        }

        for (let column of columns) {
            var value = dictionary[column];

            if (column.substring(0, column.indexOf("_")) != id || isUndefined(value)) {
                return ret_obj = {code: 400, body: "invalid column item"};
            }
        }

        if (form != "TABLE") {
            return ret_obj = {code: 400, body: "invalid form"};
        }
    }

    if (!check_order(order, columns)) {
        return ret_obj = {code: 400, body: "invalid order"};
    }

    return ret_obj;
}

