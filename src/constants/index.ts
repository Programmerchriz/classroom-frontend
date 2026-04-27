
const DEPARTMENTS: string[] = [
  "CS",
  "Math",
  "English",
];

const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
  value: dept,
  label: dept,
}))

export { DEPARTMENTS, DEPARTMENT_OPTIONS };
