import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function StatisticsBarChart({ totalQuitPlansByStatus = {}, totalRecordsByIsPass = {} }) {
    const categories = ['ACTIVE', 'COMPLETED', 'FAILED', 'PASS', 'FAIL'];
    const quitPlansData = [
        totalQuitPlansByStatus.ACTIVE ?? 0,
        totalQuitPlansByStatus.COMPLETED ?? 0,
        totalQuitPlansByStatus.FAILED ?? 0,
        0, // for PASS
        0, // for FAIL
    ];
    const recordsData = [
        0, // for ACTIVE
        0, // for COMPLETED
        0, // for FAILED
        totalRecordsByIsPass.PASS ?? 0,
        totalRecordsByIsPass.FAIL ?? 0,
    ];

    const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['Quit Plans', 'Records'], top: 10 },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: categories,
        },
        yAxis: { type: 'value' },
        series: [
            {
                name: 'Quit Plans',
                type: 'bar',
                data: quitPlansData,
                barWidth: 30,
                itemStyle: { color: '#1976d2' },
                barGap: 0,
                barCategoryGap: '50%',
            },
            {
                name: 'Records',
                type: 'bar',
                data: recordsData,
                barWidth: 30,
                itemStyle: { color: '#d32f2f' },
                barGap: 0,
                barCategoryGap: '50%',
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 350, width: '50vw' }} />;
}
