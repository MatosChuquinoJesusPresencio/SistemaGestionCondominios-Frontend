import { useState, useEffect } from 'react';
import { DataContext } from '../contexts/DataContext';

import { apartamentos } from '../data/apartamento';
import { carritos_carga } from '../data/carrito_carga';
import { condominios } from '../data/condominio';
import { configuraciones } from '../data/configuracion';
import { estacionamientos } from '../data/estacionamiento';
import { inquilinos_temporales } from '../data/inquilino_temporal';
import { logs_acceso_vehicular } from '../data/log_access_vehicular';
import { logs_prestamo_carrito } from '../data/log_prestamo_carrito';
import { pisos } from '../data/piso';
import { roles } from '../data/rol';
import { torres } from '../data/torre';
import { usuarios } from '../data/usuario';
import { vehiculos } from '../data/vehiculo';

const DB_KEY = 'condominio_app_db';

export const DataProvider = ({ children }) => {
    const [db, setDb] = useState(() => {
        const saved = localStorage.getItem(DB_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing local database, resetting...", e);
            }
        }

        return {
            apartamentos,
            carritos_carga,
            condominios,
            configuraciones,
            estacionamientos,
            inquilinos_temporales,
            logs_acceso_vehicular,
            logs_prestamo_carrito,
            pisos,
            roles,
            torres,
            usuarios,
            vehiculos
        };
    });

    useEffect(() => {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    }, [db]);

    const updateTable = (tableName, newData) => {
        setDb(prev => ({
            ...prev,
            [tableName]: newData
        }));
    };

    const getTable = (tableName) => {
        return db[tableName] || [];
    };

    return (
        <DataContext.Provider value={{ db, updateTable, getTable }}>
            {children}
        </DataContext.Provider>
    );
};
