import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function StatisticsLineChart({ moneySavedByMonth = [], cigarettesNotSmokedByMonth = [], revenueFromMembershipsByMonth = [] }) {
    // Extract months (assume all arrays have the same months in the same order)
    const months = moneySavedByMonth.map(item => item.month);
    const moneySaved = moneySavedByMonth.map(item => item.total);
    const cigarettesNotSmoked = cigarettesNotSmokedByMonth.map(item => item.total);
    const revenue = revenueFromMembershipsByMonth.map(item => item.total);

    const option = {
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['Money Saved', 'Cigarettes Not Smoked', 'Revenue From Memberships'],
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
                name: 'Money Saved',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                data: moneySaved,
                smooth: true,
            },
            {
                name: 'Cigarettes Not Smoked',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                data: cigarettesNotSmoked,
                smooth: true,
            },
            {
                name: 'Revenue From Memberships',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                data: revenue,
                smooth: true,
            },
        ],
    };

    return (
        <ReactECharts option={option} style={{ height: 400, width: '100%' }} />
    );
}
