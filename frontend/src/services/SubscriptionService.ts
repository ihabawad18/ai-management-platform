type SubscribeParams<T> = {
  url: string;
  onMessage: (data: T | string) => void;
  onError?: (e: Event) => void;
};

const subscribeSSE = <T>({ url, onMessage, onError }: SubscribeParams<T>) => {
  const source = new EventSource(url);

  source.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      onMessage(parsed.data ?? parsed);
    } catch {
      onMessage(event.data);
    }
  };

  source.onerror = (e) => {
    source.close();
    onError?.(e);
  };

  return () => source.close();
};

export const subscribeDashboardMetrics = ({
  onMessage,
  onError,
}: Omit<SubscribeParams<unknown>, "url">) =>
  subscribeSSE({
    url: `${import.meta.env.VITE_BACKEND_URL ?? ""}/dashboard/metrics`,
    onMessage,
    onError,
  });

export { subscribeSSE };
