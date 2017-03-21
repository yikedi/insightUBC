/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import ScheduleManager from "../src/controller/ScheduleManager";

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

    xit("test add courses.zip", function (done) {
        this.timeout(50000)

        var zip = new JSZip();
        var temp_1 = "./src/courses.zip";
        var f = fs.readFileSync(temp_1, {encoding: "base64"});

        var temp = new InsightFacade();

        temp.addDataset("courses", f)
            .then((response) => {
                console.log(response.code);
                //console.log(response.body);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body)
                done();
            });

    });

    /*
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
                console.log(response.code);
                console.log(response.body);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body)
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
                console.log(response.code);
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
                console.log(response.code);
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
            console.log(err.code);
            //console.log(err.body);
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
            console.log(err.code);
            //console.log(err.body);
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
            console.log(body.code);
            //console.log(body.body);
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
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
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
            console.log(body.code);
            //console.log(body.body);
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
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
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
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
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
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
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
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
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
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
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
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
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
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (result) {
            console.log(result.code);
            console.log(result.body);
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
            console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (result) {
            console.log(result.code);
            console.log(result.body);
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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (result) {
            console.log(result.code);
            console.log(result.body);
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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (result) {
            console.log(result.code);
            console.log(result.body);
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
            console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
    //         console.log(result.code);
    //         //console.log(result.body);
    //         done();
    //     }).catch(function (err) {
    //         console.log(err.code);
    //         //console.log(err.body);
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
            console.log(result.code);
            //console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            //console.log(result.body);

            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            //console.log(result.body);
            //console.log(result.body["result"].length);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            //console.log(result.body);
            //console.log(result.body["result"].length);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            //console.log(result.body);
            //console.log(result.body["result"].length);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            //console.log(result.body);
            //  console.log(result.body["result"].length);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
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
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
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
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
            Log.info(err.toString());
            Log.warn(err.toString());
            Log.error(err.toString());
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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
            console.log(result.code);
            console.log(result.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);

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
                console.log(response.code);
                console.log(response.body);
                done();
            })
            .catch((err) => {
                //console.log(err.code);
                //console.log(err.body)
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
                console.log(response.code);
                console.log(response.body);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body)
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
                console.log(response.code);
                console.log(response.body);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body)
                done();
            });

    });
    */

    xit("test new sort", function (done) {
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

        var query = s1;
        var option = s1["OPTIONS"];
        var order = option["ORDER"];
        var dir = order["dir"];
        var keys = order["keys"];

        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response: any) => {
                console.log(response.code);
                console.log(response.body);

                var list = response.body["result"];
                console.log("Is sorted:  "+check_order(list,keys,dir));

                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body)
                done();
            });

    });

    xit("test transformation ", function (done) {
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
                console.log(response.code);
                console.log(response.body);
                console.log(response.body["result"].length);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body)
                done();
            });

    });

    xit("test d3 test", function (done) {
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
                console.log(response.code);
                console.log(response.body);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body)
                done();
            });

    });

    xit("test d3 test 4 valid", function (done) {
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

        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response: any) => {
                console.log(response.code);
                console.log(response.body);
                //console.log(response.body["result"].length);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body)
                done();
            });

    });

    xit("test d3 test 5 courses", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "GT": {
                    "courses_avg": 98
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


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response: any) => {
                console.log(response.code);
                console.log(response.body);
                //console.log(response.body["result"].length);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body)
                done();
            });

    });


    xit("test d3 test 6", function (done) {
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
                console.log(response.code);
                console.log(response.body);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body)
                done();
            });

    });


    xit("test d3 test 7", function (done) {
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
                console.log(response.code);
                console.log(response.body);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body)
                done();
            });

    });

    xit("test sort 1", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "avg"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["courses_dept", "courses_id",
                        "avg"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "courses_dept",
                    "courses_id"],
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
                            "COUNT": "courses_uuid"
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
                console.log(response.code);
                console.log(response.body);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body);
                done();
            });

    });

    xit("test sort 2", function (done) {
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
                console.log(response.code);
                console.log(response.body);
                expect(response.code).to.equal(200);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body);
                done();
            });

    });

    xit("test sort 3", function (done) {
        this.timeout(10000)

        var s1: any = {
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
                    "dir": "DOWN",
                    "keys": ["avg", "courses_dept", "courses_dept", "courses_dept", "courses_dept"]
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
        var option = s1["OPTIONS"];
        var order = option["ORDER"];
        var dir = order["dir"];
        var keys = order["keys"];


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response: any) => {
                console.log(response.code);
                console.log(response.body);

                var list = response.body["result"];
                console.log("Is sorted:  "+check_order(list,keys,dir));


                expect(response.code).to.equal(200);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body);
                done();
            });

    });

    xit("test sort 4", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept", "Maxfail", "MinPass", "avgAvg", "CountInstructor", "SumYear"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["courses_dept", "Maxfail", "MinPass", "avgAvg", "CountInstructor", "SumYear"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept"],
                "APPLY": [
                    {
                        "Maxfail": {
                            "MAX": "courses_fail"
                        }
                    },

                    {
                        "MinPass": {
                            "MIN": "courses_pass"
                        }
                    },

                    {
                        "avgAvg": {
                            "AVG": "courses_avg"
                        }
                    },

                    {
                        "CountInstructor": {
                            "COUNT": "courses_instructor"
                        }
                    },

                    {
                        "SumYear": {
                            "SUM": "courses_year"
                        }
                    }
                ]
            }
        };

        var query = s1;


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response:any) => {
                console.log(response.code);
                console.log(response.body);
                expect(response.code).to.equal(200);
                let a=check_order(response.body["result"],s1["OPTIONS"]["ORDER"]["keys"],s1["OPTIONS"]["ORDER"]["dir"]);
                console.log(a);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body);
                done();
            });

    });


    xit("test sort 5", function (done) {
        this.timeout(10000);

        var s1: any = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_audit",
                    "courses_pass",
                    "temp0",
                    "temp1",
                    "temp2",
                    "temp3",
                    "temp4",
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": [
                        "courses_dept",
                        "courses_audit",
                        "courses_pass",
                        "temp0",
                        "temp1",
                        "temp2",
                        "temp3",
                        "temp4"
                    ]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "courses_dept",
                    "courses_audit",
                    "courses_pass"
                ],
                "APPLY": [
                    {
                        "temp0": {
                            "SUM": "courses_pass"
                        }
                    }, {
                        "temp1": {
                            "MAX": "courses_pass"
                        }
                    }, {
                        "temp2": {
                            "MIN": "courses_pass"
                        }
                    }, {
                        "temp3": {
                            "COUNT": "courses_id"
                        }
                    }, {
                        "temp4": {
                            "AVG": "courses_pass"
                        }
                    }]
            }
        };

        var query = s1;
        var option = s1["OPTIONS"];
        var order = option["ORDER"];
        var dir = order["dir"];
        var keys = order["keys"];


        var temp = new InsightFacade();

        temp.performQuery(query)
            .then((response: any) => {
                console.log(response.code);
                console.log(response.body);

                var list = response.body["result"];

                console.log("Is sorted:  "+check_order(list,keys,dir));


                expect(response.code).to.equal(200);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body);
                done();
            });


    });


    xit("test sort 6", function (done) {
        this.timeout(10000)

        var s1: any = {
            "WHERE": {
                "AND": [
                    {

                        "EQ": {
                            "courses_year": 2014
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "count",
                    "size"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["courses_dept", "courses_id", "count","size"]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "courses_dept",
                    "courses_id"
                ],
                "APPLY": [
                    {
                        "count": {
                            "COUNT": "courses_uuid"
                        }
                    },
                    {
                        "size":{
                            "MAX":"courses_size"
                        }
                    }

                ]
            }
        };

        var query = s1;
        var option = s1["OPTIONS"];
        var order = option["ORDER"];
        var dir = order["dir"];
        var keys = order["keys"];


        var temp = new InsightFacade();


        temp.performQuery(query)
            .then((response: any) => {
                console.log(response.code);
                console.log(response.body["result"].length);

                var list = response.body["result"];

                console.log("Is sorted:  "+check_order(list,keys,dir));


                expect(response.code).to.equal(200);
                done();
            })
            .catch((err) => {
                console.log(err.code);
                console.log(err.body);
                done();
            });

    });


    it("test schedule 1 all courses", function (done) {
        this.timeout(10000);


        var s=new ScheduleManager();

        s.setup_course().then(function (response) {
           console.log(response.code);
           //console.log(s.get_all_courses());
           done();
        }).catch(function (err) {
            console.log(err.message);
            done();
        });


    });

    it("test schedule 2 all room", function (done) {
        this.timeout(10000);


        var s=new ScheduleManager();

        s.setup_room().then(function (response) {
            console.log(response.code);
            let a1=s.get_all_rooms();
            console.log(a1);
            done();
        }).catch(function (err) {
            console.log(err.message);
            done();
        });

    });

    it("test schedule 3 some room", function (done) {
        this.timeout(10000);


        var s=new ScheduleManager();

        s.setup_room().then(function (response) {

            console.log(response.code);
            let a1=s.get_courses_bydept("cpsc");
            let a2=s.get_courses_byname(["math_200"]);
            console.log(a1);
            console.log(a2);
            done();
        }).catch(function (err) {
            console.log(err.message);
            done();
        });

    });

    it("test schedule 4", function (done) {
        this.timeout(10000);


        var s=new ScheduleManager();

        s.setup_room().then(function (response) {

            console.log(response.code);
            let a1=s.get_rooms_bybuilding("DMP");
            console.log();
            let a2=s.get_rooms_byname(["AERL_120","ALRD_105"]);
            console.log();
            let a3=s.get_rooms_bydistance("DMP",500);
            console.log()
            console.log(a1);
            console.log(a2);
            console.log(a3);
            done();
        }).catch(function (err) {
            console.log(err.message);
            done();
        });

    });

    it("test schedule 5", function (done) {
        this.timeout(10000);


        var s=new ScheduleManager();

        s.setup_room().then(function (response) {

            console.log(response.code);
            let a1=s.get_rooms_bybuilding("DMP");
            console.log();

            let a2=s.get_rooms_bybuilding("PHRM");
            s.add_room_tolist(a1);
            s.add_room_tolist(a2);

            let c1=s.get_courses_bydept("cpsc");
            s.add_course_tolist(c1);


            console.log(s.courses);
            console.log();
            console.log(s.rooms);
            done();
        }).catch(function (err) {
            console.log(err.message);
            done();
        });

    });

    it("test schedule 6", function (done) {
        this.timeout(10000);


        var s=new ScheduleManager();

        s.setup_room().then(function (response) {

            console.log(response.code);
            let b1=s.get_rooms_bybuilding("DMP");
            //let b2=s.get_rooms_bybuilding("PHRM");
            let c1=s.get_courses_byname(["cpsc_666"]);

            s.add_course_tolist(c1);
            s.add_room_tolist(b1);
            //s.add_room_tolist(b2);

            s.schedule(s.rooms,s.courses).then(function (response:any) {
                console.log(response.code);
                console.log(response.body["Events"]);
                console.log(response.body["Unscheduled"]);
                done();
            });


        }).catch(function (err) {
            console.log(err.message);
            done();
        });

    });


    xit("test schedule 7", function (done) {
        this.timeout(10000);


        var s=new ScheduleManager();

        s.setup_room().then(function (response) {

            console.log(response.code);
            let b1=s.get_all_rooms();

            let c1=s.get_all_courses();
            s.add_course_tolist(c1);
            s.add_room_tolist(b1);

            s.schedule(s.rooms,s.courses).then(function (response) {
                console.log(response.code);
                console.log(response.body);

                done();
            }).catch(function (err) {
                console.log(err.message);
                done();
            });


        }).catch(function (err) {
            console.log(err.message);
            done();
        });

    });


    it("test schedule 8 by distance", function (done) {
        this.timeout(10000);


        var s=new ScheduleManager();

        s.setup_room().then(function (response) {

            let b1=s.get_rooms_bydistance("DMP",200);

            let c1=s.get_all_courses();
            s.add_course_tolist(c1);
            s.add_room_tolist(b1);

            c1=sortby_id(c1,"size");
            b1=sortby_id(b1,"seats");
            console.log(c1);
            console.log(b1.length);

            s.schedule(s.rooms,s.courses).then(function (response:any) {
                console.log(response.code);
                console.log(response.body["Events"]);
                console.log(response.body["Unscheduled"]);

                done();
            }).catch(function (err) {
                console.log(err.message);
                done();
            });


        }).catch(function (err) {
            console.log(err.message);
            done();
        });

    });

    it("test schedule 9 test general", function (done) {
        this.timeout(10000);


        var s=new ScheduleManager();

        s.setup_room().then(function (response) {

            var s1: any = {
                "WHERE": {
                    "AND": [
                        {

                            "EQ": {
                                "courses_year": 2014
                            }
                        }
                    ]
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "courses_dept",
                        "courses_id",
                        "count",
                        "size"
                    ],
                    "ORDER": {
                        "dir": "UP",
                        "keys": ["courses_dept", "courses_id", "count","size"]
                    },
                    "FORM": "TABLE"
                },
                "TRANSFORMATIONS": {
                    "GROUP": [
                        "courses_dept",
                        "courses_id"
                    ],
                    "APPLY": [
                        {
                            "count": {
                                "COUNT": "courses_uuid"
                            }
                        },
                        {
                            "size":{
                                "MAX":"courses_size"
                            }
                        }

                    ]
                }
            };



                s.get_result(s1).then( (result)=> {
                   console.log(result);
                    done();
                }).catch(function (err) {
                    console.log(err.message);
                });


            }).catch(function (err) {
                console.log(err.message);
                done();
            });



    });


    it("test schedule 10 ", function (done) {
        this.timeout(10000);


        var s=new ScheduleManager();

        s.setup_room().then(function (response) {

            let b1=s.get_rooms_bybuilding("DMP");
            let b2=s.get_rooms_bydistance("DMP",100);

            let b12=b1.concat(b2);
            let u1=s.get_union(b12,"room_name");

            let i1=s.get_intersection(b12,"room_name");
            let i12=i1.concat(u1);
            let i2=s.get_intersection(i12,"room_name");

            console.log(u1.length);
            console.log(i1.length);


            console.log(u1);
            console.log("---------------------------");
            console.log();
            console.log(i1);
            console.log();
            console.log(i2);
            done();


        }).catch(function (err) {
            console.log(err.message);
            done();
        });



    });


    function check_order(list: any[], order: string[], dir: string): boolean {


        if (dir == "UP") {
            for (var i = 0; i < list.length - 1; i++) {
                for (let key of order) {
                    if (list[i][key] > list[i + 1][key]) {
                        return false;
                    }
                    else if (list[i][key] < list[i + 1][key]) {
                        break;
                    }
                }
            }
        }
        else if (dir == "DOWN") {
            for (var i = 0; i < list.length - 1; i++) {
                for (let key of order) {
                    if (list[i][key] < list[i + 1][key]) {
                        return false;
                    }
                    else if (list[i][key] > list[i + 1][key]) {
                        break;
                    }
                }
            }
        }

        return true;
    }

    function sortby_id(list:any[],id:string):any[]{

        list=list.sort((a: any, b: any) => {
            if (a[id] < b[id]) {
                return 1;
            }
            else if (a[id] > b[id]) {
                return -1;
            }
            else
                return 0;
        });
        return list;
    }


});


