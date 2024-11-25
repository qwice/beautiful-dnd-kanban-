import './App.css';
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import data from "./tasks.js";
import axios from "axios";

function App() {
  const categories = ["준비 목록", "진행중 목록", "완료 목록"];

  // 상태를 category별로 분리
  const [tasks, setTasks] = useState(data);

  useEffect(() => {
    axios.get("http://localhost:8080/api/tasks")
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  // Drag and Drop 완료 시 실행될 함수
  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log(result);
  
    // 드래그가 유효하지 않으면 종료
    if (!destination) return;
  
    // 같은 위치로 이동한 경우
    if (
      destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
  
    const sourceCategory = source.droppableId;
  
    // Drag된 task 찾기
    const draggedTask = tasks.find(
      (task) => task.category === sourceCategory && task.title === result.draggableId
    );
    console.log('drag : ',draggedTask)
  
    if (!draggedTask) return;
  
    setTasks((prevTasks) => {
      // 기존 tasks 복사
      const updatedTasks = [...prevTasks];
  
      // 다른 카테고리로 이동한 경우
      const removeIndex = updatedTasks.findIndex(task => task.title === result.draggableId)
      console.log('removeIndex : ', removeIndex)
      const remove = updatedTasks.splice(removeIndex, 1);
      console.log('remove : ', remove);
      const addIndex = updatedTasks.findIndex(task => task.category === destination.droppableId)
      console.log('addIndex :', addIndex)
      const filteredTasks = updatedTasks.filter((task) => task !== draggedTask);
      console.log('1filter : ', filteredTasks)
      filteredTasks.splice(addIndex + destination.index, 0, { ...draggedTask, category: destination.droppableId });
      console.log('2filter : ', filteredTasks)
      return [...filteredTasks]
      });
      
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <h1 className="title">Test</h1><hr />
      <div className="center">
        <div className="back">
          {categories.map((category) => (
            <Droppable droppableId={category} key={category}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <div className="wrap">
                    <h2>{category}</h2>
                    {tasks
                      .filter((task) => task.category === category)
                      .map((task, index) => (
                        <Draggable
                          draggableId={task.title}
                          index={index}
                          key={task.title}
                        >
                          {(provided) => (
                            <div
                              className="text"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {task.title}
                            </div>
                          )}
                        </Draggable>
                      ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
