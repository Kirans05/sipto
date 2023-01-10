import HighchartsReact from 'highcharts-react-official';
import React, { useRef, useState } from 'react'
import Highcharts from 'highcharts/highstock';


const ChartTest = () => {

  const chartRef = useRef();

    const [chartOptions, setChartOptions] = useState({

        title: {
            text: 'U.S Solar Employment Growth by Job Category, 2010-2020'
        },
    
        subtitle: {
            text: 'Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>'
        },
    
        yAxis: {
            title: {
                text: 'Number of Employees'
            },
            labels: {
                format: '{value}°C',
                // format: ["-2%", "0%", "2%"],
                // format: '${text}',
                style: {
                    color:"white"
                }
            },
        },
    
        xAxis: {
            accessibility: {
                rangeDescription: 'Range: 2010 to 2020'
            }
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },
    
        series: [{
            name: 'Installation & Developers',
            data: [43934, 48656, 65165, 81827, 112143, 142383,
                171533, 165174, 155157, 161454, 154610]
        }, {
            name: 'Manufacturing',
            data: [24916, 37941, 29742, 29851, 32490, 30282,
                38121, 36885, 33726, 34243, 31050]
        }, {
            name: 'Sales & Distribution',
            data: [11744, 30000, 16005, 19771, 20185, 24377,
                32147, 30912, 29243, 29213, 25663]
        }, {
            name: 'Operations & Maintenance',
            data: [null, null, null, null, null, null, null,
                null, 11164, 11218, 10077]
        }, {
            name: 'Other',
            data: [21908, 5548, 8105, 11248, 8989, 11816, 18274,
                17300, 13053, 11906, 10073]
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    });



    // const [chartOptions, setChartOptions] = useState({
    //     xAxis: [{
    //         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    //             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //         crosshair: true
    //     }],
    //     yAxis: [{ // Primary yAxis
    //         labels: {
    //             format: '{value}°C',
    //             style: {
    //                 color:"white"
    //             }
    //         },
    //         title: {
    //             text: 'Temperature',
    //             style: {
    //                 color:"white"
    //             }
    //         },
    //         opposite: true,
    
    //     }, { // Secondary yAxis
    //         gridLineWidth: 0,
    //         title: {
    //             text: 'Rainfall',
    //             style: {
    //                 color:"green"
    //             }
    //         },
    //         labels: {
    //             format: '{value} mm',
    //             style: {
    //                 color:"green"
    //             }
    //         }
    
    //     }, { // Tertiary yAxis
    //         gridLineWidth: 0,
    //         title: {
    //             text: 'Sea-Level Pressure',
    //             style: {
    //                 color:"red"
    //             }
    //         },
    //         labels: {
    //             format: '{value} mb',
    //             style: {
    //                 color:"red"
    //             }
    //         },
    //         opposite: true
    //     }],
    //     legend: {
    //         layout: 'vertical',
    //         align: 'left',
    //         x: 80,
    //         verticalAlign: 'top',
    //         y: 55,
    //         floating: true,
    //         backgroundColor:
    //             'rgba(255,255,255,0.25)'
    //     },
    //     series: [ {
    //         name: 'Sea-Level Pressure',
    //         type: 'spline',
    //         yAxis: 2,
    //         data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
    //         marker: {
    //             enabled: false
    //         },
    //         dashStyle: 'shortdot',
    //         tooltip: {
    //             valueSuffix: ' mb'
    //         },
    //         color:"red",
    //         animation:true,
    //         // animationLimit:2000
    //     }, {
    //         name: 'Temperature',
    //         type: 'spline',
    //         data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
    //         tooltip: {
    //             valueSuffix: ' °C'
    //         },
    //         animation:true,
    //         // animationLimit:2000
    //     }],
    //     chart: {
    //       backgroundColor: 'white'
    //       // zoomType: "x",
    //     },
    //     navigation: {
    //       enabled: false,
    //       buttonOptions: {
    //         enabled: false
    //       }
    //     },
    //     rangeSelector: { enabled: false },
    //     credits: { enabled: false },
    //     tooltip: {
    //       animation: true,
    //       // xDateFormat: "",
    //       useHTML: true,
    //       backgroundColor: 'rgba(255, 255, 255)',
    //       borderWidth: 1,
    //       borderRadius: 15,
    //       borderColor: '#B0C4DB',
    //       shadow: {
    //         offsetX: 1,
    //         offsetY: 2,
    //         width: 2,
    //         opacity: 0.05
    //       },
    //       shape: 'square',
    //       // split: true,
    //       hideDelay: 100,
    //       outside: false
    //     },
    //     navigator: {
    //       handles: {
    //         // lineWidth: 1,
    //         width: 20,
    //         height: 30
    //       },
    //       maskFill: 'rgba(78, 125, 217, 0.2)',
    //       outlineWidth: 0,
    //       enabled: false,
    //       xAxis: {}
    //     },
    //     scrollbar: {
    //       enabled: false
    //     }
    //   });

  return (
    <div>
        <h1>ChartTest</h1>
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            constructorType="chart"
            ref={chartRef}
          />
    </div>
  )
}

export default ChartTest