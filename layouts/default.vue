<template>
  <header>
    <slot name="header">
      <NuxtLink to="/">Home</NuxtLink> |
      <NuxtLink to="/search/">Search</NuxtLink>
    </slot>
  </header>
  <main>
    <slot/>
  </main>
</template>