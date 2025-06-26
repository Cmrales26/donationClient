'use client';

import CampaignSelect from '@/components/selects/selectCompaigns';
import { SelectTaskStatus } from '@/components/selects/selectTaskStatus';
import { config } from '@/constants/config';
import { Task as TaskType } from '@/models/task';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import CreateTask from './create_edit/create_edit';
import { useAuth } from '@/context/AuthContext';

interface SortableItemProps {
  task: TaskType;
}

interface TaskListProps {
  tasks: TaskType[];
  onDragEnd: (event: DragEndEvent) => void;
  setEdited: (value: boolean) => void;
  onStatusChange?: (taskId: number, newStatus: string) => void;
  setSelectedTask?: (task: TaskType | null) => void;
}

const fetchTasks = async (
  campaignId: number,
  status?: string
): Promise<TaskType[]> => {
  const token = localStorage.getItem('token');
  let url = `${config.apiBaseUrl}/tasks?campaign=${campaignId}`;
  if (status) {
    url += `&status=${status}`;
  }
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Error fetching tasks');
  }
  return response.json();
};

const updateTaskOrder = async (taskId: number, newOrder: number) => {
  const token = localStorage.getItem('token');
  await fetch(`${config.apiBaseUrl}/tasks/${taskId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ order: newOrder })
  });
};

const SortableItem = ({
  task,
  onStatusChange,
  setEdited,
  setSelectedTask
}: SortableItemProps & {
  onStatusChange?: (taskId: number, newStatus: string) => void;
  setEdited: (value: boolean) => void;
  setSelectedTask?: (task: TaskType | null) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      disabled: false
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  const { user } = useAuth();

  return (
    <li
      ref={setNodeRef}
      style={style}
      className='p-4 rounded shadow bg-gray-800 flex flex-col gap-2'
    >
      <div className='flex justify-between items-center'>
        <div className='cursor-move' {...attributes} {...listeners}>
          <strong className='text-lg'>{task.title}</strong>
        </div>
        <div className='flex items-center gap-2'>
          <div>
            {task.status === 'completed' ? (
              <span className='px-2 py-2.5 rounded text-xs font-semibold bg-green-600 text-white'>
                completed
              </span>
            ) : (
              <select
                value={task.status}
                onChange={handleStatusChange}
                className={`px-2 py-2 rounded text-xs font-semibold ${
                  task.status === 'in_progress'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-500 text-white'
                }`}
              >
                <option value='pending'>pending</option>
                <option value='in_progress'>in progress</option>
                <option value='completed'>completed</option>
              </select>
            )}
          </div>
          {task.status !== 'completed' && user?.role !== 'Beneficiario' && (
            <button
              className='px-3 py-2 rounded bg-blue-600 text-white text-xs font-semibold cursor-pointer'
              onClick={e => {
                e.stopPropagation();
                setEdited(true);
                if (setSelectedTask) {
                  setSelectedTask(task);
                }
              }}
            >
              Editar
            </button>
          )}
        </div>
      </div>
      {task.description && (
        <div className='text-gray-300'>{task.description}</div>
      )}
      <div className='flex justify-between items-center text-xs text-gray-400 mt-2'>
        <span>
          Entrega: {new Date(task.delivery_date).toLocaleDateString()}
        </span>
        <span>ID Beneficiario: {task.beneficiary}</span>
      </div>
    </li>
  );
};

const TaskList = ({
  tasks,
  onDragEnd,
  onStatusChange,
  setEdited,
  setSelectedTask
}: TaskListProps) => {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={tasks.map(task => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.length === 0 ? (
          <div className='text-center text-gray-400 py-8'>
            No tasks available.
          </div>
        ) : (
          <ul className='space-y-4 mx-4'>
            {tasks.map(task => (
              <SortableItem
                setEdited={value => {
                  setEdited(value);
                }}
                setSelectedTask={value => {
                  if (setSelectedTask) {
                    setSelectedTask(value);
                  }
                }}
                key={task.id}
                task={task}
                onStatusChange={(id, newStatus) => {
                  if (onStatusChange) {
                    onStatusChange(id, newStatus);
                  }
                }}
              />
            ))}
          </ul>
        )}
      </SortableContext>
    </DndContext>
  );
};

const Task = () => {
  const [selectCampaign, setselectCampaign] = useState(0);
  const [taskStatus, setTaskStatus] = useState<string | undefined>(undefined);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [edited, setEdited] = useState(false);
  const [seletedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [hideForm, setHideForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      window.location.href = '/auth/login';
    }
  }, [user]);

  useEffect(() => {
    fetchTasks(selectCampaign, taskStatus)
      .then(setTasks)
      .catch(err => console.error('Error fetching tasks:', err));
  }, [selectCampaign, taskStatus]);

  const setNewTaksHandler = (task: TaskType) => {
    if (tasks.some(t => t.id === task.id)) {
      setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
    } else {
      setTasks(prev => [...prev, task]);
    }
  };

  const handlerSelectCampaign = (value: number) => {
    setselectCampaign(value);
    setHideForm(false);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(task => task.id === active.id);
    const newIndex = tasks.findIndex(task => task.id === over.id);

    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    setTasks(newTasks);

    try {
      await updateTaskOrder(Number(active.id), newIndex + 1);
    } catch (err) {
      console.error('Error updating task order:', err);
    }
  };

  const onStatusChange = async (taskId: number, newStatus: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${config.apiBaseUrl}/tasks/${taskId}/update-status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? { ...task, status: newStatus as TaskType['status'] }
            : task
        )
      );
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  return (
    <div
      className={
        selectCampaign && !hideForm && user?.role !== 'Beneficiario'
          ? 'grid grid-cols-1 md:grid-cols-2 gap-4 p-4'
          : 'grid grid-cols-1 gap-4 p-4'
      }
    >
      <article>
        <div className='flex mx-6 my-6'>
          <div className='w-full max-w-md flex gap-4'>
            <CampaignSelect
              value={selectCampaign}
              onChange={value => handlerSelectCampaign(value)}
            />
            <SelectTaskStatus
              onChange={value => {
                setTaskStatus(value);
              }}
            />
          </div>
        </div>
        <h1 className='my-5'>
          <span className='text-2xl font-bold mx-4'>Tareas</span>
        </h1>
        <TaskList
          tasks={tasks}
          onDragEnd={handleDragEnd}
          setEdited={value => {
            setEdited(value);
          }}
          setSelectedTask={value => {
            setSelectedTask(value);
          }}
          onStatusChange={(id, newStatus) => {
            onStatusChange(id, newStatus);
          }}
        />
      </article>

      {selectCampaign && !hideForm && user?.role !== 'Beneficiario' ? (
        <article>
          <CreateTask
            selectedTask={seletedTask}
            campaignId={selectCampaign}
            setnewTask={item => {
              setNewTaksHandler(item);
            }}
            actionMode={edited ? 'edit' : 'create'}
            setEdited={value => {
              setEdited(value);
            }}
            hideForm={value => {
              setHideForm(value);
            }}
          />
        </article>
      ) : null}
    </div>
  );
};

export default Task;
