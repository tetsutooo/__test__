import init, { HeatmapData } from './pkg/wasm_math.js';

let heatmap;
let animationId;
let chart;

async function run() {
    await init();
    const width = 256;
    const height = 256;
    heatmap = HeatmapData.new(width, height);

    // 初期データの設定
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x > 16 && x < 240 && y > 16 && y < 240) {  // 10%の確率でホットスポットを生成
                heatmap.set_value(x, y, Math.random());
            }
        }
    }

    const heatmapCanvas = document.getElementById('heatmapCanvas');
    heatmapCanvas.width = 256; // width;
    heatmapCanvas.height = 256; // height;

    const colorbarCanvas = document.getElementById('colorbarCanvas');
    colorbarCanvas.width = 80;  // カラーバーの幅を80pxに設定
    colorbarCanvas.height = 256 + 20;  // 高さを少し増やす

    /*const graphCanvas = document.getElementById('graphCanvas');
    // Chart.jsでグラフを初期化
    chart = new Chart(graphCanvas, {
        type: 'line',
        data: {
            labels: Array.from({length: 256}, (_, i) => i),
            datasets: [{
                label: 'Cross-section at y=128',
                data: [],
                borderColor: 'blue',
                borderWidth: 1,
                fill: false,
                pointRadius: 0, // ポイントを非表示
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: {
                    // type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'X',
                        color: 'white',
                    },
                    ticks: {
                        maxTicksLimit: 4, // X軸のラベル数を制限
                        color: 'white',
                    },
                },
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Value',
                        color: 'white',
                    },
                    min: 0.001,
                    max: 1,
                    ticks: {
                        color: 'white',
                    },
                }
            },
            plugins: {
                legend: {
                    display: false, // 凡例を非表示
                },
                title: {
                    display: true,
                    text: 'Cross-Section',
                    color: 'white',
                },
            },
            animation: {
                duration: 0, // アニメーションを無効化して更新を高速化
            },
        }
    });*/

     // D3.js graph setup
    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    const graphWidth = 400 - margin.left - margin.right;
    const graphHeight = 300 - margin.top - margin.bottom;

    svg = d3.select('#graphCanvas')
        .append('svg')
        .attr('width', graphWidth + margin.left + margin.right)
        .attr('height', graphHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    xScale = d3.scaleLinear()
        .domain([0, 255])
        .range([0, graphWidth]);

    yScale = d3.scaleLog()
        .domain([0.001, 1])
        .range([graphHeight, 0]);

    line = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));

    // Add X axis
    svg.append('g')
        .attr('transform', `translate(0,${graphHeight})`)
        .call(d3.axisBottom(xScale).ticks(4))
        .attr('color', 'white');

    // Add Y axis
    svg.append('g')
        .call(d3.axisLeft(yScale))
        .attr('color', 'white');

    // Add X axis label
    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('x', graphWidth)
        .attr('y', graphHeight + margin.top + 20)
        .text('X')
        .attr('fill', 'white');

    // Add Y axis label
    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 20)
        .attr('x', -margin.top)
        .text('Value')
        .attr('fill', 'white');

    // Add title
    svg.append('text')
        .attr('x', (graphWidth / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .text('Cross-Section')
        .attr('fill', 'white');

    // Add path for the line
    svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1.5)
        .attr('class', 'line');

    drawColorbar();  // カラーバーを描画
    animationLoop();
}

function animationLoop() {
    heatmap.update();  // データの更新
    drawHeatmap();     // 描画
    updateGraph();
    animationId = requestAnimationFrame(animationLoop);
}

function drawHeatmap() {
    const canvas = document.getElementById('heatmapCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(
        new Uint8ClampedArray(heatmap.get_data()),
        heatmap.width(),
        heatmap.height()
    );
    ctx.putImageData(imageData, 0, 0);
}

function drawColorbar() {
    const canvas = document.getElementById('colorbarCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = 16;  // グラデーションバーの幅
    const gradientHeight = height - 20;  // グラデーションの高さを調整

    // グラデーションの描画
    const gradient = ctx.createLinearGradient(0, gradientHeight, 0, 0);
    gradient.addColorStop(0, 'rgb(0, 255, 0)');    // 低温（緑）
    gradient.addColorStop(0.5, 'rgb(255, 255, 0)'); // 中温（黄）
    gradient.addColorStop(1, 'rgb(255, 0, 0)');    // 高温（赤）

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 10, barWidth, gradientHeight);  // 上下に10pxずつマージンを追加

    // メモリと数値の描画
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const steps = 2;  // メモリの数
    for (let i = 0; i <= steps; i++) {
        const y = 10 + (1 - i / steps) * gradientHeight;  // 位置を調整
        const value = (i / steps).toFixed(1);

        // メモリの線
        ctx.beginPath();
        ctx.moveTo(barWidth - 5, y);
        ctx.lineTo(barWidth, y);
        ctx.stroke();

        // 数値
        ctx.fillText(value, barWidth + 5, y);
    }
}

/*function updateGraph() {
    const rowData = heatmap.get_row_data(128);
    chart.data.datasets[0].data = rowData;
    chart.update();
}*/

function updateGraph() {
    const rowData = heatmap.get_row_data(128);
    
    svg.select('.line')
        .datum(rowData)
        .attr('d', line);
}

document.addEventListener('DOMContentLoaded', run);

// アニメーションの停止用関数（必要に応じて）
function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}
