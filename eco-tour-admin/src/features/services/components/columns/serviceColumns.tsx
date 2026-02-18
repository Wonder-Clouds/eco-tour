// src/features/services/components/columns/serviceColumns.tsx
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { PriceCell } from '../cells/PriceCell';
import { ActionsCell } from '../cells/ActionsCell';
import { SummaryService, Tag } from '@/types/service.type';

const columnHelper = createColumnHelper<SummaryService>();

// Componente para mostrar el cover o la primera letra del título
const CoverCell = ({ cover, title }: { cover?: string; title: string }) => {
  if (cover) {
    return (
      <img
        src={cover}
        alt={title}
        className="w-10 h-10 rounded-lg object-cover"
      />
    );
  }

  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
      style={{ backgroundColor: '#00bf35' }}
    >
      {title.charAt(0).toUpperCase()}
    </div>
  );
};

// Componente para mostrar las etiquetas
const TagsCell = ({ tags }: { tags?: Tag[] }) => {
  if (!tags || tags.length === 0) {
    return <span className="text-gray-400 text-sm">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-1 max-w-[200px]">
      {tags.slice(0, 3).map((tag) => (
        <span
          key={tag.id}
          className="px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: '#edfff2', color: '#00932c' }}
        >
          {tag.name}
        </span>
      ))}
      {tags.length > 3 && (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          +{tags.length - 3}
        </span>
      )}
    </div>
  );
};

// Función para formatear el tipo de servicio
const formatType = (type: string) => {
  const types: Record<string, string> = {
    group: 'Grupal',
    arbitrary: 'Arbitrario',
    private: 'Privado',
  };
  return types[type] || type;
};

// Función para obtener los estilos del tipo
const getTypeStyles = (type: string) => {
  const styles: Record<string, { borderColor: string; color: string; bgColor: string }> = {
    private: { borderColor: '#dc2626', color: '#dc2626', bgColor: '#fef2f2' },
    group: { borderColor: '#00bf35', color: '#00932c', bgColor: '#edfff2' },
    arbitrary: { borderColor: '#f59e0b', color: '#d97706', bgColor: '#fffbeb' },
  };
  return styles[type] || { borderColor: '#6b7280', color: '#374151', bgColor: '#f3f4f6' };
};

interface ServiceColumnsOptions {
  onEdit?: (serviceId: string) => void;
  onDelete?: (serviceId: string) => void;
}

export const createServiceColumns = (options: ServiceColumnsOptions = {}): ColumnDef<SummaryService, any>[] => [
  columnHelper.display({
    id: 'cover',
    header: '',
    cell: (info) => (
      <CoverCell
        cover={info.row.original.cover}
        title={info.row.original.title}
      />
    ),
  }),
  columnHelper.accessor('title', {
    header: 'Título',
    cell: (info) => (
      <span className="font-medium" style={{ color: '#000000' }}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('type', {
    header: 'Tipo',
    cell: (info) => {
      const type = info.getValue();
      const styles = getTypeStyles(type);
      return (
        <span
          className="px-3 py-1 rounded-full text-xs font-medium border"
          style={{
            borderColor: styles.borderColor,
            color: styles.color,
            backgroundColor: styles.bgColor
          }}
        >
          {formatType(type)}
        </span>
      );
    },
  }),
  columnHelper.accessor('tags', {
    header: 'Etiquetas',
    cell: (info) => <TagsCell tags={info.getValue()} />,
  }),
  columnHelper.accessor('duration', {
    header: 'Duración',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('reference_price', {
    header: 'Precio Ref.',
    cell: (info) => <PriceCell price={info.getValue() || '0'} />,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Acciones',
    cell: (info) => (
      <ActionsCell
        service={info.row.original}
        onEdit={options.onEdit}
        onDelete={options.onDelete}
      />
    ),
  }),
];