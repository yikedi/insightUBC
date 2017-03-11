/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";

var chai = require('chai');
var http = require('chai-http');
var fs = require('fs');
var JSZip = require('jszip');

chai.use(http);

describe("EchoSpec", function () {

    var server: Server;

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
        server = new Server(4321);
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        server.stop().then();
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

    it("test add courses.zip", function (done) {
        this.timeout(50000)

        var zip = new JSZip();
        var temp_1 = "./src/courses.zip";
        var f = fs.readFileSync(temp_1, {encoding: "base64"});

        var temp = new InsightFacade();

        temp.addDataset("courses", f)
            .then((response) => {
                //console.log(response.code);
                ////console.log(response.body);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
                done();
            });

    });


    it("test simple query courses year", function (done) {
        this.timeout(10000)


        var s1 = {
            "WHERE": {

                "OR": [
                    {
                        "GT": {
                            "courses_year": 2016
                        }
                    },
                    {
                        "EQ": {
                            "courses_year": 1900
                        }
                    }
                ]


            },


            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_year"
                ],
                "ORDER": "courses_year",
                "FORM": "TABLE"
            }
        };
        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
                done();
            });

    });


    it("test add courses.zip", function (done) {
        this.timeout(50000)

        var zip = new JSZip();
        var temp_1 = "./src/courses.zip";
        var f = fs.readFileSync(temp_1, {encoding: "base64"});

        var temp = new InsightFacade();

        temp.addDataset("courses", f)
            .then((response) => {
                //console.log(response.code);
                done();
            })
            .catch((err) => {
                Log.test("incatch");
                done(err);
            });

    });
    it("test add courses.zip again", function (done) {
        this.timeout(50000)

        var zip = new JSZip();
        var temp_1 = "./src/courses.zip";
        var f = fs.readFileSync(temp_1, {encoding: "base64"});

        var temp = new InsightFacade();

        temp.addDataset("courses", f)
            .then((response) => {
                //console.log(response.code);
                done();
            })
            .catch((err) => {
                Log.test("incatch");
                done(err);
            });

    });


    it("invalid query-> order", function (done) {

        this.timeout(500000);


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "courses_dept": "cpsc"
                        }
                    },
                    {

                        "GT": {
                            "courses_avg": 94
                        }
                    }
                ]


            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": {
                    "courses_uuid": "courses_avg"
                },
                "FORM": "TABLE"
            }
        };


        var query = s1;

        temp.performQuery(query).then(function (body) {

            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });


    it("test 424 1 ", function (done) {
        this.timeout(50000)


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "AND": [{
                    "GT": {
                        "courss_avg": "90"
                    }
                }, {
                    "EQ": {
                        "courss_avg": 77
                    }

                }, {
                    "IS": {
                        "courses_dept": "cpsc"
                    }

                }

                ]

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        temp.performQuery(query).then(function (body) {

            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });

    it("test single NOT ", function (done) {
        this.timeout(50000)


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {

                "NOT": {

                    "OR": [{
                        "GT": {
                            "courses_avg": 90
                        }
                    }, {
                        "EQ": {
                            "courses_avg": 77
                        }

                    }, {
                        "IS": {
                            "courses_dept": "cpsc"
                        }

                    }
                        // ,
                        //     {
                        //     "LT": {
                        //         "courses_avg": 70
                        //     }
                        // }
                    ]
                }

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_uuid",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {

            done();
        })

    });


    it("test complex 424  ", function (done) {
        this.timeout(50000)


        var temp = new InsightFacade();

        var s1 = {
                "WHERE": {

                    "OR": [
                        {
                            "NOT": {

                                "AND": [{
                                    "GT": {
                                        "courses_avg": "90"
                                    }
                                }, {
                                    "EQ": {
                                        "courss_avg": "77"
                                    }

                                }, {
                                    "IS": {
                                        "course_dept": "cpsc"
                                    }

                                }, {
                                    "AND": [
                                        {
                                            "GT": {"courses_avg": 20}
                                        }
                                    ]


                                }

                                ]


                            }
                        },
                        {
                            "IS": {
                                "courses_uuid": "129*"
                            }

                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "courses_dept",
                        "courses_avg",
                        "courses_uuid"
                    ],
                    "ORDER": "courses_avg",
                    "FORM": "TABLE"
                }
            }
            ;


        var query = s1;
        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });


    it("test courses in one dept 70-80 ", function (done) {
        this.timeout(50000)


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "AND": [{
                    "GT": {
                        "courses_avg": 70
                    }
                }, {
                    "IS": {
                        "courses_dept": "cpsc"
                    }

                }, {
                    "LT": {
                        "courses_avg": 71
                    }

                }

                ]

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {

            done();
        })

    });


    it("empty GT ", function (done) {
        this.timeout(50000)


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "AND": [{
                    "GT": {
                        // "courses_avg": "90"
                    }
                }, {
                    "EQ": {
                        "courss_avg": "77"
                    }

                }, {
                    "IS": {
                        "course_dept": "cpsc"
                    }

                }

                ]

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });


    it("test contradictory query ", function (done) {
        this.timeout(50000)


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "AND": [{
                    "GT": {
                        "courses_avg": 90
                    }
                }, {
                    "EQ": {
                        "courses_avg": 77
                    }

                }, {
                    "IS": {
                        "courses_dept": "cpsc"
                    }

                }

                ]

            },
            "OPTIONS": {
                "COLUMNS": [

                    //{}
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });


    it("test 400 1 invalid key ", function (done) {
        this.timeout(50000)


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "AND": [{
                    "GT": {
                        "courses_avg": 90.8
                    }
                }, {
                    "EQ": {
                        "courses_avg": 77.2
                    }

                }, {
                    "IS": {
                        // Error here
                        "courses_dep": "cpsc"
                    }

                }

                ]

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });


    it("test 400 2 undefined and ", function (done) {
        this.timeout(50000)


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {}
            ,
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }

        };


        var query = s1;
        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });


    it("test 400 4  ", function (done) {
        this.timeout(50000)


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "OR": [
                    {a: 5}

                ]
            }

            ,
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }

        };


        var query = s1;
        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });

    it("test 400 3  ", function (done) {
        this.timeout(50000)


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "OR": [
                    {
                        "GT": {"courses_avg": 90}
                    },
                    {a: 5}


                ]
            }

            ,
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }

        };


        var query = s1;
        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });


    it("test performquery after remove", function (done) {

        this.timeout(500000);


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "NOT": {
                    "GT": {
                        "courses_avg": 80
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


        var query = s1;

        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });


    it("test double negation 99 ", function (done) {
        this.timeout(50000);


        var s1 = {
            "WHERE": {
                "NOT": {
                    "NOT": {
                        "OR": [

                            {
                                "EQ": {
                                    "courses_avg": 98
                                }
                            }
                        ]
                    }
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"

            }
        };


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        });


    });

    it("test complex double negation ", function (done) {
        this.timeout(50000);


        var s1 = {
            "WHERE": {
                "NOT": {
                    "NOT": {
                        "OR": [
                            {
                                "AND": [
                                    {
                                        "GT": {
                                            "courses_avg": 90
                                        }
                                    },
                                    {
                                        "IS": {
                                            "courses_dept": "adhe"
                                        }
                                    }
                                ]
                            },
                            {
                                "EQ": {
                                    "courses_avg": 82.5
                                }
                            }
                        ]
                    }
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"

            }
        };


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            ////console.log(result.body);
            done();
        }).catch(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        });


    });


    it("invlid order ", function (done) {
        this.timeout(50000);


        var s1 = {
            "WHERE": {

                "OR": [
                    {
                        "AND": [
                            {
                                "GT": {
                                    "courses_avg": 90
                                }
                            },
                            {
                                "IS": {
                                    "courses_dept": "adhe"
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 95
                        }
                    }
                ]

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_av",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        });


    });


    it("test invalid query ", function (done) {
        this.timeout(50000);


        var s1 = ' {' +
            '"WHERE":{' +
            '"NOT": {' +
            '"NOT": {' +
            '"OR": [' +
            '{' +
            '"AND": [' +
            ']' +
            '},' +
            '{' +
            '"EQ": {' +
            '"courses_avg": 95' +
            '}' +
            '}' +
            ']' +
            '}}' +
            '},' +
            '"OPTIONS":{' +
            '"COLUMNS":[' +
            '"courses_dept", "courses_id", "courses_avg"],"ORDER":"courses_avg", "FORM":"TABLE"' +
            '}' +
            '}';

        //
        var query = {content: s1};
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        });


    });

    it("test 424 abcd ", function (done) {
        this.timeout(50000)


        var s1 = {
            "WHERE": {
                "AND": [
                    {
                        "AND": [
                            {
                                "GT": {
                                    "a_avg": 63.99
                                }
                            }
                            , {
                                "EQ": {
                                    "b_avg": 64
                                }
                            }
                        ]
                        ,
                        "IS": {
                            "c_avg": 63.99
                        }
                    }
                    , {
                        "EQ": {
                            "d_avg": 64
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid",
                    "courses_title",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audit",
                    "courses_pass"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            ////console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });


    it("test EQ 1 ", function (done) {
        this.timeout(50000)


        var s1 = {
            "WHERE": {

                "OR": [
                    {
                        "EQ": {
                            "courses_avg": 95.2
                        }
                    },
                    {
                        "EQ": {
                            "courses_avg": 95.1
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [

                    "courses_dept",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_uuid",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            ////console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });


    // it("test EQ 2 ", function (done) {
    //     this.timeout(50000)
    //
    //
    //     var s1 = {
    //         "WHERE": {
    //             "EQ": {
    //                 "courses_avg": 95
    //             },
    //
    //             "GT": {
    //                 "courses_avg": 64
    //             }
    //
    //         },
    //         "OPTIONS": {
    //             "COLUMNS": [
    //                 "courses_dept",
    //                 "courses_avg",
    //                 "courses_uuid",
    //                 "courses_title",
    //                 "courses_instructor",
    //                 "courses_fail",
    //                 "courses_audit",
    //                 "courses_pass"
    //             ],
    //             "ORDER": "courses_avg",
    //             "FORM": "TABLE"
    //         }
    //     };
    //
    //
    //     var query = s1;
    //     var temp = new InsightFacade();
    //
    //
    //     temp.performQuery(query).then(function (result) {
    //         //console.log(result.code);
    //         ////console.log(result.body);
    //         done();
    //     }).catch(function (err) {
    //         //console.log(err.code);
    //         ////console.log(err.body);
    //
    //         done();
    //     })
    //
    //
    // });


    it("test EQ 2 ", function (done) {
        this.timeout(50000)


        var s1 = {
            "WHERE": {
                "EQ": {
                    "courses_avg": 95
                },

                "GT": {
                    "courses_av": 64
                }

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid",
                    "courses_title",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audit",
                    "courses_pass"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            ////console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });

    it("test partial ", function (done) {
        this.timeout(50000)


        var s1 = {
            "WHERE": {
                "OR": [{
                    "AND": [{
                        "IS": {
                            "courses_instructor": "lyons, charles"
                        }
                    }
                        , {
                            "IS": {
                                "courses_instructor": "**"
                            }

                        }
                    ]
                }

                ]


            },
            "OPTIONS": {
                "COLUMNS": [

                    "courses_uuid",

                    "courses_instructor"

                ],
                "ORDER": "courses_uuid",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            ////console.log(result.body);

            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });


    it("test partial 3 all courses in one dept but taught by ", function (done) {
        this.timeout(50000)


        var s1 = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "courses_dept": "*cpsc*"
                        }
                    }
                    ,
                    {
                        "NOT": {
                            "IS": {
                                "courses_instructor": "hu, alan"
                            }
                        }

                    }

                ]


            },
            "OPTIONS": {
                "COLUMNS": [

                    "courses_uuid",
                    "courses_dept",
                    "courses_instructor"

                ],
                "ORDER": "courses_uuid",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            ////console.log(result.body);
            ////console.log(result.body["result"].length);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });


    it("test partial all courses in one dept except some specific example ", function (done) {
        this.timeout(50000)


        var s1 = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "courses_dept": "*cpsc*"
                        }
                    }
                    ,
                    {
                        "NOT": {
                            "IS": {
                                "courses_uuid": "129*"
                            }
                        }

                    }

                ]


            },
            "OPTIONS": {
                "COLUMNS": [

                    "courses_uuid",
                    "courses_dept",
                    "courses_instructor"

                ],
                "ORDER": "courses_uuid",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            ////console.log(result.body);
            ////console.log(result.body["result"].length);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });


    it("test partial 4 ", function (done) {
        this.timeout(50000)

        //All courses in cpsc except for some course of which uuid range is some specified range
        var s1 = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "courses_dept": "*cpsc"
                        }
                    }
                    ,
                    {
                        "NOT": {
                            "OR": [

                                {
                                    "GT": {
                                        "courses_avg": 90
                                    }
                                },
                                {
                                    "IS": {
                                        "courses_uuid": "*130"
                                    }
                                }

                            ]
                        }

                    }

                ]

            },
            "OPTIONS": {
                "COLUMNS": [

                    "courses_uuid",
                    "courses_dept",
                    "courses_instructor"

                ],
                "ORDER": "courses_uuid",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            ////console.log(result.body);
            ////console.log(result.body["result"].length);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });


    it("test not ", function (done) {
        this.timeout(10000)

        //All courses in cpsc except for some course of which uuid range is some specified range
        var s1 = {
            "WHERE": {
                "NOT": {

                    "IS": {"courses_dept": "*cpsc*"}
                }


            },
            "OPTIONS": {
                "COLUMNS": [

                    "courses_avg",
                    "courses_uuid",
                    "courses_dept",
                    "courses_instructor"

                ],
                "ORDER": "courses_uuid",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            ////console.log(result.body);
            //  //console.log(result.body["result"].length);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });


    it("test 424 2223 ", function (done) {
        this.timeout(10000)


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "AND": [{
                    "GT": {
                        "courses1_avg": "90"
                    }
                }, {
                    "EQ": {
                        "courses2_avg": 77
                    }

                }, {
                    "IS": {
                        "course_dept": "cpsc"
                    }

                }

                ]

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });

    it("test 424 2222 ", function (done) {
        this.timeout(10000)


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "AND": [{
                    "AND": [{
                        "GT": {
                            "courses_avg": 63.99
                        }
                    }
                        , {
                            "EQ": {
                                "courses_avg": 64
                            }
                        }
                    ]
                    ,
                    "IS": {
                        "coursesavg": 63.99
                    }
                }
                    , {
                        "EQ": {
                            "courses_avg": 64
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid",
                    "courses_title",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audit",
                    "courses_pass"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });


    it("test set of instructors ", function (done) {
        this.timeout(10000)


        var temp = new InsightFacade();

        var s1 = {
            "WHERE": {
                "OR": [
                    {
                        "IS": {
                            "courses_instructor": "*hu, a*"
                        }
                    },
                    {
                        "IS": {
                            "courses_instructor": "*wolfman"
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid",
                    "courses_title",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audit",
                    "courses_pass"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };


        var query = s1;
        temp.performQuery(query).then(function (body) {
            //console.log(body.code);
            ////console.log(body.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            done();
        })

    });

    it("test 424 abcd ", function (done) {
        this.timeout(10000)


        var s1 = {
            "WHERE": {
                "AND": [
                    {
                        "AND": [
                            {
                                "GT": {
                                    "a_avg": 63.99
                                }
                            }
                            , {
                                "EQ": {
                                    "b_avg": 64
                                }
                            }
                        ]
                        ,
                        "IS": {
                            "c_avg": 63.99
                        }
                    }
                    , {
                        "EQ": {
                            "d_avg": 64
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuisd",
                    "courses_title",
                    "courses_insftructor",
                    "courses_fail",
                    "courses_ausddit",
                    "courses_pass"
                ],
                "FORM": "TABLE"
            }
        }


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });

    it("test Empty not", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "NOT": {}

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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });

    it("test too many param not", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "NOT": {
                    "GT": {
                        "courses_avg": 99
                    },
                    "LT": {
                        "courses_avg": 1
                    }
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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });

    it("test empty or", function (done) {
        this.timeout(10000)

        var s1 = '{' +
            '"WHERE": {' +
            '"OR": []' +

            '},' +
            '"OPTIONS": {"COLUMNS": ["courses_dept","courses_avg"],' +
            '"ORDER": "courses_avg",' +
            '"FORM": "TABLE"' +
            '}' +
            '}';
        var query = JSON.parse(s1);
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });

    it("test empty and", function (done) {
        this.timeout(10000)

        var s1 = '{' +
            '"WHERE": {' +
            '"AND": []' +

            '},' +
            '"OPTIONS": {"COLUMNS": ["courses_dept","courses_avg"],' +
            '"ORDER": "courses_avg",' +
            '"FORM": "TABLE"' +
            '}' +
            '}';
        var query = JSON.parse(s1);
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })


    });

    it("test empty eq", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "EQ": {}

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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });
    it("test too many param eq", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "EQ": {
                    "courses_avg": 99,
                    "courses_fail": 1
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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });


    it("test tpye error eq", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "EQ": {
                    "courses_avg": "99"
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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });
    it("test tpye error IS", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "IS": {
                    "courses_dept": 99
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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);
            Log.info(err.toString());
            Log.warn(err.toString());
            //Log.error(err.toString());
            //var servers = new Server(88);
            //servers.start();
            //servers.stop();

            done();
        })
    });

    it("test empty LT", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "LT": {}

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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });
    it("test too many param LT", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "LT": {
                    "courses_avg": 99,
                    "courses_fail": 1
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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });


    it("test tpye error LT", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "LT": {
                    "courses_avg": "99"
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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });

    it("test too many param GT", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "GT": {
                    "courses_avg": 99,
                    "courses_fail": 1
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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });
    it("test empty IS", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "IS": {}

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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });
    it("test too many param IS", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "IS": {
                    "courses_dept": "99",
                    "courses_uuid": "1*"
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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });

    it("test FORM error", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "IS": {
                    "courses_dept": "99"
                }

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABE"
            }
        };
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });

    it("test column error", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "IS": {
                    "courses_dept": "99"
                }

            },
            "OPTIONS": {
                "COLUMNS": [
                    "cours_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        };
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });

    it("test invalid setValue", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "IS": {
                    "courses_dept": "99"
                }

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_de",
                    "courses_avg"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABE"
            }
        };
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });


    it("test readError", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "IS": {
                    "courses_dept": "99"
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
        var query = s1;
        var temp = new InsightFacade();
        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            ////console.log(err.body);

            done();
        })
    });


    it("test Adddataset rooms", function (done) {
        this.timeout(10000)


        var zip = new JSZip();
        var temp_1 = "./src/rooms.zip";
        var f = fs.readFileSync(temp_1, {encoding: "base64"});

        var temp = new InsightFacade();

        temp.addDataset("rooms", f)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                done();
            })
            .catch((err) => {
                ////console.log(err.code);
                ////console.log(err.body)
                done();
            });

    });


    it("test query rooms", function (done) {
        this.timeout(10000)


        var s1 = {
            "WHERE": {
                "GT": {
                    "rooms_seats": 100
                }

            },
            "OPTIONS": {
                "COLUMNS": [
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

                ],

                "FORM": "TABLE"
            }
        };
        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
                done();
            });

    });

    it("test simple invalid query rooms 2", function (done) {
        this.timeout(10000)


        var s1 = {
            "WHERE": {
                "NOT": {
                    "OR": [
                        {
                            "LT": {
                                "rooms_seats": 100
                            }
                        },
                        {
                            "IS": {
                                "rooms_shortname": "*C*"
                            }
                        }
                    ]
                }

            },


            "OPTIONS": {
                "COLUMNS": [
                    "rooms_seats",
                    "rooms_id"

                ],
                "FORM": "TABLE"
            }
        };
        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
                done();
            });

    });


    it("test new sort", function (done) {
        this.timeout(10000)


        var s1 = {
            "WHERE": {

                "OR": [
                    {
                        "GT": {
                            "courses_avg": 95
                        }
                    },
                    {
                        "IS": {
                            "courses_title": "*C*"
                        }
                    }
                ]


            },


            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg",
                    "courses_year",
                    "courses_uuid"

                ],

                "ORDER": {
                    "dir": "UP",
                    "keys": [
                        "courses_avg",
                        "courses_year",
                        "courses_uuid"

                    ]
                },
                "FORM": "TABLE"
            }
        };
        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
                done();
            });

    });

    it("test transformation ", function (done) {
        this.timeout(10000);

        var s1 = {
            "WHERE": {
                "GT": {
                    "rooms_seats": 300
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "rooms_number",
                    "maxSeats",
                    "minSeats",
                    "avgSeats",
                    "sumSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_number"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                },
                    {
                        "minSeats": {
                            "MIN": "rooms_seats"
                        }
                    },
                    {
                        "avgSeats": {
                            "AVG": "rooms_seats"
                        }
                    },
                    {
                        "sumSeats": {
                            "SUM": "rooms_seats"
                        }
                    },
                    {
                        "countSeats": {
                            "COUNT": "rooms_seats"
                        }
                    }
                ]
            }
        };

        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response: any) => {
                //console.log(response.code);
                //console.log(response.body);
                //console.log(response.body["result"].length);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
                done();
            });

    });

    it("test d3 test", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "GT": {
                    "rooms_seats": 300
                }

            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_furniture"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["rooms_furniture"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_furniture"],
                "APPLY": [
                    {
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }
                ]
            }
        };

        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
                done();
            });

    });

    it("test simple query courses year", function (done) {
        this.timeout(10000)


        var s1 = {
            "WHERE": {

                "OR": [
                    {
                        "GT": {
                            "courses_year": 2016
                        }
                    },
                    {
                        "EQ": {
                            "courses_year": 1900
                        }
                    }
                ]


            },

            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_year"
                ],
                "ORDER": "courses_year",
                "FORM": "TABLE"
            }
        };
        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
                done();
            });

    });

    it("test 424 abcd ", function (done) {
        this.timeout(50000)


        var s1 = {
            "WHERE": {
                "AND": [
                    {
                        "AND": [
                            {
                                "GT": {
                                    "a_avg": 63.99
                                }
                            }
                            , {
                                "EQ": {
                                    "b_avg": 64
                                }
                            }
                        ]
                        ,
                        "IS": {
                            "c_avg": 63.99
                        }
                    }
                    , {
                        "EQ": {
                            "d_avg": 64
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid",
                    "courses_title",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audit",
                    "courses_pass"
                ],
                "ORDER": "courses_avg",
                "FORM": "TABLE"
            }
        }


        var query = s1;
        var temp = new InsightFacade();


        temp.performQuery(query).then(function (result) {
            //console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            //console.log(err.code);
            //console.log(err.body);

            done();
        })


    });

    it("test d3 test 4 valid", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "GT": {
                    "rooms_seats": 300
                }

            },
            "OPTIONS": {
                "COLUMNS": [
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
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["rooms_furniture"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
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
                    "rooms_type"],
                "APPLY": [
                    {
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }
                ]
            }
        };

        let ans = {
            "render": "TABLE",
            "result": [
                {
                    "rooms_fullname": "Hebb",
                    "rooms_shortname": "HEBB",
                    "rooms_name": "HEBB_100",
                    "rooms_number": "100",
                    "rooms_address": "2045 East Mall",
                    "rooms_lat": 49.2661,
                    "rooms_lon": -123.25165,
                    "rooms_seats": 375,
                    "rooms_furniture": "Classroom-Fixed Tables\/Fixed Chairs",
                    "rooms_href": "http:\/\/students.ubc.ca\/campus\/discover\/buildings-and-classrooms\/room\/HEBB-100",
                    "rooms_type": "Tiered Large Group"
                },
                {
                    "rooms_fullname": "Life Sciences Centre",
                    "rooms_shortname": "LSC",
                    "rooms_name": "LSC_1001",
                    "rooms_number": "1001",
                    "rooms_address": "2350 Health Sciences Mall",
                    "rooms_lat": 49.26236,
                    "rooms_lon": -123.24494,
                    "rooms_seats": 350,
                    "rooms_furniture": "Classroom-Fixed Tables\/Movable Chairs",
                    "rooms_href": "http:\/\/students.ubc.ca\/campus\/discover\/buildings-and-classrooms\/room\/LSC-1001",
                    "rooms_type": "Tiered Large Group"
                },
                {
                    "rooms_fullname": "Life Sciences Centre",
                    "rooms_shortname": "LSC",
                    "rooms_name": "LSC_1002",
                    "rooms_number": "1002",
                    "rooms_address": "2350 Health Sciences Mall",
                    "rooms_lat": 49.26236,
                    "rooms_lon": -123.24494,
                    "rooms_seats": 350,
                    "rooms_furniture": "Classroom-Fixed Tables\/Movable Chairs",
                    "rooms_href": "http:\/\/students.ubc.ca\/campus\/discover\/buildings-and-classrooms\/room\/LSC-1002",
                    "rooms_type": "Tiered Large Group"
                },
                {
                    "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)",
                    "rooms_shortname": "WOOD",
                    "rooms_name": "WOOD_2",
                    "rooms_number": "2",
                    "rooms_address": "2194 Health Sciences Mall",
                    "rooms_lat": 49.26478,
                    "rooms_lon": -123.24673,
                    "rooms_seats": 503,
                    "rooms_furniture": "Classroom-Fixed Tablets",
                    "rooms_href": "http:\/\/students.ubc.ca\/campus\/discover\/buildings-and-classrooms\/room\/WOOD-2",
                    "rooms_type": "Tiered Large Group"
                },
                {
                    "rooms_fullname": "Wesbrook",
                    "rooms_shortname": "WESB",
                    "rooms_name": "WESB_100",
                    "rooms_number": "100",
                    "rooms_address": "6174 University Boulevard",
                    "rooms_lat": 49.26517,
                    "rooms_lon": -123.24937,
                    "rooms_seats": 325,
                    "rooms_furniture": "Classroom-Fixed Tablets",
                    "rooms_href": "http:\/\/students.ubc.ca\/campus\/discover\/buildings-and-classrooms\/room\/WESB-100",
                    "rooms_type": "Tiered Large Group"
                },
                {
                    "rooms_fullname": "Earth Sciences Building",
                    "rooms_shortname": "ESB",
                    "rooms_name": "ESB_1013",
                    "rooms_number": "1013",
                    "rooms_address": "2207 Main Mall",
                    "rooms_lat": 49.26274,
                    "rooms_lon": -123.25224,
                    "rooms_seats": 350,
                    "rooms_furniture": "Classroom-Fixed Tablets",
                    "rooms_href": "http:\/\/students.ubc.ca\/campus\/discover\/buildings-and-classrooms\/room\/ESB-1013",
                    "rooms_type": "Tiered Large Group"
                },
                {
                    "rooms_fullname": "Centre for Interactive  Research on Sustainability",
                    "rooms_shortname": "CIRS",
                    "rooms_name": "CIRS_1250",
                    "rooms_number": "1250",
                    "rooms_address": "2260 West Mall, V6T 1Z4",
                    "rooms_lat": 49.26207,
                    "rooms_lon": -123.25314,
                    "rooms_seats": 426,
                    "rooms_furniture": "Classroom-Fixed Tablets",
                    "rooms_href": "http:\/\/students.ubc.ca\/campus\/discover\/buildings-and-classrooms\/room\/CIRS-1250",
                    "rooms_type": "Tiered Large Group"
                },
                {
                    "rooms_fullname": "Robert F. Osborne Centre",
                    "rooms_shortname": "OSBO",
                    "rooms_name": "OSBO_A",
                    "rooms_number": "A",
                    "rooms_address": "6108 Thunderbird Boulevard",
                    "rooms_lat": 49.26047,
                    "rooms_lon": -123.24467,
                    "rooms_seats": 442,
                    "rooms_furniture": "Classroom-Movable Tables & Chairs",
                    "rooms_href": "http:\/\/students.ubc.ca\/campus\/discover\/buildings-and-classrooms\/room\/OSBO-A",
                    "rooms_type": "Open Design General Purpose"
                }
            ]
        };

        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response: any) => {
                //console.log(response.code);
                //console.log(response.body);
                expect(response.body).to.deep.equal(ans);
                //console.log("-------------------------------");
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
                done();
            });

    });

    it("test d3 test 5 courses", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "GT": {
                    "courses_avg": 95
                }

            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_id",
                    "courses_uuid",
                    "courses_title",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audit",
                    "courses_pass",
                    "courses_year",
                    "maxAvg",
                    "minAvg",
                    "avgAvg",
                    "sumAvg",
                    "countAvg"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": [
                        "courses_dept",
                        "courses_avg",
                        "courses_uuid",
                        "courses_id",
                        "courses_title",
                        "courses_instructor",
                        "courses_fail",
                        "courses_audit",
                        "courses_pass",
                        "courses_year",
                        "maxAvg",
                        "minAvg",
                        "avgAvg",
                        "sumAvg",
                        "countAvg"
                    ]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid",
                    "courses_title",
                    "courses_id",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audit",
                    "courses_pass",
                    "courses_year"
                ],
                "APPLY": [{
                    "maxAvg": {
                        "MAX": "courses_avg"
                    }
                },
                    {
                        "minAvg": {
                            "MIN": "courses_avg"
                        }
                    },
                    {
                        "avgAvg": {
                            "AVG": "courses_avg"
                        }
                    },
                    {
                        "sumAvg": {
                            "SUM": "courses_avg"
                        }
                    },
                    {
                        "countAvg": {
                            "COUNT": "courses_avg"
                        }
                    }
                ]
            }
        };

        var query = s1;
        let ans = {
            "render": "TABLE",
            "result": [
                {
                    "courses_dept": "adhe",
                    "courses_avg": 96.11,
                    "courses_uuid": "68539",
                    "courses_title": "dev wkshp\/sem",
                    "courses_id": "329",
                    "courses_instructor": "bishundayal, deonarine",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 27,
                    "courses_year": 2015,
                    "maxAvg": 96.11,
                    "minAvg": 96.11,
                    "avgAvg": 96.1,
                    "sumAvg": 96.11,
                    "countAvg": 1
                },
                {
                    "courses_dept": "apsc",
                    "courses_avg": 95.05,
                    "courses_uuid": "19859",
                    "courses_title": "eng mtls lab",
                    "courses_id": "279",
                    "courses_instructor": "wassink, berend",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 20,
                    "courses_year": 2010,
                    "maxAvg": 95.05,
                    "minAvg": 95.05,
                    "avgAvg": 95.1,
                    "sumAvg": 95.05,
                    "countAvg": 1
                },
                {
                    "courses_dept": "apsc",
                    "courses_avg": 95.94,
                    "courses_uuid": "18718",
                    "courses_title": "eng mtls lab",
                    "courses_id": "279",
                    "courses_instructor": "wassink, berend",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 18,
                    "courses_year": 2007,
                    "maxAvg": 95.94,
                    "minAvg": 95.94,
                    "avgAvg": 95.9,
                    "sumAvg": 95.94,
                    "countAvg": 1
                },
                {
                    "courses_dept": "apsc",
                    "courses_avg": 95.95,
                    "courses_uuid": "22441",
                    "courses_title": "eng mtls lab",
                    "courses_id": "279",
                    "courses_instructor": "wassink, berend",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 20,
                    "courses_year": 2009,
                    "maxAvg": 95.95,
                    "minAvg": 95.95,
                    "avgAvg": 96,
                    "sumAvg": 95.95,
                    "countAvg": 1
                },
                {
                    "courses_dept": "apsc",
                    "courses_avg": 96,
                    "courses_uuid": "19858",
                    "courses_title": "eng mtls lab",
                    "courses_id": "279",
                    "courses_instructor": "wassink, berend",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 2010,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "arst",
                    "courses_avg": 96.94,
                    "courses_uuid": "26287",
                    "courses_title": "aud&non-txt arch",
                    "courses_id": "550",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 16,
                    "courses_year": 2008,
                    "maxAvg": 96.94,
                    "minAvg": 96.94,
                    "avgAvg": 96.9,
                    "sumAvg": 96.94,
                    "countAvg": 1
                },
                {
                    "courses_dept": "arst",
                    "courses_avg": 96.94,
                    "courses_uuid": "26288",
                    "courses_title": "aud&non-txt arch",
                    "courses_id": "550",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 16,
                    "courses_year": 1900,
                    "maxAvg": 96.94,
                    "minAvg": 96.94,
                    "avgAvg": 96.9,
                    "sumAvg": 96.94,
                    "countAvg": 1
                },
                {
                    "courses_dept": "audi",
                    "courses_avg": 96.9,
                    "courses_uuid": "61632",
                    "courses_title": "audi prctcm iv",
                    "courses_id": "568",
                    "courses_instructor": "adelman, sharon",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 10,
                    "courses_year": 2012,
                    "maxAvg": 96.9,
                    "minAvg": 96.9,
                    "avgAvg": 96.9,
                    "sumAvg": 96.9,
                    "countAvg": 1
                },
                {
                    "courses_dept": "audi",
                    "courses_avg": 96.9,
                    "courses_uuid": "61633",
                    "courses_title": "audi prctcm iv",
                    "courses_id": "568",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 10,
                    "courses_year": 1900,
                    "maxAvg": 96.9,
                    "minAvg": 96.9,
                    "avgAvg": 96.9,
                    "sumAvg": 96.9,
                    "countAvg": 1
                },
                {
                    "courses_dept": "bmeg",
                    "courses_avg": 95.15,
                    "courses_uuid": "73457",
                    "courses_title": "med tech project",
                    "courses_id": "501",
                    "courses_instructor": "hodgson, antony",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 13,
                    "courses_year": 2012,
                    "maxAvg": 95.15,
                    "minAvg": 95.15,
                    "avgAvg": 95.2,
                    "sumAvg": 95.15,
                    "countAvg": 1
                },
                {
                    "courses_dept": "bmeg",
                    "courses_avg": 95.15,
                    "courses_uuid": "73458",
                    "courses_title": "med tech project",
                    "courses_id": "501",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 13,
                    "courses_year": 1900,
                    "maxAvg": 95.15,
                    "minAvg": 95.15,
                    "avgAvg": 95.2,
                    "sumAvg": 95.15,
                    "countAvg": 1
                },
                {
                    "courses_dept": "chbe",
                    "courses_avg": 95.31,
                    "courses_uuid": "45711",
                    "courses_title": "math operations",
                    "courses_id": "553",
                    "courses_instructor": "gopaluni, bhushan",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 16,
                    "courses_year": 2015,
                    "maxAvg": 95.31,
                    "minAvg": 95.31,
                    "avgAvg": 95.3,
                    "sumAvg": 95.31,
                    "countAvg": 1
                },
                {
                    "courses_dept": "chbe",
                    "courses_avg": 95.31,
                    "courses_uuid": "45712",
                    "courses_title": "math operations",
                    "courses_id": "553",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 16,
                    "courses_year": 1900,
                    "maxAvg": 95.31,
                    "minAvg": 95.31,
                    "avgAvg": 95.3,
                    "sumAvg": 95.31,
                    "countAvg": 1
                },
                {
                    "courses_dept": "chbe",
                    "courses_avg": 95.54,
                    "courses_uuid": "7932",
                    "courses_title": "thermodynamics",
                    "courses_id": "551",
                    "courses_instructor": "gopaluni, bhushan",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 13,
                    "courses_year": 2013,
                    "maxAvg": 95.54,
                    "minAvg": 95.54,
                    "avgAvg": 95.5,
                    "sumAvg": 95.54,
                    "countAvg": 1
                },
                {
                    "courses_dept": "chbe",
                    "courses_avg": 95.54,
                    "courses_uuid": "7933",
                    "courses_title": "thermodynamics",
                    "courses_id": "551",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 13,
                    "courses_year": 1900,
                    "maxAvg": 95.54,
                    "minAvg": 95.54,
                    "avgAvg": 95.5,
                    "sumAvg": 95.54,
                    "countAvg": 1
                },
                {
                    "courses_dept": "civl",
                    "courses_avg": 96.27,
                    "courses_uuid": "84887",
                    "courses_title": "dynam struct 2",
                    "courses_id": "508",
                    "courses_instructor": "ventura, carlos estuardo",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 15,
                    "courses_year": 2012,
                    "maxAvg": 96.27,
                    "minAvg": 96.27,
                    "avgAvg": 96.3,
                    "sumAvg": 96.27,
                    "countAvg": 1
                },
                {
                    "courses_dept": "civl",
                    "courses_avg": 96.27,
                    "courses_uuid": "84888",
                    "courses_title": "dynam struct 2",
                    "courses_id": "508",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 15,
                    "courses_year": 1900,
                    "maxAvg": 96.27,
                    "minAvg": 96.27,
                    "avgAvg": 96.3,
                    "sumAvg": 96.27,
                    "countAvg": 1
                },
                {
                    "courses_dept": "cnps",
                    "courses_avg": 95.36,
                    "courses_uuid": "5692",
                    "courses_title": "counsl adolescnt",
                    "courses_id": "514",
                    "courses_instructor": "weinberg, mark",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 2011,
                    "maxAvg": 95.36,
                    "minAvg": 95.36,
                    "avgAvg": 95.4,
                    "sumAvg": 95.36,
                    "countAvg": 1
                },
                {
                    "courses_dept": "cnps",
                    "courses_avg": 95.36,
                    "courses_uuid": "5693",
                    "courses_title": "counsl adolescnt",
                    "courses_id": "514",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 1900,
                    "maxAvg": 95.36,
                    "minAvg": 95.36,
                    "avgAvg": 95.4,
                    "sumAvg": 95.36,
                    "countAvg": 1
                },
                {
                    "courses_dept": "cnps",
                    "courses_avg": 95.36,
                    "courses_uuid": "70475",
                    "courses_title": "",
                    "courses_id": "586",
                    "courses_instructor": "munteanu, mircea",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 11,
                    "courses_year": 2012,
                    "maxAvg": 95.36,
                    "minAvg": 95.36,
                    "avgAvg": 95.4,
                    "sumAvg": 95.36,
                    "countAvg": 1
                },
                {
                    "courses_dept": "cnps",
                    "courses_avg": 95.78,
                    "courses_uuid": "50979",
                    "courses_title": "schl counselling",
                    "courses_id": "504",
                    "courses_instructor": "owens, rhea",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 2015,
                    "maxAvg": 95.78,
                    "minAvg": 95.78,
                    "avgAvg": 95.8,
                    "sumAvg": 95.78,
                    "countAvg": 1
                },
                {
                    "courses_dept": "cnps",
                    "courses_avg": 95.78,
                    "courses_uuid": "50980",
                    "courses_title": "schl counselling",
                    "courses_id": "504",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 1900,
                    "maxAvg": 95.78,
                    "minAvg": 95.78,
                    "avgAvg": 95.8,
                    "sumAvg": 95.78,
                    "countAvg": 1
                },
                {
                    "courses_dept": "cnps",
                    "courses_avg": 96,
                    "courses_uuid": "33374",
                    "courses_title": "prgm devl cnsl",
                    "courses_id": "584",
                    "courses_instructor": "carter, john",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 2013,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "cnps",
                    "courses_avg": 96.16,
                    "courses_uuid": "33375",
                    "courses_title": "prgm devl cnsl",
                    "courses_id": "584",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 37,
                    "courses_year": 1900,
                    "maxAvg": 96.16,
                    "minAvg": 96.16,
                    "avgAvg": 96.2,
                    "sumAvg": 96.16,
                    "countAvg": 1
                },
                {
                    "courses_dept": "cnps",
                    "courses_avg": 96.33,
                    "courses_uuid": "33373",
                    "courses_title": "prgm devl cnsl",
                    "courses_id": "584",
                    "courses_instructor": "cox, daniel",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 18,
                    "courses_year": 2013,
                    "maxAvg": 96.33,
                    "minAvg": 96.33,
                    "avgAvg": 96.3,
                    "sumAvg": 96.33,
                    "countAvg": 1
                },
                {
                    "courses_dept": "cnps",
                    "courses_avg": 97.47,
                    "courses_uuid": "87779",
                    "courses_title": "career planning",
                    "courses_id": "574",
                    "courses_instructor": "neault, roberta a",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 2009,
                    "maxAvg": 97.47,
                    "minAvg": 97.47,
                    "avgAvg": 97.5,
                    "sumAvg": 97.47,
                    "countAvg": 1
                },
                {
                    "courses_dept": "cnps",
                    "courses_avg": 97.47,
                    "courses_uuid": "87780",
                    "courses_title": "career planning",
                    "courses_id": "574",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 1900,
                    "maxAvg": 97.47,
                    "minAvg": 97.47,
                    "avgAvg": 97.5,
                    "sumAvg": 97.47,
                    "countAvg": 1
                },
                {
                    "courses_dept": "cnps",
                    "courses_avg": 99.19,
                    "courses_uuid": "26777",
                    "courses_title": "career planning",
                    "courses_id": "574",
                    "courses_instructor": "cox, daniel",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 16,
                    "courses_year": 2012,
                    "maxAvg": 99.19,
                    "minAvg": 99.19,
                    "avgAvg": 99.2,
                    "sumAvg": 99.19,
                    "countAvg": 1
                },
                {
                    "courses_dept": "crwr",
                    "courses_avg": 95.7,
                    "courses_uuid": "71155",
                    "courses_title": "prep writ career",
                    "courses_id": "530",
                    "courses_instructor": "campbell, deborah",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 10,
                    "courses_year": 2012,
                    "maxAvg": 95.7,
                    "minAvg": 95.7,
                    "avgAvg": 95.7,
                    "sumAvg": 95.7,
                    "countAvg": 1
                },
                {
                    "courses_dept": "crwr",
                    "courses_avg": 95.7,
                    "courses_uuid": "71156",
                    "courses_title": "prep writ career",
                    "courses_id": "530",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 10,
                    "courses_year": 1900,
                    "maxAvg": 95.7,
                    "minAvg": 95.7,
                    "avgAvg": 95.7,
                    "sumAvg": 95.7,
                    "countAvg": 1
                },
                {
                    "courses_dept": "crwr",
                    "courses_avg": 96,
                    "courses_uuid": "26254",
                    "courses_title": "thesis",
                    "courses_id": "599",
                    "courses_instructor": "medved, maureen",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 1,
                    "courses_year": 2014,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "crwr",
                    "courses_avg": 96,
                    "courses_uuid": "26258",
                    "courses_title": "thesis",
                    "courses_id": "599",
                    "courses_instructor": "taylor, timothy",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 1,
                    "courses_year": 2014,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "crwr",
                    "courses_avg": 96,
                    "courses_uuid": "46409",
                    "courses_title": "thesis",
                    "courses_id": "599",
                    "courses_instructor": "galloway, steve",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 1,
                    "courses_year": 2013,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "crwr",
                    "courses_avg": 96,
                    "courses_uuid": "71164",
                    "courses_title": "thesis",
                    "courses_id": "599",
                    "courses_instructor": "maillard, keith",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 2,
                    "courses_year": 2012,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "crwr",
                    "courses_avg": 96,
                    "courses_uuid": "92879",
                    "courses_title": "thesis",
                    "courses_id": "599",
                    "courses_instructor": "maillard, keith",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 1,
                    "courses_year": 2014,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "crwr",
                    "courses_avg": 97,
                    "courses_uuid": "26255",
                    "courses_title": "thesis",
                    "courses_id": "599",
                    "courses_instructor": "campbell, deborah",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 1,
                    "courses_year": 2014,
                    "maxAvg": 97,
                    "minAvg": 97,
                    "avgAvg": 97,
                    "sumAvg": 97,
                    "countAvg": 1
                },
                {
                    "courses_dept": "crwr",
                    "courses_avg": 98,
                    "courses_uuid": "46405",
                    "courses_title": "thesis",
                    "courses_id": "599",
                    "courses_instructor": "maillard, keith",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 1,
                    "courses_year": 2013,
                    "maxAvg": 98,
                    "minAvg": 98,
                    "avgAvg": 98,
                    "sumAvg": 98,
                    "countAvg": 1
                },
                {
                    "courses_dept": "crwr",
                    "courses_avg": 98,
                    "courses_uuid": "46412",
                    "courses_title": "thesis",
                    "courses_id": "599",
                    "courses_instructor": "grady, albert wayne",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 1,
                    "courses_year": 2013,
                    "maxAvg": 98,
                    "minAvg": 98,
                    "avgAvg": 98,
                    "sumAvg": 98,
                    "countAvg": 1
                },
                {
                    "courses_dept": "edcp",
                    "courses_avg": 95.58,
                    "courses_uuid": "21700",
                    "courses_title": "ds tec ii sc c&p",
                    "courses_id": "377",
                    "courses_instructor": "magee, theresa",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 2012,
                    "maxAvg": 95.58,
                    "minAvg": 95.58,
                    "avgAvg": 95.6,
                    "sumAvg": 95.58,
                    "countAvg": 1
                },
                {
                    "courses_dept": "edcp",
                    "courses_avg": 95.58,
                    "courses_uuid": "21701",
                    "courses_title": "ds tec ii sc c&p",
                    "courses_id": "377",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 1900,
                    "maxAvg": 95.58,
                    "minAvg": 95.58,
                    "avgAvg": 95.6,
                    "sumAvg": 95.58,
                    "countAvg": 1
                },
                {
                    "courses_dept": "edst",
                    "courses_avg": 95.78,
                    "courses_uuid": "6683",
                    "courses_title": "fn & educ change",
                    "courses_id": "505",
                    "courses_instructor": "marker, michael",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 2010,
                    "maxAvg": 95.78,
                    "minAvg": 95.78,
                    "avgAvg": 95.8,
                    "sumAvg": 95.78,
                    "countAvg": 1
                },
                {
                    "courses_dept": "edst",
                    "courses_avg": 95.78,
                    "courses_uuid": "6684",
                    "courses_title": "fn & educ change",
                    "courses_id": "505",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 1900,
                    "maxAvg": 95.78,
                    "minAvg": 95.78,
                    "avgAvg": 95.8,
                    "sumAvg": 95.78,
                    "countAvg": 1
                },
                {
                    "courses_dept": "edst",
                    "courses_avg": 96.46,
                    "courses_uuid": "59203",
                    "courses_title": "adlt edu pract",
                    "courses_id": "520",
                    "courses_instructor": "vanwynsberghe, robert",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 13,
                    "courses_year": 2013,
                    "maxAvg": 96.46,
                    "minAvg": 96.46,
                    "avgAvg": 96.5,
                    "sumAvg": 96.46,
                    "countAvg": 1
                },
                {
                    "courses_dept": "edst",
                    "courses_avg": 96.46,
                    "courses_uuid": "59204",
                    "courses_title": "adlt edu pract",
                    "courses_id": "520",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 13,
                    "courses_year": 1900,
                    "maxAvg": 96.46,
                    "minAvg": 96.46,
                    "avgAvg": 96.5,
                    "sumAvg": 96.46,
                    "countAvg": 1
                },
                {
                    "courses_dept": "educ",
                    "courses_avg": 95.16,
                    "courses_uuid": "87253",
                    "courses_title": "res mthd in educ",
                    "courses_id": "500",
                    "courses_instructor": "adler, james douglas;scott, sandra",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 31,
                    "courses_year": 2013,
                    "maxAvg": 95.16,
                    "minAvg": 95.16,
                    "avgAvg": 95.2,
                    "sumAvg": 95.16,
                    "countAvg": 1
                },
                {
                    "courses_dept": "educ",
                    "courses_avg": 97.5,
                    "courses_uuid": "50495",
                    "courses_title": "res mthd in educ",
                    "courses_id": "500",
                    "courses_instructor": "morgan, tannis",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 2015,
                    "maxAvg": 97.5,
                    "minAvg": 97.5,
                    "avgAvg": 97.5,
                    "sumAvg": 97.5,
                    "countAvg": 1
                },
                {
                    "courses_dept": "eece",
                    "courses_avg": 98.75,
                    "courses_uuid": "10235",
                    "courses_title": "multimedia sys",
                    "courses_id": "541",
                    "courses_instructor": "coria, lino",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 12,
                    "courses_year": 2009,
                    "maxAvg": 98.75,
                    "minAvg": 98.75,
                    "avgAvg": 98.8,
                    "sumAvg": 98.75,
                    "countAvg": 1
                },
                {
                    "courses_dept": "eece",
                    "courses_avg": 98.75,
                    "courses_uuid": "10236",
                    "courses_title": "multimedia sys",
                    "courses_id": "541",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 12,
                    "courses_year": 1900,
                    "maxAvg": 98.75,
                    "minAvg": 98.75,
                    "avgAvg": 98.8,
                    "sumAvg": 98.75,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.11,
                    "courses_uuid": "86901",
                    "courses_title": "intr stat rs edu",
                    "courses_id": "482",
                    "courses_instructor": "kishor, nand",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 2007,
                    "maxAvg": 95.11,
                    "minAvg": 95.11,
                    "avgAvg": 95.1,
                    "sumAvg": 95.11,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.13,
                    "courses_uuid": "29327",
                    "courses_title": "exp des anl ed",
                    "courses_id": "592",
                    "courses_instructor": "kishor, nand",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 2012,
                    "maxAvg": 95.13,
                    "minAvg": 95.13,
                    "avgAvg": 95.1,
                    "sumAvg": 95.13,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.13,
                    "courses_uuid": "61390",
                    "courses_title": "classroom mgmt",
                    "courses_id": "432",
                    "courses_instructor": "smith, gillian",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 32,
                    "courses_year": 2010,
                    "maxAvg": 95.13,
                    "minAvg": 95.13,
                    "avgAvg": 95.1,
                    "sumAvg": 95.13,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.13,
                    "courses_uuid": "61391",
                    "courses_title": "classroom mgmt",
                    "courses_id": "432",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 32,
                    "courses_year": 1900,
                    "maxAvg": 95.13,
                    "minAvg": 95.13,
                    "avgAvg": 95.1,
                    "sumAvg": 95.13,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.14,
                    "courses_uuid": "28972",
                    "courses_title": "basic princ meas",
                    "courses_id": "528",
                    "courses_instructor": "kishor, nand",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 2011,
                    "maxAvg": 95.14,
                    "minAvg": 95.14,
                    "avgAvg": 95.1,
                    "sumAvg": 95.14,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.15,
                    "courses_uuid": "49634",
                    "courses_title": "intro excp child",
                    "courses_id": "312",
                    "courses_instructor": "romero, amber",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 20,
                    "courses_year": 2011,
                    "maxAvg": 95.15,
                    "minAvg": 95.15,
                    "avgAvg": 95.2,
                    "sumAvg": 95.15,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.15,
                    "courses_uuid": "49635",
                    "courses_title": "intro excp child",
                    "courses_id": "312",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 20,
                    "courses_year": 1900,
                    "maxAvg": 95.15,
                    "minAvg": 95.15,
                    "avgAvg": 95.2,
                    "sumAvg": 95.15,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.16,
                    "courses_uuid": "13142",
                    "courses_title": "exp des anl ed",
                    "courses_id": "592",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 37,
                    "courses_year": 1900,
                    "maxAvg": 95.16,
                    "minAvg": 95.16,
                    "avgAvg": 95.2,
                    "sumAvg": 95.16,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.17,
                    "courses_uuid": "3245",
                    "courses_title": "dev neuropsych",
                    "courses_id": "568",
                    "courses_instructor": "weber, rachel",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 6,
                    "courses_year": 2013,
                    "maxAvg": 95.17,
                    "minAvg": 95.17,
                    "avgAvg": 95.2,
                    "sumAvg": 95.17,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.17,
                    "courses_uuid": "3246",
                    "courses_title": "dev neuropsych",
                    "courses_id": "568",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 6,
                    "courses_year": 1900,
                    "maxAvg": 95.17,
                    "minAvg": 95.17,
                    "avgAvg": 95.2,
                    "sumAvg": 95.17,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.22,
                    "courses_uuid": "33773",
                    "courses_title": "ed prg hghly abl",
                    "courses_id": "408",
                    "courses_instructor": "porath, marion",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 18,
                    "courses_year": 2009,
                    "maxAvg": 95.22,
                    "minAvg": 95.22,
                    "avgAvg": 95.2,
                    "sumAvg": 95.22,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.22,
                    "courses_uuid": "33774",
                    "courses_title": "ed prg hghly abl",
                    "courses_id": "408",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 18,
                    "courses_year": 1900,
                    "maxAvg": 95.22,
                    "minAvg": 95.22,
                    "avgAvg": 95.2,
                    "sumAvg": 95.22,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.27,
                    "courses_uuid": "35950",
                    "courses_title": "tchg st visl imp",
                    "courses_id": "320",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 2008,
                    "maxAvg": 95.27,
                    "minAvg": 95.27,
                    "avgAvg": 95.3,
                    "sumAvg": 95.27,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.27,
                    "courses_uuid": "35951",
                    "courses_title": "tchg st visl imp",
                    "courses_id": "320",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 1900,
                    "maxAvg": 95.27,
                    "minAvg": 95.27,
                    "avgAvg": 95.3,
                    "sumAvg": 95.27,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.3,
                    "courses_uuid": "61426",
                    "courses_title": "able&creatv lrnr",
                    "courses_id": "516",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 27,
                    "courses_year": 1900,
                    "maxAvg": 95.3,
                    "minAvg": 95.3,
                    "avgAvg": 95.3,
                    "sumAvg": 95.3,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.31,
                    "courses_uuid": "61452",
                    "courses_title": "thy cognt assess",
                    "courses_id": "553",
                    "courses_instructor": "ford, laurie",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 16,
                    "courses_year": 2010,
                    "maxAvg": 95.31,
                    "minAvg": 95.31,
                    "avgAvg": 95.3,
                    "sumAvg": 95.31,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.31,
                    "courses_uuid": "61453",
                    "courses_title": "thy cognt assess",
                    "courses_id": "553",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 16,
                    "courses_year": 1900,
                    "maxAvg": 95.31,
                    "minAvg": 95.31,
                    "avgAvg": 95.3,
                    "sumAvg": 95.31,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.33,
                    "courses_uuid": "3272",
                    "courses_title": "cor des ed res",
                    "courses_id": "596",
                    "courses_instructor": "kishor, nand",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 2013,
                    "maxAvg": 95.33,
                    "minAvg": 95.33,
                    "avgAvg": 95.3,
                    "sumAvg": 95.33,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.41,
                    "courses_uuid": "61425",
                    "courses_title": "able&creatv lrnr",
                    "courses_id": "516",
                    "courses_instructor": "porath, marion",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 22,
                    "courses_year": 2010,
                    "maxAvg": 95.41,
                    "minAvg": 95.41,
                    "avgAvg": 95.4,
                    "sumAvg": 95.41,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.44,
                    "courses_uuid": "6396",
                    "courses_title": "exp des anl ed",
                    "courses_id": "592",
                    "courses_instructor": "wu, amery",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 18,
                    "courses_year": 2014,
                    "maxAvg": 95.44,
                    "minAvg": 95.44,
                    "avgAvg": 95.4,
                    "sumAvg": 95.44,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.47,
                    "courses_uuid": "44402",
                    "courses_title": "educ stds autism",
                    "courses_id": "449",
                    "courses_instructor": "grow, laura",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 17,
                    "courses_year": 2014,
                    "maxAvg": 95.47,
                    "minAvg": 95.47,
                    "avgAvg": 95.5,
                    "sumAvg": 95.47,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.47,
                    "courses_uuid": "56550",
                    "courses_title": "surv bhvr dis ch",
                    "courses_id": "436",
                    "courses_instructor": "champion, kathleen",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 34,
                    "courses_year": 2013,
                    "maxAvg": 95.47,
                    "minAvg": 95.47,
                    "avgAvg": 95.5,
                    "sumAvg": 95.47,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.47,
                    "courses_uuid": "56551",
                    "courses_title": "surv bhvr dis ch",
                    "courses_id": "436",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 34,
                    "courses_year": 1900,
                    "maxAvg": 95.47,
                    "minAvg": 95.47,
                    "avgAvg": 95.5,
                    "sumAvg": 95.47,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.5,
                    "courses_uuid": "38143",
                    "courses_title": "augmt&alt comm",
                    "courses_id": "411",
                    "courses_instructor": "mceachern hughes, tammy",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 22,
                    "courses_year": 2015,
                    "maxAvg": 95.5,
                    "minAvg": 95.5,
                    "avgAvg": 95.5,
                    "sumAvg": 95.5,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.5,
                    "courses_uuid": "38144",
                    "courses_title": "augmt&alt comm",
                    "courses_id": "411",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 22,
                    "courses_year": 1900,
                    "maxAvg": 95.5,
                    "minAvg": 95.5,
                    "avgAvg": 95.5,
                    "sumAvg": 95.5,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.67,
                    "courses_uuid": "38145",
                    "courses_title": "tech for vis imp",
                    "courses_id": "415",
                    "courses_instructor": "levinson, tami",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 2015,
                    "maxAvg": 95.67,
                    "minAvg": 95.67,
                    "avgAvg": 95.7,
                    "sumAvg": 95.67,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.67,
                    "courses_uuid": "38146",
                    "courses_title": "tech for vis imp",
                    "courses_id": "415",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 1900,
                    "maxAvg": 95.67,
                    "minAvg": 95.67,
                    "avgAvg": 95.7,
                    "sumAvg": 95.67,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.72,
                    "courses_uuid": "28944",
                    "courses_title": "educ stds autism",
                    "courses_id": "449",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 46,
                    "courses_year": 1900,
                    "maxAvg": 95.72,
                    "minAvg": 95.72,
                    "avgAvg": 95.7,
                    "sumAvg": 95.72,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.83,
                    "courses_uuid": "35988",
                    "courses_title": "cur dev e df&hrd",
                    "courses_id": "520",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 6,
                    "courses_year": 2008,
                    "maxAvg": 95.83,
                    "minAvg": 95.83,
                    "avgAvg": 95.8,
                    "sumAvg": 95.83,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.83,
                    "courses_uuid": "35989",
                    "courses_title": "cur dev e df&hrd",
                    "courses_id": "520",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 6,
                    "courses_year": 1900,
                    "maxAvg": 95.83,
                    "minAvg": 95.83,
                    "avgAvg": 95.8,
                    "sumAvg": 95.83,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.86,
                    "courses_uuid": "49682",
                    "courses_title": "basic princ meas",
                    "courses_id": "528",
                    "courses_instructor": "chan, eric",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 2011,
                    "maxAvg": 95.86,
                    "minAvg": 95.86,
                    "avgAvg": 95.9,
                    "sumAvg": 95.86,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.86,
                    "courses_uuid": "49683",
                    "courses_title": "basic princ meas",
                    "courses_id": "528",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 1900,
                    "maxAvg": 95.86,
                    "minAvg": 95.86,
                    "avgAvg": 95.9,
                    "sumAvg": 95.86,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 95.9,
                    "courses_uuid": "13141",
                    "courses_title": "exp des anl ed",
                    "courses_id": "592",
                    "courses_instructor": "wu, amery",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 20,
                    "courses_year": 2016,
                    "maxAvg": 95.9,
                    "minAvg": 95.9,
                    "avgAvg": 95.9,
                    "sumAvg": 95.9,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96,
                    "courses_uuid": "29285",
                    "courses_title": "basic princ meas",
                    "courses_id": "528",
                    "courses_instructor": "kishor, nand",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 6,
                    "courses_year": 2012,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96,
                    "courses_uuid": "33760",
                    "courses_title": "tch'g hghly able",
                    "courses_id": "303",
                    "courses_instructor": "porath, marion",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 2009,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96,
                    "courses_uuid": "33761",
                    "courses_title": "tch'g hghly able",
                    "courses_id": "303",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 1900,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96.03,
                    "courses_uuid": "3148",
                    "courses_title": "intro excp child",
                    "courses_id": "312",
                    "courses_instructor": "stockman, james",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 36,
                    "courses_year": 2013,
                    "maxAvg": 96.03,
                    "minAvg": 96.03,
                    "avgAvg": 96,
                    "sumAvg": 96.03,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96.03,
                    "courses_uuid": "3149",
                    "courses_title": "intro excp child",
                    "courses_id": "312",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 36,
                    "courses_year": 1900,
                    "maxAvg": 96.03,
                    "minAvg": 96.03,
                    "avgAvg": 96,
                    "sumAvg": 96.03,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96.21,
                    "courses_uuid": "38152",
                    "courses_title": "classroom mgmt",
                    "courses_id": "432",
                    "courses_instructor": "ervin, ruth",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 24,
                    "courses_year": 2015,
                    "maxAvg": 96.21,
                    "minAvg": 96.21,
                    "avgAvg": 96.2,
                    "sumAvg": 96.21,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96.21,
                    "courses_uuid": "38153",
                    "courses_title": "classroom mgmt",
                    "courses_id": "432",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 24,
                    "courses_year": 1900,
                    "maxAvg": 96.21,
                    "minAvg": 96.21,
                    "avgAvg": 96.2,
                    "sumAvg": 96.21,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96.21,
                    "courses_uuid": "76254",
                    "courses_title": "assess lrn diffi",
                    "courses_id": "421",
                    "courses_instructor": "cole, kenneth",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 2009,
                    "maxAvg": 96.21,
                    "minAvg": 96.21,
                    "avgAvg": 96.2,
                    "sumAvg": 96.21,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96.23,
                    "courses_uuid": "76285",
                    "courses_title": "hn dev: inf-adlt",
                    "courses_id": "505",
                    "courses_instructor": "porath, marion",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 22,
                    "courses_year": 2009,
                    "maxAvg": 96.23,
                    "minAvg": 96.23,
                    "avgAvg": 96.2,
                    "sumAvg": 96.23,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96.24,
                    "courses_uuid": "3181",
                    "courses_title": "educ stds autism",
                    "courses_id": "449",
                    "courses_instructor": "grow, laura",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 25,
                    "courses_year": 2013,
                    "maxAvg": 96.24,
                    "minAvg": 96.24,
                    "avgAvg": 96.2,
                    "sumAvg": 96.24,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96.33,
                    "courses_uuid": "44426",
                    "courses_title": "specific lrn dis",
                    "courses_id": "526",
                    "courses_instructor": "mcquarrie, maureen",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 2014,
                    "maxAvg": 96.33,
                    "minAvg": 96.33,
                    "avgAvg": 96.3,
                    "sumAvg": 96.33,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96.33,
                    "courses_uuid": "44427",
                    "courses_title": "specific lrn dis",
                    "courses_id": "526",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 1900,
                    "maxAvg": 96.33,
                    "minAvg": 96.33,
                    "avgAvg": 96.3,
                    "sumAvg": 96.33,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96.9,
                    "courses_uuid": "44372",
                    "courses_title": "intro excp child",
                    "courses_id": "312",
                    "courses_instructor": "gaster, sean",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 29,
                    "courses_year": 2014,
                    "maxAvg": 96.9,
                    "minAvg": 96.9,
                    "avgAvg": 96.9,
                    "sumAvg": 96.9,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 96.9,
                    "courses_uuid": "44373",
                    "courses_title": "intro excp child",
                    "courses_id": "312",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 29,
                    "courses_year": 1900,
                    "maxAvg": 96.9,
                    "minAvg": 96.9,
                    "avgAvg": 96.9,
                    "sumAvg": 96.9,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 97,
                    "courses_uuid": "76310",
                    "courses_title": "acad assess schl",
                    "courses_id": "534",
                    "courses_instructor": "amaral, deborah;ford, laurie",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 8,
                    "courses_year": 2009,
                    "maxAvg": 97,
                    "minAvg": 97,
                    "avgAvg": 97,
                    "sumAvg": 97,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 97.09,
                    "courses_uuid": "86962",
                    "courses_title": "cor des ed res",
                    "courses_id": "596",
                    "courses_instructor": "kishor, nand",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 11,
                    "courses_year": 2007,
                    "maxAvg": 97.09,
                    "minAvg": 97.09,
                    "avgAvg": 97.1,
                    "sumAvg": 97.09,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 97.09,
                    "courses_uuid": "86963",
                    "courses_title": "cor des ed res",
                    "courses_id": "596",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 11,
                    "courses_year": 1900,
                    "maxAvg": 97.09,
                    "minAvg": 97.09,
                    "avgAvg": 97.1,
                    "sumAvg": 97.09,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 97.29,
                    "courses_uuid": "35870",
                    "courses_title": "assess lrn diffi",
                    "courses_id": "421",
                    "courses_instructor": "cole, kenneth",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 2010,
                    "maxAvg": 97.29,
                    "minAvg": 97.29,
                    "avgAvg": 97.3,
                    "sumAvg": 97.29,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 97.29,
                    "courses_uuid": "35871",
                    "courses_title": "assess lrn diffi",
                    "courses_id": "421",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 1900,
                    "maxAvg": 97.29,
                    "minAvg": 97.29,
                    "avgAvg": 97.3,
                    "sumAvg": 97.29,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 97.41,
                    "courses_uuid": "28943",
                    "courses_title": "educ stds autism",
                    "courses_id": "449",
                    "courses_instructor": "wilk, diana",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 17,
                    "courses_year": 2011,
                    "maxAvg": 97.41,
                    "minAvg": 97.41,
                    "avgAvg": 97.4,
                    "sumAvg": 97.41,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 97.41,
                    "courses_uuid": "76311",
                    "courses_title": "acad assess schl",
                    "courses_id": "534",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 17,
                    "courses_year": 1900,
                    "maxAvg": 97.41,
                    "minAvg": 97.41,
                    "avgAvg": 97.4,
                    "sumAvg": 97.41,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 97.67,
                    "courses_uuid": "86966",
                    "courses_title": "coll&uni teachng",
                    "courses_id": "606",
                    "courses_instructor": "porath, marion",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 2007,
                    "maxAvg": 97.67,
                    "minAvg": 97.67,
                    "avgAvg": 97.7,
                    "sumAvg": 97.67,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 97.69,
                    "courses_uuid": "3228",
                    "courses_title": "sem in autism",
                    "courses_id": "549",
                    "courses_instructor": "grow, laura",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 16,
                    "courses_year": 2013,
                    "maxAvg": 97.69,
                    "minAvg": 97.69,
                    "avgAvg": 97.7,
                    "sumAvg": 97.69,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 97.78,
                    "courses_uuid": "76309",
                    "courses_title": "acad assess schl",
                    "courses_id": "534",
                    "courses_instructor": "amaral, deborah;ford, laurie",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 2009,
                    "maxAvg": 97.78,
                    "minAvg": 97.78,
                    "avgAvg": 97.8,
                    "sumAvg": 97.78,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 98.08,
                    "courses_uuid": "33779",
                    "courses_title": "assess lrn diffi",
                    "courses_id": "421",
                    "courses_instructor": "cole, kenneth",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 12,
                    "courses_year": 2009,
                    "maxAvg": 98.08,
                    "minAvg": 98.08,
                    "avgAvg": 98.1,
                    "sumAvg": 98.08,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 98.36,
                    "courses_uuid": "33781",
                    "courses_title": "assess lrn diffi",
                    "courses_id": "421",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 22,
                    "courses_year": 1900,
                    "maxAvg": 98.36,
                    "minAvg": 98.36,
                    "avgAvg": 98.4,
                    "sumAvg": 98.36,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 98.45,
                    "courses_uuid": "49677",
                    "courses_title": "dev el sk df&hrd",
                    "courses_id": "519",
                    "courses_instructor": "cannon, joanna",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 11,
                    "courses_year": 2011,
                    "maxAvg": 98.45,
                    "minAvg": 98.45,
                    "avgAvg": 98.5,
                    "sumAvg": 98.45,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 98.45,
                    "courses_uuid": "49678",
                    "courses_title": "dev el sk df&hrd",
                    "courses_id": "519",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 11,
                    "courses_year": 1900,
                    "maxAvg": 98.45,
                    "minAvg": 98.45,
                    "avgAvg": 98.5,
                    "sumAvg": 98.45,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 98.58,
                    "courses_uuid": "29255",
                    "courses_title": "educ stds autism",
                    "courses_id": "449",
                    "courses_instructor": "grow, laura",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 24,
                    "courses_year": 2012,
                    "maxAvg": 98.58,
                    "minAvg": 98.58,
                    "avgAvg": 98.6,
                    "sumAvg": 98.58,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 98.58,
                    "courses_uuid": "29256",
                    "courses_title": "educ stds autism",
                    "courses_id": "449",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 24,
                    "courses_year": 1900,
                    "maxAvg": 98.58,
                    "minAvg": 98.58,
                    "avgAvg": 98.6,
                    "sumAvg": 98.58,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 98.7,
                    "courses_uuid": "33780",
                    "courses_title": "assess lrn diffi",
                    "courses_id": "421",
                    "courses_instructor": "cole, kenneth",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 10,
                    "courses_year": 2009,
                    "maxAvg": 98.7,
                    "minAvg": 98.7,
                    "avgAvg": 98.7,
                    "sumAvg": 98.7,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 98.76,
                    "courses_uuid": "44816",
                    "courses_title": "educ stds autism",
                    "courses_id": "449",
                    "courses_instructor": "grow, laura",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 17,
                    "courses_year": 2012,
                    "maxAvg": 98.76,
                    "minAvg": 98.76,
                    "avgAvg": 98.8,
                    "sumAvg": 98.76,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 98.76,
                    "courses_uuid": "44817",
                    "courses_title": "educ stds autism",
                    "courses_id": "449",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 17,
                    "courses_year": 1900,
                    "maxAvg": 98.76,
                    "minAvg": 98.76,
                    "avgAvg": 98.8,
                    "sumAvg": 98.76,
                    "countAvg": 1
                },
                {
                    "courses_dept": "epse",
                    "courses_avg": 98.8,
                    "courses_uuid": "6320",
                    "courses_title": "educ stds autism",
                    "courses_id": "449",
                    "courses_instructor": "grow, laura",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 25,
                    "courses_year": 2014,
                    "maxAvg": 98.8,
                    "minAvg": 98.8,
                    "avgAvg": 98.8,
                    "sumAvg": 98.8,
                    "countAvg": 1
                },
                {
                    "courses_dept": "etec",
                    "courses_avg": 95.1,
                    "courses_uuid": "67367",
                    "courses_title": "indig, tech&ed",
                    "courses_id": "521",
                    "courses_instructor": "marker, michael",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 21,
                    "courses_year": 2011,
                    "maxAvg": 95.1,
                    "minAvg": 95.1,
                    "avgAvg": 95.1,
                    "sumAvg": 95.1,
                    "countAvg": 1
                },
                {
                    "courses_dept": "etec",
                    "courses_avg": 95.1,
                    "courses_uuid": "67368",
                    "courses_title": "indig, tech&ed",
                    "courses_id": "521",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 21,
                    "courses_year": 1900,
                    "maxAvg": 95.1,
                    "minAvg": 95.1,
                    "avgAvg": 95.1,
                    "sumAvg": 95.1,
                    "countAvg": 1
                },
                {
                    "courses_dept": "etec",
                    "courses_avg": 95.19,
                    "courses_uuid": "76476",
                    "courses_title": "tech math sci",
                    "courses_id": "533",
                    "courses_instructor": "milner-bolotin, marina",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 26,
                    "courses_year": 2013,
                    "maxAvg": 95.19,
                    "minAvg": 95.19,
                    "avgAvg": 95.2,
                    "sumAvg": 95.19,
                    "countAvg": 1
                },
                {
                    "courses_dept": "etec",
                    "courses_avg": 95.19,
                    "courses_uuid": "76477",
                    "courses_title": "tech math sci",
                    "courses_id": "533",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 26,
                    "courses_year": 1900,
                    "maxAvg": 95.19,
                    "minAvg": 95.19,
                    "avgAvg": 95.2,
                    "sumAvg": 95.19,
                    "countAvg": 1
                },
                {
                    "courses_dept": "etec",
                    "courses_avg": 95.32,
                    "courses_uuid": "78576",
                    "courses_title": "indig, tech&ed",
                    "courses_id": "521",
                    "courses_instructor": "marker, michael",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 2016,
                    "maxAvg": 95.32,
                    "minAvg": 95.32,
                    "avgAvg": 95.3,
                    "sumAvg": 95.32,
                    "countAvg": 1
                },
                {
                    "courses_dept": "etec",
                    "courses_avg": 95.32,
                    "courses_uuid": "78577",
                    "courses_title": "indig, tech&ed",
                    "courses_id": "521",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 1900,
                    "maxAvg": 95.32,
                    "minAvg": 95.32,
                    "avgAvg": 95.3,
                    "sumAvg": 95.32,
                    "countAvg": 1
                },
                {
                    "courses_dept": "etec",
                    "courses_avg": 95.33,
                    "courses_uuid": "76473",
                    "courses_title": "curric issu",
                    "courses_id": "531",
                    "courses_instructor": "feng, francis",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 21,
                    "courses_year": 2013,
                    "maxAvg": 95.33,
                    "minAvg": 95.33,
                    "avgAvg": 95.3,
                    "sumAvg": 95.33,
                    "countAvg": 1
                },
                {
                    "courses_dept": "etec",
                    "courses_avg": 95.63,
                    "courses_uuid": "96832",
                    "courses_title": "curric issu",
                    "courses_id": "531",
                    "courses_instructor": "petrina, stephen",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 2013,
                    "maxAvg": 95.63,
                    "minAvg": 95.63,
                    "avgAvg": 95.6,
                    "sumAvg": 95.63,
                    "countAvg": 1
                },
                {
                    "courses_dept": "etec",
                    "courses_avg": 95.96,
                    "courses_uuid": "16985",
                    "courses_title": "tech math sci",
                    "courses_id": "533",
                    "courses_instructor": "milner-bolotin, marina",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 24,
                    "courses_year": 2014,
                    "maxAvg": 95.96,
                    "minAvg": 95.96,
                    "avgAvg": 96,
                    "sumAvg": 95.96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "etec",
                    "courses_avg": 95.96,
                    "courses_uuid": "16986",
                    "courses_title": "tech math sci",
                    "courses_id": "533",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 24,
                    "courses_year": 1900,
                    "maxAvg": 95.96,
                    "minAvg": 95.96,
                    "avgAvg": 96,
                    "sumAvg": 95.96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "etec",
                    "courses_avg": 96.47,
                    "courses_uuid": "45905",
                    "courses_title": "indig, tech&ed",
                    "courses_id": "521",
                    "courses_instructor": "marker, michael",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 2012,
                    "maxAvg": 96.47,
                    "minAvg": 96.47,
                    "avgAvg": 96.5,
                    "sumAvg": 96.47,
                    "countAvg": 1
                },
                {
                    "courses_dept": "etec",
                    "courses_avg": 96.47,
                    "courses_uuid": "45906",
                    "courses_title": "indig, tech&ed",
                    "courses_id": "521",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 1900,
                    "maxAvg": 96.47,
                    "minAvg": 96.47,
                    "avgAvg": 96.5,
                    "sumAvg": 96.47,
                    "countAvg": 1
                },
                {
                    "courses_dept": "fipr",
                    "courses_avg": 96.4,
                    "courses_uuid": "75176",
                    "courses_title": "mo pict prod i",
                    "courses_id": "333",
                    "courses_instructor": "wenzek, rob",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 20,
                    "courses_year": 2015,
                    "maxAvg": 96.4,
                    "minAvg": 96.4,
                    "avgAvg": 96.4,
                    "sumAvg": 96.4,
                    "countAvg": 1
                },
                {
                    "courses_dept": "fipr",
                    "courses_avg": 96.4,
                    "courses_uuid": "75177",
                    "courses_title": "mo pict prod i",
                    "courses_id": "333",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 20,
                    "courses_year": 1900,
                    "maxAvg": 96.4,
                    "minAvg": 96.4,
                    "avgAvg": 96.4,
                    "sumAvg": 96.4,
                    "countAvg": 1
                },
                {
                    "courses_dept": "frst",
                    "courses_avg": 96.36,
                    "courses_uuid": "55026",
                    "courses_title": "ds intl forstry",
                    "courses_id": "562",
                    "courses_instructor": "timko, joleen",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 11,
                    "courses_year": 2015,
                    "maxAvg": 96.36,
                    "minAvg": 96.36,
                    "avgAvg": 96.4,
                    "sumAvg": 96.36,
                    "countAvg": 1
                },
                {
                    "courses_dept": "frst",
                    "courses_avg": 96.36,
                    "courses_uuid": "55027",
                    "courses_title": "ds intl forstry",
                    "courses_id": "562",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 11,
                    "courses_year": 1900,
                    "maxAvg": 96.36,
                    "minAvg": 96.36,
                    "avgAvg": 96.4,
                    "sumAvg": 96.36,
                    "countAvg": 1
                },
                {
                    "courses_dept": "hgse",
                    "courses_avg": 95.26,
                    "courses_uuid": "52199",
                    "courses_title": "islnd wild mgmt",
                    "courses_id": "357",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 2016,
                    "maxAvg": 95.26,
                    "minAvg": 95.26,
                    "avgAvg": 95.3,
                    "sumAvg": 95.26,
                    "countAvg": 1
                },
                {
                    "courses_dept": "hgse",
                    "courses_avg": 95.26,
                    "courses_uuid": "52200",
                    "courses_title": "islnd wild mgmt",
                    "courses_id": "357",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 1900,
                    "maxAvg": 95.26,
                    "minAvg": 95.26,
                    "avgAvg": 95.3,
                    "sumAvg": 95.26,
                    "countAvg": 1
                },
                {
                    "courses_dept": "hgse",
                    "courses_avg": 95.29,
                    "courses_uuid": "32070",
                    "courses_title": "islnd wild mgmt",
                    "courses_id": "357",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 21,
                    "courses_year": 2014,
                    "maxAvg": 95.29,
                    "minAvg": 95.29,
                    "avgAvg": 95.3,
                    "sumAvg": 95.29,
                    "countAvg": 1
                },
                {
                    "courses_dept": "hgse",
                    "courses_avg": 95.29,
                    "courses_uuid": "32071",
                    "courses_title": "islnd wild mgmt",
                    "courses_id": "357",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 21,
                    "courses_year": 1900,
                    "maxAvg": 95.29,
                    "minAvg": 95.29,
                    "avgAvg": 95.3,
                    "sumAvg": 95.29,
                    "countAvg": 1
                },
                {
                    "courses_dept": "kin",
                    "courses_avg": 95.36,
                    "courses_uuid": "86841",
                    "courses_title": "phyl asp phy act",
                    "courses_id": "565",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 11,
                    "courses_year": 2014,
                    "maxAvg": 95.36,
                    "minAvg": 95.36,
                    "avgAvg": 95.4,
                    "sumAvg": 95.36,
                    "countAvg": 1
                },
                {
                    "courses_dept": "kin",
                    "courses_avg": 95.36,
                    "courses_uuid": "86842",
                    "courses_title": "phyl asp phy act",
                    "courses_id": "565",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 11,
                    "courses_year": 1900,
                    "maxAvg": 95.36,
                    "minAvg": 95.36,
                    "avgAvg": 95.4,
                    "sumAvg": 95.36,
                    "countAvg": 1
                },
                {
                    "courses_dept": "kin",
                    "courses_avg": 96,
                    "courses_uuid": "59528",
                    "courses_title": "kin project",
                    "courses_id": "499",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 2013,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "kin",
                    "courses_avg": 96.06,
                    "courses_uuid": "59539",
                    "courses_title": "phyl asp phy act",
                    "courses_id": "565",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 18,
                    "courses_year": 2013,
                    "maxAvg": 96.06,
                    "minAvg": 96.06,
                    "avgAvg": 96.1,
                    "sumAvg": 96.06,
                    "countAvg": 1
                },
                {
                    "courses_dept": "kin",
                    "courses_avg": 96.06,
                    "courses_uuid": "59540",
                    "courses_title": "phyl asp phy act",
                    "courses_id": "565",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 18,
                    "courses_year": 1900,
                    "maxAvg": 96.06,
                    "minAvg": 96.06,
                    "avgAvg": 96.1,
                    "sumAvg": 96.06,
                    "countAvg": 1
                },
                {
                    "courses_dept": "libr",
                    "courses_avg": 96.1,
                    "courses_uuid": "77290",
                    "courses_title": "acad libraries",
                    "courses_id": "575",
                    "courses_instructor": "farrell, adam",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 10,
                    "courses_year": 2015,
                    "maxAvg": 96.1,
                    "minAvg": 96.1,
                    "avgAvg": 96.1,
                    "sumAvg": 96.1,
                    "countAvg": 1
                },
                {
                    "courses_dept": "libr",
                    "courses_avg": 96.1,
                    "courses_uuid": "77291",
                    "courses_title": "acad libraries",
                    "courses_id": "575",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 10,
                    "courses_year": 1900,
                    "maxAvg": 96.1,
                    "minAvg": 96.1,
                    "avgAvg": 96.1,
                    "sumAvg": 96.1,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 95.56,
                    "courses_uuid": "13938",
                    "courses_title": "lie theory i",
                    "courses_id": "534",
                    "courses_instructor": "gordon, julia yulia",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 2007,
                    "maxAvg": 95.56,
                    "minAvg": 95.56,
                    "avgAvg": 95.6,
                    "sumAvg": 95.56,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 95.56,
                    "courses_uuid": "13939",
                    "courses_title": "lie theory i",
                    "courses_id": "534",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 1900,
                    "maxAvg": 95.56,
                    "minAvg": 95.56,
                    "avgAvg": 95.6,
                    "sumAvg": 95.56,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 95.67,
                    "courses_uuid": "90202",
                    "courses_title": "functional analy",
                    "courses_id": "510",
                    "courses_instructor": "murugan, mathav",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 3,
                    "courses_year": 2015,
                    "maxAvg": 95.67,
                    "minAvg": 95.67,
                    "avgAvg": 95.7,
                    "sumAvg": 95.67,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 95.67,
                    "courses_uuid": "90203",
                    "courses_title": "functional analy",
                    "courses_id": "510",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 3,
                    "courses_year": 1900,
                    "maxAvg": 95.67,
                    "minAvg": 95.67,
                    "avgAvg": 95.7,
                    "sumAvg": 95.67,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 96.25,
                    "courses_uuid": "90206",
                    "courses_title": "prt diff equa i",
                    "courses_id": "516",
                    "courses_instructor": "wei, juncheng",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 2015,
                    "maxAvg": 96.25,
                    "minAvg": 96.25,
                    "avgAvg": 96.3,
                    "sumAvg": 96.25,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 96.25,
                    "courses_uuid": "90207",
                    "courses_title": "prt diff equa i",
                    "courses_id": "516",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 1900,
                    "maxAvg": 96.25,
                    "minAvg": 96.25,
                    "avgAvg": 96.3,
                    "sumAvg": 96.25,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 96.33,
                    "courses_uuid": "34240",
                    "courses_title": "msc major essay",
                    "courses_id": "589",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 3,
                    "courses_year": 1900,
                    "maxAvg": 96.33,
                    "minAvg": 96.33,
                    "avgAvg": 96.3,
                    "sumAvg": 96.33,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 96.44,
                    "courses_uuid": "5351",
                    "courses_title": "algebra ii",
                    "courses_id": "502",
                    "courses_instructor": "karu, kalle",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 2009,
                    "maxAvg": 96.44,
                    "minAvg": 96.44,
                    "avgAvg": 96.4,
                    "sumAvg": 96.44,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 96.44,
                    "courses_uuid": "5352",
                    "courses_title": "algebra ii",
                    "courses_id": "502",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 1900,
                    "maxAvg": 96.44,
                    "minAvg": 96.44,
                    "avgAvg": 96.4,
                    "sumAvg": 96.44,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 96.83,
                    "courses_uuid": "4011",
                    "courses_title": "probability ii",
                    "courses_id": "545",
                    "courses_instructor": "nachmias, asaf",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 6,
                    "courses_year": 2011,
                    "maxAvg": 96.83,
                    "minAvg": 96.83,
                    "avgAvg": 96.8,
                    "sumAvg": 96.83,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 96.83,
                    "courses_uuid": "4012",
                    "courses_title": "probability ii",
                    "courses_id": "545",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 6,
                    "courses_year": 1900,
                    "maxAvg": 96.83,
                    "minAvg": 96.83,
                    "avgAvg": 96.8,
                    "sumAvg": 96.83,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 97.09,
                    "courses_uuid": "73173",
                    "courses_title": "harmonic anal i",
                    "courses_id": "541",
                    "courses_instructor": "laba, izabella",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 11,
                    "courses_year": 2010,
                    "maxAvg": 97.09,
                    "minAvg": 97.09,
                    "avgAvg": 97.1,
                    "sumAvg": 97.09,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 97.09,
                    "courses_uuid": "73174",
                    "courses_title": "harmonic anal i",
                    "courses_id": "541",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 11,
                    "courses_year": 1900,
                    "maxAvg": 97.09,
                    "minAvg": 97.09,
                    "avgAvg": 97.1,
                    "sumAvg": 97.09,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 97.25,
                    "courses_uuid": "32014",
                    "courses_title": "diff geometry i",
                    "courses_id": "525",
                    "courses_instructor": "fraser, ailana",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 4,
                    "courses_year": 2016,
                    "maxAvg": 97.25,
                    "minAvg": 97.25,
                    "avgAvg": 97.3,
                    "sumAvg": 97.25,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 97.25,
                    "courses_uuid": "32015",
                    "courses_title": "diff geometry i",
                    "courses_id": "525",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 4,
                    "courses_year": 1900,
                    "maxAvg": 97.25,
                    "minAvg": 97.25,
                    "avgAvg": 97.3,
                    "sumAvg": 97.25,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 97.48,
                    "courses_uuid": "73165",
                    "courses_title": "algb geometry i",
                    "courses_id": "532",
                    "courses_instructor": "karu, kalle",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 21,
                    "courses_year": 2010,
                    "maxAvg": 97.48,
                    "minAvg": 97.48,
                    "avgAvg": 97.5,
                    "sumAvg": 97.48,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 97.48,
                    "courses_uuid": "73166",
                    "courses_title": "algb geometry i",
                    "courses_id": "532",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 21,
                    "courses_year": 1900,
                    "maxAvg": 97.48,
                    "minAvg": 97.48,
                    "avgAvg": 97.5,
                    "sumAvg": 97.48,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 99.78,
                    "courses_uuid": "5373",
                    "courses_title": "algb topology i",
                    "courses_id": "527",
                    "courses_instructor": "gomez, jose",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 2009,
                    "maxAvg": 99.78,
                    "minAvg": 99.78,
                    "avgAvg": 99.8,
                    "sumAvg": 99.78,
                    "countAvg": 1
                },
                {
                    "courses_dept": "math",
                    "courses_avg": 99.78,
                    "courses_uuid": "5374",
                    "courses_title": "algb topology i",
                    "courses_id": "527",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 1900,
                    "maxAvg": 99.78,
                    "minAvg": 99.78,
                    "avgAvg": 99.8,
                    "sumAvg": 99.78,
                    "countAvg": 1
                },
                {
                    "courses_dept": "midw",
                    "courses_avg": 96.5,
                    "courses_uuid": "17267",
                    "courses_title": "cnsl mat cr prov",
                    "courses_id": "101",
                    "courses_instructor": "mcrae, lorna",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 2012,
                    "maxAvg": 96.5,
                    "minAvg": 96.5,
                    "avgAvg": 96.5,
                    "sumAvg": 96.5,
                    "countAvg": 1
                },
                {
                    "courses_dept": "midw",
                    "courses_avg": 96.5,
                    "courses_uuid": "17268",
                    "courses_title": "cnsl mat cr prov",
                    "courses_id": "101",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 1900,
                    "maxAvg": 96.5,
                    "minAvg": 96.5,
                    "avgAvg": 96.5,
                    "sumAvg": 96.5,
                    "countAvg": 1
                },
                {
                    "courses_dept": "mine",
                    "courses_avg": 95.18,
                    "courses_uuid": "67762",
                    "courses_title": "seminar",
                    "courses_id": "393",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 45,
                    "courses_year": 1900,
                    "maxAvg": 95.18,
                    "minAvg": 95.18,
                    "avgAvg": 95.2,
                    "sumAvg": 95.18,
                    "countAvg": 1
                },
                {
                    "courses_dept": "mine",
                    "courses_avg": 95.43,
                    "courses_uuid": "80143",
                    "courses_title": "mgmt sc meth",
                    "courses_id": "553",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 7,
                    "courses_year": 1900,
                    "maxAvg": 95.43,
                    "minAvg": 95.43,
                    "avgAvg": 95.4,
                    "sumAvg": 95.43,
                    "countAvg": 1
                },
                {
                    "courses_dept": "mine",
                    "courses_avg": 95.44,
                    "courses_uuid": "89498",
                    "courses_title": "mgmt sc meth",
                    "courses_id": "553",
                    "courses_instructor": "dunbar, w scott",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 2013,
                    "maxAvg": 95.44,
                    "minAvg": 95.44,
                    "avgAvg": 95.4,
                    "sumAvg": 95.44,
                    "countAvg": 1
                },
                {
                    "courses_dept": "mine",
                    "courses_avg": 95.6,
                    "courses_uuid": "80144",
                    "courses_title": "mgmt sc meth",
                    "courses_id": "553",
                    "courses_instructor": "dunbar, w scott",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 5,
                    "courses_year": 2009,
                    "maxAvg": 95.6,
                    "minAvg": 95.6,
                    "avgAvg": 95.6,
                    "sumAvg": 95.6,
                    "countAvg": 1
                },
                {
                    "courses_dept": "mine",
                    "courses_avg": 96.59,
                    "courses_uuid": "67760",
                    "courses_title": "seminar",
                    "courses_id": "393",
                    "courses_instructor": "veiga, marcello",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 34,
                    "courses_year": 2012,
                    "maxAvg": 96.59,
                    "minAvg": 96.59,
                    "avgAvg": 96.6,
                    "sumAvg": 96.59,
                    "countAvg": 1
                },
                {
                    "courses_dept": "mtrl",
                    "courses_avg": 96.25,
                    "courses_uuid": "2667",
                    "courses_title": "hydrmtllgcl rctr",
                    "courses_id": "564",
                    "courses_instructor": "dixon, david",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 2011,
                    "maxAvg": 96.25,
                    "minAvg": 96.25,
                    "avgAvg": 96.3,
                    "sumAvg": 96.25,
                    "countAvg": 1
                },
                {
                    "courses_dept": "mtrl",
                    "courses_avg": 96.25,
                    "courses_uuid": "2668",
                    "courses_title": "hydrmtllgcl rctr",
                    "courses_id": "564",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 1900,
                    "maxAvg": 96.25,
                    "minAvg": 96.25,
                    "avgAvg": 96.3,
                    "sumAvg": 96.25,
                    "countAvg": 1
                },
                {
                    "courses_dept": "musc",
                    "courses_avg": 95.38,
                    "courses_uuid": "7254",
                    "courses_title": "orch repertoire",
                    "courses_id": "506",
                    "courses_instructor": "girard, jonathan",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 8,
                    "courses_year": 2015,
                    "maxAvg": 95.38,
                    "minAvg": 95.38,
                    "avgAvg": 95.4,
                    "sumAvg": 95.38,
                    "countAvg": 1
                },
                {
                    "courses_dept": "musc",
                    "courses_avg": 95.67,
                    "courses_uuid": "7255",
                    "courses_title": "orch repertoire",
                    "courses_id": "506",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 1900,
                    "maxAvg": 95.67,
                    "minAvg": 95.67,
                    "avgAvg": 95.7,
                    "sumAvg": 95.67,
                    "countAvg": 1
                },
                {
                    "courses_dept": "musc",
                    "courses_avg": 96.5,
                    "courses_uuid": "78041",
                    "courses_title": "ubc chamb string",
                    "courses_id": "559",
                    "courses_instructor": "girard, jonathan",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 2012,
                    "maxAvg": 96.5,
                    "minAvg": 96.5,
                    "avgAvg": 96.5,
                    "sumAvg": 96.5,
                    "countAvg": 1
                },
                {
                    "courses_dept": "musc",
                    "courses_avg": 96.5,
                    "courses_uuid": "78042",
                    "courses_title": "ubc chamb string",
                    "courses_id": "559",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 1900,
                    "maxAvg": 96.5,
                    "minAvg": 96.5,
                    "avgAvg": 96.5,
                    "sumAvg": 96.5,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 95.13,
                    "courses_uuid": "78717",
                    "courses_title": "cl pro prim care",
                    "courses_id": "509",
                    "courses_instructor": "harding, jillian",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 16,
                    "courses_year": 2014,
                    "maxAvg": 95.13,
                    "minAvg": 95.13,
                    "avgAvg": 95.1,
                    "sumAvg": 95.13,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 95.13,
                    "courses_uuid": "78718",
                    "courses_title": "cl pro prim care",
                    "courses_id": "509",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 16,
                    "courses_year": 1900,
                    "maxAvg": 95.13,
                    "minAvg": 95.13,
                    "avgAvg": 95.1,
                    "sumAvg": 95.13,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 95.29,
                    "courses_uuid": "88117",
                    "courses_title": "cl pro prim care",
                    "courses_id": "509",
                    "courses_instructor": "krist, jennifer;mccuaig, fairleth",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 2013,
                    "maxAvg": 95.29,
                    "minAvg": 95.29,
                    "avgAvg": 95.3,
                    "sumAvg": 95.29,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 95.29,
                    "courses_uuid": "88118",
                    "courses_title": "cl pro prim care",
                    "courses_id": "509",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 1900,
                    "maxAvg": 95.29,
                    "minAvg": 95.29,
                    "avgAvg": 95.3,
                    "sumAvg": 95.29,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 95.43,
                    "courses_uuid": "96214",
                    "courses_title": "cl pro prim care",
                    "courses_id": "509",
                    "courses_instructor": "brew, nancy",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 2010,
                    "maxAvg": 95.43,
                    "minAvg": 95.43,
                    "avgAvg": 95.4,
                    "sumAvg": 95.43,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 95.43,
                    "courses_uuid": "96215",
                    "courses_title": "cl pro prim care",
                    "courses_id": "509",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 1900,
                    "maxAvg": 95.43,
                    "minAvg": 95.43,
                    "avgAvg": 95.4,
                    "sumAvg": 95.43,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 96.64,
                    "courses_uuid": "47427",
                    "courses_title": "fam nrs pract",
                    "courses_id": "578",
                    "courses_instructor": "krist, jennifer",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 2012,
                    "maxAvg": 96.64,
                    "minAvg": 96.64,
                    "avgAvg": 96.6,
                    "sumAvg": 96.64,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 96.64,
                    "courses_uuid": "47428",
                    "courses_title": "fam nrs pract",
                    "courses_id": "578",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 1900,
                    "maxAvg": 96.64,
                    "minAvg": 96.64,
                    "avgAvg": 96.6,
                    "sumAvg": 96.64,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 96.73,
                    "courses_uuid": "93115",
                    "courses_title": "eth&profl issues",
                    "courses_id": "591",
                    "courses_instructor": "burrows, marlene",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 2016,
                    "maxAvg": 96.73,
                    "minAvg": 96.73,
                    "avgAvg": 96.7,
                    "sumAvg": 96.73,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 96.73,
                    "courses_uuid": "93116",
                    "courses_title": "eth&profl issues",
                    "courses_id": "591",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 1900,
                    "maxAvg": 96.73,
                    "minAvg": 96.73,
                    "avgAvg": 96.7,
                    "sumAvg": 96.73,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 97.33,
                    "courses_uuid": "96261",
                    "courses_title": "eth&profl issues",
                    "courses_id": "591",
                    "courses_instructor": "brew, nancy",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 12,
                    "courses_year": 2010,
                    "maxAvg": 97.33,
                    "minAvg": 97.33,
                    "avgAvg": 97.3,
                    "sumAvg": 97.33,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 97.33,
                    "courses_uuid": "96262",
                    "courses_title": "eth&profl issues",
                    "courses_id": "591",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 12,
                    "courses_year": 1900,
                    "maxAvg": 97.33,
                    "minAvg": 97.33,
                    "avgAvg": 97.3,
                    "sumAvg": 97.33,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 97.53,
                    "courses_uuid": "73665",
                    "courses_title": "fam nrs pract",
                    "courses_id": "578",
                    "courses_instructor": "burrows, marlene;harding, jillian;krist, jennifer;mccuaig, fairleth",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 17,
                    "courses_year": 2015,
                    "maxAvg": 97.53,
                    "minAvg": 97.53,
                    "avgAvg": 97.5,
                    "sumAvg": 97.53,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 97.53,
                    "courses_uuid": "73666",
                    "courses_title": "fam nrs pract",
                    "courses_id": "578",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 17,
                    "courses_year": 1900,
                    "maxAvg": 97.53,
                    "minAvg": 97.53,
                    "avgAvg": 97.5,
                    "sumAvg": 97.53,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 98.21,
                    "courses_uuid": "73638",
                    "courses_title": "cl pro prim care",
                    "courses_id": "509",
                    "courses_instructor": "krist, jennifer",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 2015,
                    "maxAvg": 98.21,
                    "minAvg": 98.21,
                    "avgAvg": 98.2,
                    "sumAvg": 98.21,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 98.21,
                    "courses_uuid": "73639",
                    "courses_title": "cl pro prim care",
                    "courses_id": "509",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 1900,
                    "maxAvg": 98.21,
                    "minAvg": 98.21,
                    "avgAvg": 98.2,
                    "sumAvg": 98.21,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 98.5,
                    "courses_uuid": "88151",
                    "courses_title": "fam nrs pract",
                    "courses_id": "578",
                    "courses_instructor": "burrows, marlene;harding, jillian;krist, jennifer;mccuaig, fairleth",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 16,
                    "courses_year": 2013,
                    "maxAvg": 98.5,
                    "minAvg": 98.5,
                    "avgAvg": 98.5,
                    "sumAvg": 98.5,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 98.5,
                    "courses_uuid": "88152",
                    "courses_title": "fam nrs pract",
                    "courses_id": "578",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 16,
                    "courses_year": 1900,
                    "maxAvg": 98.5,
                    "minAvg": 98.5,
                    "avgAvg": 98.5,
                    "sumAvg": 98.5,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 98.58,
                    "courses_uuid": "96250",
                    "courses_title": "fam nrs pract",
                    "courses_id": "578",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 12,
                    "courses_year": 2010,
                    "maxAvg": 98.58,
                    "minAvg": 98.58,
                    "avgAvg": 98.6,
                    "sumAvg": 98.58,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 98.58,
                    "courses_uuid": "96251",
                    "courses_title": "fam nrs pract",
                    "courses_id": "578",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 12,
                    "courses_year": 1900,
                    "maxAvg": 98.58,
                    "minAvg": 98.58,
                    "avgAvg": 98.6,
                    "sumAvg": 98.58,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 98.71,
                    "courses_uuid": "15343",
                    "courses_title": "cl pro prim care",
                    "courses_id": "509",
                    "courses_instructor": "brew, nancy",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 2011,
                    "maxAvg": 98.71,
                    "minAvg": 98.71,
                    "avgAvg": 98.7,
                    "sumAvg": 98.71,
                    "countAvg": 1
                },
                {
                    "courses_dept": "nurs",
                    "courses_avg": 98.71,
                    "courses_uuid": "15344",
                    "courses_title": "cl pro prim care",
                    "courses_id": "509",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 14,
                    "courses_year": 1900,
                    "maxAvg": 98.71,
                    "minAvg": 98.71,
                    "avgAvg": 98.7,
                    "sumAvg": 98.71,
                    "countAvg": 1
                },
                {
                    "courses_dept": "pcth",
                    "courses_avg": 96,
                    "courses_uuid": "70959",
                    "courses_title": "ms thesis",
                    "courses_id": "549",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 1,
                    "courses_year": 1900,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "phar",
                    "courses_avg": 95.07,
                    "courses_uuid": "83047",
                    "courses_title": "admn of injectns",
                    "courses_id": "403",
                    "courses_instructor": "lalji, fawziah;seto, katherine",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 121,
                    "courses_year": 2014,
                    "maxAvg": 95.07,
                    "minAvg": 95.07,
                    "avgAvg": 95.1,
                    "sumAvg": 95.07,
                    "countAvg": 1
                },
                {
                    "courses_dept": "phil",
                    "courses_avg": 96,
                    "courses_uuid": "20190",
                    "courses_title": "log & crit think",
                    "courses_id": "120",
                    "courses_instructor": "jackson, howard",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 1,
                    "courses_year": 2010,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "phth",
                    "courses_avg": 95.37,
                    "courses_uuid": "66657",
                    "courses_title": "clin make iv",
                    "courses_id": "566",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 81,
                    "courses_year": 2013,
                    "maxAvg": 95.37,
                    "minAvg": 95.37,
                    "avgAvg": 95.4,
                    "sumAvg": 95.37,
                    "countAvg": 1
                },
                {
                    "courses_dept": "phth",
                    "courses_avg": 95.37,
                    "courses_uuid": "66658",
                    "courses_title": "clin make iv",
                    "courses_id": "566",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 81,
                    "courses_year": 1900,
                    "maxAvg": 95.37,
                    "minAvg": 95.37,
                    "avgAvg": 95.4,
                    "sumAvg": 95.37,
                    "countAvg": 1
                },
                {
                    "courses_dept": "phys",
                    "courses_avg": 95.43,
                    "courses_uuid": "509",
                    "courses_title": "quant fld theory",
                    "courses_id": "508",
                    "courses_instructor": "stamp, philip c",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 7,
                    "courses_year": 2015,
                    "maxAvg": 95.43,
                    "minAvg": 95.43,
                    "avgAvg": 95.4,
                    "sumAvg": 95.43,
                    "countAvg": 1
                },
                {
                    "courses_dept": "phys",
                    "courses_avg": 95.43,
                    "courses_uuid": "510",
                    "courses_title": "quant fld theory",
                    "courses_id": "508",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 7,
                    "courses_year": 1900,
                    "maxAvg": 95.43,
                    "minAvg": 95.43,
                    "avgAvg": 95.4,
                    "sumAvg": 95.43,
                    "countAvg": 1
                },
                {
                    "courses_dept": "plan",
                    "courses_avg": 96.47,
                    "courses_uuid": "57511",
                    "courses_title": "nat resrce mngmt",
                    "courses_id": "595",
                    "courses_instructor": "dorcey, anthony h j",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 2011,
                    "maxAvg": 96.47,
                    "minAvg": 96.47,
                    "avgAvg": 96.5,
                    "sumAvg": 96.47,
                    "countAvg": 1
                },
                {
                    "courses_dept": "plan",
                    "courses_avg": 96.47,
                    "courses_uuid": "57512",
                    "courses_title": "nat resrce mngmt",
                    "courses_id": "595",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 19,
                    "courses_year": 1900,
                    "maxAvg": 96.47,
                    "minAvg": 96.47,
                    "avgAvg": 96.5,
                    "sumAvg": 96.47,
                    "countAvg": 1
                },
                {
                    "courses_dept": "psyc",
                    "courses_avg": 95.25,
                    "courses_uuid": "25740",
                    "courses_title": "intro psychthrpy",
                    "courses_id": "541",
                    "courses_instructor": "wagner, john",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 2007,
                    "maxAvg": 95.25,
                    "minAvg": 95.25,
                    "avgAvg": 95.3,
                    "sumAvg": 95.25,
                    "countAvg": 1
                },
                {
                    "courses_dept": "psyc",
                    "courses_avg": 95.25,
                    "courses_uuid": "25741",
                    "courses_title": "intro psychthrpy",
                    "courses_id": "541",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 1900,
                    "maxAvg": 95.25,
                    "minAvg": 95.25,
                    "avgAvg": 95.3,
                    "sumAvg": 95.25,
                    "countAvg": 1
                },
                {
                    "courses_dept": "psyc",
                    "courses_avg": 95.75,
                    "courses_uuid": "78257",
                    "courses_title": "eth & prof clin",
                    "courses_id": "537",
                    "courses_instructor": "sochting, ingrid",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 2015,
                    "maxAvg": 95.75,
                    "minAvg": 95.75,
                    "avgAvg": 95.8,
                    "sumAvg": 95.75,
                    "countAvg": 1
                },
                {
                    "courses_dept": "psyc",
                    "courses_avg": 95.75,
                    "courses_uuid": "78258",
                    "courses_title": "eth & prof clin",
                    "courses_id": "537",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 1900,
                    "maxAvg": 95.75,
                    "minAvg": 95.75,
                    "avgAvg": 95.8,
                    "sumAvg": 95.75,
                    "countAvg": 1
                },
                {
                    "courses_dept": "psyc",
                    "courses_avg": 96,
                    "courses_uuid": "78244",
                    "courses_title": "health psych",
                    "courses_id": "501",
                    "courses_instructor": "de longis, anita",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 2015,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "psyc",
                    "courses_avg": 96,
                    "courses_uuid": "78245",
                    "courses_title": "health psych",
                    "courses_id": "501",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 1900,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "psyc",
                    "courses_avg": 96,
                    "courses_uuid": "78270",
                    "courses_title": "masters thesis",
                    "courses_id": "549",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 1,
                    "courses_year": 1900,
                    "maxAvg": 96,
                    "minAvg": 96,
                    "avgAvg": 96,
                    "sumAvg": 96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "psyc",
                    "courses_avg": 97,
                    "courses_uuid": "54846",
                    "courses_title": "masters thesis",
                    "courses_id": "549",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 1,
                    "courses_year": 2012,
                    "maxAvg": 97,
                    "minAvg": 97,
                    "avgAvg": 97,
                    "sumAvg": 97,
                    "countAvg": 1
                },
                {
                    "courses_dept": "sowk",
                    "courses_avg": 95.93,
                    "courses_uuid": "43299",
                    "courses_title": "social analysis",
                    "courses_id": "505",
                    "courses_instructor": "gill, deana",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 2014,
                    "maxAvg": 95.93,
                    "minAvg": 95.93,
                    "avgAvg": 95.9,
                    "sumAvg": 95.93,
                    "countAvg": 1
                },
                {
                    "courses_dept": "sowk",
                    "courses_avg": 95.93,
                    "courses_uuid": "43300",
                    "courses_title": "social analysis",
                    "courses_id": "505",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 1900,
                    "maxAvg": 95.93,
                    "minAvg": 95.93,
                    "avgAvg": 95.9,
                    "sumAvg": 95.93,
                    "countAvg": 1
                },
                {
                    "courses_dept": "sowk",
                    "courses_avg": 96.09,
                    "courses_uuid": "43325",
                    "courses_title": "hlth & soc care",
                    "courses_id": "551",
                    "courses_instructor": "gill, deana",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 11,
                    "courses_year": 2014,
                    "maxAvg": 96.09,
                    "minAvg": 96.09,
                    "avgAvg": 96.1,
                    "sumAvg": 96.09,
                    "countAvg": 1
                },
                {
                    "courses_dept": "sowk",
                    "courses_avg": 96.15,
                    "courses_uuid": "86023",
                    "courses_title": "social analysis",
                    "courses_id": "505",
                    "courses_instructor": "bryson, stephanie;o'connor, deborah;stainton, timothy;sullivan, t richard;tester, frank",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 27,
                    "courses_year": 2012,
                    "maxAvg": 96.15,
                    "minAvg": 96.15,
                    "avgAvg": 96.2,
                    "sumAvg": 96.15,
                    "countAvg": 1
                },
                {
                    "courses_dept": "sowk",
                    "courses_avg": 96.15,
                    "courses_uuid": "86024",
                    "courses_title": "social analysis",
                    "courses_id": "505",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 27,
                    "courses_year": 1900,
                    "maxAvg": 96.15,
                    "minAvg": 96.15,
                    "avgAvg": 96.2,
                    "sumAvg": 96.15,
                    "countAvg": 1
                },
                {
                    "courses_dept": "spph",
                    "courses_avg": 95.09,
                    "courses_uuid": "47781",
                    "courses_title": "com hlth prom",
                    "courses_id": "545",
                    "courses_instructor": "frankish, charles james",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 11,
                    "courses_year": 2009,
                    "maxAvg": 95.09,
                    "minAvg": 95.09,
                    "avgAvg": 95.1,
                    "sumAvg": 95.09,
                    "countAvg": 1
                },
                {
                    "courses_dept": "spph",
                    "courses_avg": 95.09,
                    "courses_uuid": "47782",
                    "courses_title": "com hlth prom",
                    "courses_id": "545",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 1,
                    "courses_pass": 11,
                    "courses_year": 1900,
                    "maxAvg": 95.09,
                    "minAvg": 95.09,
                    "avgAvg": 95.1,
                    "sumAvg": 95.09,
                    "countAvg": 1
                },
                {
                    "courses_dept": "spph",
                    "courses_avg": 95.11,
                    "courses_uuid": "47727",
                    "courses_title": "an meth epid res",
                    "courses_id": "500",
                    "courses_instructor": "sobolev, boris",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 9,
                    "courses_year": 2009,
                    "maxAvg": 95.11,
                    "minAvg": 95.11,
                    "avgAvg": 95.1,
                    "sumAvg": 95.11,
                    "countAvg": 1
                },
                {
                    "courses_dept": "spph",
                    "courses_avg": 95.75,
                    "courses_uuid": "85914",
                    "courses_title": "math mdl com dis",
                    "courses_id": "518",
                    "courses_instructor": "pourbohloul, babak",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 2013,
                    "maxAvg": 95.75,
                    "minAvg": 95.75,
                    "avgAvg": 95.8,
                    "sumAvg": 95.75,
                    "countAvg": 1
                },
                {
                    "courses_dept": "spph",
                    "courses_avg": 95.75,
                    "courses_uuid": "85915",
                    "courses_title": "math mdl com dis",
                    "courses_id": "518",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 4,
                    "courses_year": 1900,
                    "maxAvg": 95.75,
                    "minAvg": 95.75,
                    "avgAvg": 95.8,
                    "sumAvg": 95.75,
                    "countAvg": 1
                },
                {
                    "courses_dept": "spph",
                    "courses_avg": 95.76,
                    "courses_uuid": "65068",
                    "courses_title": "sociocult determ",
                    "courses_id": "200",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 92,
                    "courses_year": 1900,
                    "maxAvg": 95.76,
                    "minAvg": 95.76,
                    "avgAvg": 95.8,
                    "sumAvg": 95.76,
                    "countAvg": 1
                },
                {
                    "courses_dept": "spph",
                    "courses_avg": 96.8,
                    "courses_uuid": "68029",
                    "courses_title": "survlnc&monitrng",
                    "courses_id": "515",
                    "courses_instructor": "kishchenko, svetlana",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 5,
                    "courses_year": 2010,
                    "maxAvg": 96.8,
                    "minAvg": 96.8,
                    "avgAvg": 96.8,
                    "sumAvg": 96.8,
                    "countAvg": 1
                },
                {
                    "courses_dept": "spph",
                    "courses_avg": 96.8,
                    "courses_uuid": "68030",
                    "courses_title": "survlnc&monitrng",
                    "courses_id": "515",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 5,
                    "courses_year": 1900,
                    "maxAvg": 96.8,
                    "minAvg": 96.8,
                    "avgAvg": 96.8,
                    "sumAvg": 96.8,
                    "countAvg": 1
                },
                {
                    "courses_dept": "spph",
                    "courses_avg": 96.96,
                    "courses_uuid": "65066",
                    "courses_title": "sociocult determ",
                    "courses_id": "200",
                    "courses_instructor": "frankish, charles james",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 56,
                    "courses_year": 2015,
                    "maxAvg": 96.96,
                    "minAvg": 96.96,
                    "avgAvg": 97,
                    "sumAvg": 96.96,
                    "countAvg": 1
                },
                {
                    "courses_dept": "spph",
                    "courses_avg": 98.98,
                    "courses_uuid": "65069",
                    "courses_title": "work int health",
                    "courses_id": "300",
                    "courses_instructor": "frank, erica",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 82,
                    "courses_year": 2015,
                    "maxAvg": 98.98,
                    "minAvg": 98.98,
                    "avgAvg": 99,
                    "sumAvg": 98.98,
                    "countAvg": 1
                },
                {
                    "courses_dept": "spph",
                    "courses_avg": 98.98,
                    "courses_uuid": "65070",
                    "courses_title": "work int health",
                    "courses_id": "300",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 82,
                    "courses_year": 1900,
                    "maxAvg": 98.98,
                    "minAvg": 98.98,
                    "avgAvg": 99,
                    "sumAvg": 98.98,
                    "countAvg": 1
                },
                {
                    "courses_dept": "thtr",
                    "courses_avg": 95.2,
                    "courses_uuid": "63432",
                    "courses_title": "scenery prod i",
                    "courses_id": "350",
                    "courses_instructor": "mclean, jayson",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 2011,
                    "maxAvg": 95.2,
                    "minAvg": 95.2,
                    "avgAvg": 95.2,
                    "sumAvg": 95.2,
                    "countAvg": 1
                },
                {
                    "courses_dept": "thtr",
                    "courses_avg": 95.2,
                    "courses_uuid": "63433",
                    "courses_title": "scenery prod i",
                    "courses_id": "350",
                    "courses_instructor": "",
                    "courses_fail": 0,
                    "courses_audit": 0,
                    "courses_pass": 15,
                    "courses_year": 1900,
                    "maxAvg": 95.2,
                    "minAvg": 95.2,
                    "avgAvg": 95.2,
                    "sumAvg": 95.2,
                    "countAvg": 1
                }
            ]
        };


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response: any) => {
                //console.log(response.code);
                //console.log(response.body);
                expect(response.body).to.deep.equal(ans);
                //console.log("-------------------------------");
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
                done();
            });

    });


    it("test d3 test 6", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "avg",
                    "count"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["avg", "courses_dept", "avg", "courses_dept", "courses_dept", "courses_dept"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_id", "courses_dept", "courses_dept", "courses_dept"],
                "APPLY": [
                    {
                        "avg": {
                            "AVG": "courses_avg"
                        }
                    },
                    {
                        "count": {
                            "COUNT": "courses_uuid"
                        }
                    }
                ]
            }
        };

        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
                done();
            });

    });


    it("test d3 test 7", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "count"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["sum"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept"],
                "APPLY": [
                    {
                        "sum": {
                            "SUM": "courses_avg"
                        }
                    }, {
                        "count": {
                            "COUNT": "courses_uuid"
                        }
                    }, {
                        "sum 1": {
                            "AVG": "courses_avg"
                        }
                    }]
            }
        };

        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
                done();
            });

    });

    it("test sort 1", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "sum",
                    "avg",
                    "count",
                    "min",
                    "max"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["max", "courses_dept", "courses_id"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "courses_id",
                    "courses_dept"],
                "APPLY": [
                    {
                        "sum": {
                            "SUM": "courses_fail"
                        }
                    }, {
                        "max": {
                            "MAX": "courses_fail"
                        }
                    }, {
                        "min": {
                            "MIN": "courses_fail"
                        }
                    }, {
                        "count": {
                            "COUNT": "courses_fail"
                        }
                    }, {
                        "avg": {
                            "AVG": "courses_fail"
                        }
                    }]
            }
        };

        var query = s1;

        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                //console.log("------------------------------------")
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body);
                done();
            });

    });

    it("test sort 2", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid",
                    "courses_title",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audit",
                    "courses_pass",
                    "courses_year"
                ],
                "ORDER": "courses_dept",
                "FORM": "TABLE"
            }
        };

        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                expect(response.code).to.equal(200);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body);
                done();
            });

    });

    it("test sort 3", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid",
                    "courses_title",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audit",
                    "courses_pass",
                    "courses_year",
                    "sum", "max", "min", "count", "avg"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["avg", "courses_dept"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "courses_dept",
                    "courses_avg",
                    "courses_uuid",
                    "courses_title",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audit",
                    "courses_pass",
                    "courses_year"],
                "APPLY": [
                    {
                        "sum": {
                            "SUM": "courses_avg"
                        }
                    }, {
                        "max": {
                            "MAX": "courses_avg"
                        }
                    }, {
                        "min": {
                            "MIN": "courses_avg"
                        }
                    }, {
                        "count": {
                            "COUNT": "courses_id"
                        }
                    }, {
                        "avg": {
                            "AVG": "courses_avg"
                        }
                    }]
            }
        };

        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                expect(response.code).to.equal(200);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body);
                done();
            });

    });

    it("test sort 4", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "max",
                    "avg",
                    "min",
                    "count",
                    "0"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["0"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "courses_dept",
                    "courses_id"],
                "APPLY": [
                    {
                        "avg": {
                            "SUM": "courses_pass"
                        }
                    }, {
                        "max": {
                            "MAX": "courses_pass"
                        }
                    }, {
                        "min": {
                            "MIN": "courses_pass"
                        }
                    }, {
                        "count": {
                            "COUNT": "courses_uuid"
                        }
                    }, {
                        "0": {
                            "AVG": "courses_pass"
                        }
                    }]
            }
        };

        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response) => {
                //console.log(response.code);
                //console.log(response.body);
                expect(response.code).to.equal(200);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body);
                done();
            });

    });

    it("test put", function (done) {
        this.timeout(20000);
        server.start().then(function () {
            let dataset = fs.readFileSync("./src/rooms.zip");
            chai.request("http://localhost:4321")
                .put('/dataset/rooms')
                .attach("body", dataset, "rooms.zip")
                .end(function () {
                    server.stop().then();
                    done();
                })
        }).catch();

    });

    // it("PUT description", function () {
    //     return chai.request('http://localhost:4321')
    //         .put('/dataset/rooms')
    //         .attach("body", fs.readFileSync("./src/rooms.zip"), "rooms.zip")
    //         .then(function (res: any) {
    //             Log.trace('then:');
    //             // some assertions
    //         })
    //         .catch(function (err:any) {
    //             Log.trace('catch:');
    //             // some assertions
    //             expect.fail();
    //         });
    // });

    it("test post", function (done) {
        this.timeout(20000);
        let query = {
            "WHERE": {
                "AND": [{
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                }, {
                    "GT": {
                        "rooms_seats": 300
                    }
                }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }]
            }
        };
        server.start().then(function () {
            chai.request("http://localhost:4321")
                .post('/query')
                .send(query)
                .end(function (err: any, res: any) {
                    //console.log(res.body);
                    server.stop().then();
                    done();
                })
        }).catch();
    });

    it("test del", function (done) {
        this.timeout(20000);
        server.start().then(function () {
            chai.request("http://localhost:4321")
                .del('/dataset/rooms')
                .end(function () {
                    server.stop().then();
                    done();
                })
        }).catch();
    });

    it("test echo", function (done) {
        this.timeout(20000);
        server.start().then(function () {
            chai.request("http://localhost:4321")
                .get('/echo/:msg')
                .end(function () {
                    server.stop().then();
                    done();
                })
        }).catch();
    });
});

