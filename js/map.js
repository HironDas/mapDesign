var MapViewer = function() {
    this.img = arguments[0]
    this.data = arguments[1];
    this.options = arguments[2] || {};
    this.options.margin = this.options.margin || {};
    this.options.stallHoverColor = this.options.stallHoverColor || '#ff0000';
    this.options.toolTipBgColor = this.options.toolTipBgColor || '#0000ff';

    var img = new Image();

    console.log(this.img);
}


MapViewer.prototype.setWidth = function(width) {
    this.options.width = width;
    // this.render();
    return this;
}


MapViewer.prototype.render = function() {
    var data = this.data;
    var stallColor = this.options.stallHoverColor;
    var tooltipColor = this.options.toolTipBgColor;
    var index;
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

    this.svg = d3.select(id).append("svg");
    var svg = this.svg;
    /*.attr('position', 'absolute')
    .style('top', '0px')
    .style('left', '0px')
    .style('border', '1px #999 solid')
    .style('padding', '5px')
    .style('background-color', tooltipColor)
    .style('pointer-events', 'none')
    .style('line-height', '1')*/
    // .html('Hiron Chandra DAs');

    d3.xml(this.img, function(err, documentFragment) {
        console.log(documentFragment);
        if (err) {
            consoel.log("The Map is not Found");
            return;
        }
        var imgNode = documentFragment.getElementsByTagName("svg")[0];

        ratio = imgNode.height.baseVal.value / imgNode.width.baseVal.value;
        console.log(ratio);
        height = width * ratio;

        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);


        var map = svg.node().appendChild(imgNode);

        svg.append('g')
            .attr('class', 'tooltip')
            .style('display', 'none')
            .attr("transform", "translate(0,0)")
            .append('text')
            .attr('class', 'toolTipValue');

        svg.selectAll('#stall rect')
            .on('mouseover', function() {
                console.log(this.getBBox());
                console.log(d3.select('.tooltip'));
                // this.style('fill', 'red');
                this.attributes.fill.value = stallColor;

                index = getIndex(data, this.id);

                console.log(index);

                var bbox = this.getBBox();
                if (index !== 'undefined') {
                    d3.select('.tooltip')
                        /*.style('top', (+bbox.y) + (+bbox.height) / 2 + 'px')
                        .style('left', (+bbox.x) + (+bbox.width) / 2 + 'px')
                        .style('opacity', '0.6')
                        .style('color', '#fff')
                        .style('pointer-events', 'all')*/
                        .style('display', 'block')
                        .attr("transform", "translate(" + (bbox.x + bbox.width / 2) + "," + (bbox.y + bbox.height / 2) + ")")
                        // .append('text')
                    d3.select('.toolTipValue')
                        .html('Title:' + data[index].title + "<br/> Stall: " + data[index].stall + "");
                    // console.log(data[index].title);
                    if (data[index].stall.length > 1) {
                        data[index].stall.forEach(function(d) {
                            d3.select('#BA' + d).attr('fill', stallColor);
                        })
                    }
                }

            })
            .on('mouseout', function() {
                svg.selectAll('#stall rect').attr('fill', '#6DDFE8');

                d3.select('.tooltip')
                    // .style('pointer-events', 'none')
                    .style('display', 'none');
            });

    });
    return this;
}


//helper functions
function getIndex(data, id) {
    for (var j = 0; j < data.length; j++) {
        for (var i = 0; i < data[j].stall.length; i++) {
            if (data[j].stall[i] == id.slice(2)) {
                return j;
            }
        }
    }
    return 'undefined';
}