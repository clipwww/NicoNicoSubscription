$(function(){
		console.log("in ready js");
				var nicoHTML="";
				//var iframeHTML = new Array;
				var iframeHTML = [];
				var iframeURL = "http://ext.nicovideo.jp/thumb/";
				var aniInfo = "http://ext.nicovideo.jp/api/getthumbinfo/";
				var jumpSrc = "http://sp.nicovideo.jp/watch/";
				var nicoFlv = "http://flapi.nicovideo.jp/api/getflv/";

				$("#menu li[name]").click(getUserChannel);
				$("#menu li[id]").click(getNicoRank);
				$("#menu li[myList]").click(getMyList);
				$("button[name='Tag']").click(searchTagNico);
		console.log($("#menuIcon"));
				$("#main").on({
					click: function(e){
						var msg = $(this).parent("p").siblings("div").children('.nico-description').text();
						$("#jumpMsg").css({
							"top": e.screenY -65,
							"left": e.screenX -30
						}).fadeIn(500);
						$("#jumpMsg span:eq(1)").text(msg);
					}
				},".nicoBox img");

				$("#main").on({
					click: function(){
						var iframeNum = $(this).attr("name");
						$(this).siblings().fadeToggle(0);
						$(this).siblings("div#iFra").text("").toggleClass('hide').append(iframeHTML[ iframeNum ]);
					}
				},".nicoBox h1");

				$("#main").on({
					click: function(){
						var jumpHref = $(this).attr("href");
						$("#jumpMsg").fadeOut(500);
						$("#jumpIframe").attr("src", jumpHref);
						$("#jumoVideo").fadeIn(500);
						return false;
					}
				},".nicoBox a");
				$("#closJumpIfr").click(function(){
					$("#jumoVideo").fadeOut(500);
					$("#jumpIframe").attr("src", "");
				});

				$(window).scroll(function() {
					$("#jumpMsg").fadeOut(500);
				});

				$("#menuIcon").click(function(){
					console.log("in #menuIcon");
					if( $("header").css("top") === "0px" ){
						$("header").animate({"top":"-440px"}, 600);
					}else{
						$("header").animate({"top":0}, 600);
					}
				});
				$("#main, #menu, button").click(function(){
					$("header").animate({"top":"-440px"}, 600);
				});



				function getNicoRank(){
					var target = "fav";
					var time = $(this).attr("id");
					var Category = "all";
					var rankLink = "http://www.nicovideo.jp/ranking/"+ target +"/"+ time +"/"+ Category +"?rss=2.0";
					
					var rankURL = [
				    	"http://query.yahooapis.com/v1/public/yql",
				        "?q=" + encodeURIComponent("select * from xml where url='" + rankLink + "'"),
				        "&format=json&callback=?"
			    	].join("");

					$.getJSON(rankURL, function(data){
						var title = data.query.results.rss.channel.title;
						var anime = data.query.results.rss.channel.item;
						$("header #pageName").text(title);
						$("#main").text("");
						iframeHTML.length=0;

						var maxAnime = 99;
						$.each(anime, function(i, douGa){
							if(i < maxAnime){
								var title = douGa.title;
								var link = douGa.link;
								var num_of_cut = link.indexOf("watch/");
								var aniSrc = link.substring(num_of_cut+6, link.length);
								title = title.split("：");

								var temp = douGa.description;
								temp = temp.split("\n");
								var aniImg = temp[1];
								var descrip = temp[2]
								temp[3] = temp[3].split("<br/>");
								var viewNum = temp[3][1];
								temp[3][0]	= temp[3][0].split("｜");
								var pts = temp[3][0][0];
								var upTime = temp[3][0][2];
								upTime = upTime.replace(" 投稿", "");

								iframeHTML.push("<iframe src=\""+ iframeURL + aniSrc +"\" width=\"100%\" height=\"300px\" frameborder=\"0\" scrolling=\"no\"></iframe>"); 

								num_of_cut = viewNum.indexOf("再生");
								var x = viewNum.indexOf("コ");
								viewNum = viewNum.substring(num_of_cut, x);

								nicoHTML += "<div class=\"col-sm-4\"><div class=\"nicoBox\">";
								nicoHTML += "<h1 class=\"btn btn-block "+(i===0 ? "btn-danger":"btn-info")+"\"";
								nicoHTML +=	"name=\""+ i +"\">";
								nicoHTML += title[0] +"</h1><div id=\"iFra\" class=\"hide\"></div>";
								nicoHTML +=	"<p class=\"title\">" + title[1] + "</p><hr/>";
								nicoHTML += "<a href=\""+ jumpSrc + aniSrc +"\" >點我看影片</a>";
								nicoHTML += "<div class=\"hide\">"+ descrip + "</div>";
								nicoHTML += pts + "</small></p>" + aniImg + "<p>" + viewNum + "</p>";
								nicoHTML +=	"<hr/><span>投稿時間:</span> " + upTime.replace(/：/g,":");						
								nicoHTML +=	"</div></div>";

								if( (i+1) % 3 === 0){
									$("<div/>",{
										"class":"row"
									}).appendTo('#main').append(nicoHTML);
									nicoHTML = "";
								}//end if
							}//end if
						});//end each
					});//end getJSON
				}//end function

				function getUserChannel(){
					var userID = $(this).attr("name");
					var uChannel = "http://www.nicovideo.jp/user/"+ userID +"/video?rss=2.0";

					var userURL = [
				    	"http://query.yahooapis.com/v1/public/yql",
				        "?q=" + encodeURIComponent("select * from xml where url='" + uChannel + "'"),
				        "&format=json&callback=?"
			   	 	].join("");

					$.getJSON( userURL, function(data){
						var title = data.query.results.rss.channel.title;
						var anime = data.query.results.rss.channel.item;
						$("header #pageName").text(title);
						$("#main").text("");
						iframeHTML.length=0;

						var maxAnime = 15;
						$.each(anime, function(i, douGa){
							if(i < maxAnime){
								var title = douGa.title;
								var link = douGa.link;
								var num_of_cut = link.indexOf("watch/");
								var aniSrc = link.substring(num_of_cut+6, link.length);

								var temp = douGa.description;

								temp = temp.split("\n");
								var aniImg = temp[1];
								var descrip = temp[2]
								temp[3] = temp[3].split("｜");
								var videoTime = temp[3][0];
								var upTime = temp[3][1];
								videoTime = videoTime.replace('class="nico-info-length">','>長度: ' );
								upTime = upTime.replace(" 投稿", "");

								iframeHTML.push("<iframe src=\""+ iframeURL + aniSrc +"\" width=\"100%\" height=\"280px\" frameborder=\"0\" scrolling=\"no\"></iframe>"); 		

								nicoHTML += "<div class=\"col-sm-4\"><div class=\"nicoBox\">";
								nicoHTML += "<h1 class=\"btn btn-block "+(i===0 ? "btn-danger":"btn-info")+"\"";
								nicoHTML +=	"name=\""+ i +"\">";
								nicoHTML += (i===0 ? "最新！": i+1) +"</h1><div id=\"iFra\" class=\"hide\"></div>";
								nicoHTML +=	"<p class=\"title\">" + title[1] + "</p><hr/>";
								nicoHTML += "<a href=\""+ jumpSrc + aniSrc +"\" >點我看影片</a>";
								nicoHTML += "<div class=\"hide\">"+ descrip + "</div>";
								nicoHTML += aniImg + "<p><p>"+ videoTime +"</p>";
								nicoHTML +=	"<hr/><span>投稿時間:</span> "+ upTime.replace(/：/g,":");	
								nicoHTML +=	"</div></div>";

								if( (i+1) % 3 === 0){
									$("<div/>",{
										"class":"row"
									}).appendTo('#main').append(nicoHTML);
									nicoHTML = "";
								}//end if
							}//end if
						});//end each
					});//end getJSON
				}//end function

				function searchTagNico(){
					var tag;
					if( $("#what").val() === "" && $("#Tag").val() === "" ){
						$("#pageName").text("沒有搜尋目標找屁找");
						return false;
					}else if( $("#what").val() !== "" && $("#Tag").val() === "" ){
						tag = $("#what").val();
					}else if( $("#Tag").val() !== "" &&  $("#what").val() === "" ){
						tag = $("#Tag").val();
					}else{
						$("#pageName").text("搜尋起衝突了，請選擇一邊即可");
						return false;
					}
					
					var sort = $("#Sort").val();
					var searLink = "http://www.nicovideo.jp/tag/"+ tag +"?"+ sort +"&rss=2.0";
					
					var searURL = [
				    	"http://query.yahooapis.com/v1/public/yql",
				        "?q=" + encodeURIComponent("select * from xml where url='" + searLink + "'"),
				        "&format=json&callback=?"
			   	 	].join("");
			   	 	console.log(searURL);

					$.getJSON( searURL, function(data){
						var title = data.query.results.rss.channel.title;
						var anime = data.query.results.rss.channel.item;
						$("header #pageName").text(title);
						$("#main").text("");
						iframeHTML.length=0;

						var maxAnime = 30;
						$.each(anime, function(i, douGa){
							if(i < maxAnime){
								var title = douGa.title;
								var link = douGa.link;
								var num_of_cut = link.indexOf("watch/");
								var aniSrc = link.substring(num_of_cut+6, link.length);

								var temp = douGa.description;

								temp = temp.split("\n");
								var aniImg = temp[1];
								var descrip = temp[2]
								temp[3] = temp[3].split("｜");
								var videoTime = temp[3][0];
								var upTime = temp[3][1];
								videoTime = videoTime.replace('class="nico-info-length">','>長度: ' );
								upTime = upTime.replace(" 投稿", "");

								iframeHTML.push("<iframe src=\""+ iframeURL + aniSrc +"\" width=\"100%\" height=\"280px\" frameborder=\"0\" scrolling=\"no\" class=\"miniIfeame\" ></iframe>"); 		

								nicoHTML += "<div class=\"col-sm-4\"><div class=\"nicoBox\">";
								nicoHTML += "<h1 class=\"btn btn-block "+(i===0 ? "btn-danger":"btn-info")+"\"";
								nicoHTML +=	"name=\""+ i +"\">";
								nicoHTML += (i+1) +"</h1><div id=\"iFra\" class=\"hide\"></div>";
								nicoHTML +=	"<p class=\"title\">" + title + "</p><hr/>";
								nicoHTML += "<a href=\""+ jumpSrc + aniSrc +"\" >點我看影片</a>";
								nicoHTML += "<div class=\"hide\">"+ descrip + "</div>";
								nicoHTML += aniImg + videoTime;
								nicoHTML +=	"<hr/><span>投稿時間:</span> "+ upTime.replace(/：/g,":");
								nicoHTML +=	"</div></div>";

								if( (i+1) % 3 === 0){
									$("<div/>",{
										"class":"row"
									}).appendTo('#main').append(nicoHTML);
									nicoHTML = "";
								}//end if
							}//end if
						});//end each
					});//end getJSON
				}//end function

				function getMyList(){	
					var listID = $(this).attr("myList");
					var listLink = "http://www.nicovideo.jp/mylist/"+ listID +"?rss=2.0";
					
					var listURL = [
				    	"http://query.yahooapis.com/v1/public/yql",
				        "?q=" + encodeURIComponent("select * from xml where url='" + listLink + "'"),
				        "&format=json&callback=?"
			   	 	].join("");
			   	 	console.log(listURL);

					$.getJSON( listURL, function(data){
						var title = data.query.results.rss.channel.title;
						var anime = data.query.results.rss.channel.item;
						$("header #pageName").text(title);
						$("#main").text("");
						iframeHTML.length=0;

						var maxAnime = 9;
						$.each(anime, function(i, douGa){
							if(i < maxAnime){
								var title = douGa.title;
								var link = douGa.link;
								var num_of_cut = link.indexOf("watch/");
								var aniSrc = link.substring(num_of_cut+6, link.length);

								var descrip = douGa.description;

								iframeHTML.push("<iframe src=\""+ iframeURL + aniSrc +"\" width=\"100%\" height=\"280px\" frameborder=\"0\" scrolling=\"no\" class=\"miniIfeame\" ></iframe>"); 		

								nicoHTML += "<div class=\"col-sm-4\"><div class=\"nicoBox\">";
								nicoHTML += "<h1 class=\"btn btn-block btn-info\"";
								nicoHTML +=	"name=\""+ i +"\">";
								nicoHTML += (i+1) +"</h1><div id=\"iFra\" class=\"hide\"></div>";
								nicoHTML +=	"<p class=\"title\">" + title + "</p><hr/>";
								nicoHTML += "<a href=\""+ jumpSrc + aniSrc +"\" >點我看影片</a>";
								nicoHTML += "<div>"+ descrip + "</div>";
								nicoHTML +=	"</div></div>";

								if( (i+1) % 3 === 0){
									$("<div/>",{
										"class":"row"
									}).appendTo('#main').append(nicoHTML);
									nicoHTML = "";
								}//end if
							}//end if
						});//end each
					}).done(function(){
						$(".nico-description").addClass("hide");
					});//end getJSON
				}//end function


			});//end ready