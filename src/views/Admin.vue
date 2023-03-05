<template>
  <v-container>
    <v-layout>
      <h1>Admin</h1>
    </v-layout>
    <Login class="mt-5" />
  </v-container>
</template>

<script>
  import Login from "../components/Login";

  export default {
    components: {
      Login
    }
  };
</script>
