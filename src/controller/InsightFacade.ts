/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";
import {isUndefined} from "util";
import forEach = require("core-js/fn/array/for-each");
var JSZip = require('jszip');
var fs = require('fs');
const parse5 = require('parse5');

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
    "courses_uuid": "id"
};

class Course_obj {

    Subject: string;
    Course: string;
    Avg: number;
    Professor: string;
    Title: string;
    Pass: number;
    Fail: number;
    Audit: number;
    id: string;

    constructor() {
        this.Subject = null;
        this.Course = null;
        this.Avg = null;
        this.Professor = null;
        this.Title = null;
        this.Pass = null;
        this.Fail = null;
        this.Audit = null;
        this.id = null;
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
            default :
                throw new Error(target);
        }
    }
}



class Rooms_obj {

    rooms_fullname: string;
    rooms_shortname: string;
    rooms_number: string;
    rooms_name: string;
    rooms_address: string;
    rooms_lat: number;
    rooms_lon: number;
    rooms_seats: number;
    rooms_type: string;
    rooms_furniture:string;
    rooms_href:string;

    constructor() {
        this.rooms_fullname= null;
        this.rooms_shortname= null;
        this.rooms_number= null;
        this.rooms_name= null;
        this.rooms_address= null;
        this.rooms_lat= null;
        this.rooms_lon= null;
        this.rooms_seats= null;
        this.rooms_type= null;
        this.rooms_furniture=null;
        this.rooms_href=null;
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
            default :
                throw new Error(target);
        }
    }
}


export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

//
    addDataset(id: string, content: string): Promise<InsightResponse> {


        return new Promise(function (fulfill, reject) {

            var ret_obj = null;
            var zip = new JSZip();
            var exist: boolean = fs.existsSync("src/" + id + ".txt");

                zip.loadAsync(content, {"base64": true})
                    .then(function (data: JSZip) {


                        var promise_list: Promise<string>[] = [];
                        var name_list: string[] = [];

                        if (id=="courses") {
                            data.forEach(function (path, file) {
                                name_list.push(file.name);
                                promise_list.push(file.async("string"));

                            });

                            var final_string = "{\"" + id + "\":[";

                            Promise.all(promise_list).then(function (list) {

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
                                    ret_obj = {code: 400, body: {"error": err.message}};
                                    return reject(ret_obj)
                                }


                                fs.writeFile('src/' + id + '.txt', j_objs, (err: Error) => {
                                    if (err) {

                                        ret_obj = {code: 400, body: {"error": err.message}};
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
                                        return fulfill(ret_obj);
                                    }
                                });

                            }).catch(function (err: Error) {
                                //console.log("in write file catch line 228");
                                ret_obj = {code: 400, body: {"error": err.message}};
                                return reject(ret_obj);
                            });

                        }
                        else {

                            var index_file:any
                            data.forEach(function (path, file) {

                                name_list.push(file.name);
                                promise_list.push(file.async("string"));

                            });

                            Promise.all(promise_list).then(function (list) {


                                for (var i=0;i<name_list.length;i++){
                                    if (name_list[i]=="index.htm"){
                                        index_file=list[i];
                                        break;
                                    }
                                }

                                var tbody_start = index_file.indexOf("<tbody>");
                                var tbody_end = index_file.indexOf("</tbody>");
                                var temp=index_file.substring(tbody_start+"<tbody>".length, tbody_end);


                                var buildings=temp.split("</tr>");
                                buildings.pop();
                                var final_buildings: any[]=[];
                                for (let item of buildings){

                                    let building: {[index: string]: any} = {};
                                    var temp_s="a href=\"";
                                    var a_href=extract_info(item,temp_s,"\"");

                                    temp_s="building-code\" >";
                                    var short_name=extract_info(item,temp_s,"</td>");

                                    temp_s="views-field-title\" >";
                                    var full_name_index=item.indexOf(temp_s)+temp_s.length;
                                    temp_s="title=\"Building Details and Map\">";
                                    var full_name_index=item.indexOf(temp_s,full_name_index)+temp_s.length;
                                    var full_name=item.substring(full_name_index,item.indexOf("</a>",full_name_index));

                                    temp_s="field-building-address\" >";
                                    var address=extract_info(item,temp_s,"</td>");

                                    building["a_href"]=a_href;
                                    building["short_name"]=short_name;
                                    building["full_name"]=full_name;
                                    building["address"]=address;

                                    final_buildings.push(building);
                                }

                               var final_rooms:any[]=[];

                               for (var i=0;i<list.length;i++){
                                    var item=list[i];
                                    for (var j=0;j<final_buildings.length;j++){

                                        if ("./"+name_list[i]==final_buildings[j]["a_href"]){

                                            var room_shortname=final_buildings[j]["short_name"];
                                            var room_fullname=final_buildings[j]["full_name"];
                                            var room_address=final_buildings[j]["address"];
                                            var room_href=null;
                                            var room_number=null;
                                            var room_seats=null;
                                            var room_furniture=null;
                                            var room_type=null;
                                            var room_name=null;

                                            var room_lat;
                                            var room_lon;

                                             tbody_start = item.indexOf("<tbody>");
                                             tbody_end = item.indexOf("</tbody>");
                                             if (tbody_start!=-1) {
                                                 temp = item.substring(tbody_start + "<tbody>".length, tbody_end);
                                                 var rooms=temp.split("</tr>");

                                                 rooms.pop();
                                                 for (let room of rooms){

                                                     let room_obj: {[index: string]: any} = {};

                                                     var temp_s="a href=\"";
                                                     room_href=extract_info(room,temp_s,"\"");

                                                     temp_s="title=\"Room Details\">";
                                                     room_number=extract_info(room,temp_s,"</a>");

                                                     temp_s="room-capacity\" >";
                                                     room_seats=extract_info(room,temp_s,"</td>");

                                                     temp_s="room-furniture\" >";
                                                     room_furniture=extract_info(room,temp_s,"</td>");

                                                     temp_s="room-type\" >";
                                                     room_type=extract_info(room,temp_s,"</td>");

                                                     room_name=final_buildings[j]["short_name"]+"_"+room_number;

                                                     room_obj["rooms_fullname"]=room_fullname;
                                                     room_obj["rooms_shortname"]=room_shortname;
                                                     room_obj["rooms_name"]=room_name;
                                                     room_obj["rooms_number"]=room_number;
                                                     room_obj["rooms_address"]=room_address;
                                                     room_obj["rooms_seats"]=room_seats;
                                                     room_obj["rooms_furniture"]=room_furniture;
                                                     room_obj["rooms_href"]=room_href;

                                                     final_rooms.push(room_obj);
                                                 }

                                             }
                                             else {
                                                 let room_obj: {[index: string]: any} = {};
                                                 room_href =final_buildings[j]["a_href"];
                                                 room_obj["rooms_href"]=room_href;
                                                 room_obj["rooms_fullname"]=room_fullname;
                                                 room_obj["rooms_shortname"]=room_shortname;
                                                 room_obj["rooms_address"]=room_address;

                                                 room_obj["rooms_name"]=room_name;
                                                 room_obj["rooms_number"]=room_number;
                                                 room_obj["rooms_seats"]=room_seats;
                                                 room_obj["rooms_furniture"]=room_furniture;

                                                 final_rooms.push(room_obj);

                                             }


                                            // var interest_info = ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_number",
                                            //     "rooms_address", "rooms_lat", "rooms_lon", "rooms_seats", "rooms_furniture","rooms_href"];


                                            break;

                                        }

                                    }

                               }

                               var room_file={"rooms":final_rooms};
                               var j_objs=JSON.stringify(room_file);
                                fs.writeFile('src/' + id + '.txt', j_objs, (err: Error) => {
                                    if (err) {

                                        ret_obj = {code: 400, body: {"error": err.message}};
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
                                        return fulfill(ret_obj);
                                    }
                                });



//                                fulfill({code: 555, body:"at line 252"});
                            }).catch(function (err) {
                                return reject({code: 400, body:"error catched 535"});
                            });



                        }


                    }).catch(function (err: Error) {
                    //console.log("in JSZip catch line 235");
                    ret_obj = {code: 400, body: {"error": err.message}};
                    return reject(ret_obj);
                });



        });


    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
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
                        ret_obj = {code: 404, body: {"error": err.message}};
                        return reject(ret_obj);
                    } else {
                        ret_obj = {code: 204, body: "The operation was successful"};
                        return fulfill(ret_obj);
                    }
                });
            }

        });
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        return new Promise(function (fulfill, reject) {

            /*******/
            var id = "courses";

            var exist: boolean = fs.existsSync("src/" + id + ".txt");

            if (exist) {
                var file = fs.readFile("src/" + id + ".txt", 'utf-8', (err: Error, data: string) => {
                    if (err) {
                        //console.log("in exist err line 154");
                        return reject({code: 400, body: {"error": err.message}});
                    }
                    else {

                        var table = build_table(data);

                        var missing_col: string[] = [];
                        var error_400: Object[] = [];


                        try {
                            var j_query = JSON.stringify(query);
                            var j_obj = JSON.parse(j_query);

                            var where = j_obj["WHERE"];
                            var options = j_obj["OPTIONS"];
                            var columns = options["COLUMNS"];
                            var order = options["ORDER"];
                            var form = options["FORM"];
                        }
                        catch (err) {
                            return reject({code: 400, body: {"error": "invalid json or query 307"}});
                        }

                        var order_valid:boolean=false;
                        var order_check = dictionary[order];



                        for (let column of columns) {
                            var value = dictionary[column];

                            if (isUndefined(value)) {
                                if (column.substring(0,column.indexOf("_"))!=id){
                                    missing_col.push(column);
                                }
                            }
                            if (order==column){
                                order_valid=true;
                            }
                        }

                        if (!isUndefined(order)) {
                            if (isUndefined(order_check) || !order_valid)
                                missing_col.push(order);
                        }

                        if (form != "TABLE") {
                            missing_col.push(form);
                        }

                        if (missing_col.length > 0) {
                            return reject({code: 400, body: {"error": "invalid query 315"}});
                        }

                        missing_col = [];
                        var body = null;
                        try {
                            body = filter(table, query, missing_col, error_400);
                        } catch (err) {
                            return reject({code: 400, body: err.message});
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
                                    return reject({code: 400, body: err.message});
                                }
                            }

                            if (missing_ids.length > 0) {
                                return reject({code: 424, body: {"missing": missing_ids}});
                            }

                            return reject({code: 400, body: {"missing": missing_col}});


                        } else if (error_400.length > 0) {
                            return reject({code: 400, body: error_400[0]});
                        }

                        var ret_obj = {render: form, result: body};
                        return fulfill({code: 200, body: ret_obj});


                    }


                });

            }
            else {
                var ret_obj = {code: 400, body: {"error": "file not exist"}};
                return reject(ret_obj);
            }

        });

    }

}

function build_table(data: string): Array<Course_obj> {

    var temp = JSON.parse(data);
    var courses = temp["courses"];


    var course_list = new Array<Course_obj>();

    var interest_info = ["Subject", "Course", "Avg", "Professor", "Title", "Pass", "Fail", "Audit", "id"];

    for (let course of courses) {

        var keys_inner_1 = Object.keys(course);
        var course_info = course[keys_inner_1[0]];
        var results = course_info["result"];

        for (let item of results) {
            var each_course: Course_obj = new Course_obj();

            try {
                for (let s of interest_info) {
                    var value = item[s];
                    if(s == "id" || s=="Course"){
                        each_course.setValue(s,value.toString());
                    }else {
                        each_course.setValue(s, value);
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

function filter(table: Array<Course_obj>, query: QueryRequest, missing_col: string [], error_400: Object[]): any {

    var j_query = JSON.stringify(query);
    var j_obj = JSON.parse(j_query);

    var options = j_obj["OPTIONS"];
    var where = j_obj["WHERE"];

    var query: QueryRequest = where;
    var ret_table = [];
    try {
        ret_table = filter_helper(table, query, missing_col, error_400);
    } catch (err) {
        throw err;
    }

    var columns = options["COLUMNS"];
    var order = options["ORDER"];
    if (!isUndefined(order)) {
        ret_table.sort((a: Course_obj, b: Course_obj) => {
            if (typeof b.getValue(dictionary[order]) == "number")
                return a.getValue(dictionary[order]) - b.getValue(dictionary[order])
            else
                return a.getValue(dictionary[order]).localeCompare(b.getValue(dictionary[order]))
        });
    }


    var ret_array: any = [];

    for (let item of ret_table) {
        let ret_obj: {[index: string]: any} = {};
        for (let column of columns) {
            try {
                if(!isUndefined(dictionary[column]))
                    ret_obj[column] = item.getValue(dictionary[column]);
            } catch (err) {
                throw err;
            }
        }
        ret_array.push(ret_obj);
    }


    return ret_array;
}

function filter_helper(table: Array<Course_obj>, query: QueryRequest, missing_col: string[], error_400: Object[]): Array<Course_obj> {

    var j_query = JSON.stringify(query);
    var j_obj = JSON.parse(j_query);
    var keys = Object.keys(j_obj);
    var key = keys[0];
    var ret_array: Course_obj[] = [];

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
                    error_400.push({"error": err.message});
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
                    error_400.push({"error": err.message});
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
                    error_400.push({"error": err.message});
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
                    error_400.push({"error": err.message});
                }

            }
        }
    }
    else if (key == "AND") {
        var and_list = j_obj[key];
        var final_array: Course_obj[] = [];

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
        var final_array: Course_obj[] = [];

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
        if(final_array[final_array.length-2].id != final_array[final_array.length-1].id){
            ret_array.push(final_array[final_array.length-1]);
        }


    }
    else
        throw new Error("invalid query missing filter word 736");

    return ret_array;
}

function compare(a: Course_obj, b: Course_obj): number {
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

function addDataset_html(id: string, content: string): Promise<InsightResponse> {

    return new Promise(function (fulfill,reject) {

        var ret_obj = null;
        var zip = new JSZip();
        var exist: boolean = fs.existsSync("src/" + id + ".txt");

        var index_file:any;
        zip.loadAsync(content, {"base64": true}).then(function (data: JSZip) {

                var promise_list: Promise<string>[] = [];
                var name_list: string[] = [];

                data.forEach(function (path, file) {
                    name_list.push(file.name);
                    promise_list.push(file.async("string"));
                    if (file.name=="index.htm"){
                        index_file=file;
                    }
                });

                var index_file_string=index_file.toString();

                var tbody_start=index_file_string.indexOf("<tbody>");
                var tbody_end=index_file_string.indexOf("</tbody>");
                console.log(index_file_string.substring(tbody_start,tbody_end));




            });




        return fulfill();
    })

}

function extract_info(target:string, key_start:string,key_end:string) :string{

    var key_start_index=target.indexOf(key_start)+key_start.length;
    var ret_str=target.substring(key_start_index,target.indexOf(key_end,key_start_index)).trim();

    return ret_str;
}