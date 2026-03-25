<template>
  <div class="search-page">
    <h1 class="search-title">Поиск по расписанию</h1>

    <!-- Поиск по группе -->
    <div class="search-card">
      <h3 class="card-title">Поиск по группе</h3>
      <div class="search-form">
        <select v-model="search.group" class="form-select">
          <option value="">Выберите группу</option>
          <option v-for="g in groups" :key="g.id || g" :value="g.title || g">
            {{ g.title || g }}
          </option>
        </select>
        <input type="date" v-model="search.start" class="form-input">
        <input type="date" v-model="search.end" class="form-input">
        <button @click="searchByGroup" class="btn-primary">Показать</button>
      </div>
    </div>

    <!-- Поиск по преподавателю -->
    <div class="search-card">
      <h3 class="card-title">Поиск по преподавателю</h3>
      <div class="search-form">
        <select v-model="search.teacher" class="form-select">
          <option value="">Выберите преподавателя</option>
          <option v-for="t in teachers" :key="t" :value="t.teacher">
            {{ t.teacher }}
          </option>
        </select>
        <button @click="searchByTeacher" class="btn-primary">Показать</button>
      </div>
    </div>

    <!-- Свободные аудитории -->
    <div class="search-card">
      <h3 class="card-title">Свободные аудитории</h3>
      <div class="search-form">
        <input type="date" v-model="freeDate" class="form-input">
        <button @click="searchFreeRooms" class="btn-primary">Показать</button>
      </div>
    </div>

    <!-- Результаты поиска -->
    <div v-if="results.length > 0" class="results-card">
      <h3 class="results-title">Результаты ({{ results.length }})</h3>
      <div class="table-wrapper">
        <table class="results-table">
          <thead>
            <tr>
              <th>Группа</th>
              <th>Дата</th>
              <th>Время</th>
              <th>Дисциплина</th>
              <th>Аудитория</th>
              <th>Преподаватель</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in results" :key="item.id">
              <td>{{ item.group }}</td>
              <td>{{ formatDate(item.date) }}</td>
              <td>{{ item.time }}</td>
              <td>{{ item.discipline }}</td>
              <td>{{ item.room }}</td>
              <td>{{ item.teacher }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Свободные аудитории результат -->
    <div v-if="Object.keys(freeRooms).length > 0" class="results-card">
      <h3 class="results-title">Свободные аудитории на {{ freeDate }}</h3>
      <div v-for="(rooms, time) in freeRooms" :key="time" class="free-room-item">
        <strong class="time-label">{{ time }}</strong> —
        <span v-if="rooms.length === 0" class="text-muted">Все аудитории заняты</span>
        <span v-else class="room-list">{{ rooms.join(', ') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/api/api';

const groups = ref([]);
const teachers = ref([]);
const allSchedule = ref([]);
const results = ref([]);
const freeRooms = ref({});

const search = ref({ group: '', start: '', end: '', teacher: '' });
const freeDate = ref('');

const lessonTimes = ['8:00', '9:30', '11:20', '13:00', '14:40', '16:10', '18:00'];

onMounted(async () => {
  try {
    const groupsRes = await api.getGroups();
    const teachersRes = await api.getTeachers();
    const scheduleRes = await api.getAllSchedule();

    groups.value = groupsRes.data || groupsRes || [];
    teachers.value = teachersRes.data || teachersRes || [];
    allSchedule.value = scheduleRes.data || scheduleRes || [];

    console.log('Группы:', groups.value);
    console.log('Преподаватели:', teachers.value);
    console.log('Всего занятий:', allSchedule.value.length);
  } catch (e) {
    console.error('Ошибка загрузки:', e);
  }
});

async function searchByGroup() {
  if (!search.value.group) {
    alert('Выберите группу');
    return;
  }

  try {
    const res = await api.getSchedule(
      search.value.group,
      search.value.start || '2024-01-01',
      search.value.end || '2026-12-31'
    );
    results.value = res.data || res || [];
    console.log('Найдено занятий:', results.value.length);
  } catch (e) {
    console.error('Ошибка поиска:', e);
    results.value = [];
  }
}

async function searchByTeacher() {
  if (!search.value.teacher) {
    alert('Выберите преподавателя');
    return;
  }

  results.value = allSchedule.value.filter(item =>
    item.teacher === search.value.teacher
  ).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  console.log('Найдено занятий у преподавателя:', results.value.length);
}

async function searchFreeRooms() {
  if (!freeDate.value) {
    alert('Выберите дату');
    return;
  }

  const daySchedule = allSchedule.value.filter(item => item.date === freeDate.value);
  const roomsRes = await api.getRoomsList();
  let allRooms = roomsRes.data || roomsRes || [];

  if (allRooms.length > 0 && typeof allRooms[0] === 'object') {
    allRooms = allRooms.map(room => room.title || room.name || room.room || String(room));
  }

  const free = {};
  for (let time of lessonTimes) {
    const busyRooms = daySchedule
      .filter(item => item.time === time)
      .map(item => item.room);
    const freeRoomsList = allRooms.filter(room => !busyRooms.includes(room));
    free[time] = freeRoomsList;
  }

  freeRooms.value = free;
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('ru-RU');
}
</script>

<style scoped>
.search-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-title {
  margin-bottom: 30px;
  font-size: 32px;
  color: #333;
}

.search-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-title {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 600;
  color: #495057;
}

.search-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.form-select {
  flex: 2;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn-primary {
  padding: 8px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #0056b3;
}

.results-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.results-title {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 600;
  color: #495057;
}

.table-wrapper {
  overflow-x: auto;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th {
  padding: 12px;
  text-align: left;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  color: #495057;
}

.results-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
}

.results-table tr:hover {
  background: #f8f9fa;
}

.free-room-item {
  margin-bottom: 10px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.time-label {
  display: inline-block;
  width: 80px;
  font-weight: bold;
}

.room-list {
  color: #28a745;
}

.text-muted {
  color: #6c757d;
}

@media (max-width: 768px) {
  .search-page {
    padding: 10px;
  }
  
  .search-title {
    font-size: 24px;
  }
  
  .search-form {
    flex-direction: column;
  }
  
  .form-select,
  .form-input,
  .btn-primary {
    width: 100%;
  }
  
  .results-table {
    font-size: 12px;
  }
  
  .results-table th,
  .results-table td {
    padding: 8px;
  }
}
</style>