<template>
  <v-container>
    <form>
      <div>{{ calId }}</div>
      
    </form>
  </v-container>
</template>

<script lang="ts">
import type { calendar_v3 } from 'googleapis';
import { defineComponent } from 'vue';
import { useDisplay, useLayout } from 'vuetify';

export default defineComponent({
  middleware(ctx) {
    return ctx.redirect('/admin/event');
  },

  setup() {
    const display = useDisplay();
    const route = useRoute();
    const calId = route.params.id as string;

    const pendingCal = ref(false);
    const pendingAcl = ref(false);

    const cal = ref({} as calendar_v3.Schema$Calendar);
    const acl = ref({} as calendar_v3.Schema$Acl);

    const calUrl = computed(() => `/api/calendar/${encodeURIComponent(calId)}/`);
    const aclUrl = computed(() => `/api/calendar/${encodeURIComponent(calId)}/acl/`); 
    
    const fetchCal = async () => {
      pendingCal.value = true;
      const { data } = await useFetch(calUrl.value);
      cal.value = data.value as calendar_v3.Schema$Calendar;
      pendingCal.value = false;
    }
    const fetchAcl = async () => {
      pendingAcl.value = true;
      const { data } = await useFetch(aclUrl.value);
      acl.value = data.value as calendar_v3.Schema$Acl;
      pendingAcl.value = false;
    }

    fetchCal();
    fetchAcl();

    return {
      display,
      calId,
      cal,
      acl,
    };
  },
})
</script>