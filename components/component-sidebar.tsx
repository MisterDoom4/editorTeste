"use client";

import { useDraggable } from "@dnd-kit/core";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Type, Image, Donut as DonutIcon, Columns, Box, Link, ListOrdered, Square } from "lucide-react";

const COMPONENTS = [
  { type: "heading", icon: Type, label: "Heading" },
  { type: "paragraph", icon: Type, label: "Paragraph" },
  { type: "image", icon: Image, label: "Image" },
  { type: "button", icon: DonutIcon, label: "Button" },
  { type: "columns", icon: Columns, label: "Two Columns" },
  { type: "card", icon: Box, label: "Card" },
  { type: "link", icon: Link, label: "Link" },
  { type: "list", icon: ListOrdered, label: "List" },
  { type: "container", icon: Square, label: "Container" },
];

function DraggableComponent({ type, icon: Icon, label }: { type: string; icon: any; label: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${type}`,
    data: {
      type,
      isPlaced: false,
    },
  });

  return (
    <Button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      variant="outline"
      className={`w-full justify-start ${isDragging ? "opacity-50" : ""}`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

export function ComponentSidebar() {
  return (
    <div className="w-64 border-r bg-card">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Components</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="p-4 space-y-2">
          {COMPONENTS.map((component) => (
            <DraggableComponent key={component.type} {...component} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}