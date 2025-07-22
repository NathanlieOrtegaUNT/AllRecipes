import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

export default function DraggableRecipeCard({ recipe, index }) {
  return (
    <Draggable draggableId={recipe.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            padding: '8px',
            margin: '0 0 8px 0',
            background: 'white',
            border: '1px solid lightgray',
            borderRadius: '4px',
            ...provided.draggableProps.style,
          }}
        >
          {recipe.title}
        </div>
      )}
    </Draggable>
  );
}