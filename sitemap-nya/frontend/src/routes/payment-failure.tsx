import { createFileRoute } from '@tanstack/react-router';
import PaymentFailurePage from '@/pages/PaymentFailurePage';

export const Route = createFileRoute('/payment-failure')({
  component: PaymentFailurePage,
});
