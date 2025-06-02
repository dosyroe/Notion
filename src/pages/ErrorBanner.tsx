import React from 'react';
import styles from './ErrorBanner.module.css';


import { useEffect, useState } from 'react';

interface ErrorBannerProps {
  message?: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => {
  // message может быть строкой с разделителем или пустой
  const messages = React.useMemo(() => (message ? message.split(' | ') : []), [message]);

  // Показываем по две ошибки одновременно, но каждую в отдельном блоке с анимацией появления/ухода
  const [visible, setVisible] = useState<{ msg: string; id: number }[]>([]);
  const [queue, setQueue] = useState<{ msg: string; id: number }[]>([]);
  const [nextId, setNextId] = useState(0);

  // При изменении messages — формируем очередь
  useEffect(() => {
    if (messages.length > 0) {
      const arr = messages.map((msg, i) => ({ msg, id: nextId + i }));
      setQueue(arr);
      setNextId(nextId + messages.length);
    } else {
      setQueue([]);
      setVisible([]);
    }
    // eslint-disable-next-line
  }, [message]);

  // Управляем показом по две ошибки
  useEffect(() => {
    if (queue.length === 0 && visible.length === 0) return;
    if (visible.length < 2 && queue.length > 0) {
      setVisible(v => [...v, queue[0]]);
      setQueue(q => q.slice(1));
    }
    if (visible.length > 0) {
      const timer = setTimeout(() => {
        setVisible(v => v.slice(1));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [queue, visible]);

  if (visible.length === 0) return null;
  return (
    <div className={styles.banner + ' ' + styles['banner-show']}>
      {visible.map(({ msg, id }) => (
        <div key={id} className={styles['banner-item']}>
          {msg}
        </div>
      ))}
    </div>
  );
};

export default ErrorBanner;
