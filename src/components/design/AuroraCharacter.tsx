'use client';

import { useEffect, useState, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion, useSpring, useTransform, MotionValue } from 'framer-motion';

// 表情类型
type Expression = 'neutral' | 'happy' | 'surprised' | 'shy' | 'sleepy' | 'thinking' | 'wink';

// 暴露给外部的方法
export interface AuroraCharacterRef {
  setExpression: (exp: Expression, duration?: number) => void;
  blink: () => void;
  getExpression: () => Expression;
}

interface AuroraCharacterProps {
  size?: number;
  expression?: Expression;
  className?: string;
  onExpressionChange?: (exp: Expression) => void;
}

const AuroraCharacter = forwardRef<AuroraCharacterRef, AuroraCharacterProps>(({ 
  size = 280, 
  expression: forcedExpression,
  className = '',
  onExpressionChange
}, ref) => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentExpression, setCurrentExpression] = useState<Expression>('neutral');
  const [showShySymbol, setShowShySymbol] = useState(false);
  const [isDrawing, setIsDrawing] = useState(true); // 绘制动画状态
  const expressionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const expression = forcedExpression || currentExpression;

  // 绘制动画完成后关闭
  useEffect(() => {
    const timer = setTimeout(() => setIsDrawing(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // 物理弹簧配置 - 更灵敏
  const springConfig = { mass: 0.5, stiffness: 180, damping: 15 };

  const mouseX = useSpring(0.5, springConfig);
  const mouseY = useSpring(0.5, springConfig);

  // 3D 旋转 - 增大幅度
  const rotateX = useTransform(mouseY, [0, 1], [18, -18]);
  const rotateY = useTransform(mouseX, [0, 1], [-18, 18]);

  // 呼吸缩放
  const breathScale = useTransform(mouseY, [0, 1], [1.05, 0.95]);

  // 眉毛动态 - 增大幅度
  const eyebrowY = useTransform(mouseY, [0, 1], [-6, 6]);
  const eyebrowRotateLeft = useTransform(mouseX, [0, 1], [8, -4]);
  const eyebrowRotateRight = useTransform(mouseX, [0, 1], [4, -8]);

  // 眼睛追踪 - 大幅增强，精准聚焦
  const eyeOffsetX = useTransform(mouseX, [0, 1], [-5, 5]);
  const eyeOffsetY = useTransform(mouseY, [0, 1], [-3, 3]);
  
  // 瞳孔额外偏移 - 更精准的注视感
  const pupilOffsetX = useTransform(mouseX, [0, 1], [-2.5, 2.5]);
  const pupilOffsetY = useTransform(mouseY, [0, 1], [-1.5, 1.5]);

  // 视差偏移 - 增大
  const parallaxX = useTransform(mouseX, [0, 1], [-8, 8]);
  const parallaxY = useTransform(mouseY, [0, 1], [-8, 8]);

  // 嘴巴微动
  const mouthOffsetX = useTransform(mouseX, [0, 1], [-2, 2]);

  // 暴露方法给外部
  useImperativeHandle(ref, () => ({
    setExpression: (exp: Expression, duration?: number) => {
      if (expressionTimeoutRef.current) {
        clearTimeout(expressionTimeoutRef.current);
      }
      setCurrentExpression(exp);
      onExpressionChange?.(exp);
      
      if (exp === 'shy') {
        setShowShySymbol(true);
        setTimeout(() => setShowShySymbol(false), duration || 2000);
      }
      
      if (duration) {
        expressionTimeoutRef.current = setTimeout(() => {
          setCurrentExpression('neutral');
          onExpressionChange?.('neutral');
        }, duration);
      }
    },
    blink: () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);
    },
    getExpression: () => expression
  }), [expression, onExpressionChange]);

  // 鼠标移动处理
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    setMousePos({ x, y });
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // 随机眨眼
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);
    };

    const scheduleNextBlink = () => {
      const delay = 2500 + Math.random() * 4000;
      timeoutId = setTimeout(() => {
        blink();
        scheduleNextBlink();
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(timeoutId);
  }, []);

  // 点击头部触发害羞
  const handleClick = useCallback(() => {
    if (expressionTimeoutRef.current) {
      clearTimeout(expressionTimeoutRef.current);
    }
    setCurrentExpression('shy');
    setShowShySymbol(true);
    onExpressionChange?.('shy');
    
    expressionTimeoutRef.current = setTimeout(() => {
      setCurrentExpression('neutral');
      setShowShySymbol(false);
      onExpressionChange?.('neutral');
    }, 2500);
  }, [onExpressionChange]);

  // 清理
  useEffect(() => {
    return () => {
      if (expressionTimeoutRef.current) {
        clearTimeout(expressionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: size, height: size, outline: 'none', overflow: 'visible' }}
    >
      {/* 动态背景渐变 */}
      <DynamicBackground mousePos={mousePos} />

      {/* 主角色容器 */}
      <motion.div
        className="absolute inset-0 cursor-pointer select-none outline-none overflow-visible"
        onClick={handleClick}
        style={{
          rotateX,
          rotateY,
          scale: breathScale,
          transformStyle: 'preserve-3d',
          overflow: 'visible',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* 极光球体 */}
        <AuroraOrb mousePos={mousePos} isDrawing={isDrawing} />

        {/* 害羞符号 */}
        {showShySymbol && <ShySymbols />}

        {/* 面部 SVG */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          overflow="visible"
          fill="none"
          style={{
            x: parallaxX,
            y: parallaxY,
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))',
          }}
        >
          <Face 
            expression={expression}
            isBlinking={isBlinking}
            isDrawing={isDrawing}
            eyebrowY={eyebrowY}
            eyebrowRotateLeft={eyebrowRotateLeft}
            eyebrowRotateRight={eyebrowRotateRight}
            eyeOffsetX={eyeOffsetX}
            eyeOffsetY={eyeOffsetY}
            pupilOffsetX={pupilOffsetX}
            pupilOffsetY={pupilOffsetY}
            mouthOffsetX={mouthOffsetX}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
});

AuroraCharacter.displayName = 'AuroraCharacter';
export default AuroraCharacter;


// 动态背景组件 - 浏览器视窗4个角落固定色块
function DynamicBackground({ 
  mousePos
}: { 
  mousePos: { x: number; y: number };
}) {
  const { x, y } = mousePos;
  
  // 计算每个角落的透明度 - 鼠标越近越亮
  const topLeftOpacity = 0.2 + 0.4 * (1 - x) * (1 - y);
  const topRightOpacity = 0.2 + 0.4 * x * (1 - y);
  const bottomLeftOpacity = 0.2 + 0.4 * (1 - x) * y;
  const bottomRightOpacity = 0.2 + 0.4 * x * y;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
      {/* 左上角 - 青色 (固定在视窗左上) */}
      <motion.div 
        className="absolute"
        style={{ 
          top: '-20%', 
          left: '-20%', 
          width: '70%', 
          height: '70%',
          filter: 'blur(80px)', 
          mixBlendMode: 'screen' 
        }}
        animate={{
          background: `radial-gradient(ellipse 100% 100% at 30% 30%, 
            rgba(0, 220, 255, ${topLeftOpacity}) 0%, 
            rgba(60, 200, 245, ${topLeftOpacity * 0.4}) 40%, 
            transparent 70%)`
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      
      {/* 右上角 - 柔蓝 (固定在视窗右上) */}
      <motion.div 
        className="absolute"
        style={{ 
          top: '-20%', 
          right: '-20%', 
          width: '70%', 
          height: '70%',
          filter: 'blur(80px)', 
          mixBlendMode: 'screen' 
        }}
        animate={{
          background: `radial-gradient(ellipse 100% 100% at 70% 30%, 
            rgba(100, 180, 255, ${topRightOpacity}) 0%, 
            rgba(130, 190, 250, ${topRightOpacity * 0.4}) 40%, 
            transparent 70%)`
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      
      {/* 左下角 - 紫罗兰 (固定在视窗左下) */}
      <motion.div 
        className="absolute"
        style={{ 
          bottom: '-20%', 
          left: '-20%', 
          width: '70%', 
          height: '70%',
          filter: 'blur(80px)', 
          mixBlendMode: 'screen' 
        }}
        animate={{
          background: `radial-gradient(ellipse 100% 100% at 30% 70%, 
            rgba(170, 130, 255, ${bottomLeftOpacity}) 0%, 
            rgba(150, 120, 240, ${bottomLeftOpacity * 0.4}) 40%, 
            transparent 70%)`
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      
      {/* 右下角 - 淡紫蓝 (固定在视窗右下) */}
      <motion.div 
        className="absolute"
        style={{ 
          bottom: '-20%', 
          right: '-20%', 
          width: '70%', 
          height: '70%',
          filter: 'blur(80px)', 
          mixBlendMode: 'screen' 
        }}
        animate={{
          background: `radial-gradient(ellipse 100% 100% at 70% 70%, 
            rgba(140, 160, 255, ${bottomRightOpacity}) 0%, 
            rgba(160, 170, 250, ${bottomRightOpacity * 0.4}) 40%, 
            transparent 70%)`
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
}

// 极光球体 - 3个120度扇形，颜色随鼠标位置变化，边界柔和无空白
function AuroraOrb({ mousePos, isDrawing }: { mousePos: { x: number; y: number }; isDrawing: boolean }) {
  const { x, y } = mousePos;
  
  // 根据鼠标在视窗的位置混合四角颜色
  // 左上青色, 右上柔蓝, 左下紫罗兰, 右下淡紫蓝
  const cyanWeight = (1 - x) * (1 - y);      // 左上
  const blueWeight = x * (1 - y);            // 右上
  const violetWeight = (1 - x) * y;          // 左下
  const lavenderWeight = x * y;              // 右下
  
  // 混合得到当前主色调
  const r = Math.round(0 * cyanWeight + 100 * blueWeight + 170 * violetWeight + 140 * lavenderWeight);
  const g = Math.round(220 * cyanWeight + 180 * blueWeight + 130 * violetWeight + 160 * lavenderWeight);
  const b = Math.round(255 * cyanWeight + 255 * blueWeight + 255 * violetWeight + 255 * lavenderWeight);
  
  // 次要色调 (偏移)
  const r2 = Math.round(60 * cyanWeight + 130 * blueWeight + 150 * violetWeight + 160 * lavenderWeight);
  const g2 = Math.round(200 * cyanWeight + 190 * blueWeight + 120 * violetWeight + 170 * lavenderWeight);
  const b2 = Math.round(245 * cyanWeight + 250 * blueWeight + 240 * violetWeight + 250 * lavenderWeight);

  // 第三色调 (偏移)
  const r3 = Math.round(80 * cyanWeight + 150 * blueWeight + 140 * violetWeight + 180 * lavenderWeight);
  const g3 = Math.round(210 * cyanWeight + 200 * blueWeight + 140 * violetWeight + 180 * lavenderWeight);
  const b3 = Math.round(250 * cyanWeight + 255 * blueWeight + 250 * violetWeight + 255 * lavenderWeight);

  return (
    <div className="absolute inset-0 overflow-visible">
      {/* 扇形1 - 上方，扩展到150度覆盖间隙 */}
      <motion.div 
        className="absolute -inset-6 rounded-full"
        initial={isDrawing ? { opacity: 0, scale: 0.8 } : false}
        animate={{
          opacity: 1,
          scale: 1,
          background: `conic-gradient(
            from 15deg at 50% 50%,
            rgba(${r}, ${g}, ${b}, 0.75) 0deg,
            rgba(${r}, ${g}, ${b}, 0.6) 45deg,
            rgba(${r}, ${g}, ${b}, 0.35) 90deg,
            rgba(${r}, ${g}, ${b}, 0.15) 120deg,
            rgba(${r}, ${g}, ${b}, 0.05) 150deg,
            transparent 180deg,
            transparent 360deg
          )`
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ filter: 'blur(30px)', mixBlendMode: 'screen' }}
      />

      {/* 扇形2 - 左下，扩展覆盖 */}
      <motion.div 
        className="absolute -inset-6 rounded-full"
        initial={isDrawing ? { opacity: 0, scale: 0.8 } : false}
        animate={{
          opacity: 1,
          scale: 1,
          background: `conic-gradient(
            from 135deg at 50% 50%,
            rgba(${r2}, ${g2}, ${b2}, 0.7) 0deg,
            rgba(${r2}, ${g2}, ${b2}, 0.55) 45deg,
            rgba(${r2}, ${g2}, ${b2}, 0.3) 90deg,
            rgba(${r2}, ${g2}, ${b2}, 0.12) 120deg,
            rgba(${r2}, ${g2}, ${b2}, 0.04) 150deg,
            transparent 180deg,
            transparent 360deg
          )`
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ filter: 'blur(30px)', mixBlendMode: 'screen' }}
      />

      {/* 扇形3 - 右下，扩展覆盖 */}
      <motion.div 
        className="absolute -inset-6 rounded-full"
        animate={{
          background: `conic-gradient(
            from 255deg at 50% 50%,
            rgba(${r3}, ${g3}, ${b3}, 0.7) 0deg,
            rgba(${r3}, ${g3}, ${b3}, 0.55) 45deg,
            rgba(${r3}, ${g3}, ${b3}, 0.3) 90deg,
            rgba(${r3}, ${g3}, ${b3}, 0.12) 120deg,
            rgba(${r3}, ${g3}, ${b3}, 0.04) 150deg,
            transparent 180deg,
            transparent 360deg
          )`
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ filter: 'blur(30px)', mixBlendMode: 'screen' }}
      />

      {/* 底层填充 - 确保无空白 */}
      <motion.div 
        className="absolute -inset-4 rounded-full"
        animate={{
          background: `radial-gradient(circle at 50% 50%, 
            rgba(${(r + r2 + r3) / 3}, ${(g + g2 + g3) / 3}, ${(b + b2 + b3) / 3}, 0.4) 0%, 
            rgba(${(r + r2 + r3) / 3}, ${(g + g2 + g3) / 3}, ${(b + b2 + b3) / 3}, 0.2) 50%, 
            transparent 80%)`
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ filter: 'blur(25px)', mixBlendMode: 'screen' }}
      />

      {/* 中心发光层 */}
      <motion.div 
        className="absolute -inset-2 rounded-full"
        animate={{
          background: `radial-gradient(ellipse 85% 85% at ${45 + x * 10}% ${45 + y * 10}%, 
            rgba(${r}, ${g}, ${b}, 0.55) 0%, 
            rgba(${r2}, ${g2}, ${b2}, 0.3) 40%, 
            transparent 70%)`
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ filter: 'blur(15px)', mixBlendMode: 'screen' }}
      />

      {/* 内层高亮 - 跟随鼠标 */}
      <motion.div 
        className="absolute inset-0 rounded-full"
        animate={{
          background: `radial-gradient(ellipse 65% 65% at ${40 + x * 20}% ${40 + y * 20}%, 
            rgba(230, 245, 255, 0.5) 0%, 
            transparent 55%)`
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        style={{ filter: 'blur(8px)', mixBlendMode: 'screen' }}
      />
    </div>
  );
}

// 害羞符号
function ShySymbols() {
  return (
    <>
      {/* 左侧害羞符号 */}
      <motion.div
        className="absolute text-pink-400 font-bold select-none"
        style={{ top: '25%', left: '5%', fontSize: '1.5rem' }}
        initial={{ opacity: 0, scale: 0, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        
      </motion.div>
      
      {/* 右侧害羞符号 */}
      <motion.div
        className="absolute text-pink-400 font-bold select-none"
        style={{ top: '20%', right: '8%', fontSize: '1.2rem' }}
        initial={{ opacity: 0, scale: 0, rotate: 20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
      >
        
      </motion.div>

      {/* 顶部小星星 */}
      <motion.div
        className="absolute text-yellow-300 select-none"
        style={{ top: '10%', left: '50%', fontSize: '0.8rem', transform: 'translateX(-50%)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 0], y: -5 }}
        transition={{ duration: 1.5, repeat: 1 }}
      >
        ✦
      </motion.div>
    </>
  );
}


// 面部组件
interface FaceProps {
  expression: Expression;
  isBlinking: boolean;
  isDrawing: boolean;
  eyebrowY: MotionValue<number>;
  eyebrowRotateLeft: MotionValue<number>;
  eyebrowRotateRight: MotionValue<number>;
  eyeOffsetX: MotionValue<number>;
  eyeOffsetY: MotionValue<number>;
  pupilOffsetX: MotionValue<number>;
  pupilOffsetY: MotionValue<number>;
  mouthOffsetX: MotionValue<number>;
}

// 绘制动画配置
const drawTransition = (delay: number) => ({
  pathLength: { duration: 0.6, delay, ease: "easeOut" as const },
  opacity: { duration: 0.3, delay }
});

function Face({
  expression,
  isBlinking,
  isDrawing,
  eyebrowY,
  eyebrowRotateLeft,
  eyebrowRotateRight,
  eyeOffsetX,
  eyeOffsetY,
  pupilOffsetX,
  pupilOffsetY,
}: FaceProps) {
  const baseStroke = "rgba(255, 255, 255, 0.95)";
  
  return (
    <>
      {/* 左眉毛 - 独立弧线 */}
      <motion.path
        d={getEyebrowPath('left', expression)}
        fill="none"
        stroke={baseStroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={isDrawing ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={drawTransition(0.2)}
        style={{ 
          y: eyebrowY,
          rotate: eyebrowRotateLeft,
          transformOrigin: '34px 36px'
        }}
      />

      {/* 右眉毛 - 独立弧线 */}
      <motion.path
        d={getEyebrowPath('right', expression)}
        fill="none"
        stroke={baseStroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={isDrawing ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={drawTransition(0.35)}
        style={{ 
          y: eyebrowY,
          rotate: eyebrowRotateRight,
          transformOrigin: '66px 36px'
        }}
      />

      {/* 左眼 */}
      <motion.g style={{ x: eyeOffsetX, y: eyeOffsetY }}>
        <Eye 
          side="left" 
          expression={expression} 
          isBlinking={isBlinking} 
          stroke={baseStroke}
          pupilOffsetX={pupilOffsetX}
          pupilOffsetY={pupilOffsetY}
          isDrawing={isDrawing}
        />
      </motion.g>

      {/* 右眼 */}
      <motion.g style={{ x: eyeOffsetX, y: eyeOffsetY }}>
        <Eye 
          side="right" 
          expression={expression} 
          isBlinking={isBlinking} 
          stroke={baseStroke}
          pupilOffsetX={pupilOffsetX}
          pupilOffsetY={pupilOffsetY}
          isDrawing={isDrawing}
        />
      </motion.g>

      {/* 鼻子 - 左偏15度的 J 形，拉长 */}
      <motion.path
        d="M 46 48 L 43 62 Q 42 67 48 67"
        fill="none"
        stroke={baseStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
        initial={isDrawing ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={drawTransition(1.2)}
      />

      {/* 腮红 */}
      {expression === 'shy' && (
        <>
          <motion.circle 
            cx="26" cy="54" r="6" 
            fill="rgba(255, 182, 193, 0.5)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          />
          <motion.circle 
            cx="74" cy="54" r="6" 
            fill="rgba(255, 182, 193, 0.5)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.05 }}
          />
        </>
      )}
    </>
  );
}

// 眼睛组件 - 带瞳孔追踪
interface EyeProps {
  side: 'left' | 'right';
  expression: Expression;
  isBlinking: boolean;
  stroke: string;
  pupilOffsetX: MotionValue<number>;
  pupilOffsetY: MotionValue<number>;
  isDrawing: boolean;
}

function Eye({ side, expression, isBlinking, stroke, pupilOffsetX, pupilOffsetY, isDrawing }: EyeProps) {
  // 眼睛位置更宽松
  const cx = side === 'left' ? 32 : 68;
  const cy = 46;
  const drawDelay = side === 'left' ? 0.6 : 0.8;

  if (isBlinking || expression === 'sleepy') {
    return (
      <motion.path
        d={`M ${cx - 5} ${cy} Q ${cx} ${cy + 3} ${cx + 5} ${cy}`}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.1 }}
      />
    );
  }

  if (expression === 'shy') {
    return (
      <>
        <line x1={cx - 5} y1={cy - 1} x2={cx + 5} y2={cy - 1} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        <line x1={cx - 5} y1={cy + 3} x2={cx + 5} y2={cy + 3} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      </>
    );
  }

  if (expression === 'wink' && side === 'right') {
    return (
      <path
        d={`M ${cx - 5} ${cy} Q ${cx} ${cy + 3} ${cx + 5} ${cy}`}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    );
  }

  if (expression === 'surprised') {
    return (
      <>
        <circle cx={cx} cy={cy} r="6" fill="none" stroke={stroke} strokeWidth="2" />
        <motion.circle 
          cx={cx} cy={cy} r="3" 
          fill={stroke}
          style={{ x: pupilOffsetX, y: pupilOffsetY }}
        />
      </>
    );
  }

  // 默认眼睛 - 带瞳孔追踪和绘制动画
  return (
    <>
      {/* 眼白 */}
      <motion.circle 
        cx={cx} cy={cy} r="5" 
        fill="rgba(255,255,255,0.3)"
        initial={isDrawing ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: drawDelay, ease: "easeOut" }}
      />
      {/* 瞳孔 - 跟随鼠标 */}
      <motion.circle 
        cx={cx} cy={cy} r="3.5" 
        fill={stroke}
        style={{ x: pupilOffsetX, y: pupilOffsetY }}
        initial={isDrawing ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: drawDelay + 0.2, ease: "easeOut" }}
      />
      {/* 眼睛高光 */}
      <motion.circle 
        cx={cx + 1.5} cy={cy - 1.5} r="1" 
        fill="rgba(255,255,255,0.8)"
        initial={isDrawing ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, delay: drawDelay + 0.4, ease: "easeOut" }}
      />
    </>
  );
}

// 眉毛路径 - 位置更宽松
function getEyebrowPath(side: 'left' | 'right', expression: Expression): string {
  const isLeft = side === 'left';
  const baseX = isLeft ? 24 : 60;
  const endX = isLeft ? 40 : 76;
  const midX = isLeft ? 32 : 68;

  switch (expression) {
    case 'surprised':
      return `M ${baseX} 32 Q ${midX} 24 ${endX} 32`;
    case 'thinking':
      return isLeft 
        ? `M ${baseX} 36 Q ${midX} 30 ${endX} 34`
        : `M ${baseX} 34 Q ${midX} 28 ${endX} 36`;
    case 'sleepy':
      return `M ${baseX} 38 Q ${midX} 36 ${endX} 38`;
    case 'shy':
      return `M ${baseX} 34 Q ${midX} 30 ${endX} 34`;
    default:
      return `M ${baseX} 35 Q ${midX} 29 ${endX} 35`;
  }
}

// 嘴巴组件 - 位置更宽松
function Mouth({ expression, stroke }: { expression: Expression; stroke: string }) {
  const cy = 70; // 嘴巴位置下移
  
  switch (expression) {
    case 'happy':
      // ω 形状 - 开心时更大
      return (
        <motion.path
          d="M 38 68 Q 42 76 50 68 Q 58 76 62 68"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      );
    case 'surprised':
      // 惊讶的 O 形
      return (
        <motion.ellipse
          cx="50"
          cy={cy + 2}
          rx="5"
          ry="6"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
      );
    case 'shy':
      // 害羞的小 ω
      return (
        <path
          d="M 42 69 Q 45 73 50 69 Q 55 73 58 69"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    case 'thinking':
      // 思考时歪嘴
      return (
        <path
          d="M 46 70 Q 50 73 54 70 Q 58 73 60 71"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    case 'sleepy':
      // 困倦的小嘴
      return (
        <path
          d="M 46 70 Q 48 72 50 70 Q 52 72 54 70"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    case 'wink':
      // 眨眼时的 ω
      return (
        <path
          d="M 40 68 Q 44 75 50 68 Q 56 75 60 68"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    default:
      // 默认 ω 欧米伽嘴巴
      return (
        <path
          d="M 40 68 Q 44 74 50 68 Q 56 74 60 68"
          fill="none"
          stroke={stroke}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      );
  }
}


// AuroraCharacter (主组件)
// ├── DynamicBackground (背景 - 4角色块)
// ├── AuroraOrb (极光球体 - 3扇形)
// ├── ShySymbols (害羞符号 ❤♡✦)
// └── Face (面部 SVG)
//     ├── 眉毛 x2
//     ├── Eye x2 (眼睛组件)
//     └── 鼻子
