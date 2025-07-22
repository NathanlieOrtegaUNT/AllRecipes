import React from 'react';

const DragDropList = ({ day, recipes, onDropRecipe }) => {
  const allowDrop = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    const data = JSON.parse(e.dataTransfer.getData('recipe'));
    onDropRecipe(day, data);
  };

  return (
    <div
      onDragOver={allowDrop}
      onDrop={onDrop}
      style={{
        border: '2px dashed #ccc',
        padding: '20px',
        minHeight: '150px',
        marginBottom: '10px',
      }}
    >
      <h3>{day}</h3>
      {recipes.map((recipe, index) => (
        <div key={index} style={{ margin: '5px 0' }}>
          {recipe.title}
        </div>
      ))}
    </div>
  );
};

export default DragDropList;