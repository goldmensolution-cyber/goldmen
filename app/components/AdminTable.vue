<script setup lang="ts">
import type { Transaction} from '~~/server/utils/drizzle'
import type {  TableColumn,  } from '@nuxt/ui'
import { upperFirst } from 'scule'
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { Column } from '@tanstack/vue-table'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const table = useTemplateRef('table')
// const data = ref<Transaction[]>([])
const { data }  = await useFetch('/api/mpesa/transactions.list',
   {
    key: 'transations',
    transform: (data?: Transaction[]) => {
      return data
    }
  }
 )

const columns: TableColumn<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': 'Select row'
      })
  },
{
    accessorKey: 'id',
    header: ({ column }) => getHeader(column, 'ID'),
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => getHeader(column, 'Date Created'),
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
    
    {
    accessorKey: 'updatedAt',
    header: ({ column }) => getHeader(column, 'Date updated'),
    cell: ({ row }) => {
      return new Date(row.getValue('updatedAt')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
 {
    accessorKey: 'status',
    header: ({ column }) => getHeader(column, 'Status'),
    cell: ({ row }) => {
      const color = {
        SUCCESS: 'success' as const,
        FAILED: 'error' as const,
        PENDING: 'neutral' as const,
        CANCELLED: 'error' as const
      }[row.getValue('status') as string]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.getValue('status')
      )
    }
  },
  {
    accessorKey: 'initiatorPhone',
    header: 'Sender Number'
  },
  {
    accessorKey: 'recipientPhone',
    header: 'Receiver Number'
  },
 {
    accessorKey: 'amount',
    header: ({ column }) => h('div', { class: 'text-right' }, getHeader(column, 'Amount')),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES'
      }).format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
    }
  },
  {
    accessorKey: 'description',
    header: 'Description'
  }
]
function getHeader(column: Column<Transaction>, label: string) {
  const isSorted = column.getIsSorted()

  return h(
    UDropdownMenu,
    {
      content: {
        align: 'start'
      },
      'aria-label': 'Actions dropdown',
      items: [
        {
          label: 'Asc',
          type: 'checkbox',
          icon: 'i-lucide-arrow-up-narrow-wide',
          checked: isSorted === 'asc',
          onSelect: () => {
            if (isSorted === 'asc') {
              column.clearSorting()
            } else {
              column.toggleSorting(false)
            }
          }
        },
        {
          label: 'Desc',
          icon: 'i-lucide-arrow-down-wide-narrow',
          type: 'checkbox',
          checked: isSorted === 'desc',
          onSelect: () => {
            if (isSorted === 'desc') {
              column.clearSorting()
            } else {
              column.toggleSorting(true)
            }
          }
        }
      ]
    },
    () =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label,
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5 data-[state=open]:bg-elevated',
        'aria-label': `Sort by ${isSorted === 'asc' ? 'descending' : 'ascending'}`
      })
  )
}
const sorting = ref([
  {
    id: 'id',
    desc: true
  }
])
const columnVisibility = ref({
  id: false
})
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})
const user = useSupabaseUser()
</script>

<template>
<UCard class="w-full h-screen overflow-auto">
    <template v-if="user" #header>
      <h1>Transaction Table</h1>
    </template>
    <div class="flex justify-end px-4 py-3.5 border-b  border-accented">
      <div>
        <UTabs ></UTabs>
      </div>
      <UFieldGroup
      >
        <UButton label="show" variant="ghost" color="neutral"/>
        <UInputNumber 
        v-model="pagination.pageSize"
        :default-value="pagination.pageSize" 
        orientation="vertical"
        size="sm"
        class="shrink-1"
        />
        <UButton :label="'of ' + data?.length + ' records'" variant="ghost" color="neutral" />
      </UFieldGroup>
      <UDropdownMenu
        :items="
          table?.tableApi
            ?.getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => ({
              label: upperFirst(column.id),
              type: 'checkbox' as const,
              checked: column.getIsVisible(),
              onUpdateChecked(checked: boolean) {
                table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
              },
              onSelect(e?: Event) {
                e?.preventDefault()
              }
            }))
        "
        :content="{ align: 'end' }"
      >
        <UButton
          label="Columns"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
        />
      </UDropdownMenu>
    </div>
  <UTable
   ref="table"
    v-model:pagination="pagination"
      v-model:column-visibility="columnVisibility"
      v-model:sorting="sorting"
      sticky
      :data="data"
      :columns="columns"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
      class="flex-1"/>
      <div class="flex justify-center border-t border-default pt-4">
      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </UCard>
</template>
