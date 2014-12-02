$(document).ready(function(){
  $('a[href^="#"]').on('click',function (e) {
      e.preventDefault();

      var target = this.hash,
      $target = $(target);

      $('.parallax').stop().animate({
          'scrollTop': $target.offset().top
      }, 2500, 'easeInOutSine', function () {
          window.location.hash = target;
      });
  });

  addContent();
  drawTravelPath(tripdata);
  blurOnHover();
  
  //Scroll reveal
   new WOW().init();
   // $('.day').addClass("hidden").viewportChecker({
   //      classToAdd: 'visible animated fadeIn',
   //      offset: 100
   //  });

  // The image carousel
  $(".divCarousel").owlCarousel({
 
      // autoPlay: 3000, //Set AutoPlay to 3 seconds
      items : 4,
      itemsDesktop : [1199,3],
      itemsDesktopSmall : [979,3],
      // itemsScaleUp : true,
      navigation : true,
      navigationText : ['<i class="fa fa-angle-left fa-5x"></i>','<i class="fa fa-angle-right fa-5x"></i>'],
      mouseDrag : false
  });

});

function addCarousel(groupId){

}

function blurOnHover(){
//Summary blur starts
  var $container  = $('.ib-container'),
    $articles   = $container.children('article'),
    timeout;
  
  $articles.on( 'mouseenter', function( event ) {
    var $article    = $(this);
    clearTimeout( timeout );
    timeout = setTimeout( function() {
         
        if( $article.hasClass('active') ) return false;
         
        $articles.not($article).removeClass('active').addClass('blur');
         
        $article.removeClass('blur').addClass('active');
         
    }, 75 );});
 
  $container.on( 'mouseleave', function( event ) {
    clearTimeout( timeout );
    $articles.removeClass('active blur');
  });
  // The summary blur ends
}

function scrollTopTween(scrollTop) {
  return function() {
    var i = d3.interpolateNumber(this.scrollTop, scrollTop);
    return function(t) { this.scrollTop = i(t); };
 };
}

function addContent(){
// Grab all the placeholders
 var mainContents = d3.selectAll(".divContent").data(tripdata.details); 
// Attach the titles and subtitles
 mainContents.append("div") 
             .attr("class","title")
             .html(function(d,i){return d.title;})
             .append("div").attr("class","sub-title").html(function(d,i){ return d.subtitle;});

  var addContents = d3.selectAll(".additional_content").data(tripdata.details); // Grab all the additional content
// Attach the back link
  addContents.append("span") 
             .attr("class","icon-wrap topbar")
             .attr("data-group",function(d,i){ return "group0"+(i+1);})
             .html(function(d,i){
              return '<i class="fa fa-angle-left fa-4x"></i>';
             })
             .on("click",function(){
                // On Click add the other details
                var thisGroup = $(this).attr("data-group");
                // Show the link for Details and navigation bar
                $("a.next").removeClass("displayHide");
                $(".side_nav").removeClass("displayHide");
                         
                // Shrink the main div into the top bar
                $("#"+thisGroup+" > .divContent")
                  .animate({ height:'100%'},800);
                $("#"+thisGroup+" > .parallax__layer--back")
                  .animate({ height:'100%'},800);  
                $("#"+thisGroup+" > .parallax__layer--back").removeClass("topbar");
                $("#"+thisGroup+" > .parallax__layer--deep")
                  .animate({ height:'100%'},800);  
                $("#"+thisGroup+" > .parallax__layer--deep").removeClass("topbar");
                
                // Animate the title to the center
                $("#"+thisGroup).find("div.title").removeClass("topbar");
                $("#"+thisGroup).find("div.sub-title").removeClass("topbar");

                // Hide the details page
                $(".additional_content").addClass("displayHide");
                $(".additional_content").removeClass("displayShow");

                //Show all other places
                $(".parallax__group").removeClass("displayHide");


                //$("#"+$(this).attr("data-group")).addClass("displayHide");
                });
// Add the country title
  addContents.append("h1").attr("class","country").text(function(d){ return d.moredetailsinfo.title; });
//Add the summary
var secIB = addContents.append("div").attr("class","divSummary").append("section").attr("class","ib-container");
    secIB.selectAll("article").data(function(d){ return d.moredetailsinfo.summary;})
         .enter()
         .append("article")
         .html(function(d,i){
            if(i == 0 ){ return '<i class="fa fa-usd fa-5x"></i>'+d.total;}
            else if(i == 1 ){ return d.days+'<i class="fa fa-sun-o fa-3x"></i>'+d.nights+'<i class="fa fa-moon-o fa-3x"></i>';}
            else { return d.def;}
         });

// Add the days
  var days = addContents.selectAll("div.day").data(function(d){ return d.moredetailsinfo.days; });
  var carousel = days.enter().append("div").attr("class","day");
      carousel.append("h4").text(function(d){ return d.title ;})
      carousel.append("p").attr("class","content").text(function(d){ return d.content ;})
      carousel = carousel.append("div").attr("class","divCarousel");
// Add the Carousel Items
var carouselItems = carousel.selectAll("div.item").data(function(d){ return d.captions; });
    carouselItems.enter().append("div").attr("class","item").html(function(d,i,j){ 
      if(j <=1 )
        return '<figure class="effect-julia"><img src="assets/pics/0/'+j+'_'+i+'.jpg" alt="Iceland"/><figcaption><div><p>'+d+'</p></div></figcaption></figure>';});

// Now add the "More Details link"
var innerA = mainContents.append("section").attr("class",function(d,i){ return "color-"+d.id})
            .append("nav").attr("class","nav-growpop")
            .append("a").attr("class","next").attr("href","#").attr("data-group",function(d,i){ return "group0"+(i+1);});

      innerA.append("span").attr("class","icon-wrap").html('<i class="fa fa-angle-right fa-4x"></i>');
      innerA.append("div").html(function(d,i){ return '<span>More Info</span><h3>'+d.moredetailsinfo.title+'</h3><img src="'+d.images.moredetailsthumbnail+'" alt="Next thumb"/>'});
      
      innerA.on("click",function(){
        // On Click add the other details
        var thisGroup = $(this).attr("data-group");
        // Hide the nav bar and navigation bar
        $(this).addClass("displayHide");
        $(".side_nav").addClass("displayHide");

        //Hide all other places
        $(".parallax__group").each(function(){
          if ($(this).attr("id") != thisGroup) {
            $(this).addClass("displayHide");
          }
        });

        // Shrink the main div into the top bar
        $("#"+thisGroup+" > .divContent")
          .animate({ height:'100px'},800);
        $("#"+thisGroup+" > .divContent").addClass("topbar");
        $("#"+thisGroup+" > .parallax__layer--back")
          .animate({ height:'100px'},800);  
        $("#"+thisGroup+" > .parallax__layer--back").addClass("topbar");
        $("#"+thisGroup+" > .parallax__layer--deep")
          .animate({ height:'100px'},800);  
        $("#"+thisGroup+" > .parallax__layer--deep").addClass("topbar");
        
        // Animate the title to the center
        $("#"+thisGroup).find("div.title").addClass("topbar");
        $("#"+thisGroup).find("div.sub-title").addClass("topbar");

        // Show the details page
        $("."+thisGroup).removeClass("displayHide");
        $("."+thisGroup).addClass("displayShow");


        //$("#"+$(this).attr("data-group")).addClass("displayHide");

        });

}

function tweenRotate(d, i, a) {
      return d3.interpolateString("rotate(30)", "rotate(0)");
    }

function drawTravelPath(tripdata){

  var svgTravel = d3.select(".side_nav").append("svg");
  var svgWidth = 100;
  var svgHeight = 1000;
  var circleRadius = 25;
  var space = 2 * circleRadius + 80;

  svgTravel.attr("width",svgWidth).attr("height",svgHeight);

  var gCircles = svgTravel.append("g").attr("class","gCircles").attr("transform","translate(0,-80)");
 
  var defs = svgTravel.selectAll("defs").data(tripdata.details);
      defs.enter().append("defs").append("pattern").attr("id",function(d,i){return "flag-"+d.id;}).attr('x', 0).attr("y",0)
                    .attr('width', 50).attr('height', 50)
                   .append("image")
                    .attr("xlink:href", function(d,i){ return d.images.flag; })
                    .attr("x",6).attr("y",6).attr('width', 37).attr('height', 37);

// Show the tooltip
var gTooltip = gCircles.append("g").attr("class","d3tooltip").style({"opacity" : 0}).append("g").attr("class","d3tt");
    gTooltip.append("svg:path").attr("width","75px").attr("height","75px").attr("d","M80,0c0,0-5.631,14.445-25.715,27.213C29.946,42.688,12.79,33.997,3.752,30.417  c-3.956-1.567-4.265,1.021-2.966,3.814C16.45,67.934,80,79.614,80,79.614l0,0V0z").attr("transform","translate(-25,-25)");
    gTooltip.append("svg:rect").attr("x",0).attr("y",-30).attr("rx",20).attr("ry",20).attr("width","150px").attr("height","100px");
    gTooltip.append("text").text("Testing yo").attr("x",20).attr("y",10);
    gTooltip.attr("transform","rotate(30,-25,-5)");

var circlePlaces = gCircles.selectAll("circle").data(tripdata.details);
circlePlaces.enter().append("svg:circle")
                      .attr("cx", 50)
                      .attr("cy",function(d,i){ return (i+1) * space ;})
                      .attr("r", circleRadius)
                      .style("stroke",function(d,i){ return "saddlebrown"; })
                      .style("stroke-width", 1)
                      .style("fill",function(d,i){ return "url(#flag-"+d.id+")"})
                     .on("mouseover",function(d,i){
                        d3.select(this).style("stroke-width", 3);
                        d3.select(this).style("cursor", "pointer");
                        // Tooltip animation
                        svgTravel.attr("width",svgWidth + 150);
                        d3.select("g.d3tooltip").attr("transform", "translate(100,"+((i+1) * space)+")" );
                        d3.select("g.d3tooltip").transition().duration(800).style("opacity",1);
                        d3.select("g.d3tt").transition().duration(600).attr("transform","rotate(0)");
                                                        
                        gTooltip.select("text").text( d.title );
                      })
                      .on("mouseout",function(d,i){
                        svgTravel.attr("width",svgWidth);
                        d3.select(this).style("stroke-width", 1);
                        d3.select("g.d3tooltip").style("opacity",0); // Tooltip animation
                        d3.select("g.d3tt").attr("transform","rotate(30,-25,-5)"); // Tooltip animation
                      })
                      .on("click",function(d,i){ // Animate scroll on clicking the country flag
                        var scrollable = d3.select("#group01");
                        var scrollheight = scrollable.property("scrollHeight") * (d.id - 1);
                        d3.select(".parallax").transition().duration(2000)
                                .tween("uniquetweenname", scrollTopTween(scrollheight));
                      });
                      

var gPlaces = svgTravel.append("g").attr("class","gPath").attr("transform","translate(0,-80)")
                       .style("stroke","black").style("stroke-width", 1).style("fill","white").style("opacity",0.5);
var pathPlaces = gPlaces.selectAll("path").data(tripdata.details);

pathPlaces.enter().append("path") // Add the curved path between circles
                      .attr("d",function(d,i){
      
                        if(d.transport_to == "flight" && i > 0 ) {
                            var ypos_from = (i) * space + circleRadius;
                            var ypos_to = (i+1) * space - circleRadius;  
                            var arc = "M50,"+ypos_from+"A 500,175 0 0,1 50,"+ypos_to ;    
                            return arc;
                        }
                        else if (d.transport_to == "train") {
                          var ypos_from = (i) * space + circleRadius;
                          var ypos_to = (i+1) * space - circleRadius;  
                          var line = "M45,"+ypos_from+"V "+ypos_to+"M55,"+ypos_from+"V "+ypos_to;
                          return line;
                        }
                      });
                      
var imageTransport = gPlaces.selectAll("image").data(tripdata.details);

imageTransport.enter().append("image")
                      .attr("xlink:href",function(d,i) {
                         if(d.transport_to == "flight" && i > 0 ) {
                          return "assets/icons/path-flight.svg";
                        }
                        else if(d.transport_to == "train" && i > 0 ) {
                          return "assets/icons/path-train.svg";
                        }
                      })
                      .attr("x",function(d,i){
                        if(d.transport_to == "flight" && i > 0 ) {
                          return 50;
                        }
                        else if(d.transport_to == "train" && i > 0 ) {
                          return 36;
                        }
                      })
                      .attr("y",function(d,i){
                        // if(d.transport_to == "flight" && i > 0 ) {
                          var ypos = (i) * space + circleRadius + 25;
                          return ypos;
                        // }
                      })
                      .attr("height", 30).attr("width",30)
                      .attr("class",function(d,i){
                          return  "imgPath"+d.transport_to;
                        })
                      .on("mouseover",function(d,i){
                      console.log("yup");
                      });



}