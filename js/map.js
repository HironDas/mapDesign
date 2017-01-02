Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

String.prototype.capitalize = function() {
    return this.substr(0, 1).toUpperCase() + this.substr(1);
}

var MapViewer = function() {
    this.img = arguments[0]
    this.data = arguments[1];
    this.options = arguments[2] || {};
    this.options.margin = this.options.margin || {};
    this.options.stallHoverColor = this.options.stallHoverColor || '#ff0000';
    this.options.toolTipBgColor = this.options.toolTipBgColor || '#0000ff';
    this.options.legendColor = this.options.legendColor || d3.schemeCategory10; //d3.schemeCategory20 d3.schemeCategory20b d3.schemeCategory20c;

    var img = new Image();

    console.log(this.img);
}


MapViewer.prototype.setWidth = function(width) {
    this.options.width = width;
    // this.render();
    return this;
}


MapViewer.prototype.render = function() {
    var data = this.data.info;
    var stalls = this.data.stalls;
    var stallColor = this.options.stallHoverColor;
    var tooltipColor = this.options.toolTipBgColor;
    var legendColor = this.options.legendColor;
    var index;
    var margin = {
        top: this.options.margin.top || 20,
        right: this.options.margin.right || 0,
        bottom: this.options.margin.bottom || 0,
        left: this.options.margin.left || 30
    };
    var width = this.options.width || 900;
    var ratio, height;
    var id = this.options.id || 'body';

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

    d3.select(id).selectAll('svg').remove();

    this.svg = d3.select(id).append("svg");
    var svg = this.svg;

    d3.xml(this.img, function(err, documentFragment) {
        console.log(documentFragment);
        if (err) {
            consoel.log("The Map is not Found");
            return;
        }
        var imgNode = documentFragment.getElementsByTagName("svg")[0];
        console.log(imgNode.id);

        ratio = imgNode.height.baseVal.value / imgNode.width.baseVal.value;
        console.log(ratio);
        height = width * ratio || width;

        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom).call(zoom);

        var map = svg.node().appendChild(imgNode);

        var tooltip = svg.select('#' + imgNode.id).append('g')
            .attr('class', 'tooltip')
            .style('display', 'none')
        var tooltipBack = tooltip.append('rect')
            .attr('fill', tooltipColor)
            .attr('height', '50')
            .attr('width', '150')
            .attr('opacity', '0.5');

        var tooltipsText = tooltip.append('text')
            .attr('x', '0')
            .attr('y', '0')
            .attr('class', 'toolTipValue');

        tooltipsText.append('tspan')
            .attr('class', 'titleText');


        tooltipsText.append('tspan')
            .attr('class', 'stallText')
            .attr('dy', '1.3em');

        var legends = getLegend(stalls)
        legends.push('Undefined');
        console.log(legends);

        var legend = d3.select('#legend')
            .attr('transform', 'translate(' + margin.left + ',' + ((+margin.top) + 40) + ')');

        var legendCircle = legend.selectAll('circle')
            .data(legends)
            .enter()
            .append('circle')
            .attr('cx', 10)
            .attr('cy', function(d, i) { return i * 15; })
            .attr('r', 5)
            .attr('fill', function(d, i) { return legendColor[i % legendColor.length]; });

        var legendText = legend.selectAll('text')
            .data(legends)
            .enter()
            .append('text')
            .attr('x', 20)
            .attr('y', function(d, i) { return i * 15 + 3; })
            .text(function(d) { return d.capitalize() + " Stall" })
            .attr('font-family', "Verdana")
            .attr('font-size', '10')
            .attr('fill', '#222');



        stallColoring(stalls, legendColor, legends);


        svg.selectAll('#stall rect')
            .on('mouseover', function() {
                console.log(this.getBBox());
                console.log(d3.select('.tooltip'));
                // this.style('fill', 'red');
                this.attributes.fill.value = stallColor;

                index = getIndex(data, this.id);

                var bbox = this.getBBox();
                console.log(bbox);

                if (index !== 'undefined') {
                    d3.select('.tooltip')
                        .style('display', 'block');

                    tooltipBack.attr('x', (bbox.x + bbox.width / 2) - 75)
                        .attr('y', (bbox.y + bbox.height / 2) - 60);


                    d3.select('.toolTipValue')
                        .attr('x', (bbox.x + bbox.width / 2))
                        .attr('y', (bbox.y + bbox.height / 2))
                        .attr('dy', '-40')
                        .attr('font-family', "Verdana")
                        .attr('font-size', "10")
                        .attr('text-anchor', 'middle');
                    // .append('tspan')
                    // .text('<tspan>Title:' + data[index].title + "</tspan> <tspan> Stall: " + data[index].stall + "</tspan>");

                    d3.select('.titleText')
                        .attr('x', (bbox.x + bbox.width / 2))
                        .style('font-weight', 'bold')
                        .style('fill', '#fff')
                        .text('Title:' + data[index].title);
                    d3.select('.stallText')
                        .attr('x', (bbox.x + bbox.width / 2))
                        .style('fill', '#fff')
                        .text('Stall:' + data[index].stall);

                    // console.log(data[index].title);
                    if (data[index].stall.length > 1) {
                        data[index].stall.forEach(function(d) {
                            d3.select('#BA' + d).attr('fill', stallColor);
                        })
                    }
                }

            })
            .on('mouseout', function() {
                // svg.selectAll('#stall rect').attr('fill', legendColor[legends.length - 1]);
                stallColoring(stalls, legendColor, legends);
                d3.select('.tooltip')
                    // .style('pointer-events', 'none')
                    .style('display', 'none');
            });

    });

    function stallColoring(stallData, legendColor, legends) {
        console.log(svg);
        svg.selectAll('#stall rect').attr('fill', legendColor[legends.length - 1]);
        // setTimeout(function() {
        stallData.forEach(function(d, i) {
            d.forEach(function(d, i, a) {
                svg.select('#BA' + d).attr('fill', legendColor[a.length - 1]);
            })
        })

    }
    return this;
}

MapViewer.prototype.search = function() {

    if (document.querySelector('#search'))
        document.querySelector('#search').remove();

    var select = document.createElement('select');
    var data = this.data.info;

    data.map(function(d) { return d.title })
        .sort().forEach(function(d) {
            var option = document.createElement('option');
            option.text = d;
            option.value = d;
            select.appendChild(option);
        })

    var div = document.createElement('div');
    div.id = 'search';
    document.querySelector(this.options.id)
        .appendChild(div)
        .appendChild(select);

    var stallColor = this.options.stallHoverColor

    select.addEventListener('change', function() {
        console.log(this.value);
        console.log(data);
        var title = this.value;

        var stalls = data.filter(function(d) {
            console.log(title);
            return d.title.trim() == title.trim();
        }).map(function(d) {
            return d.stall;
        }).reduce(function(a, b) {
            return a.concat(b);
        }, []).forEach(function(d) {
            d3.selectAll('#stall rect').attr('fill', '#999');

            setTimeout(function() {
                d3.select('#BA' + d).attr('fill', stallColor);
            }, 50)
        });
        console.log(stalls);
    }, false);

    function zoomed() {
        svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

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

function getLegend(data) {
    var name = ['single', 'double', 'triple', 'quadruple', 'pentadruple', 'hexatruple', 'septuple', 'octuple', 'nonuple', 'decuple', 'undecuple', 'duodecuple', 'tredecuple']
    var legend = [];

    data.forEach(function(d, i) {
        legend.push(name[d.length - 1]);
    });

    return legend.filter(function(d, i, a) {
        return d !== 'undefined' && a.indexOf(d) == i;
    }).map(function(d) {
        return { index: name.indexOf(d), value: d };
    }).sort(function(a, b) {
        return a.index - b.index;
    }).map(function(d) {
        return d.value;
    });
}