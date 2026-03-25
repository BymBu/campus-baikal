<template>
  <div class="schedule-page">
    <h1 class="page-title">Расписание занятий</h1>
    
    <div class="groups-grid">
      <router-link 
        v-for="group in groups" 
        :key="group.id"
        :to="`/schedule/${group.title}`"
        class="group-link"
      >
        Группа {{ group.title }}
      </router-link>
    </div>
    
    <div class="action-buttons">
      <router-link to="/schedule-search" class="btn-search">
        Поиск по расписанию
      </router-link>
      <router-link to="/rating" class="btn-rating">
        Рейтинг
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/api/api';

const groups = ref([]);

onMounted(async () => {
  try {
    const res = await api.getGroups();
    groups.value = res.data || res || [];
    console.log('Группы:', groups.value);
  } catch(e) {
    console.error(e);
  }
});
</script>

<style scoped>
.schedule-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  font-size: 32px;
  color: #333;
}

.groups-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.group-link {
  display: inline-block;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.2s;
}

.group-link:hover {
  background: #0056b3;
}

.action-buttons {
  margin-top: 30px;
  display: flex;
  gap: 10px;
}

.btn-search {
  padding: 8px 16px;
  background: #17a2b8;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.2s;
}

.btn-search:hover {
  background: #138496;
}

.btn-rating {
  padding: 8px 16px;
  background: #ffc107;
  color: black;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.2s;
}

.btn-rating:hover {
  background: #e0a800;
}

@media (max-width: 768px) {
  .schedule-page {
    padding: 10px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .group-link {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-search,
  .btn-rating {
    text-align: center;
  }
}
</style>