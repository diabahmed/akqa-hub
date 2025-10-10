'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';

const SPRING_CONFIG = { mass: 0.1, stiffness: 200, damping: 30 };
const ROTATION_RANGE = 100;
const OPACITY_RANGE = 150;
const REST_THRESHOLD = 1;

interface ShapeProps {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}

function findClosestEquivalent(targetAngle: number, currentRotation: number) {
  const candidates = [
    targetAngle,
    targetAngle + 180,
    targetAngle - 180,
    targetAngle + 360,
    targetAngle - 360,
  ];

  let bestTarget = targetAngle;
  let smallestDelta = Infinity;

  for (const candidate of candidates) {
    const delta = Math.abs(candidate - currentRotation);
    if (delta < smallestDelta) {
      smallestDelta = delta;
      bestTarget = candidate;
    }
  }

  return bestTarget;
}

function isAtRestPosition(rotation: number) {
  const normalized = ((rotation % 180) + 180) % 180;
  return Math.abs(normalized) < REST_THRESHOLD || Math.abs(normalized - 180) < REST_THRESHOLD;
}

const Shape = ({ mouseX, mouseY }: ShapeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);

  const rotate = useTransform([mouseX, mouseY], () => {
    if (!ref.current) {
      rotationRef.current = 0;
      return 0;
    }

    const mx = mouseX.get();
    const my = mouseY.get();

    // Mouse left container - reset to vertical if needed
    if (!isFinite(mx) || !isFinite(my)) {
      if (isAtRestPosition(rotationRef.current)) {
        return rotationRef.current;
      }
      const closestRest = findClosestEquivalent(0, rotationRef.current);
      rotationRef.current = closestRest;
      return closestRest;
    }

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = mx - centerX;
    const deltaY = my - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const targetAngle =
      distance > ROTATION_RANGE ? 0 : Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;

    const closestTarget = findClosestEquivalent(targetAngle, rotationRef.current);
    rotationRef.current = closestTarget;
    return closestTarget;
  });

  const opacity = useTransform([mouseX, mouseY], () => {
    if (!ref.current) return 0.2;

    const mx = mouseX.get();
    const my = mouseY.get();
    if (!isFinite(mx) || !isFinite(my)) return 0.2;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = mx - centerX;
    const deltaY = my - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > OPACITY_RANGE) return 0.2;

    const strength = 1 - distance / OPACITY_RANGE;
    return 0.2 + strength * 0.8;
  });

  const rotateSpring = useSpring(rotate, SPRING_CONFIG);
  const opacitySpring = useSpring(opacity, SPRING_CONFIG);

  return (
    <motion.div
      ref={ref}
      className="h-6 w-1 rounded-full bg-gray-950 will-change-transform dark:bg-gray-50"
      style={{
        rotate: rotateSpring,
        opacity: opacitySpring,
      }}
    />
  );
};

const Pattern = () => {
  const mouseX = useMotionValue(-Infinity);
  const mouseY = useMotionValue(-Infinity);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleMouseLeave = () => {
    mouseX.set(-Infinity);
    mouseY.set(-Infinity);
  };

  return (
    <div className="flex h-[320px] min-w-[640px] items-center justify-center overflow-hidden">
      <div
        ref={containerRef}
        className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-5"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: 24 * 6 }, (_, index) => (
          <Shape key={index} mouseX={mouseX} mouseY={mouseY} />
        ))}
      </div>
    </div>
  );
};

export default Pattern;
