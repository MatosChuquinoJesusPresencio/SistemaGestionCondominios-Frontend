import { useState, useMemo, useEffect } from "react";
import { Button, Col, Row, Badge, Card, Modal, Alert } from "react-bootstrap";
import {
  FaShoppingCart,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowCircleRight,
  FaHistory,
  FaArrowCircleLeft,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import SearchBar from "../../components/ui/SearchBar";
import MainTable from "../../components/ui/MainTable";
import { usePagination } from "../../hooks/usePagination";
import NoCondoWarning from "../../components/ui/NoCondoWarning";

const PRCarritosPage = () => {
  const { authUser } = useAuth();
  const { getTable, updateTable } = useData();

  const carritos = getTable("carritos_carga");
  const logsPrestamos = getTable("logs_prestamo_carrito");
  const configuraciones = getTable("configuraciones");
  const apartamentos = getTable("apartamentos");
  const usuarios = getTable("usuarios");
  const inquilinos = getTable("inquilinos_temporales");

  const myApartments = useMemo(
    () => apartamentos.filter((a) => a.id_usuario === authUser?.id),
    [apartamentos, authUser],
  );
  const myApartmentIds = useMemo(
    () => myApartments.map((a) => a.id),
    [myApartments],
  );

  const config = useMemo(
    () =>
      configuraciones.find((c) =>
        myApartments.some((a) => a.id_condominio === c.id_condominio),
      ),
    [configuraciones, myApartments],
  );

  if (!authUser) return <div className="p-5 text-center">Cargando...</div>;
  if (myApartments.length === 0) return <NoCondoWarning />;

  const [searchTerm, setSearchTerm] = useState("");
  const [now, setNow] = useState(new Date());
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedCarrito, setSelectedCarrito] = useState(null);
  const [selectedApto, setSelectedApto] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const carritosMapped = useMemo(() => {
    return carritos
      .filter((c) =>
        myApartments.some((a) => a.id_condominio === c.id_condominio),
      )
      .map((c) => {
        const activeLoan = logsPrestamos.find(
          (log) => log.id_carrito === c.id && log.fecha_salida === null,
        );

        let currentUser = null;
        let fine = 0;

        if (activeLoan) {
          const user = usuarios.find((u) => u.id === activeLoan.id_usuario);
          const apto = apartamentos.find(
            (a) => a.id === activeLoan.id_apartamento,
          );

          if (config) {
            const startDate = new Date(activeLoan.fecha_entrada);
            const diffMs = now - startDate;
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins > config.tiempo_max_prestamo_min) {
              fine =
                (diffMins - config.tiempo_max_prestamo_min) *
                config.penalizacion_por_minuto;
            }
          }

          currentUser = {
            id: activeLoan.id_usuario,
            nombre: user?.nombre || "Desconocido",
            aptoNumero: apto?.numero,
            isMe: activeLoan.id_usuario === authUser?.id,
            loanId: activeLoan.id,
            fine,
            fechaEntrada: activeLoan.fecha_entrada,
          };
        }

        return {
          ...c,
          currentUser,
          fine,
        };
      });
  }, [
    carritos,
    logsPrestamos,
    myApartments,
    usuarios,
    apartamentos,
    config,
    now,
    authUser,
  ]);

  const stats = useMemo(() => {
    const total = carritosMapped.length;
    const disponibles = carritosMapped.filter(
      (c) => c.estado === "Disponible",
    ).length;
    const miUso = carritosMapped.filter((c) => c.currentUser?.isMe).length;

    return { total, disponibles, miUso };
  }, [carritosMapped]);

  const filteredCarritos = useMemo(() => {
    return carritosMapped.filter((c) =>
      c.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [carritosMapped, searchTerm]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
  } = usePagination(filteredCarritos);

  const handleRequest = (carrito) => {
    setSelectedCarrito(carrito);
    if (myApartments.length === 1) {
      setSelectedApto(myApartments[0].id.toString());
    } else {
      setSelectedApto("");
    }
    setShowRequestModal(true);
  };

  const confirmRequest = () => {
    if (!selectedApto) return;

    const newLoanId =
      logsPrestamos.length > 0
        ? Math.max(...logsPrestamos.map((l) => l.id)) + 1
        : 1;
    const newLoan = {
      id: newLoanId,
      id_carrito: selectedCarrito?.id,
      id_apartamento: parseInt(selectedApto),
      id_usuario: authUser?.id,
      id_inquilino_temporal: null,
      solicitante: "Propietario",
      penalizacion: 0.0,
      fecha_entrada: new Date().toISOString(),
      fecha_salida: null,
    };

    const updatedCarritos = carritos.map((c) =>
      c.id === selectedCarrito?.id ? { ...c, estado: "En uso" } : c,
    );

    updateTable("logs_prestamo_carrito", [...logsPrestamos, newLoan]);
    updateTable("carritos_carga", updatedCarritos);

    setShowRequestModal(false);
    setSelectedCarrito(null);
  };

  const handleReturn = (carrito) => {
    setSelectedCarrito(carrito);
    setShowReturnModal(true);
  };

  const confirmReturn = () => {
    if (!selectedCarrito) return;

    const loan = selectedCarrito.currentUser;
    const updatedLogs = logsPrestamos.map((l) => {
      if (l.id === loan?.loanId) {
        return {
          ...l,
          fecha_salida: new Date().toISOString(),
          penalizacion: loan?.fine || 0,
        };
      }
      return l;
    });

    const updatedCarritos = carritos.map((c) =>
      c.id === selectedCarrito?.id ? { ...c, estado: "Disponible" } : c,
    );

    updateTable("logs_prestamo_carrito", updatedLogs);
    updateTable("carritos_carga", updatedCarritos);

    setShowReturnModal(false);
    setSelectedCarrito(null);
  };

  const getStatusBadge = (carrito) => {
    if (carrito.estado === "Disponible") {
      return (
        <Badge
          bg="success"
          className="bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 fw-normal"
        >
          Disponible
        </Badge>
      );
    }
    if (carrito.currentUser?.isMe) {
      return (
        <Badge
          bg="primary"
          className="bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 fw-normal"
        >
          En mi poder
        </Badge>
      );
    }
    return (
      <Badge
        bg="warning"
        className="bg-opacity-10 text-warning border border-warning border-opacity-25 rounded-pill px-3 fw-normal"
      >
        Ocupado
      </Badge>
    );
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaShoppingCart}
          title="Servicio de Carritos"
          badgeText="Residente"
          welcomeText="Consulta disponibilidad y solicita carritos de carga para tus mudanzas o compras."
        />

        <Row className="g-4 mb-5">
          <StatCard
            icon={FaShoppingCart}
            label="Total Flota"
            value={stats.total}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCheckCircle}
            label="Disponibles Ahora"
            value={stats.disponibles}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaUser}
            label="En mi Posesión"
            value={stats.miUso}
            colorClass="primary-theme"
          />
        </Row>

        <Card className="card-custom border-0 shadow-sm mb-5">
          <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                  <FaShoppingCart />
                </div>
                Carritos Disponibles
              </h5>
              <div style={{ width: "300px" }}>
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder="Buscar por código..."
                  colSize={{ search: 12, filter: 0 }}
                />
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-4">
            <MainTable
              headers={[
                "#",
                "Código",
                "Estado",
                "Información de Uso",
                "Acción",
              ]}
              isEmpty={paginatedData.length === 0}
              emptyMessage="No hay carritos registrados para tu condominio."
              emptyIcon={FaShoppingCart}
              paginationProps={{
                currentPage: currentPage,
                totalPages: totalPages,
                onPageChange: setCurrentPage,
                totalItems: filteredCarritos.length,
                itemsShowing: paginatedData.length,
              }}
            >
              {paginatedData.map((carrito, index) => {
                const actualIndex =
                  (currentPage - 1) * itemsPerPage + index + 1;
                const isMine = carrito.currentUser?.isMe;
                const isAvailable = carrito.estado === "Disponible";

                return (
                  <tr key={carrito.id} className="border-bottom border-light">
                    <td className="px-4 py-3 text-center">
                      <span className="text-secondary fw-bold">
                        {actualIndex.toString().padStart(2, "0")}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="fw-bold text-dark">{carrito.codigo}</div>
                    </td>
                    <td className="py-3">{getStatusBadge(carrito)}</td>
                    <td className="py-3">
                      {carrito.currentUser ? (
                        <div className="d-flex flex-column">
                          <span className="small fw-medium text-secondary">
                            {isMine
                              ? "Tú lo tienes"
                              : `Apto ${carrito.currentUser.aptoNumero}`}
                          </span>
                          {carrito.fine > 0 && (
                            <span className="x-small text-danger fw-bold">
                              Multa: S/. {carrito.fine.toFixed(2)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted small italic">
                          Libre para solicitar
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-end">
                      {isAvailable ? (
                        <Button
                          variant="primary"
                          className="btn-primary-theme btn-sm rounded-pill px-4"
                          onClick={() => handleRequest(carrito)}
                        >
                          <FaArrowCircleRight className="me-2" /> Solicitar
                        </Button>
                      ) : isMine ? (
                        <Button
                          variant="outline-primary"
                          className="btn-sm rounded-pill px-4"
                          onClick={() => handleReturn(carrito)}
                        >
                          <FaArrowCircleLeft className="me-2" /> Devolver
                        </Button>
                      ) : (
                        <Button
                          variant="light"
                          className="btn-sm rounded-pill px-4 text-muted border-0"
                          disabled
                        >
                          No disponible
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </MainTable>
          </Card.Body>
        </Card>

        {/* RECENT LOANS FOR MY APARTMENTS */}
        <section className="mb-5">
          <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
              <FaHistory />
            </div>
            Uso Reciente de mi Apartamento
          </h5>
          <Card className="card-custom border-0 shadow-sm overflow-hidden">
            <Card.Body className="p-0">
              <MainTable
                headers={[
                  "Carrito",
                  "Usuario",
                  "Solicitante",
                  "Salida",
                  "Retorno",
                  "Estado",
                ]}
                isEmpty={false}
                searchBar={null}
              >
                {[...logsPrestamos]
                  .filter((log) => myApartmentIds.includes(log.id_apartamento))
                  .sort(
                    (a, b) =>
                      new Date(b.fecha_entrada) - new Date(a.fecha_entrada),
                  )
                  .slice(0, 5)
                  .map((log) => {
                    const carrito = carritos.find(
                      (c) => c.id === log.id_carrito,
                    );
                    const user = log.id_usuario
                      ? usuarios.find((u) => u.id === log.id_usuario)
                      : null;
                    const inquilino = log.id_inquilino_temporal
                      ? inquilinos.find((i) => i.id === log.id_inquilino_temporal)
                      : null;
                    const isReturned = !!log.fecha_salida;

                    return (
                      <tr key={log.id} className="border-bottom border-light">
                        <td className="px-4 py-3">
                          <span className="fw-bold text-dark">
                            {carrito?.codigo || `C-${log.id_carrito}`}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="small text-secondary">
                            {user?.nombre || inquilino?.nombre || "Cargando..."}
                          </span>
                        </td>
                        <td className="py-3">
                          <Badge
                            bg="light"
                            className="text-dark border rounded-pill px-2 small"
                          >
                            {log.solicitante}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="x-small text-muted">
                            {new Date(log.fecha_entrada).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="x-small text-muted">
                            {isReturned
                              ? new Date(log.fecha_salida).toLocaleString()
                              : "---"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <Badge
                            bg={isReturned ? "success" : "warning"}
                            className="bg-opacity-10 text-dark border-0 rounded-pill px-3"
                          >
                            {isReturned ? "Devuelto" : "En uso"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
              </MainTable>
            </Card.Body>
          </Card>
        </section>
      </div>

      {/* REQUEST MODAL */}
      <Modal
        show={showRequestModal}
        onHide={() => setShowRequestModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-primary-theme">
            Solicitar Carrito
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Alert variant="info" className="rounded-4 border-0 small mb-4">
            <FaInfoCircle className="me-2" />
            Recuerda que tienes un tiempo máximo de{" "}
            <strong>{config?.tiempo_max_prestamo_min} minutos</strong>. Pasado
            este tiempo se aplicará una multa automática.
          </Alert>

          <div className="mb-4 text-center p-3 bg-light rounded-4">
            <div className="text-muted small mb-1">Carrito seleccionado</div>
            <div className="h4 fw-bold text-dark mb-0">
              {selectedCarrito?.codigo}
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold small text-secondary">
              ¿Para qué apartamento?
            </Form.Label>
            <Form.Select
              value={selectedApto}
              onChange={(e) => setSelectedApto(e.target.value)}
              className="rounded-pill border-light py-2 px-3"
            >
              <option value="">Seleccionar apartamento...</option>
              {myApartments.map((a) => (
                <option key={a.id} value={a.id}>
                  Apto {a.numero}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button
            variant="light"
            onClick={() => setShowRequestModal(false)}
            className="rounded-pill px-4"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={confirmRequest}
            disabled={!selectedApto}
            className="btn-primary-theme rounded-pill px-4"
          >
            Confirmar Pedido
          </Button>
        </Modal.Footer>
      </Modal>

      {/* RETURN MODAL */}
      <Modal
        show={showReturnModal}
        onHide={() => setShowReturnModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-primary-theme">
            Devolver Carrito
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="text-center py-3">
            <div className="p-4 bg-light rounded-circle d-inline-block mb-3 text-primary">
              <FaShoppingCart size={40} />
            </div>
            <h5 className="fw-bold text-dark">
              ¿Has terminado de usar el carrito {selectedCarrito?.codigo}?
            </h5>
            <p className="text-secondary small">
              Al confirmar, el carrito quedará disponible para otros residentes.
            </p>

            {selectedCarrito?.fine > 0 && (
              <div className="alert alert-danger rounded-4 border-0 d-flex align-items-center gap-3">
                <FaExclamationTriangle size={24} />
                <div className="text-start">
                  <div className="fw-bold">Multa por exceso de tiempo</div>
                  <div className="small">
                    Se ha generado un cargo de{" "}
                    <strong>S/. {selectedCarrito.fine.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0 d-flex gap-2">
          <Button
            variant="light"
            onClick={() => setShowReturnModal(false)}
            className="rounded-pill px-4 flex-grow-1"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={confirmReturn}
            className="btn-primary-theme rounded-pill px-4 flex-grow-1"
          >
            Confirmar Devolución
          </Button>
        </Modal.Footer>
      </Modal>
    </AnimatedPage>
  );
};

// Internal imports missing for the copy
import { Form } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";

export default PRCarritosPage;
