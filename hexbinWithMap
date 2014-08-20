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
d3.csv("renewableStations.csv",function(data){ //renewable energy stations

console.log(data.length)
//set up the projection: 
var projection = d3.geo.mercator()
    .scale(1)
    .translate([0,0]);

var path = d3.geo.path()
    .projection(projection);

var ulPoint = projection(upperLeft), 
    brPoint = projection(bottomRight),
    s = 1 / Math.max((brPoint[0] - ulPoint[0]) / width, (brPoint[1] - ulPoint[1]) / height),
    t = [(width - s * (brPoint[0] + ulPoint[0])) / 2, (height - s * (brPoint[1] + ulPoint[1])) / 2];

// Update the projection to use computed scale & translate.
projection
    .scale(s)
    .translate(t);

//Initialize hexbin stuff:
var hexPoints = []

for (var i = 0; i<data.length; i++) {
	var point = projection([data[i].lon, data[i].lat])
	hexPoints.push(point)
}

var hexRadius = 10
var hexbin = d3.hexbin()
				.size([width, height])
				.radius(hexRadius);


var color = d3.scale.linear()
    .domain([0, 20])
    .range(["white", "steelblue"])
    .interpolate(d3.interpolateLab);



//Code to deal with a resizing of the WebThing:
var g = svg.append("g");

// d3.select(window).on('resize', function(){ resize() });

	// function resize() {
	//     width = parseInt(d3.select('body').style('width'));
	//     height = parseInt(d3.select('body').style('height'));
	//     //height = width * mapRatio;

	//     // resize the map container
	//     svg
	//         .attr('width', width)
	//         .attr('height', height);

	//     // update projection
	//     var ulPoint = projection(upperLeft), 
	//         brPoint = projection(bottomRight),
	//         s = 1 / Math.max((brPoint[0] - ulPoint[0]) / width, (brPoint[1] - ulPoint[1]) / height),
	//         t = [(width - s * (brPoint[0] + ulPoint[0])) / 2, (height - s * (brPoint[1] + ulPoint[1])) / 2];

	// // Update the projection to use computed scale & translate.
	//     projection
	//         .scale(s)
	//         .translate(t);t. 

	//     // resize the map
	//     g.selectAll('path').attr('d', path);
	    
	//     //move the data-nodes as well
	//     d3.selectAll("circle")
	//         .attr("cx",function(d){
	//             return projection([d.lon, d.lat])[0]
	//         })
	//         .attr("cy",function(d){
	//              return projection([d.lon, d.lat])[1]
	//         })
// }

// load and display the World
// d3.json("world-110m2.json", function(error, topology) {
//     g.selectAll("path")
//       .data(topojson.object(topology, topology.objects.countries)
//           .geometries)
//     .enter()
//       .append("path")
//       .attr("d", path)
//       .on("click", function(d){

//         console.log(projection.invert(path.bounds(d)[0])) //UL corner
//         console.log(projection.invert(path.bounds(d)[1])) //BR corner
//     })

  var hexagon = svg.append("g")
    .attr("class", "hexagons")
  .selectAll("path")
    .data(hexbin(hexPoints))
  .enter().append("path")
  	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .style("fill", function(d) { return color(d.length); })
    .attr("d", hexbin.hexagon(.1))
    .transition()
    .ease("log")
    .duration(2000)
    .attr("d", hexbin.hexagon(hexRadius - .5))

    

    // g.selectAll("circle")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //     .attr("r", 4)
    //     .attr("fill-opacity", 0.3)
    //     .attr("class", function(d){
    //         return d['Fuel Type Code']
    //     })
    //     .attr("fill",function(d){
    //         return colorChooser(d['Fuel Type Code'])
    //     })
    //     .attr("cx",function(d){
    //       return projection([d.lon, d.lat])[0]
    //     })
    //     .attr("cy",function(d){
    //       return projection([d.lon, d.lat])[1]
    //     })
    //     .on("mouseover",function(d){
    //         d3.select(this)
    //         .transition()
    //         .duration(400)
    //         .attr("r", 10)

    //         svg.append("text")
    //             .text(d['Street Address'] + ", " + d['City'] + ", " + d["State"])
    //             .attr("id", "plantNameText")
    //             .attr("x", 200)
    //             .attr("y",height - 350)
    //             .attr("text-anchor","start")
    //             .attr("fill","black")
    //             .attr("font-size", 20)
    //     })
    //     .on("mouseout",function(){
    //         d3.select(this)
    //         .transition()
    //         .duration(400)
    //         .attr("r",2)

    //         d3.selectAll("#plantNameText")
    //             .remove()
    //     })

// }); //the closing of the map load


svg.append("text")
    .text("Renewable energy filling stations")
    .attr("x", 15)
    .attr("y", 55)
    .attr("text-anchor","start")
    .attr("font-size", 25)

})

//Legend and selector stuff!

types = ['BD', 'CNG', 'E85', 'ELEC', 'HY', 'LNG', 'LPG']

var clicked = false

// //Makes legend circles!
// svg.selectAll("circle")
//     .data(types, function(d){return d}) 
//     .enter()
//     .append("circle")
//     .attr("class","legend")
//     .attr("id", function(d){
//         return d
//     })
//     .attr("r",15)
//     .attr("cx", 50)
//     .attr("cy", function(d,i){
//         return 200 + (i * 50)})
//     .attr("fill", function(d){
//         return colorChooser(d)
//     })
//     // .on("click", function(d){
//     //     if (clicked){ clicked = false} //reset clicked variable if already clicked
//     // })
//     .on("mouseover", function(d){
//         d3.select(this)
//             .transition()
//             .attr("r", 20)

//         var selected = d3.select(this).attr("id") //grab the type so it can be used

//         d3.select("g").selectAll("circle")
//             //.transition()
//             .attr("fill-opacity", 0.01)

//         d3.selectAll("." + selected)
//             .attr("r",8)
//             .attr("fill-opacity", 0.3)
//     })
//     .on("mouseout", function(d){
//         d3.select(this)
//             .transition()
//             .attr("r", 15)

//         d3.select("g").selectAll("circle")
//             .attr("r",4)
//             .attr("fill-opacity", 0.3)
//     })

// svg.selectAll("text")
//     .data(types, function(d){return d}) 
//     .enter()
//     .append("text")
//     .text(function(d){
//         return stationType(d) })
//     .attr("x", 75)
//     .attr("y", function(d,i){
//         return 200 + (i * 50)})
//     .attr("text-anchor","start")
//     .attr("font-size", 15)
//     .attr("font-family", "optima")

function colorChooser(type) {
    if            (type ===  "BD"){
            return "brown"
        } else if (type === "CNG"){
            return "blue"
        } else if (type === "LNG"){
            return "mediumturquoise"
        } else if (type === "E85"){
            return "gold"
        } else if (type === "ELEC"){
            return "darkmagenta"
        } else if (type === "HY"){
            return "red"
        } else { 
            return "black"
        }
}

// function stationType(type) {
//     if            (type ===  "BD"){
//             return "Bio Diesel"
//         } else if (type === "CNG"){
//             return "Compressed Natural Gas"
//         } else if (type === "LNG"){
//             return "Liquid Natural Gas"
//         } else if (type === "E85"){
//             return "Corn Ethanol"
//         } else if (type === "ELEC"){
//             return "Electric"
//         } else if (type === "HY"){
//             return "Hydrogen"
//         } else { 
//             return "Liquid Propane"
//         }
// }
