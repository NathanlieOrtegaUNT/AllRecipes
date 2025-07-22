import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DraggableRecipeCard from './DraggableRecipeCard';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlanner({ draggedRecipes }) {
  const [calendar, setCalendar] = useState(() => {
    const initial = {};
    daysOfWeek.forEach((day) => (initial[day] = []));
    return initial;
  });

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const draggedRecipe =
      draggedRecipes.find((r) => r.id === draggableId) ||
      calendar[source.droppableId]?.find((r) => r.id === draggableId);

    if (!draggedRecipe) return;

    const sourceList = calendar[source.droppableId] || [];
    const destList = calendar[destination.droppableId] || [];

    // Prevent adding more than 5
    if (destination.droppableId !== 'searchResults' && destList.length >= 5) {
      alert('You can only assign up to 5 recipes per day.');
      return;
    }

    // From search to calendar
    if (source.droppableId === 'searchResults') {
      setCalendar((prev) => ({
        ...prev,
        [destination.droppableId]: [...prev[destination.droppableId], draggedRecipe],
      }));
    }

    // Moving within calendar
    if (
      source.droppableId !== 'searchResults' &&
      destination.droppableId !== 'searchResults'
    ) {
      const newSourceList = [...sourceList];
      const movedItem = newSourceList.splice(source.index, 1)[0];

      const newDestList = [...destList];
      newDestList.splice(destination.index, 0, movedItem);

      setCalendar((prev) => ({
        ...prev,
        [source.droppableId]: source.droppableId === destination.droppableId ? newDestList : newSourceList,
        [destination.droppableId]: newDestList,
      }));
    }
  };

  const handleRemove = (day, recipeId) => {
    setCalendar((prev) => ({
      ...prev,
      [day]: prev[day].filter((r) => r.id !== recipeId),
    }));
  };

  return (
    <div className="meal-planner-container">
      <h1 className="meal-planner-title">Meal Planner</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {daysOfWeek.map((day) => (
            <Droppable key={day} droppableId={day}>
              {(provided) => (
                <div
                  className="day-column"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3>{day}</h3>
                  {calendar[day].map((recipe, index) => (
                    <DraggableRecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      index={index}
                      onRemove={() => handleRemove(day, recipe.id)}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>

        <Droppable droppableId="searchResults">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="search-results-box"
            >
              <h3>Search Results</h3>
              {draggedRecipes.map((recipe, index) => (
                <DraggableRecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}