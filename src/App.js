import './App.css';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import data from "./tasks.js";

function App() {
  // test array
  const [tasks, setTasks] = useState(data);
  
  const categories = ["준비 목록", "진행중 목록", "완료 목록"];
  const ready = [];
  const ing = [];
  const end = [];

  tasks.forEach((task) => {
    if(task.category === '준비 목록'){
      ready.push(task.title)
    }
    else if(task.category === '진행중 목록'){
      ing.push(task.title)
    }
    if(task.category === '완료 목록'){
      end.push(task.title)
    }
  })
  console.log(ready)
  console.log(ing)
  console.log(end)

  // drag가 끝났을 때 실행할 함수
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if(!destination) return;

    const origin = []
  }

  return (
    // DragDropContext ~ onDragEnd 필수
    <DragDropContext onDragEnd={onDragEnd}>
      <h1 className="title">Test</h1><hr/>
      <div className='center'>
        {categories.map((category) => (
          // {/* Droppable ~ droppableId 필수 */}
          <Droppable droppableId={category} key={category}>
            {/* Droppable에는 제공되는 props 존재-> children에 설정 */}
            {(provided) => (
              <div className='back' ref={provided.innerRef} {...provided.droppableProps}>
                <div className='wrap'>
                  <h2>{category}</h2>
                  {tasks
                  .filter((task) => task.category === category)
                  .map((task ,index) => (
                    // Draggable ~ draggableId, index 필수. draggableId와 key는 같아야 함.
                    <Draggable draggableId={task.category} index={index} key={task.category}> 
                      {/* Draggable에는 제공되는 props 존재-> children에 설정 */}
                      {(provided) => (
                        <div
                          className='text'
                          ref={provided.innerRef}
                          // 아래 2개의 props가 모두 있어야 요소를 컨트롤할 수 있다.
                          {...provided.draggableProps} // controls the movement of the draggable
                          {...provided.dragHandleProps} // drag handle
                        >
                          {task.title}
                        </div>
                      )}
                    </Draggable>  
                  ))}
                </div>
                {/* drag할 때, droppable의 영역이 변하지 않게 설정 */}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default App;