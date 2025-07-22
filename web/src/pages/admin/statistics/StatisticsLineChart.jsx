import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function StatisticsLineChart({ revenueFromMembershipsByMonth = [] }) {
    const months = revenueFromMembershipsByMonth.map(item => item.month);
    const revenue = revenueFromMembershipsByMonth.map(item => item.total);

    const option = {
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['Revenue From Memberships By Months'],
            top: 10,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: months,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'Revenue From Memberships',
                type: 'line',
                data: revenue,
                smooth: true,
                lineStyle: { width: 3, color: '#1976d2' },
                itemStyle: { color: '#1976d2' },
                areaStyle: { color: 'rgba(25, 118, 210, 0.1)' },
            },
        ],
    };

    return (
        <ReactECharts option={option} style={{ height: 400, width: '100%' }} />
    );
}
