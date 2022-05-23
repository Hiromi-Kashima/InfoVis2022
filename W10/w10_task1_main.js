d3.csv("w10_task1.csv")
    .then(data => {
        data.forEach( d => { d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:25, right:10, bottom:50, left:80},
            title: 'Sample Data',
            xlabel: 'X label',
            ylabel: 'Y label'
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();

        d3.select('#reverse')
            .on('click', d => {
                data.reverse();
                bar_chart.update();
            });
        
        d3.select('#ascend')
            .on('click', d => {
                data.sort((a, b) => a.value - b.value);
                bar_chart.update();
            });

        d3.select('#descend')
            .on('click', d => {
                data.sort((a, b) => b.value - a.value);
                bar_chart.update();
            });
    })
    .catch( error => {
        console.log( error );
    });
