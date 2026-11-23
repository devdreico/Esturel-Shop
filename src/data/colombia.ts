import raw from '../../content/colombia.json'

export type Department = {
  id: number
  name: string
  cities: string[]
}

export const departments: Department[] = (raw as { id: number; departamento: string; ciudades: string[] }[]).map(
  (d) => ({
    id: d.id,
    name: d.departamento,
    cities: d.ciudades,
  }),
)

export function citiesOf(departmentName: string): string[] {
  return departments.find((d) => d.name === departmentName)?.cities ?? []
}

export function findDepartment(city: string): string | null {
  const hit = departments.find((d) => d.cities.includes(city))
  return hit ? hit.name : null
}
