import React, { useEffect, useRef } from 'react';

/**
 * Componente LogisticsCanvas
 * Red Neuronal Logística Interactiva con Barcos, Aviones, Contenedores y Camiones.
 * Reacciona dinámicamente al movimiento del cursor del usuario iluminándose y conectando nodos.
 */
export default function LogisticsCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;

    // Estado del mouse con aceleración suave (lerp)
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: true, // Siempre activo para que responda desde el inicio
      radius: 280
    };

    // Íconos logísticos para los nodos especiales
    const LOGISTICS_ICONS = ['✈️', '🚢', '📦', '🚛', '⚓'];

    const nodes = [];
    const NODE_COUNT = 75;
    const MAX_DISTANCE = 180;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      initNodes();
    };

    const initNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        const isIcon = i % 3 === 0; // Cada 3º nodo es un ícono logístico
        const iconSymbol = LOGISTICS_ICONS[Math.floor(Math.random() * LOGISTICS_ICONS.length)];

        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: isIcon ? 18 : Math.random() * 3 + 2,
          isIcon,
          iconSymbol,
          color: Math.random() > 0.4 ? '#E52E71' : (Math.random() > 0.5 ? '#38BDF8' : '#F8FAFC'),
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          isHub: Math.random() > 0.75,
        });
      }
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = width / 2;
      mouse.targetY = height / 2;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);

    handleResize();

    // Posición inicial centrada
    mouse.x = width / 2;
    mouse.y = height / 2;
    mouse.targetX = width / 2;
    mouse.targetY = height / 2;

    const render = () => {
      // Interpolación suave del cursor
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // 1. Resplandor / Foco luminoso del mouse (Rosa Flamenco & Cyan)
      if (mouse.active) {
        const orbGradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          10,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        orbGradient.addColorStop(0, 'rgba(229, 46, 113, 0.35)'); // Rosa IMAS
        orbGradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)'); // Cyan
        orbGradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Renderizar y mover nodos
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Movimiento continuo
        node.x += node.vx;
        node.y += node.vy;

        // Rebote en bordes
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Efecto de pulso
        node.pulse += node.pulseSpeed;
        const pulseScale = 1 + Math.sin(node.pulse) * 0.25;

        // Distancia respecto al mouse
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = dist < mouse.radius;

        // Fuerza de interacción con el ratón (atracción/reacción suave)
        if (isHovered) {
          const force = (1 - dist / mouse.radius) * 2;
          const angle = Math.atan2(dy, dx);
          node.x += Math.cos(angle) * force * 0.9;
          node.y += Math.sin(angle) * force * 0.9;

          // Conexión de línea brillante directa al mouse si está cerca
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouse.x, mouse.y);
            const lineAlpha = (1 - dist / 200) * 0.85;
            ctx.strokeStyle = `rgba(229, 46, 113, ${lineAlpha})`;
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }
        }

        // Conexiones de red entre nodos cercanos
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const ndx = other.x - node.x;
          const ndy = other.y - node.y;
          const nDist = Math.sqrt(ndx * ndx + ndy * ndy);

          if (nDist < MAX_DISTANCE) {
            const nearMouse = isHovered || Math.sqrt((mouse.x - other.x) ** 2 + (mouse.y - other.y) ** 2) < mouse.radius;
            let alpha = (1 - nDist / MAX_DISTANCE) * (nearMouse ? 0.75 : 0.35);

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);

            if (nearMouse) {
              ctx.strokeStyle = node.isIcon || other.isIcon
                ? `rgba(56, 189, 248, ${alpha})`
                : `rgba(229, 46, 113, ${alpha})`;
              ctx.lineWidth = 1.6;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
          }
        }

        // Dibujar Nodo (Ícono Logístico o Punto Neuronal)
        if (node.isIcon) {
          ctx.save();
          ctx.translate(node.x, node.y);
          ctx.globalAlpha = isHovered ? 0.6 : 0.25; // Íconos sutiles y transparentes para mejor lectura

          const scale = (isHovered ? 1.5 : 1.1) * pulseScale;
          ctx.scale(scale, scale);

          ctx.font = '22px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Resplandor del ícono si está cerca del ratón
          if (isHovered) {
            ctx.shadowColor = '#E52E71';
            ctx.shadowBlur = 18;
          } else {
            ctx.shadowColor = 'rgba(56, 189, 248, 0.3)';
            ctx.shadowBlur = 6;
          }

          ctx.fillText(node.iconSymbol, 0, 0);
          ctx.restore();
        } else {
          // Nodo punto neuronal
          ctx.beginPath();
          const currentRadius = node.radius * pulseScale * (isHovered ? 2.0 : 1.0);
          ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);

          const nodeColor = isHovered ? '#E52E71' : node.color;
          ctx.fillStyle = nodeColor;

          if (isHovered || node.isHub) {
            ctx.shadowColor = nodeColor;
            ctx.shadowBlur = isHovered ? 18 : 10;
          }

          ctx.fill();
          ctx.shadowBlur = 0;

          // Anillo decorativo en nodos Hub
          if (node.isHub) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, currentRadius * 2.2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(229, 46, 113, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-100"
    />
  );
}
