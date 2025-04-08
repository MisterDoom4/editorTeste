"use client";

import { useDroppable } from "@dnd-kit/core";
import { ComponentRenderer } from "./component-renderer";

interface Component {
  id: string;
  type: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

interface PreviewAreaProps {
  components: Component[];
  selectedComponent: string | null;
  onSelect: (id: string) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
}

export function PreviewArea({ components, selectedComponent, onSelect, onResize }: PreviewAreaProps) {
  const { setNodeRef } = useDroppable({
    id: "preview-area",
  });

  return (
    <div
      ref={setNodeRef}
      className="relative h-[calc(100vh-120px)] w-full rounded-lg border-2 border-dashed border-muted p-8 overflow-hidden"
    >
      {components.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">
            Drag and drop components here to build your page
          </p>
        </div>
      ) : (
        <div className="relative w-full h-full">
          {components.map((component) => (
            <ComponentRenderer
              key={component.id}
              {...component}
              isSelected={component.id === selectedComponent}
              onSelect={() => onSelect(component.id)}
              onResize={(size) => onResize(component.id, size)}
            />
          ))}
        </div>
      )}
    </div>
  );
}