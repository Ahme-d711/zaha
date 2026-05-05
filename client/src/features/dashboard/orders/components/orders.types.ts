export interface OrderStatusFormState {
  status: string;
}

export const defaultOrderStatusFormState: OrderStatusFormState = {
  status: "PENDING",
};

export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-emerald-500/10 text-emerald-500";
    case "PROCESSING":
      return "bg-blue-500/10 text-blue-500";
    case "SHIPPED":
      return "bg-violet-500/10 text-violet-500";
    case "CANCELLED":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};
