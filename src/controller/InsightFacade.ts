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

            var exist :boolean=true;
            // Todo :check if folder with name id exist if so set exist to true else false;


            zip.loadAsync(content,{"base64":true}).then(function (data: JSZip) {
                // if folder exist then set code to 201 and set body to data

                // what is the type of data now?

                console.log("in then");
                //console.log(typeof data);
                var file=parseData("src",data).then(function (body) {


                    console.log(body);


                    if (exist){

                        ret_obj={code:201, body:body};

                    }
                    // create a new folder with name id and set code to 204 and set body to data
                    else {

                        ret_obj={code:204, body:body};

                    }
                    fulfill(ret_obj);
                });

                console.log("after parseData");

                //Todo: parse data of type JSZip into a data structure of our choice;
                // 2D array or one big Json file contain all the courses


                // if (exist){
                //     var code=201;
                //     var body=file;
                //
                //     ret_obj={code:code, body:body};
                //
                // }
                // // create a new folder with name id and set code to 204 and set body to data
                // else {
                //     var code=204;
                //     var body=file;
                //
                //     ret_obj={code:code, body:body};
                //
                // }

            }).catch(function (err: any) {
                // error message set code to 400
                ret_obj={code:400,body:{"error": "my text"}};
                reject(ret_obj);
            });
        });



    }

    removeDataset(id: string): Promise<InsightResponse> {
        return null;
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        return null;
    }

}

    function parseData(path: string,data: JSZip) : Promise<string> {

        return new Promise(function (fulfill,reject) {

        var promise_list:Promise<string>[]=[];
        var name_list:string[]=[];

        data.forEach(function (path,file) {
            name_list.push(file.name);
            promise_list.push(file.async("string"));

        });

        // JSON
        //
        // for (var i=0;i<5;i++){
        //     var s=name_list[i];
        //     var b = name_list[i];
        //     var a='{'+b+':'+i+'}';
        //
        //     b=JSON.stringify(a);
        //     var c=JSON.parse(b);
        //     console.log(c);
        // }
        // var s="12345"
        // console.log(s.substr(0,s.length-1));


        var final_string='{courses:[';

        Promise.all(promise_list).then(function (list) {
            var i=0;

            for (let item of list){
                 if (i>0) {
                     console.log(item);
                     var content = '{' + name_list[i] + ':' + item + '},';
                     final_string+=content;
                 }
            }
            final_string=final_string.substr(0,final_string.length-1)+']}';
            var j_objs=JSON.stringify(final_string);
            fulfill(j_objs);
            reject("failllllll");
        });


        });
    }
