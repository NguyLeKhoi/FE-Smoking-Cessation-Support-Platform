import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function StatisticsPieChart({ totalPostsByStatus = {} }) {
    const statuses = ['PENDING', 'APPROVED', 'REJECTED', 'UPDATING'];
    const data = statuses.map(status => ({
        name: status,
        value: totalPostsByStatus[status] ?? 0,
    }));

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)',
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: statuses,
        },
        series: [
            {
                name: 'Posts by Status',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}: {c}',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 18,
                        fontWeight: 'bold',
                    },
                },
                labelLine: {
                    show: true,
                },
                data,
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 350, width: '100%' }} />;
}
