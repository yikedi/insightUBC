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

            var exist :boolean=false;
            // Todo :check if file with name id exist if so set exist to true else false;

            if (exist){
                // what should be the encoding of string
               var file=fs.readFile(""+id+".txt",(err:Error,data:string)=>{
                   if (err) throw err;
                   ret_obj={code:201,body:data};
                   fulfill(ret_obj);
               });

            }
            else {
                zip.loadAsync(content, {"base64": true}).then(function (data: JSZip) {

                    console.log("in then");


                    var promise_list: Promise<string>[] = [];
                    var name_list: string[] = [];

                    data.forEach(function (path, file) {
                        name_list.push(file.name);
                        promise_list.push(file.async("string"));

                    });

                    var final_string = "{\"courses\":[";
                    console.log(promise_list.length);

                    Promise.all(promise_list)
                        .then(function (list) {

                            console.log("in promise all");
                            var i = 0;

                            for (let item of list) {
                                if (i > 0) {
                                    //console.log(item);
                                    var content = '{' + name_list[i] + ':' + item + '},';
                                    final_string += content;
                                }
                                i++;
                            }
                            final_string = final_string.substr(0, final_string.length - 1) + "]}";
                            var j_objs = JSON.stringify(eval("("+final_string+")"));

                            return j_objs;
                        }).then(function (j_objs) {

                        //fs.writeFile('' + id + '.txt', j_objs);
                            ret_obj = {code: 204, body: j_objs};
                            console.log(ret_obj);
                            fulfill(ret_obj);

                    })
                        .catch(function (err) {
                            reject(err);
                        });


                }).catch(function (err: any) {
                    // error message set code to 400
                    console.log("error!!!!!!");
                    err = {code: 400, body: {"error": "my text"}};
                    reject(err);
                });
            }
        });


    }

    removeDataset(id: string): Promise<InsightResponse> {
        return null;
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        return null;
    }

}