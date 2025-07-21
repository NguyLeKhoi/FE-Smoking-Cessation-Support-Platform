import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function StatisticsBarChart({ totalPostsByStatus = {} }) {
    const statuses = ['PENDING', 'APPROVED', 'REJECTED', 'UPDATING'];
    const data = statuses.map(status => totalPostsByStatus[status] ?? 0);

    const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Posts'], top: 10 },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: statuses,
        },
        yAxis: { type: 'value' },
        series: [
            {
                name: 'Posts',
                type: 'bar',
                data,
                barWidth: 40,
                itemStyle: { color: '#1976d2' },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 350, width: '100%' }} />;
}
