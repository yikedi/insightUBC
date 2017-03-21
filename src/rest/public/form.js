function initial(form,and_or) {
    offset = "";
    if(form == "rooms"){
        do_it = false;
        order_by = {"value":""}
        res_colunm = document.getElementById("res_column_rooms");
        is_list = [];
        com_list = [];
        distance_f ="";
        if(document.getElementById("building_distance").value!="" &&document.getElementById("distance").value!="" ){
           distance_f = {"building_name":document.getElementById("building_distance").value.toUpperCase(),
                      "distance":Number(document.getElementById("distance").value),
                     "and_or":and_or};
            offset = "_rooms_distance";
        }
        if(document.getElementById("building_name").value!= ""){
            do_it = true;
            is_list.push({"key":"rooms_shortname","value":"*"+document.getElementById("building_name").value.toUpperCase()+"*"});
        }
        if(document.getElementById("room_number").value!= ""){
            do_it = true;
            is_list.push({"key":"rooms_number","value":"*"+document.getElementById("room_number").value.toUpperCase()+"*"});
        }
        if(document.getElementById("room_type").value!= ""){
            do_it = true;
            is_list.push({"key":"rooms_type","value":"*"+document.getElementById("room_type").value+"*"});
        }
        if(document.getElementById("furniture_type").value!= ""){
            do_it = true;
            is_list.push({"key":"rooms_furniture","value":"*"+document.getElementById("furniture_type").value+"*"});
        }
        if(document.getElementById("room_size").value != ""){
            do_it = true;
            com_list.push({"key":"rooms_seats","value":Number(document.getElementById("room_size").value),
                           "comparator":document.getElementById("comparator_2").value})
        }
    }
    if (form == "courses") {
        do_it = false;
        order_by = document.getElementById("courses_order_by");
        order_dir = document.getElementById("courses_order_dir");
        res_colunm = document.getElementById("res_column");
        is_list = [];
        com_list = [];
        distance_f="";
        if(document.getElementById("dept").value!= ""){
            do_it = true;
            is_list.push({"key":"courses_dept","value":"*"+document.getElementById("dept").value.toLowerCase()+"*"});
        }
        if(document.getElementById("cid").value != ""){
            do_it = true;
            is_list.push({"key":"courses_id","value":"*"+document.getElementById("cid").value.toLowerCase()+"*"});
        }
        if(document.getElementById("instructor").value  != ""){
            do_it = true;
            is_list.push({"key":"courses_instructor","value":"*"+document.getElementById("instructor").value.toLowerCase()+"*"});
        }
        if(document.getElementById("title").value != ""){
            do_it = true;
            is_list.push({"key":"courses_title","value":"*"+document.getElementById("title").value.toLowerCase()+"*"});
        }
        if(document.getElementById("size").value != ""){
            do_it = true;
            com_list.push({"key":"courses_size","value":Number(document.getElementById("size").value),
                           "comparator":document.getElementById("comparator_1").value})
        }
    }
}


function submit(AndOr, form) {  
    initial(form,AndOr);
    var query={};
    query["WHERE"]={};
    query["OPTIONS"]={};
    query["OPTIONS"]["COLUMNS"]=[];
    query["OPTIONS"]["FORM"]="TABLE";
    setupWHERE(AndOr,query);
    setupCOLUMNS(query);
    setupORDER(query);
    if(distance_f != ""){
        query["EXTRA"]=distance_f;
    };

    console.log(JSON.stringify(query));
    updateText(JSON.stringify(query),form,offset);
}

function setupORDER(query){
    if(order_by.value!=""){
        query["OPTIONS"]["ORDER"]={};
        query["OPTIONS"]["ORDER"]["dir"]= order_dir.value;
        query["OPTIONS"]["ORDER"]["keys"]= [];
        for (var i = 0; i < order_by.options.length; i++) {
            if(order_by.options[i].selected){
                query["OPTIONS"]["ORDER"]["keys"].push(order_by.options[i].value);
            }
        }
    }
}

function setupCOLUMNS(query){
    if(res_colunm.value!=""){
        var multiple_sel=res_colunm;
        for (var i = 0; i < multiple_sel.options.length; i++) {
            if(multiple_sel.options[i].selected){
                query["OPTIONS"]["COLUMNS"].push(multiple_sel.options[i].value);
            }
        }
    }
}

function setupWHERE(AndOr,query){
    if(do_it){
        query["WHERE"][AndOr]=[];
        for(var i = 0;i < is_list.length;i++){
            if(is_list[i]["value"] != ""){
                var temp = {};
                temp["IS"]={};
                temp["IS"][is_list[i]["key"]]=is_list[i]["value"];
                query["WHERE"][AndOr].push(temp);
            }
        }

        for(var i = 0;i < com_list.length;i++){
            if(com_list[i]["value"] != ""){
                var temp = {};
                temp[com_list[i]["comparator"]]={};
                temp[com_list[i]["comparator"]][com_list[i]["key"]]=com_list[i]["value"];
                query["WHERE"][AndOr].push(temp);
            }
        }
    }
}



