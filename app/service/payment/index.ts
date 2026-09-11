import { FETCH_API } from "../LocalhostService";

const EndPoints = {
  payment: "payment",
};

export interface CreatePaymentPayload {
  zoneId: string;
  price: number;
  quantity: number;
}

export interface PaymentData {
  order: string;
  _id: string;
  quantity: number;
  total: number;
  status: string;
  payWayUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  data: PaymentData;
}

export const CREATE_PAYMENT = async (
  payload: CreatePaymentPayload,
): Promise<any> => {
  return FETCH_API(`${EndPoints.payment}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const GET_PAYMENT_STATUS = async (orderId: string): Promise<any> => {
  return FETCH_API(`${EndPoints.payment}/${orderId}`);
};

export const GET_PAYMENTS = async (): Promise<any> => {
  return FETCH_API(`${EndPoints.payment}`);
};

export const UPDATE_PAYMENT_STATUS = async (
  order: string,
  status: "PENDING" | "COMPLETED" | "FAILED" | "EXPIRED" = "COMPLETED",
): Promise<any> => {
  return FETCH_API(`${EndPoints.payment}/${order}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};
