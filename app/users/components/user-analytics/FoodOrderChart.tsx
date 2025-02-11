"use client"
// components/FoodOrderChart.js
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const FoodOrderChart = () => {
    const options = {
        chart: {
            type: 'line',
            backgroundColor: '#2b2b2b', // Dark background
            style: {
                fontFamily: 'Arial, sans-serif'
            }
        },
        title: {
            text: 'Food Orders Over One Month',
            style: {
                color: '#FFFFFF' // White text for title
            }
        },
        xAxis: {
            categories: [
                'Week 1', 'Week 2', 'Week 3', 'Week 4'
            ],
            title: {
                text: 'Weeks',
                style: {
                    color: '#FFFFFF' // White text for x-axis title
                }
            },
            labels: {
                style: {
                    color: '#FFFFFF' // White text for x-axis labels
                }
            }
        },
        yAxis: {
            title: {
                text: 'Number of Orders',
                style: {
                    color: '#FFFFFF' // White text for y-axis title
                }
            },
            labels: {
                style: {
                    color: '#FFFFFF' // White text for y-axis labels
                }
            }
        },
        series: [
            {
                name: 'Pizza',
                data: [5, 10, 15, 20], // Replace with your actual data
                color: '#FF4500' // Custom color for the series (Orange Red)
            },
            {
                name: 'Burger',
                data: [3, 6, 9, 12], // Replace with your actual data
                color: '#32CD32' // Custom color for the series (Lime Green)
            },
            {
                name: 'Ice Cream',
                data: [4, 8, 12, 16], // Replace with your actual data
                color: '#1E90FF' // Custom color for the series (Dodger Blue)
            }
        ],
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                    color: '#FFFFFF' // White text for data labels
                },
                enableMouseTracking: true
            }
        },
        legend: {
            itemStyle: {
                color: '#FFFFFF' // White text for legend items
            }
        }
    };

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default FoodOrderChart;