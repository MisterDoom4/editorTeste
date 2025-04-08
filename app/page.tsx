"use client";

import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { ComponentSidebar } from "@/components/component-sidebar";
import { PreviewArea } from "@/components/preview-area";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface Component {
  id: string;
  type: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export default function Home() {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    
    if (!over) return;

    // Handle dropping new component from sidebar
    if (active.data.current?.type && !active.data.current?.isPlaced) {
      const position = { x: delta.x, y: delta.y };
      setComponents((prev) => [
        ...prev,
        {
          id: `${active.data.current.type}-${Date.now()}`,
          type: active.data.current.type,
          position,
          size: { width: 200, height: 100 },
        },
      ]);
      return;
    }

    // Update component position
    if (active.data.current?.isPlaced) {
      setComponents((prev) =>
        prev.map((component) =>
          component.id === active.id
            ? {
                ...component,
                position: {
                  x: (component.position?.x || 0) + delta.x,
                  y: (component.position?.y || 0) + delta.y,
                },
              }
            : component
        )
      );
    }
  };

  const handleComponentSelect = (id: string) => {
    setSelectedComponent(id === selectedComponent ? null : id);
  };

  const handleResize = (id: string, size: { width: number; height: number }) => {
    setComponents((prev) =>
      prev.map((component) =>
        component.id === id
          ? {
              ...component,
              size,
            }
          : component
      )
    );
  };

  const handleSave = () => {
    console.log("Saving layout:", components);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-background">
        <ComponentSidebar />
        <main className="flex-1 p-6">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Page Editor</h1>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Layout
            </Button>
          </div>
          <PreviewArea
            components={components}
            selectedComponent={selectedComponent}
            onSelect={handleComponentSelect}
            onResize={handleResize}
          />
        </main>
      </div>
    </DndContext>
  );
}