/** 初始化游戏 */
LInit(10, "mygame", 390,600, main);

/*****全局变量*****/
/** 系统图片 */
var imgBmpd;
var img_back_begin;
var img_tip;
var img_bg;
var img_bg_start;
var img_bg_level;
var img_sound_off;
var img_sound_on;
var img_level_normal;
var img_level_up;
var img_reset;
var img_return;
var img_user_Pic;
var img_userInfo_normal;
var img_userInfo_up;
var imgData;  //加载图片列表
var imglist={};//存储图片结果集
var showlist=new Array();//存储LBitmapData的列表
var starlist=new Array();
var nowPic_index;//当前关卡的图片id

/** 音乐 */
//背景音乐
var isSoundOff; //是否关闭音乐
var backSound; //音乐对象
var backUrl;  //音乐地址
var nowTime_Sound; //当前音乐播放时间
//拼图点击音乐
var blockClickSound; //音乐对象
var blockClickUrl;  //音乐地址
var isClick;

/** 游戏判断 */
var isGameOver; //是否游戏结束
var blockList; //拼图块列表
var startTime, time, timeTxt;//用时
var steps, stepsTxt; //步数
var nowTime;
var nowStep;
var nowScore,totalScore;
var level;//游戏等级(显示的拼图块数为：level*level)

/** 当前界面判断 */
var isOffGame; //是否在游戏中
var userInfo_btn;
var level_btn;

/** 游戏界面层 */
var stageLayer;
var beginningLayer;
var levelLayer;
var userInfoLayer;
var puzzleLayer;
var NavLayer;
var gameLayer,overLayer;
var myWindow; //当前弹出窗口

/**数据库 */
var db; //打开数据库
var userInfo_list;//用户信息列表


/*****游戏初始化方法*****/
//全局main函数
function main () {
	/** 全屏设置 */
	if (LGlobal.mobile) {
		LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
	}
	LGlobal.screen(LGlobal.FULL_SCREEN);

	/** 添加加载提示 */
	var loadingHint = new LTextField();
	loadingHint.text = "资源加载中……";
	loadingHint.size = 20;
	loadingHint.x = (LGlobal.width - loadingHint.getWidth()) / 2;
	loadingHint.y = (LGlobal.height - loadingHint.getHeight()) / 2;
	addChild(loadingHint);

	/** 加载游戏逻辑和系统图片 */
	LLoadManage.load(
		[   
			{path : "./js/Block.js"},
			{path : "./js/DB.js"},
			{name : "back_begin_img", path : "./images/back_begin.png"},
			{name : "tip_img", path : "./images/tip.png"},
			{name : "bg_start_img", path : "./images/bg_start.png"},
			{name : "bg_level_img", path : "./images/bg_level.jpg"},
			{name : "sound_on_img", path : "./images/sound_on.png"},
			{name : "sound_off_img", path : "./images/sound_off.png"},
			{name : "level_normal_img", path : "./images/level_normal.png"},
			{name : "level_up_img", path : "./images/level_up.png"},
			{name : "userInfo_normal_img", path : "./images/userInfo_normal.png"},
			{name : "userInfo_up_img", path : "./images/userInfo_up.png"},
			{name : "reset_img", path : "./images/reset.png"},
			{name : "return_img", path : "./images/return.png"},
			{name : "user_Pic_img", path : "./images/user_Pic.jpg"},	
            {name : "star3_img", path : "./images/star3.png"},
            {name : "star4_img", path : "./images/star4.png"},	
            {name : "star5_img", path : "./images/star5.png"}				
		],
		null,
		function (result) {

			/** 保存位图数据，方便后续使用 */
			img_back_begin = new LBitmapData(result["back_begin_img"]);
			img_tip = new LBitmapData(result["tip_img"]);
			img_bg_level = new LBitmapData(result["bg_level_img"]);
			img_bg_start = new LBitmapData(result["bg_start_img"]);
			img_sound_on = new LBitmapData(result["sound_on_img"]);
			img_sound_off = new LBitmapData(result["sound_off_img"]);
			img_level_normal = new LBitmapData(result["level_normal_img"]);
			img_level_up = new LBitmapData(result["level_up_img"]);
			img_userInfo_normal = new LBitmapData(result["userInfo_normal_img"]);
			img_userInfo_up = new LBitmapData(result["userInfo_up_img"]);
			img_reset = new LBitmapData(result["reset_img"]);
			img_return= new LBitmapData(result["return_img"]);
			img_user_Pic= new LBitmapData(result["user_Pic_img"]);
		    starlist.push(new LBitmapData(result["star3_img"]));	
			starlist.push(new LBitmapData(result["star4_img"]));
			starlist.push(new LBitmapData(result["star5_img"]));
		
		}
	);

    /**图片列表*/
    imgData= new Array(
			{name : "img1", path : "./images/1.jpg"},
			{name : "img2", path : "./images/2.jpg"},
			{name : "img3", path : "./images/3.jpg"},
			{name : "img4", path : "./images/4.jpg"},
			{name : "img5", path : "./images/5.jpg"},
			{name : "img6", path : "./images/6.jpg"},
			{name : "img7", path : "./images/7.jpg"},
			{name : "img8", path : "./images/8.jpg"},
			{name : "img9", path : "./images/9.jpg"}
	);

	/** 加载图片 */
	LLoadManage.load(
		imgData,
		null,
		function (result) {
			imglist=result;//获取读取完图片后的结果集
			/** 移除加载提示 */
			loadingHint.remove();

			/** 循环保存位图数据，方便后续使用 */          
            for(var i in imglist){
					showlist.push(new LBitmapData(imglist[i]));				
			}
			//游戏界面初始化
			gameInit();	

		}
	);
	
}

//游戏舞台初始化
function gameInit (e) {
	console.log(img_userInfo_normal);
	/** 初始化舞台层 */
	stageLayer = new LSprite();
	stageLayer.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#EFEFEF");
	addChild(stageLayer);	
	
	/** 初始化开始界面层 */
	beginningLayer = new LSprite();
	stageLayer.addChild(beginningLayer);
	
	/** 初始化用户信息层 */
    userInfoLayer = new LSprite();
	stageLayer.addChild(userInfoLayer);
	
	/** 初始化关卡层 */
    levelLayer = new LSprite();
	stageLayer.addChild(levelLayer);
	
	/** 初始化游戏层 */
	puzzleLayer = new LSprite();
	stageLayer.addChild(puzzleLayer);
	
	/** 初始化导航栏层 */
	NavLayer = new LSprite();
	stageLayer.addChild(NavLayer);
		
	/** 初始化音乐 */
	//背景音乐
	isSoundOff=true;
	backSound = new LSound();
   	addBackSound();
	//拼图点击音乐
	isClick = false;
	blockClickSound = new LSound();	
	addBlockClickSound();
	
	/** 初始化当前界面设定 */
	isOffGame =true;
	isOfflevel=true;
	isOffUserInfo=true;
		
	/** 添加开始界面 */
	addBeginningUI();
	
	//循环检测
	stageLayer.addEventListener(LEvent.ENTER_FRAME, onFrame);
}

//初始化游戏界面数据
function startGame() {
	isGameOver = false;

	/** 初始化时间，步数和分数 */
	startTime = (new Date()).getTime();
	time = 0;
	steps = 0;
	nowScore =100;
	/** 初始化拼图块列表 */
	initBlockList();
	/** 打乱拼图 */
	getRandomBlockList();
	/** 显示拼图 */
	showBlock();
	/** 显示提示 */
	showTip();
	/** 显示时间 */
	addTimeTxt();
	/** 显示步数 */
	addStepsTxt();
    
	//循环检测游戏时长和背景音乐
	stageLayer.addEventListener(LEvent.ENTER_FRAME, onFrame);
}


/** 游戏界面 */
//开始界面
function addBeginningUI () {
	isOffGame =true;
	isOffUserInfo=true;
    isOfflevel=true;
	
	userInfo_list=new Array();
	
	/** 界面背景 */
	beginningLayer.graphics.beginBitmapFill(img_bg_start);
	beginningLayer.graphics.drawRect(3, "#87CEEB", [0, 0, img_bg_start.width, img_bg_start.height], true, "");
    beginningLayer.scaleX=0.53;
	beginningLayer.scaleY=0.53;

	/** 游戏标题 */
	var title = new LTextField();
	title.text = "拼图游戏";
	title.size = 80;
	title.weight = "bold";
	title.x = LGlobal.width / 2+20;
	title.y =400;
	title.color = "#87CEEB";
	title.lineWidth = 6;
	title.lineColor = "#FFFFFF";
	title.stroke = true;
	beginningLayer.addChild(title);
    	
    /** 登录按钮*/
	getLogButton();

    stageLayer.addChild(beginningLayer);
}

//关卡界面
function addLevelUI(){	
   isOffGame =true;
   isOffUserInfo=true;
   isOfflevel=false;  
   
    /** 界面背景 */
	var back =new LShape();
	back.graphics.beginBitmapFill(img_bg_level);
	back.graphics.drawRect(0,"" , [0,96, img_bg_level.width, img_bg_level.height-175], true, "");
	back.scaleX = 0.52;
	back.scaleY = 0.52;
	levelLayer.addChild(back);

	stageLayer.addChild(levelLayer);

    //循环显示所有图片按钮
	for(var i=0;i<showlist.length;i++){
		var btn=getButton(i);
		btn.x=Math.floor((i%3))*120+25;
	    btn.y=Math.floor((i/3))*120+145;
		
		//序号
	    var btn_no = new LTextField();
	    btn_no.text = i+1;
	    btn_no.weight = "bold";
	    btn_no.stroke = true;
	    btn_no.lineWidth = 3;
	    btn_no.lineColor = "#87CEEB";
	    btn_no.size = 30;
	    btn_no.color = "#FFFFFF";
		btn_no.x=Math.floor((i%3))*120+70;
	    btn_no.y=Math.floor((i/3))*120+175;
		
		//等级
		var star_index=(i/3)>>>0;
		var star = new LBitmap(starlist[star_index]);
		star.scaleX=0.65;
		star.scaleY=0.65;
	    star.x=Math.floor((i%3))*120+45;
	    star.y=Math.floor((i/3))*120+220;

	
       levelLayer.addChild(btn);
	   levelLayer.addChild(btn_no);
	   levelLayer.addChild(star);
	 }
}

//初始化导航栏
function addNavUI(){
	var topNav=addTopUI();
    var bottomNav =addBottomUI();
	NavLayer.addChild(topNav);
	NavLayer.addChild(bottomNav); 
	
	stageLayer.addChild(NavLayer);
	
	//循环监听按钮状态
	NavLayer.addEventListener(LEvent.ENTER_FRAME, CurrentImgBtn);
}

//顶部导航栏界面
function addTopUI(){
	var topLayer = new LSprite();	
	topLayer.graphics.drawRect(0, "", [0,0, LGlobal.width, 50], true, "#87CEEB");

     //返回开始界面按钮	 
	 var backBegin_btn =getBackBeginButton();
	 topLayer.addChild(backBegin_btn);

	return topLayer;
}

//底部导航栏界面
function addBottomUI(){
	var bottomLayer = new LSprite();
	bottomLayer.graphics.drawRect(0, "", [0, 550, LGlobal.width, 50], true, "#87CEEB");
	stageLayer.addChild(bottomLayer);
	 
	/**按钮 */
	var sound_btn=getSoundSet();
	bottomLayer.addChild(sound_btn);
	var level_btn=getLevelSet();
	bottomLayer.addChild(level_btn);
	var user_btn=getUserInfo();
	bottomLayer.addChild(user_btn);	
	
	return bottomLayer;
}

//游戏界面
function addPuzzleUI(){
	isOffGame =false;
    isOfflevel=true;
	isOffUserInfo=true;
	
	//添加游戏界面和信息界面
    puzzleLayer = new LSprite();
    overLayer = new LSprite();
	gameLayer = new LSprite();
	puzzleLayer.addChild(gameLayer);
	puzzleLayer.addChild(overLayer);
	
    //绘制背景	
	puzzleLayer.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#FFB6C1");
	
	stageLayer.addChild(puzzleLayer);	

    //添加按钮
    var return_btn =  getReturnButton();
    puzzleLayer.addChild(return_btn);		
	var reset_btn = getResetButton();
	puzzleLayer.addChild(reset_btn);
}

//用户信息界面
function addUserUI(){	
	isOffGame =true;
	isOffUserInfo=false;
    isOfflevel=true;
	isOfflevel=true;
	
	//绘制背景
	var backImg = new LShape();
	backImg.graphics.drawRect(0, "", [0, 50, LGlobal.width, LGlobal.height-100], true, "#EFEFEF");
	userInfoLayer.addChild(backImg);
	
	stageLayer.addChild(userInfoLayer);	
	
	/**用户信息 */
	//绘制头像
	var UserPic =new LShape();
	UserPic.graphics.beginBitmapFill(img_user_Pic);
	UserPic.graphics.drawArc(0, "#87CEEB",[420,400,400,0,Math.PI*2],true,"");
    UserPic.scaleX=0.12;
	UserPic.scaleY=0.12;
	UserPic.x=(LGlobal.width-80)/2;
	UserPic.y=100;
	userInfoLayer.addChild(UserPic);

	//昵称
	var userName = new LTextField();
	userName.text = userInfo_list[0];
	userName.size =20;
	userName.weight = "bold";
	userName.x =(LGlobal.width-20)/2;
	userName.y =200;
	userName.color = "#87CEEB";
	userName.lineWidth =2;
	userName.lineColor = "#FFFFFF";
	userName.stroke = true;
	userInfoLayer.addChild(userName);
	
    /** 游戏记录 */	
	//游戏分数
	var usedScoreTxt = new LTextField();
	usedScoreTxt.text = "total score:  "+userInfo_list[2];
	usedScoreTxt.size = 20;
	usedScoreTxt.stroke = true;
	usedScoreTxt.lineWidth = 2;
	usedScoreTxt.lineColor = "#555555";
	usedScoreTxt.color = "#FFFFFF";
	usedScoreTxt.x =(LGlobal.width-100)/2;
	usedScoreTxt.y = 250;
	userInfoLayer.addChild(usedScoreTxt);
	
	//游戏步数
	var usedStepsTxt = new LTextField();
	usedStepsTxt.text ="last step:  "+userInfo_list[3];
	usedStepsTxt.size = 20;
	usedStepsTxt.stroke = true;
	usedStepsTxt.lineWidth = 2;
	usedStepsTxt.lineColor = "#555555";
	usedStepsTxt.color = "#FFFFFF";
	usedStepsTxt.x =(LGlobal.width-100)/2;
	usedStepsTxt.y = 300;
	userInfoLayer.addChild(usedStepsTxt);
	
	//游戏用时
	var usedTimeTxt = new LTextField();
	usedTimeTxt.text = "last time:  "+ userInfo_list[4];
	usedTimeTxt.size = 20;
	usedTimeTxt.stroke = true;
	usedTimeTxt.lineWidth = 2;
	usedTimeTxt.lineColor = "#555555";
	usedTimeTxt.color = "#FFFFFF";
	usedTimeTxt.x =(LGlobal.width-100)/2;
	usedTimeTxt.y = 350;
	userInfoLayer.addChild(usedTimeTxt);
}

//游戏结束界面
function gameOver () {
	isGameOver = true;
	
	//计算成绩
	nowScore=nowScore-parseInt(steps/10);
	if(nowScore<=0){
		nowScore=0;
	}
		
    //创建界面
	var resultLayer = new LSprite();
	resultLayer.filters = [new LDropShadowFilter()];
	resultLayer.graphics.drawRoundRect(3, "#BBBBBB", [0, 0, 350, 350, 5], true,"#DDDDDD");
	resultLayer.x = (LGlobal.width - resultLayer.getWidth()) / 2;
	resultLayer.y = LGlobal.height / 2;
	resultLayer.alpha = 0;
	overLayer.addChild(resultLayer);

	var title = new LTextField();
	title.text = "游戏通关";
	title.weight = "bold";
	title.stroke = true;
	title.lineWidth = 3;
	title.lineColor = "#555555";
	title.size = 30;
	title.color = "#FFFFFF";
	title.x = (resultLayer.getWidth() - title.getWidth()) / 2;
	title.y = 30;
	resultLayer.addChild(title);
    
	var ScoreTxt = new LTextField();
	ScoreTxt.text = "本关成绩：" + nowScore;
	ScoreTxt.size = 20;
	ScoreTxt.stroke = true;
	ScoreTxt.lineWidth = 2;
	ScoreTxt.lineColor = "#555555";
	ScoreTxt.color = "#FFFFFF";
	ScoreTxt.x = (resultLayer.getWidth() - ScoreTxt.getWidth()) / 2;
	ScoreTxt.y = 120;
	resultLayer.addChild(ScoreTxt);

	var usedTimeTxt = new LTextField();
	usedTimeTxt.text = "游戏用时：" + getTimeTxt(time);
	usedTimeTxt.size = 20;
	usedTimeTxt.stroke = true;
	usedTimeTxt.lineWidth = 2;
	usedTimeTxt.lineColor = "#555555";
	usedTimeTxt.color = "#FFFFFF";
	usedTimeTxt.x = (resultLayer.getWidth() - usedTimeTxt.getWidth()) / 2;
	usedTimeTxt.y = 160;
	resultLayer.addChild(usedTimeTxt);

	var usedStepsTxt = new LTextField();
	usedStepsTxt.text = "所用步数：" + steps;
	usedStepsTxt.size = 20;
	usedStepsTxt.stroke = true;
	usedStepsTxt.lineWidth = 2;
	usedStepsTxt.lineColor = "#555555";
	usedStepsTxt.color = "#FFFFFF";
	usedStepsTxt.x = usedTimeTxt.x;
	usedStepsTxt.y = 200;
	resultLayer.addChild(usedStepsTxt);

	var hintTxt = new LTextField();
	hintTxt.text = "- 点击屏幕重新开始 -";
	hintTxt.size = 23;
	hintTxt.stroke = true;
	hintTxt.lineWidth = 2;
	hintTxt.lineColor = "#888888";
	hintTxt.color = "#FFFFFF";
	hintTxt.x = (resultLayer.getWidth() - hintTxt.getWidth()) / 2;
	hintTxt.y = 260;
	resultLayer.addChild(hintTxt);

	LTweenLite.to(resultLayer, 0.5, {
		alpha : 0.7,
		y : (LGlobal.height - resultLayer.getHeight()) / 2,
		onComplete : function () {
			/** 点击界面重新开始游戏 */
			stageLayer.addEventListener(LMouseEvent.MOUSE_UP, function () {
				gameLayer.removeAllChild();
				overLayer.removeAllChild();

				stageLayer.removeAllEventListener();

				startGame();
			});
		}
	});
		
	//记录当前分数	
	nowTime = getTimeTxt(time);
	nowStep = steps;
	totalScore = parseInt(userInfo_list[2])+nowScore;
	UpdateDB(totalScore,nowStep,nowTime,userInfo_list[0]);
}

/** 按钮类 */
//自定义图片按钮类
function getButton(i){	
	var btnImg=showlist[i];	 
	
	//up
    var btnUPLayer=new LSprite();
	//绘制圆形图片
	btnUPLayer.graphics.beginBitmapFill(btnImg);
	btnUPLayer.graphics.drawArc(0, "#87CEEB",[420,400,400,0,Math.PI*2],true,"");
    btnUPLayer.scaleX=0.12;
	btnUPLayer.scaleY=0.12;	
	//遮罩
    btnUPLayer.graphics.drawArc(0, "",[420,400,430,0,Math.PI*2],true,"#EFEFEF");
	
	//over
    var btnOVERLayer = btnUPLayer.clone();
	btnOVERLayer.alpha=0.5;
	
	var btn =new LButton(btnUPLayer,btnOVERLayer);
	btn.name=i;

    //添加点击事件
	btn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		addAskWindow(i);
		//当前关卡分数
		var addLevel=(i/3)>>>0;
		level=3 +addLevel;//等级
		if(addLevel==0){
			nowScore=100;
		}else if(addLevel==1){
			nowScore=1000;
		}else if(addLevel==2){
			nowScore=10000;
		}
		
		console.log(nowScore);
		}
	    );
	return btn;
}

//返回开始界面按钮类
function getBackBeginButton(){
	var btnUp=new LBitmap(img_back_begin);
	btnUp.scaleX = 40/img_back_begin.width;
	btnUp.scaleY = 40/img_back_begin.height;
	
	var btnOver=btnUp.clone();
	btnOver.alpha=0.5;

	var btn =new LButton(btnUp,btnOver);
    btn.x =10;
	btn.y =5;

	btn.addEventListener(LMouseEvent.MOUSE_UP, function () {
		levelLayer.remove();
		/** 添加开始界面 */
	    addBeginningUI();
	    backSound.close();
		}
	    );
		
	return btn;
}

//重置按钮类
function getResetButton(){
	var btnUp=new LBitmap(img_reset);
	btnUp.scaleX = 60/img_reset.width;
	btnUp.scaleY = 60/img_reset.height;
	
	var btnOver=btnUp.clone();
	btnOver.alpha=0.5;

	var btn =new LButton(btnUp,btnOver);
	btn.x =320;
	btn.y =535;

	btn.addEventListener(LMouseEvent.MOUSE_UP, function () {
	   isOffGame=true;
	   puzzleLayer.remove();
       imgBmpd=showlist[nowPic_index];
	   addPuzzleUI();
	   startGame();
		}
	    );
		
	return btn;
}

//返回关卡界面按钮类
function getReturnButton(){
	var btnUp=new LBitmap(img_return);
	btnUp.scaleX = 60/img_reset.width;
	btnUp.scaleY = 60/img_reset.height;
	
	var btnOver=btnUp.clone();
	btnOver.alpha=0.5;

	var btn =new LButton(btnUp,btnOver);
	btn.x =20;
	btn.y =535;

	btn.addEventListener(LMouseEvent.MOUSE_UP, function () {
          	/** 添加关卡界面 */
		   levelLayer.remove();
		   userInfoLayer.remove();
		   puzzleLayer.remove();
	       addLevelUI();
		   addNavUI();
		}
	    );
		
	return btn;
}

//登录按钮类
function getLogButton(){
	//按钮形状
	var btnUp =new LSprite();
	btnUp.graphics.drawRoundRect(0,"#EDEDED", [0, 0, 250,100,50], true, "#EDEDED");

	/** 按钮文字 */
	var title = new LTextField();
	title.text = "开始游戏";
	title.size = 50;
	title.weight = "bold";
	title.x = 28;
	title.y =22;
	title.color = "#87CEEB";
	title.lineWidth = 6;
	title.lineColor = "#FFFFFF";
	title.stroke = true;
	btnUp.addChild(title);

	var btn =new LButton(btnUp,btnUp);
	btn.x =LGlobal.width/2+60;
	btn.y =600;		   
    beginningLayer.addChild(btn);
		
	/** 开始游戏 */
	btn.addEventListener(LMouseEvent.MOUSE_UP, function () {		    
	addLogWindow();
		
	//数据库连接
	DBConn();		 
	});
}

//提示按钮类
function showTip(){
	//创建遮罩背景
	var graphics =new LGraphics();
	graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "#EDEDED");
	graphics.alpha=0.5;
	
    //创建遮罩层
	var tipLayer = new LSprite();
	tipLayer.graphics.drawRect(0, "", [0, 0, LGlobal.width, LGlobal.height], true, "");
	tipLayer.alpha=0.5;
	tipLayer.addChild(graphics);

	//添加略缩图
	var thumbnail= showThumbnail();	
	
	//创建提示按钮
	var tipUp= new LBitmap(img_tip);
	tipUp.scaleX = 0.1;
	tipUp.scaleY = 0.1;
	
	var tipOver=tipUp.clone();
	tipOver.alpha=0.5;

	var tip =new LButton(tipUp,tipOver);
	tip.x = (LGlobal.width-50)/2;
	tip.y = 535;
	
    overLayer.addChild(tip);
	
    //给按钮添加点击事件	
	tip.addEventListener(LMouseEvent.MOUSE_OVER, function () {
		    overLayer.addChild(tipLayer);
			overLayer.addChild(thumbnail);
		}
	    );
	tip.addEventListener(LMouseEvent.MOUSE_OUT, function () {
		 overLayer.removeChild(tipLayer); 
		 overLayer.removeChild(thumbnail);
		}
	    );	
	tip.addEventListener(LMouseEvent.MOUSE_UP, function () {
		 overLayer.removeChild(tipLayer); 
		 overLayer.removeChild(thumbnail);
		}
	    );
	tip.addEventListener(LMouseEvent.MOUSE_DOWN, function () {
		   overLayer.addChild(tipLayer);
		overLayer.addChild(thumbnail);
		}
	    );
}

//声音按钮
function getSoundSet(){
    //sound_on	
	var sound_on= new LBitmap(img_sound_on);
    sound_on.scaleX = 0.4;
	sound_on.scaleY = 0.4;
	sound_on.x=340;
	sound_on.y=550;
	//sound_off
	var sound_off= new LBitmap(img_sound_off);
    sound_off.scaleX = 0.4;
	sound_off.scaleY = 0.4;
	sound_off.x=340;
	sound_off.y=550;
	//sound
    var sound = sound_on.clone();	
	
	//创建声音按钮
    var sound_btn = new LButton(sound,sound);
    //添加点击事件，切换按钮背景
	sound_btn.addEventListener(LMouseEvent.MOUSE_UP,function(){
		if(isSoundOff){
			sound.bitmapData=img_sound_on;
			isSoundOff=false;
			backSound.play();		
		}else{
			sound.bitmapData=img_sound_off;
			isSoundOff=true;
			backSound.stop();
		}
		});
    return sound_btn;
}

//关卡按钮
function getLevelSet(){
    //level
	level_btn= new LBitmap(img_level_normal);
    level_btn.scaleX = 0.38;
	level_btn.scaleY = 0.38;
	level_btn.x=175;
	level_btn.y=553;

    //创建菜单按钮
    var levelBtn = new LButton(level_btn,level_btn);
		
    //添加点击事件
	levelBtn.addEventListener(LMouseEvent.MOUSE_UP,function(){
          	/** 添加关卡界面 */
		   levelLayer.remove();
		   userInfoLayer.remove();
		   puzzleLayer.remove();
	       addLevelUI();
		});
    return levelBtn;
}

//用户信息按钮
function getUserInfo(){	
	userInfo_btn= new LBitmap(img_userInfo_normal);
    userInfo_btn.scaleX = 0.38;
	userInfo_btn.scaleY = 0.38;
	userInfo_btn.x=10;
	userInfo_btn.y=553;
	
    //创建菜单按钮
    var userInfoBtn = new LButton(userInfo_btn,userInfo_btn);

    //添加点击事件
	userInfoBtn.addEventListener(LMouseEvent.MOUSE_UP,function(){
        /** 添加用户界面 */
		levelLayer.remove();
		userInfoLayer.remove();
        puzzleLayer.remove();
		addUserUI();
		});
    return userInfoBtn;
}


/** 窗口 */
//登录窗口
function addLogWindow(){
	myWindow = new LWindow({width:350,height:250,title:"Login"});
	myWindow.x = 10;
	myWindow.y = 100;
	addChild(myWindow);
	
	var title = new LTextField();
	title.text = "用户登录";
	title.size = 20;
	title.x = 150;
	title.y = 10;
	myWindow.layer.addChild(title);
	
	var tip = new LTextField();
	tip.text = "用户名或密码错误";
	tip.size = 10;
	tip.color="#FF0000";
	tip.visible=false;
	tip.x = 130;
	tip.y = 45;
	myWindow.layer.addChild(tip);
	
	var nameLabel = new LTextField();
	nameLabel.text = "用户名：";
	nameLabel.x = 80;
	nameLabel.y = 70;
	myWindow.layer.addChild(nameLabel);
	var name = new LTextField();
	name.x = 150;
	name.y = 70;
	name.setWordWrap(true);
	name.setType(LTextFieldType.INPUT);
	myWindow.layer.addChild(name);
	name.focus();
	var passLabel = new LTextField();
	passLabel.text = "密码：";
	passLabel.x = 80;
	passLabel.y = 110;
	myWindow.layer.addChild(passLabel);
	var pass = new LTextField();
	pass.x = 150;
	pass.y = 110;
	pass.displayAsPassword = true;
	pass.setType(LTextFieldType.INPUT);
	myWindow.layer.addChild(pass);
    

	var button01 = new LButtonSample1("登陆");
	button01.x = 100;
	button01.y = 150;
	myWindow.layer.addChild(button01);
	button01.addEventListener(LMouseEvent.MOUSE_UP,function(){		
		logDB(tip,name.text,pass.text);		
	});
	
	var button02 = new LButtonSample1("注册");
	button02.x = 200;
	button02.y = 150;
	myWindow.layer.addChild(button02);
	button02.addEventListener(LMouseEvent.MOUSE_UP,function(){
         myWindow.remove();
		 addRegisterWindow();
	});
}

//注册窗口
function addRegisterWindow(){
	myWindow = new LWindow({width:350,height:250,title:"Register"});
	myWindow.x = 10;
	myWindow.y = 100;
	addChild(myWindow);
	
	var title = new LTextField();
	title.text = "用户注册";
	title.size = 20;
	title.x = 150;
	title.y = 10;
	myWindow.layer.addChild(title);
	
	var tip = new LTextField();
	tip.text = "";
	tip.size = 10;
	tip.color="#FF0000";
	tip.x = 130;
	tip.y = 45;
	myWindow.layer.addChild(tip);
	
	var nameLabel = new LTextField();
	nameLabel.text = "用户名：";
	nameLabel.x = 80;
	nameLabel.y = 70;
	myWindow.layer.addChild(nameLabel);
	var name = new LTextField();
	name.x = 150;
	name.y = 70;
	name.text="";
	name.setWordWrap(true);
	name.setType(LTextFieldType.INPUT);
	myWindow.layer.addChild(name);
	name.focus();
	
	var passLabel = new LTextField();
	passLabel.text = "密码：";
	passLabel.x = 80;
	passLabel.y = 110;
	myWindow.layer.addChild(passLabel);
	var pass = new LTextField();
	pass.x = 150;
	pass.y = 110;
	pass.text="";
	pass.displayAsPassword = true;
	pass.setType(LTextFieldType.INPUT);
	myWindow.layer.addChild(pass);
	
	var passLabel2 = new LTextField();
	passLabel2.text = "确认密码：";
	passLabel2.x = 80;
	passLabel2.y = 140;
	myWindow.layer.addChild(passLabel2);
	var pass2 = new LTextField();
	pass2.x = 150;
	pass2.y = 140;
	pass2.text="";
	pass2.displayAsPassword = true;
	pass2.setType(LTextFieldType.INPUT);
	myWindow.layer.addChild(pass2);

	var button01 = new LButtonSample1("注册");
	button01.x = 150;
	button01.y = 170;
	myWindow.layer.addChild(button01);
	button01.addEventListener(LMouseEvent.MOUSE_UP,function(){
      registerDB(tip,name.text,pass.text,pass2.text);
	});
}

//游戏点击窗口
function addAskWindow(i){
	myWindow = new LWindow({width:220,height:140,title:"Chooose"});
	myWindow.x = 70;
	myWindow.y = 200;
	addChild(myWindow);
	
	var title = new LTextField();
	title.text = "确定选择当前拼图吗？";
	title.size = 20;
	title.x = 10;
	title.y = 10;
	myWindow.layer.addChild(title);
	
	var button01 = new LButtonSample1("确定");
	button01.x = 50;
	button01.y = 60;
	myWindow.layer.addChild(button01);
	button01.addEventListener(LMouseEvent.MOUSE_UP,function(){
      myWindow.remove();
	  levelLayer.remove();
	  userInfoLayer.remove();	
      level_btn.bitmapData=img_level_normal;	  
	  imgBmpd=showlist[i];
	  nowPic_index=i;
	  NavLayer.remove();
	  addPuzzleUI();
	  startGame();
	});
	
	var button02 = new LButtonSample1("取消");
	button02.x = 120;
	button02.y =60;
	myWindow.layer.addChild(button02);
	button02.addEventListener(LMouseEvent.MOUSE_UP,function(){
      myWindow.remove();
	});
}

/** 拼图游戏逻辑 */
//初始化拼图块
function initBlockList () {
	blockList = new Array();

	for (var i = 0; i < (level*level); i++) {
		/** 根据计算拼图块图片显示位置 */
		var y = (i / level) >>> 0, x = i % level;

		blockList.push(new Block(i, x, y));
	}
}

//随机打乱拼图
function getRandomBlockList () {
	/** 随机打乱拼图 */
	blockList.sort(function () {
		return 0.5 - Math.random();
	});

	/** 计算逆序和 */
	var reverseAmount = 0;

	for (var i = 0, l = blockList.length; i < l; i++) {
		var currentBlock = blockList[i];

		for (var j = i + 1; j < l; j++) {
			var comparedBlock = blockList[j];

			if (comparedBlock.index < currentBlock.index) {
				reverseAmount++;
			}
		}
	}

	/** 检测打乱后是否可还原 */
	if (reverseAmount % (level-1) != 0) {
		/** 不合格，重新打乱 */
		getRandomBlockList();
	}
}

//显示拼图块
function showBlock() {
	for (var i = 0, l = blockList.length; i < l; i++) {
		var b = blockList[i];

		/** 计算拼图块位置 */
		var y = (i / level) >>> 0, x = i % level;

		b.setLocation(x, y);

		gameLayer.addChild(b);
	}
}

//显示略缩图
function showThumbnail() {
	var thumbnail = new LBitmap(imgBmpd);
	thumbnail.scaleX = 250 /imgBmpd.width;
	thumbnail.scaleY = 250/imgBmpd.height;
	thumbnail.x = 70;
	thumbnail.y = 200;
	return thumbnail;
}


/** 显示时间和步数 */
//显示所花时间
function addTimeTxt () {
	timeTxt = new LTextField();
	timeTxt.stroke = true;
	timeTxt.lineWidth = 3;
	timeTxt.lineColor = "#54D9EF";
	timeTxt.color = "#FFFFFF";
	timeTxt.size = 18;
	timeTxt.x = 20;
	timeTxt.y =500;
	overLayer.addChild(timeTxt);

	updateTimeTxt();
}

function updateTimeTxt () {
	timeTxt.text = "时间：" + getTimeTxt(time);
}

function getTimeTxt () {
	var d = new Date(time);

	return d.getMinutes() + " : " + d.getSeconds();
};

//显示所花步数
function addStepsTxt () {
	stepsTxt = new LTextField();
	stepsTxt.stroke = true;
	stepsTxt.lineWidth = 3;
	stepsTxt.lineColor = "#54D9EF";
	stepsTxt.color = "#FFFFFF";
	stepsTxt.size = 18;
	stepsTxt.y =500;
	overLayer.addChild(stepsTxt);

	updateStepsTxt();
}

function updateStepsTxt () {
	stepsTxt.text = "步数：" + steps;

	stepsTxt.x = LGlobal.width - stepsTxt.getWidth() - 20;
}


/** 循环 */
//游戏循环
function onFrame () {
   onSoundFrame();
   
   if(isOffGame ==false){
	onTimeFrame();
   }
}

//循环显示时间
function onTimeFrame() {
	if (isGameOver) {
		return;
	}

	/** 获取当前时间 */
	var currentTime = (new Date()).getTime();

	/** 计算使用的时间并更新时间显示 */
	time = currentTime - startTime;
	updateTimeTxt();
}

//循环检测当前按钮状态
function CurrentImgBtn(){
	if(isOfflevel){
		level_btn.bitmapData=img_level_normal;
	}else{
		level_btn.bitmapData=img_level_up;
	}
	if(isOffUserInfo){
		userInfo_btn.bitmapData=img_userInfo_normal;
	}else{
		userInfo_btn.bitmapData=img_userInfo_up;
	}
}

//循环播放音乐
function onSoundFrame(){
	//检测背景音乐
	nowTime_Sound=backSound.getCurrentTime();
	//console.log(nowTime_Sound);
	if(isSoundOff==false){
		if(nowTime_Sound>=33){
		  backSound.play(0);	
	  }
	}
  //检测拼图点击音乐
  if(isClick){
	blockClickSound.play(0,0.01);
	isClick=false;
	}
	
}

/*** 音乐*/
//添加背景音乐
function addBackSound(){
    //加载背景音乐
    backUrl = "./sounds/back_sound.mp3";
    backSound.load(backUrl);
}

//添加拼图点击音乐
function addBlockClickSound(){
    //加载点击音乐
	blockClickSound = new LSound();
    blockClickUrl = "./sounds/block_click_sound.mp3";
    blockClickSound.load(blockClickUrl);
}