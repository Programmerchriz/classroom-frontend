import {
  BaseRecord,
  CrudFilter,
  CrudSort,
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";
import { Subject } from "@/types";

export const mockSubjects: Subject[] = [
  {
    id: 1,
    courseCode: "CSC 201",
    name: "Data Structures",
    department: "CS",
    description: "Introduces core data structures and their practical use in building efficient software.",
  },
  {
    id: 2,
    courseCode: "MTH 205",
    name: "Linear Algebra",
    department: "Math",
    description: "Covers matrices, vector spaces, and transformations used across science and engineering.",
  },
  {
    id: 3,
    courseCode: "ENG 210",
    name: "Academic Writing",
    department: "English",
    description: "Builds clear academic writing skills with emphasis on argument structure and research-based essays.",
  },
];

const applyFilter = (subjects: Subject[], filter: CrudFilter): Subject[] => {
  if ("field" in filter === false) {
    return subjects;
  }

  const { field, operator, value } = filter;

  if (field === "department" && operator === "eq") {
    return subjects.filter((subject) => subject.department === value);
  }

  if (field === "name" && operator === "contains" && typeof value === "string") {
    const query = value.toLowerCase();
    return subjects.filter((subject) => subject.name.toLowerCase().includes(query));
  }

  return subjects;
};

const applyFilters = (subjects: Subject[], filters?: CrudFilter[]): Subject[] => {
  if (!filters?.length) {
    return subjects;
  }

  return filters.reduce((result, filter) => applyFilter(result, filter), subjects);
};

const applySorters = (subjects: Subject[], sorters?: CrudSort[]): Subject[] => {
  if (!sorters?.length) {
    return subjects;
  }

  return [ ...subjects ].sort((left, right) => {
    for (const sorter of sorters) {
      const leftValue = left[sorter.field as keyof Subject];
      const rightValue = right[sorter.field as keyof Subject];

      if (leftValue === rightValue) {
        continue;
      }

      const direction = sorter.order === "desc" ? -1 : 1;

      if (leftValue! < rightValue!) {
        return -1 * direction;
      }

      if (leftValue! > rightValue!) {
        return 1 * direction;
      }
    }

    return 0;
  });
};

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({ resource, filters, sorters, pagination }:
    GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") return ({ data: [] as TData[], total: 0 });

    const filteredSubjects = applyFilters(mockSubjects, filters);
    const sortedSubjects = applySorters(filteredSubjects, sorters);
    const current = pagination?.currentPage ?? 1;
    const pageSize = pagination?.pageSize ?? sortedSubjects.length;
    const start = (current - 1) * pageSize;
    const paginatedSubjects = sortedSubjects.slice(start, start + pageSize);

    return ({
      data: paginatedSubjects as unknown as TData[],
      total: filteredSubjects.length
    });
  },

  getOne: async () => { throw new Error("This function is not present in mock") },
  create: async () => { throw new Error("This function is not present in mock") },
  update: async () => { throw new Error("This function is not present in mock") },
  deleteOne: async () => { throw new Error("This function is not present in mock") },

  getApiUrl: () => "",
};
