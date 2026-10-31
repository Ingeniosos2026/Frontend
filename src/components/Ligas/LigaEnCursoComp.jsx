import { Container, Card, Spinner, Alert, Table, Row, Col, Badge } from 'react-bootstrap';

const LigaEnCursoComp = ({ 
    cargando, 
    tablaLiga, 
    fixtureLiga, 
    mensajeError, 
    partidosEnCurso, 
    partidosFinalizados, 
    miUsuarioId,
    esCreador
}) => {
    
    if (cargando) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
                <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
            </div>
        );
    }

    return (
        <div className="min-vh-100 py-5" style={{ backgroundColor: '#f0f2f5' }}>
            <Container>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-uppercase" style={{ color: '#0d6efd' }}>Desarrollo de la Liga</h2>
                </div>

                {mensajeError && (
                    <Alert variant="danger" className="shadow-sm d-flex align-items-center mb-4">
                        <span className="me-2 fs-5">⚠️</span>
                        {mensajeError}
                    </Alert>
                )}

                <Row className="g-4">
                    {/* COLUMNA IZQUIERDA: TABLA DE POSICIONES */}
                    <Col lg={7}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Header className="bg-primary text-white fw-bold">
                                🏆 Tabla de Posiciones
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Table responsive hover striped className="mb-0 align-middle">
                                    <thead className="bg-light">
                                        <tr className="text-center text-muted small">
                                            <th className="text-start ps-3">CLUB</th>
                                            <th>PTS</th>
                                            <th>PG</th>
                                            <th>PE</th>
                                            <th>PP</th>
                                            <th>GF</th>
                                            <th>GC</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tablaLiga.map((fila, index) => (
                                            <tr key={index} className="text-center fw-semibold">
                                                <td className="text-start ps-3 fw-bold">{fila.club}</td>
                                                <td className="text-primary fs-5">{fila.puntos}</td>
                                                <td>{fila.partidos_ganados}</td>
                                                <td>{fila.partidos_empatados}</td>
                                                <td>{fila.partidos_perdidos}</td>
                                                <td>{fila.goles_a_favor}</td>
                                                <td>{fila.goles_en_contra}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {tablaLiga.length === 0 && (
                                    <div className="text-center p-4 text-muted">No hay datos en la tabla.</div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* COLUMNA DERECHA: FIXTURE */}
                    <Col lg={5}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Header className="bg-dark text-white fw-bold">
                                📅 Fixture Oficial
                            </Card.Header>
                            <Card.Body className="p-3" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                {fixtureLiga.map((partido, index) => {
                                    const enCurso = partidosEnCurso.has(partido.partido_id);
                                    const finalizado = partidosFinalizados.has(partido.partido_id);
                                    const meTocaJugar = partido.usuario_id_izq === miUsuarioId || partido.usuario_id_der === miUsuarioId;

                                    return (
                                        <Card 
                                            key={index} 
                                            className={`mb-3 border-start border-4 ${meTocaJugar ? 'border-primary shadow-sm' : 'border-secondary'}`}
                                        >
                                            <Card.Body className="p-3">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="small text-muted fw-bold">Partido #{partido.partido_id}</span>
                                                    {enCurso && <Badge bg="success" className="pulse-animation">En Curso</Badge>}
                                                    {finalizado && <Badge bg="secondary">Finalizado</Badge>}
                                                    {!enCurso && !finalizado && <Badge bg="light" text="dark" className="border">Pendiente</Badge>}
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center fs-5 fw-bold">
                                                    <span className={partido.usuario_id_izq === miUsuarioId ? 'text-primary' : ''}>
                                                        {partido.club_izq}
                                                    </span>
                                                    
                                                    {finalizado && partido.goles_izq !== undefined && partido.goles_der !== undefined ? (
                                                        <span className="bg-dark text-white px-3 py-1 rounded fs-4 shadow-sm">
                                                            {partido.goles_izq} - {partido.goles_der}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted mx-2 fs-6">VS</span>
                                                    )}

                                                    <span className={partido.usuario_id_der === miUsuarioId ? 'text-primary' : ''}>
                                                        {partido.club_der}
                                                    </span>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                                {fixtureLiga.length === 0 && (
                                    <div className="text-center p-4 text-muted">El fixture aún no está disponible.</div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LigaEnCursoComp;