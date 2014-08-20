//values I expect sluice to give me"
var upperLeft = [-151,58], 
    bottomRight =[-54,10.5];

var margin = {top: 0, left: 0, bottom: 0, right: 0}
  , width = parseInt(d3.select('body').style('width'))
  , mapRatio = (9/16)
  , height = width * mapRatio;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//////////////////////////////////////////////////////////////////////////////////
d3.csv("renewableStations.csv",function(data){ 
  
    var projection = d3.geo.mercator()   //set up the projection: 
        .scale(1)
        .translate([0,0]);

    var path = d3.geo.path()
        .projection(projection);

    var ulPoint = projection(upperLeft), 
        brPoint = projection(bottomRight),
        s = 1 / Math.max((brPoint[0] - ulPoint[0]) / width, (brPoint[1] - ulPoint[1]) / height),
        t = [(width - s * (brPoint[0] + ulPoint[0])) / 2, (height - s * (brPoint[1] + ulPoint[1])) / 2];

    projection     //Update the projection to use computed scale & translate.
        .scale(s)
        .translate(t);

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

    var color = d3.scale.linear()
        .domain([0, 20])
        .range(["white", "steelblue"])
        .interpolate(d3.interpolateLab);

    var hexagon = svg.append("g")
        .attr("class", "hexagons")
      .selectAll("path")
        .data(hexbin(hexPoints))
      .enter().append("path")
	      .on("mouseover",function(d){
	     	svg.selectAll("path")
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
        .transition()
        .ease("log")
        .duration(2000)
        .attr("d", hexbin.hexagon(hexRadius - .5))
        
})