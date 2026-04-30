"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useCanvas } from "@/context/context";
import {
  AlignCenter,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  BringToFront,
  Circle as CircleIcon,
  Copy,
  Eye,
  EyeOff,
  FlipHorizontal,
  FlipVertical,
  Lock,
  LockOpen,
  RotateCcw,
  SendToBack,
  Square,
  Trash2,
} from "lucide-react";
import { Circle, Rect } from "fabric";
import { toast } from "sonner";

const SHAPE_FILL = "#38bdf8";

const getObjectName = (object, index) => {
  if (!object) return "Layer";
  if (object.type === "i-text") return object.text?.trim() || "Text";
  if (object.type === "image") return "Image";
  if (object.type === "rect") return "Rectangle";
  if (object.type === "circle") return "Circle";
  return `${object.type || "Object"} ${index + 1}`;
};

const getScaledSize = (object) => ({
  width: Math.round((object.width || 0) * (object.scaleX || 1)),
  height: Math.round((object.height || 0) * (object.scaleY || 1)),
});

export function LayersControls() {
  const { canvasEditor } = useCanvas();
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectionVersion, setSelectionVersion] = useState(0);

  const refreshLayers = () => {
    if (!canvasEditor) return;
    setObjects([...canvasEditor.getObjects()]);
    setSelectedObject(canvasEditor.getActiveObject() || null);
    setSelectionVersion((version) => version + 1);
  };

  useEffect(() => {
    if (!canvasEditor) return;

    refreshLayers();

    const events = [
      "object:added",
      "object:removed",
      "object:modified",
      "selection:created",
      "selection:updated",
      "selection:cleared",
    ];
    events.forEach((eventName) => canvasEditor.on(eventName, refreshLayers));

    return () => {
      events.forEach((eventName) => canvasEditor.off(eventName, refreshLayers));
    };
  }, [canvasEditor]);

  const selectedMetrics = useMemo(() => {
    if (!selectedObject) return null;
    const size = getScaledSize(selectedObject);
    return {
      left: Math.round(selectedObject.left || 0),
      top: Math.round(selectedObject.top || 0),
      angle: Math.round(selectedObject.angle || 0),
      opacity: Math.round((selectedObject.opacity ?? 1) * 100),
      width: size.width,
      height: size.height,
      fill:
        typeof selectedObject.fill === "string" ? selectedObject.fill : SHAPE_FILL,
    };
  }, [selectedObject, selectionVersion]);

  const commitObjectChange = () => {
    if (!canvasEditor || !selectedObject) return;
    selectedObject.setCoords();
    canvasEditor.fire("object:modified", { target: selectedObject });
    canvasEditor.requestRenderAll();
    refreshLayers();
  };

  const selectObject = (object) => {
    if (!canvasEditor || !object.selectable) return;
    canvasEditor.setActiveObject(object);
    canvasEditor.requestRenderAll();
    refreshLayers();
  };

  const updateObject = (updates) => {
    if (!selectedObject) return;
    selectedObject.set(updates);
    commitObjectChange();
  };

  const updateScaledDimension = (key, value) => {
    if (!selectedObject) return;
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) return;
    const base = selectedObject[key] || numericValue;
    selectedObject.set(key === "width" ? "scaleX" : "scaleY", numericValue / base);
    commitObjectChange();
  };

  const addShape = (shape) => {
    if (!canvasEditor) return;

    const commonProps = {
      left: canvasEditor.width / 2,
      top: canvasEditor.height / 2,
      originX: "center",
      originY: "center",
      fill: SHAPE_FILL,
      stroke: "#0f172a",
      strokeWidth: 2,
      opacity: 0.9,
      selectable: true,
      evented: true,
    };

    const object =
      shape === "circle"
        ? new Circle({ ...commonProps, radius: 80 })
        : new Rect({ ...commonProps, width: 180, height: 120, rx: 8, ry: 8 });

    canvasEditor.add(object);
    canvasEditor.setActiveObject(object);
    canvasEditor.fire("object:modified", { target: object });
    canvasEditor.requestRenderAll();
    refreshLayers();
  };

  const duplicateSelected = async () => {
    if (!canvasEditor || !selectedObject) return;

    try {
      const clone = await selectedObject.clone();
      clone.set({
        left: (selectedObject.left || 0) + 24,
        top: (selectedObject.top || 0) + 24,
        evented: true,
        selectable: true,
      });
      canvasEditor.add(clone);
      canvasEditor.setActiveObject(clone);
      canvasEditor.fire("object:modified", { target: clone });
      canvasEditor.requestRenderAll();
      refreshLayers();
    } catch (error) {
      console.error("Error duplicating object:", error);
      toast.error("Could not duplicate the selected object");
    }
  };

  const deleteSelected = () => {
    if (!canvasEditor || !selectedObject) return;
    canvasEditor.remove(selectedObject);
    canvasEditor.discardActiveObject();
    canvasEditor.requestRenderAll();
    refreshLayers();
  };

  const alignSelected = (alignment) => {
    if (!canvasEditor || !selectedObject) return;

    const size = getScaledSize(selectedObject);
    const updates = {};

    if (alignment === "left") updates.left = size.width / 2;
    if (alignment === "center") updates.left = canvasEditor.width / 2;
    if (alignment === "right") updates.left = canvasEditor.width - size.width / 2;
    if (alignment === "top") updates.top = size.height / 2;
    if (alignment === "middle") updates.top = canvasEditor.height / 2;
    if (alignment === "bottom") updates.top = canvasEditor.height - size.height / 2;

    updateObject(updates);
  };

  const arrangeSelected = (direction) => {
    if (!canvasEditor || !selectedObject) return;

    if (direction === "front") canvasEditor.bringObjectToFront(selectedObject);
    if (direction === "back") canvasEditor.sendObjectToBack(selectedObject);
    canvasEditor.fire("object:modified", { target: selectedObject });
    canvasEditor.requestRenderAll();
    refreshLayers();
  };

  const toggleVisibility = (object) => {
    object.set("visible", !object.visible);
    canvasEditor.fire("object:modified", { target: object });
    canvasEditor.requestRenderAll();
    refreshLayers();
  };

  const toggleLock = (object) => {
    const isLocked = Boolean(object.lockMovementX);
    object.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
      lockRotation: !isLocked,
      selectable: isLocked,
      evented: isLocked,
    });
    if (!isLocked) canvasEditor.discardActiveObject();
    canvasEditor.fire("object:modified", { target: object });
    canvasEditor.requestRenderAll();
    refreshLayers();
  };

  if (!canvasEditor) {
    return <p className="text-sm text-white/70">Canvas not ready</p>;
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => addShape("rect")} variant="glass" size="sm">
          <Square className="h-4 w-4" />
          Rectangle
        </Button>
        <Button onClick={() => addShape("circle")} variant="glass" size="sm">
          <CircleIcon className="h-4 w-4" />
          Circle
        </Button>
      </div>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">Layer Stack</h3>
          <span className="text-xs text-white/50">{objects.length} objects</span>
        </div>

        <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
          {[...objects].reverse().map((object, reverseIndex) => {
            const originalIndex = objects.length - reverseIndex - 1;
            const isSelected = selectedObject === object;
            const isLocked = Boolean(object.lockMovementX);

            return (
              <div
                key={`${object.type}-${originalIndex}`}
                className={`flex items-center gap-2 rounded-md border px-2 py-2 text-sm transition ${
                  isSelected
                    ? "border-cyan-400/70 bg-cyan-400/10 text-white"
                    : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectObject(object)}
                  className="min-w-0 flex-1 truncate text-left"
                  title={getObjectName(object, originalIndex)}
                >
                  {getObjectName(object, originalIndex)}
                </button>
                <Button
                  onClick={() => toggleVisibility(object)}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white/70 hover:text-white"
                  title={object.visible ? "Hide layer" : "Show layer"}
                >
                  {object.visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={() => toggleLock(object)}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white/70 hover:text-white"
                  title={isLocked ? "Unlock layer" : "Lock layer"}
                >
                  {isLocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <LockOpen className="h-4 w-4" />
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {selectedObject && selectedMetrics && (
        <section className="space-y-5 border-t border-white/10 pt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Transform</h3>
            <div className="flex gap-1">
              <Button
                onClick={duplicateSelected}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/70 hover:text-white"
                title="Duplicate"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={deleteSelected}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-300 hover:text-red-200"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ["X", "left"],
              ["Y", "top"],
              ["W", "width"],
              ["H", "height"],
            ].map(([label, key]) => (
              <label key={key} className="space-y-1 text-xs text-white/60">
                {label}
                <Input
                  type="number"
                  value={selectedMetrics[key]}
                  onChange={(event) =>
                    key === "width" || key === "height"
                      ? updateScaledDimension(key, event.target.value)
                      : updateObject({ [key]: Number(event.target.value) || 0 })
                  }
                  className="h-8 border-white/15 bg-slate-800 text-white"
                />
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-white/60">
              <span>Rotation</span>
              <span>{selectedMetrics.angle}°</span>
            </div>
            <Slider
              value={[selectedMetrics.angle]}
              min={-180}
              max={180}
              step={1}
              onValueChange={(value) => updateObject({ angle: value[0] })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-white/60">
              <span>Opacity</span>
              <span>{selectedMetrics.opacity}%</span>
            </div>
            <Slider
              value={[selectedMetrics.opacity]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => updateObject({ opacity: value[0] / 100 })}
            />
          </div>

          {["rect", "circle", "i-text"].includes(selectedObject.type) && (
            <label className="space-y-2 text-xs text-white/60">
              Fill
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedMetrics.fill}
                  onChange={(event) => updateObject({ fill: event.target.value })}
                  className="h-9 w-11 cursor-pointer rounded-md border border-white/15 bg-transparent"
                />
                <Input
                  value={selectedMetrics.fill}
                  onChange={(event) => updateObject({ fill: event.target.value })}
                  className="h-9 border-white/15 bg-slate-800 text-white"
                />
              </div>
            </label>
          )}

          <div className="grid grid-cols-4 gap-2">
            <Button
              onClick={() => alignSelected("left")}
              variant="outline"
              size="icon"
              title="Align left"
            >
              <AlignCenter className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              onClick={() => alignSelected("center")}
              variant="outline"
              size="icon"
              title="Align center"
            >
              <AlignHorizontalJustifyCenter className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => alignSelected("middle")}
              variant="outline"
              size="icon"
              title="Align middle"
            >
              <AlignVerticalJustifyCenter className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => alignSelected("top")}
              variant="outline"
              size="icon"
              title="Align top"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Button
              onClick={() => updateObject({ flipX: !selectedObject.flipX })}
              variant="outline"
              size="icon"
              title="Flip horizontal"
            >
              <FlipHorizontal className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => updateObject({ flipY: !selectedObject.flipY })}
              variant="outline"
              size="icon"
              title="Flip vertical"
            >
              <FlipVertical className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => arrangeSelected("front")}
              variant="outline"
              size="icon"
              title="Bring to front"
            >
              <BringToFront className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => arrangeSelected("back")}
              variant="outline"
              size="icon"
              title="Send to back"
            >
              <SendToBack className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={() => updateObject({ angle: 0, flipX: false, flipY: false })}
            variant="glass"
            size="sm"
            className="w-full"
          >
            <RotateCcw className="h-4 w-4" />
            Reset orientation
          </Button>
        </section>
      )}
    </div>
  );
}
