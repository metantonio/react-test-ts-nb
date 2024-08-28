import React from 'react';
import { useDrag } from 'react-dnd';

const Box = ({ id, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    item: { id, label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        border: '1px solid black',
        padding: '0.5rem',
        margin: '0.5rem',
      }}
    >
      {label}
    </div>
  );
};

export default Box;
