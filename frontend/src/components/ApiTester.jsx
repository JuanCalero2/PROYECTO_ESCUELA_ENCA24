import React, { useState } from 'react';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from '../config';

const ApiTester = () => {
    const [testResults, setTestResults] = useState({});
    const [loading, setLoading] = useState(false);

    const testEndpoint = async (name, endpoint) => {
        setLoading(true);
        try {
            console.log(`🧪 Probando endpoint: ${name}`);
            console.log(`🔗 URL: ${buildApiUrl(endpoint)}`);
            
            const response = await fetch(buildApiUrl(endpoint), {
                method: 'GET',
                headers: getAuthHeaders()
            });

            const result = {
                status: response.status,
                statusText: response.statusText,
                url: response.url,
                ok: response.ok
            };

            if (response.ok) {
                try {
                    const data = await response.json();
                    result.data = data;
                    result.success = true;
                } catch (parseError) {
                    result.parseError = parseError.message;
                    result.success = false;
                }
            } else {
                try {
                    const errorData = await response.json();
                    result.error = errorData;
                } catch (parseError) {
                    result.parseError = parseError.message;
                }
                result.success = false;
            }

            setTestResults(prev => ({
                ...prev,
                [name]: result
            }));

            console.log(`✅ Resultado de ${name}:`, result);
        } catch (error) {
            const result = {
                error: error.message,
                success: false
            };
            setTestResults(prev => ({
                ...prev,
                [name]: result
            }));
            console.error(`❌ Error en ${name}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const testAllEndpoints = async () => {
        setTestResults({});
        
        // Test endpoints de estudiantes
        await testEndpoint('Estudiantes GET', API_CONFIG.ESTUDIANTES.GET_ALL);
        
        // Test endpoints de profesores
        await testEndpoint('Profesores GET', API_CONFIG.PROFESORES.GET_ALL);
        
        // Test endpoint de autenticación (sin token)
        await testEndpoint('Auth Status', '/auth/status/');
    };

    return (
        <div className="api-tester" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>🧪 Probador de API</h2>
            <p>Este componente te ayuda a probar la conectividad con diferentes endpoints</p>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={testAllEndpoints} 
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? '🔄 Probando...' : '🧪 Probar Todos los Endpoints'}
                </button>
            </div>

            {Object.entries(testResults).map(([name, result]) => (
                <div 
                    key={name} 
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        padding: '15px',
                        marginBottom: '10px',
                        backgroundColor: result.success ? '#d4edda' : '#f8d7da'
                    }}
                >
                    <h3 style={{ margin: '0 0 10px 0', color: result.success ? '#155724' : '#721c24' }}>
                        {name} {result.success ? '✅' : '❌'}
                    </h3>
                    
                    <div style={{ fontSize: '14px' }}>
                        <p><strong>Status:</strong> {result.status} {result.statusText}</p>
                        <p><strong>URL:</strong> {result.url}</p>
                        
                        {result.success && result.data && (
                            <div>
                                <strong>Datos:</strong>
                                <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '3px' }}>
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            </div>
                        )}
                        
                        {!result.success && result.error && (
                            <div>
                                <strong>Error:</strong>
                                <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '3px' }}>
                                    {JSON.stringify(result.error, null, 2)}
                                </pre>
                            </div>
                        )}
                        
                        {result.parseError && (
                            <p><strong>Error de parsing:</strong> {result.parseError}</p>
                        )}
                    </div>
                </div>
            ))}

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
                <h4>📋 Instrucciones:</h4>
                <ul>
                    <li>Haz clic en "Probar Todos los Endpoints" para verificar la conectividad</li>
                    <li>Verifica que el backend esté corriendo en <code>http://127.0.0.1:8000</code></li>
                    <li>Si hay errores 500, el problema está en el backend Python</li>
                    <li>Si hay errores de conexión, verifica la URL del backend</li>
                </ul>
            </div>
        </div>
    );
};

export default ApiTester;
