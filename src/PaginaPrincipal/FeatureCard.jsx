import { useState } from 'react';

const FeatureCard = ({ icon, title, text }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Estilos dinámicos para la tarjeta principal
  const cardStyle = {
    borderRadius: '18px',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: isHovered ? 'translateY(-15px) scale(1.03)' : 'translateY(0) scale(1)',
    boxShadow: isHovered 
      ? '0 15px 35px rgba(0, 86, 179, 0.2)' // Sombra con un toque azulado en hover
      : '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    height: '100%',
    backgroundColor: 'white'
  };

  return (
    <div 
      className="card border-0 p-2 text-dark" 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-body text-center">
        {/* Contenedor del Icono con los nuevos colores Azules */}
        <div 
          className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle" 
          style={{ 
            width: '60px', 
            height: '60px', 
            // CAMBIO: Azul al pasar el mouse, gris suave en reposo
            backgroundColor: isHovered ? '#0056b3' : '#f8f9fa',
            // CAMBIO: Icono blanco en hover, azul en reposo
            color: isHovered ? '#fff' : '#0056b3',
            transition: 'all 0.3s ease'
          }}
        >
          <i className={`bi ${icon} fs-2`}></i>
        </div>

        <h6 className="fw-bold mb-2">{title}</h6>
        <p className="small text-muted mb-0" style={{ lineHeight: '1.4' }}>
          {text}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;