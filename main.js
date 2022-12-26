var jewels = [[9],[9],[9],[9],[9],[9],[9],[9],[9],[9]] // Jumlah maksimal kotak jewel

var Player = { // Data player (nama dan point)
	point: 0,
	name: "",
	setPoint: function(point) {
		this.point+=point
		$("#playerPoint").text(this.point)
	}
}

var Movement = { // Variabel Movement untuk mencari gambar
	selectedId: 0,
	dataImage: 0,
	dataX: 0,
	dataY: 0,
	setSelectedId:function(id) {
		this.selectedId = id
		this.dataImage = $("#"+this.selectedId).attr("dataImage")
		this.dataX = $("#"+this.selectedId).attr("dataX")
		this.dataY = $("#"+this.selectedId).attr("dataY")
	}
}

var Game = { // Game display
	countTime: 4, // Hitung mundur sebelum masuk layar game
	isStarted: false,
	start: function() { // Game start
		$(".gameDashboard").fadeOut() // Layar Game, tidak ditampilkan
		var username = $("#name").val()
		if(username.length == 0) { 
			alert("INPUT YOUR NAME FIRST !!!")
		} else {
			var number = Math.random()
			Player.name = username
			for(i = 1; i < 6;i++) { // Baris
				for(j = 1; j < 6;j++) { // Kolom
					isValid = false
					var rand = Math.random()+""
					var arrRand = rand.split('')
					if(arrRand[15] == "0") {
						arrRand[15] = "1"
					}
					jewels[i][j] = new Jewel(arrRand[15]);
				}
			}
			$("#playerName").text(Player.name)
			this.countDown()
		}
	},

	countDown: function() { // Hitung mundur
		$(".gameWelcome").fadeOut() // Halaman awal, hilang
		$(".countDown").fadeIn() // Mulai hitung mundur
		if(this.countTime != 0) {
			setTimeout(function(){ // Mulai timer game
				Game.countTime -= 1
				$(".countDown h1").text(Game.countTime+"")
				Game.countDown()
			},1000)
		} else {
			$(".countDown h1").fadeOut() // Ketika hitung mundur selesai, masuk halaman game
			this.buildGame()
		}
	},

	buildGame: function() {
		$(".playAgain").fadeOut() // Tombol play again, hilang
		$(".gameWelcome").fadeOut() // Halaman awal, hilang
		$(".gameDashboard").fadeIn() // Layar game, muncul
		for(i = 1; i < 6;i++) {
			var text = "<tr>"
			for(j = 1; j < 6;j++) {
				text+="<td id='column'><img dataY='"+i+"' dataX='"+j+"' dataImage='"+jewels[i][j].number+"' id='"+i+j+"' ondragstart='Game.onDragStart(event)' ondragover='event.preventDefault()' ondrop='Game.onDragEnd(event)' src='images/"+jewels[i][j].number+".png'></td>"
			}
			text += "</tr>"
			$(".gameDisplay tbody").append(text)
		}
		this.isStarted = true
		Timing.startTiming()
	},

	playAgain: function() { // Play again
		$(".gameDisplay tbody").text("")
		this.countTime = 3 // Hitung mundur play again
		Player.point = 0 // Restart score
		Timing.nowTime = 60 // Timer play again
		this.start()
	},

	onDragStart: function(event) { // Ketika objek on drag
		Movement.setSelectedId(event.target.id)
	},

	onDragEnd: function(event) { // Ketika objek on drop
		if(this.isStarted) { 
			var from = $("#"+Movement.selectedId)
			var target = $("#"+event.target.id)
			if((parseInt(Movement.dataX) + 1) < parseInt(target.attr("dataX")) || (parseInt(Movement.dataX) - 1) > parseInt(target.attr("dataX")) || (parseInt(Movement.dataY) - 1) > parseInt(target.attr("dataY")) || (parseInt(Movement.dataY) + 1) < parseInt(target.attr("dataY"))) {
				alert("CANNOT MOVE OBJECT !!!") // muncul alert, Ketika objek di drag lebih dari satu block
			} else {
				from.attr("src",target.attr("src"))
				from.attr("dataImage",target.attr("dataImage"))
				target.attr("src","images/"+Movement.dataImage+".png")
				target.attr("dataImage",Movement.dataImage)
			}
			checkerGame.check(target)
		} else {
			alert("GAME IS OVER !!!") // Muncul alert, ketika timer habis
		}
	}
}

var checkerGame = { // Untuk Mengecek Jewel ketika sejajar 3 baris atau lebih
	object: null,
	objectTypeJewel: 0,
	destroyItemX: "",
	destroyItemY: "",
	nextCheckX: false,
	nextCheckY: false,
	beforeCheckX:false,
	beforeCheckY:false,
	targetX: 0,
	targetY: 0,
	countSameJewelTypeX: 0,
	countSameJewelTypeY: 0,
	check: function(object) { // Cek fungsi objek
		this.nextCheckX = true
		this.beforeCheckX = true
		this.nextCheckY = true
		this.beforeCheckY = true
		this.object = object 
		this.objectTypeJewel = this.object.attr("dataImage")
		this.targetX = parseInt(this.object.attr("dataX"))
		this.targetY = parseInt(this.object.attr("dataY"))
		this.checkX()
	},

	checkX: function() { // Cek ketika objek sejajar horizontal
		this.destroyItemX = ""
		this.countSameJewelTypeX = 0
		while(this.nextCheckX){
			this.targetX += 1
			var typeJewelObject = this.objectTypeJewel
			var typeJewelTarget = $("#"+this.targetY+""+(this.targetX)).attr("dataImage")
			if(typeJewelObject == typeJewelTarget) {
				this.destroyItemX += ","+this.targetY+""+this.targetX
				this.countSameJewelTypeX+=1
			} else {
				this.targetX = parseInt(this.object.attr("dataX"))
				this.nextCheckX = false
			}
		}

		while(this.beforeCheckX) { 
			this.targetX -= 1
			var typeJewelObject = this.objectTypeJewel
			var typeJewelTarget = $("#"+this.targetY+""+(this.targetX)).attr("dataImage")
			if(typeJewelObject == typeJewelTarget) {
				this.destroyItemX += ","+this.targetY+""+this.targetX
				this.countSameJewelTypeX+=1
			} else {
				this.targetX = parseInt(this.object.attr("dataX"))
				this.beforeCheckX = false
			}
		}
		this.checkY()
	},

	checkY: function() { // Cek ketika objek sejajar vertikal
		this.destroyItemY = ""
		while(this.nextCheckY){
			this.targetY += 1
			var typeJewelObject = this.objectTypeJewel
			var typeJewelTarget = $("#"+this.targetY+""+(this.targetX)).attr("dataImage")
			if(typeJewelObject == typeJewelTarget) {
				this.destroyItemY += ","+this.targetY+""+this.targetX
				this.countSameJewelTypeY+=1
			} else {
				this.targetY = parseInt(this.object.attr("dataY"))
				this.nextCheckY = false;
				this.beforeCheckX = true;
			}
		}

		while(this.beforeCheckY) {
			this.targetY -= 1
			var typeJewelObject = this.objectTypeJewel
			var typeJewelTarget = $("#"+this.targetY+""+(this.targetX)).attr("dataImage")
			if(typeJewelObject == typeJewelTarget) {
				this.destroyItemY += ","+this.targetY+""+this.targetX
				this.countSameJewelTypeY+=1
			} else {
				this.targetY = parseInt(this.object.attr("dataY"))
				this.beforeCheckY = false
			}
		}
		this.destroyAction()
	},

	destroyAction: function() { // Mengganti block yang hilang ketika 3 baris sejajar
		if(this.countSameJewelTypeX > 1) {
			var arr = this.destroyItemX.split(",")
			arr[0] = this.object.attr("dataY")+""+this.object.attr("dataX")
			for(i = 0; i < arr.length;i++) {
				var rand = Math.random()+""
				var arrRand = rand.split('')
				if(arrRand[15] == "0") {
					arrRand[15] = "1"
				}
				$("#"+arr[i]).attr("src","images/"+arrRand[15]+".png")
				$("#"+arr[i]).attr("dataImage",arrRand[15]+"")
			}
		}

		if(this.countSameJewelTypeY > 1) {
			var arr = this.destroyItemY.split(",")
			arr[0] = this.object.attr("dataY")+""+this.object.attr("dataX")
			for(i = 0;i < arr.length;i++) {
				var rand = Math.random()+""
				var arrRand = rand.split('')
				if(arrRand[15] == "0") {
					arrRand[15] = "1"
				}
				$("#"+arr[i]).attr("src","images/"+arrRand[15]+".png")
				$("#"+arr[i]).attr("dataImage",arrRand[15]+"")
			}
		} 
		// Peraturan score
		if (this.countSameJewelTypeX+1 > 5 && this.countSameJewelTypeY+1 > 5) {
			Player.setPoint(15)
		} else if (this.countSameJewelTypeX+1 >= 5 || this.countSameJewelTypeY+1 >= 5) {
			Player.setPoint(15)
		} else if (this.countSameJewelTypeX+1 == 4 || this.countSameJewelTypeY+1 == 4) {
			Player.setPoint(12)
		} else if (this.countSameJewelTypeX == 2 || this.countSameJewelTypeY == 2) {
			Player.setPoint(9)
		}
		
		this.countSameJewelTypeX = 0
		this.countSameJewelTypeY = 0
	}
}

var Timing = { // Variabel timer game pertama
	nowTime: 60, // Timer game pertama
	startTiming: function() {
		Timing.setToScreen()
		setTimeout(function(){
			if(Timing.nowTime == -1) {
				ServerJewel.setScore()
				Game.isStarted = false
				alert("GAME IS OVER !!!") // Ketika waktu habis, keluar alert game over
				$(".playAgain").fadeIn() // Tombol play again muncul
			} else {
				Timing.startTiming()
			}
		},1000)
		Timing.nowTime -= 1
	},

	setToScreen: function() { // Text timer ditaruh pada layar
		$("#playerTime").text(Timing.nowTime+" second")
	}
}

var Jewel = function(number) { 
	this.number = number // Memberi variabel nomer pada jewel
}

var ServerJewel = { // Untuk menambah score
	setScore: function() {
		$.ajax({
			data: {name: Player.name, score: Player.point},
			success: function(response) {
				ServerJewel.getScroe()
			}
		})
	},

	getScroe: function() {
		$.ajax({

			data: {name: Player.name, score: Player.point},
			success: function(response) {
				ServerJewel.setToScreen(response)
			}
		})
	},

	setToScreen: function(data) { // Text score ditaruh pada layar
		var dataScore = JSON.parse(data)
		$(".nameT").text(dataScore.name)
		$(".scoreT").text(dataScore.score)
	}
} 

$("#buttonStart").click(function() { // Function Button > START GAME < pada layar awal
	Game.start()
})

$(".playAgain").click(function() { // Function Button Play Again
	$(".countDown h1").text("3")
	$(".countDown h1").fadeIn()
	Game.playAgain()
})

/*--------------------------------------------------------------------------------------------------------------*/

// A 10x10 grid implemented with Javascript Array 
var rows = 7; 
var cols = 7; 
var grid = []; 
var validFigures = 0;
var levelGoal = 0;

// game object 
function jewel(r,c,obj,src) {
	return {
		r: r,
		c: c,
		src: src,
		locked: false,
		isInCombo: false,
		o: obj
	}
}

// Jewels used in Solar System JSaga
var jewelsType=[];
    jewelsType[0]="images/1.png";
    jewelsType[1]="images/2.png";
    jewelsType[2]="images/3.png";
    jewelsType[3]="images/4.png";
    jewelsType[4]="images/5.png";
    jewelsType[5]="images/6.png";
    jewelsType[6]="images/7.png";
    jewelsType[7]="images/8.png";
    jewelsType[8]="images/9.png";
    jewelsType[9]="images/10.png";

// this function returs a random jewel.
function pickRandomJewel() {
    var pickInt = Math.floor((Math.random()*9));
    //console.log("Picked " + pickInt);
    return jewelsType[pickInt];
}

function _initGame() {
	// prepare grid - Simply and fun!
	for (var r = 0; r < rows; r++) {
		grid[r]=[];
	for (var c =0; c< cols; c++) {
		grid[r][c]=new jewel(r,c,null,pickRandomJewel());
	}
}    
_applyRectangleConstraint(1,1,1,1);
	
// initial coordinates
var width = $('body').width();
var height = $(document).height();

console.log("Game width: " + width);
console.log("Game height: " + height);
	
var cellWidth = width / (cols+1);
var cellHeight = height / (rows+1);
var marginWidth = cellWidth/cols;
var marginHeight = cellHeight/rows;
 		
console.log("Jewels width: " + cellWidth);
console.log("Jewels height: " + cellHeight);

	// draw the grid. 
 	for (var r = 0; r < rows; r++) {
 		for (var c =0; c< cols; c++) {
 			//console.log("add to: "  + r*cellHeight + ", " + c*cellWidth);
 			var cell = $("<img class='jewel' id='jewel_"+r+"_"+c+"' r='"+r+"' c='"+c+"' ondrop='_onDrop(event)' ondragover='_onDragOverEnabled(event)'  src='"+grid[r][c].src+"' style='padding-right:20px;width:"+(cellWidth-20)+"px;height:"+cellHeight+"px;position:absolute;top:"+r*cellHeight+"px;left:"+(c*cellWidth+marginWidth)+"px'/>");
 			cell.attr("ondragstart","_ondragstart(event)");
 			$("body").append(cell);
 			grid[r][c].o = cell;
 		}
 	} 	
}

function _ondragstart(a) {
 	console.log("Moving jewel: " + a.target.id);
 	a.dataTransfer.setData("text/plain", a.target.id);
}

function _onDragOverEnabled(e) {
 	e.preventDefault();
 	console.log("drag over " + e.target);
 }

// apply grid constraint
 function _applyRectangleConstraint(u,d,l,r) {
	console.log("Locking cells");
				
 	for(var i =0;i<u;i++) {
 		for(c=0;c<cols;c++) {
 			grid[i][c].locked=true;
 			grid[i][c].src="logo.png"; 
 		}
 	}

 	for(var i =0;i<d;i++) {
 		for(c=0;c<cols;c++) {
 			grid[(rows-i)-1][c].locked=true;
 			grid[(rows-i)-1][c].src="logo.png";
 		}		
 	}
 				
 	for(var i =0;i<l;i++) {
 		for(rX=0;rX<rows;rX++) {
 			grid[rX][i].locked=true;			
 			grid[rX][i].src="logo.png"; 
 		}
 	}

 	for(var i =0;i<r;i++) {
 		for(rX=0;rX<rows;rX++) {
 			grid[rX][(cols-i)-1].locked=true;
			grid[rX][(cols-i)-1].src="logo.png";
 		}
 	}
 }

function _onDrop(e) {
 		 
 	// only for firefox!
 	var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
 		if (isFirefox) {
 			console.log("firefox compatibility");
 			e.preventDefault();  
 		}
 	console.log("ondrop" + e);
 			
 	var src = e.dataTransfer.getData("text");	
 	var sr = src.split("_")[1];
 	var sc = src.split("_")[2];	
 	var dst = e.target.id;
 	var dr = dst.split("_")[1];
 	var dc = dst.split("_")[2];
 	
 	// check distance (max 1)
 	var ddx = Math.abs(parseInt(sr)-parseInt(dr));
 	var ddy = Math.abs(parseInt(sc)-parseInt(dc));
 										
 	if (ddx > 1 || ddy > 1) {
 		console.log("invalid! distance > 1");
 		return;
 	}

 	console.log("swap " + sr + "," + sc+ " to " + dr + "," + dc);
 				
 	// Execute swap
 	var tmp = grid[sr][sc].src;
 		grid[sr][sc].src = grid[dr][dc].src;
 		grid[sr][sc].o.attr("src",grid[sr][sc].src);
 		grid[dr][dc].src = tmp;
 		grid[dr][dc].o.attr("src",grid[dr][dc].src);
 				
 		// search for combo
 		_checkAndDestroy(); 
 	}

// check and destroy combination 
function _checkAndDestroy() {

 	// HORIZONTAL COMBO
 	for (var r = 0; r < rows; r++) {
 		var prevCell = null;
 		var figureLen = 0;
 		var figureStart = null;
 		var figureStop = null;
 					
 		for (var c=0; c< cols; c++) {
 			// bypass locked and jewels that partecipate to combo. 
 			//The next cell will become first cell of combo.   
 			if (grid[r][c].locked || grid[r][c].isInCombo) {
 				figureStart = null;
 				figureStop = null;
 				prevCell = null; 	
 				figureLen = 1;
 				continue;
 			}
 						
	 		// first cell of combo!
	 		if (prevCell==null) {
	 			//console.log("FirstCell: " + r + "," + c);
	 			prevCell = grid[r][c].src;
	 			figureStart = c;
	 			figureLen = 1;
	 			figureStop = null;
	 			continue;
	 		} else {
	 			//second or more cell of combo.
	 			var curCell = grid[r][c].src;
	 			// if current cell is not equals to prev cell then current cell become new first cell!
	 			if (!(prevCell==curCell)) {
	 				//console.log("New FirstCell: " + r + "," + c);
 					prevCell = grid[r][c].src;
 					figureStart = c;
 					figureStop=null;
 					figureLen = 1;
 					continue;
 				} else {
  					// if current cell is equal to prevcell than combo lenght is increased
 					// Due to combo, current combo will be destroyed at the end of this procedure.
 					// Then, the next cell will become new first cell
 					figureLen+=1;
 					if (figureLen==3) {
 						validFigures+=1;
 						figureStop = c;
 						console.log("Combo from " + figureStart + " to " + figureStop + "!");
 						for (var ci=figureStart;ci<=figureStop;ci++) {
 							grid[r][ci].isInCombo=true;
 							grid[r][ci].src=null;
 							//grid[r][ci].o.attr("src",""); 
 						}
 						prevCell=null;
 						figureStart = null;
 						figureStop = null;
 						figureLen = 1;
 						continue;
 					}
 				}
 			}			
 		}
	}
 				
 	// VERTICAL COMBO
 	for (var c=0; c< cols; c++) {
 		var prevCell = null;
 		var figureLen = 0;
 		var figureStart = null;
 		var figureStop = null;
 					
 		for (var r = 0; r < rows; r++) {
 			// bypass locked and jewels that partecipate to combo. 
 			//The next cell will become first cell of combo.   
 			if (grid[r][c].locked || grid[r][c].isInCombo) {
 				figureStart = null;
 				figureStop = null;
 				prevCell = null; 	
 				figureLen = 1;
 				continue;
 			}
 						
 			// first cell of combo!
 			if (prevCell==null) {
 				//console.log("FirstCell: " + r + "," + c);
 				prevCell = grid[r][c].src;
 				figureStart = r;
 				figureLen = 1;
 				figureStop = null;
 				continue;
 			} else {
 				//second or more cell of combo.
 				var curCell = grid[r][c].src;
 				// if current cell is not equals to prev cell then current cell become new first cell!
 				if (!(prevCell==curCell)) {
 					//console.log("New FirstCell: " + r + "," + c);
 					prevCell = grid[r][c].src;
 					figureStart = r;
 					figureStop=null;
 					figureLen = 1;
 					continue;
 				} else {
 					// if current cell is equal to prevcell than combo lenght is increased
 					// Due to combo, current combo will be destroyed at the end of this procedure.
 					// Then, the next cell will become new first cell
 					figureLen+=1;
 					if (figureLen==3) {
 						validFigures+=1;
 						figureStop = r;
 						console.log("Combo from " + figureStart + " to " + figureStop + "!");
 						for (var ci=figureStart;ci<=figureStop;ci++) {
 							grid[ci][c].isInCombo=true;
 							grid[ci][c].src=null;
 							//grid[ci][c].o.attr("src","");
 						}
 						prevCell=null;
 						figureStart = null;
 						figureStop = null;
 						figureLen = 1;
 						continue;
 					}
 				}
 			}				
 		}
 	}
 				
// if there is combo then execute destroy			
var isCombo=false;
 	for (var r = 0;r<rows;r++)
 		for (var c=0;c<cols;c++)
 			if (grid[r][c].isInCombo) {
				console.log("There are a combo");
				isCombo=true;
			}
						
			if (isCombo) 
				_executeDestroy();
				else
				console.log("NO COMBO");
 			}
 		
// execute the destroy fo cell
function _executeDestroy() {
 	for (var r=0;r<rows-1;r++)	 	 
 		for (var c=0;c<cols-1;c++)
 			if (grid[r][c].isInCombo) {  // this is an empty cell
 				grid[r][c].o.animate({
 				 	opacity:0
 				},500);
 			}
 		$(":animated").promise().done(function() {
   		_executeDestroyMemory();
	}); 			
}
	
function _executeDestroyMemory() {
// move empty cells to top 
	for (var r=0;r<rows-1;r++) { 				 	 
 		for (var c=0;c<cols-1;c++) {
 			if (grid[r][c].isInCombo) { // this is an empty cell
 				grid[r][c].o.attr("src","")
 					// disable cell from combo. 
 				 	//(The cell at the end of this routine will be on the top)
 				 	grid[r][c].isInCombo=false;
 				 		for (var sr=r;sr>=0;sr--) {
 				 			if (sr==0) break; // cannot shift. this is the first rows
 				 			if (grid[sr-1][c].locked) 
 				 				break; // cannot shift. my top is locked
 				 				
 				 				// shift cell
 				 				var tmp = grid[sr][c].src;
 				 			  	grid[sr][c].src=grid[sr-1][c].src;
								grid[sr-1][c].src=tmp;
 				 			}
 				 		}
 				 	}
 				}		

 			console.log("End of movement");
 				  				 				
 			//redrawing the grid
 			// and setup respaw			 					
   			//Reset all cell
			for (var r=0;r<rows-1;r++) {
 				for (var c = 0;c<cols-1;c++) {
 					grid[r][c].o.attr("src",grid[r][c].src);
 					grid[r][c].o.css("opacity","1");
 					grid[r][c].isInCombo=false;
 					if (grid[r][c].src==null) 
 						grid[r][c].respawn=true;
 					// if respawn is needed
 					if (grid[r][c].respawn==true) {
 						grid[r][c].o.off("ondragover");
 						grid[r][c].o.off("ondrop");
 						grid[r][c].o.off("ondragstart");
 						grid[r][c].respawn=false; // respawned!
 						console.log("Respawning " + r+ "," + c);
 						grid[r][c].src=pickRandomJewel();
 						grid[r][c].locked=false;
 						grid[r][c].o.attr("src",grid[r][c].src);
 						grid[r][c].o.attr("ondragstart","_ondragstart(event)");
 						grid[r][c].o.attr("ondrop","_onDrop(event)");
 						grid[r][c].o.attr("ondragover","_onDragOverEnabled(event)");
 						//grid[r][c].o.css("opacity","0.3");
 						//grid[r][c].o.css("background-color","red");
 					}
 				}
 			}
 			console.log("Combo resetted and rewpawned");
 					
 				// check for other combos
 				_checkAndDestroy();			
 			} 
 			 
			// touch capability
 			var startPos=[];
 			var toDrag = null;
 			var dragStart = false;
 			$(document).on("touchstart",function(e) {
				e.preventDefault();
					var xPos = e.originalEvent.touches[0].pageX;
					var yPos = e.originalEvent.touches[0].pageY;

					startPos[0]=xPos;
					startPos[1]=yPos;

					$(".jewel").each(function(index) {

						var jx = parseFloat($(this).offset().left);
						var jy = parseFloat($(this).offset().top);
						var jw = parseFloat($(this).width());
						var jh = parseFloat($(this).height());

						if (jx <= xPos && jy <= yPos && xPos <= (jx+jw) && yPos <= (jy+jh)) {

							var r = $(this).attr("id").split("_")[1];
							var c = $(this).attr("id").split("_")[2];

						if (grid[r][c].locked) {
							console.log("Collision on locked cell");
						} else {
							// collision detected
							console.log("collision on " + $(this).attr("id"));
							toDrag = grid[r][c];
							dragStart=true;

							// setting up shadow
							var shadow = document.getElementById("shadow");

							if (shadow==null) {

								console.log("Setting up shadow for dragging");
								shadow = document.createElement("img");
								document.getElementById("game").appendChild(shadow);
								shadow.setAttribute("src","");
								shadow.setAttribute("id","shadow");

								//shadow.style.visibility="hidden"; 
								shadow.style.position="absolute";
								shadow.style.zIndex="9999999";
							}

							$("#shadow").css("visibility","visible");

							var shadowImg = toDrag.src;
							console.log("Shadow image will be " + shadowImg);

							$("#shadow").attr("src",shadowImg);
							$("#shadow").css("left",xPos+"px");
							$("#shadow").css("top",yPos+"px");
							$("#shadow").css("width",jw+"px");
							$("#shadow").css("height",jh+"px");

								return;
							}
						}
					});
				});

				$(document).on("touchmove",function(e) {

				e.preventDefault();

				if (dragStart && toDrag!=null) {
					// move the shadow
					var xPos = e.originalEvent.touches[0].pageX;
					var yPos = e.originalEvent.touches[0].pageY;

					var sw = parseFloat($("#shadow").width());
					var sh = parseFloat($("#shadow").height());

					$("#shadow").css("left",(xPos-sw/2)+"px");
					$("#shadow").css("top",(yPos-sh/2)+"px");
				}
			});

			$(document).on("touchend",function(e) {
				e.preventDefault();

				if (dragStart && toDrag!=null) {

					// hide the shadow and check if the drop is on target and on which
					$("#shadow").css("visibility","hidden");
					dragStart=false;

					var xPos = e.changedTouches[0].pageX;
					var yPos = e.changedTouches[0].pageY;

					console.log("Drop on " + xPos +"," + yPos);

					var target = null; 

						// find the destionation
						$(".jewel").each(function(index) {

							var tx = parseFloat($(this).offset().left);
							var ty = parseFloat($(this).offset().top);

							var tw = parseFloat($(this).width());
							var th = parseFloat($(this).height());

						if (tx <= xPos && ty <= yPos && xPos <= (tx+tw) && yPos <= (ty+th)) {
							target = $(this).attr("id");
						}
					}).promise().done(function() {

					if (target!=null) {
						console.log("jewel released on " + target);
 							var src = toDrag.o.attr("id");
 							var sr = src.split("_")[1];
 							var sc = src.split("_")[2];
 							var dst = target;
 							var dr = dst.split("_")[1];
 							var dc = dst.split("_")[2];

 							// check distance (max 1)
 							var ddx = Math.abs(parseInt(sr)-parseInt(dr));
 							var ddy = Math.abs(parseInt(sc)-parseInt(dc));

 								if (ddx > 1 || ddy > 1) {
 									console.log("invalid! distance > 1");

 									return;
 								}

 								if (grid[dr][dc].locked) {
 									console.log("you drop on locked cell!!!");

 									return;
 								}

 									console.log("swap " + sr + "," + sc+ " to " + dr + "," + dc);
 									// execute swap
 									var tmp = grid[sr][sc].src;

 									grid[sr][sc].src = grid[dr][dc].src;
 									grid[sr][sc].o.attr("src",grid[sr][sc].src);
									grid[dr][dc].src = tmp;
 									grid[dr][dc].o.attr("src",grid[dr][dc].src);

 									// search for combo
 									_checkAndDestroy();
								} else
									console.log("drop out of targets");
									toDrag=false;
								});
							}
						});
	_initGame();
 			