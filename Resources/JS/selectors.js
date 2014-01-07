var url = "http://monadnock.or.gs:8080/story"
var max = 9;
var scrolling = false;
//$.fx.interval = 40;	

var currentID;
var art;
var curScreen = 1;	
var direction = false;
var imgLoadCnt = 0;
	
//Cycle the text at the top of the window
$("#tips").cycle({fx:"scrollUp"});



//Load a single page from DB, rezize images to fit, and move img src to backgorund of div..
function loadSingle(_id){
	//console.log("incrementID: "+_id)
	if(_id > max){	currentID = 1}else if (_id < 1){currentID = max}else{currentID = _id};
	//console.log("targetID: "+currentID);

	var id_url = url+"/"+currentID;
	
	$("#lightbox").load(id_url,function(){
		art = $(".artifact","#lightbox" );
			$("#footer").find("p").remove();
			$("#footer").prepend(art);
			$(".artifact", "#lightbox").remove();
			
			$(".ship_section img").load(function(i){
				
				var imgsrc = this.src;
				var bgStr = String("url("+imgsrc+")");
				var newCss = {};
				newCss["background-image"] = bgStr;
				console.log("resizing single images");
				var maxWidth = 450;
				var maxHeight = 525;

				var imgsrc = this.src;
				var scale = 1;
				var imgWidth = this.width;
				var imgHeight = this.height;
				scale = (imgWidth > imgHeight) ? maxWidth / imgWidth : maxHeight / imgHeight; //is it landscape or portrait
				var wide = imgWidth*scale;
				var high = imgHeight*scale;
				newCss.height = high/1.1; //1.1
				newCss.width = wide;

				var line = String(wide)+"px "+String(high)+"px";
				newCss["background-size"] = line;

				newCss.visibility = "visible";
				newCss.opacity = "1";
				$(this).parent().css(newCss);
				$(this).remove();
				$("#lightbox").addClass("active");
			});
	})
}

//handles clicking on ships in "gallery" view.
$('body').on('click',".ship_section", shipclick);

function shipclick(){
	if(!scrolling && curScreen == 1){
		console.log("shipclick");
		$("#tips").animate({opacity:0}, 150, function() {});
		$("#ADA").animate({opacity:1}, 150, function() {});
		$("#makeMeScrollable.top").animate({opacity:0}, 150, function() {});
		$("#makeMeScrollable.bottom").animate({opacity:0}, 150, function() {});
		curScreen = 2;
		var id = $(this).attr("id");
		$("#container").removeClass("active");
		$(".ship_section").addClass("nomargin");
		loadSingle(id);
		console.log(id);
	}
}





//click handler for arrows in individual section
$('body').on('click',".arrPrev", function (){
	var dir = ($(this).attr("id") == "prev") ? -1 : 1;
    var id = parseInt(currentID) + dir;
	console.log("changing page, direction = "+dir+" next ID = "+id)
	loadSingle(id);
});

$('body').on('click',".arrNext", function (){
	var dir = ($(this).attr("id") == "prev") ? -1 : 1;
    var id = parseInt(currentID) + dir;
	console.log("changing page, direction = "+dir+" next ID = "+id)
	loadSingle(id);
});

//click handler for close "X" to close ind	ividual window.
$("body").on('click',"#close",function(){
	curScreen = 1;
	$("#tips").animate({opacity:1}, 150, function() {});
	$("#makeMeScrollable.top").animate({opacity:1}, 150, function() {});
	$("#makeMeScrollable.bottom").animate({opacity:1}, 150, function() {});
	$("#ADA").animate({opacity:0}, 150, function() {});
	$("#footer").find("p").remove();
	$("#lightbox").removeClass("active");
	$("#container").addClass("active");
});



var init = function(){
	console.log("init")
	//loads content for "gallery", resizing images and moving them to the background.
	$(".content").load(url, function(){

		var maxWidth = 500; //367


		console.log(".content load")

		$("img").load(function(i){
			var newCss = {};
			var imgsrc = this.src;
			var bgStr = String("url("+imgsrc+")");
			newCss["background-image"] = bgStr;



			newCss.width = maxWidth ;
			var thisWidth = $(this).width();
			var scale = maxWidth / thisWidth;


			var newHeight = scale*$(this).height();
			newCss.height = newHeight;
			var line = String(maxWidth)+"px "+String(newHeight)+"px";

			newCss["background-size"] = line;

			newCss.visibility = "visible";
			newCss.opacity = "1";
			$(this).parent().css(newCss);
			$(this).remove();
			imgLoadCnt++;
			console.log("Image " + imgLoadCnt + " Loaded.");
			if (imgLoadCnt == 40) {
				console.log("Time Out");
				
				$(".content").redraw();
				buildScroller();


			}
		});
	});
	
}
$(document).ready(init);

function buildScroller(){
	
	
//	window.setTimeout(function(){
	//	$("#makeMeScrollable").redraw();
		var scrollerHTML = $("#makeMeScrollable.top").html();
		$("#makeMeScrollable.top").smoothDivScroll({
			autoScrollingMode: "onStart",
			autoScrollingDirection: "endlessLoopRight",
			hotSpotScrolling: false,
			touchScrolling: false,
			manualContinuousScrolling: true,
			mousewheelScrolling: false,
			autoScrollingStep: 10,
			autoScrollingInterval: 10,
			getContentOnLoad: { 
						method: "getHtmlContent",
						content: scrollerHTML,
						manipulationMethod: "replace"
					}
		});
		
	
		var scrollerHTML = $("#makeMeScrollable.bottom").html();
		$("#makeMeScrollable.bottom").smoothDivScroll({
			autoScrollingMode: "onStart",
			autoScrollingDirection: "endlessLoopLeft",
			hotSpotScrolling: false,
			touchScrolling: false,
			manualContinuousScrolling: true,
			mousewheelScrolling: false,
			autoScrollingStep: 10,
			autoScrollingInterval: 10,
			getContentOnLoad: { 
						method: "getHtmlContent",
						content: scrollerHTML,
						manipulationMethod: "replace"
					}
		});
		
		console.log("Scrollers Started");
//	},0);
// 
//recalcScrollableArea();
startScroller();

	
}

function stopScroller(){ 
	$("#makeMeScrollable").smoothDivScroll("stopAutoScrolling");
}

function startScroller(){
	$("#makeMeScrollable.top").smoothDivScroll("startAutoScrolling");
	$("#makeMeScrollable.bottom").smoothDivScroll("startAutoScrolling");
}

function recalcScrollableArea(){
	$("#makeMeScrollable.top").smoothDivScroll("recalculateScrollableArea");
	$("#makeMeScrollable.bottom").smoothDivScroll("recalculateScrollableArea");
}

$.fn.redraw = function(){
  $(this).each(function(){
    var redraw = this.offsetHeight;
  });
};
/*$( "#makeMeScrollable" ).mousedown(function() {
  console.log("Click");
  $("#makeMeScrollable").smoothDivScroll("stopAutoScrolling");
});

$( "#makeMeScrollable" ).mouseup(function() {
  console.log("Un-Click");
  $("#makeMeScrollable").smoothDivScroll("startAutoScrolling");
});

$( "#makeMeScrollable2" ).mousedown(function() {
  console.log("Click");
  $("#makeMeScrollable2").smoothDivScroll("stopAutoScrolling");
});

$( "#makeMeScrollable2" ).mouseup(function() {
  console.log("Un-Click");
  $("#makeMeScrollable2").smoothDivScroll("startAutoScrolling");
});*/
