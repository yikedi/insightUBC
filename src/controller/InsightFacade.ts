/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";
import {fullResponse} from "restify";
import {error} from "util";
import {isUndefined} from "util";
import {throws} from "assert";
var JSZip = require('jszip');
var fs = require('fs');
var zip = new JSZip();

let dictionary: {[index: string]: string} = {};
dictionary = {
    "courses_dept": "Subject",
    "courses_id": "Course",
    "courses_avg": "Avg",
    "courses_instructor": "Professor",
    "courses_title": "Title",
    "courses_pass": "Pass",
    "courses_fail": "fail",
    "courses_audit": "Audit",
    "courses_uuid": "id"
};

class Course_obj{

    Subject: string;
    Course: string;
    Avg :number;
    Professor: string;
    Title: string;
    Pass: number;
    Fail: number;
    Audit: number;
    id: number;

    constructor(){
        this.Subject = null;
        this.Course= null;
        this.Avg =null;
        this.Professor=null;
        this.Title=null;
        this.Pass=null;
        this.Fail=null;
        this.Audit=null;
        this.id=null;
    };

    getValue (target:string) :any{

        switch (target){
            case "Subject":{
                return this.Subject;
            }
            case "Course":{
                return this.Course;
            }
            case "Avg":{
                return this.Avg;
            }
            case "Professor":{
                return this.Professor;
            }
            case "Title":{
                return this.Title;
            }
            case "Pass":{
                return this.Pass;
            }
            case "Fail":{
                return this.Fail;
            }
            case "Audit":{
                return this.Audit;
            }
            case "id":{
                return this .id;
            }
            default :
                throw new Error (target);
        }


    }

    setValue (target:string,value:string){
        switch (target){
            case "Subject":{
                this.Subject=value;
                break;
            }
            case "Course":{
                this.Course=value;
                break;
            }
            case "Avg":{
                this.Avg=Number(value);
                break;
            }
            case "Professor":{
                this.Professor=value;
                break;
            }
            case "Title":{
                this.Title=value;
                break;
            }
            case "Pass":{
                this.Pass=Number(value);
                break;
            }
            case "Fail":{
                this.Fail=Number(value);
                break;
            }
            case "Audit":{
                this.Audit=Number(value);
                break;
            }
            case "id":{
                this.id=Number(value);
                break;
            }
            default :
                throw new Error (target);
        }
    }
}

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }


    addDataset(id: string, content: string): Promise<InsightResponse> {


        return new Promise(function (fulfill, reject) {

            var ret_obj = null;

            var exist: boolean = fs.existsSync("src/" + id + ".txt");

            if (exist) {
                var file = fs.readFile("src/" + id + ".txt", 'utf-8', (err: Error, data: string) => {
                    if (err) throw err;
                    ret_obj = {code: 201, body: data};
                    fulfill(ret_obj);
                });

            }
            else {
                zip.loadAsync(content, {"base64": true}).then(function (data: JSZip) {


                    var promise_list: Promise<string>[] = [];
                    var name_list: string[] = [];

                    data.forEach(function (path, file) {
                        name_list.push(file.name);
                        promise_list.push(file.async("string"));

                    });

                    var final_string = "{\"courses\":[";
                    //console.log(promise_list.length);

                    Promise.all(promise_list)
                        .then(function (list) {

                            //console.log("in promise all");
                            var i = 0;

                            for (let item of list) {


                                if (i > 0) {
                                    var temp;
                                    try {
                                        temp = JSON.parse(item);
                                    }
                                    catch (Error) {
                                        reject({code: 400, body: {"error": Error.message}});
                                        break;
                                    }

                                    var content = '{\"' + name_list[i] + '\":' + item + '},';
                                    final_string += content;
                                }
                                i++;
                            }
                            final_string = final_string.substr(0, final_string.length - 1) + "]}";
                            var j_objs = JSON.parse(final_string);
                            j_objs = JSON.stringify(j_objs);


                            fs.writeFile('src/' + id + '.txt', j_objs, (err: Error) => {
                                if (err) {
                                    ret_obj = {code: 400, body: err.message};
                                    reject(ret_obj);
                                }
                                else {
                                    ret_obj = {code: 204, body: j_objs};
                                    fulfill(ret_obj);
                                }
                            });

                            //console.log("after write");


                        })
                        .catch(function (err: Error) {
                            ret_obj = {code: 400, body: {"error": err.message}};
                            reject(ret_obj);
                        });


                }).catch(function (err: Error) {

                    ret_obj = {code: 400, body: {"error": err.message}};
                    reject(ret_obj);
                });
            }
        });


    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            var ret_obj = null;
            var path = "src/" + id + ".txt";
            fs.unlink(path, (err: Error) => {
                if (err) {
                    ret_obj = {code: 404, body: {"error": err.message}};
                    reject(ret_obj);
                } else {
                    ret_obj = {code: 204, body: "The operation was successful"};
                    fulfill(ret_obj);
                }
            });
        });
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {

        return new Promise(function (fulfill, reject) {
            //
            // var j_query = query.content;
            // var j_obj = JSON.parse(j_query);
            // var options = j_obj["OPTIONS"];
            //
            // console.log(options);
            // var column = options["COLUMNS"];
            // var order = options["ORDER"];
            // console.log(order);
            // var form = options["FORM"];

            var id = "courses";


            // var keys = Object.keys(column);
            // for (let key of keys) {
            //     console.log(column[key]);
            //     console.log(typeof column[key]);
            // }

            var dataSet = new InsightFacade();
            dataSet.addDataset(id, null).then(function (response: InsightResponse) {

                var table = build_table(response.body.toString());

                //after this line
                var missing_col: string[] = [];

                var j_query = query.content;
                var j_obj = JSON.parse(j_query);
                var options = j_obj["OPTIONS"];
                var columns = options["COLUMNS"];

                for(let column of columns){
                    var value = dictionary[column];
                    if(isUndefined(value))
                        missing_col.push(column);
                }

                if(missing_col.length>0)
                    reject ({code: 424, body: {"missing": missing_col}});
                //before this line
                var body=null;
                try {
                    body = filter(table, query);
                    //console.log(body);
                }catch(err){
                    reject({code: 400, body: err.message});
                }
                fulfill({code: 200, body: body});
            }).catch(function (err: Error) {
                reject({code: 400, body: err.message});
            });

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
                    //console.log(typeof course);
                    var value = item[s];
                    each_course.setValue(s, value);
                }
            } catch (err) {
                console.log(err.toString());
            }

            course_list.push(each_course);
        }
    }

    return course_list;
}

function filter(table: Array<Course_obj>, query: QueryRequest): Array<any> {

    var j_query = query.content;
    var j_obj = JSON.parse(j_query);
    var options = j_obj["OPTIONS"];
    var where = j_obj["WHERE"];

    var a = JSON.stringify(where);
    var query = {content: a};
    var ret_table;
    try {
        ret_table = filter_helper(table, query);
    }catch(err){
        throw err;
    }
    //console.log(ret_table);
    var columns = options["COLUMNS"];
    //console.log(columns);
    var order = options["ORDER"];
    var form = options["FORM"];

    ret_table.sort((a:Course_obj, b:Course_obj)=>{return b.getValue(dictionary[order])-a.getValue(dictionary[order])});


    var ret_array: any = [];

    for (let item of ret_table) {
        let ret_obj: {[index: string]: any} = {};
        for (let column of columns) {
            try {
                ret_obj[column] = item.getValue(dictionary[column]);
                //console.log(ret_obj);
            }catch(err){
                throw err;
            }
        }
        ret_array.push(ret_obj);
    }


    return ret_array;
}

function filter_helper(table: Array<Course_obj>, query: QueryRequest): Array<Course_obj> {

    var j_query = query.content;
    var j_obj = JSON.parse(j_query);
    var keys = Object.keys(j_obj);
    var key = keys[0];
    var ret_array: Course_obj[] = [];

    if (key == "IS") {
        var inner_query = j_obj[key];
        var inner_keys = Object.keys(inner_query);
        for (let item of table) {
            for (var i = 0; i < inner_keys.length; i++) {
                var target = dictionary[inner_keys[i]];
                try {
                    if (item.getValue(target) == inner_query[inner_keys[i]]) {
                        ret_array.push(item);
                    }
                }catch(err){
                    throw err;
                }
            }
        }
    }
    else if (key == "GT") {
        var inner_query = j_obj[key];
        var inner_keys = Object.keys(inner_query);
        for (let item of table) {
            for (var i = 0; i < inner_keys.length; i++) {
                var target = dictionary[inner_keys[i]];
                try {
                    if (item.getValue(target) > Number(inner_query[inner_keys[i]])) {
                        ret_array.push(item);
                    }
                }catch(err){
                    throw err;
                }
            }
        }
    }
    else if (key == "LT") {
        var inner_query = j_obj[key];
        var inner_keys = Object.keys(inner_query);
        for (let item of table) {
            for (var i = 0; i < inner_keys.length; i++) {
                var target = dictionary[inner_keys[i]];
                try {
                    if (item.getValue(target) < Number(inner_query[inner_keys[i]])) {
                        ret_array.push(item);
                    }
                }catch(err){
                    throw err;
                }
            }
        }
    }
    else if (key == "EQ") {
        var inner_query = j_obj[key];
        var inner_keys = Object.keys(inner_query);
        for (let item of table) {
            for (var i = 0; i < inner_keys.length; i++) {
                var target = dictionary[inner_keys[i]];
                try {
                    if (item.getValue(target) == Number(inner_query[inner_keys[i]])) {
                        ret_array.push(item);
                    }
                }catch(err){
                    throw err;
                }
            }
        }
    }
    else if (key == "AND") {
        var and_list = j_obj[key];
        var final_array: Course_obj[] = [];
        for (let item of and_list) {
            var a = JSON.stringify(item);
            var query = {content: a};
            var temp = filter_helper(table, query);
            //console.log(temp);
            final_array = final_array.concat(temp);
        }
        final_array.sort(compare);
        for (var i = 0; i < final_array.length; i++) {
            var in_intersection = false;
            //for (var j=0;j<and_list.length;j++){
            if (i + and_list.length < final_array.length) {
                var index = i + and_list.length - 1;

                if (final_array[i].id == final_array[index].id) {
                    in_intersection = true;
                }
            }
            else {
                in_intersection = false;
            }
            //}
            if (in_intersection) {
                ret_array.push(final_array[i]);
            }
        }
        //console.log(ret_array.length);
        //return ret_array;
    }
    else if (key == "OR") {
        var or_list = j_obj[key];
        var final_array: Course_obj[] = [];

        for (let item of or_list) {
            var a = JSON.stringify(item);
            var query = {content: a};
            var temp = filter_helper(table, query);
            final_array = final_array.concat(temp);
        }
        final_array.sort(compare);

        ret_array.push(final_array[0]);
        for (var i = 1; i < final_array.length; i++) {
            if (final_array[i].id != ret_array[i - 1].id) {
                ret_array.push(final_array[i]);
            }
        }
    }
    else if (key == "NOT") {

        var inner_query = j_obj[key];
        var a = JSON.stringify(inner_query);
        var query = {content: a};
        var before_negate = filter_helper(table, query);

        var final_array = before_negate.concat(table);
        final_array.sort(compare);

        var element_1 = final_array[0];
        for (var i = 1; i < final_array.length; i++) {
            var element_2 = final_array[i];
            if (element_2.id != element_1.id) {
                ret_array.push(element_1);
                element_1 = final_array[i];
            }else if ((i+1)<final_array.length){
                element_1 = final_array[i+1];
                i++;
            }
        }

    }


    return ret_array;
}

function compare(a: Course_obj, b: Course_obj): number {
    return a.id - b.id;
}




