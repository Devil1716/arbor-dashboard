type MessageHandler = (data: any) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private handlers: Set<MessageHandler> = new Set();
  
  public onStatusChange?: (connected: boolean) => void;

  public connect(url: string) {
    if (this.url === url && this.ws?.readyState === WebSocket.OPEN) return;
    
    this.disconnect();
    this.url = url;
    this.initWs();
  }

  private initWs() {
    if (!this.url) return;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.onStatusChange?.(true);
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket Disconnected');
        this.onStatusChange?.(false);
        this.ws = null;
        
        // Auto reconnect after 3 seconds
        if (this.url && !this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.initWs();
          }, 3000);
        }
      };

      this.ws.onerror = (err) => {
        console.error('WebSocket Error:', err);
        // onclose will fire and handle reconnect
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handlers.forEach(h => h(data));
        } catch (e) {
          console.warn('Received non-JSON websocket message:', event.data);
        }
      };
    } catch (err) {
      console.error('WebSocket Init Error:', err);
    }
  }

  public disconnect() {
    this.url = null;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.onclose = null; // Prevent auto-reconnect
      this.ws.close();
      this.ws = null;
    }
    this.onStatusChange?.(false);
  }

  public send(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    } else {
      console.warn('Cannot send, WebSocket is not connected');
    }
  }

  public addHandler(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }
}

export const wsService = new WebSocketService();
