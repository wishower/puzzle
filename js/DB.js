//连接数据库
function DBConn(){
     db = openDatabase('mudb_game_puzzle', '1.0', 'Game DB', 1024 * 1024);	
	 db.transaction(function (tx) {
     tx.executeSql('CREATE TABLE IF NOT EXISTS user_Info (user_name unique,user_password,user_score,user_step,user_time)');
     tx.executeSql('INSERT INTO  user_Info (user_name ,user_password,user_score,user_step,user_time) VALUES ("root","123456","1000","1","1")');
     });	
	 
	//打印当前所有用户信息 
	db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM user_Info', [], function (tx, results) {
    var len = results.rows.length, i;
    for (i = 0; i < len; i++){
		    var userInfo_all=new Array();
			userInfo_all.push(results.rows.item(i).user_name);
	        userInfo_all.push(results.rows.item(i).user_password);
	        userInfo_all.push(results.rows.item(i).user_score);
			userInfo_all.push(results.rows.item(i).user_step);
			userInfo_all.push(results.rows.item(i).user_time);
			console.log(userInfo_all);
        }
      }, null);
   });
}

//登录
function logDB(tip,user_name,user_password){
	db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM user_Info', [], function (tx, results) {
    var len = results.rows.length, i;
    for (i = 0; i < len; i++){
		var result_name=results.rows.item(i).user_name;
		var result_password=results.rows.item(i).user_password;
		var result_score=results.rows.item(i).user_score;
		if(user_name==result_name&&user_password==result_password){
			console.log("登录成功！");
			userInfo_list=new Array();
			userInfo_list.push(results.rows.item(i).user_name);
	        userInfo_list.push(results.rows.item(i).user_password);
	        userInfo_list.push(results.rows.item(i).user_score);
			userInfo_list.push(results.rows.item(i).user_step);
			userInfo_list.push(results.rows.item(i).user_time);
			console.log(userInfo_list);
		tip.visible=false;
		console.log(tip.visible);
	    myWindow.remove();	
	    isSoundOff = false;
		backSound.play(0);
		beginningLayer.remove();
		addLevelUI();
		addNavUI();	     
console.log(isOfflevel);   		
		break;
		}else{
			console.log("错误");
			tip.visible=true;
		}
        }
      }, null);
   });
}

//注册
function registerDB(tip,user_name,user_password1,user_password2){	
if(user_name!=""&&user_password1!=""&&user_password2!=""){
	db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM user_Info', [], function (tx,results) {
	var isSame=false;
		
    var len = results.rows.length, i;
    for (i = 0; i < len; i++){
		var result_name=results.rows.item(i).user_name;
		var result_password=results.rows.item(i).user_password;
		var result_score=results.rows.item(i).user_score;
		if(user_name==result_name){
		    tip.text="用户名已存在";
			isSame=true;
		   break;
		 }
    }
		
	if(isSame==false){
		 if(user_password1!=user_password2){
			  tip.text="两次输入的密码不同";
		    }else{
			  InsertDB(user_name,user_password1);
			  myWindow.remove();
			  addLogWindow();
	        }
	 }		
   }, null);
  });
 }
}

//插入用户信息
function InsertDB(user_name1,user_password1){
	db.transaction(function (tx) {
		var sql='INSERT INTO user_Info (user_name,user_password,user_score,user_step,user_time) VALUES ("'+user_name1+'","'+user_password1+'","0","","")';
       tx.executeSql(sql);	  	   
     });
	 
	//打印当前所有用户信息
	 db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM user_Info', [], function (tx, results) {
    var len = results.rows.length, i;
    for (i = 0; i < len; i++){
		    var userInfo_all=new Array();
			userInfo_all.push(results.rows.item(i).user_name);
	        userInfo_all.push(results.rows.item(i).user_password);
	        userInfo_all.push(results.rows.item(i).user_score);
			userInfo_all.push(results.rows.item(i).user_step);
			userInfo_all.push(results.rows.item(i).user_time);
			console.log(userInfo_all);
        }
      }, null);
   });
}


//修改用户信息
function UpdateDB(score,step,time,name){
	db.transaction(function (tx) {
	var sql='UPDATE user_Info SET user_score="'+score+'" ,user_step="'+step+'" ,user_time="'+time+'" WHERE user_name="'+name+'"';
   tx.executeSql(sql);
});

	db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM user_Info', [], function (tx, results) {
    var len = results.rows.length, i;
    for (i = 0; i < len; i++){
		if( results.rows.item(i).user_name==name){
		    userInfo_list=new Array();
			userInfo_list.push(results.rows.item(i).user_name);
	        userInfo_list.push(results.rows.item(i).user_password);
	        userInfo_list.push(results.rows.item(i).user_score);
			userInfo_list.push(results.rows.item(i).user_step);
	        userInfo_list.push(results.rows.item(i).user_time);
			console.log(userInfo_list);
		 }
        }
      }, null);
   });
}
