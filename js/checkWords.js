
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
 
 /**
 * localStorageの取得
 */
 function getLocalStorage(){
 	let words = localStorage.getItem("words");
	let wordsArr = [];
	let tmpArr = [];
 	if (words){
 		words = words.split(",");
		for (let i=0; words.length>i; i++){
			if (tmpArr.length<2){
				tmpArr.push(words[i]); 
			}else {
				wordsArr.push(tmpArr);
				tmpArr = [];
				tmpArr.push(words[i]); 
			}
			if (i+1==words.length){
				wordsArr.push(tmpArr);
			}
		}
		setCheckWords(wordsArr);
 	}	
 }
 getLocalStorage()

});


/**
* CSVから設定値の取得
*/
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
	let wordsArray = getWordsFromCsv();
	setCheckWords(wordsArray);
  }
});

/**
 * 表記揺れ対象文字列のhtml作成
 */
function setCheckWords(array){

	let wordList = document.getElementById("wordList");
	while (wordList.firstChild){
		wordList.removeChild(wordList.firstChild);
	}

	let ul = document.createElement("ul");
	ul.classList.add("checkWords");

	//表記揺れ対象文字表示
	for (let i=0; array.length>i; i++) {

		ul = document.createElement("ul");
		ul.classList.add("checkWords");
		let arrow = document.createElement("li");
		arrow.innerText = "←";
		arrow.classList.add("arrow");

		for (let m=0; array[i].length>m; m++){
			let li = document.createElement("li");
			
			//対象文字入力用input作成
			let input = document.createElement("input");
			input.type = "text";
			input.setAttribute("name","chkwd");

			if (m==0){
				li.classList.add("changedWord");
				input.value = array[i][m];
				input.readOnly = true;
				input.setAttribute("name","chgwd");
			}else {
				li.classList.add("checkWord");
				input.value = array[i][m];
				ul.appendChild(arrow);
			}
			li.appendChild(input);
			ul.appendChild(li);
			wordList.append(ul);
		}
	}
}

/**
 * CSVの値を配列化
 */
function getWordsFromCsv(){
	let tmpArr = [];
	let checkWordsArray = [];
	
	for (const array of checkWords){
		for (let i=0; array.length>i; i++){
			if (i>0 && array[i]!==""){
				tmpArr.push(array[0]);
				tmpArr.push(array[i]);
				checkWordsArray.push(tmpArr);
			}
			tmpArr = [];
		}
	}
	return checkWordsArray
}

/**
 * 表記揺れ対象文字列の取得
 */
function getCheckWords(){
	let checkWordsArray = [];
	
	for (const array of checkWords){
		for (let i=0; array[i].length>i; i++){
			if (i!==0 && array[i]!==""){
				checkWordsArray.push(array[i]);
			}
		}
		
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
 * 該当箇所のハイライト
 */
let check = document.getElementById("check")
check.addEventListener("click",function(){
	let text = document.getElementById("text").value;
	let checkWordsArray = getInputCheckWords();
	for( let word of checkWordsArray ){
		let regexp = new RegExp(`(${word})`, 'g')
		text = text.replace(regexp, '<span class="highlight">$1</span>')
	}
	text = text.replace(new RegExp(/\n/||/\r/||/\r\n/, 'g'), '<br/>');
	
	if (text!==""){
		let result = document.getElementById("result")
		result.innerHTML = text
		result.style.display = "block"
	}

	localStorage.setItem("words", getWordsFromCsv());
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
