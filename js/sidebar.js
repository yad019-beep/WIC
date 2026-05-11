// 获取html的数据
const sliderMin = document.getElementById('slider-min');
const sliderMax = document.getElementById('slider-max');
const minValueDisplay = document.getElementById('min-value');
const maxValueDisplay = document.getElementById('max-value');

// 2. 创建function专门更新数字
function updateRange() {
    // 获取当前两个滑块的实际数值
    let minVal = parseInt(sliderMin.value);
    let maxVal = parseInt(sliderMax.value);

    // 防止左边滑块超过右边滑块
    if (minVal >= maxVal) {
        sliderMin.value = maxVal - 1;
        minVal = maxVal - 1;
    }

    // 3. 小于50的数字显示到页面上
    minValueDisplay.textContent = minVal;
    
    // 特殊判断 如果拉到了最右边50 就显示 >50
    if (maxVal === 50) {
        maxValueDisplay.textContent = ">50";
    } else {
        maxValueDisplay.textContent = maxVal;
    }
}

// 4. 当你的鼠标滑动两个滑块时 立刻执行上面的 updateRange
sliderMin.addEventListener('input', updateRange);
sliderMax.addEventListener('input', updateRange);

// 页面刚加载时，先自动执行一次，确保初始数字是对的
updateRange();