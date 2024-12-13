import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Avatar,
  Checkbox,
  Table,
  Tag,
  Tooltip,
  Spin,
  Statistic,
  Col,
  Flex,
  Button,
  Form,
  Select,
  Input,
} from "antd";
import {
  getStatusColor,
  mapHexToColorName,
  mapSizesToStock,
  Orderstatus,
} from "../Constant/const";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../feature/Order/orderSlice";
import CountUp from "react-countup";
import EditOrderStatus from "./EditOrderStatus";

const OrderTable = () => {
  const { orders } = useSelector((state) => state.order);
  const { userinfo } = useSelector((state) => state.auth);
  const [editTableRow, setEditTableRow] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const dispatch = useDispatch();

  const [filters, setfilters] = useState([]);

  useEffect(() => {
    const filterParams = { Productseller: "6721646877f6615f728e145a" };
    dispatch(fetchOrders(filterParams));

    if (orders.length > 0) {
      setfilters(createFilters(orders));
    }
  }, [dispatch]);

  const createFilters = useCallback((data) => {
    const uniqueProductNames = [];
    data.forEach((order) => {
      order.items.forEach((item) => {
        if (!uniqueProductNames.includes(item.product.name)) {
          uniqueProductNames.push(item.product.name);
        }
      });
    });

    return uniqueProductNames.map((name) => ({
      text: name,
      value: name,
    }));
  }, []);

  const transformOrderStatus = (list) => {
    return list.map(({ value, label }) => ({
      text: label,
      value,
    }));
  };

  const handleSelectedRow = (order) => {
    setEditTableRow(true);
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const baseColumns = [
    {
      title: "Order Items",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <>
          <Avatar.Group
            max={{
              count: 3,
            }}
            size={48}
          >
            {items.map(({ product, quantity, color, size, price }) => (
              <Tooltip
                key={product._id}
                title={
                  <p>
                    Name: {product.name}
                    <br />
                    Price: ${price}
                    <br />
                    Color: {mapHexToColorName(color)}
                    <br />
                    Size: {size}
                    <br />
                    Quantity: {quantity}
                  </p>
                }
              >
                <Avatar
                  style={{
                    backgroundColor: product.color,
                  }}
                  size={48}
                  src={product?.images[0]}
                />
              </Tooltip>
            ))}
          </Avatar.Group>
        </>
      ),
      filters: createFilters(orders),
      filterSearch: true,
      width: "20%",
      onFilter: (value, record) =>
        record.items.some((item) => item.product.name.includes(value)),
      sorter: (a, b) => a.items.length - b.items.length,
      sortDirections: ["descend"],
    },
    {
      title: "Customer Info",
      dataIndex: "user",
      key: "user",
      render: (customer) => (
        <>
          <p>
            {customer.firstName}, {customer.lastName}
          </p>
        </>
      ),
    },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      render: (address) => (
        <div>
          <p>{address.street}</p>
          <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
          <p>{address.country}</p>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        console.log("status", record);

        if (editTableRow === record._id) {
          return (
            <Form.Item
              name="status"
              rules={[{ required: true, message: "Please select status!" }]}
            >
              <Select
                defaultValue={record?.status}
                options={Orderstatus}
                style={{ width: 120 }}
              ></Select>
            </Form.Item>
          );
        } else {
          return (
            <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
          );
        }
      },
      filters: transformOrderStatus(Orderstatus),
      filterSearch: true,
      width: "20%",
      onFilter: (value, record) => {
        return record.status === value
      },
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `$${amount}`,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Placed At",
      dataIndex: "placedAt",
      key: "placedAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button onClick={() => handleSelectedRow(record)}>Edit</Button>
        </>
      ),
    },
  ];

  const DragIndexContext = createContext({
    active: -1,
    over: -1,
  });

  const dragActiveStyle = (dragState, id) => {
    const { active, over, direction } = dragState;
    let style = {};
    if (active && active === id) {
      style = {
        backgroundColor: "gray",
        opacity: 0.5,
      };
    } else if (over && id === over && active !== over) {
      style =
        direction === "right"
          ? { borderRight: "1px dashed gray" }
          : { borderLeft: "1px dashed gray" };
    }
    return style;
  };

  const TableBodyCell = (props) => {
    const dragState = useContext(DragIndexContext);
    return (
      <td
        {...props}
        style={{
          ...props.style,
          ...dragActiveStyle(dragState, props.id),
        }}
      />
    );
  };

  const TableHeaderCell = (props) => {
    const dragState = useContext(DragIndexContext);
    const { attributes, listeners, setNodeRef, isDragging } = useSortable({
      id: props.id,
    });
    const style = {
      ...props.style,
      cursor: "move",
      ...(isDragging
        ? {
            position: "relative",
            zIndex: 9999,
            userSelect: "none",
          }
        : {}),
      ...dragActiveStyle(dragState, props.id),
    };

    return (
      <th
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    );
  };

  const [dragIndex, setDragIndex] = useState({
    active: -1,
    over: -1,
  });

  const [columns, setColumns] = useState(() =>
    baseColumns.map((column, i) => ({
      ...column,
      key: `${i}`,
      onHeaderCell: () => ({
        id: `${i}`,
      }),
      onCell: () => ({
        id: `${i}`,
      }),
    }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setColumns((prevState) => {
        const activeIndex = prevState.findIndex((i) => i.key === active?.id);
        const overIndex = prevState.findIndex((i) => i.key === over?.id);
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
    setDragIndex({
      active: -1,
      over: -1,
    });
  };

  const onDragOver = ({ active, over }) => {
    const activeIndex = columns.findIndex((i) => i.key === active.id);
    const overIndex = columns.findIndex((i) => i.key === over?.id);
    setDragIndex({
      active: active.id,
      over: over?.id,
      direction: overIndex > activeIndex ? "right" : "left",
    });
  };

  const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));

  const newColumns = columns.map((item) => ({
    ...item,
    hidden: !checkedList.includes(item.key),
  }));

  if (orders.length === 0) {
    return <Spin size="large" tip="Loading..." />;
  }
  function calculateTotalOrderPrice(orders) {
    if (!Array.isArray(orders)) {
      throw new Error("Invalid input: orders must be an array");
    }

    return orders.reduce((total, order) => total + order.totalAmount, 0);
  }

  const formatter = (value) => <CountUp end={value} separator="," />;

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleUpdate = (orderId, status) => {
    console.log("fkkdfnkMayank", orderId, status);
    dispatch(updateOrderStatus({ orderId, status }))
      .unwrap()
      .then((response) => {
        console.log("Order status updated:", response);
      })
      .catch((error) => {
        console.error("Failed to update order status:", error);
      });
  };

  return (
    <>
      <Flex justify="end" gap={"large"}>
        <Statistic
          title="Account Balance"
          value={calculateTotalOrderPrice(orders)}
          precision={2}
          formatter={formatter}
          prefix={"$"}
        />
      </Flex>

      <Checkbox.Group
        value={checkedList}
        options={options}
        onChange={(value) => {
          setCheckedList(value);
        }}
      />
      <DndContext
        sensors={sensors}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={newColumns.map((i) => i.key)}
          strategy={horizontalListSortingStrategy}
        >
          <DragIndexContext.Provider value={dragIndex}>
            <Form>
              <Table
                rowKey="key"
                columns={newColumns}
                dataSource={orders}
                size="small"
                components={{
                  header: {
                    cell: TableHeaderCell,
                  },
                  body: {
                    cell: TableBodyCell,
                  },
                }}
                pagination={{
                  defaultPageSize: 5,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "30"],
                }}
              />
            </Form>
          </DragIndexContext.Provider>
        </SortableContext>
        <DragOverlay>
          <th
            style={{
              backgroundColor: "gray",
              padding: 16,
            }}
          >
            {
              columns[columns.findIndex((i) => i.key === dragIndex.active)]
                ?.title
            }
          </th>
        </DragOverlay>
      </DndContext>

      {editTableRow && (
        <EditOrderStatus
          open={isModalVisible}
          onClose={handleModalClose}
          onUpdate={handleUpdate}
          product={selectedOrder}
        />
      )}
    </>
  );
};

export default OrderTable;
