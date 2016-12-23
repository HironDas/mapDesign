var MapViewer = function() {
    this.img = arguments[0]
    this.data = arguments[1];
    this.options = arguments[2] || {};
    this.options.margin = this.options.margin || {};

    var img = new Image();

    console.log(this.img);
}

MapViewer.prototype.getImgSize = function(callback) {
    var img = new Image();
    // var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // img.createElementNS(svg, 'image');
    img.src = this.img;
    img.onload = function() {
        console.log(this.getBoundingClientRect());
        var d = callback(this.width, this.height);
        return d;
    }
}

MapViewer.prototype.setWidth = function(width) {
    this.options.width = width;
    this.render();
    return this;
}

MapViewer.prototype.render = function() {
    var ratio = this.getImgSize(function(width, height) {
        console.log(height + width);
        return height + width;
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
        .attr("height", 500);

    d3.xml(this.img, function(err, documentFragment) {
        console.log(documentFragment);
        if (err) {
            consoel.log(err);
            return;
        }
        var imgNode = documentFragment.getElementsByTagName("svg")[0];;

        svg.node().appendChild(imgNode);

    })
}