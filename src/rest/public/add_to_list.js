function add_to_list(query,form,offset) {
    var http = new XMLHttpRequest();    
    var return_html = document.getElementById("course_in_list"); 
    if(form =="query_get_allrooms"){
        return_html = document.getElementById("room_in_list"); 
    }

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            console.log(http.response);
            //            var response = JSON.parse(http.response)["result"];
            //            var length = response.length;
            //            var tr;
            //            for(var j = 0; j < length; j++){
            //                for(var i = 0; i < keys.length; i++){
            //                    if(i == 0){
            //                        tr = document.createElement('tr');
            //                    }
            //                    var th = document.createElement("th");
            //                    th.innerHTML = response[j][keys[i]];
            //                    tr.appendChild(th);
            //                }
            //                return_html.appendChild(tr);
            //            }
        }
    };
        console.log(query);
    http.open("POST","http://localhost:4321/query"+offset,true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(query);
};