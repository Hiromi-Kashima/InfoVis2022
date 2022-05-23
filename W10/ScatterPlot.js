class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
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

        self.points = self.chart.append('g');

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.yaxis_group = self.chart.append('g');

        self.chart.append("text")
            .attr("fill", "black")
            .attr("x", (self.config.width - self.config.margin.left - self.config.margin.right) / 2)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text(self.config.title);

        self.xaxis_group
            .append("text")
            .attr("fill", "black")
            .attr("x", (self.config.width - self.config.margin.left - self.config.margin.right) / 2)
            .attr("y", 35)
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text(self.config.xlabel);

        self.yaxis_group
            .append("text")
            .attr("fill", "black")
            .attr("x", -(self.config.height - self.config.margin.top - self.config.margin.bottom) / 2)
            .attr("y", -35)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text(self.config.ylabel);
    }

    update() {
        let self = this;
        var dMargin = 30;

        const xmin = d3.min( self.data, d => d.x - dMargin);
        const xmax = d3.max( self.data, d => d.x + dMargin);
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.data, d => d.y - dMargin);
        const ymax = d3.max( self.data, d => d.y + dMargin);
        self.yscale.domain( [ymax, ymin] );

        self.render();
    }

    render() {
        let self = this;

        self.points.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r );

        self.xaxis_group
            .call( self.xaxis );

            self.yaxis_group
            .call( self.yaxis );
    }
}
