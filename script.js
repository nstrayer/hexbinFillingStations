var width = 1200,
    height = 700,
    centered;

var svg = d3.select("#visualization").append("svg")
    .attr("width", width)
    .attr("height", height)

//////////////////////////////////////////////////////////////////////////////////
d3.csv("renewableStations.csv",function(data){ 
  
    var projection = d3.geo.albersUsa()
        .scale(1000)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var hexPoints = convertPoints(data) //Initialize hexbin stuff:

    function convertPoints(coordData){
    	var pixelData = []
	    for (var i = 0; i<coordData.length; i++) {
	    	var point = projection([coordData[i].lon, coordData[i].lat])
	    	pixelData.push(point)
	    	}
    	return pixelData
	}

    var hexRadius = 12

    var hexbin = d3.hexbin()
		.size([width, height])
		.radius(hexRadius);

    function initializeHexbins(){
        d3.select(".hexagons")
            .selectAll("path")
            .transition()
            .ease("log")
            .duration(2000)
            .attr("d", hexbin.hexagon(hexRadius - .5))
    }

    var color = d3.scale.linear()
        .domain([0, 20])
        .range(["white", "steelblue"])
        .interpolate(d3.interpolateLab);

    var g = svg.append("g");

    d3.json("us-10m.json", function(error, us) {

      g.append("g")
          .attr("id", "states")
        .selectAll("path")
          .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
          .attr("d", path)

      g.append("path")
          .datum(topojson.mesh(us, us.objects.states))
          .attr("id", "state-borders")
          .attr("d", path);
     

    var hexagon = svg.append("g")
        .attr("class", "hexagons")
      .selectAll("path")
        .data(hexbin(hexPoints))
      .enter().append("path")
	      .on("mouseover",function(d){
	     	d3.selectAll(".hexagons").selectAll("path") 
					.sort(function (a, b) { 
				      if (a != d) {return -1
				      } else {return 1}                           
				  		})

	        	d3.select(this)
	        		.classed("top",true)
		        	.transition()
				    .ease("log")
				    .duration(300)
				    .attr("d", hexbin.hexagon(hexRadius + 10))
	        })
	      .on("mouseout", function(d){
	        	d3.select(this)
	        		.classed("top",false)
		        	.transition()
				    .ease("log")
				    .duration(300)
				    .attr("d", hexbin.hexagon(hexRadius - .5))
				})
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style("fill", function(d) { return color(d.length); })
        .attr("d", hexbin.hexagon(.1))


 }); //closes the json map load 

    svg.classed("blurred",true)

    var intro = d3.select("#intro")
                    .attr("width", 400)

    //Define a blur filter 
    var filter = svg.append("defs")
      .append("filter")
        .attr("id", "blur")
      .append("feGaussianBlur")
        .attr("stdDeviation", 5);

    //Allow user to move forward on click.  
    d3.select("#continueText")
        .on("click", function(d){
            svg.classed("blurred", false)
            intro.remove()
            initializeHexbins() 

    })
})