import init, { HeatmapData } from './pkg/wasm_math.js';

async function run() {
    await init();

    const width = 100;
    const height = 100;
    const heatmap = HeatmapData.new(width, height);

    // サンプルデータを生成
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const value = Math.sin(x / 10) * Math.cos(y / 10) * 0.5 + 0.5;
            heatmap.set_value(x, y, value);
        }
    }

    const canvas = document.getElementById('heatmapCanvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const imageData = new ImageData(new Uint8ClampedArray(heatmap.get_data()), width, height);
    ctx.putImageData(imageData, 0, 0);
}

run();
