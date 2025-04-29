/* eslint-disable react-refresh/only-export-components */
import { FaDownload } from 'react-icons/fa';
import Button from '../../ui/Button';
import InvoiceWrapper from './InvoiceStyles';
import ProductTotal from '../../features/shoppingCart/ProductTotal';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { getData, queryClient } from '../../api/requests';
import { useQuery } from '@tanstack/react-query';
import OrderSum from '../../features/checkout/OrderSum';
import { OrderItemType } from '../../dtos/orderDto';
import { usePDF } from 'react-to-pdf';

const Invoice = () => {
  const params = useLoaderData() as { orderNo: string };

  const { data } = useQuery({
    queryKey: ['fetchOrder', 'order', params.orderNo],
    queryFn: () => getData({ url: `/orders/${params.orderNo}` }),
  });

  const { order, orderItems } = data;

  const fileLabel =
    order.orderStatus === 'pending'
      ? `order-${order.orderNo}.pdf`
      : `invoice-${order.invoiceNo}.pdf`;

  const { toPDF, targetRef } = usePDF({ filename: fileLabel });

  return (
    <InvoiceWrapper>
      <div className='btn-box'>
        <Button
          btnText='download'
          //   wide='fit-content'
          icon={<FaDownload />}
          bg='var(--main-red-400)'
          color='var(--main-red-50)'
          onBtnTrigger={() => toPDF()}
        />
      </div>
      <div id='invoice' ref={targetRef}>
        <div className='invoice-header'>
          {order.orderStatus === 'pending' ? (
            <h2>
              Order No <span>{order.orderNo}</span>
            </h2>
          ) : (
            <h2>
              Invoice <span>{order.invoiceNo}</span>
            </h2>
          )}

          <div className='address'>
            <div className='billing'>
              <h5>Billing Address</h5>
              <p>{order.address}</p>
              <p>{order.state}</p>
              <p>{order.country}</p>
              <p></p>
            </div>
          </div>
        </div>

        {orderItems.map((item: OrderItemType) => (
          <OrderSum key={item._id} orderItem={item} />
        ))}

        <ProductTotal
          showHeader={false}
          marginTop='3rem'
          btnType='btn'
          isOrder={true}
          productTotal={{
            subtotal: order.subtotal,
            totalDiscount: order.discount,
          }}
        />
      </div>
    </InvoiceWrapper>
  );
};

export default Invoice;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['fetchOrder', 'order', params.orderNo],
    queryFn: () => getData({ url: `/orders/${params.orderNo}` }),
  });
  return params;
};
