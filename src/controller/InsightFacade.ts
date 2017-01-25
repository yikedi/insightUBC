/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";
import {fullResponse} from "restify";
import {error} from "util";
var JSZip = require('jszip');
var fs = require('fs');
var zip = new JSZip();


class Course_obj{

    // dictionary = {
    //     "courses_dept": "Subject",
    //     "courses_id": "course",
    //     "courses_avg": "Avg",
    //     "courses_instructor": "Professor",
    //     "courses_title": "Title",
    //     "courses_pass": "Pass",
    //     "courses_fail": "fail",
    //     "courses_audit": "Audit",
    //     "courses_uuid": "id"
    // };

    Subject: string;
    Course: string;
    Avg :number;
    Professor: string;
    Title: string;
    Pass: number;
    Fail: number;
    Audit: number;
    id: number;

    get (target:string) :any{

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
                throw new Error ("invalid key");
        }


    }

    set (target:string,value:string):any{
        switch (target){
            case "Subject":{
                this.Subject=value;
            }
            case "Course":{
                this.Course=value;
            }
            case "Avg":{
                this.Avg=Number(value);
            }
            case "Professor":{
                this.Professor=value;
            }
            case "Title":{
                this.Title=value;
            }
            case "Pass":{
                this.Pass=Number(value);
            }
            case "Fail":{
                this.Fail=Number(value);
            }
            case "Audit":{
                this.Audit=Number(value);
            }
            case "id":{
                this.id=Number(value);
            }
            default :
                throw new Error ("invalid key");
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

                                    try {
                                        var temp = JSON.parse(item);
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
                var a = table[100];
                console.log(a);
                var body =filter(table,query);
                fulfill({code: 200, body: body});
            }).catch(function (err:Error) {
                reject({code:400, body:err.message});
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

            let course_obj: {[index: string]:  string} = {};

            for (let s of interest_info) {
                var value = item[s];
                course.set(s,value);
            }

            let course_class_obj=new Course_obj();
            // course_class_obj.Audit=Number(course_obj["Audit"]);
            // course_class_obj.Avg=Number(course_obj["Avg"]);
            // course_class_obj.id=Number(course_obj["id"]);
            // course_class_obj.Course=course_obj["Course"];
            // course_class_obj.Fail=Number(course_obj["Fail"]);
            // course_class_obj.Subject=course_obj["Subject"];
            // course_class_obj.Pass=Number(course_obj["Pass"]);
            // course_class_obj.Professor=course_obj["Professor"];
            // course_class_obj.Title=course_obj["Title"];

            course_list.push(course_class_obj);

        }
    }

    return course_list;
}

function filter(table: Array<Course_obj>, query: QueryRequest): Array<any> {

    var j_query=query.content;
    var j_obj = JSON.parse(j_query);
    var options = j_obj["OPTIONS"];
    var where=j_obj["WHERE"];

    var ret_table=filter_helper(table,where);
    var columns = options["COLUMNS"];
    var order = options["ORDER"];
    var form = options["FORM"];

    let ret_obj:{[index: string] : any}=[];
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

    var ret_array : any =[];

    for (let item of table){
        for (let column of columns){
            ret_obj[column]=item.get(dictionary[column]);
        }
        ret_array.push(ret_obj);
    }

    
    return ret_array;
}

function filter_helper (table: Array<Course_obj>, query: QueryRequest): Array<Course_obj> {

    var j_query=query.content;
    var j_obj = JSON.parse(j_query);
    var keys=Object.keys(j_obj);
    var key=keys[0];
    var ret_array:Course_obj[]=[];


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



    //let temp_item :{[index: string] :any}={};
    // var dictionary_keys=Object.keys(dictionary);

    if (key=="IS"){
        var inner_query=j_obj[key];
        var inner_keys=Object.keys(inner_query);
        // var ret_array :Course_obj[]=[];
        for (let item of table ){

            // temp_item["Subject"]=item.Subject;
            // temp_item["id"]=item.id;
            // temp_item["Audit"]=item.Audit;
            // temp_item["Course"]=item.Course;
            // temp_item["Avg"]=item.Avg;
            // temp_item["Title"]=item.Title;
            // temp_item["Professor"]=item.Professor;
            // temp_item["Pass"]=item.Pass;
            // temp_item["Fail"]=item.Fail;

            var satisfy :boolean=false;
            for (var j=0;i<inner_keys.length;j++){

                var target=dictionary[inner_keys[j]];
                if (item.get(target).toString==inner_query[inner_keys[i]]){
                    satisfy=true;
                }
                else {
                    satisfy=false;
                }
            }

            if (satisfy){
                ret_array.push(item);
            }
        }

    }
    else if (key=="GT"){
        var inner_query=j_obj[key];
        var inner_keys=Object.keys(inner_query);
        // var ret_array :Course_obj[]=[];
        for (let item of table ){

            // temp_item["Subject"]=item.Subject;
            // temp_item["id"]=item.id;
            // temp_item["Audit"]=item.Audit;
            // temp_item["Course"]=item.Course;
            // temp_item["Avg"]=item.Avg;
            // temp_item["Title"]=item.Title;
            // temp_item["Professor"]=item.Professor;
            // temp_item["Pass"]=item.Pass;
            // temp_item["Fail"]=item.Fail;

            var satisfy :boolean=false;
            for (var j=0;i<inner_keys.length;j++){

                var target=dictionary[inner_keys[j]];
                if (item.get(target)>Number(inner_query[inner_keys[i]])){
                    satisfy=true;
                }
                else {
                    satisfy=false;
                }
            }

            if (satisfy){
                ret_array.push(item);
            }
        }
    }
    else if (key=="LT"){
        var inner_query=j_obj[key];
        var inner_keys=Object.keys(inner_query);
        // var ret_array :Course_obj[]=[];
        for (let item of table ){

            // temp_item["Subject"]=item.Subject;
            // temp_item["id"]=item.id;
            // temp_item["Audit"]=item.Audit;
            // temp_item["Course"]=item.Course;
            // temp_item["Avg"]=item.Avg;
            // temp_item["Title"]=item.Title;
            // temp_item["Professor"]=item.Professor;
            // temp_item["Pass"]=item.Pass;
            // temp_item["Fail"]=item.Fail;

            var satisfy :boolean=false;
            for (var j=0;i<inner_keys.length;j++){

                var target=dictionary[inner_keys[j]];
                if (item.get(target)<Number(inner_query[inner_keys[i]])){
                    satisfy=true;
                }
                else {
                    satisfy=false;
                }
            }

            if (satisfy){
                ret_array.push(item);
            }
        }
    }
    else if (key=="EQ"){
        var inner_query=j_obj[key];
        var inner_keys=Object.keys(inner_query);
        // var ret_array :Course_obj[]=[];
        for (let item of table ){

            // temp_item["Subject"]=item.Subject;
            // temp_item["id"]=item.id;
            // temp_item["Audit"]=item.Audit;
            // temp_item["Course"]=item.Course;
            // temp_item["Avg"]=item.Avg;
            // temp_item["Title"]=item.Title;
            // temp_item["Professor"]=item.Professor;
            // temp_item["Pass"]=item.Pass;
            // temp_item["Fail"]=item.Fail;

            var satisfy :boolean=false;
            for (var j=0;i<inner_keys.length;j++){

                var target=dictionary[inner_keys[j]];
                if (item.get(target)==Number(inner_query[inner_keys[i]])){
                    satisfy=true;
                }
                else {
                    satisfy=false;
                }
            }

            if (satisfy){
                ret_array.push(item);
            }
        }
    }
    else if (key=="AND"){
        var and_list=j_obj[key];
        var final_array: Course_obj[]=[];
        // var ret_array:Course_obj[]=[];
        for (let item of and_list){
            var temp=filter_helper(table,item);
            final_array.concat(temp);
        }
        final_array.sort(compare);
        for (var i=0;i<final_array.length;i++){
            var in_intersection=false;
            for (var j=0;j<and_list.length;j++){
                if (final_array[i].id==final_array[i+j].id){
                    in_intersection=true;
                }
                else {
                    in_intersection=false;
                }
            }
            if (in_intersection){
                ret_array.push(final_array[i]);
            }
        }
        //return ret_array;
    }
    else if (key=="OR"){
        var or_list=j_obj[key];
        var final_array: Course_obj[]=[];
        // var ret_array:Course_obj[]=[];
        for (let item of or_list){
            var temp=filter_helper(table,item);
            final_array.concat(temp);
        }
        final_array.sort(compare);
        ret_array.push(final_array[0]);
        for (var i=1;i<final_array.length;i++){
            if (final_array[i].id!=ret_array[i-1].id){
                ret_array.push(final_array[i]);
            }
        }

        // return ret_array;

    }
    else if (key=="NOT"){

        var inner_query=j_obj[key];
        var before_negate=filter_helper(table,inner_query);
        // var ret_array :Course_obj[]=[];
        for (var i=0;i<before_negate.length;i++){

            if(! table.includes(before_negate[i])){
                ret_array.push(before_negate[i]);
            }
        }
        //return ret_array;

    }



    return ret_array;
}

function compare (a :Course_obj, b:Course_obj): number{
    return a.id-b.id;
}



