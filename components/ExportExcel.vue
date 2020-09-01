<template>
  <transition name="fadeIn">
    <div v-show="false">
      <el-table
        :id="exportExcelInfo.excelId"
        :data="tableData"
        highlight-current-row
        style="width: 100%;"
      >
        <div v-for="(item,index) in exportExcelArry" :key="index">
          <el-table-column
            v-if="!item.formatterFlag"
            :prop="item.prop"
            :label="item.label"
          >
          </el-table-column>
          <el-table-column v-else :prop="item.prop" :label="item.label">
            <template slot-scope="scope">
              <span>{{
                formatter(scope.row[item.prop], item, scope.row, item.prop)
              }}</span>
            </template>
          </el-table-column>
        </div>
      </el-table>
    </div>
  </transition>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: 'ExportExcel',
  props: {
    exportExcelInfo: {
      type: Object,
      default: {},
    },
    exportExcelArry: {
      type: Array,
      default: [],
    },
    tableData: {
      type: Array,
      default: [],
    },
  },
  methods: {
    // excel导出
    exportExcel() {
      const xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
      const wb = XLSX.utils.table_to_book(
        document.querySelector('#' + this.exportExcelInfo.excelId),
        xlsxParam
      )
      const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array',
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          this.exportExcelInfo.excelName
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },

    // 表格formatter数据格式化
    formatter(value, item, row, prop) {
      // 针对table中item多层对象层级的情况
      if (prop.indexOf('.') > 0) {
        const temp = prop.split('.')
        // item中嵌套两层
        if (temp.length === 2) {
          const temp = prop.split('.')
          if (item.formatterType === 'common-type') {
            // 通用类型转换
            const arry = item.formatterInfo
            for (const i in arry) {
              if (arry[i].value === row[temp[0]][temp[1]]) {
                return arry[i].label
              }
            }
          } else if (item.formatterType === 'time-type') {
            // 时间标准格式化
            if (!global.isNull(row[temp[0]][temp[1]])) {
              return row[temp[0]][temp[1]].substring(
                0,
                row[temp[0]][temp[1]].length - 2
              )
            }
          } else if (item.formatterType === 'amount-type') {
            // 金额转换
            return (row[temp[0]][temp[1]] / 100).toFixed(2)
          }
        }
      } else {
        // item中无嵌套对象
        const temp = prop.split('.')
        if (item.formatterType === 'common-type') {
          // 通用类型转换
          const arry = item.formatterInfo
          for (const i in arry) {
            if (arry[i].value === value) {
              return arry[i].label
            }
          }
        } else if (item.formatterType === 'time-type') {
          // 时间标准格式化
          if (!global.isNull(row[temp[0]][temp[1]])) {
            return value.substring(0, value.length - 2)
          }
        } else if (item.formatterType === 'amount-type') {
          // 金额转换
          return (value / 100).toFixed(2)
        }
      }
    },
  },
}
</script>

<style scoped></style>
