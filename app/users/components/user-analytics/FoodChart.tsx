"use client"
// components/FoodChart.js
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const FoodChart = () => {
        const options = {
            chart: {
                type: 'column',
                backgroundColor: '#2b2b2b', // Dark background
                style: {
                    fontFamily: 'Arial, sans-serif'
                }
            },
            title: {
                text: 'User Favorite Food',
                style: {
                    color: '#FFFFFF' // White text for title
                }
            },
            xAxis: {
                categories: ['Pizza', 'Burger', 'Sushi', 'Pasta', 'Salad', 'Tacos', 'Ice Cream', 'Steak'],
                labels: {
                    style: {
                        color: '#FFFFFF' // White text for x-axis labels
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Number of Votes',
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
                    name: 'Votes',
                    data: [5, 3, 4, 7, 2, 6, 8, 4], // Replace with your actual data
                    color: '#1E90FF' // New color for the series (Dodger Blue)
                }
            ],
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        color: '#FFFFFF' // White text for data labels
                    }
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

export default FoodChart;