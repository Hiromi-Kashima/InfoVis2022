let input_data;
let scatter_plot;
let line_chart;

d3.csv("data_fix.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.all_vac = +d.all_vac;
            d.new_vac = +d.new_vac;
            d.severe = +d.severe;
        });

        scatter_plot = new ScatterPlot( {
            parent: '#drawing_region_scatterplot',
            width: 1024,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:100},
            xlabel: '累計接種数',
            ylabel: '新規重症者数',
        }, input_data );
        scatter_plot.update();

        line_chart = new LineChart( {
            parent: '#drawing_region_linechart',
            width: 1024,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:100},
            xlabel: '日付',
            ylabel: '累計接種数',
        }, input_data );
        line_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

function Filter(y0) {
    if ( y0[0]-y0[1] == 0 ) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => y0[1] <= d.all_vac && d.all_vac <= y0[0] );
    }
    scatter_plot.update();
}