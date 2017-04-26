function draw(json){

    function nodeCount(node) {
        var total = 0;
        for (var n in node.children){
            total += nodeCount(node.children[n]);
        }
        return total+1;
    }    
    var nc = nodeCount(json);
    // console.log(json);
    // console.log();

    // Create a svg canvas
    d3.selectAll("#viz > *").remove();
    var vis = d3.select("#viz").append("svg:svg")
        .attr("width", 900)
        .attr("height", nc*10)
        .append("svg:g")
        .attr("transform", "translate(40, 0)");

    // Create a cluster "canvas"
    var cluster = d3.layout.tree()
        .size([nc*10,900]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y*0.8, d.x]; });

    var nodes = cluster.nodes(json);

    var links = cluster.links(nodes);

    var link = vis.selectAll("pathlink")
        .data(links)
        .enter().append("svg:path")
        .attr("class", "link")
        .attr("d", diagonal)

    var node = vis.selectAll("g.node")
        .data(nodes)
        .enter().append("svg:g")
        .attr("transform", function(d) { return "translate(" + d.y*0.8 + "," + d.x + ")"; })

    // Add the dot at every node
    node.append("svg:circle")
        .attr("r", 3.5);

    node.append("svg:text")
        .attr("dx", function(d) { return d.children ? -8 : 8; })
        .attr("dy", 3)
        .attr("fill", function(d) {
            if(d.value && d.value>0){
                return "red";
            }
        })
        .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .text(function(d) { return d.name+(d.value?('-'+d.value):''); })

}