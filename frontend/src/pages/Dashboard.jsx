import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';

import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

const API_BASE_URL = 'http://localhost:8000/api';

const statusLabels = {
  pending: 'Beklemede',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

const tagColors = {
  'Acil': 'bg-red-500',
  'Geliştirme': 'bg-blue-500',
  'Tasarım': 'bg-purple-500',
  'Test': 'bg-green-500',
  'Hata': 'bg-orange-500',
  'Dokümantasyon': 'bg-gray-500',
  'Düşük': 'bg-gray-500',    
  'Orta': 'bg-yellow-600',  
  'Yüksek': 'bg-red-700',    
};

const priorityOrder = {
  'Yüksek': 3,
  'Orta': 2,
  'Düşük': 1,
};

/**
 * Sürüklenip bırakılabilen bir öğeyi temsil eden React bileşeni.
 * @param {object} props 
 * @param {object} props.todo 
 */
function SortableItem({ todo }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: String(todo.id) });

  const style = {
    transform: CSS.Transform.toString(transform), 
    transition,
    opacity: isDragging ? 0.5 : 1, 
    cursor: 'grab', 
    backgroundColor: 'white',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '0.5rem',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <p className="font-medium">{todo.title}</p>
      {/* Etiketleri göster */}
      {todo.tags && todo.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {todo.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-0.5 rounded-full text-xs text-white ${tagColors[tag] || 'bg-gray-400'}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Sürüklenip bırakılabilen öğeleri barındıran bir kapsayıcıyı temsil eden React bileşeni.
 * @param {object} props 
 * @param {string} props.id
 * @param {React.ReactNode} props.children 
 * @param {string} props.title 
 * @param {Array<object>} props.items 
 * @param {boolean} props.isLast 
*/
function DroppableContainer({ id, children, title, items, isLast }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      containerId: id,
      type: 'container',
    },
  });

  return (
    <div
      ref={setNodeRef} 
      id={id}
      className={`bg-white rounded-lg p-6 w-80 flex-shrink-0 min-h-[300px] shadow-lg border border-gray-200 
                   ${isOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                   ${!isLast ? 'border-r border-gray-300' : ''}`}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      <SortableContext
        items={items.map((item) => String(item.id))} 
        strategy={verticalListSortingStrategy} 
      >
        {children}
        {items.length === 0 && ( 
          <div
            className={`min-h-[50px] p-2 text-gray-400 flex items-center justify-center text-sm border-dashed border-2 ${isOver ? 'border-blue-500' : 'border-gray-300'} rounded-md`}
          >
            Sürükle bırakmak için buraya bırakın
          </div>
        )}
      </SortableContext>
    </div>
  );
}

/**
 * Ana Dashboard bileşeni.
 * Todo listesini, istatistikleri ve kanban panosunu görüntüler.
*/
const Dashboard = () => {
  const [todosByStatus, setTodosByStatus] = useState({
    pending: [],
    in_progress: [],
    completed: [],
    cancelled: [],
  });

  const [stats, setStats] = useState({
    totalTodos: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    totalCategories: 0,
  });

  const [statusData, setStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [upcomingTodos, setUpcomingTodos] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 1000; 

  /**
   * Öncelik stringini yerelleştirir.
   * @param {string} priority - İngilizce öncelik stringi (low, medium, high).
   * @returns {string} Yerelleştirilmiş öncelik stringi (Düşük, Orta, Yüksek).
   */
  const getLocalizedPriority = (priority) => {
    switch (priority) {
      case 'low': return 'Düşük';
      case 'medium': return 'Orta';
      case 'high': return 'Yüksek';
      default: return priority; 
    }
  };

  /**
   * Todoları durumlarına göre gruplandırır ve her grubu önceliğe göre sıralar.
   * @param {Array<object>} todos - Gruplandırılacak todoların listesi.
   * @returns {object} Duruma göre gruplandırılmış ve sıralanmış todolar.
   */
  const groupTodosByStatus = (todos) => {
    const grouped = {
      pending: [],
      in_progress: [],
      completed: [],
      cancelled: [],
    };
    todos.forEach((todo) => {
      if (grouped[todo.status]) {
        grouped[todo.status].push(todo);
      }
    });

    for (const status in grouped) {
      grouped[status].sort((a, b) => {
        const priorityA = priorityOrder[getLocalizedPriority(a.priority)] || 0;
        const priorityB = priorityOrder[getLocalizedPriority(b.priority)] || 0;
        return priorityB - priorityA; 
      });
    }

    return grouped;
  };

  /**
   * Todoların durumlarına göre sayısını hesaplar ve grafik verisi olarak döndürür.
   * @param {Array<object>} todos - Todoların listesi.
   * @returns {Array<object>} Durum ve sayı içeren grafik verileri.
   */
  const getTasksByStatus = (todos) => {
    const buckets = { pending: 0, in_progress: 0, completed: 0, cancelled: 0 };
    todos.forEach(({ status }) => {
      buckets[status] = (buckets[status] || 0) + 1;
    });

    return Object.entries(buckets).map(([status, count]) => ({
      status: statusLabels[status] || status,
      count,
    }));
  };

  /**
   * Todoların önceliklerine göre sayısını hesaplar ve grafik verisi olarak döndürür.
   * @param {Array<object>} todos - Todoların listesi.
   * @returns {Array<object>} Öncelik ve sayı içeren grafik verileri.
   */
  const getTasksByPriority = (todos) => {
    const buckets = { low: 0, medium: 0, high: 0 };
    todos.forEach(({ priority }) => {
      if (buckets[priority] !== undefined) buckets[priority]++;
    });

    return Object.entries(buckets).map(([priority, count]) => ({
      priority:
        priority === 'low' ? 'Düşük' :
        priority === 'medium' ? 'Orta' :
        'Yüksek',
      count,
    }));
  };

  /**
   * Yaklaşan bitiş tarihine sahip todoları filtreler (son 3 gün içinde ve bugün).
   * @param {Array<object>} todos - Tüm todoların listesi.
   * @returns {Array<object>} Son 3 gün içinde bitmesi gereken veya bugün bitmesi gereken todolar.
   */
  const getUpcomingTodos = (todos) => {
    const now = new Date();
    // Saat ve dakikayı sıfırlayarak sadece gün bazında karşılaştırma yapalım
    now.setHours(0, 0, 0, 0); 
    
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);
    // threeDaysLater'ın da saatini gün sonuna ayarlayalım ki o günün tamamını kapsasın
    threeDaysLater.setHours(23, 59, 59, 999);

    return todos.filter(todo => {
      // Sadece 'pending' veya 'in_progress' durumundakileri göster
      if (!todo.due_date || (todo.status !== 'pending' && todo.status !== 'in_progress')) {
        return false;
      }
      
      const dueDate = new Date(todo.due_date);
      dueDate.setHours(0, 0, 0, 0); // Bitiş tarihinin de saatini sıfırlayalım

      // Bitiş tarihi bugüne eşit veya sonraki 3 gün içinde olanlar
      // Ve bitiş tarihi 'threeDaysLater' (bugün + 3 günün sonu) tarihine eşit veya küçük olanlar
      return dueDate >= now && dueDate <= threeDaysLater;
    }).sort((a, b) => new Date(a.due_date) - new Date(b.due_date)); // Tarihe göre sırala
  };


  /**
   * Dashboard verilerini (todolar, kategoriler, istatistikler, grafikler) API'den çeker.
   * Bu fonksiyon ilk yüklemede veya tam bir senkronizasyon gerektiğinde çağrılır.
   */
  const fetchDashboardData = useCallback(async () => {
    setLoading(true); 
    try {
      const [todosRes, categoriesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/todos?limit=${limit}&page=${page}`),
        axios.get(`${API_BASE_URL}/categories`),
      ]);

      const todos = (todosRes.data.data || todosRes.data).map(todo => ({
        ...todo,
        tags: [getLocalizedPriority(todo.priority)], // Eğer Laravel'den etiket gelmiyorsa önceliği etiket olarak kullan
      }));

      const categories = categoriesRes.data.data || []; 

      setTodosByStatus(groupTodosByStatus(todos)); 

      const pendingCount = todos.filter((t) => t.status === 'pending').length;
      const inProgressCount = todos.filter((t) => t.status === 'in_progress').length;
      const completedCount = todos.filter((t) => t.status === 'completed').length;
      const cancelledCount = todos.filter((t) => t.status === 'cancelled').length;

      setStats({
        totalTodos: todos.length, 
        pending: pendingCount,
        inProgress: inProgressCount,
        completed: completedCount,
        cancelled: cancelledCount,
        totalCategories: categories.length,
      });

      setStatusData(getTasksByStatus(todos)); 
      setPriorityData(getTasksByPriority(todos)); 
      setUpcomingTodos(getUpcomingTodos(todos)); 
      setError(null); 
    } catch (err) {
      console.error(err);
      setError('Dashboard verileri yüklenirken hata oluştu.'); 
    } finally {
      setLoading(false); 
    }
  }, [page, limit]); 

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]); 

  // Kanban panosu güncellemesinde istatistikleri ve grafikleri güncelle
  useEffect(() => {
    const allTodos = Object.values(todosByStatus).flat(); 

    const pendingCount = allTodos.filter((t) => t.status === 'pending').length;
    const inProgressCount = allTodos.filter((t) => t.status === 'in_progress').length;
    const completedCount = allTodos.filter((t) => t.status === 'completed').length;
    const cancelledCount = allTodos.filter((t) => t.status === 'cancelled').length;

    setStats((prevStats) => ({
      ...prevStats, 
      totalTodos: allTodos.length,
      pending: pendingCount,
      inProgress: inProgressCount,
      completed: completedCount,
      cancelled: cancelledCount,
    }));

    setStatusData(getTasksByStatus(allTodos));
    setPriorityData(getTasksByPriority(allTodos));
    setUpcomingTodos(getUpcomingTodos(allTodos)); 
  }, [todosByStatus]); 

  const sensors = useSensors(
    useSensor(PointerSensor) 
  );

  const [activeId, setActiveId] = useState(null);

  /**
   * Sürükleme başladığında çağrılan fonksiyon.
   * Aktif öğenin kimliğini ayarlar ve string'e dönüştürür.
   * @param {object} event - Sürükleme olayı nesnesi.
   */
  const handleDragStart = (event) => {
    setActiveId(String(event.active.id)); 
  };

  /**
   * Sürükleme bittiğinde çağrılan fonksiyon.
   * Öğenin durumunu günceller ve backend'e istek gönderir.
   * @param {object} event - Sürükleme olayı nesnesi.
   */
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null); 

    if (!active || !active.id) {
      return;
    }

    const activeIdString = String(active.id); 

    let activeItem = null;
    let activeStatus = null;
    for (const status in todosByStatus) {
      const found = todosByStatus[status].find((item) => String(item.id) === activeIdString); 
      if (found) {
        activeItem = found;
        activeStatus = status;
        break;
      }
    }

    if (!activeItem) return; 

    let newStatus = null;
    if (over) {
      if (over.id && Object.values(todosByStatus).flat().some(item => String(item.id) === String(over.id))) {
        newStatus = Object.keys(todosByStatus).find(status =>
          todosByStatus[status].some(item => String(item.id) === String(over.id))
        );
      }
      else if (over.data.current && over.data.current.type === 'container' && over.data.current.containerId) {
        newStatus = over.data.current.containerId;
      }
      else if (over.id && Object.keys(todosByStatus).includes(String(over.id))) { 
        newStatus = String(over.id); 
      }
    }

    if (!newStatus || activeStatus === newStatus) {
      if (activeStatus === newStatus) { 
        const oldIndex = todosByStatus[activeStatus].findIndex((t) => String(t.id) === activeIdString); 
        const newIndex = todosByStatus[activeStatus].findIndex((t) => String(t.id) === (over ? String(over.id) : null)); 

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const newList = arrayMove(todosByStatus[activeStatus], oldIndex, newIndex);
          setTodosByStatus((prev) => ({
            ...prev,
            [activeStatus]: newList,
          }));
        } else if (oldIndex !== -1 && todosByStatus[activeStatus].length === 0) {
          setTodosByStatus((prev) => ({
            ...prev,
            [activeStatus]: [activeItem],
          }));
        }
      }
      return; 
    }

    const updatedItem = { ...activeItem, status: newStatus };

    setTodosByStatus((prevTodosByStatus) => {
      const newTodosByStatus = { ...prevTodosByStatus };

      const oldList = [...newTodosByStatus[activeStatus]]; 
      const oldIndex = oldList.findIndex((t) => String(t.id) === activeIdString);

      if (oldIndex !== -1) {
        oldList.splice(oldIndex, 1); 
        newTodosByStatus[activeStatus] = oldList; 
      }

      let targetList = [...newTodosByStatus[newStatus]]; 
      const updatedItemPriorityValue = priorityOrder[getLocalizedPriority(updatedItem.priority)];

      let inserted = false;
      for (let i = 0; i < targetList.length; i++) {
        const existingItemPriorityValue = priorityOrder[getLocalizedPriority(targetList[i].priority)];
        if (updatedItemPriorityValue > existingItemPriorityValue) {
          targetList.splice(i, 0, updatedItem);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        targetList.push(updatedItem); 
      }
      newTodosByStatus[newStatus] = targetList; 

      return newTodosByStatus;
    });

  
    try {
      await axios.put(`${API_BASE_URL}/todos/${activeIdString}`, { 
        ...updatedItem,
      });
      setError(null); 
    } catch (err) {
      console.error('Status güncelleme hatası:', err);
      if (err.response && err.response.data) {
        console.error('Backend hata mesajı:', err.response.data);
      }
      setError('Status güncellenirken hata oluştu. Lütfen sayfayı yenileyiniz.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md min-h-[calc(100vh-8rem)]">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Ana Sayfa</h1>

      {loading && <p className="text-center text-gray-600">Yükleniyor...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {!loading && !error && (
        <>
          {/* İstatistik kartları bölümü */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
            {[
              { title: 'Toplam Todo', value: stats.totalTodos, bg: 'bg-blue-600' },
              { title: 'Beklemede', value: stats.pending, bg: 'bg-orange-500' },
              { title: 'Devam Ediyor', value: stats.inProgress, bg: 'bg-yellow-600' },
              { title: 'Tamamlandı', value: stats.completed, bg: 'bg-green-600' },
              { title: 'İptal Edildi', value: stats.cancelled, bg: 'bg-red-600' },
              { title: 'Toplam Kategori', value: stats.totalCategories, bg: 'bg-pink-600' },
            ].map(({ title, value, bg }) => (
              <div key={title} className={`${bg} text-white rounded p-4 flex flex-col items-center justify-center text-center transform hover:scale-105 transition-transform duration-200`}>
                <p className="text-xl font-semibold mb-1">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
              </div>
            ))}
          </section>

          {/* Grafik bölümü */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded shadow p-4 border border-gray-200">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Yapılacaklar Listesi Durum</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={statusData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="status" tickLine={false} axisLine={{ stroke: '#ccc' }} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={{ stroke: '#ccc' }} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="count" fill="#8884d8" barSize={30} radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded shadow p-4 border border-gray-200">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Yapılacaklar Listesi Öncelik</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={priorityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="priority" tickLine={false} axisLine={{ stroke: '#ccc' }} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={{ stroke: '#ccc' }} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="count" fill="#82ca9d" barSize={30} radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Kanban panosu bölümü */}
          <section className="mb-12"> 
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Yapılacaklar Listesi (Kanban)</h2>
            <p className="text-sm text-red-500 italic mb-4">
              *Sürükle Bırak ile durumu değiştirebilirsiniz.
            </p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            >
              <div className="flex gap-0 overflow-x-auto border-t border-b border-gray-200 p-4 bg-gray-50 rounded-lg">
                {Object.keys(todosByStatus).map((statusKey, index) => (
                  <DroppableContainer
                    key={statusKey}
                    id={statusKey}
                    title={statusLabels[statusKey]}
                    items={todosByStatus[statusKey]}
                    isLast={index === Object.keys(todosByStatus).length - 1}
                  >
                    {todosByStatus[statusKey].map((todo) => (
                      <SortableItem key={todo.id} todo={todo} />
                    ))}
                  </DroppableContainer>
                ))}
              </div>
              <DragOverlay>
                {activeId ? (
                  <div className="bg-white p-3 rounded shadow cursor-grabbing w-72">
                    {Object.values(todosByStatus)
                      .flat()
                      .find((todo) => String(todo.id) === activeId)?.title}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </section>

          {/* Yaklaşan Bitiş Tarihleri Listesi - YENİ EKLENEN BÖLÜM (Liste Olarak) */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Yaklaşan Bitiş Tarihleri (Son 3 Gün)</h2>
            {upcomingTodos.length > 0 ? (
              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm bg-white">
                {upcomingTodos.map(todo => (
                  <li key={todo.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition duration-150 ease-in-out">
                    <div className="mb-2 sm:mb-0">
                      <p className="font-semibold text-lg text-gray-800">{todo.title}</p>
                      {todo.description && (
                         <p className="text-sm text-gray-600 truncate max-w-lg">{todo.description}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 sm:ml-4 flex-shrink-0">
                      <p className="text-sm text-gray-500">
                        Bitiş: <span className="font-medium text-yellow-700">{new Date(todo.due_date).toLocaleDateString('tr-TR')}</span>
                      </p>
                      {todo.tags && todo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {todo.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={`px-2 py-0.5 rounded-full text-xs text-white ${tagColors[tag] || 'bg-gray-400'}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 p-4 bg-gray-50 rounded-lg border border-gray-200">
                Son 3 gün içinde bitmesi gereken bir todo bulunmuyor.
              </p>
            )}
          </section>

        </>
      )}
    </div>
  );
};

export default Dashboard;