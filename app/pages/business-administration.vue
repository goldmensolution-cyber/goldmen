<template>
  <UContainer class="py-10">
    <div class="space-y-8">
      <section class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-error">Business Administration</p>
        <h1 class="mt-3 text-3xl font-semibold text-gray-900">Streamlined business operations for modern growth</h1>
        <p class="mt-4 max-w-3xl text-lg text-gray-600">
          Our business administration services support efficient planning, reliable operations, and confident decision-making for growing organizations.
        </p>
      </section>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-gray-900">Core Services</h2>
          <ul class="mt-4 space-y-3 text-sm text-gray-600">
            <li>• Strategic planning and operational support</li>
            <li>• Finance, reporting, and administrative coordination</li>
            <li>• Customer service and business process improvement</li>
          </ul>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-gray-900">What We Focus On</h2>
          <ul class="mt-4 space-y-3 text-sm text-gray-600">
            <li>• Clear policies and dependable workflows</li>
            <li>• Better communication across teams</li>
            <li>• Consistent service delivery and accountability</li>
          </ul>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-gray-900">Why It Matters</h2>
          <p class="mt-4 text-sm text-gray-600">
            Strong administration creates a stable foundation for sustainable growth, stronger customer relationships, and smarter business decisions.
          </p>
        </div>
      </div>

      <section class="rounded-2xl border border-error/20 bg-error/5 p-8">
        <h2 class="text-2xl font-semibold text-gray-900">Business support that keeps everything moving</h2>
        <p class="mt-3 max-w-2xl text-gray-600">
          From day-to-day coordination to long-term planning, our business administration approach helps teams stay organized, responsive, and ready to grow.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <UButton label="Contact Us" color="error" to="/contact" />
          <UButton label="Learn More" color="error" variant="outline" to="/about" />
        </div>
      </section>
    </div>
  </UContainer>
</template>
