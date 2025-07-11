/**
 * 🧪 API Connectivity Test Utility
 * Tests both localhost and 127.0.0.1 endpoints for development
 */

interface TestResult {
  endpoint: string;
  status: 'success' | 'error' | 'timeout';
  responseTime: number;
  error?: string;
}

interface ConnectivityTestResults {
  currentHost: string;
  preferredEndpoint: string;
  results: TestResult[];
}

/**
 * Test connectivity to both localhost and 127.0.0.1 backend endpoints
 */
export async function testBackendConnectivity(): Promise<ConnectivityTestResults> {
  const testEndpoints = [
    'http://localhost:8000/api/auth',
    'http://127.0.0.1:8000/api/auth'
  ];

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
  const results: TestResult[] = [];

  for (const endpoint of testEndpoints) {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${endpoint}/test`, {
        method: 'GET',
        signal: controller.signal,
        credentials: 'include'
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      results.push({
        endpoint,
        status: response.ok ? 'success' : 'error',
        responseTime,
        error: response.ok ? undefined : `HTTP ${response.status}`
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      if (error instanceof Error && error.name === 'AbortError') {
        results.push({
          endpoint,
          status: 'timeout',
          responseTime,
          error: 'Request timeout'
        });
      } else {
        results.push({
          endpoint,
          status: 'error',
          responseTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  // Determine preferred endpoint
  const successfulResults = results.filter(r => r.status === 'success');
  let preferredEndpoint = testEndpoints[0]; // default to localhost

  if (successfulResults.length > 0) {
    // Prefer the endpoint that matches current hostname
    const matchingHost = successfulResults.find(r => {
      const endpointHost = new URL(r.endpoint).hostname;
      return endpointHost === currentHost;
    });

    if (matchingHost) {
      preferredEndpoint = matchingHost.endpoint;
    } else {
      // Use the fastest responding endpoint
      preferredEndpoint = successfulResults.sort((a, b) => a.responseTime - b.responseTime)[0].endpoint;
    }
  }

  return {
    currentHost,
    preferredEndpoint,
    results
  };
}

/**
 * Get optimal backend URL based on current frontend hostname
 */
export function getOptimalBackendUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://127.0.0.1:8000'; // SSR fallback
  }

  const hostname = window.location.hostname;
  
  if (hostname === 'localhost') {
    return 'http://localhost:8000';
  } else if (hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000';
  } else {
    // Production or other environment
    return 'http://127.0.0.1:8000';
  }
}

/**
 * Test API health with automatic endpoint selection
 */
export async function testApiHealth(): Promise<{
  healthy: boolean;
  endpoint: string;
  responseTime: number;
  error?: string;
}> {
  const optimalUrl = getOptimalBackendUrl();
  const startTime = Date.now();

  try {
    const response = await fetch(`${optimalUrl}/health`, {
      method: 'GET',
      credentials: 'include'
    });

    const responseTime = Date.now() - startTime;

    return {
      healthy: response.ok,
      endpoint: optimalUrl,
      responseTime,
      error: response.ok ? undefined : `HTTP ${response.status}`
    };

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      healthy: false,
      endpoint: optimalUrl,
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Log connectivity test results to console
 */
export function logConnectivityResults(results: ConnectivityTestResults): void {
  console.group('🔍 Backend Connectivity Test Results');
  console.log(`Current Frontend Host: ${results.currentHost}`);
  console.log(`Preferred Backend Endpoint: ${results.preferredEndpoint}`);
  
  console.table(results.results.map(r => ({
    Endpoint: r.endpoint,
    Status: r.status,
    'Response Time (ms)': r.responseTime,
    Error: r.error || 'None'
  })));
  
  console.groupEnd();
}
