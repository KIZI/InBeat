function getParameterByName(name){
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if(results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}
// Create a svg canvas
var vis = d3.select("#viz").append("svg:svg")
    .attr("width", 900)
    .attr("height", 3500)
    .append("svg:g")
    .attr("transform", "translate(40, 0)");

// Create a cluster "canvas"
var cluster = d3.layout.tree()
    .size([3400,900]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y*0.8, d.x]; });

var file = '/gain/api/'+getParameterByName('accountId')+'/object/taxonomies?id='+encodeURIComponent(getParameterByName('id'));
var index = getParameterByName('index')?getParameterByName('index'):0;

//d3.json(file, function(json) {

// $.ajax({
//     url: file,
//     dataType : 'json',
//     beforeSend: function(xhr) {
//         xhr.setRequestHeader("Authorization",
//             "Basic " + base64.encode(getParameterByName('accountId')+":"+getParameterByName('accountId')));
//     },
//     success: function(json) {

function draw(json){

        // var nodes = cluster.nodes(json[index].taxonomy);
        var nodes = cluster.nodes(json);

        //var nodes = cluster.nodes(treeData);
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
        //});

//     }
// });