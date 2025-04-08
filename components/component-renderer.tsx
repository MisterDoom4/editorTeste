"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "./ui/card";
import { useEffect, useRef, useState } from "react";

interface ComponentRendererProps {
  id: string;
  type: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  isSelected?: boolean;
  onSelect?: () => void;
  onResize?: (size: { width: number; height: number }) => void;
}

export function ComponentRenderer({
  id,
  type,
  position = { x: 0, y: 0 },
  size = { width: 200, height: 100 },
  isSelected,
  onSelect,
  onResize,
}: ComponentRendererProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    data: {
      type,
      isPlaced: true,
    },
  });

  const [isResizing, setIsResizing] = useState(false);
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const initialSize = useRef(size);

  // Modificando como aplicamos o transform para usar apenas a translação
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    position: "absolute",
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    opacity: isDragging ? 0.5 : 1,
    transition: isResizing ? "none" : "all 0.2s ease",
    cursor: "move",
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    WebkitOverflowScrolling: "touch",
  };

  useEffect(() => {
    if (!isResizing) return;

    function handleMouseMove(e: MouseEvent) {
      if (!onResize) return;
      
      const dx = e.clientX - resizeStartPos.current.x;
      const dy = e.clientY - resizeStartPos.current.y;
      
      onResize({
        width: Math.max(100, initialSize.current.width + dx),
        height: Math.max(50, initialSize.current.height + dy),
      });
    }

    function handleMouseUp() {
      setIsResizing(false);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, onResize]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    initialSize.current = size;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) onSelect();
  };

  const componentWrapper = (children: React.ReactNode) => (
    <div
      ref={setNodeRef}
      style={style}
      className={`group ${isSelected ? "ring-2 ring-primary" : ""} hover:ring-2 hover:ring-primary/50`}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      {children}
      {isSelected && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );

  const content = (() => {
    switch (type) {
      case "heading":
        return <h2 className="text-3xl font-bold">Sample Heading</h2>;
      
      case "paragraph":
        return (
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        );
      
      case "image":
        return (
          <img
            src="https://images.unsplash.com/photo-1682687220742-aba19b51f319"
            alt="Sample"
            className="w-full h-full object-cover rounded-lg"
            draggable={false}
          />
        );
      
      case "button":
        return <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Click Me</button>;
      
      case "columns":
        return (
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="rounded-lg border p-4">Column 1</div>
            <div className="rounded-lg border p-4">Column 2</div>
          </div>
        );
      
      case "card":
        return (
          <Card className="p-6 h-full">
            <h3 className="text-xl font-semibold mb-2">Card Title</h3>
            <p className="text-muted-foreground">Card content goes here</p>
          </Card>
        );
      
      case "link":
        return (
          <a href="#" className="text-primary hover:underline" onClick={(e) => e.preventDefault()}>
            Sample Link
          </a>
        );
      
      case "list":
        return (
          <ul className="list-disc list-inside space-y-2">
            <li>List Item 1</li>
            <li>List Item 2</li>
            <li>List Item 3</li>
          </ul>
        );
      
      case "container":
        return (
          <div className="rounded-lg border p-6 h-full">
            <p className="text-center text-muted-foreground">Container Content</p>
          </div>
        );
      
      default:
        return null;
    }
  })();

  return componentWrapper(content);
}