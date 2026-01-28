// src/features/services/components/columns/serviceColumns.tsx
import { createColumnHelper } from '@tanstack/react-table';
import { PriceCell } from '../cells/PriceCell';
import { ActionsCell } from '../cells/ActionsCell';
import { Service } from '@/types/service.type';

const columnHelper = createColumnHelper<Service>();

export const serviceColumns = [
  columnHelper.accessor('title', {
    header: 'Título',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('price', {
    header: 'Precio',
    cell: (info) => <PriceCell price={info.getValue()} />,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Acciones',
    cell: (info) => <ActionsCell service={info.row.original} />,
  }),
];