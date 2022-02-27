<template>
  <div class="bg-theme-600 px-4 py-3 flex items-center justify-between border-t border-theme-reverse sm:px-6 text-theme">
    <div class="flex-1 flex justify-between sm:hidden">
      <a
        href="#"
        class="relative inline-flex items-center px-4 py-2 border border-theme-reverse text-sm font-medium rounded-md bg-theme-600 hover:bg-theme-300"
      >
        Previous
      </a>
      <a
        href="#"
        class="ml-3 relative inline-flex items-center px-4 py-2 border border-theme-reverse text-sm font-medium rounded-md bg-theme-600 hover:bg-theme-300"
      >
        Next
      </a>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm">
          Showing
          <span class="font-medium">{{ showing.from }}</span>
          to
          <span class="font-medium">{{ showing.to }}</span>
          of
          <span class="font-medium">{{ total }}</span>
          results
        </p>
      </div>
      <div>
        <nav
          class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px select-none"
          aria-label="Pagination"
        >
          <a
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-theme-reverse bg-theme-600 text-sm font-medium hover:bg-theme-300 cursor-pointer"
            @click="$emit('change', page-1)"
          >
            <span class="sr-only">Previous</span>
            <!-- Heroicon name: solid/chevron-left -->
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </a>

          <a
            v-for="(p, i) in pageList"
            :key="`pagination-number-list-${i}`"
            aria-current="page"
            class="relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer"
            :class="page === p ? 'z-10 bg-purple-700 border-purple-500 text-white' : 'bg-theme-600 border-theme-reverse hover:bg-theme-300'"
            @click="changePage(p)"
          >
            {{ p }}
          </a>
          <a
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-theme-reverse bg-theme-600 text-sm font-medium hover:bg-theme-300 cursor-pointer"
            @click="$emit('change', page+1)"
          >
            <span class="sr-only">Next</span>
            <!-- Heroicon name: solid/chevron-right -->
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    page: Number,
    maxPerPage: Number,
    total: Number,
  },
  data() {
    return {}
  },
  computed: {
    showing() {
      const from = (this.page - 1) * this.maxPerPage + 1
      let to = (this.page - 1) * this.maxPerPage + this.maxPerPage
      if (to > this.total) {
        to = this.total
      }
      return { from, to }
    },
    lastPage() {
      return Math.ceil(this.total / this.maxPerPage)
    },
    pageList() {
      const delta = 2
      const range = Array(this.lastPage)
        .fill()
        .map((_, index) => index + 1)
      return range.reduce((pages, page) => {
        // allow adding of first and last pages
        if (page === 1 || page === this.lastPage) {
          return [...pages, page]
        }
        // if within delta range add page
        if (page - delta <= this.page && page + delta >= this.page) {
          return [...pages, page]
        }
        // otherwise add 'gap if gap was not the last item added.
        if (pages[pages.length - 1] !== '...') {
          return [...pages, '...']
        }
        return pages
      }, [])
    },
  },
  mounted() {},
  methods: {
    changePage(page) {
      if (!Number.isInteger(page)) {
        return
      }
      this.$emit('change', page)
    },
  },
}
</script>
