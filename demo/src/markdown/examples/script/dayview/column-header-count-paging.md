```
<script>
export default {
  data () {
    return {
      selectedDate: '2019-04-01',
      columnCount: 3,
      totalPages: 2,
      currentPage: 0
    }
  },
  computed: {
    columnIndexStart () {
      return this.currentPage * this.columnCount
    }
  },
  methods: {
    next () {
      if (this.currentPage + 1 === this.totalPages) return
      ++this.currentPage
    },
    prev () {
      if (this.currentPage === 0) return
      --this.currentPage
    }
  }
}
</script>
```