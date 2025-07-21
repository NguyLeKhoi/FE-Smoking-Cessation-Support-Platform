import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function StatisticsMixedChart({ totalQuitPlansByStatus = {}, totalRecordsByIsPass = {} }) {
    // Prepare data for the chart
    const xAxisData = ['ACTIVE', 'COMPLETED', 'FAILED', 'PASS', 'FAIL'];
    const quitPlansData = [
        totalQuitPlansByStatus.ACTIVE ?? 0,
        totalQuitPlansByStatus.COMPLETED ?? 0,
        totalQuitPlansByStatus.FAILED ?? 0,
        null,
        null,
    ];
    const recordsData = [
        null,
        null,
        null,
        totalRecordsByIsPass.PASS ?? 0,
        totalRecordsByIsPass.FAIL ?? 0,
    ];

    const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Quit Plans', 'Records'], top: 10 },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: xAxisData,
        },
        yAxis: { type: 'value' },
        series: [
            {
                name: 'Quit Plans',
                type: 'bar',
                data: quitPlansData,
                barWidth: 30,
                itemStyle: { color: '#1976d2' },
            },
            {
                name: 'Records',
                type: 'line',
                data: recordsData,
                symbol: 'circle',
                lineStyle: { width: 3, color: '#d32f2f' },
                itemStyle: { color: '#d32f2f' },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 350, width: '100%' }} />;
}
