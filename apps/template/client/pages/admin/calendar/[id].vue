<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          :color="cal?.backgroundColor"
          variant="tonal"
        >
          <v-card-item>
            <v-card-title>
              {{ cal.summary }}
            </v-card-title>
            <v-card-subtitle>
              {{ cal.timeZone }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            {{ cal.description }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import type { calendar_v3 } from 'googleapis';
import { defineComponent } from 'vue';
import { useDisplay, useLayout } from 'vuetify';
import type { RestResponseDto } from '../../../../src/dto';

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
      const response = data.value as RestResponseDto; 
      cal.value = response.payload;
      pendingCal.value = false;
    }
    const fetchAcl = async () => {
      pendingAcl.value = true;
      const { data } = await useFetch(aclUrl.value);
      const response = data.value as RestResponseDto; 
      acl.value = response.payload as calendar_v3.Schema$Acl;
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