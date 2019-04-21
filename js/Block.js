function Block (index, x, y) {
	LExtends(this, LSprite, []);

	var bmpd = imgBmpd.clone();		
	
	    if (index != (level-1)) {
	    bmpd.setProperties(x * bmpd.width / level, y* bmpd.width / level, bmpd.width / level, bmpd.width / level);
        this.bmp = new LBitmap(bmpd);
        this.bmp.scaleX = (LGlobal.width/level) / this.bmp.width;
        this.bmp.scaleY = (LGlobal.width/level)/ this.bmp.height;
		this.bmp.y=55;
        this.addChild(this.bmp);
    } else {
        var shape = new LShape();
        shape.graphics.drawRect(2, "#ffffff", [0, 55, LGlobal.width/level,LGlobal.width/level], true, "#ffffff");
        this.addChild(shape);
    }
	
	// 格子边框
    var border = new LShape();
    border.graphics.drawRect(3, "#ffffff", [0, 55, LGlobal.width/level,LGlobal.width/level]);
    border.graphics.drawRoundRect(4, "#ffffff", [0, 55, LGlobal.width/level, LGlobal.width/level, 8]);
    this.addChild(border);

    this.index = index;

    this.addEventListener(LMouseEvent.MOUSE_UP, this.onClick);
}

Block.getBlock = function (x, y) {
	return blockList[y * level + x];
};

Block.isGameOver = function () {
	var reductionAmount = 0, l = blockList.length;

	/** 计算还原度 */
	for (var i = 0; i < l; i++) {
		var b = blockList[i];

		if (b.index == i) {
			reductionAmount++;
		}
	}

	/** 计算是否完全还原 */
	if (reductionAmount == l) {
		/** 游戏结束 */
		gameOver();
	}	
};

Block.exchangePosition = function (b1, b2) {
	var b1x = b1.locationX, b1y = b1.locationY,
		b2x = b2.locationX, b2y = b2.locationY,
		b1Index = b1y * level + b1x,
		b2Index = b2y * level + b2x;

	/** 在地图块数组中交换两者位置 */
	blockList.splice(b1Index, 1, b2);
	blockList.splice(b2Index, 1, b1);

	/** 交换两者显示位置 */
	b1.setLocation(b2x, b2y);
	b2.setLocation(b1x, b1y);

	/** 判断游戏是否结束 */
	Block.isGameOver();
};

Block.prototype.setLocation = function (x, y) {
	this.locationX = x;
	this.locationY = y;

	this.x = x * (LGlobal.width/level);
	this.y = y * (LGlobal.width/level);
};

Block.prototype.onClick = function (e) {
    isClick=true;
	
	var self = e.currentTarget;

	if (isGameOver) {
		return;
	}

	var checkList = new Array();

	/** 判断左侧是否有方块 */
	if (self.locationX > 0) {
		checkList.push(Block.getBlock(self.locationX - 1, self.locationY));
	}

	/** 判断右侧是否有方块 */
	if (self.locationX < (level-1)) {
		checkList.push(Block.getBlock(self.locationX + 1, self.locationY));
	}

	/** 判断上方是否有方块 */
	if (self.locationY > 0) {
		checkList.push(Block.getBlock(self.locationX, self.locationY - 1));
	}

	/** 判断下方是否有方块 */
	if (self.locationY < (level-1)) {
		checkList.push(Block.getBlock(self.locationX, self.locationY + 1));
	}

	for (var i = 0, l = checkList.length; i < l; i++) {
		var checkO = checkList[i];

		/** 判断是否是空白拼图块 */
		if (checkO.index == (level-1)) {
			steps++;					
			updateStepsTxt();
			
			Block.exchangePosition(self, checkO);

			break;
		}
	}
};