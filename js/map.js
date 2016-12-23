var MapViewer = function() {
    this.img = arguments[0]
    this.data = arguments[1];
    this.options = arguments[2] || {};
    this.options.margin = this.options.margin || {};

    var img = new Image();

    console.log(this.img);
}

MapViewer.prototype.getImgSize = function(url, callback) {
    var img = new Image();
    img.src = url;
    img.onload = function() { return callback(this.width, this.height); }
}

MapViewer.prototype.setWidth = function(width) {
    this.options.width = width;
    this.render();
    return this;
}

MapViewer.prototype.render = function() {
    var ratio = this.getImgSize(this.img, function(widht, height) {
        return +height / +width;
    });
    console.log(ratio);
    var margin = {
        top: this.options.margin.top || 0,
        right: this.options.margin.right || 0,
        bottom: this.options.margin.bottom || 0,
        left: this.options.margin.left || 0
    };

    var width = this.options.width || 900;
    var height = width * ratio;

    var id = this.options.id || 'body';
    console.log(id);
    var svg = d3.select(id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", 500)
        // .attr("height", height + margin.top + margin.bottom)
        .append("svg")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('width', width)
        .attr('height', height)
        .attr("xlink:href", this.img);
}