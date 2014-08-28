var width = 1200,
    height = 700,
    centered;

var svg = d3.select("#visualization").append("svg")
    .attr("width", width)
    .attr("height", height)

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([(width*3) / 5, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var hexRadius = 15

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

queue()
        .defer(d3.json,"us-10m.json")
        .defer(d3.csv,"renewableStations.csv")
        .await(ready);

function ready(error, us, data) {

    for (var i = 0; i < data.length; i++){
        data[i][0] = projection([data[i].lon,data[i].lat])[0]
        data[i][1] = projection([data[i].lon,data[i].lat])[1]
    }

    var maxBinSize = d3.max(hexbin(data), function(d){return d.length;})
    var minBinSize = d3.min(hexbin(data), function(d){return d.length;})

    var color = d3.scale.log()             //update color scale with filtered color. 
        .domain([minBinSize, maxBinSize])
        .range(["white", "orangered"])
        .interpolate(d3.interpolateLab);

    var g = svg.append("g");

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

    svg.append("g")
        .attr("class", "hexagons")
      .selectAll("path")
        .data(hexbin(data))
      .enter().append("path")
          .on("mouseover", function(d){
              d3.select(this)
                .transition()
                .duration(50)
                .style("fill", "blue")
          })
          .on("mouseout", function(d){
              d3.select(this)
                .transition()
                .duration(2500)
                .style("fill", function(d) { return color(d.length); })
          })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style("fill", function(d) { return color(d.length); })
        .attr("d", hexbin.hexagon(.1))

    function filteredData(type){
        if (type === "All"){
            return hexbin(data);
        } else {
            var newData = []
            for (var i = 0; i<data.length; i++){
                if (data[i]["Fuel Type Code"] === type) {
                    newData.push(data[i])
                }
            }
            return hexbin(newData);
        }
    }
    
    //take hexagons, shrink them then remove them, after that load up again with new dataset. 
    function updateVis(type){

        var newData = filteredData(type)

        maxBinSize = d3.max(newData, function(d){return d.length;})
        minBinSize = d3.min(newData, function(d){return d.length;})

        color
            .domain([minBinSize, maxBinSize])
            .range(["white", colorChooser(type)])
            .interpolate(d3.interpolateLab);


        d3.selectAll(".hexagons")     //Get rid of old vis
            .selectAll("path")
            .transition()
            .ease("log")
            .duration(1000)
            .attr("d", hexbin.hexagon(0))
            .remove()

        setTimeout(function(){                //after transition is complete call the makenewvis function, also remove the hexagons g. 
            d3.select(".hexagons").remove()
            makeNewVis()}, 1100)
        

        function makeNewVis(){

            svg.append("g")                 //reload the new data. 
                .attr("class", "hexagons")
              .selectAll("path")
                .data(newData)
              .enter().append("path")
                  .on("mouseover", function(d){
                      d3.select(this)
                        .transition()
                        .duration(50)
                        .style("fill", "blue")
                  })
                  .on("mouseout", function(d){
                      d3.select(this)
                        .transition()
                        .duration(2500)
                        .style("fill", function(d) { return color(d.length); })
                  })
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                .style("fill", function(d) { return color(d.length); })
                .attr("d", hexbin.hexagon(0.1))
                .transition()
                .ease("log")
                .duration(1000)
                .attr("d", hexbin.hexagon(hexRadius - .5))
        }
    }

    // Legend Stuff ----------------------------------------------------------------------

    types = ['All','BD', 'CNG', 'E85', 'ELEC', 'HY', 'LNG', 'LPG']


    svg.selectAll("text")
        .data(types, function(d){return d})
        .enter()
        .append("text")
        .attr("class", "legendText")
        .attr("id", function(d){return d})
        .text(function(d){
            return stationType(d) })
        .attr("x", 90)
        .attr("y", function(d,i){
            return 200 + (i * 50)})
        .attr("text-anchor","start")
        .attr("font-size", 15)
        .attr("font-family", "optima")
        .attr("fill", function(d){return colorChooser(d)})
        .on("click", function(d){
            d3.selectAll(".legendText")
                .classed("selected",false)
            d3.select(this)
                .classed("selected",true)
                .classed("hovered", false)

            d3.select("#showMe")
                .transition()
                .attr("y", d3.select(this).attr("y"))

            updateVis(d3.select(this).attr("id"))
        })
        .on("mouseover",function(d){
            if(!d3.select(this).classed("selected")){
            d3.select(this).classed("hovered", true)
        }
        })
        .on("mouseout",function(d){
            d3.select(this).classed("hovered", false)
        })

    d3.select(".legendText")
        .classed("selected", true)

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
            } else if (type === "All"){
                return "orangered"
            }else { 
                return "black"
            }
    }

    function stationType(type) {
        if            (type ===  "BD"){
                return "Bio Diesel"
            } else if (type === "CNG"){
                return "Compressed Natural Gas"
            } else if (type === "LNG"){
                return "Liquid Natural Gas"
            } else if (type === "E85"){
                return "Corn Ethanol"
            } else if (type === "ELEC"){
                return "Electric"
            } else if (type === "HY"){
                return "Hydrogen"
            } else if (type === "All"){
                return "All"
            } else { 
                return "Liquid Propane"
            }
    }
}//end of ready function

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

svg.append("text")
    .attr("text-anchor","start")
    .attr("font-size", 35)
    .attr("font-family","optima")
    .attr("x", 15)
    .attr("y", 55)
    .text("Alternative Fuel Filling Stations")


var howTo = ["Show me"]

svg.selectAll("text")
    .data(howTo, function(d){return d})
    .enter()
    .append("text")
    .attr("text-anchor","start")
    .attr("font-size", 20)
    .attr("font-family","optima")
    .attr("id","showMe")
    .attr("x", 1)
    .attr("y", 200)
    .text(function(d){return d})




