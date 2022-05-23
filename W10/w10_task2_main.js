d3.csv("w10_task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 286,
            height: 286,
            margin: {top:10, right:10, bottom:50, left:60},
            title: 'Sample Data',
            xlabel: 'X-Label',
            ylabel: 'Y-label'
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();

        scatter_plot.points
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);
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
    })
    .catch( error => {
        console.log( error );
    });
