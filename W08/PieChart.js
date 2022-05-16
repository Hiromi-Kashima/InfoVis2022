class PieChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            radius: config.radius || 128,
            title: config.title || ''
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);
    }

    update() {
        let self = this;

        self.render();
    }

    render() {
        let self = this;

        self.pie = d3.pie()
            .value( d => d.value );

        self.arc = d3.arc()
            .innerRadius(self.config.radius/2)
            .outerRadius(self.config.radius);

        self.svg.selectAll('pie')
            .data( self.pie(self.data) )
            .enter()
            .append('path')
            .attr('d', self.arc)
            .attr('fill', d => d.data.color )
            .attr('opacity', 0.5)
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        self.text = d3.arc()
            .innerRadius(self.config.radius - 30)
            .outerRadius(self.config.radius - 30);

        self.svg.selectAll('text')
            .data( self.pie(self.data) )
            .enter()
            .append('text')
            .attr("transform", d => `translate(${self.text.centroid(d)})`)
            .attr('fill', 'black')
            .attr("dy", "5px")
            .style("font-size", 20)
            .style("text-anchor", "middle")
            .text( d => d.data.label );
    }

}