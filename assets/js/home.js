// 获取画布元素和根元素
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const root = document.documentElement;

// 检测当前主题
function isDarkMode() {
    return (document.documentElement.getAttribute('data-scheme') || 'light') == 'dark';
}

// 设置画布尺寸为窗口大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    init(); // 窗口大小变化时重新初始化粒子
});

// 粒子类 - 适配明暗主题
class Particle {
    constructor() {
        // 随机位置
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // 更缓慢的速度，适配柔和风格
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        
        // 稍大一点的粒子，提高可见性
        this.size = Math.random() * 2.5 + 0.8;
        
        // 适中的透明度，柔和不刺眼
        this.alpha = Math.random() * 0.6 + 0.4;
        
        // 根据主题设置粒子颜色
        this.setColor();
    }
    
    // 根据当前主题设置粒子颜色
    setColor() {
        const isDark = isDarkMode();
        if (Math.random() > 0.85) {
            // 15%的强调色粒子
            if (isDark) {
                // 暗色主题：淡蓝白色
                const blue = Math.floor(Math.random() * 30) + 180;
                const gray = Math.floor(Math.random() * 20) + 190;
                this.color = `rgba(${gray}, ${blue}, ${blue + 10}, ${this.alpha})`;
            } else {
                // 亮色主题：淡蓝灰色
                const blue = Math.floor(Math.random() * 30) + 100;
                const gray = Math.floor(Math.random() * 20) + 90;
                this.color = `rgba(${gray}, ${blue}, ${blue + 10}, ${this.alpha})`;
            }
        } else {
            // 基础粒子色
            if (isDark) {
                // 暗色主题：浅灰色
                const grayValue = Math.floor(Math.random() * 40) + 180;
                this.color = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${this.alpha})`;
            } else {
                // 亮色主题：深灰色
                const grayValue = Math.floor(Math.random() * 40) + 60;
                this.color = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${this.alpha})`;
            }
        }
    }
    
    // 更新粒子位置
    update() {
        // 边界检测
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        
        // 移动粒子
        this.x += this.vx;
        this.y += this.vy;
    }
    
    // 绘制粒子
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// 鼠标位置
const mouse = {
    x: null,
    y: null,
    radius: 180 // 鼠标感应半径
};

// 创建粒子数组
let particlesArray = [];
const numberOfParticles = 180; // 粒子数量

// 初始化粒子
function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// 绘制所有粒子和连线
function animate() {
    // 根据主题设置背景拖影颜色
    const bgColor = isDarkMode() ? '#303030ff' : '#f5f5faff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 更新并绘制每个粒子
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // 粒子之间连线
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 粒子间最大连线距离
            const maxDistance = 120;
            if (distance < maxDistance) {
                const opacity = 1 - (distance / maxDistance);
                // 根据主题设置连线颜色
                const lineColor = isDarkMode() 
                    ? `rgba(100, 110, 120, ${opacity * 0.4})`  // 暗色主题连线
                    : `rgba(150, 158, 165, ${opacity * 0.25})`; // 亮色主题连线
                
                ctx.beginPath();
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 0.6;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
        
        // 鼠标与粒子连线
        if (mouse.x !== null && mouse.y !== null) {
            const dx = particlesArray[i].x - mouse.x;
            const dy = particlesArray[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const opacity = 1 - (distance / mouse.radius);
                // 根据主题设置鼠标连线颜色
                const mouseLineColor = isDarkMode()
                    ? `rgba(100, 180, 255, ${opacity * 0.6})`  // 暗色主题鼠标连线
                    : `rgba(96, 165, 250, ${opacity * 0.5})`;  // 亮色主题鼠标连线
                
                ctx.beginPath();
                ctx.strokeStyle = mouseLineColor;
                ctx.lineWidth = 1.1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animate);
}

// 监听主题切换事件
function watchThemeChange() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-scheme') {
                // 主题变化时重新初始化粒子（更新颜色）
                init();
            }
        });
    });
    
    // 监听根元素的class变化
    observer.observe(root, {
        attributes: true,
        attributeFilter: ['data-scheme']
    });
}

// 鼠标移动事件
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// 鼠标离开窗口
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// 初始化并启动
init();
animate();
watchThemeChange(); // 启动主题监听
