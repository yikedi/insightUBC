function updateText(query,form,offset) {
    var count = 0;
    var http = new XMLHttpRequest();    
    var target_result = document.getElementById("result");  
    var result_head = document.getElementById("result_head");
    var result_body = document.getElementById("result_body");
    if(form == "rooms"){
        target_result = document.getElementById("result_rooms"); 
        result_head = document.getElementById("result_head_rooms");
        result_body = document.getElementById("result_body_rooms");
    }
    if(form =="schedule"){
        target_result = document.getElementById("result_s"); 
        result_head = document.getElementById("result_head_s");
        result_body = document.getElementById("result_body_s");
    }
    http.onreadystatechange = function () {
        console.log(count++);
        if(http.readyState == 1){
            if(form =="schedule"){
                target_result.setAttribute("class","col-sm-12 panel panel-warning");
            }else{
                target_result.setAttribute("class","panel panel-warning");
            }
            result_head.innerHTML = "Result";
            result_body.innerHTML = "loading";
        }
        if (http.readyState == 4 && http.status == 200) {
            var response = ""; 
            if(form =="schedule"){
                response = JSON.parse(http.response);
            }else{
                response = JSON.parse(http.response)["result"];
            }
            var length = response.length;
            var return_html = document.createElement("table"); 
            if(form =="schedule"){
                target_result.setAttribute("class","col-sm-12 panel panel-success");
            }else{
                target_result.setAttribute("class","panel panel-success");
            }

            var tr;
            if(length > 0){
                keys = Object.keys(response["0"]);
                for(var i = 0; i < keys.length; i++){
                    if(i == 0){
                        tr = document.createElement('tr');
                    }
                    var th = document.createElement("th");
                    th.innerHTML = keys[i];
                    tr.appendChild(th);
                }
                return_html.appendChild(tr);
                for(var j = 0; j < length; j++){
                    for(var i = 0; i < keys.length; i++){
                        if(i == 0){
                            tr = document.createElement('tr');
                        }
                        var th = document.createElement("th");
                        th.innerHTML = response[j][keys[i]];
                        tr.appendChild(th);
                    }
                    return_html.appendChild(tr);
                }
                result_body.innerHTML = '';
                result_body.appendChild(return_html);
            }else{
                result_body.innerHTML = '';
                result_body.innerHTML = "no result";
            }
        }else if(http.readyState == 4 && http.status != 200){
            if(form =="schedule"){
                target_result.setAttribute("class","col-sm-12 panel panel-danger");
            }else{
                target_result.setAttribute("class","panel panel-danger");
            }
            result_body.innerHTML = '';
            result_body.innerHTML = http.statusText + ":  "+http.responseText;
        }
    };
    http.open("POST","http://localhost:4321/query"+offset,true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(query);
};