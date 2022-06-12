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
            .attr("y", -60)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text(self.config.ylabel);

        /*
        self.div = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
        */
    }

    update() {
        let self = this;
        var dMargin = 0;

        const xmin = d3.min( self.data, d => d.all_vac - dMargin);
        const xmax = d3.max( self.data, d => d.all_vac + dMargin);
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.data, d => d.severe - dMargin);
        const ymax = d3.max( self.data, d => d.severe + dMargin);
        self.yscale.domain( [ymax, ymin] );

        self.render();
    }

    render() {
        let self = this;

        let points = self.chart.selectAll("circle")
            .data(self.data)
            .join('circle')
            .attr("cx", d => self.xscale( d.all_vac ) )
            .attr("cy", d => self.yscale( d.severe ) )
            .attr("r", 2 );
        /*
        points
            .attr('stroke-width', '20px')
            .attr('stroke', 'rgba(0,0,0,0)')
            .style('cursor', 'pointer')
            .on('mouseover', d => {
            self.div
                .transition()
                .duration(200)
                .style('opacity', 0.9)
                .html(`<div class="tooltip-label">${d.date}</div>(${d.all_vac}, ${d.severe})`)
                .style('left', d3.event.pageX + 'px')
                .style('top', d3.event.pageY - 28 + 'px');
            })
            .on('mouseout', () => {
            self.div
                .transition()
                .duration(500)
                .style('opacity', 0);
            });
        /*
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${d.date}</div>(${d.all_vac}, ${d.severe})`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });
            */
        
        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }
}
