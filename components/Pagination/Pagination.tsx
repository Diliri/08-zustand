'use client';

import type { ComponentType } from 'react';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import css from './Pagination.module.css';

type PaginateComponent = ComponentType<ReactPaginateProps>;
type PossiblyWrapped =
  | PaginateComponent
  | { default: PaginateComponent | { default: PaginateComponent } };

// чому в коді написано складну функцію - хелпер resolvePaginateComponent,
//     замість того щоб просто написати import ReactPaginate from 'react-paginate'.
//     Проблема виникає через історичну та технологічну різницю між модулями в JavaScript.
//     Суть проблеми(чому це відбувається)
//     Бібліотека react - paginate була створена досить давно як UMD
//     (Universal Module Definition) або CommonJS модуль.
//     Вона не писалася як сучасний ESM(ES Module) з чітким export default.
//     Коли різні інструменти(бандлери) намагаються імпортувати такий старий модуль,
//     вони намагаються перетворити його у формат ESM(додати йому обгортку.default),
//     але роблять це по - різному: Vite / esbuild(на клієнті): 
//     Може віддати компонент напряму як функцію(mod).Webpack / Next.js SSR
//(під час рендерингу на сервері): Обгортає модуль у властивість.default(mod.default).
//     Деякі версії транспіляторів(Babel / SWC): 
//     Через подвійну конвертацію(CommonJS $\rightarrow$ ESM $\rightarrow$ CJS)
//     можуть "випадково" створити подвійну обгортку(mod.default.default).
//     Якщо "зашити" у код лише один варіант
//     (наприклад, import ReactPaginate from 'react-paginate'),
// то:На клієнті все працюватиме, але під час SSR код впаде з помилкою: 
// ReactPaginate is not a function.
// Або навпаки — на сервері відрендериться,
//     а в браузері зламається.
//     Як це вирішує функція з коду
//     Функція resolvePaginateComponent перевіряє структуру імпортованого модуля 
//     безпосередньо під час виконання(in runtime):
//     Крок 1(typeof mod === 'function'): Перевіряє, чи імпортувався сам React
//     - компонент напряму.Якщо так — одразу повертає його.
//     Крок 2(typeof level1 === 'function'): 
//         Якщо ні, перевіряє перший рівень обгортки(mod.default).
//         Якщо там функція — повертає її.
//     Крок 3(return level1.default): Якщо і там була обгортка,
//     дістає компонент із другого рівня(mod.default.default).
//         Завдяки цьому компонент Pagination працює однаково стабільно
//          і під час серверного рендерингу(SSR) у Next.js,
//     і під час клієнтської гідратації(Hydration) у браузері.
function resolvePaginateComponent(mod: PossiblyWrapped): PaginateComponent {
  if (typeof mod === 'function') {
    return mod;
  }

  const level1 = mod.default;

  if (typeof level1 === 'function') {
    return level1;
  }

  return level1.default;
}

const ReactPaginate = resolvePaginateComponent(
  ReactPaginateModule as unknown as PossiblyWrapped
);

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const handlePageClick = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={handlePageClick}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
      renderOnZeroPageCount={null}
    />
  );
}