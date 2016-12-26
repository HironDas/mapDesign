var MapViewer = function() {
    this.img = arguments[0]
    this.data = arguments[1];
    this.options = arguments[2] || {};
    this.options.margin = this.options.margin || {};

    var img = new Image();

    console.log(this.img);
}


MapViewer.prototype.setWidth = function(width) {
    this.options.width = width;
    // this.render();
    return this;
}

MapViewer.prototype.render = function() {

    var margin = {
        top: this.options.margin.top || 0,
        right: this.options.margin.right || 0,
        bottom: this.options.margin.bottom || 0,
        left: this.options.margin.left || 0
    };
    var width = this.options.width || 900;
    var ratio, height;
    var id = this.options.id || 'body';

    d3.select(id).selectAll('svg').remove();

    d3.xml(this.img, function(err, documentFragment) {
        console.log(documentFragment);
        if (err) {
            consoel.log("The Map is not Found");
            return;
        }
        var imgNode = documentFragment.getElementsByTagName("svg")[0];

        ratio = imgNode.height.baseVal.value / imgNode.width.baseVal.value
        height = width * ratio;
        var svg = d3.select(id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);


        svg.node().appendChild(imgNode);

    })
    return this;
}