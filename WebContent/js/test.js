
$(document).ready(function(){

 /**
 * ファイルリストの取得
 */
 var xmlhttp = new XMLHttpRequest();
 xmlhttp.onreadystatechange = function() {
 	if (xmlhttp.readyState == 4) {
 		if (xmlhttp.status == 200) { 
 			var elem = document.getElementById("linkList");
 			
 			var textContent = xmlhttp.responseText.split('\n');
 			for (let i=0; textContent.length>i; i++){
 				textContent[i] = textContent[i].replace('\r','').split(',');
 			}
 			
 			var linkList = document.createElement("ul");
 			linkList.classList.add("linkList");
 			
 			for (let i=0; textContent.length>i; i++){
				var li = document.createElement("li");
				li.classList.add("linkWrap");
				var linkNmDiv = document.createElement("div");
				linkNmDiv.classList.add("linkNm");
				var linkNm = document.createTextNode(textContent[i][0]);
				linkNmDiv.appendChild(linkNm);
				var link = document.createElement("a");
				link.classList.add("link");
				link.href = "./csv/" + textContent[i][1];
				link.download = textContent[i][1];
				link.target = "_blank";
				link.innerText = textContent[i][1];
				
				li.appendChild(linkNmDiv);
				li.appendChild(link);
				linkList.appendChild(li);
 			}
 			
    		elem.appendChild(linkList);
    		
    	} else {
    		alert("status = " + xmlhttp.status);
    	}
 	} 
 }
 xmlhttp.open("GET", "./text/fileList.txt");
 xmlhttp.send();
 
 
});