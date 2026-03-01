import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDate = (date: string): string => dayjs(date).format('YYYY-MM-DD');

export const formatDateTime = (date: string): string => dayjs(date).format('YYYY-MM-DD HH:mm');

export const fromNow = (date: string): string => dayjs(date).fromNow();
