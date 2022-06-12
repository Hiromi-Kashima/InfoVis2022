class LineChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || {top:25, right:10, bottom:50, left:50},
            title: config.title || '',
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || ''
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleTime()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(15);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(5);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        self.chart.append("text")
            .attr("fill", "black")
            .attr("x", (self.config.width - self.config.margin.left - self.config.margin.right) / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text(self.config.title);

        self.xaxis_group.append("text")
            .attr("fill", "black")
            .attr("x", (self.config.width - self.config.margin.left - self.config.margin.right) / 2)
            .attr("y", 35)
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text(self.config.xlabel);

        self.yaxis_group.append("text")
            .attr("fill", "black")
            .attr("x", -(self.config.height - self.config.margin.top - self.config.margin.bottom) / 2)
            .attr("y", -80)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text(self.config.ylabel);

        self.brush = d3.brushY();
        self.brushGroup = self.chart.append("g")
            .attr("class", "x brush");

        self.brush
            .extent([
                [0, 0],
                [self.inner_width, self.inner_height]
            ])
            .on("brush", () => {
                brushed();
            })
            .on("end", () => {
                brushed();
            });
        self.brushGroup.call(self.brush);

        function brushed() {
            const s = d3.event.selection;
                
            if(s){
                const y0 = [self.yscale.invert(s[0]),self.yscale.invert(s[1])];
                Filter(y0);
            }
        }
    }

    update() {
        let self = this;
        let timeparser = d3.timeParse("%Y/%m/%d");

        const xmin = d3.min( self.data, d => timeparser(d.date) );
        const xmax = d3.max( self.data, d => timeparser(d.date) );
        self.xscale.domain( [xmin, xmax] );

        const ymin = 0;
        const ymax = d3.max( self.data, d => d.all_vac );
        self.yscale.domain( [ymin, ymax] );

        self.render();
    }

    render() {
        let self = this;
        let timeparser = d3.timeParse("%Y/%m/%d");

        /*
        self.area = d3.area()
            .x( d => self.xscale(timeparser(d.date)) )
            .y1( d => self.yscale(d.all_vac) )
            .y0( self.inner_height );

        self.chart.append('path')
            .attr('d', self.area(self.data))
            .attr('stroke', 'none')
            .attr('fill', 'gray');
        */

        self.line = d3.line()
            .x( d => self.xscale(timeparser(d.date)) )
            .y( d => self.yscale(d.all_vac) );

        self.chart.append('path')
            .attr('d', self.line(self.data))
            .attr('stroke', 'black')
            .attr('fill', 'none');

        self.chart.selectAll('.c').data(self.data).enter().append('circle')
            .attr('cx', self.line.x())
            .attr('cy', self.line.y())
            .attr('r', 3)
            .attr('fill', 'black');

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }

}