
let checkWords;

$(document).ready(function(){

 /**
 * ファイルリストの取得
 */
 var xmlhttp = new XMLHttpRequest();
 xmlhttp.onreadystatechange = function() {
 	if (xmlhttp.readyState == 4) {
 		if (xmlhttp.status == 200) { 
 			var elem = document.getElementById("linkList");
 			
 			var textContent = xmlhttp.responseText.split('\r\n');
 			for (let i=0; textContent.length>i; i++){
				if (textContent[i]!==""){
					textContent[i] = textContent[i].split(',');
				}
 			}
 					 			
 			for (let i=0; textContent.length>i; i++){
				if (textContent[i]!==""){
					if ( i%3==0 ){
						var linkList = document.createElement("ul");
 						linkList.classList.add("linkList");
					}
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
					
					if ( (i-1)%3==0 || i-1==textContent.length){
						elem.appendChild(linkList);
					}
				}	
			}
 			    		
    	} else {
    		alert("status = " + xmlhttp.status);
    	}
 	} 
 }
 xmlhttp.open("GET", "./text/fileList.txt");
 xmlhttp.send();
 
 
});


/**
* CSVから設定値の取得
*/
//$("#uplodFile").change(function(evt){
var upload = document.getElementById("uploadFile")
upload.addEventListener("change",function(evt){
  var file = evt.target.files;

  //FileReaderの作成
  var reader = new FileReader();
  //テキスト形式で読み込む
  reader.readAsText(file[0]);
  
  //読込終了後の処理
  reader.onload = function(ev){
  	checkWords = reader.result;
  	checkWords = checkWords.split('\r\n');
  	for (let i=0; checkWords.length>i; i++) {
		checkWords[i] = checkWords[i].split(',');
	}
	let checkWordsArray = getCheckWords();
	
	let wordList = document.getElementById("wordList");
	while (wordList.firstChild){
		wordList.removeChild(wordList.firstChild);
	}
	
	let ul = document.createElement("ul");
	ul.classList.add("checkWords");
	//表記揺れ対象文字表示
	for (let i=0; checkWordsArray.length>i; i++) {
		if (i%6==0){
			ul = document.createElement("ul");
			ul.classList.add("checkWords");
		}
		let li = document.createElement("li");
		
		//対象文字入力用input作成
		let input = document.createElement("input");
		input.type = "text";
		input.setAttribute("name","chkwd");
		input.value = checkWordsArray[i];
		
		li.appendChild(input);
		ul.appendChild(li);
		
		if ((i+1)%6==0 || i+1==checkWordsArray.length){
			wordList.append(ul);
		}
		
	}
  }
});

/**
 * 表記揺れ対象文字列の取得
 */
function getCheckWords(){
	let checkWordsArray = [];
	
	for (const array of checkWords){
		if(array[0]!==""){
			checkWordsArray.push(array[0])
		}
		//console.log(array[0])
	}
	return checkWordsArray
}

/**
 * 表記揺れ対象文字列の取得（input値）
 */
function getInputCheckWords(){
	let checkWordsArray = [];
	let inputVal = document.getElementsByName("chkwd");
	for (const elem of inputVal){
		if(elem.value!==""){
			checkWordsArray.push(elem.value)
		}
	}
	return checkWordsArray
}

/**
 * 検索結果で該当箇所を黄色でハイライトする.
 */
let check = document.getElementById("check")
check.addEventListener("click",function(){
	let text = document.getElementById("text").value;
	let checkWordsArray = getInputCheckWords();
	for( let word of checkWordsArray ){
		let regexp = new RegExp(`(${word})`, 'gi')
		text = text.replace(regexp, '<span class="highlight">$1</span>')
	}
	text = text.replace(new RegExp(/\n/||/\r/||/\r\n/, 'g'), '<br/>');
	
	if (text!==""){
		let result = document.getElementById("result")
		result.innerHTML = text
		result.style.display = "block"
	}
});

/**
 *  対象テキスト削除
 */
let clear = document.getElementById("clear")
clear.addEventListener("click",function(){
	document.getElementById("text").value = ""
	document.getElementById("result").textContent	 = ""
	document.getElementById("result").style.display = "none"
});
