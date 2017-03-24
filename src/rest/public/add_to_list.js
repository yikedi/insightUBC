function add_to_list(query,form,offset) {
    var http = new XMLHttpRequest();    
    var return_html = document.getElementById("course_in_list"); 
    var header = "Courses Name";
    if(form == "query_get_allrooms"){
        return_html = document.getElementById("room_in_list");
        header = "Room Name";
    }
    return_html.innerHTML="";
    var tr;
    tr = document.createElement('tr');
    var th = document.createElement("th");
    th.innerHTML = header;
    tr.appendChild(th);
    return_html.appendChild(tr);
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            //console.log(http.response);
            var response = JSON.parse(http.response)[0]["body"];
            var length = response.length;
            for(var j = 0; j < length; j++){
                tr = document.createElement('tr');
                th = document.createElement("td");
                if(form =="query_get_allrooms"){
                    th.innerHTML = response[j]["rooms_name"];
                }
                if(form =="get_courses_allcourse"){
                    th.innerHTML = response[j]["course_name"];
                }

                tr.appendChild(th);
                return_html.appendChild(tr);
            }

        }
    }

    http.open("POST","http://localhost:4321/query"+offset,true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify(query));
};

function add_single_course(){
    var dept ="";
    var courses_id ="";
    if(document.getElementById("dept_s").value!=""){
        dept = document.getElementById("dept_s").value.toLowerCase(); 
    }
    if(document.getElementById("cid_s").value!=""){
        courses_id = document.getElementById("cid_s").value; 
    }
    var offset_single="";
    var data = "";
    if(dept != "" && courses_id != ""){
        offset_single = "_get_courses_byname";
        data = {"course_name":[dept +"_"+courses_id]};
    }else if (dept != ""){
        offset_single = "_get_courses_bydept";
        data = {"course_dept":dept};
    }
    add_to_list(data,"get_courses_allcourse",offset_single);

}

function add_single_room(){
    var distance="";
    var Building_name ="";
    var Room_number ="";
    if(document.getElementById("distance_s").value!=""){
        distance = Number(document.getElementById("distance_s").value); 
    }
    if(document.getElementById("building_s").value!=""){
        Building_name = document.getElementById("building_s").value.toUpperCase(); 
    }
    if(document.getElementById("rooms_nums").value!=""){
        Room_number = document.getElementById("rooms_nums").value.toUpperCase();
    }
    var offset_single_r="";
    var data = "";
    
    if(distance!="" && Building_name != ""){
        offset_single_r = "_get_rooms_bydistance";
        data = {"distance":distance,"building":Building_name};
    }else if (Building_name != "" && Room_number!=""){
        offset_single_r = "_get_rooms_byname";
        data = {"rooms_list":[Building_name+"_"+Room_number]};
    }else if (Building_name != ""){
        offset_single_r = "_get_rooms_bybuilding";
        data = {"rooms_shortname":Building_name};
    }
    add_to_list(data,"query_get_allrooms",offset_single_r);

}