
var margin = {top: 30, right: 30, bottom: 70, left: 30},
    width_bar = 1060 - margin.left - margin.right,
    height_bar = 400 - margin.top - margin.bottom;

var svg_bar = d3.select("body").append("svg")
	.attr("width", width_bar + margin.left + margin.right)
    .attr("height", height_bar + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/world_score1.csv", function(error, data){

	// filter year
	var data = data.filter(function(d){return d;});
	// Get every column value
	var elements = Object.keys(data[0])
		.filter(function(d){
			return ( d != "name");
		});
	var selection = elements[0];

	var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d){
				return +d[selection];
			})])
			.range([height_bar, 0]);

	var x = d3.scale.ordinal()
			.domain(data.map(function(d){ return d.name;}))
			.rangeBands([0, width_bar]);


	var xAxis = d3.svg.axis()
		.scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
	    .orient("left");

	svg_bar.append("g")
    	.attr("class", "x axis")
    	.attr("transform", "translate(0," + height_bar + ")")
    	.call(xAxis)
    	.selectAll("text")
    	.style("font-size", "8px")
      	.style("text-anchor", "end")
      	.attr("dx", "-.8em")
      	.attr("dy", "-.55em")
      	.attr("transform", "rotate(-90)" );


 	svg_bar.append("g")
    	.attr("class", "y axis")
    	.call(yAxis);

	svg_bar.selectAll("rectangle")
		.data(data)
		.enter()
		.append("rect")
		.attr("class","rectangle")
		.attr("width", width_bar/data.length)
		.attr("height", function(d){
			return height_bar - y(+d[selection]);
		})
		.attr("x", function(d, i){
			return (width_bar / data.length) * i ;
		})
		.attr("y", function(d){
			return y(+d[selection]);
		})
		.append("title")
		.text(function(d){
			return d.name + " : " + d[selection];
		});

	var selector = d3.select("#drop")
    	.append("select")
    	.attr("id","dropdown")
    	.on("change", function(d){
        	selection = document.getElementById("dropdown");

        	y.domain([0, d3.max(data, function(d){
				return +d[selection.value];})]);

        	yAxis.scale(y);

        	d3.selectAll(".rectangle")
           		.transition()
	            .attr("height", function(d){
					return height_bar - y(+d[selection.value]);
				})
				.attr("x", function(d, i){
					return (width_bar / data.length) * i ;
				})
				.attr("y", function(d){
					return y(+d[selection.value]);
				})
           		.ease("linear")
           		.select("title")
           		.text(function(d){
           			return d.name + " : " + d[selection.value];
           		});
      
           	d3.selectAll("g.y.axis")
           		.transition()
           		.call(yAxis);

         });

    selector.selectAll("option")
      .data(elements)
      .enter().append("option")
      .attr("value", function(d){
        return d;
      })
      .text(function(d){
        return d;
      })


});
