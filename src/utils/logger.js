export function logInfo(message, data = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`INFO: ${message}`, data);
    }
    
    // In a real application, you might want to send logs to a server or service
    // For example, using a cloud logging service
  }
  
  export function logError(message, data = {}) {
    console.error(`ERROR: ${message}`, data);
    
    // In a real application, you'd want to handle errors more robustly
    // such as sending them to an error tracking service
  }
  
  export function logWarning(message, data = {}) {
    console.warn(`WARNING: ${message}`, data);
  }