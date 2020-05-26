import React, { FC, useCallback } from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import { useQuery } from "react-query";

import { getOrders } from "../data/orders";
import OrderStatusBadge from "./OrderStatusBadge";
import Amount from "./Amount";

export const OrdersContainer: FC<RouteComponentProps> = (props) => {
  const { data: orders = [], status, refetch } = useQuery("orders", getOrders);
  const refreshOrders = useCallback(
    async (e) => {
      await refetch({ force: true });

      e.detail.complete();
    },
    [refetch]
  );

  if (status === "loading") {
    return <IonLoading isOpen message="Loading orders..." />;
  }

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={refreshOrders}>
        <IonRefresherContent />
      </IonRefresher>
      <IonList>
        {orders.map((order) => (
          <IonItem button onClick={() => props.history.push('/orders/' + order.id)}>
            <IonLabel>
              <h1>Order #{order.id}</h1>
              <IonNote>
                {order.orderItems.length} items &bull;{" "}
                <Amount amount={order.total} />
              </IonNote>
            </IonLabel>
            <OrderStatusBadge status={order.status} slot="end" />
          </IonItem>
        ))}
      </IonList>
    </>
  );
};

export default OrdersContainer;
