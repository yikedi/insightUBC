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


    function sanxityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.txitle);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.txitle);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.txitle);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.txitle);
    });

    xit("Should be able to echo", function () {


        let out = Server.performEcho('echo');
        Log.test(JSON.stringify(out));
        sanxityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: 'echo...echo'});
    });

    xit("Should be able to echo silence", function () {
        let out = Server.performEcho('');
        Log.test(JSON.stringify(out));
        sanxityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: '...'});
    });

    xit("Should be able to handle a missing echo message sensibly", function () {
        let out = Server.performEcho(undefined);
        Log.test(JSON.stringify(out));
        sanxityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });

    xit("Should be able to handle a null echo message sensibly", function () {
        let out = Server.performEcho(null);
        Log.test(JSON.stringify(out));
        sanxityCheck(out);
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


    xit("test simple query courses year", function (done) {
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
                            "EQ":{
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




    xit("test add courses.zip", function (done) {
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
    xit("test add courses.zip again", function (done) {
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


    xit("invalid query-> order", function (done) {

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


    xit("test 424 1 ", function (done) {
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

    xit("test single NOT ", function (done) {
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


    xit("test complex 424  ", function (done) {
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


    xit("test courses in one dept 70-80 ", function (done) {
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


    xit("empty GT ", function (done) {
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


    xit("test contradictory query ", function (done) {
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


    xit("test 400 1 invalid key ", function (done) {
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


    xit("test 400 2 undefined and ", function (done) {
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


    xit("test 400 4  ", function (done) {
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

    xit("test 400 3  ", function (done) {
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


    xit("test performquery after remove", function (done) {

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


    xit("test double negation 99 ", function (done) {
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

    xit("test complex double negation ", function (done) {
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


    xit("invlid order ", function (done) {
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


    xit("test invalid query ", function (done) {
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

    xit("test 424 abcd ", function (done) {
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
                    "courses_txitle",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audxit",
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


    xit("test EQ 1 ", function (done) {
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


    // xit("test EQ 2 ", function (done) {
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
    //                 "courses_txitle",
    //                 "courses_instructor",
    //                 "courses_fail",
    //                 "courses_audxit",
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


    xit("test EQ 2 ", function (done) {
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
                    "courses_txitle",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audxit",
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

    xit("test partial ", function (done) {
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


    xit("test partial 3 all courses in one dept but taught by ", function (done) {
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


    xit("test partial all courses in one dept except some specific example ", function (done) {
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


    xit("test partial 4 ", function (done) {
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


    xit("test not ", function (done) {
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


    xit("test 424 2223 ", function (done) {
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

    xit("test 424 2222 ", function (done) {
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
                    "courses_txitle",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audxit",
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


    xit("test set of instructors ", function (done) {
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
                    "courses_txitle",
                    "courses_instructor",
                    "courses_fail",
                    "courses_audxit",
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

    xit("test 424 abcd ", function (done) {
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
                    "courses_txitle",
                    "courses_insftructor",
                    "courses_fail",
                    "courses_ausddxit",
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

    xit("test Empty not", function (done) {
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

    xit("test too many param not", function (done) {
        this.timeout(10000)

        var s1 = {
            "WHERE": {
                "NOT": {
                    "GT":{
                        "courses_avg":99
                    },
                    "LT":{
                        "courses_avg":1
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

    xit("test empty or", function (done) {
        this.timeout(10000)

        var s1 = '{'+
            '"WHERE": {'+
            '"OR": []'+

            '},'+
            '"OPTIONS": {"COLUMNS": ["courses_dept","courses_avg"],'+
            '"ORDER": "courses_avg",'+
            '"FORM": "TABLE"'+
            '}'+
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

    xit("test empty and", function (done) {
        this.timeout(10000)

        var s1 = '{'+
            '"WHERE": {'+
            '"AND": []'+

            '},'+
            '"OPTIONS": {"COLUMNS": ["courses_dept","courses_avg"],'+
            '"ORDER": "courses_avg",'+
            '"FORM": "TABLE"'+
            '}'+
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

    xit("test empty eq", function (done) {
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
    xit("test too many param eq", function (done) {
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


    xit("test tpye error eq", function (done) {
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
    xit("test tpye error IS", function (done) {
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

    xit("test empty LT", function (done) {
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
    xit("test too many param LT", function (done) {
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


    xit("test tpye error LT", function (done) {
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

    xit("test too many param GT", function (done) {
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
    xit("test empty IS", function (done) {
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
    xit("test too many param IS", function (done) {
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

    xit("test FORM error", function (done) {
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

    xit("test column error", function (done) {
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

    xit("test invalid setValue", function (done) {
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




















    it("test remove ", function (done) {
        this.timeout(10000)


        var temp = new InsightFacade();


        temp.removeDataset("courses").then(function (body) {
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
            done();
        })

    });

    xit("test double remove ", function (done) {
        this.timeout(10000)


        var temp = new InsightFacade();


        temp.removeDataset("courses").then(function (body) {
            console.log(body.code);
            //console.log(body.body);
            done();
        }).catch(function (err) {
            console.log(err.code);
            //console.log(err.body);
            done();
        })

    });
    xit("test readError", function (done) {
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


    xit("test Adddataset rooms", function (done) {
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


    xit("test query rooms", function (done) {
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
                    "rooms_furnxiture",
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

    xit("test simple invalid query rooms 2", function (done) {
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
                            "IS":{
                                "rooms_shortname":"*C*"
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
                        // {
                        //     "IS":{
                        //         "courses_txitle":"*C*"
                        //     }
                        // }
                    ]


            },


            "OPTIONS": {
                "COLUMNS": [
                    "courses_avg",
                    "courses_year",
                    "courses_uuid"

                ],

                "ORDER":{
                   "dir":"UP",
                    "keys":[
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
});

