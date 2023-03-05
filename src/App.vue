<template>
  <v-app>
    <nav>
      <v-toolbar app color="green white--text">
        <v-toolbar-title class="headline text-uppercase">
          <span>U.R.S.</span>
          <span class="font-weight-light">Team 6</span>
        </v-toolbar-title>
        <v-spacer class="hidden-sm-and-down"></v-spacer>
        <v-toolbar-items>
          <v-btn flat to="/" exact>Viewer</v-btn>
          <v-btn flat to="/" exact>Admin</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </nav>
    <v-main>
      <ursViewer/>
    </v-main>
  </v-app>
</template>

<script>
import ursViewer from './components/ursViewer.vue'

export default {
  name: 'App',

  components: {
    ursViewer
  },

  data: () => ({
  }),
}
</script>
