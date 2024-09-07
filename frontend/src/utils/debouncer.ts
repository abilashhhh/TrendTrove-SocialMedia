function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T & { cancel: () => void } {
    let timeoutId: NodeJS.Timeout;
  
    const debounced = function(this: any, ...args: Parameters<T>) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    } as T & { cancel: () => void };
  
    debounced.cancel = () => {
      clearTimeout(timeoutId);
    };
  
    return debounced;
  }
  
  export default debounce;
  