const baseApartamentos = [
  {
    id: 1,
    id_condominio: 1,
    id_usuario: 3,
    numero: "101",
    derecho_estacionamiento: true,
    metraje: 85.50
  },
  {
    id: 2,
    id_condominio: 1,
    id_usuario: null,
    numero: "102",
    derecho_estacionamiento: false,
    metraje: 70.00
  },
  {
    id: 3,
    id_condominio: 1,
    id_usuario: null,
    numero: "201",
    derecho_estacionamiento: true,
    metraje: 90.00
  },
  {
    id: 4,
    id_condominio: 2,
    id_usuario: null,
    numero: "A-1",
    derecho_estacionamiento: true,
    metraje: 120.00
  },
  {
    id: 5,
    id_condominio: 2,
    id_usuario: null,
    numero: "A-2",
    derecho_estacionamiento: false,
    metraje: 65.00
  }
];

const generatedApartamentos = [];
let idCounter = 6;


for (let i = 1; i <= 15; i++) {
  generatedApartamentos.push({
    id: idCounter++,
    id_condominio: 1,
    id_usuario: (idCounter % 3 === 0) ? (idCounter + 2) : null,
    numero: `10${i + 2}`,
    derecho_estacionamiento: i % 2 === 0,
    metraje: 75.00 + (i % 5) * 5
  });
}


for (let i = 1; i <= 15; i++) {
  generatedApartamentos.push({
    id: idCounter++,
    id_condominio: 2,
    id_usuario: (idCounter % 2 === 0) ? (idCounter + 5) : null,
    numero: `B-${i}`,
    derecho_estacionamiento: true,
    metraje: 90.00
  });
}

for (let i = 1; i <= 10; i++) {
  generatedApartamentos.push({
    id: idCounter++,
    id_condominio: 3,
    id_usuario: null,
    numero: `C-${i}`,
    derecho_estacionamiento: i % 3 === 0,
    metraje: 100.00
  });
}

export const apartamentos = [...baseApartamentos, ...generatedApartamentos];
