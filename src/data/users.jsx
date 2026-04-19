const baseUsers = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@gmail.com",
    password: "123123",
    role: "SUPER_ADMIN"
  },
  {
    id: 2,
    name: "María López",
    email: "maria@gmail.com",
    password: "123123",
    role: "ADMIN_CONDOMINIO"
  },
  {
    id: 3,
    name: "Carlos Díaz",
    email: "carlos@gmail.com",
    password: "123123",
    role: "PROPIETARIO"
  }
];

const generatedPropietarios = Array.from({ length: 30 }).map((_, index) => ({
  id: index + 4,
  name: `Propietario ${index + 4}`,
  email: `propietario${index + 4}@gmail.com`,
  password: "123123",
  role: "PROPIETARIO"
}));

export const users = [...baseUsers, ...generatedPropietarios];