import React, { useState, useEffect, memo, useRef, useCallback } from "react";
import { X, Minimize, Maximize, GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FloatingPanelProps {
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  width?: number;
  height?: number;
  onClose?: () => void;
  onMinimize?: () => void;
  onPositionChange?: (x: number, y: number) => void;
  className?: string;
}

function FloatingPanelComponent({
  title,
  children,
  initialPosition = { x: 20, y: 20 },
  width = 400,
  height = 300,
  onClose,
  onMinimize,
  onPositionChange,
  className,
}: FloatingPanelProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartPosition = useRef({ x: 0, y: 0 });
  const originalPosition = useRef({ x: 0, y: 0 });

  // Update position when initialPosition prop changes
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target instanceof HTMLElement) {
        // Only allow dragging from the header area
        if (e.target.closest(".drag-handle")) {
          e.preventDefault();
          setIsDragging(true);
          dragStartPosition.current = { x: e.clientX, y: e.clientY };
          originalPosition.current = position;
        }
      }
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const deltaX = e.clientX - dragStartPosition.current.x;
        const deltaY = e.clientY - dragStartPosition.current.y;

        const newX = Math.max(0, originalPosition.current.x + deltaX);
        const newY = Math.max(0, originalPosition.current.y + deltaY);

        setPosition({ x: newX, y: newY });
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (onPositionChange) {
        onPositionChange(position.x, position.y);
      }
    }
  }, [isDragging, onPositionChange, position]);

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (onMinimize) {
      onMinimize();
    }
  };

  return (
    <div
      className="absolute"
      style={{
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <div
        ref={cardRef}
        className="pointer-events-auto absolute"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? "grabbing" : "auto",
        }}
      >
        <Card
          className={`shadow-lg overflow-hidden flex flex-col py-0 gap-0 ${className}`}
          style={{
            width: isMinimized ? 280 : width,
            height: isMinimized ? 50 : height,
            zIndex: 50,
            resize: "both",
          }}
        >
          <div
            className="drag-handle bg-accent flex items-center justify-between p-3 cursor-move"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center space-x-2">
              <GripVertical className="size-4 opacity-50" />
              <span className="font-medium text-sm truncate">{title}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon-xs" onClick={toggleMinimize}>
                {isMinimized ? <Maximize /> : <Minimize />}
              </Button>
              {onClose && (
                <Button variant="ghost" size="icon-xs" onClick={onClose}>
                  <X />
                </Button>
              )}
            </div>
          </div>
          {!isMinimized && (
            <div className="flex-1 overflow-auto">{children}</div>
          )}
        </Card>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const FloatingPanel = memo(FloatingPanelComponent);

export default FloatingPanel;
