/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";
import {fullResponse} from "restify";
var JSZip=require('jszip');
var fs=require('fs');
var zip=new JSZip();


export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }


    addDataset(id: string, content: string): Promise<InsightResponse> {


        return new Promise(function (fulfill,reject) {

            var ret_obj=null;

            var exist :boolean=fs.existsSync("src/"+id+".txt");

            if (exist){
                var file=fs.readFile("src/"+id+".txt",'utf-8',(err:Error,data:string)=>{
                    if (err) throw err;
                    ret_obj={code:201,body:data};
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
                                        var temp=JSON.parse(item);
                                    }
                                    catch (Error){
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
                            j_objs=JSON.stringify(j_objs);


                            fs.writeFile('src/'+id+'.txt', j_objs,(err:Error)=>{
                                if(err){
                                    ret_obj={code:400,body:err.message};
                                    reject(ret_obj);
                                }
                                else {
                                    ret_obj={code:204,body:j_objs};
                                    fulfill(ret_obj);
                                }
                            });

                            //console.log("after write");


                        })
                        .catch(function (err:Error) {
                            ret_obj = {code: 400, body: {"error": err.message}};
                            reject(ret_obj);
                        });


                }).catch(function (err:Error) {

                    ret_obj = {code: 400, body: {"error": err.message}};
                    reject(ret_obj);
                });
            }
        });


    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function (fulfill,reject) {
            var ret_obj=null;
            var path="src/"+id+".txt";
            fs.unlink(path,(err:Error)=>{
                if (err){
                    ret_obj = {code: 404, body: {"error": err.message}};
                    reject(ret_obj);
                }else{
                    ret_obj = {code: 204, body: "The operation was successful"};
                    fulfill (ret_obj);
                }
            });
        });
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {

        return new Promise(function (fulfill,reject) {

            var j_query=query.content;
            var j_obj=JSON.parse(j_query);
            var options=j_obj["OPTIONS"];

            console.log(options);
            var column=options["COLUMNS"];
            var order=options["ORDER"];
            console.log(order);
            var form=options["FORM"];

            var id="courses";


            let dictionary: { [index:string] : string } = {};

             dictionary  ={
                "courses_dept":"Subject",
                "courses_id":"course",
                "courses_avg":"Avg",
                "courses_instructor":"Professor",
                "courses_title":"Title",
                "courses_pass":"Pass",
                "courses_fail":"fail",
                "courses_audit":"Audit"

            };


            var keys=Object.keys(column);
            for (let key of keys){
                console.log(column[key]);
                console.log(typeof column[key]);
            }

            var dataSet=new InsightFacade();
            dataSet.addDataset(id,null).then(function (response:InsightResponse) {


                fulfill({code:200 ,body: "nothing"});
            });

        });
    }



}
function build_table (data :string) : Array<any> {

    var temp=JSON.parse(data);
    var courses=temp["courses"];

    var dictionary  ={
        "courses_dept":"Subject",
        "courses_id":"Course",
        "courses_avg":"Avg",
        "courses_instructor":"Professor",
        "courses_title":"Title",
        "courses_pass":"Pass",
        "courses_fail":"fail",
        "courses_audit":"Audit"

    };



    var course_list=[];

    var interest_info=["Subject","Course","Avg","Professor","Title","Pass","Fail","Audit"];

    for (let course of courses){

        var keys_inner_1=Object.keys(course);
        var course_info=course[keys_inner_1[0]];
        var results=course_info["result"];

        for (let item of results){

            let course_obj:{ [index:string] : {value: string} } = {};

            for (let s of interest_info){
                var value=item[s];
                course_obj[s]=value;
            }
            course_list.push(course_obj);

        }
    }

    return course_list;
}




