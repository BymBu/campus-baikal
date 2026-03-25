<template>
  <div class="schedule-group">
    <h1 class="schedule-title">Группа {{ groupNumber }}</h1>

    <button class="toggle-past-btn" @click="showPast = !showPast">
      {{ showPast ? 'Скрыть прошедшие' : 'Показать прошедшие' }}
    </button>

    <div v-if="filteredSchedule.length === 0" class="empty-message">
      Нет занятий
    </div>

    <table v-else class="schedule-table">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Время</th>
          <th>Дисциплина</th>
          <th>Тип</th>
          <th>Аудитория</th>
          <th>Преподаватель</th>
          <th v-if="auth.isAuthenticated">Оценка</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredSchedule" :key="item.id" :class="{ 'rated-row': userMarks[item.id] }">
          <td>{{ formatDate(item.date) }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.discipline }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.room }}</td>
          <td>{{ item.teacher }}</td>
          <td v-if="auth.isAuthenticated">
            <div v-if="canRate(item)" class="rate-controls">
              <select v-model="rateValue[item.id]" class="rate-select">
                <option v-for="n in 5" :value="n">{{ n }}</option>
              </select>
              <button class="rate-btn" @click="setMark(item.id)">Оценить</button>
            </div>
            <div v-else-if="userMarks[item.id]" class="rated-controls">
              <span class="rated-badge">Оценка: {{ userMarks[item.id] }}</span>
              <button class="delete-btn" @click="deleteMark(item.id)">Убрать</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/api/api';

const route = useRoute();
const auth = useAuthStore();
const groupNumber = route.params.group;

const schedule = ref([]);
const showPast = ref(false);
const userMarks = ref({});
const rateValue = ref({});

onMounted(async () => {
  try {
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    const end = new Date();
    end.setMonth(end.getMonth() + 2);

    const res = await api.getSchedule(
      groupNumber,
      start.toISOString().slice(0, 10),
      end.toISOString().slice(0, 10)
    );
    schedule.value = res.data || res || [];

    schedule.value.sort((a, b) => {
      return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
    });

    if (auth.isAuthenticated) {
      const marks = await api.getUserMarks();
      const marksData = marks.data || marks || [];
      marksData.forEach(m => {
        const lessonId = m.schedule_item?.id;
        if (lessonId) {
          userMarks.value[lessonId] = m.mark;
        }
      });
      console.log('Загруженные оценки:', userMarks.value);
    }
  } catch (e) {
    console.error(e);
  }
});

const filteredSchedule = computed(() => {
  if (showPast.value) return schedule.value;

  const now = new Date();
  return schedule.value.filter(item => {
    const itemDate = new Date(`${item.date} ${item.time}`);
    return itemDate >= now;
  });
});

function canRate(item) {
  if (userMarks.value[item.id]) return false;

  const itemDate = new Date(`${item.date} ${item.time}`);
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return itemDate < now && itemDate > weekAgo;
}

async function setMark(id) {
  if (!rateValue.value[id]) return;
  try {
    console.log('Отправляем оценку:', { id, mark: rateValue.value[id] });
    const response = await api.setMark(id, rateValue.value[id]);
    console.log('Ответ сервера:', response);

    userMarks.value[id] = rateValue.value[id];
    delete rateValue.value[id];

    console.log('Обновленные оценки:', userMarks.value);

  } catch (e) {
    console.error('Ошибка при оценке:', e);
    alert('Ошибка: ' + (e.message || 'не удалось поставить оценку'));
  }
}

async function deleteMark(id) {
  try {
    await api.deleteMark(id);
    delete userMarks.value[id];
  } catch (e) {
    alert('Ошибка');
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('ru-RU');
}
</script>

<style scoped>
.schedule-group {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.schedule-title {
  margin-bottom: 10px;
  font-size: 28px;
  color: #333;
}

.toggle-past-btn {
  margin-bottom: 20px;
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.toggle-past-btn:hover {
  background: #5a6268;
}

.empty-message {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 5px;
  text-align: center;
  color: #6c757d;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.schedule-table th {
  padding: 12px;
  text-align: left;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  color: #495057;
}

.schedule-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
}

.rated-row {
  background: #d4edda;
}

.rate-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.rate-select {
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ced4da;
}

.rate-btn {
  padding: 4px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.rate-btn:hover {
  background: #0056b3;
}

.rated-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.rated-badge {
  background: #28a745;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.delete-btn {
  padding: 4px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.delete-btn:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .schedule-group {
    padding: 10px;
  }

  .schedule-table {
    font-size: 12px;
  }

  .schedule-table th,
  .schedule-table td {
    padding: 8px;
  }

  .rate-controls,
  .rated-controls {
    flex-direction: column;
    gap: 4px;
  }
}
</style>