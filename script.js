let clockAngle = 0;  // 針の開始位置（0時の位置）
let clockInterval;
let data = [];  // 円グラフのデータを保持

let startButton = document.getElementById('startButton');
let resetButton = document.getElementById('resetButton');

function generateChart() {
    const valueInputs = document.querySelectorAll('.value-input');
    const labelInputs = document.querySelectorAll('.label-input');
    const canvas = document.getElementById('pieChart');
    const ctx = canvas.getContext('2d');
    const legend = document.getElementById('legend');
    const errorMessage = document.getElementById('errorMessage');
    const colors = ['red', 'yellow', 'green', 'blue', 'pink'];

    let startAngle = -Math.PI / 2;  // 12時の位置をスタート
    data = [];
    let totalValue = 0;  // 入力値の合計

    // 入力データを取得
    for (let i = 0; i < 5; i++) {
        const value = parseInt(valueInputs[i].value) || 0;  // 入力値を取得
        const label = labelInputs[i].value;  // 凡例を取得
        let angle = 0;

        // 値に応じた角度を計算
        switch (value) {
            case 5:
                angle = (30 * Math.PI) / 180; // 30度
                break;
            case 10:
                angle = (60 * Math.PI) / 180; // 60度
                break;
            case 15:
                angle = (90 * Math.PI) / 180; // 90度
                break;
            case 20:
                angle = (120 * Math.PI) / 180; // 120度
                break;
            case 25:
                angle = (150 * Math.PI) / 180; // 150度
                break;
            case 30:
                angle = (180 * Math.PI) / 180; // 180度
                break;
            case 35:
                angle = (210 * Math.PI) / 180; // 210度
                break;
            case 40:
                angle = (240 * Math.PI) / 180; // 240度
                break;
            case 45:
                angle = (270 * Math.PI) / 180; // 270度
                break;
            case 50:
                angle = (300 * Math.PI) / 180; // 300度
                break;
            default:
                continue; // 対象外の場合はスキップ
        }

        // データを追加
        data.push({ angle: angle, label: label, color: colors[i] });
        totalValue += value; // 合計を計算
    }

    // エラーメッセージをクリア
    errorMessage.textContent = '';

    // 合計が50でない場合
    if (totalValue !== 50) {
        errorMessage.textContent = 'エラー: 入力に誤りがあります。5分単位、合計50分で入力して下さい。';
        return;
    }

    // グラフを描画するためにクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    legend.innerHTML = '';

    // 円グラフを描画
    data.forEach((entry) => {
        // 円グラフの描画
        ctx.beginPath();
        // 円グラフの中心を指定
        ctx.moveTo(150, 150);
        // 各セグメントの角度を指定
        ctx.arc(150, 150, 150, startAngle, startAngle + entry.angle);
        // セグメントの色を指定
        ctx.fillStyle = entry.color;
        // セグメントを塗りつぶす
        ctx.fill();
        // 開始角度を更新
        startAngle += entry.angle;
        // 凡例の作成
        const legendItem = document.createElement('div');
        legendItem.innerHTML = `<span style="color:${entry.color};">■</span> ${entry.label}`;
        legend.appendChild(legendItem);
    });

    // 針を描画
    drawClockHand(ctx, clockAngle);

    // ボタンを表示する
    displayButton();
}

function drawClockHand(ctx, angle) {
    // キャンバスの状態を保存して、針だけを描画
    ctx.save();
    ctx.translate(150, 150); // 中心に移動
    ctx.rotate(angle - Math.PI / 360); // 針を0時の位置に調整
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -150); // 針の長さを100pxに設定
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#000'; // 針の色を黒に設定
    ctx.stroke();
    ctx.restore(); // キャンバスの状態を元に戻す
}

// ボタンの表示
function displayButton() {
    startButton.style.display = 'block';
    resetButton.style.display = 'block';
}

// 時計を動かす
function startClock() {
    // スタートボタンを押せなくする
    document.getElementById('startButton').disabled = true;
    // リセットボタンを押せるようにする
    document.getElementById('resetButton').disabled = false;

    const canvas = document.getElementById('pieChart');
    const ctx = canvas.getContext('2d');

    // 1分ごとに針を6度ずつ動かす
    clockInterval = setInterval(() => {
        // キャンバスをクリアして再描画するが、円グラフは一度だけ描画
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 円グラフの再描画
        let startAngle = -Math.PI / 2;
        data.forEach((entry) => {
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.arc(150, 150, 150, startAngle, startAngle + entry.angle);
            ctx.fillStyle = entry.color;
            ctx.fill();
            startAngle += entry.angle;
        });

        clockAngle += (6 * Math.PI) / 180; // 6度（1分）ごとに更新
        drawClockHand(ctx, clockAngle); // 針を再描画
    }, 60000); // 1分ごとに更新（60秒 = 60000ミリ秒）
}

function resetClock() {
    // リセットボタンを押せなくする
    document.getElementById('resetButton').disabled = true;
    // スタートボタンを押せるようにする
    document.getElementById('startButton').disabled = false;

    clearInterval(clockInterval); // インターバルをクリア
    clockAngle = 0; // 針の位置をリセット
    document.getElementById('startButton').disabled = false; // スタートボタンを有効にする
    generateChart(); // 円グラフを再描画
}