// src/PriceChart.tsx
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Product, Category } from '../interface/types';

interface PriceChartProps {
  data: (Product | Category)[];
  chartType: 'product' | 'category'; // To differentiate between product and category chart types
}

const PriceChart: React.FC<PriceChartProps> = ({ data, chartType }) => {
  const options: Highcharts.Options = {
    chart: {
      type: chartType === 'product' ? 'column' : 'pie',
    },
    title: {
      text: chartType === 'product' ? 'Products in selected category' : 'Category',
      align: 'left'
    },
    xAxis: {
      categories: chartType === 'product' ? data.map((item: Product) => item.title) :  data.map((item: Category) => item.name['name']),
    },
    yAxis: {
      title: {
        text: chartType === 'product' ? 'Price' : 'All category',
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      },
      pie: {
        dataLabels: {
          formatter: function() {
            var sliceIndex = this.point.index;
            var sliceName = this.series.chart.axes[0].categories[sliceIndex];
            return sliceName
          }
        }
      }
    },
    series: [
      {
        name: chartType === 'product' ? 'Price' : 'Categories',
        data: chartType === 'product' 
          ? (data as Product[]).map((item: Product) => item.price)
          : (data as Category[]).map((item: Category) =>  100), // Replace with actual data if available
        type:  chartType === 'product' ? 'column' : 'pie',

      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PriceChart;
