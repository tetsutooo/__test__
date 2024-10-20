import init, { HeatmapData } from './pkg/wasm_math.js';

let heatmap;
let animationId;

async function run() {
    await init();
    const width = 100;
    const height = 100;
    heatmap = HeatmapData.new(width, height);

    // 初期データの設定
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (Math.random() < 0.1) {  // 10%の確率でホットスポットを生成
                heatmap.set_value(x, y, Math.random());
            }
        }
    }

    const heatmapCanvas = document.getElementById('heatmapCanvas');
    heatmapCanvas.width = width;
    heatmapCanvas.height = height;

    const colorbarCanvas = document.getElementById('colorbarCanvas');
    colorbarCanvas.width = 30;  // カラーバーの幅
    colorbarCanvas.height = height;

    drawColorbar();  // カラーバーを描画
    animationLoop();
}

function animationLoop() {
    heatmap.update();  // データの更新
    drawHeatmap();     // 描画
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
    const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
    
    gradient.addColorStop(0, 'rgb(0, 255, 0)');    // 低温（緑）
    gradient.addColorStop(0.5, 'rgb(255, 255, 0)'); // 中温（黄）
    gradient.addColorStop(1, 'rgb(255, 0, 0)');    // 高温（赤）

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 目盛りの追加
    ctx.fillStyle = 'black';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('1.0', canvas.width + 5, 10);
    ctx.fillText('0.5', canvas.width + 5, canvas.height / 2);
    ctx.fillText('0.0', canvas.width + 5, canvas.height - 5);
}

document.addEventListener('DOMContentLoaded', run);

// アニメーションの停止用関数（必要に応じて）
function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}
