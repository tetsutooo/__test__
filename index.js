import init, { HeatmapData } from './pkg/wasm_math.js';

let heatmap;
let animationId;

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

    const graphCanvas = document.getElementById('graphCanvas');
    graphCanvas.width = 256;  // グラフの幅
    graphCanvas.height = 150; // グラフの高さ

    drawColorbar();  // カラーバーを描画
    animationLoop();
}

function animationLoop() {
    heatmap.update();  // データの更新
    drawHeatmap();     // 描画
    drawGraph();
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

function drawGraph() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // キャンバスをクリア
    ctx.clearRect(0, 0, width, height);

    // グラフの背景とグリッドを描画
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#eee';
    ctx.beginPath();
    for (let i = 0; i < width; i += 32) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
    }
    for (let i = 0; i < height; i += 30) {
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
    }
    ctx.stroke();

    // y=128の行のデータを取得
    const rowData = heatmap.get_row_data(128);

    // グラフを描画
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(0, height - rowData[0] * height);
    for (let x = 1; x < width; x++) {
        ctx.lineTo(x, height - rowData[x] * height);
    }
    ctx.stroke();

    // 軸ラベルを描画
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('0', 5, height - 5);
    ctx.fillText('255', width - 25, height - 5);
    ctx.textAlign = 'right';
    ctx.fillText('1.0', width - 5, 15);
    ctx.fillText('0.0', width - 5, height - 5);
}

document.addEventListener('DOMContentLoaded', run);

// アニメーションの停止用関数（必要に応じて）
function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}
