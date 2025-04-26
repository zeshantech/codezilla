// import React, { useState, useEffect, memo, useRef } from "react";
// import { X, Minimize, Maximize, GripVertical } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Draggable from "react-draggable";

// interface DraggablePanelProps {
//   title: string;
//   children: React.ReactNode;
//   initialPosition?: { x: number; y: number };
//   width?: number;
//   height?: number;
//   onClose?: () => void;
//   onMinimize?: () => void;
//   onPositionChange?: (x: number, y: number) => void;
//   className?: string;
// }

// function DraggablePanelComponent({
//   title,
//   children,
//   initialPosition = { x: 20, y: 20 },
//   width = 400,
//   height = 300,
//   onClose,
//   onMinimize,
//   onPositionChange,
//   className,
// }: DraggablePanelProps) {
//   const [position, setPosition] = useState(initialPosition);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const nodeRef = useRef<HTMLDivElement>(null);

//   // Update position when initialPosition prop changes
//   useEffect(() => {
//     setPosition(initialPosition);
//   }, [initialPosition]);

//   const handleDragStop = (_e: any, data: { x: number; y: number }) => {
//     setPosition({ x: data.x, y: data.y });
//     if (onPositionChange) {
//       onPositionChange(data.x, data.y);
//     }
//   };

//   const toggleMinimize = () => {
//     setIsMinimized(!isMinimized);
//     if (onMinimize) {
//       onMinimize();
//     }
//   };

//   return (
//     <Draggable
//       handle=".drag-handle"
//       position={position}
//       onStop={handleDragStop}
//       bounds="parent"
//       nodeRef={nodeRef}
//     >
//       <div ref={nodeRef} className="absolute">
//         <div
//           className={`shadow-lg overflow-hidden flex flex-col py-0 ${className}`}
//           style={{
//             width: isMinimized ? 240 : width,
//             height: isMinimized ? 40 : height,
//             zIndex: 50,
//             resize: "both",
//           }}
//         >
//           <div className="drag-handle bg-secondary/80 h-10 flex items-center justify-between px-3 cursor-move">
//             <div className="flex items-center space-x-2">
//               <GripVertical className="h-4 w-4 opacity-50" />
//               <span className="font-medium text-sm truncate">{title}</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <Button variant="ghost" size="icon-sm" onClick={toggleMinimize}>
//                 {isMinimized ? (
//                   <Maximize className="size-3" />
//                 ) : (
//                   <Minimize className="size-3" />
//                 )}
//               </Button>
//               {onClose && (
//                 <Button variant="ghost" size="icon-sm" onClick={onClose}>
//                   <X className="size-3" />
//                 </Button>
//               )}
//             </div>
//           </div>
//           {!isMinimized && (
//             <div className="flex-1 overflow-auto p-2">{children}</div>
//           )}
//         </div>
//       </div>
//     </Draggable>
//   );
// }

// // Memoize the component to prevent unnecessary re-renders
// export const DraggablePanel = memo(DraggablePanelComponent);

// export default DraggablePanel;

import React from "react";

export default function DraggablePanel() {
  return <div>DraggablePanel</div>;
}
