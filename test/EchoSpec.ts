/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
var fs = require('fs');
var JSZip = require('jszip');

describe("EchoSpec", function () {


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("Should be able to echo", function () {


        let out = Server.performEcho('echo');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: 'echo...echo'});
    });

    it("Should be able to echo silence", function () {
        let out = Server.performEcho('');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: '...'});
    });

    it("Should be able to handle a missing echo message sensibly", function () {
        let out = Server.performEcho(undefined);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });

    it("Should be able to handle a null echo message sensibly", function () {
        let out = Server.performEcho(null);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.have.property('error');
        expect(out.body).to.deep.equal({error: 'Message not provided'});


    });


    it("testest", function (done) {
        //this.timeout(50000)

        var zip = new JSZip();
        var temp_1 = "./src/courses.zip";
        var f = fs.readFileSync(temp_1, {encoding: "base64"});

        var s1 = {
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };

        var a = JSON.stringify(s1);
        var query = {content: a};
        var temp = new InsightFacade();

        temp.addDataset("courses", f).then((response) => {
            //console.log(response.code);
            //console.log(response.body);
            done();
        })
            .catch((err) => {
                Log.test("incatch");
                done(err);
            });


        Log.test("outsideasync");


    });

    it("test remove", function (done) {
        //this.timeout(50000)


        var s1 = {
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };

        var a = JSON.stringify(s1);
        var query = {content: a};
        var temp = new InsightFacade();

        temp.removeDataset("courses").then(function (result) {
            console.log(result.code);
            console.log(result.body);
            done();
        });

        // temp.performQuery(query).then(function (result) {
        //    console.log(result.code);
        //    console.log(result.body);
        //    done();
        // });

        Log.test("outsideasync");


    });

    it("test double remove", function (done) {
        //this.timeout(50000)

        var temp = new InsightFacade();

        temp.removeDataset("courses").then(function (result) {
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (result) {
            console.log(result.code);
            console.log(result.body);
            done();
        });


        Log.test("outsideasync");


    });

    it("test performquery after remove", function (done) {

        //this.timeout(500000);


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "NOT": {
                    "GT": {
                        "courses_avg": 49
                    }
                }

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_dept",
                "FORM": "TABLE"
            }
        };

        var a = JSON.stringify(s1);
        var query = {content: a};
        temp.performQuery(query).then(function (body) {
            console.log(body.code);
            console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            console.log(err.body);
            done();
        })

    });

    it("test perform query after remove and add", function (done) {
        this.timeout(50000)

        var zip = new JSZip();
        var temp_1 = "./src/courses.zip";
        var f = fs.readFileSync(temp_1, {encoding: "base64"});

        var s1 = {

            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };

        var a = JSON.stringify(s1);
        var query = {content: a};
        var temp = new InsightFacade();

        temp.addDataset("courses", f).then((response) => {
            temp.performQuery(query).then(function (result) {
                console.log(result.code);
                console.log(result.body);
                done();
            }).catch(function (result) {
                console.log(result.code);
                console.log(result.body);
                done();
            });

        });


        Log.test("outsideasync");

    });


    it("test invalid json", function (done) {
        this.timeout(50000)

        var zip = new JSZip();
        var temp_1 = "./src/courses1.txt.zip";
        var f = fs.readFileSync(temp_1, {encoding: "base64"});

        var s1 = {

            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };

        var a = JSON.stringify(s1);
        var query = {content: a};
        var temp = new InsightFacade();

        temp.addDataset("courses", f).then((response) => {
            temp.performQuery(query).then(function (result) {
                console.log(result.code);
                console.log(result.body);
                done();
            }).catch(function (result) {
                console.log(result.code);
                console.log(result.body);
                done();
            });

        });



    });

    it("test complex qurey", function (done) {
        this.timeout(50000);

        var zip = new JSZip();
        var temp_1 = "./src/courses.zip";
        var f = fs.readFileSync(temp_1, {encoding: "base64"});

        var s1 = {
            "WHERE":{
                "OR":[
                    {
                        "AND":[
                            {
                                "GT":{
                                    "courses_avg":90
                                }
                            },
                            {
                                "IS":{
                                    "courses_dept":"adhe"
                                }
                            }
                        ]
                    },
                    {
                        "EQ":{
                            "courses_avg":95
                        }
                    }
                ]
            },
            "OPTIONS":{
                "COLUMNS":[
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER":"courses_avg",
                "FORM":"TABLE"
            }
        };

        var a = JSON.stringify(s1);
        var query = {content: a};
        var temp = new InsightFacade();

        temp.addDataset("courses", f).then((response) => {
            temp.performQuery(query).then(function (result) {
                console.log(result.code);
                console.log(result.body);
                done();
            }).catch(function (result) {
                console.log(result.code);
                console.log(result.body);
                done();
            });

        });

    });


    //
    // it("Should be able to handle a null echo message sensibly2", function (done) {
    //
    //     //this.timeout(1500000);
    //
    //
    //     var temp = new InsightFacade();
    //
    //     var s1 = {
    //         "WHERE": {
    //             "NOT":
    //                 {
    //                     "GT":{
    //                         "courses_avg":49
    //                     }
    //                 }
    //
    //         },
    //         "OPTIONS": {
    //             "COLUMNS": [
    //                 "courses_dept",
    //                 "courses_avg"
    //             ],
    //             "ORDER": "courses_dept",
    //             "FORM": "TABLE"
    //         }
    //     };
    //
    //     var a=JSON.stringify(s1);
    //     var query={content: a};
    //     temp.performQuery(query).then(function (body) {
    //         console.log(body.code);
    //         console.log(body.body);
    //         done();
    //     }).catch(function(err){
    //         console.log(err.code);
    //         console.log(err.body);
    //         done();
    //     })
    //
    // });


});
