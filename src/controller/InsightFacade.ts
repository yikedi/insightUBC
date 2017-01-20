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
            // Todo :check if folder with name id exist if so set exist to true else false;


            zip.loadAsync(content,{"base64":true}).then(function (data: JSZip) {
                // if folder exist then set code to 201 and set body to data

                // what is the type of data now?

                console.log("in then");
                //console.log(typeof data);
                var file=parseData("src",data);

                //Todo: parse data of type JSZip into a data structure of our choice;
                // 2D array or one big Json file contain all the courses


                if (exist){
                    var code=201;
                    var body=file;

                    ret_obj={code:code, body:body};

                }
                // create a new folder with name id and set code to 204 and set body to data
                else {
                    var code=204;
                    var body=file;

                    ret_obj={code:code, body:body};

                }

                fulfill(ret_obj);
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

    function parseData(path: string,data: JSZip) : string [] {

        //var a=data.files[0].name;
        var promise_list

        data.forEach(function (path,file) {
            console.log(file.name);
            file.async("string").then(function (s) {
                Log.trace(s);

            }).catch(function (err: Error) {
                console.log(err.message);
            });

        });
        //console.log( data.files);
        console.log(typeof data);


        return null;
    }
