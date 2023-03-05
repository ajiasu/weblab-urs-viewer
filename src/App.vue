<template>
  <v-app>
    <nav>
      <v-toolbar app color="green white--text">
        <v-toolbar-title class="headline text-uppercase">
          <span>U.R.S.</span>
          <span class="font-weight-light">Team 6</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat to="/" exact>Viewer</v-btn>
          <v-btn flat to="/" exact>Admin</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-navigation-drawer v-model="drawer" temporary>
        <v-list>
          <v-list-item to="/" exact>Viewer</v-list-item>
          <v-list-item to="/" exact>Admin</v-list-item>
        </v-list>
      </v-navigation-drawer>
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
    drawer: false
  }),
}
</script>
